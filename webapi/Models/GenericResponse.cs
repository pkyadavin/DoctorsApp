using System.Collections.Generic;

public class GenericResponse
{
    public string status { get; set; }
    public List<GenericPackage> packages { get; set; }  
    public List<LabelURL> labelURLs { get; set; }    
    public string shipment_id { get; set; }    
    public string errorMessage { get; set; }
}


public class GenericPackage
{
    public string tracking_no { get; set; }
    public string route_number { get; set; }
    public string service_code { get; set; }
    public string carrier_code { get; set; }
    public string carrier_tracking_number { get; set; }
    public string tracking_url { get; set; }

}

public class Route
{
    public string route_number { get; set; }
    public string service_code { get; set; }
    public string carrier_code { get; set; }
    public string carrier_tracking_number { get; set; }
    public string tracking_url { get; set; }
    public string status { get; set; }
}

public class LabelURL
{
    public string url { get; set; }
    public string type { get; set; }
    public string format { get; set; }    
}
