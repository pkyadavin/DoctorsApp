//import { TypeLookUp } from '../../component/Region/typelookup.model'
//import { TypedJson } from '../../component/Property.js';
import { TypedJson } from '../../app.util';
import { TypeLookUp } from '../../back-office/Region/typelookup.model';

export class ItemMaster {
    TransactionID: number;
    ItemMasterID: number;
    ItemNumber: string;
    ItemName: string;
    ItemDescription: string;
    ItemPrice: number;
    ArticleNumber: string;
    ManufacturerID: number;
    ItemModelID: number;
    ItemDiscountPC: number;
    EANCode: string;
    SKUCode: string;
    BarCode: string;
    UOMID: number;
    ColorID: number;
    ItemCost: number;
    IsActive: boolean;
    ItemReceiveTypeID: number;
    ItemReceiveType: TypeLookUp;
    IsSWAPAllowed: boolean;
    IsReplacementAllowed: boolean;
    IsApprovalRequired: boolean;
    ExtWarrantyDays: boolean;
    CanAllocate: boolean;
    CanConsume: boolean;
    CanDelete: boolean;

    constructor()
    constructor(ItemMaster: ItemMaster)
    constructor(ItemMaster?: any) {
        this.TransactionID = ItemMaster && ItemMaster.TransactionID || +new Date();
        this.ItemMasterID = ItemMaster && ItemMaster.ItemMasterID || 0;
        this.ItemNumber = ItemMaster && ItemMaster.ItemNumber || null;
        this.ItemName = ItemMaster && ItemMaster.ItemName || null;
        this.ItemDescription = ItemMaster && ItemMaster.ItemDescription || null;
        this.ItemPrice = ItemMaster && ItemMaster.ItemPrice || 0;
        this.ArticleNumber = ItemMaster && ItemMaster.ArticleNumber || null;
        this.ManufacturerID = ItemMaster && ItemMaster.ManufacturerID || 0;
        this.ItemModelID = ItemMaster && ItemMaster.ItemModelID || 0;
        this.ItemDiscountPC = ItemMaster && ItemMaster.ItemDiscountPC || 0;
        this.EANCode = ItemMaster && ItemMaster.EANCode || null;
        this.SKUCode = ItemMaster && ItemMaster.SKUCode || null;
        this.BarCode = ItemMaster && ItemMaster.BarCode || null;
        this.UOMID = ItemMaster && ItemMaster.UOMID || 0;
        this.ColorID = ItemMaster && ItemMaster.ColorID || 0;
        this.ItemCost = ItemMaster && ItemMaster.ItemCost || 0;
        this.IsActive = ItemMaster && ItemMaster.IsActive || false;
        this.ItemReceiveTypeID = ItemMaster && ItemMaster.ItemReceiveTypeID || 0;
        this.ItemReceiveType = ItemMaster && ItemMaster.ItemReceiveType && TypedJson.parse<TypeLookUp>(ItemMaster.ItemReceiveType) || new TypeLookUp()
        this.IsSWAPAllowed = ItemMaster && ItemMaster.IsSWAPAllowed || false;
        this.IsReplacementAllowed = ItemMaster && ItemMaster.IsReplacementAllowed || false;
        this.IsApprovalRequired = ItemMaster && ItemMaster.IsApprovalRequired || false;
        this.ExtWarrantyDays = ItemMaster && ItemMaster.ExtWarrantyDays || 0;
        this.CanAllocate = ItemMaster && ItemMaster.CanAllocate || false;
        this.CanConsume = ItemMaster && ItemMaster.CanConsume || false;
        this.CanDelete = ItemMaster && ItemMaster.CanDelete || false;
    }
}