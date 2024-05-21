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

        #endregion

    }

}
