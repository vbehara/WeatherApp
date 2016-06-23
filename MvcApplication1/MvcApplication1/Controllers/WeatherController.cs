using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace MvcApplication1.Controllers
{
    public class WeatherController : Controller
    {
        //
        // GET: /Weather/

        public ActionResult WeatherAPI()
        {
            return View();
        }
        //WeatherOfCity
        public JsonResult WeatherOfCity(string city)
        {
            String responseFromServer = "";
           
            try
            {
                WebRequest request = WebRequest.Create("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=0955efe50656dfa83b52d5e8c4b34517");
                // If required by the server, set the credentials.
                request.Credentials = CredentialCache.DefaultCredentials;
                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                
                // Get the stream containing content returned by the server.
                Stream dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                //jsonString = new JavaScriptSerializer().Serialize(responseFromServer);
                // Clean up the streams and the response.
                reader.Close();
                response.Close();
            }
            catch (Exception e)
            {
                Console.Error.WriteLine("Exception");
            }
            return Json(responseFromServer,JsonRequestBehavior.AllowGet) ;
        }

        public JsonResult WeatherOfCurrentCity(float latitude,float longitude)
        {
            String responseFromServer = "";

            try
            {
                //http://api.openweathermap.org/data/2.5/weather?lat=42.1&lon=-75.92&units=metric
                WebRequest request = WebRequest.Create("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=0955efe50656dfa83b52d5e8c4b34517");
                // If required by the server, set the credentials.
                request.Credentials = CredentialCache.DefaultCredentials;
                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);

                // Get the stream containing content returned by the server.
                Stream dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                //jsonString = new JavaScriptSerializer().Serialize(responseFromServer);
                // Clean up the streams and the response.
                reader.Close();
                response.Close();
            }
            catch (Exception e)
            {
                Console.Error.WriteLine("Exception");
            }
            return Json(responseFromServer, JsonRequestBehavior.AllowGet);
        }

        // to forecast weather by coordinates
        public JsonResult WeatherForecast(float latitude,float longitude)
        {
            String responseFromServer = "";

            try
            {
                //http://api.openweathermap.org/data/2.5/weather?lat=42.1&lon=-75.92&units=metric
                WebRequest request = WebRequest.Create("http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=0955efe50656dfa83b52d5e8c4b34517");
                // If required by the server, set the credentials.
                request.Credentials = CredentialCache.DefaultCredentials;
                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);

                // Get the stream containing content returned by the server.
                Stream dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                //jsonString = new JavaScriptSerializer().Serialize(responseFromServer);
                // Clean up the streams and the response.
                reader.Close();
                response.Close();
            }
            catch (Exception e)
            {
                Console.Error.WriteLine("Exception");
            }
            return Json(responseFromServer, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DailyForecast(float latitude, float longitude)
        {
            String responseFromServer = "";

            try
            {
                //http://api.openweathermap.org/data/2.5/forecast/daily?lat=-10.43&lon=105.68&units=metric&cnt=10&mode=json
                WebRequest request = WebRequest.Create("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&units=metric&cnt=10&mode=json&appid=0955efe50656dfa83b52d5e8c4b34517");
                // If required by the server, set the credentials.
                request.Credentials = CredentialCache.DefaultCredentials;
                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);

                // Get the stream containing content returned by the server.
                Stream dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                //jsonString = new JavaScriptSerializer().Serialize(responseFromServer);
                // Clean up the streams and the response.
                reader.Close();
                response.Close();
            }
            catch (Exception e)
            {
                Console.Error.WriteLine("Exception");
            }
            return Json(responseFromServer, JsonRequestBehavior.AllowGet);
        }
    }
}
