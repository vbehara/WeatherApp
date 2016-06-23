using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class ChatRoomController : Controller
    {
        //
        // GET: /ChatRoom/

        public ActionResult Chat()
        {
            return View();
        }

        public ActionResult ChatOnly()
        {
            return View();
        }
    }
}
