using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
// using Microsoft.WindowsAzure;
// using Microsoft.WindowsAzure.Storage;
// using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
//using SelectPdf;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarrierController : ControllerBase
    {
        private readonly IConfiguration Config;
        //UAT Blob settings
        string ConfigurationSectionKey = "DefaultEndpointsProtocol=https;AccountName=rl21;AccountKey=Gq8i6BGVMzqzwB/fL2gzUZq/DMtY6k0XrYVLEnnZ0vnxEkldw2U/useCPa3ho7ZN1fJHwRO0SKCpCAiMzaJMOw==";
        string BlobURL = "https://rl21.blob.core.windows.net/";

        //Prod Blob settings
        // string ConfigurationSectionKey = "DefaultEndpointsProtocol=https;AccountName=amerprodblob;AccountKey=fgP60RS0MksqX8F1GHoqmnygsxABrmHtvl+MTubOyqX13TlMR7prXLl68vu5HJE1W4OSMX18rdq6wzgLXEOW8A==";
        // string BlobURL = "https://amerprodblob.blob.core.windows.net/";

        private readonly IHostingEnvironment environment = null;
        private string _connStrDev = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrDevNAM = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test_NAM;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrUAT = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_UAT;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrPROD = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_Live;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrActive = string.Empty;

        public string ContainerName { get; set; }

        public CarrierController(IHostingEnvironment environment)
        {
            this.environment = environment;
            //_connStrActive = _connStrDev;         
            //_connStrActive = _connStrDevNAM;         
            _connStrActive = _connStrUAT;
            //_connStrActive = _connStrPROD;
        }

        // GET api/values/5
        [HttpGet]
        public ActionResult<string> Get([FromBody] ReturnModel value)
        {
            return JsonConvert.SerializeObject(value);
        }

        [HttpPost]
        public string Post([FromBody] ReturnModel value)
        {
            string carrierResponse = "{\"status\":\"ERROR\",\"errorMessage\":\"No carrier configuration found.\"}"; //"No carrier configuration found.";

            //==========RL to UB Request Log==============//
            try
            {
                LogExceptionsInErrorLog("RL to UB - Request", JsonConvert.SerializeObject(value));
            }
            catch (Exception ex)
            {
                
            }
            //==========End RL to UB Request Log==============//

            try
            {
                string custCountryCode = value.customer.address.country_code;
                string brandcode = value.brand;
                DataSet ds = new DataSet();
                using (SqlConnection con = new SqlConnection(_connStrActive))
                {
                    using (SqlCommand sqlcommand = new SqlCommand("GetCarrierConfigurationByCountryCode", con))
                    {
                        sqlcommand.CommandType = CommandType.StoredProcedure;
                        sqlcommand.Parameters.Add("@countryCode", SqlDbType.NVarChar, 50).Value = custCountryCode;
                        sqlcommand.Parameters.Add("@brandCode", SqlDbType.NVarChar, 50).Value = brandcode;
                        using (SqlDataAdapter adp = new SqlDataAdapter(sqlcommand))
                        {
                            if (con.State == ConnectionState.Closed)
                            {
                                con.Open();
                                adp.Fill(ds);
                                con.Close();
                            }
                        }
                    }
                }
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = ds.Tables[0];
                    var countrylist = (from DataRow dr in dt.Rows
                                       select new
                                       {
                                           CountryID = Convert.ToInt32(dr["CountryID"]),
                                           CountryCode = dr["CountryCode"].ToString(),
                                           CountryName = dr["CountryName"].ToString()
                                       }).ToList();
                    var counterr = countrylist.Where(s => s.CountryCode == custCountryCode).Count();
                    if (counterr > 0)
                    {
                        value.customRequiredCountry = true;
                    }
                }
                if (ds != null && ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                {
                    string carrierCode = "";
                    // try {
                    carrierCode = Convert.ToString(ds.Tables[1].Rows[0]["CarrierCode"]);
                    if (carrierCode == "United Broker(UB)")
                    {
                        // Pull UB credential configuration from Database
                        UBConfigurationModel ubconfig = new UBConfigurationModel();
                        ubconfig.APIKey = Convert.ToString(ds.Tables[1].Rows[0]["Key"]);
                        ubconfig.ShippingAPIURL = Convert.ToString(ds.Tables[1].Rows[0]["ServiceEndpoints"]);
                        ubconfig.TaskAPIURL = Convert.ToString(ds.Tables[1].Rows[0]["TaskServiceEndpoints"]);
                        carrierResponse = CallUBService(ubconfig, value);
                        UBCarrierResponse ubResponse = new UBCarrierResponse();
                        UBResponse ubNewResponse = new UBResponse();
                        GenericResponse genericRes = new GenericResponse();

                        if (!string.IsNullOrEmpty(carrierResponse))
                        {
                            //==========UB to RL Reponse Log==============//
                            try
                            {
                                LogExceptionsInErrorLog("UB to RL - Response", JsonConvert.SerializeObject(value));
                            }
                            catch (Exception)
                            {

                            }
                            //==========End UB to RL Reponse Log==============//

                            ubResponse = JsonConvert.DeserializeObject<UBCarrierResponse>(carrierResponse);

                            genericRes.status = ubResponse.status;

                            if (ubResponse.status == "OK")
                            {
                                if (ubResponse.content != null && ubResponse.content.tracking != null)
                                {
                                    foreach (UBTracking track in ubResponse.content.tracking)
                                    {
                                        genericRes.shipment_id = track.shipment_id;

                                        genericRes.packages = new List<GenericPackage>();
                                        foreach (UBPackage ubPkg in track.packages)
                                        {
                                            GenericPackage gPkg = new GenericPackage();
                                            gPkg.tracking_no = ubPkg.tracking_no;
                                            if (ubPkg.route_information != null && ubPkg.route_information.Count > 0)
                                            {
                                                UBRoute ubRoute = ubPkg.route_information[0];
                                                gPkg.route_number = ubRoute.route_number;
                                                gPkg.service_code = ubRoute.service_code;
                                                gPkg.carrier_code = ubRoute.carrier_code;
                                                gPkg.carrier_tracking_number = ubRoute.carrier_tracking_number;
                                                gPkg.tracking_url = ubRoute.tracking_url;
                                            }

                                            genericRes.packages.Add(gPkg);
                                        }
                                    }
                                }

                                if (ubResponse.content != null && ubResponse.content.download_result != null)
                                {
                                    if (ubResponse.content.download_result.download_urls != null)
                                    {
                                        genericRes.labelURLs = new List<LabelURL>();

                                        foreach (UBDownloadURL ubLbl in ubResponse.content.download_result.download_urls)
                                        {
                                            LabelURL lbl = new LabelURL();
                                            lbl.url = ubLbl.url;
                                            lbl.type = ubLbl.file_type;
                                            lbl.format = ubLbl.format;
                                            genericRes.labelURLs.Add(lbl);
                                        }
                                    }
                                }

                                StringBuilder errorMessage = new StringBuilder();
                                dynamic json = JsonConvert.DeserializeObject<Dictionary<string, string>>(ubResponse.content.download_result.errors.ToString());
                                foreach (KeyValuePair<string, string> entry in json)
                                {
                                    errorMessage.Append(entry.Value);
                                    errorMessage.Append(" ");
                                }

                                genericRes.errorMessage = errorMessage.ToString().Trim();
                                if (!string.IsNullOrEmpty(errorMessage.ToString().Trim()))
                                {
                                    genericRes.status = "ERROR";
                                    LogExceptionsInErrorLog(genericRes.errorMessage, JsonConvert.SerializeObject(value));
                                }
                            }
                            else
                            {
                                ubNewResponse = JsonConvert.DeserializeObject<UBResponse>(carrierResponse);
                                genericRes.errorMessage = ubNewResponse.messages[0].text;
                                if (!string.IsNullOrEmpty(genericRes.errorMessage))
                                {
                                    genericRes.status = "ERROR";
                                    LogExceptionsInErrorLog(genericRes.errorMessage, JsonConvert.SerializeObject(value));
                                }
                            }
                            carrierResponse = JsonConvert.SerializeObject(genericRes);
                        }
                    }
                    else
                    {
                        // Pull UPS credential configuration from Database
                        UPSConfigurationModel upsconfig = new UPSConfigurationModel();
                        upsconfig.APIURL = Convert.ToString(ds.Tables[1].Rows[0]["ServiceEndpoints"]);
                        upsconfig.Accesskey = Convert.ToString(ds.Tables[1].Rows[0]["AccessKey"]);
                        upsconfig.Password = Convert.ToString(ds.Tables[1].Rows[0]["Password"]);
                        upsconfig.ShipperNumber = Convert.ToString(ds.Tables[1].Rows[0]["ShipperNumber"]);
                        upsconfig.UserID = Convert.ToString(ds.Tables[1].Rows[0]["User"]);
                        carrierResponse = CallUPSService(upsconfig, value);
                    }
                }

            }
            catch (WebException wex)
            {
                if (wex.Response != null)
                {
                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        //throw new Exception (errorResponse.StatusCode.ToString ());
                        carrierResponse = "{\"status\":\"ERROR\",\"errorMessage\":\"Please try again later.\"}";
                        string errorMessage = string.Empty;
                        using (Stream data = errorResponse.GetResponseStream())
                        {
                            errorMessage = new StreamReader(data).ReadToEnd();
                        }

                        LogExceptionsInErrorLog(errorResponse.StatusCode.ToString() + ": " + errorMessage, JsonConvert.SerializeObject(value));
                    }
                }
            }
            catch (Exception ex)
            {
                //throw new Exception (ex.Message);

                carrierResponse = "{\"status\":\"ERROR\",\"errorMessage\":\"Something went wrong. Please try again later.\"}";
                LogExceptionsInErrorLog(ex.Message, JsonConvert.SerializeObject(value));
            }

            // TODO: remove harcoded response
            return carrierResponse;
        }

        #region pdf to html
        public string GetDropOffLabel(ReturnModel retModel, string carriername)
        {
            BlobHelper bh = new BlobHelper();
            // read parameters from the webpage
            bh.PrintedDate = DateTime.UtcNow.ToLongDateString();
            bh.DropOffLocation = "";
            bh.CustmerDetail = retModel.customer.title + " " + retModel.customer.firstname + " " + retModel.customer.lastname + ", " + retModel.customer.email + ", " + retModel.customer.phone;
            bh.CustomerAddress = retModel.customer.address.complete_address;
            bh.DropOffDate = "";
            bh.EstimatedPickup = "";
            bh.TotalPackage = retModel.shipment.parcels.Count().ToString();
            bh.TrackingNumber = "";
            bh.Carrier = carriername;
            bh.Weight = "1 lbs"; // retModel.shipment.parcels.Select(y => y.dimensions).Sum(x => x.weight).ToString();
            string htmlString = bh.GenerateDropofflabeHTML(); //Path.Combine(environment.ContentRootPath, "Reports", "dropofflabel.html");//"./Reports/dropofflabel.html";
            string baseUrl = "";

            string pdf_page_size = "A4";
            // PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize),
            //     pdf_page_size, true);

            // string pdf_orientation = "Portrait";
            // PdfPageOrientation pdfOrientation =
            //     (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation),
            //         pdf_orientation, true);

            int webPageWidth = 1024;
            int webPageHeight = 150;

            // instantiate a html to pdf converter object
            // HtmlToPdf converter = new HtmlToPdf();

            // // set converter options
            // converter.Options.PdfPageSize = pageSize;
            // converter.Options.PdfPageOrientation = pdfOrientation;
            // converter.Options.WebPageWidth = webPageWidth;
            // converter.Options.WebPageHeight = webPageHeight;
            // converter.Options.MarginLeft = 10;
            // converter.Options.MarginRight = 10;
            // converter.Options.MarginTop = 20;
            // converter.Options.MarginBottom = 20;

            // // create a new pdf document converting an url
            // PdfDocument doc = converter.ConvertHtmlString(htmlString, baseUrl);
            // //PdfDocument doc = converter.ConvertUrl(htmlString);

            // // save pdf document
            // string fileName = bh.GenerateFileName("testfile");
            // doc.Save("Reports/" + fileName);
            // doc.Close();

            // string filepath = Path.Combine(environment.ContentRootPath, "Reports", fileName);
            // byte[] bytes = System.IO.File.ReadAllBytes(filepath);
            // string mimeType = bh.GetMimeType(filepath);
            // Task<string> uploadedfileUrl = bh.UploadBlob(fileName, bytes, mimeType);
            // string uripath = uploadedfileUrl.Result;
            // if (System.IO.File.Exists(Path.Combine(environment.ContentRootPath, "Reports", fileName)))
            // {
            //     // If file found, delete it    
            //     System.IO.File.Delete(Path.Combine(environment.ContentRootPath, "Reports", fileName));
            //     Console.WriteLine("File deleted.");
            // }
           // return uripath;
           return "";
        }

        #endregion

        #region "UB Integration"
        private string CallUBService(UBConfigurationModel ubconfig, ReturnModel value)
        {
            string createJSONforUB = GenerateUBLabelJSON(value);
             //==========UB Request Log==============//
            try
            {
                LogExceptionsInErrorLog("UB - Request", createJSONforUB);
            }
            catch (Exception ex)
            {
                
            }
            //==========End UB Request Log==============//

            string xmltaskResponse = "";
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(ubconfig.ShippingAPIURL); // pull from database Shipping URL
            request.Method = "POST";
            string api_key = ubconfig.APIKey; // pull from database API Key
            request.Headers.Add("api_key", api_key);
            request.ContentType = "application/json;";

            using (Stream stm = request.GetRequestStream())
            {
                using (StreamWriter stmw = new StreamWriter(stm))
                {
                    stmw.Write(createJSONforUB);
                }
            }
            try
            {
                HttpWebResponse GETResponse = (HttpWebResponse)request.GetResponse();
                Stream GETResponseStream = GETResponse.GetResponseStream();
                StreamReader sr = new StreamReader(GETResponseStream);
                string xmlResponse = sr.ReadToEnd();
                UBResponse ubResponse = new UBResponse();
                ubResponse = JsonConvert.DeserializeObject<UBResponse>(xmlResponse);
                if (ubResponse.status == "OK")
                {

                    //==========UB Response Log==============//
                    try
                    {
                        LogExceptionsInErrorLog("UB - Response", xmlResponse);
                    }
                    catch (Exception ex)
                    {
                        
                    }
                    //==========End UB Response Log==============//

                    int maxRetry = 10;
                    int retryCount = 0;
                    xmltaskResponse = UBGetLabelAPICall(api_key, ubconfig.TaskAPIURL + ubResponse.content.task_id).Result;
                    UBTaskAPIResponse ubTaskResponse = JsonConvert.DeserializeObject<UBTaskAPIResponse>(xmltaskResponse);
                    if(ubTaskResponse.content.progress.error)
                    {
                        LogExceptionsInErrorLog(xmltaskResponse, createJSONforUB);
                        xmltaskResponse = "{\"status\":\"ERROR\",\"messages\":[{\"type\":\"ERROR\",\"text\":\"UB Label Generation failed\",\"key\":\"UB Label Generation failed\"}]}";
                    }
                }
                else
                {
                    xmltaskResponse = xmlResponse;
                    LogExceptionsInErrorLog(xmltaskResponse, createJSONforUB);
                }
            }
            catch (WebException wex)
            {
                if (wex.Response != null)
                {
                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        //throw new Exception (errorResponse.StatusCode.ToString ());

                        xmltaskResponse = "{\"status\":\"ERROR\",\"errorMessage\":\"Something went wrong. Please try again later.\"}";

                        string errorMessage = string.Empty;
                        using (Stream data = errorResponse.GetResponseStream())
                        {
                            errorMessage = new StreamReader(data).ReadToEnd();
                        }

                        LogExceptionsInErrorLog(errorResponse.StatusCode + ": " + errorMessage, createJSONforUB);
                    }
                }
            }
            return xmltaskResponse;
        }

        private void LogExceptionsInErrorLog(string errorMessage, string requestJson)
        {
            using (SqlConnection con = new SqlConnection(_connStrActive))
            {
                using (SqlCommand sqlcommand = new SqlCommand("SaveErrorLog", con))
                {
                    sqlcommand.CommandType = CommandType.StoredProcedure;
                    sqlcommand.Parameters.Add("@ErrorMsg", SqlDbType.NVarChar, -1).Value = errorMessage;
                    sqlcommand.Parameters.Add("@Request", SqlDbType.NVarChar, -1).Value = requestJson;
                    sqlcommand.Parameters.Add("@Sql", SqlDbType.NVarChar, 100).Value = "CarrierController";
                    if (con.State == ConnectionState.Closed)
                        con.Open();
                    sqlcommand.ExecuteNonQuery();
                    if (con.State == ConnectionState.Open)
                        con.Close();
                }
            }

        }

        public async Task<string> UBGetLabelAPICall(string api_key, string task_id_url)
        {
            string xmltaskResponse = string.Empty;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        RetryPoint:
            HttpClient _apiClient = new HttpClient();
            HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Get, task_id_url);
            requestMessage.Headers.Add("api_key", api_key);
            string _ContentType = "application/json";
            requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(_ContentType));
            var retry = new RetryWithExponentialBackoff();
            await retry.RunAsync(async () =>
            {
                HttpResponseMessage response = await _apiClient.SendAsync(requestMessage);
                xmltaskResponse = await response.Content.ReadAsStringAsync();
            });

            if (JsonConvert.DeserializeObject<UBTaskAPIResponse>(xmltaskResponse).content.progress.running)
            {
                Task.Delay(2000).Wait();
                goto RetryPoint;
            }

            Console.WriteLine(xmltaskResponse);
            return xmltaskResponse;
        }

        private string GenerateUBLabelJSON(ReturnModel retModel)
        {
            string reqJSON = "";
            try
            {
                if (string.IsNullOrEmpty(retModel.customer.address.street2))
                    retModel.customer.address.street2 = string.Empty;
                if (string.IsNullOrEmpty(retModel.return_DC.address.street2))
                    retModel.return_DC.address.street2 = string.Empty;

                UBModel ubmodel = new UBModel();

                UBAddress address_from = new UBAddress();
                address_from.street1 = retModel.customer.address.street1.Trim();
                address_from.street2 = retModel.customer.address.street2.Trim() + (!string.IsNullOrEmpty(retModel.customer.address.street3.Trim()) ? ", " + retModel.customer.address.street3.Trim() : string.Empty);
                address_from.street_no = "";
                address_from.city = retModel.customer.address.city.Trim();
                address_from.state = retModel.customer.address.state_name != null ? retModel.customer.address.state_name.Trim() : string.Empty;
                address_from.postal_code = retModel.customer.address.postal_code.Trim();
                address_from.country = retModel.customer.address.country_code.Trim();
                address_from.name = retModel.customer.firstname + " " + retModel.customer.lastname;
                address_from.email = retModel.customer.email;
                address_from.company = retModel.brand + "-" + retModel.return_DC.address.city.Trim() + "-" + retModel.return_DC.code; //TODO

                UBAddress address_to = new UBAddress();
                address_to.street1 = retModel.return_DC.address.street1.Trim();
                address_to.street2 = retModel.return_DC.address.street2.Trim() + (!string.IsNullOrEmpty(retModel.return_DC.address.street3) ? ", " + retModel.return_DC.address.street3.Trim() : string.Empty);
                address_to.street_no = "";
                address_to.city = retModel.return_DC.address.city.Trim();
                address_to.state = retModel.return_DC.address.state_name != null ? retModel.return_DC.address.state_name.Trim() : string.Empty;
                address_to.postal_code = retModel.return_DC.address.postal_code.Trim();
                address_to.country = retModel.return_DC.address.country_code.Trim();
                address_to.name = retModel.return_DC.name;
                address_to.email = retModel.return_DC.email;
                address_to.company = retModel.return_DC.company;

                List<Package> packages = new List<Package>();
                if (retModel.shipment != null)
                {
                    foreach (Parcel item in retModel.shipment.parcels)
                    {
                        Package pckg = new Package();
                        int dimension = 1;

                        if (retModel.returnfreight.ServiceLevel.Trim() == "posti_national_retourpaket"
                        || retModel.returnfreight.ServiceLevel.Trim() == "fermopoint_national"
                        || retModel.returnfreight.ServiceLevel.Trim() == "correos_national_return"
                        || retModel.returnfreight.ServiceLevel.Trim() == "bpost_national")
                            dimension = 50;

                        pckg.height = item.dimensions == null ? dimension : item.dimensions.height == 0 ? dimension : item.dimensions.height;
                        pckg.length = item.dimensions == null ? dimension : item.dimensions.depth == 0 ? dimension : item.dimensions.depth;
                        pckg.weight = retModel.returnfreight.avg_weight != null || retModel.returnfreight.avg_weight != 0 ? retModel.returnfreight.avg_weight : 1; //item.dimensions == null ? 1 : item.dimensions.weight == 0 ? 1 : item.dimensions.weight;
                        pckg.width = item.dimensions == null ? dimension : item.dimensions.width == 0 ? dimension : item.dimensions.width;
                        pckg.distance_unit = "cm";
                        pckg.mass_unit = item.dimensions == null ? "kg" : item.dimensions.unit;
                        packages.Add(pckg);
                    }
                }
                else
                {
                    Package pckg = new Package();
                    pckg.height = 1;
                    pckg.length = 1;
                    pckg.weight = 1;
                    pckg.width = 1;
                    pckg.distance_unit = "cm";
                    pckg.mass_unit = "kg";
                    packages.Add(pckg);
                }

                Shipments sh = new Shipments();
                sh.order_date =  DateTime.UtcNow.ToString("yyyy-MM-dd");
                sh.first_mile = retModel.returnfreight.ServiceLevel.Trim();

                if(retModel.returnfreight.ServiceLevel.Trim().ToLower() == "yodel_national_collectplus")
                {
                    sh.marketplace_order_id = retModel.brand + "-" + retModel.return_DC.address.city.Trim() + "-" + retModel.return_DC.code  + "-" + retModel.order_number_reference;
                }
                else
                {
                    sh.marketplace_order_id =  retModel.order_number_reference;
                }
                sh.needs_customs_declaration = false;
                sh.address_from = address_from;
                sh.address_to = address_to;
                sh.packages = packages;

                ubmodel.shipment = sh;
                reqJSON = JsonConvert.SerializeObject(ubmodel);
            }
            catch (Exception ex)
            {
                reqJSON = ex.Message;
                LogExceptionsInErrorLog(reqJSON, JsonConvert.SerializeObject(retModel));
            }

            return reqJSON;
        }
        #endregion

        #region "UPS Integration"
        private string CallUPSService(UPSConfigurationModel upsconfig, ReturnModel value)
        {
            System.Uri apiurl = new System.Uri(upsconfig.APIURL);
            string createXMLforUPS = GetUPSShipmentXML(upsconfig, value);
            string json = "";
            try
            {
                string xmltaskResponse = CallAPIService(createXMLforUPS, apiurl);

                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xmltaskResponse);
                json = JsonConvert.SerializeXmlNode(doc);
            }
            catch (WebException wex)
            {
                if (wex.Response != null)
                {
                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        throw new Exception(errorResponse.StatusCode.ToString());
                    }
                }
            }
            return json;
        }
        private string CallAPIService(string upsxml, Uri url)
        {
            string xmlResponse = "";
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpWebRequest webrequest = (HttpWebRequest)WebRequest.Create(url);

                webrequest.Method = "POST";
                webrequest.ContentType = "text/xml;charset=UTF-8";
                webrequest.ServicePoint.Expect100Continue = false;

                using (Stream stm = webrequest.GetRequestStream())
                {
                    using (StreamWriter stmw = new StreamWriter(stm))
                    {
                        stmw.Write(upsxml);
                    }
                }
                // declare & read response from service

                //------------------------
                HttpWebResponse response = (HttpWebResponse)webrequest.GetResponse();
                Stream stream = response.GetResponseStream();
                StreamReader streamReader = new StreamReader(stream);
                xmlResponse = streamReader.ReadToEnd();

                response.Close();
                stream.Dispose();
                streamReader.Dispose();
            }
            catch (WebException wex)
            {
                if (wex.Response != null)
                {
                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        throw new Exception(errorResponse.StatusCode.ToString());
                    }
                }
            }
            return xmlResponse;
        }
        private string GetUPSShipmentXML(UPSConfigurationModel upsconfig, ReturnModel objModel)
        {
            string UPS_UserID = upsconfig.UserID;
            string UPS_ShipperNumber = upsconfig.ShipperNumber;
            string UPS_Password = upsconfig.Password;
            string UPS_AccessKey = upsconfig.Accesskey;
            StringBuilder objStringBuilder = new StringBuilder();
            try
            {
                objStringBuilder.Append(@"<?xml version='1.0' encoding='UTF-8'?><Envelope xmlns='http://schemas.xmlsoap.org/soap/envelope/'>");
                objStringBuilder.Append("<Header><UPSSecurity xmlns='http://www.ups.com/XMLSchema/XOLTWS/UPSS/v1.0'>");
                objStringBuilder.Append("<UsernameToken><Username>" + UPS_UserID + "</Username>");
                objStringBuilder.Append("<Password>" + UPS_Password + "</Password> </UsernameToken>");
                objStringBuilder.Append("<ServiceAccessToken><AccessLicenseNumber>" + UPS_AccessKey + "</AccessLicenseNumber> </ServiceAccessToken> </UPSSecurity> </Header>");
                objStringBuilder.Append("<Body><ShipmentRequest xmlns='http://www.ups.com/XMLSchema/XOLTWS/Ship/v1.0'> <Request xmlns='http://www.ups.com/XMLSchema/XOLTWS/Common/v1.0'> ");
                objStringBuilder.Append("<RequestOption>validate</RequestOption> </Request>");
                objStringBuilder.Append("<TransactionReference><CustomerContext>SITE " + "</CustomerContext> </TransactionReference>");
                objStringBuilder.Append("<Shipment>");
                if (objModel.customer.address.country_code != objModel.return_DC.address.country_code)
                {
                    objStringBuilder.Append("<Description>From Amer Sport</Description>");
                }
                //Shipper Facility
                objStringBuilder.Append("<Shipper>");
                objStringBuilder.Append("<Name>" + (!string.IsNullOrEmpty(objModel.customer.title)?objModel.customer.title:string.Empty )+ 
                                                   (!string.IsNullOrEmpty(objModel.customer.firstname)? objModel.customer.firstname:string.Empty )+
                                                    (!string.IsNullOrEmpty(objModel.customer.lastname)? objModel.customer.lastname:string.Empty) +"</Name>"); //Facility Code
                objStringBuilder.Append("<AttentionName>" + objModel.brand + "-" + objModel.return_DC.address.city.Trim() + "-" + objModel.return_DC.code + "</AttentionName>"); //Facility Name
                objStringBuilder.Append("<Phone>");
                objStringBuilder.Append("<Number>" + objModel.customer.phone + "</Number></Phone>");
                objStringBuilder.Append("<ShipperNumber>" + UPS_ShipperNumber + "</ShipperNumber>");
                objStringBuilder.Append("<Address>");
                objStringBuilder.Append("<AddressLine>" + objModel.customer.address.street1 + "</AddressLine>");
                if (!string.IsNullOrEmpty(objModel.customer.address.street2))
                    objStringBuilder.Append("<AddressLine>" + objModel.customer.address.street2 + "</AddressLine>");
                if (!string.IsNullOrEmpty(objModel.customer.address.street3))
                    objStringBuilder.Append("<AddressLine>" + objModel.customer.address.street3 + "</AddressLine>");
                objStringBuilder.Append("<City>" + objModel.customer.address.city + "</City>");
                objStringBuilder.Append("<StateProvinceCode>" + (!string.IsNullOrEmpty(objModel.customer.address.state_name)?objModel.customer.address.state_name:string.Empty) + "</StateProvinceCode>");
                objStringBuilder.Append("<PostalCode>" + objModel.customer.address.postal_code.Trim() + "</PostalCode>");
                objStringBuilder.Append("<CountryCode>" + objModel.customer.address.country_code.Trim() + "</CountryCode>");
                objStringBuilder.Append("</Address>");
                objStringBuilder.Append("</Shipper>");

                //ShipTo Site
                objStringBuilder.Append("<ShipTo>");
                objStringBuilder.Append("<Name>" + objModel.return_DC.company + "</Name>"); //Facility Code
                objStringBuilder.Append("<AttentionName>" + objModel.return_DC.name + "</AttentionName>"); //Facility Name
                objStringBuilder.Append("<Phone>");
                objStringBuilder.Append("<Number>" + objModel.return_DC.phone + "</Number></Phone>");
                objStringBuilder.Append("<Address>");
                objStringBuilder.Append("<AddressLine>" + objModel.return_DC.address.street1 + "</AddressLine>");
                if (!string.IsNullOrEmpty(objModel.return_DC.address.street2))
                    objStringBuilder.Append("<AddressLine>" + objModel.return_DC.address.street2 + "</AddressLine>");
                if (!string.IsNullOrEmpty(objModel.return_DC.address.street3))
                    objStringBuilder.Append("<AddressLine>" + objModel.return_DC.address.street3 + "</AddressLine>");
                objStringBuilder.Append("<City>" + objModel.return_DC.address.city + "</City>");
                objStringBuilder.Append("<StateProvinceCode>" + (!string.IsNullOrEmpty(objModel.return_DC.address.state_name)? objModel.return_DC.address.state_name:string.Empty)+ "</StateProvinceCode>");
                objStringBuilder.Append("<PostalCode>" + objModel.return_DC.address.postal_code.Trim() + "</PostalCode>");
                objStringBuilder.Append("<CountryCode>" + objModel.return_DC.address.country_code.Trim() + "</CountryCode>");
                objStringBuilder.Append("</Address>");
                objStringBuilder.Append("</ShipTo>");

                objStringBuilder.Append("<ShipFrom>");
                objStringBuilder.Append("<Name>" + objModel.customer.company + "</Name>"); //Facility Code
                objStringBuilder.Append("<AttentionName>" + objModel.customer.name + "</AttentionName>"); //Facility Name
                objStringBuilder.Append("<Phone>");
                objStringBuilder.Append("<Number>" + objModel.customer.phone + "</Number></Phone>");

                objStringBuilder.Append("<Address>");
                objStringBuilder.Append("<AddressLine>" + objModel.customer.address.street1 + "</AddressLine>");
                if (!string.IsNullOrEmpty(objModel.customer.address.street2))
                    objStringBuilder.Append("<AddressLine>" + objModel.customer.address.street2 + "</AddressLine>");
                if (!string.IsNullOrEmpty(objModel.customer.address.street3))
                    objStringBuilder.Append("<AddressLine>" + objModel.customer.address.street3 + "</AddressLine>");

                objStringBuilder.Append("<City>" + objModel.customer.address.city + "</City>");
                objStringBuilder.Append("<StateProvinceCode>" + (!string.IsNullOrEmpty(objModel.customer.address.state_name)?objModel.customer.address.state_name:string.Empty) + "</StateProvinceCode>");
                objStringBuilder.Append("<PostalCode>" + objModel.customer.address.postal_code.Trim() + "</PostalCode>");
                objStringBuilder.Append("<CountryCode>" + objModel.customer.address.country_code.Trim() + "</CountryCode>");
                objStringBuilder.Append("</Address>");
                objStringBuilder.Append("</ShipFrom>");
                objStringBuilder.Append("<PaymentInformation>");
                objStringBuilder.Append("<ShipmentCharge>");
                objStringBuilder.Append("<Type>01</Type> "); //01 = Transportation 02 = Duties and Taxes 

                //Payor
                //Must be the same UPS account number as the one provided in Shipper/ShipperNumber.  
                objStringBuilder.Append("<BillShipper>");
                objStringBuilder.Append("<AccountNumber>" + UPS_ShipperNumber + "</AccountNumber>");
                objStringBuilder.Append("</BillShipper>");
                objStringBuilder.Append("</ShipmentCharge></PaymentInformation>");
                objStringBuilder.Append("<Service> ");
                objStringBuilder.Append("<Code>" + objModel.returnfreight.ServiceLevel + "</Code>");
                //<Description>
                objStringBuilder.Append("</Service>");

                //foreach (PackageDetailViewModel pkg in objModel.Package)
                for (int i = 0; i < objModel.shipment.parcels.Count; i++)
                {
                    Parcel pkg = objModel.shipment.parcels[i];
                    objStringBuilder.Append("<Package>");
                    objStringBuilder.Append("<Description>" + pkg.description + "</Description>");
                    objStringBuilder.Append("<Packaging>");
                    objStringBuilder.Append("<Code>02</Code>");
                    objStringBuilder.Append("<Description>Package</Description>");
                    //02 = Customer Supplied Package  
                    objStringBuilder.Append("</Packaging>");
                    objStringBuilder.Append("<PackageWeight>");
                    objStringBuilder.Append("<UnitOfMeasurement>");
                    objStringBuilder.Append("<Code>LBS</Code>");
                    objStringBuilder.Append("<Description>Pounds</Description>");
                    objStringBuilder.Append("</UnitOfMeasurement>");
                    //objStringBuilder.Append("<Weight>" + pkg.dimensions.weight + "</Weight>");
                    objStringBuilder.Append("<Weight>" + objModel.returnfreight.avg_weight + "</Weight>");
                    objStringBuilder.Append("</PackageWeight>");
                    objStringBuilder.Append("</Package>");
                }

                objStringBuilder.Append("</Shipment>");
                objStringBuilder.Append("<LabelSpecification> ");
                objStringBuilder.Append("<LabelImageFormat>");
                objStringBuilder.Append("<Code>GIF</Code>");
                objStringBuilder.Append("</LabelImageFormat>");
                objStringBuilder.Append("<LabelStockSize>");
                objStringBuilder.Append("<Height>6</Height>");
                objStringBuilder.Append("<Width>4</Width>");
                objStringBuilder.Append("</LabelStockSize>");
                objStringBuilder.Append("</LabelSpecification>");
                objStringBuilder.Append("</ShipmentRequest>");
                objStringBuilder.Append("</Body>");
                objStringBuilder.Append("</Envelope>");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return objStringBuilder.ToString();
        }
        #endregion


        [HttpPost("GenerateCustomDecalartionLabel")]
        public string GenerateCustomDecalartionLabel([FromBody] ReturnModel retModel)
        {
            try
            {

                string custCountryCode = retModel.customer.address.country_code;
                string brandcode = retModel.brand;
                DataSet ds = new DataSet();
                using (SqlConnection con = new SqlConnection(_connStrActive))
                {
                    using (SqlCommand sqlcommand = new SqlCommand("GetCarrierConfigurationByCountryCode", con))
                    {
                        sqlcommand.CommandType = CommandType.StoredProcedure;
                        sqlcommand.Parameters.Add("@countryCode", SqlDbType.NVarChar, 50).Value = custCountryCode;
                        sqlcommand.Parameters.Add("@brandCode", SqlDbType.NVarChar, 50).Value = brandcode;
                        using (SqlDataAdapter adp = new SqlDataAdapter(sqlcommand))
                        {
                            if (con.State == ConnectionState.Closed)
                            {
                                con.Open();
                                adp.Fill(ds);
                                con.Close();
                            }
                        }
                    }
                }
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = ds.Tables[0];
                    var countrylist = (from DataRow dr in dt.Rows
                                       select new
                                       {
                                           CountryID = Convert.ToInt32(dr["CountryID"]),
                                           CountryCode = dr["CountryCode"].ToString(),
                                           CountryName = dr["CountryName"].ToString()
                                       }).ToList();
                    var counterr = countrylist.Where(s => s.CountryCode == custCountryCode).Count();
                    if (counterr > 0)
                    {
                        retModel.customRequiredCountry = true;
                    }
                }
                if (retModel.customRequiredCountry == true)
                {
                    BlobHelper bh = new BlobHelper();
                    // read parameters from the webpage
                    bh.PrintedDate = DateTime.UtcNow.ToLongDateString();
                    bh.DropOffLocation = "";
                    bh.CustmerDetail = retModel.customer.name + ", " + retModel.customer.email + ", " + retModel.customer.phone;
                    bh.CustomerAddress = retModel.customer.address.complete_address;
                    bh.DropOffDate = "";
                    bh.EstimatedPickup = "";
                    bh.TotalPackage = retModel.shipment.parcels.Count().ToString();
                    bh.TrackingNumber = "";
                    bh.Carrier = "AUPOST";
                    bh.Weight = "1 lbs"; // retModel.shipment.parcels.Select(y => y.dimensions).Sum(x => x.weight).ToString();
                    string htmlString = bh.GenerateCustomDecalartionHTML(retModel, environment.ContentRootPath); //Path.Combine(environment.ContentRootPath, "Reports", "dropofflabel.html");//"./Reports/dropofflabel.html";
                    string baseUrl = "";

                    string pdf_page_size = "A4";
                    // PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize),
                    //     pdf_page_size, true);

                    // string pdf_orientation = "Portrait";
                    // PdfPageOrientation pdfOrientation =
                    //     (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation),
                    //         pdf_orientation, true);

                    // int webPageWidth = 1024;
                    // int webPageHeight = 150;

                    // // instantiate a html to pdf converter object
                    // HtmlToPdf converter = new HtmlToPdf();

                    // // set converter options
                    // converter.Options.PdfPageSize = pageSize;
                    // converter.Options.PdfPageOrientation = pdfOrientation;
                    // converter.Options.WebPageWidth = webPageWidth;
                    // converter.Options.WebPageHeight = webPageHeight;
                    // converter.Options.MarginLeft = 10;
                    // converter.Options.MarginRight = 10;
                    // converter.Options.MarginTop = 20;
                    // converter.Options.MarginBottom = 20;

                    // // create a new pdf document converting an url
                    // PdfDocument doc = converter.ConvertHtmlString(htmlString, baseUrl);
                    // //PdfDocument doc = converter.ConvertUrl(htmlString);

                    // save pdf document
                    string fileName = bh.GenerateFileName("testfile");
                    // doc.Save("Reports/" + fileName);
                    // doc.Close();

                    string filepath = Path.Combine(environment.ContentRootPath, "Reports", fileName);
                    byte[] bytes = System.IO.File.ReadAllBytes(filepath);
                    string mimeType = bh.GetMimeType(filepath);
                    Task<string> uploadedfileUrl = bh.UploadBlob(fileName, bytes, mimeType);
                    string uripath = uploadedfileUrl.Result;
                    if (System.IO.File.Exists(Path.Combine(environment.ContentRootPath, "Reports", fileName)))
                    {
                        // If file found, delete it    
                        System.IO.File.Delete(Path.Combine(environment.ContentRootPath, "Reports", fileName));
                        Console.WriteLine("File deleted.");
                    }
                    
                    object rmadata = SaveOrderLabel_Data(retModel.return_order_number, uripath, "", retModel.language,retModel);
                    return "{\"status\":\"success\",\"rm_data\":"+rmadata.ToString()+"}"; 
                }
                else
                    return "{\"status\":\"rmanull\",\"rm_data\":\"null\"}"; 
            }
            catch (Exception ex)
            {
                return "{\"status\":\"" + ex.Message + "\"}";
            }
        }

        private object SaveOrderLabel_Data(string Order_Number, string URL, string shippingInstructions, string data
        ,ReturnModel retModel)
        {
            using (SqlConnection con = new SqlConnection(_connStrActive))
            {
                using (SqlCommand sqlcommand = new SqlCommand("Usp_SaveOrderLabelData_Stage", con))
                {
                    

                    sqlcommand.CommandType = CommandType.StoredProcedure;
                    sqlcommand.Parameters.Add("@URL", SqlDbType.NVarChar).Value = URL;
                    sqlcommand.Parameters.Add("@retModel", SqlDbType.NVarChar).Value = JsonConvert.SerializeObject(retModel) ;
                    sqlcommand.Parameters.Add("@return_order_number", SqlDbType.NVarChar).Value = Order_Number;
                    sqlcommand.Parameters.Add("@ShippingInstructions", SqlDbType.NVarChar).Value = shippingInstructions;
                    sqlcommand.Parameters.Add("@LANGUAGECODE", SqlDbType.NVarChar).Value = data;
                   
                    SqlParameter rm_dataParam = new SqlParameter("@rm_data", SqlDbType.NVarChar,4000)
                        { 
                            Direction = ParameterDirection.Output 
                        };
                    sqlcommand.Parameters.Add(rm_dataParam);
                    if (con.State == ConnectionState.Closed)
                        con.Open();
                    sqlcommand.ExecuteNonQuery();
                    if (con.State == ConnectionState.Open)
                        con.Close();

                     return rm_dataParam.Value;
                }
            }

        }

        [HttpPost("ReadcsvFromFTP")]
        public string ReadcsvFromFTP([FromBody] ReturnModel retModel)
        {
            try
            {
                string ftpURL = "ftp://ftp2.electrolux-na.com/";
                string UserName = "INT-ReverseLogix";
                string Password = "hetrNIvH1Bza";
                string filename = "INC_EXTRACT_ PROD_" + DateTime.Now.AddDays(-1).ToString("yyyyMMdd") + ".txt";
                string ftpDirectory = "/INT/ReverseLogix/PRODUCTION/INC_EXTRACT_ PROD_" + DateTime.Now.AddDays(-1).ToString("yyyyMMdd") + ".txt";
                WebClient request = new WebClient();
                string url = ftpURL + ftpDirectory;
                request.Credentials = new NetworkCredential(UserName, Password);
                string fileUrl = string.Empty;
                try
                {
                    byte[] newFileData = request.DownloadData(url);
                    Stream stream = new MemoryStream(newFileData);
                }
                catch (WebException ex)
                {
                }

                return "";
            }
            catch (Exception ex)
            {
                return "{\"status\":\"" + ex.Message + "\"}";
            }
        }
    }
}