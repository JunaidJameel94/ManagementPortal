using System.Collections.Specialized;
using System.Data;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using ManagementPortalApi.Context;
using ManagementPortalApi.Models;
using ManagementPortalApi.Models.Authentication;
using ManagementPortalApi.Models.Settings;
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
        [HttpGet]
        public IActionResult GetRSSFeedByExternal(string FormatID, string? Count, string? TagName, string? SlugName, string? StartDate = null, string? EndDate = null)
        {
            DataTable dt = new DataTable();
            try
            {
                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var ApiDelay = (from cl in claimsPrincipal.Claims where cl.Type == "ApiDelay" select cl.Value).FirstOrDefault();
                var AccessLevel = (from cl in claimsPrincipal.Claims where cl.Type == "AccessLevel" select cl.Value).FirstOrDefault();
                NameValueCollection nv = new NameValueCollection();
                nv.Add("ApiDelay-INT", ApiDelay);

                // Handle dynamic Count
                if (!string.IsNullOrEmpty(Count))
                {
                    nv.Add("TopN-INT", Count);
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

                string storedProcedure = string.Empty;

                // Refined conditions for stored procedure selection based on parameters
                if (!string.IsNullOrEmpty(Count))
                {
                    storedProcedure = "sp_get_news_by_count_apidelay";
                }
                else if (!string.IsNullOrEmpty(TagName))
                {
                    storedProcedure = "sp_get_news_by_tagname";
                }   
                else if (!string.IsNullOrEmpty(SlugName))
                {
                    storedProcedure = "sp_get_news_by_slugname";
                }
                else if (!string.IsNullOrEmpty(StartDate) && string.IsNullOrEmpty(EndDate))
                {
                    storedProcedure = "sp_get_news_by_startdate_apidelay";
                }
                else if (string.IsNullOrEmpty(StartDate) && !string.IsNullOrEmpty(EndDate))
                {
                    storedProcedure = "sp_get_news_by_enddate_apidelay";
                }
                else if (!string.IsNullOrEmpty(StartDate) && !string.IsNullOrEmpty(EndDate))
                {
                    storedProcedure = "sp_get_news_by_daterange_apidelay";
                }
                else
                {
                    storedProcedure = "sp_get_news_by_all_params";
                }

                // Call the corresponding stored procedure
                dt = _DAL.GetData(storedProcedure, nv, _DAL.CSManagementPortalDatabase);

                if (dt == null || dt.Rows.Count == 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + storedProcedure);
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + storedProcedure);
                }

                if (dt == null || dt.Rows.Count == 0)
                {
                    return NotFound("No news found for the provided parameters.");
                }

      
                string response = string.Empty;

                switch (FormatID)
                {
                    case "NewsML-G2":
                        response = _rssFeedService.GenerateNews_NewsMLG2(dt);
                        return Content(response, "application/xml");

                    case "NewsML-G1":
                        response = _rssFeedService.GenerateNews_NewsMLG1(dt);
                        return Content(response, "application/xml");

                    case "Atom":
                        response = _rssFeedService.GenerateNews_Atom(dt);
                        return Content(response, "application/atom+xml");

                    case "RSS2":
                        response = _rssFeedService.GenerateNews_RSS2(dt);
                        return Content(response, "application/rss+xml");

                    case "JSON":
                        response = _rssFeedService.GenerateNews_JSON(dt);
                        return Content(response, "application/json");

                    case "CustomText":
                        response = _rssFeedService.GenerateNews_CustomText(dt);
                        return Content(response, "text/plain");

                    default:
                        return BadRequest("Invalid format ID.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FeedController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("RSS News Feed Not Generated. Please Contact System Administrator: " + ex.Message);
            }
        }

        #endregion

    }
}
