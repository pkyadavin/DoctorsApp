export class SalesReturnOrder {
    IsCP: boolean;
    SalesReturnOrderHeaderID: number;
    SalesReturnOrderDetailID: number;
    SalesReturnRMANumber: string;
    SONumber: string;
    OrderDate: string;
    ItemQty: number;
    Requester: string;
    ReturnReason: string;
    CreatedBy: string;
    AlternateEmailID: string;
    ContactEmailID: string;
    ContactPerson: string;
    ContactNumber: string;
    UserId: number;    
    FromAddressID: number;
    FromAddress: string;
    CustomerID: number;
    ToPartnerID: number;
    ToPartnerName: string;
    OrderLines: any;//Selected line items
    Artifacts: any;//Artifact list
    RulesList:any //Rules List

    //Return Actions
    DamageAmount: number;
    RequiredApprDays: number;
    RestockingFee: number;
    FirstApproverID: number;
    SecondApproverID: number;
    ReturnReceiving: number;
    DynamicControlsData: any;
    //SalesReturnOrderDetailID: number
    //SalesReturnRMANumber: string;
    DeliveryTypeID: number;
    ShipmentID: number;
    ShippingNumber: string;
    ShipDate: string;
    CarrierID: string;
    CarrierEmailID: string;
    CarrierRemarks: string;
    CarrierName: string;
    BillNumber: string;
    SerialNumber: string;
    ItemNumber: string;
    StatusName: string;  
    ShippingLabelUrl: string;
    NeedApproval: boolean;  
    ReturnReasonType: string;
    ReturnFacilityID: number;
}

export class SalesReturnOrderDetail {

    SalesReturnOrderDetailID: number;
    SalesReturnRMANumber: string;
    //TenantReferenceNumber
    ItemInfoID: number;
    WarrantyStatusID: number;
    SOHeaderID: number;
    SODetailID: number;
    DeliveryTypeID: number;
    //CarrierID
    //ShippingNumber
    //ShipDate
    ReturnReasonID: number;
    ReturnTypeID: number;
    //DamageTypeID: number;
    Quantity: number;
    ReturnPrice: string;
    ApprovalRoleID: number;
    ApproverTypeID: number;
    //DaysElapsed: number;
    //ModuleWorkFlowID
    //ModuleStatusMapID
    //firstAprovalBy
    //FirstAprovalRemarks
    //SecondAprovedBy
    //SecondAprovalRemarks
    //AccountPONumber
    //DamageLocation: string;
    //DiscrepancyComments
    DynamicControls: any;
}

export class SRODetailReasonValue {
    SaleReturnOrderDetailReasonValueID: number;
    SaleReturnOrderDetailID: number;
    PartnerReturnReasonRuleMapID: number;
    RuleValue: string;
}

export class SRODetailArtifacts {
    SaleReturnOrderDetailArtifactsID: number;
    SaleReturnOrderDetailReasonValueID: number;
    ArtifactID: number;
    ArtifactTypeID: number;
}
export class PendingArtifacts {
    constructor() { }
    RR00009: Array<Artifacts> = new Array<Artifacts>();
    RR00037: Array<Artifacts> = new Array<Artifacts>();
    RR00038: Array<Artifacts> = new Array<Artifacts>();
}
export class Artifacts {
    //ID: number;
    //FileName: string;
    //FileUrl: string;
    //SystemGenName: string;
    //DocTypeID: number;
    //DocType: string;
    ID: number;
    FileName: string;
    FileType: string;
    FileUrl: string;
    SystemGenName: string;
    DocTypeID: number;
    DocType: string;
    IsImage: boolean;
    IsVideo: boolean;
    IsDoc: boolean;
    IsSheet: boolean;
    IsPdf: boolean;
    IsOther: boolean;
}

export class ApprovalDetails {
    SRODetailID: number;
    IsRejected: number;
    ApproverTypeID: number;
    ApprovalRoleID: number;
    RejectReasonID: number;
    Remarks: string;
}

export class TaskQueueDetails {
    RefId: number;
    RefNumber: string;
    RefType: string;
    RefCode: string;
    Action: string;
    ActionCode: string;
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
