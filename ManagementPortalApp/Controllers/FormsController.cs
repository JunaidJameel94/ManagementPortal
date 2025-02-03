using ManagementPortalApp.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    [TypeFilter(typeof(AuthenticationAccess))]
    public class FormsController : Controller
    {
       

        public IActionResult CreateRSSFeedLink()
        {
            return View();
        }

    }
}
