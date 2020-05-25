export class B2BUserModel {
    MapId:number;
    IsActive:boolean;
    _AccountBillto : AccountBillto;
    constructor();
    constructor(acc:AccountBillto)
    constructor(acc?:any){
        this._AccountBillto=new AccountBillto(acc);
    }
}
class commonAddress{
    Address1 : string;
    Address2 : string;
    City : number;
    State : number;
    Country : number;
    PostalCode : string;
    RegionalOffice : string;
    IsActive : boolean;
    constructor();
    constructor(cadd: commonAddress)
    constructor(cadd?: any) {
        this.RegionalOffice = cadd && cadd.RegionalOffice || '';
        this.Address1 = cadd && cadd.Address1 || '';
        this.Address2 = cadd && cadd.Address2 || '';
        this.City = cadd && cadd.City || null;
        this.State = cadd && cadd.State || null;
        this.Country = cadd && cadd.Country || null;
        this.PostalCode = cadd && cadd.PostalCode || '';
        this.IsActive = cadd && cadd.IsActive || true;
        
    }
}
export class AccountBillto extends commonAddress{
    AccountBillToID : number;
    AccountNo : string;
    AccountName : string;
    ServiceType : number;
    StoreShipToID : number;
    FirstName:string;
    LastName:string;
    Email:string;
    Phone:string;
    _StoreShipTo : StoreShipTo;
    constructor();
    constructor(acb: AccountBillto)
    constructor(acb?: any) {
        super(acb);
        this.AccountBillToID = acb && acb.AccountBillToID || 0;
        this.AccountNo = acb && acb.AccountNo || '';
        this.AccountName = acb && acb.AccountName || '';
        this.ServiceType = acb && acb.ServiceType || 0;
        this.StoreShipToID = acb && acb.StoreShipToID || 0;
        this.FirstName = acb && acb.FirstName || '';
        this.LastName = acb && acb.LastName || '';
        this.Email =acb && acb.Email || '';
        this.Phone = acb && acb.Phone || '';
        this._StoreShipTo = acb && acb._StoreShipTo || null;
    }
}
export class StoreShipTo extends commonAddress{
    StoreShipToID : number;
    ShipToNo : string;
    ShipToName : string;
    AccountBillToID : number;
    constructor();
    constructor(sst: StoreShipTo)
    constructor(sst?: any) {
        super(sst);
        this.StoreShipToID = sst && sst.StoreShipToID || 0;
        this.ShipToNo = sst && sst.ShipToNo || '';
        this.ShipToName = sst && sst.ShipToName || '';
        this.AccountBillToID = sst && sst.AccountBillToID || '';
    }
}

export class ProductGradeModel {
    GradeId: number;
    GradeCd: string;
    Description: string;
    IsActive: boolean;
    UserID: number;
    CreatedBy:string;
    CreatedDate:string;
    ModifiedBy:string;
    ModifiedDate:string;
 }

 export class CountryStateCity{
    id:number;
    code:string;
    name:string;
    constructor()
    constructor(obj:CountryStateCity)
    constructor(obj?:any){
        this.id=obj && obj.id || 0;
        this.code=obj && obj.code ||'';
        this.name=obj && obj.name || '';
    }
}
