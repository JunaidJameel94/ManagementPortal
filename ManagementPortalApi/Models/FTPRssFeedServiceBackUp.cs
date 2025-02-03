using ManagementPortalApi.Context;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Text;
using System.Xml.Linq;

namespace ManagementPortalApi.Models
{
    public class FTPRssFeedServiceBackUp : IHostedService, IDisposable
    {
        private readonly ILogger<FTPRssFeedServiceBackUp> _logger;
        private Timer _timer;
        private static readonly string varFtp = "ftp://58.65.164.106";
        private static readonly string varUid = "mettisKHI";
        private static readonly string varPwd = "app!mettis2019";
        private static DataTable sortedtable1 = null;
        private readonly DataAccessLayer _DAL;

        public FTPRssFeedServiceBackUp(ILogger<FTPRssFeedServiceBackUp> logger, DataAccessLayer DAL)
        {
            _logger = logger;
            _DAL = DAL;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("News Download Service started.");

            // Set the timer to run the task periodically
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(10));

            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            try
            {
                ShowDirectory();
                DownloadNewsAsText();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DoWork: {ex.Message}");
            }
        }

        private void ShowDirectory()
        {
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{varFtp}/english/");
                request.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.KeepAlive = false;
                request.UseBinary = true;
                request.UsePassive = true;

                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                using (Stream responseStream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(responseStream, Encoding.Default, true))
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
                        string[] details = line.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);
                        string varTitle = line.Replace(details[0], "").Replace(details[1], "").Replace(details[2], "").Trim();

                        DataRow newRow = table.NewRow();
                        newRow["Date"] = details[0];
                        newRow["Time"] = details[1];
                        newRow["DateTime"] = $"{details[0]} {details[1]}";
                        newRow["ID"] = details[2];
                        newRow["Title"] = varTitle;
                        table.Rows.Add(newRow);
                    }

                    DataView dv = table.DefaultView;
                    dv.Sort = "DateTime desc";
                    sortedtable1 = dv.ToTable();
                }

                _logger.LogInformation("Directory listed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in ShowDirectory: {ex.Message}");
            }
        }

        private void DownloadNewsAsText()
        {
            if (sortedtable1 == null)
            {
                Console.WriteLine("Error: sortedtable1 is null. Make sure ShowDirectory() completed successfully.");
                return;
            }
            try
            {
                string newsSavePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Downloads", "NewsText");
                string imageSavePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Downloads", "Images");

                if (!Directory.Exists(newsSavePath))
                {
                    Directory.CreateDirectory(newsSavePath);
                }

                if (!Directory.Exists(imageSavePath))
                {
                    Directory.CreateDirectory(imageSavePath);
                }

                using (WebClient ftpClient = new WebClient())
                {
                    ftpClient.Credentials = new NetworkCredential(varUid, varPwd);

                    foreach (DataRow row in sortedtable1.Rows)
                    {
                        string title = row["Title"].ToString();
                        string sanitizedTitle = SanitizeFileName(Path.GetFileNameWithoutExtension(title));
                        string newsLocalFilePath = Path.Combine(newsSavePath, $"{sanitizedTitle}.txt");
                        string newsFtpFilePath = $"{varFtp}/english/{title}";

                        try
                        {
                            // Download the news content
                            string newsContent = ftpClient.DownloadString(newsFtpFilePath);

                            // Save the news content as a text file
                            File.WriteAllText(newsLocalFilePath, newsContent, Encoding.UTF8);
                            _logger.LogInformation($"Downloaded and saved as text: {sanitizedTitle}");

                            // Download the associated image
                            string imageFtpFilePath = $"{varFtp}/english/images/{sanitizedTitle}.jpg";
                            string imageLocalFilePath = Path.Combine(imageSavePath, $"{sanitizedTitle}.jpg");

                            try
                            {
                                ftpClient.DownloadFile(imageFtpFilePath, imageLocalFilePath);
                                _logger.LogInformation($"Downloaded and saved image: {sanitizedTitle}");
                            }
                            catch (Exception imgEx)
                            {
                                _logger.LogWarning($"Error downloading image for {title}: {imgEx.Message}");
                                imageLocalFilePath = null;
                            }

                            // Parse the content into title, description, and content
                            string[] parts = newsContent.Split(new string[] { "\r\n\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                            if (parts.Length >= 2)
                            {
                                string description = parts[0].Trim();
                                string content = string.Join("\r\n\r\n", parts, 1, parts.Length - 1).Trim();

                                // Create a FeedItem with the parsed data
                                var feedItem = new FeedItem
                                {
                                    Title = sanitizedTitle,
                                    Description = description,
                                    Content = content,
                                    PublicationDate = DateTime.Now.ToString(), // Or parse from the content if available
                                    LocalImagePath = imageLocalFilePath
                                };

                                // Insert the news item into the database
                                InsertNewsIntoDatabase(feedItem);
                            }
                            else
                            {
                                _logger.LogWarning($"Insufficient data parts found for {title}");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"Error downloading file {title}: {ex.Message}");
                        }
                    }
                }

                _logger.LogInformation("News download and insertion into database complete.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DownloadNewsAsText: {ex.Message}");
            }
        }

        private void DownloadImages()
        {
            try
            {
                _logger.LogInformation("Starting image download.");

                // Create FTP request to list directory details
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{varFtp}/photo/");
                request.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
                request.Credentials = new NetworkCredential(varUid, varPwd);
                request.KeepAlive = false;
                request.UseBinary = true;
                request.UsePassive = true;

                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                using (Stream responseStream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(responseStream, Encoding.Default, true))
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
                        string[] details = line.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);

                        string varTitle = line.Replace(details[0], "").Replace(details[1], "").Replace(details[2], "").Trim();

                        DataRow newRow = table.NewRow();
                        newRow["Date"] = details[0];
                        newRow["Time"] = details[1];
                        newRow["DateTime"] = $"{details[0]} {details[1]}";
                        newRow["ID"] = details[2];
                        newRow["Title"] = varTitle;
                        table.Rows.Add(newRow);
                    }

                    string imageSavePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Downloads", "Images");

                    if (!Directory.Exists(imageSavePath))
                    {
                        Directory.CreateDirectory(imageSavePath);
                    }

                    using (WebClient ftpClient = new WebClient())
                    {
                        ftpClient.Credentials = new NetworkCredential(varUid, varPwd);

                        foreach (DataRow row in table.Rows)
                        {
                            string title = row["Title"].ToString();
                            string sanitizedTitle = SanitizeFileName(Path.GetFileNameWithoutExtension(title));
                            string imageFtpFilePath = $"{varFtp}/photo/{title}";
                            string imageLocalFilePath = Path.Combine(imageSavePath, $"{sanitizedTitle}.jpg");

                            try
                            {
                                ftpClient.DownloadFile(imageFtpFilePath, imageLocalFilePath);
                                _logger.LogInformation($"Downloaded and saved image: {sanitizedTitle}");
                            }
                            catch (Exception imgEx)
                            {
                                _logger.LogWarning($"Error downloading image for {title}: {imgEx.Message}");
                            }
                        }
                    }
                }

                _logger.LogInformation("Image download completed.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DownloadImages: {ex.Message}");
            }
        }

        private void InsertNewsIntoDatabase(FeedItem feedItem)
        {
            try
            {
                string imageURL = feedItem.ImageURL;
                string source_id = "15";
                string link = "-";
                string Author = "-";
                string Category = "-";
                string Source = "-";
                string GUID = "-";
                string FeedURL = "-";
                string Tags = "-";
                string Language = "-";
                string CommentsURL = "-";
                string MediaContentURL = "-";
                string FetchDate = DateTime.Now.ToString();
               
                NameValueCollection nv = new NameValueCollection();
                nv.Add("Title-NVARCHAR", feedItem.Title ?? "NULL");
                nv.Add("Link-NVARCHAR", link ?? "NULL");
                nv.Add("Description-NVARCHAR", feedItem.Description ?? "NULL");
                nv.Add("PublicationDate-DATETIME", !string.IsNullOrEmpty(feedItem.PublicationDate) ? DateTime.Parse(feedItem.PublicationDate).ToString("yyyy-MM-dd HH:mm:ss") : "NULL");
                nv.Add("Author-NVARCHAR", Author ?? "NULL");
                nv.Add("Content-NVARCHAR", feedItem.Content ?? "NULL");
                nv.Add("Category-NVARCHAR", Category ?? "NULL");
                nv.Add("ImageURL-NVARCHAR", imageURL ?? "NULL");
                nv.Add("Source-NVARCHAR", Source ?? "NULL");
                nv.Add("GUID-NVARCHAR", GUID ?? "NULL");
                nv.Add("FeedURL-NVARCHAR", FeedURL ?? "NULL");
                nv.Add("Tags-NVARCHAR", Tags ?? "NULL");
                nv.Add("Language-NVARCHAR", Language ?? "NULL");
                nv.Add("CommentsURL-NVARCHAR", CommentsURL ?? "NULL");
                nv.Add("MediaContentURL-NVARCHAR", MediaContentURL ?? "NULL");
                nv.Add("FetchDate-DATETIME", !string.IsNullOrEmpty(feedItem.FetchDate) ? DateTime.Parse(feedItem.FetchDate).ToString("yyyy-MM-dd HH:mm:ss") : "NULL");
                nv.Add("LocalImagePath-NVARCHAR", feedItem.LocalImagePath ?? "NULL");
                nv.Add("SourceId-INT", source_id.ToString());

                _DAL.InsertData("sp_insertRSSFeed", nv, _DAL.CSManagementPortalDatabase);

                _logger.LogInformation($"Inserted news item: {feedItem.Title} into the database.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inserting news item into the database: {ex.Message}");
            }
        }

        private string SanitizeFileName(string fileName)
        {
            // Replace invalid file name characters with underscores
            foreach (char c in Path.GetInvalidFileNameChars())
            {
                fileName = fileName.Replace(c, '_');
            }

            return fileName;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("News Download Service stopped.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
    public class FeedItem
    {
        public string? Title { get; set; }
        public string? Link { get; set; }
        public string? Description { get; set; }
        public string? PublicationDate { get; set; }
        public string? Author { get; set; }
        public string? Content { get; set; }
        public string? Category { get; set; }
        public string? ImageURL { get; set; }
        public string? Source { get; set; }
        public string? GUID { get; set; }
        public string? FeedURL { get; set; }
        public string? Tags { get; set; }
        public string? Language { get; set; }
        public string? CommentsURL { get; set; }
        public string? MediaContentURL { get; set; }
        public string? FetchDate { get; set; }
        public string? LocalImagePath { get; set; }
        public string? source_id { get; set; }
    }
}
