using ManagementPortalApp.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    [TypeFilter(typeof(AuthenticationAccess))]
    public class SettingsController : Controller
    {
        public IActionResult UserMaster()
        {
            return View();
        }
        public IActionResult RolesMaster()
        {
            return View();
        }
        public IActionResult SystemPriviliges()
        {
            return View();
        }
        public IActionResult SmtpSetting()
        {
            return View();
        }

        public IActionResult NewsReader()
        {
            return View();
        }


        public IActionResult Tags() 
        {
            return View();
        }

        public IActionResult MasterSlugs()
        {
            return View();
        }

        public IActionResult ApiUserMaster()
        {
            return View();
        }

        public IActionResult ApiEndPoint()
        {
            return View();
        }

    }
}
