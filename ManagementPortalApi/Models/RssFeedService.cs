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
namespace ManagementPortalApi.Models
{

    public class RssFeedService : IHostedService, IDisposable
    {
        string sender = (Environment.GetEnvironmentVariable("sender") != null ? Environment.GetEnvironmentVariable("sender").ToString() : "");
        string origin = (Environment.GetEnvironmentVariable("origin") != null ? Environment.GetEnvironmentVariable("origin").ToString() : "");
        string NewsMLG2Namespace = (Environment.GetEnvironmentVariable("NewsMLG2Namespace") != null ? Environment.GetEnvironmentVariable("NewsMLG2Namespace").ToString() : "");
        string NewsMLG2Version = (Environment.GetEnvironmentVariable("NewsMLG2Version") != null ? Environment.GetEnvironmentVariable("NewsMLG2Version").ToString() : "");
        string NewsMLG1Namespace = (Environment.GetEnvironmentVariable("NewsMLG1Namespace") != null ? Environment.GetEnvironmentVariable("NewsMLG1Namespace").ToString() : "");
        string NewsMLG1Version = (Environment.GetEnvironmentVariable("NewsMLG1Version") != null ? Environment.GetEnvironmentVariable("NewsMLG1Version").ToString() : "");
        string NewsMLG1NewsEnvelope = (Environment.GetEnvironmentVariable("NewsMLG1NewsEnvelope") != null ? Environment.GetEnvironmentVariable("NewsMLG1NewsEnvelope").ToString() : "");
        string NewsAtomNamespace = (Environment.GetEnvironmentVariable("NewsAtomNamespace") != null ? Environment.GetEnvironmentVariable("NewsAtomNamespace").ToString() : "");
        string RSS2MettisLink = (Environment.GetEnvironmentVariable("RSS2MettisLink") != null ? Environment.GetEnvironmentVariable("RSS2MettisLink").ToString() : "");
        string MettisRSSDescription = (Environment.GetEnvironmentVariable("MettisRSSDescription") != null ? Environment.GetEnvironmentVariable("MettisRSSDescription").ToString() : "");



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
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RssFeedService is starting.");
            _timer = new Timer(ProcessFeeds, null, TimeSpan.Zero, TimeSpan.FromMinutes(15)); // Run every 10 minutes
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

            // Initialize variables for different fields
            List<string> headlines = new List<string>();
            List<string> contents = new List<string>();
            List<string> descriptions = new List<string>();
            List<string> images = new List<string>();
            HashSet<string> graphData = new HashSet<string>(); // For graph data
            HashSet<string> existingTableNames = new HashSet<string>(); // To track table names
            List<XElement> tables = new List<XElement>(); // For table data

            // Initialize Graph metadata
            string graphtitle = string.Empty;
            string graphsubtitle = string.Empty;
            string graphid = string.Empty;

            // Initialize Slugs and Tags
            HashSet<string> uniqueSlugs = new HashSet<string>();
            HashSet<string> uniqueTags = new HashSet<string>();

            // Loop through the rows and dynamically assign content based on formid
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

            // Create the XML structure with slugs and tags data
            // Create the XML structure with slugs and tags data
            XDocument xmlDoc = new XDocument(
                new XElement(ns + "newsMessage",
                    new XAttribute("version", "2.0"),
                    new XElement(ns + "header",
                        new XElement(ns + "sender", "Mettis Global News"),
                        new XElement(ns + "sent", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")),
                        new XElement(ns + "source", "Mettis Global News"),
                        new XElement(ns + "origin", "Mettis Global News Platform")
                    ),
                    new XElement(ns + "itemSet",
                        new XElement(ns + "newsItem",
                            new XElement(ns + "contentMeta",
                                headlines.Count > 0 ? headlines.Select(h => new XElement(ns + "headline", h)) : null,
                                new XElement(ns + "language", new XAttribute("tag", "en")),
                                new XElement(ns + "genre", new XAttribute("qcode", "n genre:financial")),
                                new XElement(ns + "credit", "MettisGlobalNews"),
                                // Add slugs data here
                                uniqueSlugs.Count > 0 ? new XElement(ns + "slugs", uniqueSlugs.Select(s => new XElement(ns + "slug", s))) : null,
                                // Add tags data here
                                uniqueTags.Count > 0 ? new XElement(ns + "tags", uniqueTags.Select(t => new XElement(ns + "tag", t))) : null
                            ),
                            new XElement(ns + "contentSet",
                                new XElement(ns + "inlineXML",
                                    // Add descriptions and contents
                                    descriptions.Count > 0 ? descriptions.Select(d => new XElement(ns + "description", d)) : null,
                                    contents.Count > 0 ? contents.Select(c => new XElement(ns + "content", c)) : null,
                                    // Add images if present
                                    images.Count > 0 ? images.Select(img => new XElement(ns + "image", new XElement(ns + "url", HtmlDecodeSafe(img)))) : null,
                                    // Add graph data
                                    graphData.Count > 0 ? new XElement(ns + "graphData",
                                        new XElement(ns + "graphtitle", graphtitle),
                                        new XElement(ns + "graphsubtitle", graphsubtitle),
                                        new XElement(ns + "graphid", graphid),
                                        string.Join(",", graphData)) : null,
                                    // Add tables
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

            // Decoding and sanitizing inputs
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
                    new XElement(ns + "NewsEnvelope",
                        new XElement(ns + "TransmissionID", Guid.NewGuid().ToString()),
                        new XElement(ns + "SentDate", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")),
                        new XElement(ns + "Sender", "MettisGlobalNews")
                    ),
                    new XElement(ns + "NewsItem",
                        new XAttribute("NewsItemID", Guid.NewGuid().ToString()),
                        new XAttribute("DateAndTime", ((DateTime?)row["CreatedDate"])?.ToString("yyyy-MM-ddTHH:mm:ss") ?? string.Empty),
                        new XElement(ns + "Identification",
                            new XElement(ns + "NewsIdentifier",
                                new XElement(ns + "ProviderId", "MettisGlobalNews"),
                                new XElement(ns + "DateId", DateTime.UtcNow.ToString("yyyyMMdd")),
                                new XElement(ns + "NewsItemId", Guid.NewGuid().ToString()),
                                new XElement(ns + "RevisionId", "1")
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

                                    // Adding images if available
                                    !string.IsNullOrEmpty(imageUrls) ? new XElement(ns + "images",
                                        from imageUrl in imageUrls.Split(',')
                                        select new XElement(ns + "image", imageUrl.Trim())
                                    ) : null,

                                    // Adding graph content if available
                                    !string.IsNullOrEmpty(graphContent) ? new XElement(ns + "graphContent", graphContent) : null,

                                    // Adding table content if available
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
            // Define the Atom namespace
            XNamespace atomNs = "http://www.w3.org/2005/Atom";

            // Return an empty string if the DataTable has no rows
            if (dt == null || dt.Rows.Count == 0)
                return string.Empty;

            // Create the root <feed> element
            XElement feed = new XElement(atomNs + "feed",
                new XElement(atomNs + "title", "News Feed"), // Feed title
                new XElement(atomNs + "updated", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss") + "Z"), // Current UTC time
                new XElement(atomNs + "id", "urn:uuid:" + Guid.NewGuid()), // Unique identifier for the feed
                new XElement(atomNs + "author",
                    new XElement(atomNs + "name", "MettisGlobalNews") // Default author name
                )
            );

            // Iterate through each row in the DataTable and create <entry> elements
            foreach (DataRow row in dt.Rows)
            {
                // Decode and sanitize input values
                string title = HttpUtility.HtmlDecode(row["Title"]?.ToString() ?? string.Empty).Replace("\"", string.Empty);
                string summary = HttpUtility.HtmlDecode(row["Metadescription"]?.ToString() ?? string.Empty).Replace("\"", string.Empty);
                string content = HttpUtility.HtmlDecode(row["Content"]?.ToString() ?? string.Empty).Replace("\"", string.Empty);
                string link = row["Link"]?.ToString() ?? "https://example.com"; // Use a default link if none is provided
                string author = row["Author"]?.ToString() ?? "Unknown Author";
                DateTime? publishedDate = row["Createddate"] as DateTime?;

                // Create the <entry> element for the current row
                XElement entry = new XElement(atomNs + "entry",
                    new XElement(atomNs + "title", title), // Entry title
                    new XElement(atomNs + "link", new XAttribute("href", link)), // Entry link
                    new XElement(atomNs + "id", "urn:uuid:" + (row["GUID"] ?? Guid.NewGuid().ToString())), // Unique identifier
                    new XElement(atomNs + "updated", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss") + "Z"), // Last updated time
                    new XElement(atomNs + "published", publishedDate?.ToString("yyyy-MM-ddTHH:mm:ss") + "Z" ?? string.Empty), // Published time
                    new XElement(atomNs + "summary", summary), // Summary of the entry
                    new XElement(atomNs + "author",
                        new XElement(atomNs + "name", author) // Author name
                    ),
                    new XElement(atomNs + "content", new XAttribute("type", "html"), content) // Content (HTML allowed)
                );

                // Add the <entry> element to the feed
                feed.Add(entry);
            }

            // Create the XDocument and return its string representation
            XDocument atomDoc = new XDocument(feed);
            return atomDoc.ToString(SaveOptions.None);
        }


        public string GenerateNews_RSS2(DataTable dt)
        {
            // Return an empty string if the DataTable is empty
            if (dt == null || dt.Rows.Count == 0)
                return string.Empty;

            // Helper function to decode HTML and sanitize strings
            string HtmlDecodeSafe(string input) => HttpUtility.HtmlDecode(input ?? string.Empty)?.Replace("\"", string.Empty);

            // Prepare metadata for the channel
            string channelTitle = "Mettis Global RSS Feed";
            string channelLink = "https://www.mettisglobal.com";
            string channelDescription = "Latest news updates from Mettis Global";
            string language = "en-us";

            // Create the root <rss> element
            XDocument rssDoc = new XDocument(
                new XElement("rss",
                    new XAttribute("version", "2.0"),
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

            // Get a reference to the <channel> element
            XElement channel = rssDoc.Root.Element("channel");

            // Iterate over each row in the DataTable to create <item> elements
            foreach (DataRow row in dt.Rows)
            {
                // Decode and sanitize values
                string title = HtmlDecodeSafe(row["Title"]?.ToString());
                string link = HtmlDecodeSafe(row["Link"]?.ToString());
                string guid = row["GUID"]?.ToString() ?? Guid.NewGuid().ToString();
                string pubDate = ((DateTime?)row["Createddate"])?.ToString("R") ?? string.Empty;
                string description = HtmlDecodeSafe(row["Metadescription"]?.ToString());
                string author = HtmlDecodeSafe(row["Author"]?.ToString());
                string content = HtmlDecodeSafe(row["Content"]?.ToString());
                string table = HtmlDecodeSafe(row["Table"]?.ToString());
                string imageUrls = HtmlDecodeSafe(row["ImageUrls"]?.ToString());

                // Create the <item> element
                XElement item = new XElement("item",
                    new XElement("title", title),
                    new XElement("link", link),
                    new XElement("guid", guid),
                    new XElement("pubDate", pubDate),
                    new XElement("description", description),
                    new XElement("author", author)
                );

                // Add optional <content> and <table> elements if they exist
                if (!string.IsNullOrEmpty(content))
                    item.Add(new XElement("content", content));

                if (!string.IsNullOrEmpty(table))
                    item.Add(new XElement("table", table));

                // Add optional <image> elements if image URLs exist
                if (!string.IsNullOrEmpty(imageUrls))
                {
                    XElement imageElement = new XElement("image");
                    foreach (string imageUrl in imageUrls.Split(','))
                    {
                        imageElement.Add(new XElement("url", imageUrl.Trim()));
                    }
                    item.Add(imageElement);
                }

                // Add the <item> element to the <channel>
                channel.Add(item);
            }

            // Return the RSS feed as a string
            return rssDoc.ToString(SaveOptions.None);
        }

        public string GenerateNews_JSON(DataTable dt)
        {
            if (dt == null || dt.Rows.Count == 0)
                return string.Empty;

            // Helper function to decode HTML and sanitize strings
            string HtmlDecodeSafe(string input) => HttpUtility.HtmlDecode(input ?? string.Empty)?.Replace("\"", string.Empty);

            // List to hold all news items
            //var newsItems = new List<object>();

            //foreach (DataRow row in dt.Rows)
            //{
            //    // Decode and sanitize values
            //    string title = HtmlDecodeSafe(row["Title"]?.ToString());
            //    string imageUrl = HtmlDecodeSafe(row["ImageUrls"]?.ToString());
            //    string content = HtmlDecodeSafe(row["Content"]?.ToString());
            //    string graph = HtmlDecodeSafe(row["Graph"]?.ToString());
            //    string table = HtmlDecodeSafe(row["Table"]?.ToString());
            //    string guid = row["GUID"]?.ToString() ?? Guid.NewGuid().ToString();
            //    string pubDate = ((DateTime?)row["Createddate"])?.ToString("yyyy-MM-ddTHH:mm:ss") ?? DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
            //    string author = HtmlDecodeSafe(row["Author"]?.ToString());
            //    string source = "https://www.mettisglobal.com";

            //    // Create the news item object
            //    var newsItem = new
            //    {
            //        title = title,
            //        imageUrl = imageUrl,
            //        content = content,
            //        graph = graph,
            //        table = table,
            //        guid = guid,
            //        pubDate = pubDate,
            //        author = author,
            //        source = source
            //    };

            //    // Add to the list
            //    newsItems.Add(newsItem);
            //}

            // Serialize all news items to JSON format
            //var jsonOutput = Newtonsoft.Json.JsonConvert.SerializeObject(new
            //{
            //    //news = newsItems
            //}, Newtonsoft.Json.Formatting.Indented);
            var jsondata = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            return jsondata;
        }

        public string GenerateNews_CustomText(DataTable dt)
        {
            if (dt.Rows.Count == 0)
                return string.Empty;

            var newsText = new StringBuilder();

            // Handling potential null or empty values, ensuring no unwanted quotes
            string title = HtmlDecodeSafe(dt.Rows.Count > 0 ? dt.Rows[0].ItemArray[6]?.ToString() : "N/A")?.Replace("\"", string.Empty);
            string imageUrl = dt.Rows.Count > 1 ? HtmlDecodeSafe(dt.Rows[1].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            string content = dt.Rows.Count > 2 ? HtmlDecodeSafe(dt.Rows[2].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            string graph = dt.Rows.Count > 3 ? HtmlDecodeSafe(dt.Rows[3].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";
            string table = dt.Rows.Count > 4 ? HtmlDecodeSafe(dt.Rows[4].ItemArray[6]?.ToString())?.Replace("\"", string.Empty) : "N/A";

            // Append the formatted news text
            newsText.AppendLine("Title: " + title);
            newsText.AppendLine("Image URL: " + imageUrl);
            newsText.AppendLine("Content: " + content);
            newsText.AppendLine("Graph: " + graph);
            newsText.AppendLine("Table: " + table);

            // Add sender information, ensuring it defaults to "N/A" if null
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
    }
    
    public class feedUrls
    {
        public string? ID { get; set; }
        public string? FeedURL { get; set; }
        public string? feed_name { get; set; }
        public string? Format_ID { get; set; }
    }


}