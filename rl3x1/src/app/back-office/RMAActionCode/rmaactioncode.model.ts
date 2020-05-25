export class RMAActionCode {
    RMAActionCodeID: number;
    RMAActionTypeID: number;
    RMAActionMapTypeID: number;  
    RMAActionCode: string;
    RMAActionName: string;
    Parameters: string;
    isActive: boolean;
    CreatedBy: string;
    CreatedDate: string;
    ModifyByID: string;
    ModifyDate: Date;    
    AllItemMasterList: any[];
    SelectedItemSKUList: any[];
    SelectedReturnReasons :any[];
    constructor()
    constructor(RMAActionCode?: RMAActionCode)
    constructor(RMAActionCode?: any) {
        this.RMAActionCodeID = RMAActionCode && RMAActionCode.RMAActionCodeID || 0;
        this.RMAActionTypeID = RMAActionCode && RMAActionCode.RMAActionTypeID || 0;
        this.RMAActionCode = RMAActionCode && RMAActionCode.RMAActionCode || 'AUTO';
        this.RMAActionName = RMAActionCode && RMAActionCode.RMAActionName || '';
        this.Parameters = RMAActionCode && RMAActionCode.Parameters || '';
        this.isActive = RMAActionCode && RMAActionCode.isActive || true;
    }
}
export class ModelMaster {
    ItemMasterID: number;
    ArticleNumber: string;
    ItemName: string;
    ItemNumber: string;
    ItemDescription: string;
    SubGroupName: string;
    SubGroupID: number;
    ItemReceiveTypeID: number;
    ItemSKUID: number;
    TypeName: string;
    SKUcode: string;
    EANCode: string;
    ManufacturerName: string;
    ManufacturerID: number;
    UOMID: number;
    UOMName: string;
    ColorID: number;
    ColorName: string;
    ItemCost: string;
    ItemDiscountPC: string
    ItemPrice: string;
    IsActive: boolean;
    ExtWarrantyDays: number;
    AllItemMasterList: any[];
    AllItemMasterTypeList: any[];
    TypeCode: string;
    TypeLookUpID: string;
    SafetyStockQty: string;
    SKUName: string;
    Price: string;
    SKUDescription: string;
    ItemList: any;
    Quantity: number;
    ItemModelID: number;

}









       