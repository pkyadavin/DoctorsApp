using System.Collections.Generic;
using Newtonsoft.Json.Linq;
public class UBModel
{
    public Shipments shipment { get; set; }
}

public class Shipments
{
    public string order_date { get; set; }
    public string marketplace_order_id { get; set; }
    public bool needs_customs_declaration { get; set; }
    public string first_mile { get; set; }
    public UBAddress address_from { get; set; }
    public UBAddress address_to { get; set; }
    public List<Package> packages { get; set; }
}

public class UBAddress
{
    public string street1 { get; set; }
    public string street2 { get; set; }
    public string street_no { get; set; }
    public string city { get; set; }
    public string state { get; set; }
    public string postal_code { get; set; }
    public string country { get; set; }
    public bool residential { get; set; }
    public string name { get; set; }
    public string company { get; set; }
    public string email { get; set; }
    public string complete_address{get;set;}
}

public class Package
{
    public decimal length { get; set; }
    public decimal width { get; set; }
    public decimal height { get; set; }
    public string distance_unit { get; set; }
    public string mass_unit { get; set; }
    public decimal weight { get; set; }
}

public class UBResponse
{
    public string status { get; set; }
    public List<Message> messages { get; set; }
    public Content content { get; set; }
}

public class Message
{
    public string type { get; set; }
    public string text { get; set; }
    public string key { get; set; }
}

public class Content
{
    public string task_id { get; set; }
    public List<Message> msgs { get; set; }
    public List<string> shipment_ids { get; set; }
}


public class UBCarrierResponse
{
    public string status { get; set; }    
    public UBContent content { get; set; }  
}

public class UBContent
{
    public List<UBTracking> tracking { get; set; }   
    public UBDownloadResult download_result { get; set; } 
}

public class UBTracking
{
    public string shipment_id { get; set; }
    public List<UBPackage> packages { get; set; }
}

public class UBPackage
{
    public string tracking_no { get; set; }
    public string tracking_url { get; set; }
    public string status { get; set; }
    public List<UBRoute> route_information { get; set; }
}

public class UBRoute
{
    public string route_number { get; set; }
    public string service_code { get; set; }
    public string carrier_code { get; set; }
    public string carrier_tracking_number { get; set; }
    public string tracking_url { get; set; }
    public string status { get; set; }
}

public class UBDownloadResult
{
    public List<UBDownloadURL> download_urls { get; set; }
    public UBCustomURLs customs_urls { get; set; }
    public object errors { get; set; }    
}

public class UBDownloadURL
{
    public string url { get; set; }
    public string file_type { get; set; }
    public string format { get; set; }    
}

public class UBCustomURLs
{ 
    public string declaration { get; set; }
    public string invoice { get; set; }
}

public class UBTaskAPIResponse
{
    public string status { get; set; }
    public TaskContent content { get; set; }
}

public class TaskContent
{
    public Progress progress { get; set; }
}

public class Progress
{
    public bool running { get; set; }
    public bool success { get; set; }
    public bool error { get; set; }
}