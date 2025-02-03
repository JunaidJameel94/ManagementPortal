using ManagementPortalApi.Context;
using ManagementPortalApp.Models;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Reflection;

namespace ManagementPortalApi.Models
{
    public class FTPRssFeedService : IHostedService, IDisposable
    {
        private readonly ILogger<FTPRssFeedService> _logger;
        private Timer _timer;
        private static string varFtp;
        private static string varUid;
        private static string varPwd;
        private static DataTable sortedtable1 = null;
        private readonly DataAccessLayer _DAL;

        public FTPRssFeedService(ILogger<FTPRssFeedService> logger, DataAccessLayer DAL)
        {
            _logger = logger;
            _DAL = DAL;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("News Download Service started.");
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(15)); // Run every 10 minutes
            return Task.CompletedTask;
        }

        private void FetchFtpCredentials(int sourceId)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Add("SourceID-INT", sourceId.ToString());
                dt = _DAL.GetData("sp_getFtpCredentials", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    // Assign fetched credentials to static variables
                    varFtp = dt.Rows[0]["FeedURL"].ToString() ;
                    varUid = dt.Rows[0]["varUid"].ToString();
                    varPwd = dt.Rows[0]["varPwd"].ToString();
                    _logger.LogInformation($"Fetched FTP credentials: URL: {varFtp}, User: {varUid}");
                }
                else
                {
                    _logger.LogWarning($"No active FTP credentials found for SourceID: {sourceId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching FTP credentials: {ex.Message}");
            }
        }

        private void DoWork(object state)
        {
            _logger.LogInformation("RSS Feed Service is working.");
            FetchFtpCredentials(17); // Assuming source_id is 17

            if (!string.IsNullOrEmpty(varFtp) && !string.IsNullOrEmpty(varUid) && !string.IsNullOrEmpty(varPwd))
            {
                ShowDirectory();

                // Initialize the WebClient only once and set credentials
                using (WebClient ftpClient = new WebClient())
                {
                    ftpClient.Credentials = new NetworkCredential(varUid, varPwd);
                    DownloadNews(ftpClient);
                }
            }
            else
            {
                _logger.LogError("FTP credentials are invalid.");
            }

            _logger.LogInformation("RSS Feed Service completed.");
        }
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RSS Feed Service is stopping.");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private void ShowDirectory()
        {
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(varFtp + "/english/");
                request.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.KeepAlive = false;
                request.UseBinary = true;
                request.UsePassive = true;

                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                using (Stream responseStream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(responseStream))
                {
                    DataTable table = new DataTable();
                    table.Columns.Add("Date");
                    table.Columns.Add("Time");
                    table.Columns.Add("DateTime");
                    table.Columns.Add("ID");
                    table.Columns.Add("Title");

                    while (!reader.EndOfStream)
                    {
                        var line = reader.ReadLine();
                        string[] details = line.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                        string varTitle = line.Replace(details[0], "").Replace(details[1], "").Replace(details[2], "").Trim();

                        DataRow NewRow = table.NewRow();
                        NewRow["Date"] = details[0];
                        NewRow["Time"] = details[1];
                        NewRow["DateTime"] = details[0] + " " + details[1];
                        NewRow["ID"] = details[2];
                        NewRow["Title"] = varTitle;
                        table.Rows.Add(NewRow);
                    }

                    DataView dv = table.DefaultView;
                    dv.Sort = "DateTime desc";
                    sortedtable1 = dv.ToTable(); // Assign the sorted table to sortedtable1
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error listing directory: {ex.Message}");
            }
        }

        private void DownloadNews(WebClient ftpClient)
        {
            try
            {
                if (sortedtable1 == null || sortedtable1.Rows.Count == 0)
                {
                    _logger.LogInformation("No data available to process.");
                    return;
                }

                foreach (DataRow row in sortedtable1.Rows)
                {

                    string Title = row["Title"].ToString();
                    string ftpPath = varFtp + "/english/" + Title;
                    string newsContent = ftpClient.DownloadString(ftpPath);

                    string[] lines = newsContent.Split(new[] { Environment.NewLine }, StringSplitOptions.None);
                    if (lines.Length > 0 && lines[0].ToUpper().Contains("BUSINESS"))
                    {
                        string category = lines[0].Split('/')[1].Trim();
                        string heading = lines[1];
                        string description = string.Join(" ", lines, 2, lines.Length - 2);

                        string imagePath = DownloadImage(row["ID"].ToString(), ftpClient); // Pass ftpClient to the image download

                        NewsModel news = new NewsModel
                        {
                            DateTime = Convert.ToDateTime(row["DateTime"]),
                            FileName = Title,
                            Category = category,
                            Heading = heading,
                            Description = description,
                            ImagePath = imagePath
                        };

                        InsertNewsIntoDatabase(news, 17);
                    }
                }
            }
            catch (WebException e)
            {
                _logger.LogError($"Web Error: {e.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
            }
        }

        private bool FileExists(string filePath)
        {
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(filePath);
                request.Method = WebRequestMethods.Ftp.GetFileSize;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.UsePassive = true;
                request.UseBinary = true;
                request.KeepAlive = false;

                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                {
                    return true; // File exists
                }
            }
            catch (WebException ex)
            {
                if (ex.Response != null && ((FtpWebResponse)ex.Response).StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                {
                    return false; // File does not exist
                }
                throw; // Rethrow other exceptions
            }
        }


        private string DownloadImage(string imageName, WebClient ftpClient)
        {
            var imageDirectory = Environment.GetEnvironmentVariable("RssAPPImage");

            if (string.IsNullOrEmpty(imageDirectory))
            {
                _logger.LogError("Image directory environment variable 'RssAPPImage' is not set.");
                return string.Empty;
            }

            if (!Directory.Exists(imageDirectory))
            {
                Directory.CreateDirectory(imageDirectory);
                _logger.LogInformation($"Image directory created at: {imageDirectory}");
            }
            
            string remotePath = varFtp + "/photo/" + imageName;
            string localPath = Path.Combine(imageDirectory, imageName);

            try
            {
                if (FileExists(remotePath))
                {
                    if (!File.Exists(localPath))
                    {
                        ftpClient.DownloadFile(remotePath, localPath);
                        _logger.LogInformation($"Image downloaded successfully: {imageName}");
                    }
                    else
                    {
                        _logger.LogInformation($"Image already exists: {localPath}");
                    }
                }
                else
                {
                    _logger.LogWarning($"File not found: {remotePath}");
                }
            }
            catch (WebException ex)
            {
                _logger.LogError($"Error downloading image: {imageName}. Exception: {ex.Message}");
                return string.Empty;
            }

            return localPath;
        }

        private void InsertNewsIntoDatabase(NewsModel news, int sourceId)
        {
            try
            {
                // Create NameValueCollection to pass parameters
                NameValueCollection nv = new NameValueCollection();

                nv.Add("Title-NVARCHAR", news.Heading);
                nv.Add("Link-NVARCHAR", "-"); 
                nv.Add("Description-NVARCHAR", news.Heading);
                nv.Add("PublicationDate-DATETIME", news.DateTime.ToString("yyyy-MM-dd HH:mm:ss"));
                nv.Add("Author-NVARCHAR", DBNull.Value.ToString()); 
                nv.Add("Content-NVARCHAR", news.Description);
                nv.Add("Category-NVARCHAR", news.Category);
                nv.Add("ImageURL-NVARCHAR", news.ImagePath);
                nv.Add("Source-NVARCHAR", "APP");
                nv.Add("GUID-NVARCHAR", news.FileName);
                nv.Add("FeedURL-NVARCHAR", varFtp);
                nv.Add("Tags-NVARCHAR", DBNull.Value.ToString()); 
                nv.Add("Language-NVARCHAR", "en");
                nv.Add("CommentsURL-NVARCHAR", DBNull.Value.ToString()); 
                nv.Add("MediaContentURL-NVARCHAR", DBNull.Value.ToString()); 
                nv.Add("FetchDate-DATETIME", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                nv.Add("LocalImagePath-NVARCHAR", news.ImagePath);
                nv.Add("SourceId-INT", sourceId.ToString());

                // Call the DAL method to execute the stored procedure
                _DAL.InsertData("sp_insertRSSFeed", nv, _DAL.CSManagementPortalDatabase);

                _logger.LogInformation("RSS feed data inserted/updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inserting RSS feed data into the database: {ex.Message}");
            }
        }

    }
    public class NewsModel
    {
        public DateTime DateTime { get; set; }
        public string FileName { get; set; }
        public string Category { get; set; }
        public string Heading { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
    }
}

