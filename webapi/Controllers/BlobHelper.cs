using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
// using Microsoft.WindowsAzure;
// using Microsoft.WindowsAzure.Storage;
// using Microsoft.WindowsAzure.Storage.Blob;
public class BlobHelper {
    private readonly IConfiguration Config;
    //UAT Blob settings
    string ConfigurationSectionKey = "DefaultEndpointsProtocol=https;AccountName=rl21;AccountKey=Gq8i6BGVMzqzwB/fL2gzUZq/DMtY6k0XrYVLEnnZ0vnxEkldw2U/useCPa3ho7ZN1fJHwRO0SKCpCAiMzaJMOw==";
    string BlobURL = "https://rl21.blob.core.windows.net/";

    //Prod Blob settings
    // string ConfigurationSectionKey = "DefaultEndpointsProtocol=https;AccountName=amerprodblob;AccountKey=fgP60RS0MksqX8F1GHoqmnygsxABrmHtvl+MTubOyqX13TlMR7prXLl68vu5HJE1W4OSMX18rdq6wzgLXEOW8A==";
    // string BlobURL = "https://amerprodblob.blob.core.windows.net/";

    public string ContainerName { get; set; }

    public string PrintedDate { get; set; }
    public string DropOffLocation { get; set; }
    public string CustmerDetail { get; set; }
    public string CustomerAddress { get; set; }
    public string DropOffDate { get; set; }
    public string EstimatedPickup { get; set; }
    public string TotalPackage { get; set; }
    public string TrackingNumber { get; set; }
    public string Weight { get; set; }
    public string Carrier { get; set; }
    public string GenerateDropofflabeHTML () {
        StringBuilder dropOffhtml = new StringBuilder ();
        dropOffhtml.Append (
            @"<html><head><meta charset='utf-8'><title>Untitled Document</title>
                </head><body><table style='width:800px;margin:0px auto;'><tr><td>
                <h1 align='center'>Drop-Off Receipt</h1><hr size='2' />
                <p align='center'><strong>Printed on:</strong> " + PrintedDate + "</p>"
        );
        dropOffhtml.Append ("<br><br><table border = '1' cellpadding = '20' cellspacing = '0' width = '100%' style = 'border-collapse:collapse;'>");
        dropOffhtml.Append ("<tr><td align = 'center' style='width: 50%; vertical-align: top'><strong> Drop - off Location:</strong><br>" + DropOffLocation + " </td >");
        dropOffhtml.Append ("<td align = 'center' style='width: 50%; vertical-align: top'><strong> Customer Details:</strong><br>" + CustmerDetail + "<br/>" + CustomerAddress + "</td></tr>");
        dropOffhtml.Append (" <tr><td align = 'center' style='width: 50%; vertical-align: top'><strong> Drop - off Date - time:</strong><br>");
        dropOffhtml.Append (" " + DropOffDate + " </td><td align = 'center' style='width: 50%; vertical-align: top'>");

        dropOffhtml.Append ("<strong> Estimated Pick - up Date - time:</strong><br>" + EstimatedPickup + "");
        dropOffhtml.Append ("</td ></tr><tr><td align = 'center' style='width: 50%; vertical-align: top'><strong> Total Packages:</strong><br>");
        dropOffhtml.Append ("" + TotalPackage + " </td><td align = 'center' style='width: 50%; vertical-align: top'><strong> Tracking Number:</strong ><br>");
        dropOffhtml.Append ("" + TrackingNumber + "</td></tr><tr><td align = 'center' style='width: 50%; vertical-align: top'><strong> Carrier:</strong><br>");
        dropOffhtml.Append (" " + Carrier + " </td><td align = 'center' style='width: 50%; vertical-align: top'><strong> Weight:</strong><br>" + Weight + "</td></tr>");
        dropOffhtml.Append (" </table></td></tr></table></body></html>");

        return dropOffhtml.ToString ();
    }

    public string GenerateCustomDecalartionHTML (ReturnModel model, string ContentRootPath) {
        StringBuilder dropOffhtml = new StringBuilder ();

        string filepath = Path.Combine (ContentRootPath, "wwwroot\\html", "customdecalration.html");
        string shippingHTML = System.IO.File.ReadAllText (filepath);
        //string shippingHTML = "<!DOCTYPE html><html lang='en' xmlns='http://www.w3.org/1999/xhtml'><table style='width:800px;margin:0px auto;font-family:'arial''> <tr>   <td style='text-align: center;padding:15px 0px;'><img src='@@logokookai@@' /></td> </tr> <tr> <td>   <h1 style='text-align:center;font-family:Didot;'>RETURN INSTRUCTIONS</h1>      <hr />      <table style='width:100%;'>        <thead>          <tr>            <th style='width:50%;text-align:left;'>              <h2>CUSTOMER ADDRESS</h2>            </th>            <th style='width:50%;text-align:left;'>              <h2>E-BOUTIQUE ADDRESS</h2>            </th>          </tr>        </thead>        <tbody>          <tr>            <td style='width:50%;text-align:left;'>              @@customername@@<br />              @@customer_address_street1@@<br />              @@customer_address_street2@@<br />              @@customer_address_city@@ @@customer_address_state@@ @@customer_address_postal@@<br />              @@customer_address_country@@<br />              @@customer_email@@<br />              @@customer_phone@@                          </td>            <td style='width:50%;text-align:left;'>              @@returndc_name@@<br />              @@returndc_address_street1@@<br />              @@returndc_address_street1@@<br />              @@returndc_address_city@@ @@returndc_address_state@@ @@returndc_address_postal@@<br />              @@returndc_address_country@@<br /><br />              @@returndc_email@@<br />              @@returndc_phone@@            </td>          </tr>        </tbody>      </table>      <hr />      <h2 style='margin:10px 0px;'>PRODUCT DETAILS</h2>      <hr style='margin: 10px 0px!important;border-width:2px!important;border-color:#000000!important;'>      <table style='text-align: left!important;' width='100%' border='0' cellpadding='0' cellspacing='3'>          <tr>                       <td valign='top' style='width:35%!important;'><strong>Product Details</strong></td>            <td style='width: 15%!important;'><strong></strong></td>            <td style='width: 20%!important;'><strong></strong></td>            <td style='width: 30%!important;'><strong></strong></td>          </tr>          <tr>              <td valign='top'>&nbsp;</td>              <td valign='top'>&nbsp;</td>              <td valign='top'>&nbsp;</td>            </tr>          <tr>            <td valign='top' style='width:35%!important;'><strong>Item Name</strong></td>            <td style='width: 15%!important;'><strong>Quantity</strong></td>            <td style='width: 20%!important;'><strong>Return Reason</strong></td>            <td style='width: 30%!important;'><strong>Return Type</strong></td>          </tr>@@product_detail@@</table>      <hr />      <p><strong>Below are the shipping instructions to prepare your item(s) for shipment:</strong></p>      <ul>        <li>Please include the Return Instructions in your return parcel.</li>        <li>We recommend using the packaging from your initial order to return your item(s) by turning the satchel          inside out.</li>        <li>Place your items securely in the satchel with original packaging included (where applicable) and ensure the          satchel is completely sealed.</li>        <li>Place your return shipment in an Australia Post box or visit your nearest Post Office.</li>      </ul>      <p style='font-size:14px;'>Kind regards,</p>      <p style='font-size:14px;font-weight:bold;'>KOOKAÏ Eboutique team</p>    </td>  </tr></table>";

        shippingHTML = shippingHTML.Replace ("@@sendername@@", model.customer.firstname + " " + model.customer.lastname);
        shippingHTML = shippingHTML.Replace ("@@senderphone@@", model.customer.phone);
        shippingHTML = shippingHTML.Replace ("@@senderaddress@@", model.customer.address.complete_address + ", " + model.customer.address.city + ", " + model.customer.address.state_name + ", " + model.customer.address.country_name + ", " + model.customer.address.postal_code);

        shippingHTML = shippingHTML.Replace ("@@receivername@@", model.return_DC.name);
        shippingHTML = shippingHTML.Replace ("@@receiveraddress@@", model.return_DC.address.complete_address + ", " + model.return_DC.address.city + ", " + model.return_DC.address.state_name + ", " + model.return_DC.address.country_name + ", " + model.return_DC.address.postal_code);
        shippingHTML = shippingHTML.Replace ("@@receiverphone@@", model.return_DC.phone);
        shippingHTML = shippingHTML.Replace ("@@invoicenumber@@", model.return_order_number);
        shippingHTML = shippingHTML.Replace ("@@receiverfax@@", "");
        shippingHTML = shippingHTML.Replace ("@@shipmentnumber@@", model.shipment.shipment_number);
        shippingHTML = shippingHTML.Replace ("@@mnrnumber@@", model.shipment.mrn_number);

        shippingHTML = shippingHTML.Replace ("@@rmadate@@", model.return_order_date.ToString ());

        foreach (var item in model.items) {
            dropOffhtml.Append ("<tr><td valign='top'>" + item.name + "</td><td>" + item.quantity + "</td><td>" + item.return_reason.rma_action_name + "</td>");
            dropOffhtml.Append ("</tr>");
        }
        string[] keys = shippingHTML.Split (new string[] { "@@product_detail@@" }, StringSplitOptions.None);

        shippingHTML = keys[0] + dropOffhtml.ToString () + keys[1];

        return shippingHTML.ToString ();
    }

    public async Task<string> UploadBlob (string fileName, byte[] fileData, string fileMimeType) {
        // CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse (ConfigurationSectionKey);
        // CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient ();
        // string strContainerName = "uploads";
        // CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference (strContainerName);

        // if (await cloudBlobContainer.CreateIfNotExistsAsync ()) {
        //     await cloudBlobContainer.SetPermissionsAsync (new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
        // }

        // if (fileName != null && fileData != null) {
        //     CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference (fileName);
        //     cloudBlockBlob.Properties.ContentType = fileMimeType;
        //     await cloudBlockBlob.UploadFromByteArrayAsync (fileData, 0, fileData.Length);
        //     return cloudBlockBlob.Uri.AbsoluteUri;
        // }
        return "";
    }

    public string GenerateFileName (string fileName) {
        string strFileName = string.Empty;
        string[] strName = fileName.Split ('.');
        Random rr = new Random ();
        strFileName = rr.Next (1000, 99999).ToString () + DateTime.Today.Ticks.ToString () + rr.Next (10, 99) + ".pdf";
        return strFileName;
    }

    public string GetMimeType (string fileName) {
        string mimeType = "application/unknown";
        string ext = System.IO.Path.GetExtension (fileName).ToLower ();
        Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey (ext);
        if (regKey != null && regKey.GetValue ("Content Type") != null)
            mimeType = regKey.GetValue ("Content Type").ToString ();
        return mimeType;
    }

}