using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly IConfiguration Config;
        private string _connStrDev = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrDevNAM = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test_NAM;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrUAT = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_UAT;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrPROD = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_Live;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrActive = string.Empty;
        

        public SchedulesController()
        {
            //_connStrActive = _connStrDev;         
            //_connStrActive = _connStrDevNAM;         
            _connStrActive = _connStrUAT;       
            //_connStrActive = _connStrPROD;
        }

        // GET api/values/email
        [Route("email/{brand}")]
        [HttpGet]
        public bool Get(string brand)
        {
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(_connStrActive))
            {
                using (SqlCommand sqlcommand = new SqlCommand("usp_EmailLog_All", con))
                {
                    sqlcommand.CommandType = CommandType.StoredProcedure;
                    sqlcommand.Parameters.Add("@brand", SqlDbType.NVarChar, 50).Value = brand;//string.Join(",", brand);                                  
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
            if (ds.Tables[0].Rows.Count > 0)
            {
                try
                {
                    List<int> successIds = this.dispatchEmails(ds);
                    return this.CompleteELog(successIds);
                }
                catch
                {
                    throw;
                }
            }
            return true;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }
        private bool CompleteELog(List<int> Ids)
        {
            using (SqlConnection con = new SqlConnection(_connStrActive))
            {
                using (SqlCommand sqlcommand = new SqlCommand("usp_EmailLog_PUT", con))
                {
                    sqlcommand.CommandType = CommandType.StoredProcedure;
                    sqlcommand.Parameters.Add("@Ids", SqlDbType.NVarChar, 50).Value = string.Join(",", Ids);
                    if (con.State == ConnectionState.Closed)
                    {
                        con.Open();
                        sqlcommand.ExecuteNonQuery();
                        con.Close();
                    }
                }
            }
            return true;
        }
        private List<int> dispatchEmails(DataSet ds)
        {
            List<int> Ids = new List<int>();

            SmtpClient smtp = new SmtpClient();
            smtp.Host = ds.Tables[1].Rows[0]["Host"].ToString();
            smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new System.Net.NetworkCredential(ds.Tables[1].Rows[0]["Email"].ToString(), ds.Tables[1].Rows[0]["Password"].ToString());
            smtp.Port = int.Parse(ds.Tables[1].Rows[0]["Port"].ToString());
            smtp.EnableSsl = bool.Parse(ds.Tables[1].Rows[0]["SSL"].ToString());
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                var message = new MailMessage();
                message.To.Add(new MailAddress(dr["TO_Address"].ToString()));
                if (!string.IsNullOrEmpty(Convert.ToString(dr["CC_Address"])))
                    message.Bcc.Add(new MailAddress(dr["CC_Address"].ToString()));
                if (!string.IsNullOrEmpty(Convert.ToString(dr["BCC_Address"])))
                    message.Bcc.Add(new MailAddress(dr["BCC_Address"].ToString()));
                message.Subject = dr["Subject"].ToString();

                StringBuilder strMailContent = new StringBuilder();
                strMailContent.Append("<html><head><STYLE>");
                strMailContent.Append("body{");
                strMailContent.Append("BACKGROUND-COLOR: #FFFFFF;");
                strMailContent.Append("FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif;");
                strMailContent.Append("BACKGROUND-POSITION: center 80%;");
                strMailContent.Append("FONT-SIZE: 12px}");
                strMailContent.Append("</STYLE></head><body>");
                strMailContent.Append(dr["Body"].ToString());
                strMailContent.Append("</body></html>");

                message.Body = strMailContent.ToString();
                message.IsBodyHtml = true;
                message.From = new MailAddress(ds.Tables[1].Rows[0]["Email"].ToString(), "Support Team");
                try
                {
                    smtp.Send(message);
                    Ids.Add(int.Parse(dr["ID"].ToString()));
                }
                catch
                {
                    throw;
                }
            }
            return Ids;
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
