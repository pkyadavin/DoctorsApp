export class MRN {
    Id: number;
    MRNHeaderID: number;
    MRNNumber   : string;
    RefrenceNumber: string;
    Manufacturer: string;
    MRNDate: Date;
    MRNTypeID: number;  
    MRNTypeCode: string;
    MRNTypeName: string;
    ShipViaID: number;
    ShipmentTerm: string;
    PaymentTermID: number;
    CarrierID: number;
    Remarks: string;
    BOLNumber: string;
    FromPartnerName: string;
    FromPartnerId: number;
    FromPartnerAddress: string;  
    FromAddressId: number;  
    ToPartnerName: string;
    ToPartnerId: number;
    ToPartnerAddress: string;
    ToAddressId: number;
    Status: string;
    ActionCode: string;
    ModuleWorkFlowDetailID: number;
    ModuleStatusMapID: number;
    CreatedBy: number;
    Source: string;
    NextStatus: string;
    IsHeaderUpdate: boolean;
    MRNLines: MRNLine[]; 
}

export class MRNHeader {    
    MRNNumber: string;
    ToPartnerName: string;
    FromPartnerName: string;
    ToPartnerAddress: string;
    FromPartnerAddress: string;
}

export class MRNLine {
    Id: number;
    ItemMasterID: number;
    ItemInfoID: number;
    PartnerID: number;
    NodeID: number;
    LocationID: number;
    RefTypeID: number;
    RefHeaderID: number;
    RefDetailID: number;
    FacilityLocationID: number;
    ContainerNumber: string;
    Quantity: number;
    ItemStatusID: number;
    SerialNumber: string;
    ItemNumber: string;
    ItemDescription: string;
    TranDate: Date;
    ReferenceNumber: string;
    PackageNumber: string;
    ModuleWorkFlowID: number;
    ModuleWorkFlowDetailID: number;
    PreviousModuleWorkFlowDetailID: number;
    StatusID: number;
    Status: string;
    StatusCode: string;
    ItemStatus: string;
    Remarks: string;
    Node: string;
    Location: string;
    PendingQuantity: number;
    ShippingNumber: string;
    ReceiveType: string;
    DiscrepancyID: number;
    Discrepancy: number;
    DiscrepancyRemark: string;
    DiscrepancyQuantity: number;
    RefType: string;
    CreatedDate: string;
    FromPartner: string;
    FromPartnerId: number;
    FromPartnerAddressId: number;
    ToPartner: string;
    ToPartnerId: number;
    ToPartnerAddressId: number;
    CarrierID: number;
    BOLNumber: string;
    Source: string; 
    ReturnReasonType: string;

    FromAccountID: number;
    ReturnReasonID: number;
    SalesReturnOrderDetailID: number;
    ItemModelID: number;
    ModelName: string;
    SerialQuantity: string;
    SONumber: string;
    ReturnReason: string;
    StatusName: string;
    SubInventory: string;
    ItemConditions: string; 
    AccessoriesName: string;  
    AccessoriesID: string;   
    LastReceive: number; 
    CarrierName: string;
    AttachedDocument: number;
    LineID: number;
    ItemDamagedType: string;
    MRNHeaderID: number;
    IsContainerClosed: boolean;
    IsContainerEnabled: boolean;    
}

export class MRNActionInput {
    Id: number;
    ActionCode: string;
    ReferenceNumber: string;
    ReferenceDate: Date;
    RefType: string;
    RefTypeCode:string="";
    PartnerId: number;
    RefTypeId: number;
    Rules: MRNActionRule[];
    PreviousLines: MRNLine[];

    constructor() {
        this.Rules = new Array();
        this.PreviousLines = new Array();
    }

}

export class MRNActionRule {
    Id: number;
    ActionCode: string;
    RuleCode: string;
    RuleName: string;
}

export class IncomingTask {
    RefId: number;
    RefNumber: string;
    RefType: string;
    RefCode: string;
    Action: string;
    ActionCode: string;
    IsAccess: boolean;
}

export class PendingArtifacts {
    ID: number;
    FileName: string;
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

export class ReceivingAction {
    Action: string;
    ActionCode: string;
    ListStatusID: string;
    ScanStatusID: string;
}

