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
    CurrencyCode: string;
    ItemReturnTypeID: number;
    ReturnDays: number;
}

export class ModelMasterImage {
    ItemMasterID: number;
    FileName: string;
    ArtifactURL: string;
    Description: string;
    IsDefault: boolean;
    CreatedBy: number;
    ItemArtifactID: number;
}

