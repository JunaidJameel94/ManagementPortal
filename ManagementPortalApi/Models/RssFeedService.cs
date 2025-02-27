using ManagementPortalApi.Context;
using System.Xml.Linq;
using System.Collections.Specialized;
using System.Data;
using System.Net;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Text;
using System.Web;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace ManagementPortalApi.Models
{

    public class RssFeedService : IHostedService, IDisposable
    {
        string sender = (Environment.GetEnvironmentVariable("sender") != null ? Environment.GetEnvironmentVariable("sender").ToString() : "");
        string Source = (Environment.GetEnvironmentVariable("Source") != null ? Environment.GetEnvironmentVariable("Source").ToString() : "");
        string origin = (Environment.GetEnvironmentVariable("origin") != null ? Environment.GetEnvironmentVariable("origin").ToString() : "");
        string credit = (Environment.GetEnvironmentVariable("credit") != null ? Environment.GetEnvironmentVariable("credit").ToString() : "");
        string Rss2version = (Environment.GetEnvironmentVariable("Rss2version") != null ? Environment.GetEnvironmentVariable("Rss2version").ToString() : "");
        string language = (Environment.GetEnvironmentVariable("language") != null ? Environment.GetEnvironmentVariable("language").ToString() : "");
        string channelDescription = (Environment.GetEnvironmentVariable("channelDescription") != null ? Environment.GetEnvironmentVariable("channelDescription").ToString() : "");
        string channelLink = (Environment.GetEnvironmentVariable("channelLink") != null ? Environment.GetEnvironmentVariable("channelLink").ToString() : "");
        string channelTitle = (Environment.GetEnvironmentVariable("channelTitle") != null ? Environment.GetEnvironmentVariable("channelTitle").ToString() : "");
        string RevisionId = (Environment.GetEnvironmentVariable("RevisionId") != null ? Environment.GetEnvironmentVariable("RevisionId").ToString() : "");
        string ProviderId = (Environment.GetEnvironmentVariable("ProviderId") != null ? Environment.GetEnvironmentVariable("ProviderId").ToString() : "");
        string NewsMLG2Namespace = (Environment.GetEnvironmentVariable("NewsMLG2Namespace") != null ? Environment.GetEnvironmentVariable("NewsMLG2Namespace").ToString() : "");
        string NewsMLG2Version = (Environment.GetEnvironmentVariable("NewsMLG2Version") != null ? Environment.GetEnvironmentVariable("NewsMLG2Version").ToString() : "");
        string NewsMLG1Namespace = (Environment.GetEnvironmentVariable("NewsMLG1Namespace") != null ? Environment.GetEnvironmentVariable("NewsMLG1Namespace").ToString() : "");
        string NewsMLG1Version = (Environment.GetEnvironmentVariable("NewsMLG1Version") != null ? Environment.GetEnvironmentVariable("NewsMLG1Version").ToString() : "");
        string NewsMLG1NewsEnvelope = (Environment.GetEnvironmentVariable("NewsMLG1NewsEnvelope") != null ? Environment.GetEnvironmentVariable("NewsMLG1NewsEnvelope").ToString() : "");
        string NewsAtomNamespace = (Environment.GetEnvironmentVariable("NewsAtomNamespace") != null ? Environment.GetEnvironmentVariable("NewsAtomNamespace").ToString() : "");
        


        private readonly ILogger<RssFeedService> _logger;
        private Timer _timer;
        private readonly string _connectionString;
        private readonly DataAccessLayer _DAL;

        public RssFeedService(DataAccessLayer DAL, ILogger<RssFeedService> logger)
        {
            _DAL = DAL;
            _logger = logger;
        }


        #region RSS FEED READER
        //public Task StartAsync(CancellationToken cancellationToken)
        //{
        //    _logger.LogInformation("RssFeedService is starting.");
        //    _timer = new Timer(ProcessFeeds, null, TimeSpan.Zero, TimeSpan.FromMinutes(15)); // Run every 10 minutes
        //    return Task.CompletedTask;
        //}

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RssFeedService is starting.");

            // Environment variable se interval lena
            int intervalMinutes = int.TryParse(Environment.GetEnvironmentVariable("RSS_FEED_INTERVAL"), out int minutes) ? minutes : 15;

            _timer = new Timer(ProcessFeeds, null, TimeSpan.Zero, TimeSpan.FromMinutes(intervalMinutes));

            return Task.CompletedTask;
        }


        private async void ProcessFeeds(object state)
        {
            _logger.LogInformation("Processing feeds...");
            try
            {
                List<feedUrls> feedUrls = GetFeedUrlsFromDatabase();
                foreach (var feedUrl in feedUrls)
                {
                    var feedItems = await FetchFeedItems(feedUrl.FeedURL, feedUrl.ID);
                    foreach (var feedItem in feedItems)
                    {
                        await InsertFeedItem(feedItem);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing feeds: {ex.Message}");
            }
        }

        private List<feedUrls> GetFeedUrlsFromDatabase()
        {
            List<feedUrls> li = new List<feedUrls>();
            try
            {
                DataTable result = _DAL.GetData("sp_getactivefeedurl", null, _DAL.CSManagementPortalDatabase);
                foreach (DataRow row in result.Rows)
                {
                    feedUrls obj = new feedUrls();
                    string feedUrl = row["FeedURL"].ToString();
                    int sourceId = Convert.ToInt32(row["ID"]);
                    obj.FeedURL = feedUrl;
                    obj.ID = sourceId.ToString();
                    obj.Format_ID = row["Format_ID"].ToString();
                    li.Add(obj);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching feed URLs from database: {ex.Message}");
            }
            return li;
        }

        public static string GenerateSlug(string title)
        {
            string slug = title.ToLower().Replace(" ", "-");
            slug = Regex.Replace(slug, @"[^a-z0-9\-]", ""); 
            return slug;
        }

        
        private async Task<List<FeedItem>> FetchFeedItems(string url, string id)
        {
            List<FeedItem> feedItems = new List<FeedItem>();
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(url);
                    if (response.IsSuccessStatusCode)
                    {
                        string xml = await response.Content.ReadAsStringAsync();
                        XDocument xmlDoc = XDocument.Parse(xml);
                        XNamespace contentNs = "http://purl.org/rss/1.0/modules/content/";
                        XNamespace mediaNs = "http://search.yahoo.com/mrss/";
                        var items = xmlDoc.Descendants("item");
                        foreach (var item in items)
                        {
                            // Get image URL if available
                            string imageURL = null;

                            var mediaContent = item.Element(mediaNs + "content");

                            if (mediaContent != null)
                            {
                                imageURL = (string)mediaContent.Attribute("url");
                            }
                            else
                            {
                                var imageElement = item.Element("image");
                                if (imageElement != null)
                                {
                                    var imgElement = imageElement.Element("img");
                                    if (imgElement != null)
                                    {
                                        imageURL = (string)imgElement.Attribute("src");
                                    }
                                }
                            }

                            // Parse publication date
                            DateTime publicationDate;
                            string pubDateStr = (string)item.Element("pubDate");
                            if (!DateTime.TryParseExact(pubDateStr, "ddd, dd MMM yyyy HH:mm:ss K", CultureInfo.InvariantCulture, DateTimeStyles.None, out publicationDate))
                            {
                                publicationDate = DateTime.Now; // Default to current time if parsing fails
                            }

                            // Create FeedItem object
                            FeedItem feedItem = new FeedItem
                            {
                                Title = (string)item.Element("title"),
                                Link = (string)item.Element("link"),
                                Description = (string)item.Element("description"),
                                PublicationDate = publicationDate.ToString("yyyy-MM-dd HH:mm:ss"), // Format the date as needed
                                Author = "1", // You may adjust this based on your requirements
                                Content = (string)item.Element(contentNs + "encoded"), // Assuming this is where the content is
                                Category = (string)item.Elements("category").LastOrDefault()?.Value,
                                ImageURL = imageURL,
                                Source = url,
                                GUID = (string)item.Element("guid"),
                                FeedURL = url,
                                Tags = "",
                                Language = "",
                                CommentsURL = "",
                                MediaContentURL = "",
                                FetchDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                                LocalImagePath = imageURL,
                                source_id = id
                            };

                            string directoryPath = Environment.GetEnvironmentVariable("IMAGE_STORAGE_PATH");
                            if (string.IsNullOrEmpty(directoryPath))
                            {
                                directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                            }
                            if (!Directory.Exists(directoryPath))
                            {
                                Directory.CreateDirectory(directoryPath);
                            }

                            // Download and save image locally
                            if (!string.IsNullOrEmpty(imageURL))
                            {
                                string originalTitle = feedItem.Title;
                                string titleSlug = GenerateSlug(originalTitle);
                                string localFileName = $"{titleSlug}.jpg";
                                string localFilePath = Path.Combine(directoryPath, localFileName);
                                localFilePath = localFilePath.Replace('\\', '/');

                                using (var webClient = new WebClient())
                                {
                                    await webClient.DownloadFileTaskAsync(new Uri(imageURL), localFilePath);
                                    feedItem.LocalImagePath = localFileName;
                                }
                            }
                            else
                            {
                                feedItem.LocalImagePath = null;
                            }
                            feedItems.Add(feedItem);
                        }
                    }
                    else
                    {
                        _logger.LogError($"Failed to fetch RSS feed from {url}. Status code: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching RSS feed from {url}: {ex.Message}");
            }
            return feedItems;
        }

        private async Task<string> DownloadAndSaveImage(string imageURL, string title)
        {
            if (string.IsNullOrEmpty(imageURL))
            {
                return null;
            }

            string directoryPath = Environment.GetEnvironmentVariable("IMAGE_STORAGE_PATH") ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            string titleSlug = GenerateSlug(title);
            string localFileName = $"{titleSlug}.jpg";
            string localFilePath = Path.Combine(directoryPath, localFileName).Replace('\\', '/');

            using (var webClient = new WebClient())
            {
                await webClient.DownloadFileTaskAsync(new Uri(imageURL), localFilePath);
            }

            return localFileName;
        }

  
        public int GetRSSFeedCount(string guid)
        {
            int count = 0;
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Add("Guid-NVARCHAR", guid);
                DataTable result = _DAL.GetData("sp_count_rssfeedtop10", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    count = Convert.ToInt32(result.Rows[0]["Top10Count"]);
                }
                _logger.LogInformation($"Counting RSS feed item: {guid}. Count: {count}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Counting RSS feed item: {ex.Message}");
            }
            return count;
        }

        private async Task InsertFeedItem(FeedItem feedItem)
        {
            try
            {
                int existingRecordCount = GetRSSFeedCount(feedItem.GUID);
                string imageURL = feedItem.ImageURL;
                NameValueCollection nv = new NameValueCollection();

                // Handle PublicationDate parsing
                DateTime publicationDate;
                if (!DateTime.TryParse(feedItem.PublicationDate, out publicationDate))
                {
                    _logger.LogWarning($"Unable to parse publication date: {feedItem.PublicationDate}, setting to current UTC.");
                    publicationDate = DateTime.UtcNow;
                }

                nv.Add("Title-NVARCHAR", (feedItem.Title ?? "NULL"));
                nv.Add("Link-NVARCHAR", (feedItem.Link ?? "NULL"));
                nv.Add("Description-NVARCHAR", (feedItem.Description ?? "NULL"));
                nv.Add("PublicationDate-DATETIME", publicationDate.ToString("yyyy-MM-dd HH:mm:ss"));
                nv.Add("Author-NVARCHAR", (feedItem.Author ?? "NULL"));
                nv.Add("Content-NVARCHAR", (feedItem.Content ?? "NULL"));
                nv.Add("Category-NVARCHAR", (feedItem.Category ?? "NULL"));
                nv.Add("ImageURL-NVARCHAR", (imageURL ?? "NULL"));
                nv.Add("Source-NVARCHAR", (feedItem.Source ?? "NULL"));
                nv.Add("GUID-NVARCHAR", (feedItem.GUID ?? "NULL"));
                nv.Add("FeedURL-NVARCHAR", (feedItem.FeedURL ?? "NULL"));
                nv.Add("Tags-NVARCHAR", (feedItem.Tags ?? "NULL"));
                nv.Add("Language-NVARCHAR", (feedItem.Language ?? "NULL"));
                nv.Add("CommentsURL-NVARCHAR", (feedItem.CommentsURL ?? "NULL"));
                nv.Add("MediaContentURL-NVARCHAR", (feedItem.MediaContentURL ?? "NULL"));

                // Handle FetchDate parsing
                DateTime fetchDate;
                if (!DateTime.TryParse(feedItem.FetchDate, out fetchDate))
                {
                    fetchDate = DateTime.UtcNow;
                }
                nv.Add("FetchDate-DATETIME", fetchDate.ToString("yyyy-MM-dd HH:mm:ss"));
                nv.Add("LocalImagePath-NVARCHAR", (feedItem.LocalImagePath ?? "NULL"));
                nv.Add("SourceId-INT", feedItem.source_id);

                if (existingRecordCount < 10)
                {
                    _logger.LogInformation($"Inserting RSS feed item: {feedItem.Title}");
                    _DAL.GetData("sp_insertRSSFeed", nv, _DAL.CSManagementPortalDatabase);
                }
                else
                {
                    _logger.LogInformation($"Skipping RSS feed item insert due to existing count limit: {feedItem.Title}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inserting/updating RSS feed item: {ex.Message}");
            }
        }

        #endregion

        #region RSS FEED GEMERATOR

        public string GenerateNews_NewsMLG2(DataTable dt)
        {
            XNamespace ns = NewsMLG2Namespace;
            if (dt.Rows.Count == 0)
                return string.Empty;
            List<string> headlines = new List<string>();
            List<string> contents = new List<string>();
            List<string> descriptions = new List<string>();
            List<string> images = new List<string>();
            HashSet<string> graphData = new HashSet<string>(); 
            HashSet<string> existingTableNames = new HashSet<string>(); 
            List<XElement> tables = new List<XElement>();
            string graphtitle = string.Empty;
            string graphsubtitle = string.Empty;
            string graphid = string.Empty;
            HashSet<string> uniqueSlugs = new HashSet<string>();
            HashSet<string> uniqueTags = new HashSet<string>();
            foreach (DataRow row in dt.Rows)
            {
                if (row.ItemArray.Length >= 6) // Ensure the column exists
                {
                    var formid = row["formid"]?.ToString();
                    var formname = row["formname"]?.ToString();
                    var content = HtmlDecodeSafe(row["NewsContent"]?.ToString());
                    var graphSeriesData = row["graph_series_data"]?.ToString(); // Graph JSON data
                    var tableName = row["tablename"]?.ToString();
                    var tableDataJson = row["table_data_json"]?.ToString();
                    var slugDataJson = row["slugs_data"]?.ToString();
                    var tagsDataJson = row["tags_data"]?.ToString();

                    // Extract graph title and subtitle from separate columns
                    graphtitle = row["graphtitle"]?.ToString() ?? "Unknown Graph Title";
                    graphsubtitle = row["graphsubtitle"]?.ToString() ?? "Unknown Graph Subtitle";
                    graphid = row["graphid"]?.ToString() ?? "Unknown Graph ID";

                    if (!string.IsNullOrEmpty(graphSeriesData))
                    {
                        graphData.Add(graphSeriesData); // Add graph data as JSON to avoid duplicates
                    }

                    // Handle table data
                    if (!string.IsNullOrEmpty(tableName) && !string.IsNullOrEmpty(tableDataJson))
                    {
                        try
                        {
                            if (!existingTableNames.Contains(tableName))
                            {
                                existingTableNames.Add(tableName);

                                var tableJson = JArray.Parse(tableDataJson);
                                var tableElements = new List<XElement>();

                                var groupedRows = tableJson.GroupBy(row => row["rownumber"]);

                                foreach (var rowGroup in groupedRows)
                                {
                                    var rowElements = new List<XElement>();

                                    foreach (var cell in rowGroup)
                                    {
                                        string cellContent = cell["cellcontent"]?.ToString();
                                        string isHeader = cell["isheader"]?.ToString();

                                        rowElements.Add(new XElement(
                                            ns + "cell",
                                            new XAttribute("isHeader", isHeader == "1" ? "true" : "false"),
                                            cellContent
                                        ));
                                    }

                                    tableElements.Add(new XElement(ns + "row", rowElements));
                                }

                                tables.Add(new XElement(
                                    ns + "table",
                                    new XElement(ns + "name", tableName),
                                    new XElement(ns + "data", tableElements)
                                ));
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("Error parsing table JSON: " + ex.Message);
                        }
                    }

                    // Handle slug data and remove duplicates
                    // Handle slug data and remove duplicates with TypeName
                    if (!string.IsNullOrEmpty(slugDataJson))
                    {
                        var slugs = JArray.Parse(slugDataJson);
                        foreach (var slug in slugs)
                        {
                            var slugName = slug["SlugName"]?.ToString();
                            var slugTypeName = slug["TypeName"]?.ToString(); // Extract TypeName
                            if (!string.IsNullOrEmpty(slugName))
                            {
                                uniqueSlugs.Add($"{slugName} ({slugTypeName})"); // Append TypeName to the SlugName
                            }
                        }
                    }

                    // Handle tags data and remove duplicates with TypeName
                    if (!string.IsNullOrEmpty(tagsDataJson))
                    {
                        var tags = JArray.Parse(tagsDataJson);
                        foreach (var tag in tags)
                        {
                            var tagName = tag["TagName"]?.ToString();
                            var tagTypeName = tag["TypeName"]?.ToString(); // Extract TypeName
                            if (!string.IsNullOrEmpty(tagName))
                            {
                                uniqueTags.Add($"{tagName} ({tagTypeName})"); // Append TypeName to the TagName
                            }
                        }
                    }


                    // Handle formid-based content allocation
                    if (!string.IsNullOrEmpty(formid))
                    {
                        if (formid == "1") // Heading
                        {
                            headlines.Add(content);
                        }
                        else if (formid == "2") // Description
                        {
                            descriptions.Add(content);
                        }
                        else if (formid == "4") // Image
                        {
                            images.Add(content);
                        }
                        else if (formid == "3") // Content
                        {
                            contents.Add(content);
                        }
                    }
                }
            }
            XDocument xmlDoc = new XDocument(
                new XElement(ns + "newsMessage",
                    new XAttribute("version", NewsMLG2Version),
                    new XElement(ns + "header",
                        new XElement(ns + "sender", sender),
                        new XElement(ns + "sent", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")),
                        new XElement(ns + "source", Source),
                        new XElement(ns + "origin", origin)
                    ),
                    new XElement(ns + "itemSet",
                        new XElement(ns + "newsItem",
                            new XElement(ns + "contentMeta",
                                headlines.Count > 0 ? headlines.Select(h => new XElement(ns + "headline", h)) : null,
                                new XElement(ns + "language", new XAttribute("tag", "en")),
                                new XElement(ns + "genre", new XAttribute("qcode", "n genre:financial")),
                                new XElement(ns + "credit", credit),
                                uniqueSlugs.Count > 0 ? new XElement(ns + "slugs", uniqueSlugs.Select(s => new XElement(ns + "slug", s))) : null,
                                uniqueTags.Count > 0 ? new XElement(ns + "tags", uniqueTags.Select(t => new XElement(ns + "tag", t))) : null
                            ),
                            new XElement(ns + "contentSet",
                                new XElement(ns + "inlineXML",
                                    descriptions.Count > 0 ? descriptions.Select(d => new XElement(ns + "description", d)) : null,
                                    contents.Count > 0 ? contents.Select(c => new XElement(ns + "content", c)) : null,
                                    images.Count > 0 ? images.Select(img => new XElement(ns + "image", new XElement(ns + "url", HtmlDecodeSafe(img)))) : null,
                                    graphData.Count > 0 ? new XElement(ns + "graphData",
                                        new XElement(ns + "graphtitle", graphtitle),
                                        new XElement(ns + "graphsubtitle", graphsubtitle),
                                        new XElement(ns + "graphid", graphid),
                                        string.Join(",", graphData)) : null,
                   
                                    tables.Count > 0 ? tables : null
                                )
                            )
                        )
                    )
                )
            );

            return xmlDoc.ToString(SaveOptions.None);


            return xmlDoc.ToString(SaveOptions.None);
        }
        public string GenerateNews_NewsMLG1(DataTable dt)
        {
            XNamespace ns = NewsMLG1Namespace;

            if (dt.Rows.Count == 0)
                return string.Empty;

            DataRow row = dt.Rows[0];
            string headline = HtmlDecodeSafe(row["headline"]?.ToString())?.Replace("\"", string.Empty);
            string byline = HtmlDecodeSafe(row["Author"]?.ToString() ?? string.Empty)?.Replace("\"", string.Empty);
            string description = HtmlDecodeSafe(row["Metadescription"]?.ToString() ?? string.Empty)?.Replace("\"", string.Empty);
            string content = HtmlDecodeSafe(row["Content"]?.ToString() ?? string.Empty)?.Replace("\"", string.Empty);
            string imageUrls = row["ImageURLs"]?.ToString()?.Replace("\"", string.Empty);
            string graphContent = HtmlDecodeSafe(row["GraphData"]?.ToString())?.Replace("\"", string.Empty);
            string tableContent = HtmlDecodeSafe(row["TableData"]?.ToString())?.Replace("\"", string.Empty);

            XDocument xmlDoc = new XDocument(
                new XElement(ns + "NewsML",
                    new XAttribute("Version", NewsMLG1Version),
                    new XElement(ns + NewsMLG1NewsEnvelope,
                        new XElement(ns + "TransmissionID", Guid.NewGuid().ToString()),
                        new XElement(ns + "SentDate", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")),
                        new XElement(ns + "Sender", sender)
                    ),
                    new XElement(ns + "NewsItem",
                        new XAttribute("NewsItemID", Guid.NewGuid().ToString()),
                        new XAttribute("DateAndTime", ((DateTime?)row["CreatedDate"])?.ToString("yyyy-MM-ddTHH:mm:ss") ?? string.Empty),
                        new XElement(ns + "Identification",
                            new XElement(ns + "NewsIdentifier",
                                new XElement(ns + "ProviderId", ProviderId),
                                new XElement(ns + "DateId", DateTime.UtcNow.ToString("yyyyMMdd")),
                                new XElement(ns + "NewsItemId", Guid.NewGuid().ToString()),
                                new XElement(ns + "RevisionId", RevisionId)
                            )
                        ),
                        new XElement(ns + "NewsManagement",
                            new XElement(ns + "FirstCreated", ((DateTime?)row["CreatedDate"])?.ToString("yyyy-MM-ddTHH:mm:ss") ?? string.Empty),
                            new XElement(ns + "Status", "usable")
                        ),
                        new XElement(ns + "NewsComponent",
                            new XElement(ns + "Role", "Main"),
                            new XElement(ns + "ContentItem",
                                new XElement(ns + "MediaType", "text"),
                                new XElement(ns + "Format", "text/html"),
                                new XElement(ns + "DataContent",
                                    new XElement(ns + "headline", headline),
                                    new XElement(ns + "byline", byline),
                                    new XElement(ns + "description", description),
                                    new XElement(ns + "content", content),
                                    !string.IsNullOrEmpty(imageUrls) ? new XElement(ns + "images",
                                        from imageUrl in imageUrls.Split(',')
                                        select new XElement(ns + "image", imageUrl.Trim())
                                    ) : null,
                                    !string.IsNullOrEmpty(graphContent) ? new XElement(ns + "graphContent", graphContent) : null,
                                    !string.IsNullOrEmpty(tableContent) ? new XElement(ns + "tableContent", tableContent) : null
                                )
                            )
                        )
                    )
                )
            );

            return xmlDoc.ToString(SaveOptions.None);
        }
        public string GenerateNews_Atom(DataTable dt)
        {
            XNamespace atomNs = NewsAtomNamespace;
            if (dt == null || dt.Rows.Count == 0)
                return string.Empty;
            XElement feed = new XElement(atomNs + "feed",
                new XElement(atomNs + "title", "News Feed"),
                new XElement(atomNs + "updated", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss") + "Z"), 
                new XElement(atomNs + "id", "urn:uuid:" + Guid.NewGuid()), 
                new XElement(atomNs + "author",
                    new XElement(atomNs + "name", ProviderId) 
                )
            );
            foreach (DataRow row in dt.Rows)
            {
                // Decode and sanitize input values
                string title = HttpUtility.HtmlDecode(row["Title"]?.ToString() ?? string.Empty).Replace("\"", string.Empty);
                string summary = HttpUtility.HtmlDecode(row["Metadescription"]?.ToString() ?? string.Empty).Replace("\"", string.Empty);
                string content = HttpUtility.HtmlDecode(row["Content"]?.ToString() ?? string.Empty).Replace("\"", string.Empty);
                string link = row["Link"]?.ToString() ?? "https://example.com"; 
                string author = row["Author"]?.ToString() ?? "Unknown Author";
                DateTime? publishedDate = row["Createddate"] as DateTime?;
                XElement entry = new XElement(atomNs + "entry",
                    new XElement(atomNs + "title", title), 
                    new XElement(atomNs + "link", new XAttribute("href", link)),
                    new XElement(atomNs + "id", "urn:uuid:" + (row["GUID"] ?? Guid.NewGuid().ToString())), 
                    new XElement(atomNs + "updated", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss") + "Z"), 
                    new XElement(atomNs + "published", publishedDate?.ToString("yyyy-MM-ddTHH:mm:ss") + "Z" ?? string.Empty),
                    new XElement(atomNs + "summary", summary),
                    new XElement(atomNs + "author",
                        new XElement(atomNs + "name", author)
                    ),
                    new XElement(atomNs + "content", new XAttribute("type", "html"), content)
                );
                feed.Add(entry);
            }
            XDocument atomDoc = new XDocument(feed);
            return atomDoc.ToString(SaveOptions.None);
        }
        public string GenerateNews_RSS2(DataTable dt)
        {
            if (dt == null || dt.Rows.Count == 0)
                return string.Empty;
            string HtmlDecodeSafe(string input) => HttpUtility.HtmlDecode(input ?? string.Empty)?.Replace("\"", string.Empty);
            XDocument rssDoc = new XDocument(
                new XElement("rss",
                    new XAttribute("version", Rss2version),
                    new XElement("channel",
                        new XElement("title", channelTitle),
                        new XElement("link", channelLink),
                        new XElement("description", channelDescription),
                        new XElement("lastBuildDate", DateTime.UtcNow.ToString("R")),
                        new XElement("pubDate", DateTime.UtcNow.ToString("R")),
                        new XElement("language", language)
                    )
                )
            );
            XElement channel = rssDoc.Root.Element("channel");
            foreach (DataRow row in dt.Rows)
            {
                string title = HtmlDecodeSafe(row["Title"]?.ToString());
                string link = HtmlDecodeSafe(row["Link"]?.ToString());
                string guid = row["GUID"]?.ToString() ?? Guid.NewGuid().ToString();
                string pubDate = ((DateTime?)row["Createddate"])?.ToString("R") ?? string.Empty;
                string description = HtmlDecodeSafe(row["Metadescription"]?.ToString());
                string author = HtmlDecodeSafe(row["Author"]?.ToString());
                string content = HtmlDecodeSafe(row["Content"]?.ToString());
                string table = HtmlDecodeSafe(row["Table"]?.ToString());
                string imageUrls = HtmlDecodeSafe(row["ImageUrls"]?.ToString());
                XElement item = new XElement("item",
                    new XElement("title", title),
                    new XElement("link", link),
                    new XElement("guid", guid),
                    new XElement("pubDate", pubDate),
                    new XElement("description", description),
                    new XElement("author", author)
                );
                if (!string.IsNullOrEmpty(content))
                    item.Add(new XElement("content", content));

                if (!string.IsNullOrEmpty(table))
                    item.Add(new XElement("table", table));
                if (!string.IsNullOrEmpty(imageUrls))
                {
                    XElement imageElement = new XElement("image");
                    foreach (string imageUrl in imageUrls.Split(','))
                    {
                        imageElement.Add(new XElement("url", imageUrl.Trim()));
                    }
                    item.Add(imageElement);
                }
                channel.Add(item);
            }
            return rssDoc.ToString(SaveOptions.None);
        }

        //public string GenerateNews_JSON(DataTable dt)
        //{
        //    if (dt == null || dt.Rows.Count == 0)
        //        return string.Empty;
        //    string HtmlDecodeSafe(string input) => HttpUtility.HtmlDecode(input ?? string.Empty)?.Replace("\"", string.Empty);
        //    var jsondata = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

        //    return jsondata;
        //}

        //public string GenerateNews_JSON(DataTable dt)
        //{
        //    return JsonConvert.SerializeObject(dt, Formatting.Indented);
        //}


        internal string GenerateNews_JSON(List<MGNews.MGNews> newsList)
        {
            return JsonConvert.SerializeObject(newsList, Formatting.Indented);
        }

        public string GenerateNews_XML(DataTable dt)
        {
            var xmlResponse = new StringBuilder();
            xmlResponse.AppendLine("<DocumentElement>");

            foreach (DataRow row in dt.Rows)
            {
                
               
                string headline = row["Heading"].ToString();
                string content = row["Content"].ToString();
                string newsLink = "https://mettisglobal.net/";
                string imageUrl = row["Image"].ToString();
                DateTime PublishedDate = Convert.ToDateTime(row["NewsDate"]);
                string formattedDate = PublishedDate.ToString("MMMM dd, yyyy 'at' hh:mm tt 'GMT'zzz");
                //string PublishedTime = row["NewsDate"].ToString();

                string tags = row["Tags"].ToString();
                string description = row["Description"].ToString();
                string Category = row["Category"].ToString();
                string newsID = row["NewsID"].ToString();
                string Graph = row["Graph"].ToString();
                string Table = row["Table"].ToString();
                string AuthotName = row["AuthorName"].ToString();
                //string AuthotName = sender;

                string OnBlog = "OnBlog".ToString();
                var xmlNews = new StringBuilder();
                xmlNews.AppendLine("<MettisGlobalNews>");
                if (!string.IsNullOrEmpty(headline))
                {
                    xmlNews.AppendLine($"<Headline>{System.Security.SecurityElement.Escape(headline)}</Headline>");
                }
                if (!string.IsNullOrEmpty(content))
                {
                    xmlNews.AppendLine($"<News>{System.Security.SecurityElement.Escape(content)}</News>");
                }
                xmlNews.AppendLine($"<NewsLink>{newsLink}</NewsLink>");
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    xmlNews.AppendLine($"<ImageUrl>{System.Security.SecurityElement.Escape(imageUrl)}</ImageUrl>");
                }
                xmlNews.AppendLine($"<NewsDate>{formattedDate}</NewsDate>");
                if (!string.IsNullOrEmpty(tags))
                {
                    xmlNews.AppendLine($"<Tags>{System.Security.SecurityElement.Escape(tags)}</Tags>");
                    xmlNews.AppendLine($"<Categories>{System.Security.SecurityElement.Escape(Category)}</Categories>");
                }
                if (!string.IsNullOrEmpty(description))
                {
                    xmlNews.AppendLine($"<Description>{System.Security.SecurityElement.Escape(description)}</Description>");
                }
                if (!string.IsNullOrEmpty(AuthotName))
                {
                    xmlNews.AppendLine($"<AuthotName>{System.Security.SecurityElement.Escape(AuthotName)}</AuthotName>");
                }

                xmlNews.AppendLine($"<NewsID>{newsID}</NewsID>");
                xmlNews.AppendLine($"<OnBlog>{OnBlog}</OnBlog>");
                
                xmlNews.AppendLine("</MettisGlobalNews>");
                xmlResponse.AppendLine(xmlNews.ToString());
            }
            xmlResponse.AppendLine("</DocumentElement>");
            return xmlResponse.ToString();
        }


        public string GenerateNews_CustomText(DataTable dt)
        {
            if (dt.Rows.Count == 0)
                return string.Empty;

            var newsText = new StringBuilder();
            string title = HtmlDecodeSafe(dt.Rows.Count > 0 ? dt.Rows[0].ItemArray[6]?.ToString() : "N/A")?.Replace("\"", string.Empty);
            string imageUrl = dt.Rows.Count > 1 ? HtmlDecodeSafe(dt.Rows[1].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            string content = dt.Rows.Count > 2 ? HtmlDecodeSafe(dt.Rows[2].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            string graph = dt.Rows.Count > 3 ? HtmlDecodeSafe(dt.Rows[3].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            string table = dt.Rows.Count > 4 ? HtmlDecodeSafe(dt.Rows[4].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            newsText.AppendLine("Title: " + title);
            newsText.AppendLine("Image URL: " + imageUrl);
            newsText.AppendLine("Content: " + content);
            newsText.AppendLine("Graph: " + graph);
            newsText.AppendLine("Table: " + table);
            newsText.AppendLine("---------------------------" + (sender ?? "N/A") + "----------------------------------");

            return newsText.ToString();
        }


        private string HtmlDecodeSafe(string input)
        {
            return string.IsNullOrEmpty(input) ? input : WebUtility.HtmlDecode(input);
        }
        #endregion

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RssFeedService is stopping.");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        internal string GenerateNews_NewsMLG2(List<MGNews.MGNews> newsList)
        {
            throw new NotImplementedException();
        }

     
    }
    
    public class feedUrls
    {
        public string? ID { get; set; }
        public string? FeedURL { get; set; }
        public string? feed_name { get; set; }
        public string? Format_ID { get; set; }
    }


}