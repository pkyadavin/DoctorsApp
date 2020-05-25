using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Configuration;
//using Newtonsoft.Json;
//using OfficeOpenXml;
//using OfficeOpenXml.Style;
using System.IO;
using Newtonsoft.Json;
//using CsvHelper;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : ControllerBase
    {
        private string _connStrDev = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrDevNAM = "Data Source=amersportstest.database.windows.net;Initial Catalog=AmerSports_Test_NAM;User ID=amer;Password=$RL^Am$@2019";
        private string _connStrUAT = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_UAT;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrProd = "Data Source=amersportsprod.database.windows.net;Initial Catalog=AmerSports_Live;User ID=amer;Password=$rL^Am$@Cx2o19!";
        private string _connStrActive = string.Empty;

        public DownloadController()
        {
            //_connStrActive = _connStrDev;         
            //_connStrActive = _connStrDevNAM;         
            _connStrActive = _connStrUAT;       
            //_connStrActive = _connStrProd;
        }

        // GET api/values/email
        [HttpGet]
        public bool Get()
        {
            return true;
        }

        // GET api/values/5
        [HttpGet("{code}/{doc}/{fromDate}/{toDate}/{return_dc}/{brand}/{status}")]
        public ActionResult Get(string code, string doc, string fromDate, string toDate, int return_dc, int brand, int status)
        {
            DataSet ds = new DataSet();
            FilterModel report_filter = new FilterModel() { brand = brand, fromDate = fromDate, toDate = toDate, return_dc = return_dc, status = status, start_row = 0, end_row = 1000000 };
            using (SqlConnection con = new SqlConnection(_connStrActive))
            {
                using (SqlCommand sqlcommand = new SqlCommand("usp_Analytics", con))
                {
                    sqlcommand.CommandType = CommandType.StoredProcedure;
                    sqlcommand.Parameters.Add("@report", SqlDbType.NVarChar, 200).Value = code;
                    sqlcommand.Parameters.Add("@report_filter", SqlDbType.NVarChar, 2000).Value = JsonConvert.SerializeObject(report_filter);
                    sqlcommand.Parameters.Add("@user_id", SqlDbType.Int).Value = 2;
                    sqlcommand.Parameters.Add("@language", SqlDbType.Int).Value = 1;
                    sqlcommand.Parameters.Add("@cd", SqlDbType.NVarChar, 2000).Direction = ParameterDirection.Output;
                    sqlcommand.Parameters.Add("@total_count", SqlDbType.Int).Direction = ParameterDirection.Output;

                    using (SqlDataAdapter adp = new SqlDataAdapter(sqlcommand))
                    {
                        if (con.State == ConnectionState.Closed)
                        {
                            con.Open();
                            adp.Fill(ds);
                            con.Close();
                        }
                    }
                    switch (code)
                    {
                        // case "tat":
                        //     return tat(code, doc, ds);
                        // case "rls":
                        //     return rls(code, doc, ds);
                        // case "ort":
                        //     return ort(code, doc, ds);
                        // case "scp":
                        //     return scp(code, doc, ds);
                        // case "r3":
                        //     return rr(code, doc, ds);
                        // case "rp":
                        //     return rp(code, doc, ds);
                        default:
                            return NotFound();
                    }
                }
            }
        }

        // #region xlsx
        // private ActionResult tat(string code, string doc, DataSet ds)
        // {
        //     byte[] fileContents;
        //     var allData = ds.Tables[0].Rows.Cast<DataRow>().ToList();
        //     List<tat> tatreport = (from tat in allData
        //                            select new tat
        //                            {
        //                                TAT = tat.ItemArray.ElementAtOrDefault(0).ToString(),
        //                                Return_Number = tat.ItemArray.ElementAtOrDefault(1).ToString(),
        //                                Order_Number = tat.ItemArray.ElementAtOrDefault(2).ToString(),
        //                                Created_Date = tat.ItemArray.ElementAtOrDefault(3).ToString(),
        //                                Return_DC = tat.ItemArray.ElementAtOrDefault(4).ToString(),
        //                                Brand = tat.ItemArray.ElementAtOrDefault(5).ToString(),
        //                                Return_Qty = tat.ItemArray.ElementAtOrDefault(6).ToString(),
        //                                Customer = tat.ItemArray.ElementAtOrDefault(7).ToString(),
        //                                Email = tat.ItemArray.ElementAtOrDefault(8).ToString(),
        //                            }
        //     ).ToList();

        //     if (doc == "c")
        //     {
        //         tatreport.Insert(0, new tat
        //         {
        //             TAT = "TAT",
        //             Return_Number = "RMA Number",
        //             Order_Number = "Order Number",
        //             Created_Date = "RMA Date",
        //             Return_DC = "Return DC",
        //             Brand = "Brand",
        //             Return_Qty = "Ret Qty",
        //             Customer = "Customer",
        //             Email = "Email",
        //         });
        //         var stream = new MemoryStream();
        //         var writeFile = new StreamWriter(stream);
        //         var csv = new CsvWriter(writeFile);
        //         csv.Configuration.HasHeaderRecord = false;
        //         csv.WriteRecords(tatreport);
        //         csv.Flush();
        //         writeFile.Flush();
        //         stream.Position = 0; //reset stream
        //         return File(stream, "application/octet-stream", "TAT.csv");
        //     }
        //     using (var package = new ExcelPackage())
        //     {
        //         var worksheet = package.Workbook.Worksheets.Add("TAT");
        //         worksheet.Cells["A5:I5"].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //         worksheet.Cells["A5:I5"].Style.Font.Bold = true;

        //         worksheet.Cells["A1:I1"].Merge = true;
        //         worksheet.Cells["A1"].Value = "Turn Around Time Report";
        //         worksheet.Cells["A1:I1"].Style.Font.Bold = true;
        //         worksheet.Cells["A1:I1"].Style.Font.Size = 25;
        //         worksheet.Cells["A1:I1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //         using (var range = worksheet.Cells[5, 1, 5, 9])
        //         {
        //             range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //             range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //         }
        //         worksheet.DefaultColWidth = 30;
        //         worksheet.Cells["A5"].LoadFromCollection(tatreport, true);

        //         fileContents = package.GetAsByteArray();
        //     }

        //     if (fileContents == null || fileContents.Length == 0)
        //     {
        //         return NotFound();
        //     }

        //     return File(
        //         fileContents: fileContents,
        //         contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         fileDownloadName: code + ".xlsx"
        //     );
        // }
        // private ActionResult rls(string code, string doc, DataSet ds)
        // {
        //     byte[] fileContents;
        //     var allData = ds.Tables[0].Rows.Cast<DataRow>().ToList();
        //     List<rls> rlsreport = (from tat in allData
        //                            select new rls
        //                            {
        //                                Return_Number = tat.ItemArray.ElementAtOrDefault(0).ToString(),
        //                                Order_Number = tat.ItemArray.ElementAtOrDefault(1).ToString(),
        //                                Created_Date = tat.ItemArray.ElementAtOrDefault(2).ToString(),
        //                                Return_DC = tat.ItemArray.ElementAtOrDefault(3).ToString(),
        //                                Brand = tat.ItemArray.ElementAtOrDefault(4).ToString(),
        //                                Return_Qty = tat.ItemArray.ElementAtOrDefault(5).ToString(),
        //                                Customer = tat.ItemArray.ElementAtOrDefault(6).ToString(),
        //                                Phone = tat.ItemArray.ElementAtOrDefault(8).ToString(),
        //                            }
        //     ).ToList();

        //     if (doc == "c")
        //     {
        //         rlsreport.Insert(0, new rls
        //         {
        //             Return_Number = "RMA Number",
        //             Order_Number = "Order Number",
        //             Created_Date = "RMA Date",
        //             Return_DC = "Return DC",
        //             Brand = "Brand",
        //             Return_Qty = "Ret Qty",
        //             Customer = "Customer",
        //             Phone = "Phone",
        //         });
        //         var stream = new MemoryStream();
        //         var writeFile = new StreamWriter(stream);
        //         var csv = new CsvWriter(writeFile);
        //         csv.Configuration.HasHeaderRecord = false;
        //         csv.WriteRecords(rlsreport);
        //         csv.Flush();
        //         writeFile.Flush();
        //         stream.Position = 0; //reset stream

        //         return File(stream, "application/octet-stream", "all_returns.csv");
        //     }
        //     using (var package = new ExcelPackage())
        //     {
        //         var worksheet = package.Workbook.Worksheets.Add("ALL RETURNS");
        //         worksheet.Cells["A5:H5"].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //         worksheet.Cells["A5:H5"].Style.Font.Bold = true;

        //         worksheet.Cells["A1:H1"].Merge = true;
        //         worksheet.Cells["A1"].Value = "All Returns Report";
        //         worksheet.Cells["A1:H1"].Style.Font.Bold = true;
        //         worksheet.Cells["A1:H1"].Style.Font.Size = 25;
        //         worksheet.Cells["A1:H1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //         using (var range = worksheet.Cells[5, 1, 5, 8])
        //         {
        //             range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //             range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //         }
        //         worksheet.DefaultColWidth = 30;
        //         worksheet.Cells["A5"].LoadFromCollection(rlsreport, true);

        //         fileContents = package.GetAsByteArray();
        //     }

        //     if (fileContents == null || fileContents.Length == 0)
        //     {
        //         return NotFound();
        //     }

        //     return File(
        //         fileContents: fileContents,
        //         contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         fileDownloadName: code + ".xlsx"
        //     );
        // }
        // private ActionResult ort(string code, string doc, DataSet ds)
        // {
        //     byte[] fileContents;
        //     var allData = ds.Tables[0].Rows.Cast<DataRow>().ToList();
        //     List<ort> ortreport = (from tat in allData
        //                            select new ort
        //                            {
        //                                Return_Number = tat.ItemArray.ElementAtOrDefault(0).ToString(),
        //                                Order_Number = tat.ItemArray.ElementAtOrDefault(1).ToString(),
        //                                Created_Date = tat.ItemArray.ElementAtOrDefault(2).ToString(),
        //                                Return_DC = tat.ItemArray.ElementAtOrDefault(3).ToString(),
        //                                Brand = tat.ItemArray.ElementAtOrDefault(4).ToString(),
        //                                Return_Qty = tat.ItemArray.ElementAtOrDefault(5).ToString(),
        //                                Customer = tat.ItemArray.ElementAtOrDefault(6).ToString(),
        //                                Phone = tat.ItemArray.ElementAtOrDefault(8).ToString(),
        //                            }
        //     ).ToList();

        //     if (doc == "c")
        //     {
        //         ortreport.Insert(0, new ort
        //         {
        //             Return_Number = "RMA Number",
        //             Order_Number = "Order Number",
        //             Created_Date = "RMA Date",
        //             Return_DC = "Return DC",
        //             Brand = "Brand",
        //             Return_Qty = "Ret Qty",
        //             Customer = "Customer",
        //             Phone = "Phone",
        //         });
        //         var stream = new MemoryStream();
        //         var writeFile = new StreamWriter(stream);
        //         var csv = new CsvWriter(writeFile);
        //         csv.Configuration.HasHeaderRecord = false;
        //         csv.WriteRecords(ortreport);
        //         csv.Flush();
        //         writeFile.Flush();
        //         stream.Position = 0; //reset stream
        //         return File(stream, "application/octet-stream", "open_returns.csv");
        //     }
        //     using (var package = new ExcelPackage())
        //     {
        //         var worksheet = package.Workbook.Worksheets.Add("OPEN RETURNS");
        //         worksheet.Cells["A5:H5"].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //         worksheet.Cells["A5:H5"].Style.Font.Bold = true;

        //         worksheet.Cells["A1:H1"].Merge = true;
        //         worksheet.Cells["A1"].Value = "Open Returns Report";
        //         worksheet.Cells["A1:H1"].Style.Font.Bold = true;
        //         worksheet.Cells["A1:H1"].Style.Font.Size = 25;
        //         worksheet.Cells["A1:H1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //         using (var range = worksheet.Cells[5, 1, 5, 8])
        //         {
        //             range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //             range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //         }
        //         worksheet.DefaultColWidth = 30;
        //         worksheet.Cells["A5"].LoadFromCollection(ortreport, true);

        //         fileContents = package.GetAsByteArray();
        //     }

        //     if (fileContents == null || fileContents.Length == 0)
        //     {
        //         return NotFound();
        //     }

        //     return File(
        //         fileContents: fileContents,
        //         contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         fileDownloadName: code + ".xlsx"
        //     );
        // }
        // private ActionResult scp(string code, string doc, DataSet ds)
        // {
        //     byte[] fileContents;
        //     var allData = ds.Tables[0].Rows.Cast<DataRow>().ToList();
        //     List<scp> scpreport = (from tat in allData
        //                            select new scp
        //                            {
        //                                Return_Number = tat.ItemArray.ElementAtOrDefault(0).ToString(),
        //                                Order_Number = tat.ItemArray.ElementAtOrDefault(1).ToString(),
        //                                Created_Date = tat.ItemArray.ElementAtOrDefault(2).ToString(),
        //                                Return_DC = tat.ItemArray.ElementAtOrDefault(3).ToString(),
        //                                Brand = tat.ItemArray.ElementAtOrDefault(4).ToString(),
        //                                Return_Qty = tat.ItemArray.ElementAtOrDefault(5).ToString(),
        //                                Customer = tat.ItemArray.ElementAtOrDefault(6).ToString(),
        //                                Phone = tat.ItemArray.ElementAtOrDefault(8).ToString(),
        //                            }
        //     ).ToList();

        //     if (doc == "c")
        //     {
        //         scpreport.Insert(0, new scp
        //         {
        //             Return_Number = "RMA Number",
        //             Order_Number = "Order Number",
        //             Created_Date = "RMA Date",
        //             Return_DC = "Return DC",
        //             Brand = "Brand",
        //             Return_Qty = "Ret Qty",
        //             Customer = "Customer",
        //             Phone = "Phone",
        //         });
        //         var stream = new MemoryStream();
        //         var writeFile = new StreamWriter(stream);
        //         var csv = new CsvWriter(writeFile);
        //         csv.Configuration.HasHeaderRecord = false;
        //         csv.WriteRecords(scpreport);
        //         csv.Flush();
        //         writeFile.Flush();
        //         stream.Position = 0; //reset stream
        //         return File(stream, "application/octet-stream", "damaged_returns.csv");
        //     }
        //     using (var package = new ExcelPackage())
        //     {
        //         var worksheet = package.Workbook.Worksheets.Add("DAMAGED RETURN");
        //         worksheet.Cells["A5:H5"].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //         worksheet.Cells["A5:H5"].Style.Font.Bold = true;

        //         worksheet.Cells["A1:H1"].Merge = true;
        //         worksheet.Cells["A1"].Value = "Damaged Returns Report";
        //         worksheet.Cells["A1:H1"].Style.Font.Bold = true;
        //         worksheet.Cells["A1:H1"].Style.Font.Size = 25;
        //         worksheet.Cells["A1:H1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //         using (var range = worksheet.Cells[5, 1, 5, 8])
        //         {
        //             range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //             range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //         }
        //         worksheet.DefaultColWidth = 30;
        //         worksheet.Cells["A5"].LoadFromCollection(scpreport, true);

        //         fileContents = package.GetAsByteArray();
        //     }

        //     if (fileContents == null || fileContents.Length == 0)
        //     {
        //         return NotFound();
        //     }

        //     return File(
        //         fileContents: fileContents,
        //         contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         fileDownloadName: code + ".xlsx"
        //     );
        // }
        // private ActionResult rr(string code, string doc, DataSet ds)
        // {
        //     byte[] fileContents;
        //     var allData = ds.Tables[0].Rows.Cast<DataRow>().ToList();
        //     List<rr> rrreport = (from tat in allData
        //                          select new rr
        //                          {
        //                              Return_Number = tat.ItemArray.ElementAtOrDefault(0).ToString(),
        //                              Order_Number = tat.ItemArray.ElementAtOrDefault(1).ToString(),
        //                              Created_Date = tat.ItemArray.ElementAtOrDefault(2).ToString(),
        //                              Return_DC = tat.ItemArray.ElementAtOrDefault(3).ToString(),
        //                              Brand = tat.ItemArray.ElementAtOrDefault(4).ToString(),
        //                              Return_Quantity = tat.ItemArray.ElementAtOrDefault(5).ToString(),
        //                              Ordered_Quantity = tat.ItemArray.ElementAtOrDefault(6).ToString(),
        //                              Return_Reason = tat.ItemArray.ElementAtOrDefault(7).ToString(),
        //                              Item = tat.ItemArray.ElementAtOrDefault(8).ToString(),
        //                              EAN = tat.ItemArray.ElementAtOrDefault(9).ToString(),
        //                              Status = tat.ItemArray.ElementAtOrDefault(10).ToString(),
        //                          }
        //     ).ToList();

        //     if (doc == "c")
        //     {
        //         rrreport.Insert(0, new rr
        //         {
        //             Return_Number = "RMA Number",
        //             Order_Number = "Order Number",
        //             Created_Date = "RMA Date",
        //             Return_DC = "Return DC",
        //             Brand = "Brand",
        //             Return_Quantity = "Ret Qty",
        //             Ordered_Quantity = "Ord Qty",
        //             Return_Reason = "Return Reason",
        //             Item = "Item",
        //             EAN = "EAN/SKU",
        //             Status = "Status"
        //         });
        //         var stream = new MemoryStream();
        //         var writeFile = new StreamWriter(stream);
        //         var csv = new CsvWriter(writeFile);
        //         csv.Configuration.HasHeaderRecord = false;
        //         csv.WriteRecords(rrreport);
        //         csv.Flush();
        //         writeFile.Flush();
        //         stream.Position = 0; //reset stream
        //         return File(stream, "application/octet-stream", "return_reason.csv");
        //     }
        //     using (var package = new ExcelPackage())
        //     {
        //         var worksheet = package.Workbook.Worksheets.Add("RETURN REASONS");
        //         worksheet.Cells["A5:K5"].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //         worksheet.Cells["A5:K5"].Style.Font.Bold = true;

        //         worksheet.Cells["A1:K1"].Merge = true;
        //         worksheet.Cells["A1"].Value = "Return Reasons Report";
        //         worksheet.Cells["A1:K1"].Style.Font.Bold = true;
        //         worksheet.Cells["A1:K1"].Style.Font.Size = 25;
        //         worksheet.Cells["A1:K1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //         using (var range = worksheet.Cells[5, 1, 5, 11])
        //         {
        //             range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //             range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //         }
        //         worksheet.DefaultColWidth = 30;
        //         worksheet.Cells["A5"].LoadFromCollection(rrreport, true);

        //         fileContents = package.GetAsByteArray();
        //     }

        //     if (fileContents == null || fileContents.Length == 0)
        //     {
        //         return NotFound();
        //     }

        //     return File(
        //         fileContents: fileContents,
        //         contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         fileDownloadName: code + ".xlsx"
        //     );
        // }
        // private ActionResult rp(string code, string doc, DataSet ds)
        // {
        //     byte[] fileContents;
        //     var allData = ds.Tables[0].Rows.Cast<DataRow>().ToList();
        //     List<rp> rpreport = (from tat in allData
        //                          select new rp
        //                          {
        //                              Return_Number = tat.ItemArray.ElementAtOrDefault(0).ToString(),
        //                              Order_Number = tat.ItemArray.ElementAtOrDefault(1).ToString(),
        //                              Created_Date = tat.ItemArray.ElementAtOrDefault(2).ToString(),
        //                              Return_DC = tat.ItemArray.ElementAtOrDefault(3).ToString(),
        //                              Brand = tat.ItemArray.ElementAtOrDefault(4).ToString(),
        //                              Return_Quantity = tat.ItemArray.ElementAtOrDefault(5).ToString(),
        //                              Ordered_Quantity = tat.ItemArray.ElementAtOrDefault(6).ToString(),
        //                              // Return_Reason = tat.ItemArray.ElementAtOrDefault(7).ToString(),
        //                              Item = tat.ItemArray.ElementAtOrDefault(7).ToString(),
        //                              EAN = tat.ItemArray.ElementAtOrDefault(8).ToString(),
        //                              Status = tat.ItemArray.ElementAtOrDefault(9).ToString(),
        //                          }
        //     ).ToList();

        //     if (doc == "c")
        //     {
        //         rpreport.Insert(0, new rp
        //         {
        //             Return_Number = "RMA Number",
        //             Order_Number = "Order Number",
        //             Created_Date = "RMA Date",
        //             Return_DC = "Return DC",
        //             Brand = "Brand",
        //             Return_Quantity = "Ret Qty",
        //             Ordered_Quantity = "Ord Qty",
        //             Item = "Item",
        //             EAN = "EAN/SKU",
        //             Status = "Status"
        //         });
        //         var stream = new MemoryStream();
        //         var writeFile = new StreamWriter(stream);
        //         var csv = new CsvWriter(writeFile);
        //         csv.Configuration.HasHeaderRecord = false;
        //         csv.WriteRecords(rpreport);
        //         csv.Flush();
        //         writeFile.Flush();
        //         stream.Position = 0; //reset stream
        //         return File(stream, "application/octet-stream", "returned_products.csv");
        //     }
        //     using (var package = new ExcelPackage())
        //     {
        //         var worksheet = package.Workbook.Worksheets.Add("RETURNED PRODUCTS");
        //         worksheet.Cells["A5:J5"].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //         worksheet.Cells["A5:J5"].Style.Font.Bold = true;

        //         worksheet.Cells["A1:J1"].Merge = true;
        //         worksheet.Cells["A1"].Value = "Returned Products Report";
        //         worksheet.Cells["A1:J1"].Style.Font.Bold = true;
        //         worksheet.Cells["A1:J1"].Style.Font.Size = 25;
        //         worksheet.Cells["A1:J1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //         using (var range = worksheet.Cells[5, 1, 5, 10])
        //         {
        //             range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //             range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //         }
        //         worksheet.DefaultColWidth = 30;
        //         worksheet.Cells["A5"].LoadFromCollection(rpreport, true);

        //         fileContents = package.GetAsByteArray();
        //     }

        //     if (fileContents == null || fileContents.Length == 0)
        //     {
        //         return NotFound();
        //     }

        //     return File(
        //         fileContents: fileContents,
        //         contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         fileDownloadName: code + ".xlsx"
        //     );
        // }
        // #endregion

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
