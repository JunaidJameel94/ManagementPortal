using System.Collections.Specialized;
using System.Data;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using ManagementPortalApi.Context;
using ManagementPortalApi.Models;
using ManagementPortalApi.Models.Authentication;
using ManagementPortalApi.Models.MGNews;
using ManagementPortalApi.Models.Settings;
using ManagementPortalApi.RateLimiting;
using ManagementPortalApi.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ManagementPortalApi.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/{controller}/{action}/{id:int?}")]
    [ApiController]
    public class ApiUserEndPointController : ControllerBase
    {
        private readonly DataAccessLayer _DAL;
        private readonly RssFeedService _rssFeedService;
        private readonly ILogger<SettingsController> _logger;

        public ApiUserEndPointController(DataAccessLayer DAL, RssFeedService rssFeedService, ILogger<SettingsController> logger)
        {
            _DAL = DAL;
            _rssFeedService = rssFeedService;
            _logger = logger;
        }

        #region Activity Log
        public void SystemActivityLog(int? ActivityID, string? ActivityDetails)
        {
            bool Result = false;

            ClaimsPrincipal claimsPrincipal = HttpContext.User;
            string HostName = Dns.GetHostName();
            IPHostEntry HostIPs = Dns.GetHostEntry(HostName);
            string IPAddress = HostIPs.AddressList[0].ToString();
            string UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
            var routeData = HttpContext.Request.RouteValues;
            string controllerName = routeData["controller"].ToString();
            string actionName = routeData["action"].ToString();
            string FormName = controllerName + "/" + actionName;
            string ActivityDetailsComplete = IPAddress + " " + ActivityDetails + " " + FormName;

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FormID-INT", "0");
                nv.Add("ActivityID-INT", ActivityID.ToString());
                nv.Add("UserID-INT", UserID);
                nv.Add("ActivityDetails-VARCHAR", ActivityDetailsComplete);
                Result = _DAL.InsertData("sp_insert_activitylog", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                _logger.LogInformation("{0} {1} {2}", controllerName, MethodBase.GetCurrentMethod().Name, ActivityDetailsComplete);
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2} {3}", controllerName, MethodBase.GetCurrentMethod().Name, ActivityDetailsComplete, ex.Message);
            }
        }
        #endregion

        #region NEWS API ACCESSS
        //[HttpGet]
        //public IActionResult GetRSSFeedByExternal(string FormatID ,string? NewsID,  string? Count,string? Category, string? TagName, string? SlugName, string? StartDate = null, string? EndDate = null)
        //{
        //    DataTable dt = new DataTable();
        //    try
        //    {
        //        ClaimsPrincipal claimsPrincipal = HttpContext.User;
        //        var ApiDelay = (from cl in claimsPrincipal.Claims where cl.Type == "ApiDelay" select cl.Value).FirstOrDefault();
        //        var AccessLevel = (from cl in claimsPrincipal.Claims where cl.Type == "AccessLevel" select cl.Value).FirstOrDefault();
        //        NameValueCollection nv = new NameValueCollection();
        //        nv.Add("ApiDelay-VARCHAR", ApiDelay);

        //        // Handle dynamic Count
        //        if (!string.IsNullOrEmpty(Count))
        //        {
        //            nv.Add("TopN-VARCHAR", Count);
        //        }
        //        if (!string.IsNullOrEmpty(Category))
        //        {
        //            nv.Add("Category-VARCHAR", Category);
        //        }
        //        if (!string.IsNullOrEmpty(NewsID))
        //        {
        //            nv.Add("NewsID-VARCHAR", NewsID);
        //        }

        //        if (!string.IsNullOrEmpty(SlugName))
        //        {
        //            nv.Add("SlugName-NVARCHAR", SlugName);
        //        }

        //        // Handle dynamic StartDate
        //        if (!string.IsNullOrEmpty(StartDate))
        //        {
        //            nv.Add("StartDate-DATETIME", StartDate);
        //        }

        //        // Handle dynamic EndDate
        //        if (!string.IsNullOrEmpty(EndDate))
        //        {
        //            nv.Add("EndDate-DATETIME", EndDate);
        //        }

        //        // Handle dynamic TagName
        //        if (!string.IsNullOrEmpty(TagName))
        //        {
        //            nv.Add("TagName-NVARCHAR", TagName);
        //        }

        //        string storedProcedure = string.Empty;

        //        // Refined conditions for stored procedure selection based on parameters
        //        if (!string.IsNullOrEmpty(Count))
        //        {
        //            storedProcedure = "sp_select_top_news";  //perfect
        //        }
        //        if (!string.IsNullOrEmpty(Category))
        //        {
        //            storedProcedure = "sp_select_top_news_by_category";  //perfect
        //        }


        //        if (!string.IsNullOrEmpty(NewsID))
        //        {
        //            storedProcedure = "sp_select_news_byid";  //perfect
        //        }


        //        else if (!string.IsNullOrEmpty(TagName))
        //        {
        //            storedProcedure = "sp_get_news_by_tagname";
        //        }   
        //        else if (!string.IsNullOrEmpty(SlugName))
        //        {
        //            storedProcedure = "sp_get_news_by_slugname";
        //        }
        //        else if (!string.IsNullOrEmpty(StartDate) && string.IsNullOrEmpty(EndDate))
        //        {
        //            storedProcedure = "sp_get_news_by_startdate_apidelay";
        //        }
        //        else if (string.IsNullOrEmpty(StartDate) && !string.IsNullOrEmpty(EndDate))
        //        {
        //            storedProcedure = "sp_get_news_by_enddate_apidelay";
        //        }
        //        else if (!string.IsNullOrEmpty(StartDate) && !string.IsNullOrEmpty(EndDate))
        //        {
        //            storedProcedure = "sp_get_news_by_daterange_apidelay";
        //        }


        //        // Call the corresponding stored procedure
        //        dt = _DAL.GetData(storedProcedure, nv, _DAL.CSManagementPortalDatabase);

        //        if (dt == null || dt.Rows.Count == 0)
        //        {
        //            SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + storedProcedure);
        //        }
        //        else
        //        {
        //            SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + storedProcedure);
        //        }

        //        if (dt == null || dt.Rows.Count == 0)
        //        {
        //            return NotFound("No news found for the provided parameters.");
        //        }


        //        string response = string.Empty;

        //        switch (FormatID)
        //        {
        //            case "NewsML-G2":
        //                response = _rssFeedService.GenerateNews_NewsMLG2(dt);
        //                return Content(response, "application/xml");

        //            case "NewsML-G1":
        //                response = _rssFeedService.GenerateNews_NewsMLG1(dt);
        //                return Content(response, "application/xml");

        //            case "Atom":
        //                response = _rssFeedService.GenerateNews_Atom(dt);
        //                return Content(response, "application/atom+xml");

        //            case "RSS2":
        //                response = _rssFeedService.GenerateNews_RSS2(dt);
        //                return Content(response, "application/rss+xml");

        //            case "JSON":
        //                response = _rssFeedService.GenerateNews_JSON(dt);
        //                return Content(response, "application/json");

        //            case "XML":
        //                response = _rssFeedService.GenerateNews_XML(dt);
        //                return Content(response, "application/json");

        //            case "CustomText":
        //                response = _rssFeedService.GenerateNews_CustomText(dt);
        //                return Content(response, "text/plain");

        //            default:
        //                return BadRequest("Invalid format ID.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
        //        SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
        //        return BadRequest("RSS News Feed Not Generated. Please Contact System Administrator: " + ex.Message);
        //    }
        //}


        [HttpGet]
        public IActionResult GetNews(string FormatID, string? NewsID, string? Count, string? Highligted, string? Category, string? TagName, string? SlugName, string? StartDate = null, string? EndDate = null)
        {

            ClaimsPrincipal claimsPrincipal = HttpContext.User;
            var ApiDelay = (from cl in claimsPrincipal.Claims where cl.Type == "ApiDelay" select cl.Value).FirstOrDefault();
            var AccessLevel = (from cl in claimsPrincipal.Claims where cl.Type == "AccessLevel" select cl.Value).FirstOrDefault();

            NameValueCollection nv = new NameValueCollection();
            nv.Clear();
            nv.Add("ApiDelay-INT", ApiDelay);

            // Handle dynamic Count
            if (!string.IsNullOrEmpty(Count))
            {
                nv.Add("TopN-INT", Count);
            }
            if (!string.IsNullOrEmpty(Category))
            {
                nv.Add("Category-NVARCHAR", Category);
            }
            if (!string.IsNullOrEmpty(Highligted))
            {
                nv.Add("Highligted-INT", Highligted);
            }
            if (!string.IsNullOrEmpty(NewsID))
            {
                nv.Add("NewsID-INT", NewsID);
            }

            if (!string.IsNullOrEmpty(SlugName))
            {
                nv.Add("SlugName-NVARCHAR", SlugName);
            }

            // Handle dynamic StartDate
            if (!string.IsNullOrEmpty(StartDate))
            {
                nv.Add("StartDate-DATETIME", StartDate);
            }

            // Handle dynamic EndDate
            if (!string.IsNullOrEmpty(EndDate))
            {
                nv.Add("EndDate-DATETIME", EndDate);
            }

            // Handle dynamic TagName
            if (!string.IsNullOrEmpty(TagName))
            {
                nv.Add("TagName-NVARCHAR", TagName);
            }

            DataTable dtmain = new DataTable();
            try
            {
                List<MGNews> newsList = new List<MGNews>();

                dtmain = _DAL.GetData("sp_select_news_main", nv, _DAL.CSManagementPortalDatabase);

                if (dtmain != null && dtmain.Rows.Count > 0)
                {
                    string newsIds = string.Join(",", dtmain.AsEnumerable().Select(row => row["newsid"].ToString()));
                    DataTable dtnewscontentmain = new DataTable();
                    nv.Clear();
                    nv.Add("NewsID-INT", newsIds);
                    dtnewscontentmain = _DAL.GetData("sp_select_newscontent_main", nv, _DAL.CSManagementPortalDatabase);

                    DataTable tagdatatable = new DataTable();
                    nv.Clear();
                    nv.Add("NewsID-INT", newsIds);
                    tagdatatable = _DAL.GetData("sp_select_tagmain", nv,_DAL.CSManagementPortalDatabase);


                    DataTable slugdatatable = new DataTable();
                    nv.Clear();
                    nv.Add("NewsID-INT", newsIds);
                    slugdatatable = _DAL.GetData("sp_select_slugmain", nv, _DAL.CSManagementPortalDatabase);


                    if (dtnewscontentmain != null && dtnewscontentmain.Rows.Count > 0)

                        foreach (DataRow row in dtmain.Rows)
                        {
                            string FNewsID = row["newsid"].ToString();
                            DataRow[] dtContentByNews = dtnewscontentmain.Select("newsid = " + FNewsID);
                            MGNews mGNews = new MGNews();
                            mGNews.NewsID = Convert.ToInt32(row["newsid"]);
                            mGNews.CategoryID = row["categoryid"].ToString();
                            mGNews.CategoryName = row["category_name"].ToString();
                            mGNews.AurthorID = row["authorid"].ToString();
                            mGNews.AurthorName = row["authorname"].ToString();
                            mGNews.Link = row["link"].ToString();
                            mGNews.PublishedTime = Convert.ToDateTime(row["PublishedTime"]);
                            mGNews.Headings = new Headings{Heading = dtContentByNews.AsEnumerable().Where(x => x["newsid"].ToString() == FNewsID && x["formname"].ToString() == "Heading").Select(x => x["newscontent"].ToString()).ToList<string>()};                          
                            mGNews.Descriptions = new Descriptions {Description = dtContentByNews.AsEnumerable().Where(x => x["newsid"].ToString() == FNewsID && x["formname"].ToString() == "Description").Select(x => x["newscontent"].ToString()).ToList<string>() };
                            mGNews.Contents =new Contents { Content = dtContentByNews.AsEnumerable().Where(x => x["newsid"].ToString() == FNewsID && x["formname"].ToString() == "Content").Select(x => x["newscontent"].ToString()).ToList<string>() };
                            mGNews.Images = new Images { Image = dtContentByNews.AsEnumerable().Where(x => x["newsid"].ToString() == FNewsID && x["formname"].ToString() == "Image").Select(x => x["newscontent"].ToString()).ToList<string>() };

                            if (tagdatatable != null && tagdatatable.Rows.Count > 0)
                            {
                                mGNews.Tags = new Tags { Tag = tagdatatable.AsEnumerable().Where(x => x["NewsID"].ToString() == FNewsID).Select(x => new Tag { TagName = x["TagName"].ToString(), TagType = x["TypeName"].ToString()}).ToList<Tag>()};

                            }

                            if (slugdatatable != null && slugdatatable.Rows.Count > 0)
                            {
                                mGNews.Slugs = new Slugs { Slug = slugdatatable.AsEnumerable().Where(x => x["NewsID"].ToString() == FNewsID).Select(x => new Slug { SlugName = x["SlugName"].ToString(), SlugType = x["TypeName"].ToString() }).ToList<Slug>() };
                            }
                            newsList.Add(mGNews);
                        }
                }
                if (dtmain != null && dtmain.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_news_main");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_news_main");
                }
                if (dtmain == null || dtmain.Rows.Count == 0)
                {
                    return NotFound("No news found for the provided parameters.");
                }
                string response = string.Empty;

                switch (FormatID)
                {
  

                    case "JSON":
                        response = _rssFeedService.GenerateNews_JSON(newsList);
                        return Content(response, "application/json");

                  

                    default:
                        return BadRequest("Invalid format ID.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dtmain);
        }
        #endregion
    }

}


