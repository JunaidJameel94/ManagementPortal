using ManagementPortalApi.Context;
using ManagementPortalApi.Extensions;
using ManagementPortalApi.Models;
using ManagementPortalApi.Models.Settings;
using ManagementPortalApi.RateLimiting;
using ManagementPortalApi.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Data;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Web;

namespace ManagementPortalApi.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/{controller}/{action}/{id:int?}")]
    [ApiController]
    public class FeedController : ControllerBase
    {
        private readonly DataAccessLayer _DAL;
        private readonly ILogger<SettingsController> _logger;
        private readonly DataEncryptor _dataencryptor;
        private readonly RandomStringGenerator _randomstringgenerator;
        private readonly NewsAI _newsAI;
        private readonly RssFeedService _rssFeedService;

        public FeedController(DataAccessLayer DAL, ILogger<SettingsController> logger, DataEncryptor dataencryptor, RandomStringGenerator randomstringgenerator, NewsAI newsAI, RssFeedService rssFeedService)
        {
            _DAL = DAL;
            _logger = logger;
            _dataencryptor = dataencryptor;
            _randomstringgenerator = randomstringgenerator;
            _newsAI = newsAI;
            _rssFeedService = rssFeedService;
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

        #region Feed Management
        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetFeedALLData(int pageNumber = 1, int pageSize = 40)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("PageNumber-INT", pageNumber.ToString());
                nv.Add("PageSize-INT", pageSize.ToString());

                dt = _DAL.GetData("sp_select_feedalldata", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_feedalldata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_feedalldata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Kuch Galat Ho Gaya Hai, Kripya Apne System Administrator Se Sampark Karein");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetFeedTEXTData(int pageNumber = 1, int pageSize = 40)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("PageNumber-INT", pageNumber.ToString());
                nv.Add("PageSize-INT", pageSize.ToString());

                dt = _DAL.GetData("sp_select_feedtextdata", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_feedtextdata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_feedtextdata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Kuch Galat Ho Gaya Hai, Kripya Apne System Administrator Se Sampark Karein");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetFeedImageData(int pageNumber = 1, int pageSize = 40)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("PageNumber-INT", pageNumber.ToString());
                nv.Add("PageSize-INT", pageSize.ToString());

                dt = _DAL.GetData("sp_select_feedimagedata", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_feedimagedata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_feedimagedata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Kuch Galat Ho Gaya Hai, Kripya Apne System Administrator Se Sampark Karein");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult DetailFeedDataByID(string FeedID)
        {
            DataTable dt = new DataTable();

            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FeedID-INT", FeedID);
                dt = _DAL.GetData("sp_detail_feeddata", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_detail_feeddata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_detail_feeddata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetFeedDataBySearchKeyWord(string? SearchKeyword, string? SelectItem)
        {
            DataTable dt = new DataTable();

            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("SearchKeyword-NVARCHAR", (SearchKeyword != null ? SearchKeyword : "NULL"));
                nv.Add("SelectItem-NVARCHAR", (SelectItem != null ? SelectItem : "NULL"));
                dt = _DAL.GetData("sp_select_feeddata_searchkeyword", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_feeddata_searchkeyword");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_feeddata_searchkeyword");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetFeedDataByfilter([FromQuery] string? Category, string? StartDate, string? EndDate, string? SourceID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Add("Category-NVARCHAR", string.IsNullOrEmpty(Category) ? "NULL" : Category);
                nv.Add("SourceID-NVARCHAR", string.IsNullOrEmpty(SourceID) ? "NULL" : SourceID);
                nv.Add("StartDate-DATE", string.IsNullOrEmpty(StartDate) ? "NULL" : StartDate);
                nv.Add("EndDate-DATE", string.IsNullOrEmpty(EndDate) ? "NULL" : EndDate);

                dt = _DAL.GetData("sp_filter_feeddata", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_filter_feeddata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_filter_feeddata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetAllFeedCategory()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_feedcatgrory", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_feedcatgrory");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_feedcatgrory");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetAllFeedSources()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_feedsourcedata", null, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_feedsourcedata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_feedsourcedata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveNewsMetaTag([FromBody] NewsMetaTags newsMetaTags)
        {
            bool Result = false;
            try
            {
                var listoftag = newsMetaTags.TagName.Split(',');
                for (int i = 0; i < listoftag.Length; i++)
                {
                    var TagName = listoftag[i].ToString();


                    NameValueCollection nv = new NameValueCollection();
                    nv.Clear();
                    nv.Add("TagName-NVARCHAR", HttpUtility.HtmlEncode(TagName));
                    nv.Add("FeedID-INT", HttpUtility.HtmlEncode(newsMetaTags.FeedID) ?? "");
                    Result = _DAL.InsertData("sp_insert_feedtags", nv, _DAL.CSManagementPortalDatabase);
                    nv = null;
                }
                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_feedtags");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_feedtags");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }



        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetAllNewsTagEachNews(string FeedID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FeedID-INT", FeedID);
                dt = _DAL.GetData("sp_select_newstag", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_newstag");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_newstag");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveNewsMetaKeywordName([FromBody] NewsMetaKeywords newsMetaKeywords)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("MetaKeyword-NVARCHAR", HttpUtility.HtmlEncode(newsMetaKeywords.MetaKeyword));
                nv.Add("FeedID-INT", HttpUtility.HtmlEncode(newsMetaKeywords.FeedID) ?? "");
                Result = _DAL.InsertData("sp_insert_feedmetakeyword", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_feedmetakeyword");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_feedmetakeyword");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }


        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetAllNewsKeywordEachNews(string FeedID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FeedID-INT", FeedID);
                dt = _DAL.GetData("sp_select_metakeyword_feedId", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_metakeyword_feedId");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_metakeyword_feedId");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_AllNews_Tags()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_allnewstags", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_allnewstags");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_allnewstags");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_AllNews_slugs()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_selectAllSlugs", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_selectAllSlugs");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_selectAllSlugs");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }




        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_AllNews_MetaKeyword()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_allnewsmetakeyword", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_allnewsmetakeyword");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_allnewsmetakeyword");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }


        #endregion

        #region Save Collection Name
        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveCollectionName([FromBody] CollectionName collectionName)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("CollectionName-NVARCHAR", HttpUtility.HtmlEncode(collectionName.Collection_name));
                nv.Add("UserID-INT", collectionName.UserID);
                Result = _DAL.InsertData("sp_save_collectionname", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_save_collectionname");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_save_collectionname");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetCollectionName()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_collectionname", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_collectionname");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_collectionname");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Added_Feed_To_Collection([FromBody] CollectionFeeds collectionFeeds)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("CollectionID-INT", collectionFeeds.CollectionID);
                nv.Add("FeedID-INT", collectionFeeds.FeedID);
                Result = _DAL.InsertData("sp_add_feed_to_collection", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_add_feed_to_collection");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_add_feed_to_collection");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_Feed_By_Collection(string CollectionID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("CollectionID-INT", CollectionID);
                dt = _DAL.GetData("sp_get_feed_by_collection", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_feed_by_collection");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_feed_by_collection");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_Collection_Single_Feed(string FeedID)
        {
            DataTable dt = new DataTable();

            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FeedID-INT", FeedID);
                dt = _DAL.GetData("sp_get_feed_by_signal_collection", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_feed_by_signal_collection");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_feed_by_signal_collection");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteSaveCollectionFeed([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("CollectionID-INT", deleteNewsData.CollectionFeedID);
                nv.Add("FeedID-INT", deleteNewsData.FeedID);
                Result = _DAL.InsertData("sp_delete_collection_feed", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_collection_feed");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_collection_feed");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteCollectionName([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("CollectionID-INT", deleteNewsData.CollectionID);
                nv.Add("UserID-INT", deleteNewsData.UserID);
                Result = _DAL.InsertData("sp_delete_collection_name", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_collection_name");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_collection_name");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(Result);
        }

        #endregion

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetVeiwNews()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_singlenewsdetail", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_singlenewsdetail");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_singlenewsdetail");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        #region Planning
        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetPlanningCategory()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_planning_category", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_planning_category");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_planning_category");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SavePlanning([FromBody] Planning planning)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Title-NVARCHAR", HttpUtility.HtmlEncode(planning.title));
                nv.Add("Description-NVARCHAR", HttpUtility.HtmlEncode(planning.p_description));
                nv.Add("Country-NVARCHAR", HttpUtility.HtmlEncode(planning.country));
                nv.Add("CategoryID-INT", planning.p_categoryid);
                nv.Add("Createdby-INT", planning.createdby);
                nv.Add("PlanningDate-DATETIME", planning.planning_date);
                nv.Add("UserID-INT", planning.UserID);
                nv.Add("PlanningTime-NVARCHAR", planning.PlanningTime);

                Result = _DAL.InsertData("sp_insert_planning", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_planning");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_planning");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetPlanning(string UserID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", UserID);
                dt = _DAL.GetData("sp_select_planning", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_planning");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_planning");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [HttpGet]
        public IActionResult GetPlanningNotification()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_planning_notification", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_planning_notification");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_planning_notification");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetPlanningBySearch(string Search_Keyword)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Search_Keyword-NVARCHAR", Search_Keyword);
                dt = _DAL.GetData("sp_get_planningbysearch", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_planningbysearch");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_planningbysearch");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }
        #endregion

        #region Template Creation
        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveTemplateCreationLayout([FromBody] List<TemplateSaveRequest> templateSaveRequests)
        {
            bool result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                foreach (var templateSaveRequest in templateSaveRequests)
                {
                    NameValueCollection nv = new NameValueCollection();
                    nv.Add("UserID-INT", UserID);
                    nv.Add("TagName-VARCHAR", HttpUtility.HtmlEncode(templateSaveRequest.TagName));
                    nv.Add("Content_ID-INT", templateSaveRequest.Content_ID);
                    nv.Add("Row_ID-INT", templateSaveRequest.Row_ID);
                    nv.Add("Height-VARCHAR", templateSaveRequest.Height);
                    nv.Add("Height_Measures-VARCHAR", templateSaveRequest.Height_Measures);
                    nv.Add("Class_ATTR-VARCHAR", templateSaveRequest.Class_ATTR);
                    nv.Add("Services-VARCHAR", templateSaveRequest.Services);
                    nv.Add("Content-TEXT", templateSaveRequest.Content);
                    nv.Add("Image_Link-TEXT", templateSaveRequest.Image_Link);
                    nv.Add("Data_Columns-VARCHAR", templateSaveRequest.Data_Columns);
                    nv.Add("id-NVARCHAR", templateSaveRequest.id);
                    nv.Add("TypeID-INT", templateSaveRequest.TypeID);
                    nv.Add("Template_ID-INT", templateSaveRequest.Template_ID);
                    nv.Add("Template_Name-NVARCHAR", templateSaveRequest.Template_Name);
                    nv.Add("Inline_Style-NVARCHAR", templateSaveRequest.Inline_Style);
                    nv.Add("chartbgseries-VARCHAR", templateSaveRequest.chartbgseries);
                    result = _DAL.InsertData("sp_insert_templatecreation", nv, _DAL.CSManagementPortalDatabase);
                    if (result)
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_templatecreation");
                    }
                    else
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_templatecreation");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return result ? Ok(result) : BadRequest(result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult UpdateTemplateCreationLayout([FromBody] List<TemplateSaveRequest> templateSaveRequests)
        {
            bool result = false;
            try
            {
                var tem = templateSaveRequests.Select(x => x.Template_ID).FirstOrDefault();

                NameValueCollection nvs = new NameValueCollection();
                nvs.Add("Template_ID-INT", tem);

                result = _DAL.InsertData("sp_delete_templatecreation", nvs, _DAL.CSManagementPortalDatabase);

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var userId = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                foreach (var templateSaveRequest in templateSaveRequests)
                {
                    NameValueCollection nv = new NameValueCollection();
                    nv.Add("UserID-INT", userId);
                    nv.Add("Content_ID-INT", templateSaveRequest.Content_ID);
                    nv.Add("TagName-VARCHAR", HttpUtility.HtmlEncode(templateSaveRequest.TagName));
                    nv.Add("Row_ID-INT", templateSaveRequest.Row_ID);
                    nv.Add("Height-VARCHAR", templateSaveRequest.Height);
                    nv.Add("Height_Measures-VARCHAR", templateSaveRequest.Height_Measures);
                    nv.Add("Class_ATTR-VARCHAR", templateSaveRequest.Class_ATTR);
                    nv.Add("Services-VARCHAR", templateSaveRequest.Services);
                    nv.Add("Content-NVARCHAR", templateSaveRequest.Content);
                    nv.Add("Image_Link-NVARCHAR", templateSaveRequest.Image_Link);
                    nv.Add("Data_Columns-VARCHAR", templateSaveRequest.Data_Columns);
                    nv.Add("id-NVARCHAR", templateSaveRequest.id);
                    nv.Add("TypeID-INT", templateSaveRequest.TypeID);
                    nv.Add("Template_ID-INT", templateSaveRequest.Template_ID);
                    nv.Add("Template_Name-VARCHAR", templateSaveRequest.Template_Name); // Ensure correct type
                    nv.Add("Inline_Style-NVARCHAR", templateSaveRequest.Inline_Style);
                    nv.Add("chartbgseries-VARCHAR", templateSaveRequest.chartbgseries);

                    result = _DAL.InsertData("sp_update_templatecreation", nv, _DAL.CSManagementPortalDatabase);
                    if (result)
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + " sp_update_templatecreation");
                    }
                    else
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + " sp_update_templatecreation");
                        break; // Exit loop if insert fails
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return result ? Ok(result) : BadRequest(result);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetTempleteLayout()
        {
            DataTable dt = new DataTable();
            ClaimsPrincipal claimsPrincipal = HttpContext.User;

            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", UserID);
                dt = _DAL.GetData("sp_get_templatelayout", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    // dt.Rows[0]["TempleteLayout"] = System.Web.HttpUtility.HtmlDecode(dt.Rows[0]["TempleteLayout"].ToString());
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_templatelayout");
                    var jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    return Content(jsonResult, "application/json"); // Return JSON content
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_templatelayout");
                    return NotFound("No layout data found for the specified user.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetWorldNewsData(string serviceworld)
        {
            DataTable dt = new DataTable();
            ClaimsPrincipal claimsPrincipal = HttpContext.User;

            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("serviceworld-VARCHAR", serviceworld);
                dt = _DAL.GetData("sp_select_worldnewstemplate", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    // dt.Rows[0]["TempleteLayout"] = System.Web.HttpUtility.HtmlDecode(dt.Rows[0]["TempleteLayout"].ToString());
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_templatelayout");
                    var jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    return Content(jsonResult, "application/json"); // Return JSON content
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_templatelayout");
                    return NotFound("No layout data found for the specified user.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetUserTemplateDesign(string NewsID)
        {
            DataTable dt = new DataTable();
            ClaimsPrincipal claimsPrincipal = HttpContext.User;

            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", UserID);
                nv.Add("NewsID-INT", NewsID);
                dt = _DAL.GetData("sp_get_user_templates", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    // dt.Rows[0]["TempleteLayout"] = System.Web.HttpUtility.HtmlDecode(dt.Rows[0]["TempleteLayout"].ToString());
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_user_templates");
                    var jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    return Content(jsonResult, "application/json"); // Return JSON content
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_templatelayout");
                    return NotFound("No layout data found for the specified user.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetUserTemplateDesignForNewsCreation()
        {
            DataTable dt = new DataTable();
            ClaimsPrincipal claimsPrincipal = HttpContext.User;

            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", UserID);

                dt = _DAL.GetData("sp_get_user_templatesfornewscreation", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    // dt.Rows[0]["TempleteLayout"] = System.Web.HttpUtility.HtmlDecode(dt.Rows[0]["TempleteLayout"].ToString());
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_user_templatesfornewscreation");
                    var jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    return Content(jsonResult, "application/json"); // Return JSON content
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_user_templatesfornewscreation");
                    return NotFound("No layout data found for the specified user.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetUserTemplateDesignForTemplateCreation()
        {
            DataTable dt = new DataTable();
            ClaimsPrincipal claimsPrincipal = HttpContext.User;

            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", UserID);

                dt = _DAL.GetData("sp_get_user_templatesfortemplatecreation", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    // dt.Rows[0]["TempleteLayout"] = System.Web.HttpUtility.HtmlDecode(dt.Rows[0]["TempleteLayout"].ToString());
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_user_templatesfortemplatecreation");
                    var jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    return Content(jsonResult, "application/json"); // Return JSON content
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_user_templatesfortemplatecreation");
                    return NotFound("No layout data found for the specified user.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetTemplateDesignTemplateID(int Template_ID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Template_ID-INT", Template_ID.ToString());
                dt = _DAL.GetData("sp_get_templatesbytemplateid", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_templatesbytemplateid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_templatesbytemplateid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult SelectTemplateDesignTemplateID(int Template_ID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Template_ID-INT", Template_ID.ToString());
                dt = _DAL.GetData("sp_select_templatesbytemplateid", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_templatesbytemplateid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_templatesbytemplateid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetTemplateDesignInEdit(int NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", NewsID.ToString());
                dt = _DAL.GetData("sp_get_templateDesignEdit", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_templateDesignEdit");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_templateDesignEdit");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetTemplateNameBySearchKeyword(string SearchKeyword = "")
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("SearchKeyword-NVARCHAR", SearchKeyword);
                dt = _DAL.GetData("sp_search_templatename", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_search_templatename");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_search_templatename");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveTemplateBoxType([FromBody] TemplateBoxType templateBoxType)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TypeName-VARCHAR", HttpUtility.HtmlEncode(templateBoxType.TypeName));

                Result = _DAL.InsertData("sp_save_templateboxtype", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_save_templateboxtype");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_save_templateboxtype");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetTemplateBoxType()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_gettemplateboxtype", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_gettemplateboxtype");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_gettemplateboxtype");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetChartBgSeriesColor(string BGSeriesID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-VARCHAR", BGSeriesID);
                dt = _DAL.GetData("sp_GetBgSeriesByID", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_GetBgSeriesByID");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_GetBgSeriesByID");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        #endregion

        #region News Management

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_News_Detail()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_newscreations", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_newscreations");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_newscreations");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGSaveSingleNews([FromBody] News news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }
                NameValueCollection newsParams = new NameValueCollection();
                newsParams.Add("UserID-INT", news.UserID);
                newsParams.Add("TemplateID-INT", news.TemplateID);
                newsParams.Add("NewsStatus-INT", news.NewsStatus);
                newsParams.Add("Islive-BIT", news.Islive);
                var newsResult = _DAL.GetData("sp_insert_singlenews", newsParams, _DAL.CSManagementPortalDatabase);
                if (newsResult.Rows.Count > 0)
                {
                    var newsId = newsResult.Rows[0]["news_id"];
                    // Tags
                    foreach (var tagid in news.TagID)
                    {
                        NameValueCollection tagParams = new NameValueCollection();
                        tagParams.Add("TagID-INT", tagid.ToString());
                        tagParams.Add("NewsID-INT", newsId.ToString());
                        _DAL.InsertData("sp_insert_newstagsmapping", tagParams, _DAL.CSManagementPortalDatabase);
                    }
                    // Slugs
                    foreach (var slugid in news.SlugID)
                    {
                        NameValueCollection slugsParams = new NameValueCollection();
                        slugsParams.Add("SlugID-INT", slugid.ToString());
                        slugsParams.Add("NewsID-INT", newsId.ToString());
                        _DAL.InsertData("sp_insert_newsslugsmapping", slugsParams, _DAL.CSManagementPortalDatabase);
                    }
                    // Insert Graph Data
                    if (!string.IsNullOrEmpty(news.GraphTypeID) &&
                        !string.IsNullOrEmpty(news.GraphTitle) &&
                        !string.IsNullOrEmpty(news.GraphSubtitle))
                    {
                        NameValueCollection graphParams = new NameValueCollection();
                        graphParams.Add("GraphTypeID-INT", news.GraphTypeID);
                        graphParams.Add("GraphTitle-NVARCHAR", news.GraphTitle);
                        graphParams.Add("GraphSubtitle-NVARCHAR", news.GraphSubtitle);
                        graphParams.Add("ShowLegend-BIT", news.ShowLegend);
                        graphParams.Add("NewsID-INT", newsId.ToString());
                        var graphResult = _DAL.GetData("sp_insert_graph", graphParams, _DAL.CSManagementPortalDatabase);
                        var graphId = graphResult; 
                        var graphids = graphResult.Rows[0]["GraphID"];
                        var seriesid = 0;
                        foreach (var series in news.GraphSeries)
                        {
                            string xaxisLabels = string.Join(",", series.XaxisLabel.ToList());
                            string graphValues = string.Join(",", series.GraphValue.ToList());
                            NameValueCollection seriesParams = new NameValueCollection();
                            seriesParams.Add("SeriesID-INT", seriesid++.ToString());
                            seriesParams.Add("GraphID-INT", graphids.ToString());
                            seriesParams.Add("XaxisLabel-NVARCHAR", xaxisLabels);
                            seriesParams.Add("SeriesName-NVARCHAR", series.SeriesName);
                            seriesParams.Add("GraphValue-NVARCHAR", graphValues);
                            seriesParams.Add("SeriesColor-NVARCHAR", string.IsNullOrEmpty(series.SeriesColor) ? "#000000" : series.SeriesColor);

                            _DAL.InsertData("sp_insert_graph_series", seriesParams, _DAL.CSManagementPortalDatabase);
                        }
                    }
                    if (news.TableDatas != null && news.TableDatas.Count > 0)
                    {
                        NameValueCollection tableparam = new NameValueCollection();
                        tableparam.Add("TableName-NVARCHAR", news.tablename);
                        tableparam.Add("ColumnCount-INT", news.columncount);
                        tableparam.Add("RowCount-INT", news.rowscount);
                        tableparam.Add("NewsID-INT", newsId.ToString());
                        var tableresult = _DAL.GetData("sp_insert_html_table", tableparam, _DAL.CSManagementPortalDatabase);
                        var tableid = tableresult.Rows[0]["TableID"];
                        foreach (var tableData in news.TableDatas)
                        {
                            NameValueCollection tabledataparam = new NameValueCollection();
                            tabledataparam.Add("TableID-INT", tableid.ToString());
                            tabledataparam.Add("RowNumber-INT", tableData.rownumber);
                            tabledataparam.Add("ColumnNumber-INT", tableData.columnnumber);
                            tabledataparam.Add("CellContent-NVARCHAR", tableData.cellcontent);
                            tabledataparam.Add("IsHeader-INT", tableData.isheader);
                            _DAL.InsertData("sp_insert_html_table_data", tabledataparam, _DAL.CSManagementPortalDatabase);
                        }
                    }
                    return Ok(new { news_id = newsId });
                }
                return BadRequest("Failed to create news item");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetSingleNewsDetail(int NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", NewsID.ToString());
                dt = _DAL.GetData("sp_getsinglenewsdata", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getsinglenewsdata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getsinglenewsdata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetMultipleNewsDetail(int NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", NewsID.ToString());
                dt = _DAL.GetData("sp_getmultiplenewsdata", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getmultiplenewsdata");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getmultiplenewsdata");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGSaveMultipleNews([FromBody] NewsMultiple news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }

                // Insert News into the database
                NameValueCollection newsParams = new NameValueCollection();
                newsParams.Add("UserID-INT", news.UserID);
                newsParams.Add("TemplateID-INT", news.TemplateID);
                newsParams.Add("NewsStatus-INT", news.NewsStatus);
                newsParams.Add("Islive-BIT", news.Islive);

                var newsResult = _DAL.GetData("sp_insert_singlenews", newsParams, _DAL.CSManagementPortalDatabase);
                if (newsResult.Rows.Count > 0)
                {
                    var newsId = newsResult.Rows[0]["news_id"];

                    // Insert Tags
                    if (news.TagID != null)
                    {
                        foreach (var tagid in news.TagID)
                        {
                            NameValueCollection tagParams = new NameValueCollection();
                            tagParams.Add("TagID-INT", tagid.ToString());
                            tagParams.Add("NewsID-INT", newsId.ToString());
                            _DAL.InsertData("sp_insert_newstagsmapping", tagParams, _DAL.CSManagementPortalDatabase);
                        }
                    }

                    // Insert Slugs
                    if (news.SlugID != null)
                    {
                        foreach (var slugid in news.SlugID)
                        {
                            NameValueCollection slugParams = new NameValueCollection();
                            slugParams.Add("SlugID-INT", slugid.ToString());
                            slugParams.Add("NewsID-INT", newsId.ToString());
                            _DAL.InsertData("sp_insert_newsslugsmapping", slugParams, _DAL.CSManagementPortalDatabase);
                        }
                    }

                    // Insert Graphs and their Series
                    if (news.GraphSeries != null && news.GraphSeries.Count > 0)
                    {
                        foreach (var graph in news.GraphSeries)
                        {
                            NameValueCollection graphParams = new NameValueCollection();
                            graphParams.Add("GraphTypeID-INT", graph.GraphTypeID);
                            graphParams.Add("GraphTitle-NVARCHAR", graph.GraphTitle);
                            graphParams.Add("GraphSubtitle-NVARCHAR", graph.GraphSubtitle);
                            graphParams.Add("ShowLegend-BIT", graph.ShowLegend);
                            graphParams.Add("NewsID-INT", newsId.ToString());

                            var graphResult = _DAL.GetData("sp_insert_graph", graphParams, _DAL.CSManagementPortalDatabase);
                            var graphId = graphResult.Rows[0]["GraphID"];
                            int seriesId = 0;

                            if (graph.GraphSeries != null)
                            {
                                foreach (var series in graph.GraphSeries)
                                {
                                    string xaxisLabels = string.Join(",", series.XaxisLabel);
                                    string graphValues = string.Join(",", series.GraphValue);
                                    NameValueCollection seriesParams = new NameValueCollection();
                                    seriesParams.Add("SeriesID-INT", seriesId++.ToString());
                                    seriesParams.Add("GraphID-INT", graphId.ToString());
                                    seriesParams.Add("XaxisLabel-NVARCHAR", xaxisLabels);
                                    seriesParams.Add("SeriesName-NVARCHAR", series.SeriesName);
                                    seriesParams.Add("GraphValue-NVARCHAR", graphValues);
                                    seriesParams.Add("SeriesColor-NVARCHAR", series.SeriesColor);
                                    _DAL.InsertData("sp_insert_graph_series", seriesParams, _DAL.CSManagementPortalDatabase);
                                }
                            }
                        }
                    }

                    if (news.TablesData != null && news.TablesData.Count > 0)
                    {
                        foreach (var table in news.TablesData)
                        {
                            NameValueCollection tableParams = new NameValueCollection();
                            tableParams.Add("TableName-NVARCHAR", table.tableName);
                            tableParams.Add("ColumnCount-INT", table.columnCount);
                            tableParams.Add("RowCount-INT", table.rowCount);
                            tableParams.Add("NewsID-INT", newsId.ToString());

                            var tableResult = _DAL.GetData("sp_insert_html_table", tableParams, _DAL.CSManagementPortalDatabase);
                            var tableId = tableResult.Rows[0]["TableID"];

                            if (table.data != null)
                            {
                                foreach (var cellData in table.data)
                                {
                                    NameValueCollection tableDataParams = new NameValueCollection();
                                    tableDataParams.Add("TableID-INT", tableId.ToString());
                                    tableDataParams.Add("RowNumber-INT", cellData.rownumber ?? "");
                                    tableDataParams.Add("ColumnNumber-INT", cellData.columnnumber ?? "");
                                    tableDataParams.Add("CellContent-NVARCHAR", cellData.cellcontent ?? "");
                                    tableDataParams.Add("IsHeader-BIT", cellData.isheader ?? "0");
                                    _DAL.InsertData("sp_insert_html_table_data", tableDataParams, _DAL.CSManagementPortalDatabase);
                                }
                            }
                        }
                    }

                    // Return success response with the created news ID
                    return Ok(new { news_id = newsId });
                }

                return BadRequest("Failed to create news item.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGSaveMultipleNewsGraph([FromBody] NewsMultiple news)
        {
            try
            {
                // Insert Graphs and their Series
                if (news.GraphSeries != null && news.GraphSeries.Count > 0)
                {
                    foreach (var graph in news.GraphSeries)
                    {
                        NameValueCollection graphParams = new NameValueCollection();
                        graphParams.Add("GraphTypeID-INT", graph.GraphTypeID);
                        graphParams.Add("GraphTitle-NVARCHAR", graph.GraphTitle);
                        graphParams.Add("GraphSubtitle-NVARCHAR", graph.GraphSubtitle);
                        graphParams.Add("ShowLegend-BIT", graph.ShowLegend);
                        graphParams.Add("NewsID-INT", news.NewsID);

                        var graphResult = _DAL.GetData("sp_insert_graph", graphParams, _DAL.CSManagementPortalDatabase);
                        var graphId = graphResult.Rows[0]["GraphID"];
                        int seriesId = 0;

                        if (graph.GraphSeries != null)
                        {
                            foreach (var series in graph.GraphSeries)
                            {
                                string xaxisLabels = string.Join(",", series.XaxisLabel);
                                string graphValues = string.Join(",", series.GraphValue);
                                NameValueCollection seriesParams = new NameValueCollection();
                                seriesParams.Add("SeriesID-INT", seriesId++.ToString());
                                seriesParams.Add("GraphID-INT", graphId.ToString());
                                seriesParams.Add("XaxisLabel-NVARCHAR", xaxisLabels);
                                seriesParams.Add("SeriesName-NVARCHAR", series.SeriesName);
                                seriesParams.Add("GraphValue-NVARCHAR", graphValues);
                                seriesParams.Add("SeriesColor-NVARCHAR", series.SeriesColor);
                                _DAL.InsertData("sp_insert_graph_series", seriesParams, _DAL.CSManagementPortalDatabase);
                            }
                        }
                        return Ok(new { news_id = news.NewsID });
                    }
                }
                return BadRequest("Failed to create news item.");
            }

            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGUpdateMultipleNews([FromBody] NewsMultiple news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }

                // Step 1: Update news record
                NameValueCollection newsParams = new NameValueCollection();
                newsParams.Add("NewsID-INT", news.NewsID);
                newsParams.Add("UserID-INT", news.UserID);
                newsParams.Add("TemplateID-INT", news.TemplateID);
                newsParams.Add("NewsStatus-INT", news.NewsStatus);
                newsParams.Add("IsLive-BIT", news.Islive);
                var newsResult = _DAL.InsertData("sp_update_singlenews", newsParams, _DAL.CSManagementPortalDatabase);

                // Step 2: Update tags
                foreach (var tagid in news.TagID)
                {
                    NameValueCollection tagParams = new NameValueCollection();
                    tagParams.Add("TagID-INT", tagid.ToString());
                    tagParams.Add("NewsID-INT", news.NewsID);
                    _DAL.InsertData("sp_insert_newstagsmapping", tagParams, _DAL.CSManagementPortalDatabase);
                }

                // Step 3: Update slugs
                foreach (var slugid in news.SlugID)
                {
                    NameValueCollection slugsParams = new NameValueCollection();
                    slugsParams.Add("SlugID-INT", slugid.ToString());
                    slugsParams.Add("NewsID-INT", news.NewsID);

                    _DAL.InsertData("sp_insert_newsslugsmapping", slugsParams, _DAL.CSManagementPortalDatabase);
                }
                // Return success with updated news ID
                return Ok(new { news_id = news.NewsID });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Update_MultipleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            bool result = false;
            try
            {
                NameValueCollection nv1 = new NameValueCollection();
                nv1.Add("NewsID-INT", HttpUtility.HtmlEncode(newsContents[0].NewsID));
                result = _DAL.InsertData("sp_delete_singlenewscontent", nv1, _DAL.CSManagementPortalDatabase);

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                foreach (var newsContent in newsContents)
                {
                    NameValueCollection nv = new NameValueCollection();
                    nv.Add("NewsID-INT", HttpUtility.HtmlEncode(newsContent.NewsID));
                    nv.Add("FormID-INT", newsContent.FormID);
                    nv.Add("NewsContent-NVARCHAR", HttpUtility.HtmlEncode(newsContent.NewsContent));

                    result = _DAL.InsertData("sp_insert_singlenewscontent", nv, _DAL.CSManagementPortalDatabase);
                    if (result)
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_update_singlenewscontent");
                    }
                    else
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_update_singlenewscontent");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return result ? Ok(result) : BadRequest(result);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Save_MultipleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            bool result = false;
            try
            {

                

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                foreach (var newsContent in newsContents)
                {
                    NameValueCollection nv = new NameValueCollection();
                    nv.Add("NewsID-INT", HttpUtility.HtmlEncode(newsContent.NewsID));
                    nv.Add("FormID-INT", newsContent.FormID);
                    nv.Add("NewsContent-NVARCHAR", HttpUtility.HtmlEncode(newsContent.NewsContent));

                    result = _DAL.InsertData("sp_insert_singlenewscontent", nv, _DAL.CSManagementPortalDatabase);
                    if (result)
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_singlenewscontent");
                    }
                    else
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_singlenewscontent");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return result ? Ok(result) : BadRequest(result);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Save_SingleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            bool result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                foreach (var newsContent in newsContents)
                {
                    NameValueCollection nv = new NameValueCollection();
                    nv.Add("NewsID-INT", HttpUtility.HtmlEncode(newsContent.NewsID));
                    nv.Add("FormID-INT", newsContent.FormID);
                    nv.Add("NewsContent-NVARCHAR", HttpUtility.HtmlEncode(newsContent.NewsContent));

                    result = _DAL.InsertData("sp_insert_singlenewscontent", nv, _DAL.CSManagementPortalDatabase);
                    if (result)
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_singlenewscontent");
                    }
                    else
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_singlenewscontent");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return result ? Ok(result) : BadRequest(result);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGUpdateSingleNews([FromBody] News news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }

                // Step 1: Update news record
                NameValueCollection newsParams = new NameValueCollection();
                newsParams.Add("NewsID-INT", news.NewsID);
                newsParams.Add("UserID-INT", news.UserID);
                newsParams.Add("TemplateID-INT", news.TemplateID);
                newsParams.Add("NewsStatus-INT", news.NewsStatus);
                newsParams.Add("IsLive-BIT", news.Islive);
                var newsResult = _DAL.InsertData("sp_update_singlenews", newsParams, _DAL.CSManagementPortalDatabase);

                // Step 2: Update tags
                foreach (var tagid in news.TagID)
                {
                    NameValueCollection tagParams = new NameValueCollection();
                    tagParams.Add("TagID-INT", tagid.ToString());
                    tagParams.Add("NewsID-INT", news.NewsID);
                    _DAL.InsertData("sp_insert_newstagsmapping", tagParams, _DAL.CSManagementPortalDatabase);
                }

                // Step 3: Update slugs
                foreach (var slugid in news.SlugID)
                {
                    NameValueCollection slugsParams = new NameValueCollection();
                    slugsParams.Add("SlugID-INT", slugid.ToString());
                    slugsParams.Add("NewsID-INT", news.NewsID);

                    _DAL.InsertData("sp_insert_newsslugsmapping", slugsParams, _DAL.CSManagementPortalDatabase);
                }
                // Return success with updated news ID
                return Ok(new { news_id = news.NewsID });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGSaveSingleNewsGraph([FromBody] News news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }
                // Step 4: Update graph only if graph details are provided
                if (!string.IsNullOrEmpty(news.GraphTypeID) &&
                    !string.IsNullOrEmpty(news.GraphTitle) &&
                    !string.IsNullOrEmpty(news.GraphSubtitle))
                {
                    NameValueCollection graphParams = new NameValueCollection();
                    graphParams.Add("GraphTypeID-INT", news.GraphTypeID);
                    graphParams.Add("GraphTitle-NVARCHAR", news.GraphTitle);
                    graphParams.Add("GraphSubtitle-NVARCHAR", news.GraphSubtitle);
                    graphParams.Add("ShowLegend-BIT", news.ShowLegend);
                    graphParams.Add("NewsID-INT", news.NewsID);


                    var graphResult = _DAL.GetData("sp_update_singlenews_graph", graphParams, _DAL.CSManagementPortalDatabase);
                    var graphids = graphResult.Rows[0]["GraphID"];
                    // Update graph series
                    var seriesid = 0;
                    foreach (var series in news.GraphSeries)
                    {
                        string xaxisLabels = string.Join(",", series.XaxisLabel.ToList());
                        string graphValues = string.Join(",", series.GraphValue.ToList());
                        NameValueCollection seriesParams = new NameValueCollection();
                        seriesParams.Add("SeriesID-INT", seriesid++.ToString());
                        seriesParams.Add("GraphID-INT", graphids.ToString());
                        seriesParams.Add("XaxisLabel-NVARCHAR", xaxisLabels);
                        seriesParams.Add("SeriesName-NVARCHAR", series.SeriesName);
                        seriesParams.Add("GraphValue-NVARCHAR", graphValues);
                        seriesParams.Add("SeriesColor-NVARCHAR", series.SeriesColor);
                        _DAL.InsertData("sp_update_graph_series", seriesParams, _DAL.CSManagementPortalDatabase);
                    }
                }
                // Return success with updated news ID
                return Ok(new { news_id = news.NewsID });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGSaveSingleNewsTable([FromBody] News news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }
                if (!string.IsNullOrEmpty(news.tablename) &&
                    !string.IsNullOrEmpty(news.columncount) &&
                    !string.IsNullOrEmpty(news.rowscount))
                {
                    if (news.TableDatas != null && news.TableDatas.Count > 0)
                    {
                        NameValueCollection tableparam = new NameValueCollection();
                        tableparam.Add("TableName-NVARCHAR", news.tablename);
                        tableparam.Add("ColumnCount-INT", news.columncount);
                        tableparam.Add("RowCount-INT", news.rowscount);
                        tableparam.Add("NewsID-INT", news.NewsID);
                        var tableresult = _DAL.GetData("sp_update_singlenews_html_table", tableparam, _DAL.CSManagementPortalDatabase);

                        var tableid = tableresult.Rows[0]["TableID"];

                        foreach (var tableData in news.TableDatas)
                        {
                            NameValueCollection tabledataparam = new NameValueCollection();
                            tabledataparam.Add("TableID-INT", tableid.ToString());
                            tabledataparam.Add("RowNumber-INT", tableData.rownumber);
                            tabledataparam.Add("ColumnNumber-INT", tableData.columnnumber);
                            tabledataparam.Add("CellContent-NVARCHAR", tableData.cellcontent);
                            tabledataparam.Add("IsHeader-INT", tableData.isheader);
                            _DAL.InsertData("sp_update_singlenews_html_table_data", tabledataparam, _DAL.CSManagementPortalDatabase);
                        }
                    }
                }
                // Return success with updated news ID
                return Ok(new { news_id = news.NewsID });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult MGSaveMultipleNewsTable([FromBody] NewsMultiple news)
        {
            try
            {
                var userID = User.FindFirstValue("UserID");
                if (string.IsNullOrEmpty(userID))
                {
                    return BadRequest("UserID is required.");
                }
                if (news.TablesData != null && news.TablesData.Count > 0)
                {
                    foreach (var table in news.TablesData)
                    {
                        NameValueCollection tableParams = new NameValueCollection();
                        tableParams.Add("TableName-NVARCHAR", table.tableName);
                        tableParams.Add("ColumnCount-INT", table.columnCount);
                        tableParams.Add("RowCount-INT", table.rowCount);
                        tableParams.Add("NewsID-INT", news.NewsID);
                        var tableResult = _DAL.GetData("sp_insert_html_table", tableParams, _DAL.CSManagementPortalDatabase);
                        var tableId = tableResult.Rows[0]["TableID"];
                        if (table.data != null)
                        {
                            foreach (var cellData in table.data)
                            {
                                NameValueCollection tableDataParams = new NameValueCollection();
                                tableDataParams.Add("TableID-INT", tableId.ToString());
                                tableDataParams.Add("RowNumber-INT", cellData.rownumber ?? "");
                                tableDataParams.Add("ColumnNumber-INT", cellData.columnnumber ?? "");
                                tableDataParams.Add("CellContent-NVARCHAR", cellData.cellcontent ?? "");
                                tableDataParams.Add("IsHeader-BIT", cellData.isheader ?? "0");
                                _DAL.InsertData("sp_insert_html_table_data", tableDataParams, _DAL.CSManagementPortalDatabase);
                            }
                        }
                    }
                }
                // Return success with updated news ID
                return Ok(new { news_id = news.NewsID });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error: " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteSingleNewsHTMLTable([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TableID-INT", deleteFromDB_.TableID);
                Result = _DAL.InsertData("sp_delete_htmltable", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_htmltable");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_htmltable");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteMultipleNewsHTMLTable([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TableID-INT", deleteFromDB_.TableID);
                Result = _DAL.InsertData("sp_delete_htmltable", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_htmltable");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_htmltable");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteSingleNewsGraph([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("GraphID-INT", deleteFromDB_.GraphID);
                Result = _DAL.InsertData("sp_delete_Graph", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_htmltable");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_htmltable");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteMultipleNewsGraph([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("GraphID-INT", deleteFromDB_.GraphID);
                Result = _DAL.InsertData("sp_delete_MultipleGraph", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_MultipleGraph");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_MultipleGraph");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Update_SingleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            bool result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                foreach (var newsContent in newsContents)
                {
                    NameValueCollection nv = new NameValueCollection();
                    //nv.Add("ContentId-INT", HttpUtility.HtmlEncode(newsContent.ContentID));
                    nv.Add("NewsID-INT", HttpUtility.HtmlEncode(newsContent.NewsID));
                    nv.Add("FormID-INT", newsContent.FormID);
                    nv.Add("NewsContent-NVARCHAR", HttpUtility.HtmlEncode(newsContent.NewsContent));

                    result = _DAL.InsertData("sp_update_singlenewscontent", nv, _DAL.CSManagementPortalDatabase);
                    if (result)
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_update_singlenewscontent");
                    }
                    else
                    {
                        SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_update_singlenewscontent");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return result ? Ok(result) : BadRequest(result);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Save_News_Category([FromBody] NewsCategory newsCategory)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("N_catid-INT", newsCategory.N_catid != null ? newsCategory.N_catid : "NULL");
                nv.Add("CategoryName-NVARCHAR", HttpUtility.HtmlEncode(newsCategory.CategoryName));
                nv.Add("Createdby-INT", HttpUtility.HtmlEncode(newsCategory.Createdby));

                Result = _DAL.InsertData("sp_insertnewscategory", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insertnewscategory");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insertnewscategory");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult Get_NewsCategory()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_newscategory", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_newscategory");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_newscategory");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsDetailBySearch(string SearchKeyword)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("SearchKeyword-NVARCHAR", SearchKeyword);
                dt = _DAL.GetData("sp_search_newsdetail", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_search_newsdetail");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_search_newsdetail");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsByID(int NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", NewsID.ToString());
                dt = _DAL.GetData("sp_getnewsbyid", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getnewsbyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getnewsbyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsLayoutForEditor(int newsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("newsID-INT", newsID.ToString());
                dt = _DAL.GetData("sp_getnewswithtemplatefor_editor", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getnewswithtemplatefor_editor");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getnewswithtemplatefor_editor");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        //[RateLimitMiddleware(100, 5)]
        //[HttpPost]
        //public IActionResult Update_News([FromBody] News news)
        //{
        //    try
        //    {
        //        ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
        //        var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

        //        // Prepare parameters for the stored procedure
        //        NameValueCollection? nv = new NameValueCollection();
        //        nv.Add("NewsID-INT", news.NewsID);
        //        nv.Add("UserID-INT", news.UserID);
        //        nv.Add("Langauge-NVARCHAR", HttpUtility.HtmlEncode(news.Langauge) ?? "");
        //        nv.Add("Author-INT", news.UserID);
        //        nv.Add("Metadescription-NVARCHAR", HttpUtility.HtmlEncode(news.Metadescription) ?? "");
        //        nv.Add("Features-BIT", news.Features.ToString());  // Boolean
        //        nv.Add("Popular-BIT", news.Popular.ToString());    // Boolean
        //        nv.Add("Shortcontent-NVARCHAR", HttpUtility.HtmlEncode(news.Shortcontent) ?? "");
        //        nv.Add("CategoryID-INT", news.CategoryID.ToString());  // Integer
        //        nv.Add("Allowcomment-BIT", news.Allowcomment.ToString());  // Boolean
        //        nv.Add("IsActive-BIT", news.IsActive.ToString());      // Boolean
        //        nv.Add("guid-VARCHAR", HttpUtility.HtmlEncode(news.guid) ?? "");
        //        nv.Add("ping_status-VARCHAR", HttpUtility.HtmlEncode(news.ping_status) ?? "");
        //        nv.Add("to_ping-VARCHAR", HttpUtility.HtmlEncode(news.to_ping) ?? "");
        //        nv.Add("pinged-VARCHAR", HttpUtility.HtmlEncode(news.pinged) ?? "");
        //        nv.Add("Updateby-INT", news.UserID);
        //        nv.Add("Islive-BIT", news.Islive.ToString());     
        //        nv.Add("Thumnail-NVARCHAR", news.Thumbnail ?? "");     

        //        // Call stored procedure to update the news
        //        var Result = _DAL.GetData("sp_update_news", nv, _DAL.CSManagementPortalDatabase);
        //        nv = null;  // Clear parameters

        //        if (Result.Rows.Count > 0)
        //        {
        //            // Fetch the updated news ID
        //            var newsId = Result.Rows[0]["news_id"];

        //            //// Process Tag Names
        //            //if (news.TagName)
        //            //{
        //            //    var listNewTags = news.TagName.ToString();

        //            //    foreach (var tagName in listNewTags)
        //            //    {
        //            //        string trimmedTag = tagName.ToString();
        //            //        if (!string.IsNullOrEmpty(trimmedTag))
        //            //        {
        //            //            NameValueCollection tagParams = new NameValueCollection();
        //            //            tagParams.Add("TagName-NVARCHAR", HttpUtility.HtmlEncode(trimmedTag));
        //            //            tagParams.Add("NewsID-INT", newsId.ToString());

        //            //            // Insert the tag into the database
        //            //            _DAL.InsertData("sp_insert_newstags", tagParams, _DAL.CSManagementPortalDatabase);
        //            //        }
        //            //    }
        //            //}

        //            //// Process Meta Keywords
        //            //if (!string.IsNullOrEmpty(news.Metakeyword))
        //            //{
        //            //    var listNewMetakeywords = news.Metakeyword.Split(',');

        //            //    foreach (var metakeyword in listNewMetakeywords)
        //            //    {
        //            //        string metakeywordName = metakeyword.Trim();
        //            //        if (!string.IsNullOrEmpty(metakeywordName))
        //            //        {
        //            //            NameValueCollection metakeywordParams = new NameValueCollection();
        //            //            metakeywordParams.Add("MetaKeyword-NVARCHAR", HttpUtility.HtmlEncode(metakeywordName));
        //            //            metakeywordParams.Add("NewsID-INT", newsId.ToString());

        //            //            _DAL.InsertData("sp_insertnewsmetakeyword", metakeywordParams, _DAL.CSManagementPortalDatabase);
        //            //        }
        //            //    }
        //            //}

        //            // Return success response with the updated news ID
        //            return Ok(new { news_id = newsId });
        //        }
        //        else
        //        {
        //            return BadRequest("Failed to update news item");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
        //        SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
        //        return BadRequest("Something went wrong, please contact your system administrator.");
        //    }
        //}

        //[RateLimitMiddleware(100, 5)]
        //[HttpPost]
        //public IActionResult Update_News_Content([FromBody] List<NewsContents> newsContent)
        //{
        //    bool result = true; // Assume success unless proven otherwise
        //    try
        //    {
        //        ClaimsPrincipal claimsPrincipal = User; // Assuming User is already populated
        //        var userID = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "UserID")?.Value;

        //        if (userID == null)
        //        {
        //            return BadRequest("User ID is not available.");
        //        }

        //        foreach (var content in newsContent)
        //        {
        //            NameValueCollection nv = new NameValueCollection();
        //            nv.Clear();
        //            nv.Add("NewsID-INT", content.NewsID);
        //            nv.Add("DivID-NVARCHAR", HttpUtility.HtmlEncode(content.DivID ?? ""));
        //            nv.Add("TypeID-INT", content.TypeID ?? ""); // Ensure TypeID is properly formatted
        //            nv.Add("NewsContent-NVARCHAR", HttpUtility.HtmlEncode(content.NewsContent ?? ""));

        //            // Call stored procedure to update news content
        //            bool updateResult = _DAL.InsertData("sp_update_news_content", nv, _DAL.CSManagementPortalDatabase);

        //            if (!updateResult)
        //            {
        //                result = false; // If any update fails, set result to false
        //                SystemActivityLog(ActivityLog.ActivityID_Insert, $"{ActivityLog.ActivityDetails_Insert2} sp_update_news_content");
        //            }
        //            else
        //            {
        //                SystemActivityLog(ActivityLog.ActivityID_Insert, $"{ActivityLog.ActivityDetails_Insert} sp_update_news_content");
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
        //        SystemActivityLog(ActivityLog.ActivityID_Error, $"{MethodBase.GetCurrentMethod().Name} {ex.Message}");
        //        return BadRequest("Something went wrong. Please contact your system administrator.");
        //    }

        //    return result ? Ok(result) : BadRequest(result);
        //}

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult DeleteNews([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("newsID-INT", deleteFromDB_.newsID);
                nv.Add("DeletedBy-INT", deleteFromDB_.UserID);
                Result = _DAL.InsertData("sp_delete_news", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_news");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_news");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveTemplateNewsDesign([FromBody] SaveNewsTemplate saveNewsTemplate)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserId-INT", saveNewsTemplate.UserId);
                nv.Add("TemplateID-INT", HttpUtility.HtmlEncode(saveNewsTemplate.TemplateID) ?? "");
                nv.Add("HtmlContent-NVARCHAR", HttpUtility.HtmlEncode(saveNewsTemplate.HtmlContent) ?? "");
                nv.Add("NewsID-INT", saveNewsTemplate.NewsID);
                nv.Add("isSave-BIT", HttpUtility.HtmlEncode(saveNewsTemplate.isSave) ?? "");
                nv.Add("CreatedBy-INT", saveNewsTemplate.UserId);
                nv.Add("UpdateBy-INT", saveNewsTemplate.UserId);


                Result = _DAL.InsertData("sp_insert_templatenewslayout", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_templatenewslayout");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_templatenewslayout");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult UpdateLivePerviewTemplate([FromBody] SaveNewsTemplate saveNewsTemplate)
        {
            bool Result = false;
            try
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserId-INT", saveNewsTemplate.UserId);
                nv.Add("TemplateID-INT", saveNewsTemplate.TemplateID);
                nv.Add("HtmlContent-NVARCHAR", saveNewsTemplate.HtmlContent);
                nv.Add("NewsID-INT", saveNewsTemplate.NewsID);
                nv.Add("UpdateBy-INT", saveNewsTemplate.UpdateBy);


                Result = _DAL.InsertData("sp_update_templatenewslayout", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_update_templatenewslayout");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_update_templatenewslayout");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsDisplayByUserID(string UserID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", UserID);
                dt = _DAL.GetData("sp_view_newsdetailbyuserid", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_view_newsdetailbyuserid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_view_newsdetailbyuserid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult DeleteNEwsByUserID([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", deleteNewsData.UserID);
                nv.Add("NewsID-INT", deleteNewsData.NewsID);
                Result = _DAL.InsertData("sp_delete_newsbyuserID", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_newsbyuserID");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_newsbyuserID");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsDetailByMGEditor(int NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", NewsID.ToString());
                dt = _DAL.GetData("sp_select_templateDesignbyuser", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_templateDesignbyuser");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_templateDesignbyuser");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [HttpGet]
        public async Task<IActionResult> GetAIGeneratedNews(string newsContent)
        {
            if (string.IsNullOrWhiteSpace(newsContent))
            {
                return BadRequest("News content cannot be empty.");
            }

            try
            {
                // Assuming _newsAI is the instance of your NewsAI class
                var correctedContent = await _newsAI.GetCorrectedContentAsync(newsContent);
                return Ok(correctedContent);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, ex.Message); // Return server error with the exception message
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}"); // Handle other exceptions
            }
        }


        [HttpPost]
        public async Task<IActionResult> GenerateImage([FromBody] Dictionary<string, string> requestData)
        {
            try
            {
                var texttoimage = await _newsAI.GetTextToImageGenerator(requestData);

                if (texttoimage.Success)
                {
                    if (!string.IsNullOrEmpty(texttoimage.ImageBase64))
                    {
                        // Use the environment variable for the image directory path
                        string imageDirectory = Environment.GetEnvironmentVariable("RssAPPImage");

                        if (string.IsNullOrEmpty(imageDirectory))
                        {
                            // Fallback if the environment variable is not set
                            imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                        }

                        // Ensure the directory exists
                        if (!Directory.Exists(imageDirectory))
                        {
                            Directory.CreateDirectory(imageDirectory);
                        }

                        string fileName = Guid.NewGuid().ToString() + ".png";
                        string filePath = Path.Combine(imageDirectory, fileName);

                        byte[] imageBytes = Convert.FromBase64String(texttoimage.ImageBase64);
                        await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

                        return Ok(new
                        {
                            success = true,
                            imagePath = $"/images/{fileName}"  // Relative path to the image
                        });
                    }
                    else
                    {
                        return BadRequest(new { success = false, message = "No base64 data returned for the image." });
                    }
                }
                else
                {
                    return BadRequest(new { success = false, message = texttoimage.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }








        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult CheckUserTemplateExist(string UserID, string NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                //ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                //var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserId-INT", UserID);

                dt = _DAL.GetData("sp_check_user_template_existence", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_check_user_template_existence");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_check_user_template_existence");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsServices()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_newsservices", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_newsservices");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_newsservices");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetNewsByService(int ServiceID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ServiceID-INT", ServiceID.ToString());
                dt = _DAL.GetData("sp_get_news_by_service", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_news_by_service");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_news_by_service");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetChartBgSeries(int TemplateID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TemplateID-INT", TemplateID.ToString());
                dt = _DAL.GetData("sp_getbgchartseries", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getbgchartseries");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getbgchartseries");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult SaveImageForResulation([FromBody] ImageUploadRequest request)
        {
            try
            {
                var IMAGE_SAVE_RESULTION = Environment.GetEnvironmentVariable("IMAGE_SAVE_RESULTION");
                // Decode the base64 image
                var base64Data = request.Image.Replace("data:image/png;base64,", string.Empty);
                var imageBytes = Convert.FromBase64String(base64Data);

                // Extract file extension from the image name (jpg, png, etc.)
                var fileExtension = Path.GetExtension(request.ImageName); // Get extension
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(request.ImageName); // Get name without extension

                // Define the file path using the original extension
                var fileName = $"{fileNameWithoutExtension}{fileExtension}";
                var filePath = Path.Combine(IMAGE_SAVE_RESULTION, fileName);

                // Ensure the directory exists
                var directory = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Save the image to the file system
                System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

                return Ok(new { success = true, message = "Image saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error saving image: " + ex.Message });
            }
        }


        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetImages()
        {
            try
            {
                var IMAGE_SAVE_RESULTION = Environment.GetEnvironmentVariable("IMAGE_SAVE_RESULTION");
                var images = Directory.GetFiles(IMAGE_SAVE_RESULTION)
                                      .Select(file => Path.GetFileName(file))
                                      .ToList();

                // Assuming the images are accessible via a web path, return full URLs
                var imageUrls = images.Select(img => $"{Request.Scheme}://{Request.Host}/UserSaveImage/{img}").ToList();

                return Ok(new { success = true, imageUrls });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error fetching images: " + ex.Message });
            }
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult Save_News_ImageRisize([FromBody] RisizeNewsImage risizeNewsImage)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("RisizeImagePath-NVARCHAR", risizeNewsImage.RisizeImagePath);
                nv.Add("DivID-NVARCHAR", risizeNewsImage.DivID);
                nv.Add("TypeID-INT", risizeNewsImage.TypeID);
                nv.Add("UserID-INT", risizeNewsImage.UserID);
                nv.Add("CollectionID-INT", risizeNewsImage.CollectionID);
                Result = _DAL.InsertData("sp_InsertResizedImage", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_InsertResizedImage");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_InsertResizedImage");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetRisizeNewsImage(string DivID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("DivID-NVARCHAR", DivID);

                dt = _DAL.GetData("Sp_Select_News_RisizeImage", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "Sp_Select_News_RisizeImage");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "Sp_Select_News_RisizeImage");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetSelectEachNEwsImage(string DivID, string NewsID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", NewsID);
                nv.Add("DivID-NVARCHAR", DivID);


                dt = _DAL.GetData("Sp_SelecteachNewsImage", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "Sp_SelecteachNewsImage");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "Sp_SelecteachNewsImage");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult CreaterSendToEditor([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", deleteNewsData.NewsID);
                nv.Add("CreatorRemarks-NVARCHAR", deleteNewsData.CreatorRemarks);
                Result = _DAL.InsertData("sp_sendtoeditor", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_sendtoeditor");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_sendtoeditor");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }



        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult PublisherSendToEditor([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", deleteNewsData.NewsID);
                nv.Add("PublisherRemarks-NVARCHAR", deleteNewsData.PublisherRemarks);
                Result = _DAL.InsertData("sp_publishersendtoeditor", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_sendtoeditor");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_sendtoeditor");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult EditorSendToCreater([FromBody] DeleteNewsData deleteNewsData)
        {
            bool result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", deleteNewsData.NewsID);
                nv.Add("EditorRemarks-NVARCHAR", deleteNewsData.EditorRemarks);

                result = _DAL.InsertData("sp_sendtocreater", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_sendtocreater");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_sendtocreater");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something went wrong. Please contact your system administrator.");
            }

            return Ok(result);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult EditorSendToPublisher([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", deleteNewsData.NewsID);

                Result = _DAL.InsertData("sp_editorsendtopublisher", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_editorsendtopublisher");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_editorsendtopublisher");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }


        [RateLimitMiddleware(100, 5)]
        [HttpPost]
        public IActionResult PublisherNewsLive([FromBody] DeleteNewsData deleteNewsData)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("NewsID-INT", deleteNewsData.NewsID);
                Result = _DAL.InsertData("sp_publishernewslive", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_publishernewslive");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_publishernewslive");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your System Administrator");
            }

            return Ok(Result);
        }

        #endregion

        #region GET RSS FEED GENERATED DATA FOR NEWS FORMAT

        [HttpGet] 
        public IActionResult GetRSSFeedByFormat(string FormatID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FormatID-INT", FormatID);
                dt = _DAL.GetData("sp_get_formatednews", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_get_formatednews");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_get_formatednews");
                }

                string response = string.Empty;
                switch (FormatID)
                {
                    case "1": //News ML G2
                        response = _rssFeedService.GenerateNews_NewsMLG2(dt);
                        return Content(response, "application/xml");
                    case "2": // NewsML-G1
                        response = _rssFeedService.GenerateNews_NewsMLG1(dt);
                        return Content(response, "application/xml");
                    case "3": // Atom
                        response = _rssFeedService.GenerateNews_Atom(dt);
                        return Content(response, "application/atom+xml");
                    case "4": // RSS 2.0
                        response = _rssFeedService.GenerateNews_RSS2(dt);
                        return Content(response, "application/rss+xml");
                    case "5": // JSON
                        response = _rssFeedService.GenerateNews_JSON(dt);
                        return Content(response, "application/json");
                    case "6": // CUSTOME
                        response = _rssFeedService.GenerateNews_CustomText(dt);
                        return Content(response, "application/json");
                    default:
                        return BadRequest("Invalid format ID.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("RSS News Feed Not Generated Please Contact System Administrator " + ex.Message);
            }
            return Ok(dt);
        }

        [HttpGet] 
        public IActionResult GetRSSFeedByFormat_TopNumber(string FormatID, string TopN)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TopN-INT", TopN);
                dt = _DAL.GetData("sp_getformatednews_top10_demo", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getformatednews_top10_demo");
                }

                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getformatednews_top10_demo");
                }

                var length = dt.AsEnumerable().Max(row => row.Field<long>("RNO"));

                var c = 0;
                DataTable filteredData;

                string response = string.Empty;
                switch (FormatID)
                {
                    case "NewsML-G2": //News ML G2
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_NewsMLG2(filteredData);
                        }
                        return Content(response, "application/xml");
                    case "NewsML-G1": // NewsML-G1
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_NewsMLG1(filteredData);
                        }
                        return Content(response, "application/xml");
                    case "Atom": // Atom
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_Atom(filteredData);
                        }
                        return Content(response, "application/atom+xml");
                    case "RSS2.0": // RSS 2.0
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_RSS2(filteredData);
                        }
                        return Content(response, "application/rss+xml");
                    case "JSON": // JSON
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_JSON(filteredData);
                        }
                        return Content(response, "application/json");
                    case "Custome": // CUSTOME
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_CustomText(filteredData);
                        }
                        return Content(response, "application/json");
                    default:
                        return BadRequest("Invalid format ID.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("RSS News Feed Not Generated Please Contact System Administrator " + ex.Message);
            }
            return Ok(dt);
        }

        [HttpGet]
        public IActionResult GetRSSFeedByFormat_Date(string FormatID, string TopN, string StartDate, string EndDate)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TopN-INT", TopN);
                nv.Add("StartDate-DATE", StartDate);
                nv.Add("EndDate-DATE", EndDate);
                dt = _DAL.GetData("sp_getformatednews_date", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getformatednews_date");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getformatednews_date");
                }

                var length = dt.AsEnumerable().Max(row => row.Field<long>("RNO"));

                var c = 0;
                DataTable filteredData;

                string response = string.Empty;
                switch (FormatID)
                {
                    case "NewsML-G2": //News ML G2
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_NewsMLG2(filteredData);
                        }
                        return Content(response, "application/xml");
                    case "NewsML-G1": // NewsML-G1
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_NewsMLG1(filteredData);
                        }
                        return Content(response, "application/xml");
                    case "Atom": // Atom
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_Atom(filteredData);
                        }
                        return Content(response, "application/atom+xml");
                    case "RSS2.0": // RSS 2.0
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_RSS2(filteredData);
                        }
                        return Content(response, "application/rss+xml");
                    case "JSON": // JSON
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_JSON(filteredData);
                        }
                        return Content(response, "application/json");
                    case "Custome": // CUSTOME
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_CustomText(filteredData);
                        }
                        return Content(response, "application/json");
                    default:
                        return BadRequest("Invalid format ID.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("RSS News Feed Not Generated Please Contact System Administrator " + ex.Message);
            }
            return Ok(dt);
        }
        #endregion


        [HttpGet] 
        public IActionResult GetRSSFeedByExternal(string FormatID, string TopN)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TopN-INT", TopN);
                dt = _DAL.GetData("sp_getformatednews_top10_demo", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_getformatednews_top10_demo");
                }

                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_getformatednews_top10_demo");
                }

                var length = dt.AsEnumerable().Max(row => row.Field<long>("RNO"));

                var c = 0;
                DataTable filteredData;

                string response = string.Empty;
                switch (FormatID)
                {
                    case "NewsML-G2": //News ML G2
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_NewsMLG2(filteredData);
                        }
                        return Content(response, "application/xml");
                    case "NewsML-G1": // NewsML-G1
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_NewsMLG1(filteredData);
                        }
                        return Content(response, "application/xml");
                    case "Atom": // Atom
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_Atom(filteredData);
                        }
                        return Content(response, "application/atom+xml");
                    case "RSS2.0": // RSS 2.0
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_RSS2(filteredData);
                        }
                        return Content(response, "application/rss+xml");
                    case "JSON": // JSON
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();

                            response += _rssFeedService.GenerateNews_JSON(filteredData);
                        }
                        return Content(response, "application/json");
                    case "Custome": // CUSTOME
                        for (int i = 0; i < length; i++)
                        {
                            c = i;
                            filteredData = dt.AsEnumerable().Where(row => row.Field<long>("RNO") == c + 1).CopyToDataTable();
                            response += _rssFeedService.GenerateNews_CustomText(filteredData);
                        }
                        return Content(response, "application/json");
                    default:
                        return BadRequest("Invalid format ID.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("RSS News Feed Not Generated Please Contact System Administrator " + ex.Message);
            }
            return Ok(dt);
        }




        #region Single News
        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetGraphTypeName()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_graphtype", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_graphtype");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_graphtype");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(dt);

        }
        #endregion

    }
    #region Classes

    public class ImageUploadRequest
    {
        public string? Image { get; set; }
        public string? Resolution { get; set; }
        public string? ImageName { get; set; }
    }

    public class FeedFiltration
    {
        public string? ALL { get; set; }
        public string? TEXT { get; set; }
        public string? VIDEO { get; set; }
        public string? PICTURE { get; set; }
        public string? AUDIOP { get; set; }
    }

    public class CollectionName
    {
        public string? Collection_id { get; set; }
        public string? Collection_name { get; set; }
        public string? UserID { get; set; }
    }

    public class CollectionFeeds
    {
        public string? CollectionID { get; set; }
        public string? FeedID { get; set; }
    }

    public class Planning
    {
        public string? planning_id { get; set; }
        public string? title { get; set; }
        public string? p_description { get; set; }
        public string? country { get; set; }
        public string? p_categoryid { get; set; }
        public string? createdby { get; set; }
        public string? planning_date { get; set; }
        public string? UserID { get; set; }
        public string? PlanningTime { get; set; }
    }

    public class TemplateBoxType
    {
        public string? TypeName { get; set; }
    }

    public class DeleteNewsData
    {
        public string? FeedID { get; set; }
        public string? NewsID { get; set; }
        public string? UserID { get; set; }
        public string? CollectionFeedID { get; set; }
        public string? EditorRemarks { get; set; }
        public string? CreatorRemarks { get; set; }
        public string? PublisherRemarks { get; set; }
        public string? CollectionID { get; set; }
    }

    public class TemplateSaveRequest
    {
        public string? UserID { get; set; }
        public string? TagName { get; set; }
        public string? Content_ID { get; set; }
        public string? Row_ID { get; set; }
        public string? Height { get; set; }
        public string? Height_Measures { get; set; }
        public string? Class_ATTR { get; set; }
        public string? Services { get; set; }
        public string? Content { get; set; }
        public string? Image_Link { get; set; }
        public string? Data_Columns { get; set; }
        public string? id { get; set; }
        public string? TypeID { get; set; }
        public string? Template_ID { get; set; }
        public string? Template_Name { get; set; }
        public string? Inline_Style { get; set; }
        public string? chartbgseries { get; set; }
    }


    #region Single News Modal
    public class News
    {
        public string? NewsID { get; set; }
        public string? UserID { get; set; }
        public string? TemplateID { get; set; }
        public List<string>? TagID { get; set; }
        public List<string>? SlugID { get; set; }
        public string? NewsStatus { get; set; }
        public string? Islive { get; set; }
        // Graph-related properties
        public string? GraphID { get; set; }
        public string? GraphTypeID { get; set; }
        public string? GraphTitle { get; set; }
        public string? GraphSubtitle { get; set; }
        public string? ShowLegend { get; set; }
        // Series data for the graph
        public List<GraphSeries>? GraphSeries { get; set; }
        //CustomizeTable
        public string? TableID { get; set; }
        public string? tablename { get; set; }
        public string? columncount { get; set; }
        public string? rowscount { get; set; }
        public List<TableData>? TableDatas { get; set; }
    }
    public class TableData
    {
        public string? tableid { get; set; }
        public string? rownumber { get; set; }
        public string? columnnumber { get; set; }
        public string? cellcontent { get; set; }
        public string? isheader { get; set; }
    }
    public class GraphSeries
    {
        public List<string>? XaxisLabel { get; set; }
        public  string? SeriesName { get; set; }
        public List<string>? GraphValue { get; set; }
        public string? SeriesColor { get; set; }
    }
    #endregion 

    #region Multiple News Modal
    public class NewsMultiple
    {
        public string? NewsID { get; set; }
        public string? UserID { get; set; }
        public string? TemplateID { get; set; }
        public List<string>? TagID { get; set; }
        public List<string>? SlugID { get; set; }
        public string? NewsStatus { get; set; }
        public string? Islive { get; set; }
        public List<GraphData>? GraphSeries { get; set; }
        public List<TableDataMultiple>? TablesData { get; set; }

    }
    public class GraphData
    {
        public string? GraphTypeID { get; set; }
        public string? GraphTitle { get; set; }
        public string? GraphSubtitle { get; set; }
        public string? ShowLegend { get; set; }
        public List<GraphSeriesData>? GraphSeries { get; set; }
    }
    public class GraphSeriesData
    {
        public string? XaxisLabel { get; set; }
        public string? SeriesName { get; set; }
        public List<string>? GraphValue { get; set; }
        public string? SeriesColor { get; set; }
    }
    public class TableDataMultiple
    {
        public string? tableName { get; set; }
        public string? columnCount { get; set; }
        public string? rowCount { get; set; }
        public List<TableCellData>? data { get; set; }

    }
    public class TableCellData
    {
        public string? rownumber { get; set; }
        public string? columnnumber { get; set; }
        public string? cellcontent { get; set; }
        public string? isheader { get; set; }
    }
    #endregion





    public class NewsCategory
    {
        public string? N_catid { get; set; }
        public string? CategoryName { get; set; }
        public string? Createdby { get; set; }
    }

    public class SaveNewsTemplate
    {
        public string? STID { get; set; }
        public string? UserId { get; set; }
        public string? TemplateID { get; set; }
        public string? isSave { get; set; }
        public string? HtmlContent { get; set; }
        public string? NewsID { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdateBy { get; set; }
        public string? UpdateDate { get; set; }
    }


    public class NewsContents
    {
        public string? ContentID { get; set; }
        public string? NewsID { get; set; }
        public string? FormID { get; set; }
        public string? NewsContent { get; set; }
    }

    public class RisizeNewsImage
    {
        public string? RisizeImagePath { get; set; }
        public string? DivID { get; set; }
        public string? TypeID { get; set; }
        public string? UserID { get; set; }
        public string? CollectionID { get; set; }
    }

    public class NewsMetaTags
    {
        public string? TagName { get; set; }
        public string? FeedID { get; set; }
    }

    public class NewsMetaTagsNews
    {
        public string? TagName { get; set; }
        public string? NewsID { get; set; }
    }

    public class NewsMetaKeywords
    {
        public string? MetaKeyword { get; set; }
        public string? FeedID { get; set; }
    }


    #endregion
}
