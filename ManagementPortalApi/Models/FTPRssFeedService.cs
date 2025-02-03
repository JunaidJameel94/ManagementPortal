using ManagementPortalApi.Context;
using System.Collections.Specialized;
using System.Data;
using System.Net;

namespace ManagementPortalApi.Models
{
    public class FTPRssFeedService : IHostedService, IDisposable
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<FTPRssFeedService> _logger;
        private Timer _timer;
        private static string varFtp;
        private static string varUid;
        private static string varPwd;
        private static DataTable sortedtable1 = null;
        private readonly DataAccessLayer _DAL;

        public FTPRssFeedService(ILogger<FTPRssFeedService> logger, DataAccessLayer DAL, IWebHostEnvironment env)
        {
            _logger = logger;
            _DAL = DAL;
            _env = env;
        }
        
        public Task StartAsync(CancellationToken cancellationToken)
        {
            StartConnection(17);
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
            return Task.CompletedTask;
        }

        private void StartConnection(int sourceID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Add("SourceID-INT", sourceID.ToString());
                dt = _DAL.GetData("sp_getFtpCredentials", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    varFtp = dt.Rows[0]["FeedURL"].ToString();
                    varUid = dt.Rows[0]["varUid"].ToString();
                    varPwd = dt.Rows[0]["varPwd"].ToString();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching FTP credentials: {ex.Message}");
            }
        }

        private void DoWork(object state)
        {
            DownloadNews();
            DownloadNewsImage();
        }

        #region FTP English Directory News Without Image

        private async void DownloadNews()
        {
            try
            {
                string ftpNewsDirectory = $"{varFtp}/english";
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpNewsDirectory);
                request.Method = WebRequestMethods.Ftp.ListDirectory;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.KeepAlive = true;

                string[] newsFiles;

                using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                {
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        string fileList = await reader.ReadToEndAsync();
                        newsFiles = fileList.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
                    }
                }
                foreach (var newsFile in newsFiles)
                {
                    string newscontent = string.Empty;
                    string newsFilePath = $"{ftpNewsDirectory}/{newsFile}";
                    request = (FtpWebRequest)WebRequest.Create(newsFilePath);
                    request.Method = WebRequestMethods.Ftp.DownloadFile;
                    request.Credentials = new NetworkCredential(varUid, varPwd);
                    request.KeepAlive = true;
                    using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                    {
                        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                        {
                            newscontent = await reader.ReadToEndAsync();
                        }
                    }
                    if (!string.IsNullOrEmpty(newscontent))
                    {
                        NewsModel newsModel = ProcessDownloadedNewsContent(newscontent, newsFile);
                        
                        InsertNewsIntoDatabase(newsModel,17);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error downloading news: {ex.Message}");
            }
        }

        private NewsModel ProcessDownloadedNewsContent(string content,string filename)
        {
            NewsModel ob = new NewsModel();
            try
            {
                var lines = content.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
                if (lines.Length >= 3)
                {
                    string title = lines[1];
                    string mainContent = string.Join(Environment.NewLine, lines.Skip(2));
                    ob.DateTime = DateTime.Now;
                    ob.Heading = title;
                    ob.FileName = filename;
                    ob.Description = mainContent;
                    ob.ImagePath = null; 
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing news content: {ex.Message}");
            }
            return ob;
        }

        #endregion

        #region FTP Photo Directory News With Image
        private async void DownloadNewsImage()
        {
            try
            {
                string ftpNewsImageDirectory = $"{varFtp}/photo";
                string localImageDirectory = Environment.GetEnvironmentVariable("RssAPPImage");

                // Ensure the local directory exists
                if (!Directory.Exists(localImageDirectory))
                {
                    Directory.CreateDirectory(localImageDirectory);
                }

                // List files in the FTP directory
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpNewsImageDirectory);
                request.Method = WebRequestMethods.Ftp.ListDirectory;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.KeepAlive = true;

                string[] newsFiles;
                using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    string fileList = await reader.ReadToEndAsync();
                    newsFiles = fileList.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
                }

                foreach (var newsFile in newsFiles.Where(x => x.Contains(".txt")).ToArray())
                {
                    string newscontent = string.Empty;
                    string newsFilePath = $"{ftpNewsImageDirectory}/{newsFile}";
                    request = (FtpWebRequest)WebRequest.Create(newsFilePath);
                    request.Method = WebRequestMethods.Ftp.DownloadFile;
                    request.Credentials = new NetworkCredential(varUid, varPwd);
                    request.KeepAlive = true;
                    using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                    {
                        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                        {
                            newscontent = await reader.ReadToEndAsync();
                        }
                    }
                    string imageName = newsFiles.Where(x => !x.Contains(".txt")).Where(x => x.Contains(newsFile.Replace(".txt",""))).First(); 
                        string imagePath = $"{ftpNewsImageDirectory}/{imageName}";
                        string fileName = Path.GetFileName(imagePath);
                        string localPath = Path.Combine(localImageDirectory, fileName);
                        await DownloadAndSaveImage(imagePath, localPath);
                        NewsModel newsModel = ProcessDownloadedNewsImageContent(newscontent, imageName, localPath);
                        InsertNewsIntoDatabase(newsModel, 17);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.ToString() == "The remote server returned an error: (451) Local error in processing.")
                {
                    StartConnection(17);
                }
                _logger.LogError($"Error Downloading News Image: {ex.Message}");
            }
        }

        private async Task DownloadAndSaveImage(string ftpImagePath, string localPath)
        {
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpImagePath);
                request.Method = WebRequestMethods.Ftp.DownloadFile;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.UseBinary = true;
                request.KeepAlive = true;

                using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                using (Stream responseStream = response.GetResponseStream())
                using (FileStream fileStream = new FileStream(localPath, FileMode.Create))
                {
                    await responseStream.CopyToAsync(fileStream);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Downloading News Image: {ex.Message}");
            }
           
        }

        private NewsModel ProcessDownloadedNewsImageContent(string newscontent, string filename, string localPath)
        {
            NewsModel ob = new NewsModel();
            try
            {
                var lines = newscontent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
                string title = lines[1];
                string mainContent = string.Join(Environment.NewLine, lines.Skip(2));
                ob.DateTime = DateTime.Now;
                ob.Heading = title; 
                ob.FileName = filename;
                ob.Description = mainContent; 
                ob.ImagePath = filename;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing news content: {ex.Message}");
            }
            return ob;
        }

        #endregion

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private void InsertNewsIntoDatabase(NewsModel news, int sourceId)
        {
            try
            {
                // Create NameValueCollection to pass parameters
                NameValueCollection nv = new NameValueCollection();

                nv.Add("Title-NVARCHAR", (news.Heading ?? "NULL"));
                nv.Add("Link-NVARCHAR", "-");
                nv.Add("Description-NVARCHAR", (news.Heading ?? "NULL"));
                nv.Add("PublicationDate-DATETIME", news.DateTime.ToString("yyyy-MM-dd HH:mm:ss"));
                nv.Add("Author-NVARCHAR", DBNull.Value.ToString());
                nv.Add("Content-NVARCHAR", news.Description);
                nv.Add("Category-NVARCHAR", (news.Category ?? "NULL"));
                nv.Add("ImageURL-NVARCHAR", (news.ImagePath ?? "NULL"));
                nv.Add("Source-NVARCHAR", "APP");
                nv.Add("GUID-NVARCHAR", (news.FileName ?? "NULL"));
                nv.Add("FeedURL-NVARCHAR", varFtp);
                nv.Add("Tags-NVARCHAR", DBNull.Value.ToString());
                nv.Add("Language-NVARCHAR", "en");
                nv.Add("CommentsURL-NVARCHAR", DBNull.Value.ToString());
                nv.Add("MediaContentURL-NVARCHAR", DBNull.Value.ToString());
                nv.Add("FetchDate-DATETIME", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                nv.Add("LocalImagePath-NVARCHAR", (news.ImagePath ?? "NULL"));
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

