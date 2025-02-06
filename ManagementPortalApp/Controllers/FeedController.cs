using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ManagementPortalApp.Utility;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    [TypeFilter(typeof(AuthenticationAccess))]
    public class FeedController : Controller
    {
        public IActionResult Feed()
        {
            return View();
        }

        public IActionResult ManageCollection()
        {
            return View();
        }

        public IActionResult ViewSaveCollection()
        {
            return View();
        }

        public IActionResult Planning()
        {
            return View();
        }


        public IActionResult TemplateCreation()
        {
            return View();
        }
        
        public IActionResult NewsCreation()
        {
            return View();
        }
        //npt use
        public IActionResult MGNews()
        {
            return View();
        }
        public IActionResult MGEditor()
        {
            return View();
        }

        public IActionResult MGPublisher()
        {
            return View();
        } 
        public IActionResult CreateSingleNews()
        {
            return View();
        }
        
       public IActionResult CreateMultipleNews()
        {
            return View();
        }
        //not use
        public IActionResult NewsEdit(int NewsID)
        {
            ViewBag.NewsID = NewsID;
            return View();
        }
        //not use
        public IActionResult MGNewsEdit(int NewsID)
        {
            ViewBag.NewsID = NewsID;
            return View();
        }

        public IActionResult SingleNewsEdit(int NewsID)
        {
            ViewBag.NewsID = NewsID;
            return View();
        }
        public IActionResult MultipleNewsEdit(int NewsID)
        {
            ViewBag.NewsID = NewsID;
            return View();
        }


        public IActionResult NewsView()
        {
            return View();
        }



    }
}
