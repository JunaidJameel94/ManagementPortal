using ManagementPortalApi.Models.Authentication;
using ManagementPortalApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ManagementPortalApi.Extensions;
using ManagementPortalApi.Models.Sessions;
using System.Collections.Specialized;
using System.Data;
using ManagementPortalApi.Context;
using ManagementPortalApi.Models.Settings;

namespace ManagementPortalApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IJWTManagerRepository _jWTManager;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly DataEncryptor _dataEncryptor;
        private readonly DataAccessLayer _DAL;
        public AuthenticationController(IJWTManagerRepository jWTManager, ILogger<AuthenticationController> logger, DataEncryptor dataEncryptor, DataAccessLayer DAL)
        {
            this._jWTManager = jWTManager;
            _logger = logger;
            _dataEncryptor = dataEncryptor;
            _DAL = DAL;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult token(UserDTO usersdata)
        {
            var token = _jWTManager.Authenticate(usersdata);

            if (token == null)
            {
                _logger.LogInformation("{0} {1} {2}", usersdata.LoginName, "AuthController/token", "Unauthorized");
                return Unauthorized();
            }
            _logger.LogInformation("{0} {1} {2}", usersdata.LoginName, "AuthController/token", "authorized");
            return Ok(token);
        }
        [HttpPost]
        public IActionResult apitoken(ApiUserDTO usersdatas)
        {

            ApiUser apiUser = new ApiUser();
            apiUser.UserName = usersdatas.UserName;

            string? HashedPassword = GetApiUserHashPassword(apiUser);
            if (string.IsNullOrEmpty(HashedPassword))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            else
            {
                bool verified = _dataEncryptor.VerifyPassword(usersdatas.UserPassword, HashedPassword);

                Tokens token = null;

                if (verified)
                {
                    usersdatas.UserPassword = HashedPassword;
                    token = _jWTManager.ApiUserAuthenticate(usersdatas);
                }

                if (token == null)
                {
                    return Unauthorized();
                }
                return Ok(token);
            }
           
        }

        //public string? GetUserHashPassword(LoginCreds logincreds_)
        //{
        //    DataTable dataTable = new DataTable();
        //    try
        //    {
        //        NameValueCollection nv = new NameValueCollection();
        //        nv.Clear();
        //        nv.Add("LoginName-VARCHAR", logincreds_.LoginName);
        //        dataTable = _DAL.GetData("sp_select_userhashpassword", nv, _DAL.CSManagementPortalDatabase);

        //        nv = null;

        //        if (dataTable != null && dataTable.Rows.Count > 0)
        //        {
        //            _logger.LogInformation("{0} {1} {2} {3}", "SessionsController", "GetUserHashPassword", "sp_select_userhashpassword", "OK");
        //            return dataTable.Rows[0][0].ToString();
        //        }
        //        else
        //        {
        //            _logger.LogInformation("{0} {1} {2} {3}", "SessionsController", "GetUserHashPassword", "sp_select_userhashpassword", "BadRequest");
        //            return "No Data Found";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogInformation("{0} {1} {2} {3}", "SessionsController", "GetUserHashPassword", "sp_select_userhashpassword", ex.Message);

        //        return "Something Went Wrong Please Contact Your Sysmtem Adminsitrator";
        //    }
        //}

        public string? GetApiUserHashPassword(ApiUser apiUser)
        {
            DataTable dataTable = new DataTable();
            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserName-NVARCHAR", apiUser.UserName);
                dataTable = _DAL.GetData("sp_select_Api_userhashpassword", nv, _DAL.CSManagementPortalDatabase);

                nv = null;

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                  
                    return dataTable.Rows[0][0].ToString();
                }
                else
                {
                    
                    return "No Data Found";
                }
            }
            catch (Exception ex)
            {
     
                return "Something Went Wrong Please Contact Your Sysmtem Adminsitrator";
            }
        }

    }
}
