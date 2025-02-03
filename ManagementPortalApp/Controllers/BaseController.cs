using ManagementPortalApp.Models.Base;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using ManagementPortalApp.Utility;
using System.Data;
using ManagementPortalApp.Models.Authentication;
using ManagementPortalApp.Models.Session;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System.Dynamic;
using ManagementPortalApp.Extensions;
using System.Collections;
using ManagementPortalApp.Models.Forms;
using System.Net.Http;
using System;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    public class BaseController : Controller
    {
        private readonly Sessions _sessions;
        private readonly DataEncryptor _dataEncryptor;
        private readonly IConfiguration _config;
        private readonly ILogger<BaseController> _logger;


        public BaseController(Sessions sessions, IConfiguration config, ILogger<BaseController> logger, DataEncryptor dataEncryptor)
        {
            _sessions = sessions;
            _config = config;
            _logger = logger;
            _dataEncryptor = dataEncryptor;

        }

        #region Get Session
        [HttpGet]
        public List<RolesMapping> GetSession(string RouteValues)
        {
            List<RolesMapping> tlistFiltered = new List<RolesMapping>();

            try
            {
                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var ipAddress = HttpContext.Connection.RemoteIpAddress;
                string ipAddressString = ipAddress?.ToString();
                var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                SessionItems session = _sessions.GetSession(UniqueKey, UserID);
                List<RolesMapping> permissionList = session.rolesMapping;
                tlistFiltered = permissionList.Where(item => "/" + item.FormName == RouteValues).ToList();
                _logger.LogInformation("{0} {1} UserID : {2} {3} IPAddress : {4}", "BaseController", "GetSession", UserID, RouteValues, ipAddressString);
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/GetSession {1}", ex.Message);
            }

            return tlistFiltered;
        }

        private SessionItems GetSessionItems(HttpContext httpContext)
        {
            ClaimsPrincipal claimsPrincipal = httpContext.User;
            string HostName = Dns.GetHostName();
            IPHostEntry HostIPs = Dns.GetHostEntry(HostName);
            string IPAddress = HostIPs.AddressList[0].ToString();
            var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();
            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
            SessionItems session = _sessions.GetSession(UniqueKey, UserID);
            session.IpAddress = IPAddress;
            return session;
        }

        public UserInfo GetUserInformation()
        {
            UserInfo tlistFiltered = new UserInfo();

            try
            {
                SessionItems session = GetSessionItems(HttpContext);
                _logger.LogInformation("{0} {1} UserID : {2} IPAddress : {4}", "BaseController", "GetUserInformation", session.userInfo.UserID, session.IpAddress);
                tlistFiltered = session.userInfo;

            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/GetUserInformation {1}", ex.Message);
            }

            return tlistFiltered;
        }
        #endregion

        #region Get Token
        private string GetAuthToken()
        {
            SessionItems sessionItems = GetSessionItems(HttpContext);
            string authToken = sessionItems.authToken.access_token;
            _logger.LogInformation("{0} {1} UserID : {2} AuthToken :{3} IPAddress : {4}", "BaseController", "GetAuthToken", sessionItems.userInfo.UserID, authToken, sessionItems.IpAddress);
            return authToken;
        }
        #endregion

        [HttpGet]
        public List<RolesMapping> GetSessionForHtml(string RouteValues)
        {
            List<RolesMapping> tlistFiltered = new List<RolesMapping>();
            try
            {
                SessionItems session = GetSessionItems(HttpContext);
                List<RolesMapping> permissionList = session.rolesMapping;
                tlistFiltered = permissionList.Where(item => "/" + item.FormName == RouteValues).ToList();
                _logger.LogInformation("{0} {1} UserID : {2} {3} IPAddress : {4}", "BaseController", "GetSession", session.userInfo.UserID, RouteValues, session.IpAddress);
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/GetSession {1}", ex.Message);
            }

            return tlistFiltered;
        }

        #region HttpClient GET
        private HttpResponseMessage UseHttpClientGet(string? QueryString, string ApiName, string ControllerName)
        {
            HttpResponseMessage Result_ = new HttpResponseMessage();
            try
            {
                using (var client = new HttpClient())
                {
                    string authtoken = GetAuthToken();
                    client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("AM_SERVICE_URL"));
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authtoken);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var getTask = client.GetAsync(ControllerName + "/" + ApiName + ((QueryString == null) ? "" : QueryString));
                    getTask.Wait();
                    Result_ = getTask.Result;
                    _logger.LogInformation("{0} {1} APIName: {2} StatusCode :{3}", "BaseController", "GET", ControllerName + "/" + ApiName, getTask.Result.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/UseHttpClientGet {1} {2}", ex.Message, ApiName);
            }
            return Result_;
        }
        #endregion

        #region HttpClient POST
        private HttpResponseMessage UseHttpClientPost(string Data, string ApiName, string ControllerName)
        {
            HttpResponseMessage Result_ = new HttpResponseMessage();
            try
            {
                using (var client = new HttpClient())
                {
                    string authtoken = GetAuthToken();
                    client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("AM_SERVICE_URL") + ControllerName + "/" + ApiName);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authtoken);
                    var stringContent = new StringContent(Data, Encoding.UTF8, "application/json");
                    var postTask = client.PostAsync(ApiName, stringContent);
                    postTask.Wait();
                    Result_ = postTask.Result;
                    _logger.LogInformation("{0} {1} APIName: {2} StatusCode :{3}", "BaseController", "POST", ControllerName + "/" + ApiName, postTask.Result.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/UseHttpClientPost {1} {2}", ex.Message, ApiName);
            }
            return Result_;
        }
        #endregion

        #region Settings

        #region UserMaster

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserType()
        {
            UserInfo _info = GetUserInformation();

            HttpResponseMessage response = UseHttpClientGet("?TypeID=" + _info.UserTypeID, "GetUserType", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserDetail(string UserID)
        {
            UserInfo _info = GetUserInformation();

            HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "GetUserDetail", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUsers()
        {
            UserInfo _info = GetUserInformation();

            HttpResponseMessage response = UseHttpClientGet("?TypeID=" + _info.UserTypeID + "&UserID=" + _info.UserID, "GetUsersByType", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetForms()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetForms", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedFormat()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetFeedFormat", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserRoles()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetMapping(string RoleId)
        {
            HttpResponseMessage response = UseHttpClientGet("?RoleId=" + RoleId, "GetMapping", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult FetchAdUsers()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "FetchAdUsers", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditUsers([FromForm] User Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.EditUserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditUsers", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveUsers([FromForm] User Data)
        {
            UserInfo userinfo = GetUserInformation();
            if (userinfo.UserTypeID.ToString() == Data.UserTypeID) return BadRequest("Cannot Create Account For Type " + userinfo.UserType);

            Data.EditUserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveUsers", "Settings");

            return new HttpResponseMessageResult(response);

        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteUsers([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.EditUserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteUsers", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region RoleMaster

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRoles()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRolesByID(string RoleID)
        {
            HttpResponseMessage response = UseHttpClientGet("?RoleID=" + RoleID, "GetRolesByID", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditRoles([FromForm] Role Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveRoles([FromForm] Role Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveFeedUrlFormt([FromBody] FeedFormatURL feedFormatURL)
        {
            UserInfo userinfo = GetUserInformation();
            feedFormatURL.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(feedFormatURL);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveFeedUrlFormt", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedFormatURL()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetFeedFormatURL", "Settings");
            return new HttpResponseMessageResult(response);
        }


        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteRoles([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region SystemPriviliges

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetMapping_2(string RoleId)
        {
            HttpResponseMessage response = UseHttpClientGet("?RoleId=" + RoleId, "GetMapping_2", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult UpdateRolesMapping([FromBody] RoleMapping Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "UpdateRolesMapping", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region SmtpSetting
        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SmtpSettingUpdate([FromBody] SMTPSettings smtpSetting)
        {
            UserInfo userinfo = GetUserInformation();

            string encryptpassword = _dataEncryptor.EncryptPassword(smtpSetting.SmtpPassword);
            smtpSetting.SmtpPassword = encryptpassword;
            string jsonString = JsonConvert.SerializeObject(smtpSetting);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SmtpSettingUpdate", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SmtpSettingGet()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "SmtpSettingGet", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region MasterNewsTags
        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsTags()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetNewsTags", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTagType()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetTagType", "Settings");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTagsByID(string TagID)
        {
            HttpResponseMessage response = UseHttpClientGet("?TagID=" + TagID, "GetTagsByID", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditTags([FromBody] TagsMaster tagsMaster)
        {
            UserInfo userinfo = GetUserInformation();
            tagsMaster.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(tagsMaster);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditTags", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveNewsTags([FromBody] TagsMaster tagsMaster)
        {
            UserInfo userinfo = GetUserInformation();
            tagsMaster.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(tagsMaster);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveNewsTags", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteTags([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteTags", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region SlugsMaster

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetSlugs()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetSlugs", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetSlugType()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetSlugType", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetSlugsByID(string SlugID)
        {
            HttpResponseMessage response = UseHttpClientGet("?SlugID=" + SlugID, "GetSlugsByID", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditSlugs([FromBody] SlugsMaster slugsmaster)
        {
            UserInfo userinfo = GetUserInformation();
            slugsmaster.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(slugsmaster);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditSlugs", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveSlugs([FromBody] SlugsMaster slugsMaster)
        {
            UserInfo userinfo = GetUserInformation();
            slugsMaster.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(slugsMaster);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveSlugs", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteSlugs([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteSlugs", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region APIMODULE

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetApiEndPoint()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetApiEndPoint", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetApiEndPointByID(string ApiModuleID)
        {
            HttpResponseMessage response = UseHttpClientGet("?ApiModuleID=" + ApiModuleID, "GetApiEndPointByID", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditApiEndPoint([FromBody] ApiEndPoint apiEndPoint)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(apiEndPoint);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditApiEndPoint", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveApiEndPoint([FromBody] ApiEndPoint apiEndPoint)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(apiEndPoint);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveApiEndPoint", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteApiEndPoint([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteApiEndPoint", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region APIUSERMASTER

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetApiUser()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetApiUser", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetApiUserByID(string UserID)
        {
            HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "GetApiUserByID", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditApiUser([FromBody] ApiUser apiUser)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(apiUser);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditApiUser", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveApiUser([FromBody] ApiUser apiUser)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(apiUser);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveApiUser", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteApiUser([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteApiUser", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #endregion

        #region Forms Pages
        #region Category

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCategory()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetCategory", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCategoryByID(string CategoryID)
        {
            HttpResponseMessage response = UseHttpClientGet("?CategoryID=" + CategoryID, "GetCategoryByID", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditCategory([FromBody] Category category)
        {
            UserInfo userinfo = GetUserInformation();
            category.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(category);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditCategory", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveCategory([FromBody] Category category)
        {
            UserInfo userinfo = GetUserInformation();
            category.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(category);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveCategory", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteCategory([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteCategory", "Forms");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region Feed LINK Created
        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SelectFeedUrl()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "SelectFeedUrl", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult update_feed_url([FromBody] FeedLINK feedLINK)
        {
            UserInfo userinfo = GetUserInformation();
            feedLINK.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(feedLINK);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "update_feed_url", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult insert_feed_url([FromBody] FeedLINK feedLINK)
        {
            UserInfo userinfo = GetUserInformation();
            feedLINK.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(feedLINK);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "insert_feed_url", "Forms");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult delete_feed_url([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "delete_feed_url", "Forms");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRssFeedURL(string Feed_ID)
        {
            HttpResponseMessage response = UseHttpClientGet("?Feed_ID=" + Feed_ID, "GetRssFeedURL", "Forms");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #endregion

        #region Feed Management
        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedALLData(int pageNumber = 1, int pageSize = 40)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping.Count > 0 && _rolesmapping[0].IsView == true)
            {
                string queryString = $"?pageNumber={pageNumber}&pageSize={pageSize}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetFeedALLData", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedTEXTData(int pageNumber = 1, int pageSize = 40)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping.Count > 0 && _rolesmapping[0].IsView == true)
            {
                string queryString = $"?pageNumber={pageNumber}&pageSize={pageSize}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetFeedTEXTData", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedImageData(int pageNumber = 1, int pageSize = 40)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping.Count > 0 && _rolesmapping[0].IsView == true)
            {
                string queryString = $"?pageNumber={pageNumber}&pageSize={pageSize}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetFeedImageData", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DetailFeedDataByID(string FeedID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?FeedID=" + FeedID, "DetailFeedDataByID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedDataBySearchKeyWord(string SearchKeyword, string SelectItem)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping[0].IsView)
            {
                string queryString = $"?SearchKeyword={SearchKeyword}&SelectItem={SelectItem}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetFeedDataBySearchKeyWord", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetAllFeedCategory()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetAllFeedCategory", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetFeedDataByfilter([FromQuery] string Category, string? StartDate, string? EndDate, string SourceID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping[0].IsView)
            {
                string queryString = $"?Category={Category}&StartDate={StartDate}&EndDate={EndDate}&SourceID={SourceID}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetFeedDataByfilter", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetAllFeedSources()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/Feed");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetAllFeedSources", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveNewsMetaTag([FromBody] NewsMetaTags newsMetaTags)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsMetaTags);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveNewsMetaTag", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetAllNewsTagEachNews(string FeedID)
        {
            HttpResponseMessage response = UseHttpClientGet("?FeedID=" + FeedID, "GetAllNewsTagEachNews", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveNewsMetaKeywordName([FromBody] NewsMetaKeywords newsMetaKeywords)
        {
            string jsonString = JsonConvert.SerializeObject(newsMetaKeywords);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveNewsMetaKeywordName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetAllNewsKeywordEachNews(string FeedID)
        {
            HttpResponseMessage response = UseHttpClientGet("?FeedID=" + FeedID, "GetAllNewsKeywordEachNews", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_AllNews_Tags()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "Get_AllNews_Tags", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_AllNews_TagsFillDropdown()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "Get_AllNews_Tags", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]

        public IActionResult Get_AllNews_slugs()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "Get_AllNews_slugs", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_AllNews_MetaKeyword()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "Get_AllNews_MetaKeyword", "Feed");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region Save Collection Name
        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveCollectionName([FromBody] CollectionName collectionName)
        {
            UserInfo userinfo = GetUserInformation();
            collectionName.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(collectionName);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCollectionNameforFeed()
        {

            HttpResponseMessage response = UseHttpClientGet(null, "GetCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCollectionNameManageCollection()
        {
            UserInfo userinfo = GetUserInformation();
            HttpResponseMessage response = UseHttpClientGet(null, "GetCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCollectionNameforNewsCreation()
        {
            UserInfo userinfo = GetUserInformation();
            HttpResponseMessage response = UseHttpClientGet(null, "GetCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]

        public IActionResult GetCollectionNameforSingleNews()
        {
            UserInfo userinfo = GetUserInformation();
            HttpResponseMessage response = UseHttpClientGet(null, "GetCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCollectionNameforSingleNewsEdit()
        {
            UserInfo userinfo = GetUserInformation();
            HttpResponseMessage response = UseHttpClientGet(null, "GetCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetCollectionNameforMGNewsEdit()
        {
            UserInfo userinfo = GetUserInformation();
            HttpResponseMessage response = UseHttpClientGet(null, "GetCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Added_Feed_To_Collection([FromBody] CollectionFeeds collectionFeeds)
        {
            UserInfo userinfo = GetUserInformation();
            collectionFeeds.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(collectionFeeds);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Added_Feed_To_Collection", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_Feed_By_CollectionForNewscreation(string CollectionID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?CollectionID=" + CollectionID, "Get_Feed_By_Collection", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_Feed_By_CollectionForSingleNews(string CollectionID)
        {
                HttpResponseMessage response = UseHttpClientGet("?CollectionID=" + CollectionID, "Get_Feed_By_Collection", "Feed");
                return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_Feed_By_CollectionForNewsEdit(string CollectionID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?CollectionID=" + CollectionID, "Get_Feed_By_Collection", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_Feed_By_CollectionForMGNewsEdit(string CollectionID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?CollectionID=" + CollectionID, "Get_Feed_By_Collection", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_Feed_By_CollectionForViewSaveCollection(string CollectionID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/ViewSaveCollection");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?CollectionID=" + CollectionID, "Get_Feed_By_Collection", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_Collection_Single_Feed(string FeedID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/ViewSaveCollection");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?FeedID=" + FeedID, "Get_Collection_Single_Feed", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetSingleNewsDetail(string NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/SingleNewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetSingleNewsDetail", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetMultipleNewsDetail(string NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MultipleNewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetMultipleNewsDetail", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGUpdateMultipleNews([FromBody] NewsMultiple news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MultipleNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGUpdateMultipleNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGSaveMultipleNewsGraph([FromBody] NewsMultiple news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MultipleNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGSaveMultipleNewsGraph", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }



        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Update_MultipleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContents);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Update_MultipleNews_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteSingleNewsHTMLTable([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteSingleNewsHTMLTable", "Feed");
            return new HttpResponseMessageResult(response);
        }



        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteMultipleNewsHTMLTable([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteMultipleNewsHTMLTable", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteSingleNewsGraph([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteSingleNewsGraph", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteMultipleNewsGraph([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteMultipleNewsGraph", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteSaveCollectionFeed([FromBody] DeleteNewsData deleteNewsData)
        {
            UserInfo userinfo = GetUserInformation();
            deleteNewsData.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(deleteNewsData);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteSaveCollectionFeed", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteCollectionName([FromBody] DeleteNewsData deleteNewsData)
        {
            UserInfo userinfo = GetUserInformation();
            deleteNewsData.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(deleteNewsData);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteCollectionName", "Feed");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region Planning
        [HttpGet]
        public IActionResult GetPlanningCategory()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetPlanningCategory", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        public IActionResult SavePlanning([FromBody] Planning planning)
        {
            UserInfo userinfo = GetUserInformation();
            planning.createdby = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(planning);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SavePlanning", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        public IActionResult GetPlanning(string UserID)
        {
            HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "GetPlanning", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        public IActionResult GetPlanningNotification()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetPlanningNotification", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        public IActionResult GetPlanningBySearch(string Search_Keyword)
        {
            HttpResponseMessage response = UseHttpClientGet("?Search_Keyword=" + Search_Keyword, "GetPlanningBySearch", "Feed");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region Template Creation
        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveTemplateCreationLayout([FromBody] List<TemplateSaveRequest> templateSaveRequests)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/TemplateCreation");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();

                string jsonString = JsonConvert.SerializeObject(templateSaveRequests);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveTemplateCreationLayout", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult UpdateTemplateCreationLayout([FromBody] List<TemplateSaveRequest> templateSaveRequests)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/TemplateCreation");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();

                string jsonString = JsonConvert.SerializeObject(templateSaveRequests);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "UpdateTemplateCreationLayout", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTempleteLayout()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/TemplateCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetTempleteLayout", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]  //un use api
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetWorldNewsData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetWorldNewsData", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet] //un use api
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserTemplateDesign(string NewsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetUserTemplateDesign", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserTemplateDesignForNewsCreation()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetUserTemplateDesignForNewsCreation", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserTemplateDesignForNewsCreationMGNews()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNews");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetUserTemplateDesignForNewsCreation", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserTemplateDesignForTemplateCreation()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/TemplateCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetUserTemplateDesignForTemplateCreation", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateDesignTemplateID(int Template_ID)
        {
            HttpResponseMessage response = UseHttpClientGet("?Template_ID=" + Template_ID, "GetTemplateDesignTemplateID", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateDesignTemplateIDMGNews(int Template_ID)
        {
            HttpResponseMessage response = UseHttpClientGet("?Template_ID=" + Template_ID, "GetTemplateDesignTemplateID", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SelectTemplateDesignTemplateID(int Template_ID)
        {
            HttpResponseMessage response = UseHttpClientGet("?Template_ID=" + Template_ID, "SelectTemplateDesignTemplateID", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateDesignInEditforMgEditor(int NewsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetTemplateDesignInEdit", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateDesignInEditformgPubisher(int NewsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetTemplateDesignInEdit", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateDesignInEditforNewsEdit(int NewsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetTemplateDesignInEdit", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateDesignInEditforMGNewsEdit(int NewsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetTemplateDesignInEdit", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetTemplateNameBySearchKeyword(string SearchKeyword)
        {
            HttpResponseMessage response = UseHttpClientGet("?SearchKeyword=" + SearchKeyword, "GetTemplateNameBySearchKeyword", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveTemplateBoxType([FromBody] TemplateBoxType templateBoxType)
        {
            string jsonString = JsonConvert.SerializeObject(templateBoxType);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveTemplateBoxType", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]

        public IActionResult GetTemplateBoxType()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetTemplateBoxType", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetChartBgSeriesColor(string BGSeriesID)
        {
            HttpResponseMessage response = UseHttpClientGet("?BGSeriesID=" + BGSeriesID, "GetChartBgSeriesColor", "Feed");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region News Management
        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_News_DetailForMGEditor()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGEditor");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "Get_News_Detail", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_News_DetailForMGPublisher()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGPublisher");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "Get_News_Detail", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        //[HttpPost]
        //[TypeFilter(typeof(AllowedApiAccess))]
        //public IActionResult Save_News([FromBody] News news)
        //{
        //    List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
        //    if (_rolesmapping[0].AllowInsert)
        //    {
        //        UserInfo userinfo = GetUserInformation();
        //        news.Createdby = userinfo.UserID.ToString();
        //        string jsonString = JsonConvert.SerializeObject(news);
        //        HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News", "Feed");
        //        return new HttpResponseMessageResult(response);
        //    }
        //    else
        //    {
        //        return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
        //    }
        //}

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGSaveSingleNews([FromBody] News news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/CreateSingleNews");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGSaveSingleNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGSaveMultipleNews([FromBody] NewsMultiple news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/CreateMultipleNews");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGSaveMultipleNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_MultipleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContents);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_MultipleNews_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_News_Content([FromBody] List<NewsContents> newsContents)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContents);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_SingleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContents);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_SingleNews_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGUpdateSingleNews([FromBody] News news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/SingleNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGUpdateSingleNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGSaveSingleNewsGraph([FromBody] News news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/SingleNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGSaveSingleNewsGraph", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGSaveSingleNewsTable([FromBody] News news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/SingleNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGSaveSingleNewsTable", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGSaveMultipleNewsTable([FromBody] NewsMultiple news)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MultipleNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                string jsonString = JsonConvert.SerializeObject(news);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "MGSaveMultipleNewsTable", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Update_SingleNews_Content([FromBody] List<NewsContents> newsContents)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContents);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Update_SingleNews_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_NewsCategoryforNewsCreation()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "Get_NewsCategory", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Get_NewsCategoryforNewsEdit()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "Get_NewsCategory", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_News_Category([FromBody] NewsCategory newsCategory)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                newsCategory.Createdby = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(newsCategory);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News_Category", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Insert").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsDetailBySearchforMGEditor(string SearchKeyword)
        {
            HttpResponseMessage response = UseHttpClientGet("?SearchKeyword=" + SearchKeyword, "GetNewsDetailBySearch", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsDetailBySearchforMGpublisher(string SearchKeyword)
        {
            HttpResponseMessage response = UseHttpClientGet("?SearchKeyword=" + SearchKeyword, "GetNewsDetailBySearch", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsByIDForMGEditor(int NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGEditor");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetNewsByID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsByIDForMGPublisher(int NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGPublisher");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetNewsByID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }




        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsByIDForNewsEdit(int NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetNewsByID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsByIDForMGNewsEdit(int NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetNewsByID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsByIDForNewsViews(int NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetNewsByID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet] //un use api
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsLayoutForEditor(int newsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?newsID=" + newsID, "GetNewsLayoutForEditor", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet] //un use api
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsDetailByMGEditor(int NewsID)
        {
            HttpResponseMessage response = UseHttpClientGet("?NewsID=" + NewsID, "GetNewsDetailByMGEditor", "Feed");
            return new HttpResponseMessageResult(response);
        }

        //[HttpPost]
        //[TypeFilter(typeof(AllowedApiAccess))]
        //public IActionResult Update_News([FromBody] News news)
        //{
        //    List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsEdit");
        //    if (_rolesmapping[0].AllowUpdate)
        //    {
        //        UserInfo userinfo = GetUserInformation();
        //        news.Updateby = userinfo.UserID.ToString();
        //        string jsonString = JsonConvert.SerializeObject(news);
        //        HttpResponseMessage response = UseHttpClientPost(jsonString, "Update_News", "Feed");
        //        return new HttpResponseMessageResult(response);
        //    }
        //    else
        //    {
        //        return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
        //    }
        //}

        //[HttpPost]
        //[TypeFilter(typeof(AllowedApiAccess))]
        //public IActionResult MGUpdate_News([FromBody] News news)
        //{
        //    List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNewsEdit");
        //    if (_rolesmapping[0].AllowUpdate)
        //    {
        //        UserInfo userinfo = GetUserInformation();
        //        news.Updateby = userinfo.UserID.ToString();
        //        string jsonString = JsonConvert.SerializeObject(news);
        //        HttpResponseMessage response = UseHttpClientPost(jsonString, "Update_News", "Feed");
        //        return new HttpResponseMessageResult(response);
        //    }
        //    else
        //    {
        //        return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
        //    }
        //}

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Update_News_Content([FromBody] List<NewsContents> newsContent)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContent);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Update_News_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult MGUpdate_News_Content([FromBody] List<NewsContents> newsContent)
        {
            UserInfo userinfo = GetUserInformation();
            string jsonString = JsonConvert.SerializeObject(newsContent);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "Update_News_Content", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteNews([FromBody] DeleteFromDB Data)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].AllowDelete)
            {
                UserInfo userinfo = GetUserInformation();
                Data.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(Data);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Delete").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost] //not use in js
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveTemplateNewsDesign([FromBody] SaveNewsTemplate saveNewsTemplate)
        {
            UserInfo userinfo = GetUserInformation();
            saveNewsTemplate.CreatedBy = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(saveNewsTemplate);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveTemplateNewsDesign", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]//not use in js
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult UpdateLivePerviewTemplate([FromBody] SaveNewsTemplate saveNewsTemplate)
        {
            UserInfo userinfo = GetUserInformation();
            saveNewsTemplate.UpdateBy = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(saveNewsTemplate);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "UpdateLivePerviewTemplate", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsDisplayByUserID(string UserID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].IsView)
            {
                UserInfo UserInfo = GetUserInformation();
                UserID = UserInfo.UserID.ToString();
                HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "GetNewsDisplayByUserID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsDisplayByUserIDMGNews(string UserID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNews");
            if (_rolesmapping[0].IsView)
            {
                UserInfo UserInfo = GetUserInformation();
                UserID = UserInfo.UserID.ToString();
                HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "GetNewsDisplayByUserID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteNEwsByUserID([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].AllowDelete)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteNEwsByUserID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteNEwsByUserIDMGNews([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNews");
            if (_rolesmapping[0].AllowDelete)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteNEwsByUserID", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        public IActionResult GetAIGeneratedNews(string newsContent)
        {
            try
            {
                string queryString = $"?newsContent={newsContent}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetAIGeneratedNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpGet]
        public IActionResult GetAIGeneratedMGNews(string newsContent)
        {
            try
            {
                string queryString = $"?newsContent={newsContent}";
                HttpResponseMessage response = UseHttpClientGet(queryString, "GetAIGeneratedNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }



        [HttpPost]
        public IActionResult GenerateImage([FromBody] Dictionary<string, string> requestData)
        {
            try
            {
                string jsonString = JsonConvert.SerializeObject(requestData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "GenerateImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult CheckUserTemplateExist(string UserID)
        {

            UserInfo UserInfo = GetUserInformation();
            UserID = UserInfo.UserID.ToString();
            HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "CheckUserTemplateExist", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsServices()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetNewsServices", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetNewsByService(int ServiceID)
        {
            HttpResponseMessage response = UseHttpClientGet("?ServiceID=" + ServiceID, "GetNewsByService", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetChartBgSeries(int TemplateID)
        {
            HttpResponseMessage response = UseHttpClientGet("?TemplateID=" + TemplateID, "GetChartBgSeries", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveImageForResulationForNews([FromBody] ImageUploadRequest request)
        {
            string jsonString = JsonConvert.SerializeObject(request);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveImageForResulation", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveImageForResulationMGForNews([FromBody] ImageUploadRequest request)
        {
            string jsonString = JsonConvert.SerializeObject(request);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveImageForResulation", "Feed");
            return new HttpResponseMessageResult(response);
        }



        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveImageForResulationForNewsEdit([FromBody] ImageUploadRequest request)
        {
            string jsonString = JsonConvert.SerializeObject(request);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveImageForResulation", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveImageForResulationForMGNewsEdit([FromBody] ImageUploadRequest request)
        {
            string jsonString = JsonConvert.SerializeObject(request);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveImageForResulation", "Feed");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetImages()
        {
            try
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetImages", "Feed");
                return new HttpResponseMessageResult(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error forwarding request: " + ex.Message });
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_News_ImageRisizeForNews([FromBody] RisizeNewsImage risizeNewsImage)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                risizeNewsImage.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(risizeNewsImage);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News_ImageRisize", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_News_ImageRisizeForMGNews([FromBody] RisizeNewsImage risizeNewsImage)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNews");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                risizeNewsImage.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(risizeNewsImage);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News_ImageRisize", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_News_ImageRisizeForNewsEdit([FromBody] RisizeNewsImage risizeNewsImage)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                risizeNewsImage.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(risizeNewsImage);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News_ImageRisize", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Save_News_ImageRisizeForMGNewsEdit([FromBody] RisizeNewsImage risizeNewsImage)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNewsEdit");
            if (_rolesmapping[0].AllowInsert)
            {
                UserInfo userinfo = GetUserInformation();
                risizeNewsImage.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(risizeNewsImage);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "Save_News_ImageRisize", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRisizeNewsImageForMGPublsiher(string UserID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGPublisher");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?UserID=" + UserID, "GetRisizeNewsImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRisizeNewsImageForNewsCreation(string DivID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsCreation");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?DivID=" + DivID, "GetRisizeNewsImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRisizeNewsImageForMGNewsCreation(string DivID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNews");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?DivID=" + DivID, "GetRisizeNewsImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRisizeNewsImageForNewsEdit(string DivID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?DivID=" + DivID, "GetRisizeNewsImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRisizeNewsImageForMGNewsEdit(string DivID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?DivID=" + DivID, "GetRisizeNewsImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetSelectEachNEwsImage(string DivID, string NewsID)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsEdit");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet("?DivID=" + DivID + "&NewsID=" + NewsID, "GetSelectEachNEwsImage", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }




        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult CreaterSendToEditor([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsView");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "CreaterSendToEditor", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult CreaterSendToEditorMGNews([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGNews");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "CreaterSendToEditor", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }


        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult PublisherSendToEditor([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGPublisher");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "PublisherSendToEditor", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditorSendToCreater([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGEditor");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "EditorSendToCreater", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());

            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditorSendToPublisher([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGEditor");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "EditorSendToPublisher", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult PublisherNewsLive([FromBody] DeleteNewsData deleteNewsData)
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/MGPublisher");
            if (_rolesmapping[0].AllowUpdate)
            {
                UserInfo userinfo = GetUserInformation();
                deleteNewsData.UserID = userinfo.UserID.ToString();
                string jsonString = JsonConvert.SerializeObject(deleteNewsData);
                HttpResponseMessage response = UseHttpClientPost(jsonString, "PublisherNewsLive", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "Update").Select(x => x.errormessage).FirstOrDefault());
            }
        }
        #endregion


        #region Single News
        [HttpGet]
        //[TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetGraphTypeName()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetGraphTypeName", "Feed");
            return new HttpResponseMessageResult(response);
        }

        #endregion


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetVeiwNews()
        {
            List<RolesMapping> _rolesmapping = GetSession("/Feed/NewsView");
            if (_rolesmapping[0].IsView)
            {
                HttpResponseMessage response = UseHttpClientGet(null, "GetVeiwNews", "Feed");
                return new HttpResponseMessageResult(response);
            }
            else
            {
                return BadRequest(_sessions.ErrorInfo.Where(x => x.errorname == "RoleID").Select(x => x.errormessage).FirstOrDefault());
            }
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRSSFeedByFormat(string FormatID)
        {
            HttpResponseMessage response = UseHttpClientGet("?ServiceID=" + FormatID, "GetRSSFeedByFormat", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRSSFeedByFormat_TopNumber(string FormatID, string TopN)
        {
            HttpResponseMessage response = UseHttpClientGet("?FormatID=" + FormatID + "&TopN=" + TopN, "GetRSSFeedByFormat_TopNumber", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRSSFeedByExternal(string FormatID, string TopN)
        {
            HttpResponseMessage response = UseHttpClientGet("?FormatID=" + FormatID + "&TopN=" + TopN, "GetRSSFeedByExternal", "Feed");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRSSFeedByFormat_Date(string FormatID, string TopN, string StartDate, string EndDate)
        {
            HttpResponseMessage response = UseHttpClientGet("?FormatID=" + FormatID + "&TopN=" + TopN + "&StartDate=" + StartDate + "&EndDate=" + EndDate, "GetRSSFeedByFormat_Date", "Feed");
            return new HttpResponseMessageResult(response);
        }
    }

    public class ImageUploadRequest
    {
        public string? Image { get; set; }
        public string? Resolution { get; set; }
        public string? ImageName { get; set; }
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
        public string? UserID { get; set; }
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
        public string? UserID { get; set; }
        public string? NewsID { get; set; }
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
        public string? Style { get; set; }
        public string? Data_Columns { get; set; }
        public string? id { get; set; }
        public string? TypeID { get; set; }
        public string? Template_ID { get; set; }
        public string? Template_Name { get; set; }
        public string? Inline_Style { get; set; }
        public string? chartbgseries { get; set; }
    }

    //public class News
    //{
    //    public string? NewsID { get; set; }
    //    public string? UserID { get; set; }
    //    public string? TemplateID { get; set; }
    //    public List<string>? TagID { get; set; }
    //    public List<string>? SlugID { get; set; }
    //    public string? NewsStatus { get; set; }
    //    public string? Islive { get; set; }

    //}



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
        public string? SeriesName { get; set; }
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

    public class NewsMetaKeywords
    {
        public string? MetaKeyword { get; set; }
        public string? FeedID { get; set; }
    }

    public class NewsMetaTagsNews
    {
        public string? TagName { get; set; }
        public string? NewsID { get; set; }
    }
}
