using System;
using System.Collections.Generic;

public class ReturnModel
{
    public string language { get; set; }
    public string return_order_number { get; set; }
    public string internal_order_number { get; set; }
    public string order_number_reference { get; set; }
    public DateTime? return_order_date { get; set; }    
    public DateTime? ship_date { get; set; }    
    public DateTime? receive_date { get; set; }
    public decimal return_order_amount { get; set; }
    public decimal tax_amount { get; set; }
    public decimal return_order_total_amount { get; set; }
    public decimal refund_amount { get; set; }
    public decimal refund_tax { get; set; }
    public decimal total_refund { get; set; }
    public string currency { get; set; }
    public string brand { get; set; }
    public Customer customer { get; set; }    
    public List<ItemsArray> items { get; set; }
    public Shipment shipment { get; set; }
    public ReturnDC return_DC { get; set; }
    public string source { get; set; }   
    public Returnfreight returnfreight { get; set; }
    public List<File> labels { get; set; }
    public File custom_declaration { get; set; }
    public Status status { get; set; }   
    public bool customRequiredCountry { get; set; }     
}

public class ReturnDC
{
    public string code { get; set; }
    public string name { get; set; }
    public string email { get; set; }
    public string phone { get; set; }
    public string company { get; set; }
    public Address address { get; set; }
}

public class ItemsArray
{
    public string id { get; set; }    
    public string name { get; set; }
    public string EAN { get; set; }    
    public string image_url { get; set; }    
    public float quantity { get; set; }    
    public float quantity_received { get; set; }    
    public float quantity_processed { get; set; }
    public string remark { get; set; }
    public string shipment_id { get; set; }
    public ReturnReason return_reason { get; set; }
    public Grade grade { get; set; }
    public Status status { get; set; }
    public List<File> files { get; set; }
    public List<@Event> @event { get; set; }
    public Extra extra { get; set; }
    public List<Specifics> specifics { get; set; }
}
public class Specifics
{
    public string color { get; set; }
    public string size { get; set; }
    public string model { get; set; }
    public string weight { get; set; }
    public string shipping_date { get; set; }
}
public class File
{
    public string type { get; set; }
    public string url { get; set; }
}
public class Event
{
    public string @event { get; set; }
    public string remark { get; set; }
    public DateTime? event_time { get; set; }
}
public class Extra
{
    public bool is_severly_damaged { get; set; }
}
public class ReturnReason
{
    public string rma_action_code { get; set; }
    public string rma_action_name { get; set; }
}
public class Grade
{
    public string grade_code { get; set; }
    public string grade_name { get; set; }
}
public class Status
{
    public string code { get; set; }
    public string status { get; set; }
}
public class Customer
{
    public string cif_number { get; set; }
    public string title { get; set; }    
    public string firstname { get; set; }    
    public string lastname { get; set; }
    public string email { get; set; }
    public string phone { get; set; }
    public string name { get; set; }    
    public string company { get; set; }
    public Address address { get; set; }
    
}

public class Address
{
    public string street1 { get; set; }
    public string street2 { get; set; }
    public string street3 { get; set; }  
    public string state { get; set; }
    public string state_code { get; set; }
    public string state_name { get; set; }
    public string city { get; set; }
    public string postal_code { get; set; }
    public string country_code { get; set; }
    public string country_name { get; set; } 
    public bool residential { get; set; }   
    public string complete_address{get;set;}
}

public class Shipment
{
    public string shipment_id { get; set; }
    public string shipment_number { get; set; }
    public string carrier { get; set; }
    public decimal shipping_charge { get; set; }
    public decimal sponsorship { get; set; }
    public decimal tax_amount { get; set; }
    public List<Parcel> parcels { get; set; }
    public string mrn_number { get; set; }
    
}

public class Returnfreight
{
    public bool active { get; set; }
    public string ServiceLevel { get; set; }
    public decimal avg_weight { get; set; }
    public decimal avg_cost { get; set; }
    public decimal over_weight { get; set; }
    public decimal over_cost { get; set; }
}

public class Parcel
{
    public string shipment_id { get; set; }
    public string description { get; set; }
    public Dimensions dimensions { get; set; }
    public string carrier_code { get; set; }
    public string carrier_tracking_number { get; set; }
    public string tracking_url { get; set; }
}

public class Dimensions
{
    public int depth { get; set; }
    public int width { get; set; }
    public int height { get; set; }
    public int weight { get; set; }
    public string unit { get; set; }
}

