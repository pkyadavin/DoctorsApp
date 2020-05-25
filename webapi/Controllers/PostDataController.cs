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
using Newtonsoft.Json;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostDataController : ControllerBase
    {
        private readonly IConfiguration Config;
        
        private string _connStrDev = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrDevNAM = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test_NAM;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrUAT = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_UAT;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrPROD = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_Live;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrActive = string.Empty;

        public PostDataController()
        {
            //_connStrActive = _connStrDev;         
            //_connStrActive = _connStrDevNAM;         
            _connStrActive = _connStrUAT;        
            //_connStrActive = _connStrPROD;
        }
        [HttpPost]
        public bool Post([FromBody] ReturnModel value)
        {
            using (SqlConnection con = new SqlConnection(_connStrActive))
            {
                using (SqlCommand sqlcommand = new SqlCommand("usp_SaveOutboundLogData", con))
                {
                    sqlcommand.CommandType = CommandType.StoredProcedure;
                    sqlcommand.Parameters.Add("@email", SqlDbType.NVarChar, 100).Value = value.customer != null ? value.customer.email: string.Empty;
                    sqlcommand.Parameters.Add("@order_number", SqlDbType.NVarChar, 100).Value = value.order_number_reference;
                    sqlcommand.Parameters.Add("@return_number", SqlDbType.NVarChar, 100).Value = value.return_order_number;
                    sqlcommand.Parameters.Add("@payload", SqlDbType.NVarChar, -1).Value = JsonConvert.SerializeObject(value);
                    sqlcommand.Parameters.Add("@source", SqlDbType.NVarChar, 50).Value = value.source != null ? value.source : "N/A";
                    sqlcommand.Parameters.Add("@event", SqlDbType.NVarChar, 50).Value = string.Empty; //TODO
                    sqlcommand.Parameters.Add("@status", SqlDbType.NVarChar, 50).Value = value.status.status;

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
    }
}
