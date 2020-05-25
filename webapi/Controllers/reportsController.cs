using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class reportsController : ControllerBase
    {
        private readonly IHostingEnvironment environment = null;
        public reportsController(IHostingEnvironment environment)
        {
            this.environment = environment;
        }
        // GET api/reports
        [HttpGet]
        public bool Get()
        {  
            return true;
        }
        
        // GET api/reports/5
        [HttpGet("{id}")]
        public bool Get(int id)
        {            
            return true;
        }
              
        // POST api/reports
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/reports/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/reports/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
