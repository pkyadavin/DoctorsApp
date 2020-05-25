
import { SalesReturnOrder } from '../SalesReturnOrder/SalesReturnOrder.model'

export class ShipmentModel {
    ShipmentID: number;
    ShippingNumber: string;
    CarrierName: string;
    AWBNumber: string;
    ShipDate: string;
    CarrierID: number;
    CarrierCode: string;
    CarrierEmailID: string;
    CarrierRemarks: string;
    SelectedRecords: string;
    Items: Array<SalesReturnOrder>;
    ShippingLabelURL: string;
    ReturnFacilityID: number;
    RequesterID: number;
    Requester: string;
    FromAddressID: number;
    FromAddress: string;
    ToAddressID: number;
    AddressTo: string;
    Length: number;
    Width: number;
    Height: number;
    Weight: number;
    ServiceCode: string;
}

export class TrackCarrier {
    ActivityDate: string;
    ActivityTime: string;
    Location: string;
    Status: string;
    StatusCode: string;

    constructor(obj?: any) {
        this.ActivityDate = obj && obj.ActivityDate || '';
        this.ActivityTime = obj && obj.ActivityTime || '';
        this.Location = obj && obj.Location || '';
        this.Status = obj && obj.Status || '';
        this.Status = obj && obj.Status || '';
        this.StatusCode = obj && obj.StatusCode || '';
    }
}

export class ShipingService {
    Code: string;
    Description: string;
    TransitTime: string;
    Guaranteed: boolean;
    Cost: number;
    constructor(obj?: any) {
        this.Code = obj && obj.Service.Code || '';
        this.Description = obj && obj.Service.Description || '';
        this.TransitTime = obj && obj.EstimatedArrival.BusinessDaysInTransit || '';
        this.Guaranteed = obj && obj.GuaranteedIndicator || false;
        this.Cost = obj && obj.Cost || 0;
    }
}