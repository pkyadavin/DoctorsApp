export class InventoryReconcileHdr {
    InventoryReconcileHdrID: number;
    ReconcileNumber: string;
    ReconcileDate: string;
    PartnerID: number;
    Partner: number;
    ItemMasterID: number;
    ItemNumber: string;
    ReconcileTypeID: number;
    CreatedBy:string;
    CreatedDate: Date;
    ModifyBy: number;
    ModifyDate: Date;
    Remarks: string;
    Location: string;
    Description: string;
    Quantity: string;
    //extra data
    SerializeData: string;
    Model: string;
    SerialNumber: string;
    ActualQuantity: string;
    UserId: number;   
    nodes: any;
   
}