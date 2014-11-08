using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OandaApi;
using OandaApi.Models;
using OandaApi.Communications;

namespace _72Trade.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var accountDetails = new AccountDetails();
            accountDetails = Oanda.GetAccountDetails(887591);

            return Json(new {data =accountDetails}, JsonRequestBehavior.AllowGet);
           // return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}