export class CaseCreationModel {
    CaseID:number;
    CaseNo:string;
    PoWoNo:string;
    Upload:string;
    ServiceLanguage :number ;
    CreatedBy:number;
    CreatedDate:string;
    ModifiedBy:number;
    ModifiedDate:string;
    IsActive:boolean;
    _intakeOrderData:intakeOrdersModel[];
    _PersonalInfoData:PersonalInfoModel;
    _ReturnShipinData:ReturnShipingModel;
    
    constructor()
    constructor(obj : CaseCreationModel)
    constructor(obj? : any){
        this.CaseID = obj && obj.CaseID || 0;
        this.CaseNo = obj && obj.CaseNo || '0000';
        this.PoWoNo = obj && obj.PoWoNo || '';
        this.Upload = obj && obj.Upload || '';
        this.ServiceLanguage = obj && obj.ServiceLanguage || 0;
        this.CreatedBy = obj && obj.CreatedBy || 0;
        this.CreatedDate = obj && obj.CreatedDate || '';
        this.ModifiedBy = obj && obj.ModifiedBy || 0;
        this.ModifiedDate = obj && obj.ModifiedDate || '';
        this.IsActive = obj && obj.IsActive || 1;
        this._intakeOrderData=obj && obj._intakeOrderData || [];
        this._PersonalInfoData=obj && obj._PersonalInfoData || new PersonalInfoModel();
        this._ReturnShipinData=obj && obj._ReturnShipinData || new ReturnShipingModel();
    }
}
class AddressModel{
    AccountNo:string;
    RegionalOffice:string;
    Address1:string;
    Address2:string;
    City:number;
    CityName:string;
    State:number;
    StateName:string;
    Country:number;
    CountryName:string;
    PostalCode:string;
    ServiceType:number;
    ServiceName:string;
    constructor()
    constructor(obj : AddressModel)
    constructor(obj? : any){
        this.AccountNo = obj && obj.AccountNo || '';
        this.RegionalOffice = obj && obj.RegionalOffice || '';
        this.Address1 = obj && obj.Address1 || '';
        this.Address2 = obj && obj.Address2 || '';
        this.City = obj && obj.City || 0;
        this.CityName = obj && obj.CityName || '';
        this.State = obj && obj.State || 0;
        this.StateName = obj && obj.StateName || '';
        this.Country = obj && obj.Country || 0;
        this.CountryName = obj && obj.CountryName || '';
        this.PostalCode = obj && obj.PostalCode || '';
        this.ServiceType = obj && obj.ServiceType || 0;
        this.ServiceName = obj && obj.ServiceName || '';
    }
}
export class PersonalInfoModel extends AddressModel {
    AccountBillToID:number;
    AccountName:string;
    PersonalMail:string;
    PersonalFirstName:string;
    PersonalLastName:string;
    PersonalPhoneNo:string;
    PreferredLanguage:number;
    constructor()
    constructor(obj : PersonalInfoModel)
    constructor(obj? : any){
        super(obj);
        this.AccountBillToID = obj && obj.AccountBillToID || 0;
        this.AccountName = obj && obj.AccountName || '';
        this.PersonalMail = obj && obj.PersonalMail || '';
        this.PersonalFirstName = obj && obj.PersonalFirstName || '';
        this.PersonalLastName = obj && obj.PersonalLastName || '';
        this.PersonalPhoneNo = obj && obj.PersonalPhoneNo || '';
        this.PreferredLanguage = obj && obj.PreferredLanguage || 0;
    }
}

export class ReturnShipingModel extends AddressModel{
    StoreShipToID:number;
    ShipToNo:string;
    ShipToName:string;
    constructor()
    constructor(obj : ReturnShipingModel)
    constructor(obj? : any){
        super(obj);
        this.StoreShipToID = obj && obj.StoreShipToID || 0;
        this.ShipToNo = obj && obj.ShipToNo || '';
        this.ShipToName = obj && obj.ShipToName || '';
    }
}
export class ProductInfoModel{
    ProModel:string;
    ProPoWo:string;
    ProColor:number;
    SelectedProColor:any=[]
    ProSize:number;
    SelectedProSize:any=[]
    ProIssue:number;
    SelectedProIssue:any=[]
    ProUpload:string;
    constructor()
    constructor(obj : ProductInfoModel)
    constructor(obj? : any){
        this.ProModel = obj && obj.ProModel || '';
        this.ProPoWo = obj && obj.ProPoWo || '';
        this.ProColor = obj && obj.ProColor || 0;
        this.ProSize = obj && obj.ProSize || 0;
        this.ProIssue = obj && obj.ProIssue || 0;
        this.ProUpload = obj && obj.ProUpload || '';
    }
}
export class intakeOrdersModel{
    order_id:number;
    order_number: string;
    vendor_number:string;
    req_by_date:string;
    price_year:string;
    season_code_id:string;
    product_number:string;
    category_code_id:string;
    grade_code_id:string;
    subcategory_code_id:string;
    sex_code:string;
    hstariff_id:string;
    country_of_origin_id:string;
    prim_season_code:string;
    product_sku:string;
    product_qty:string;
    product_weight:string;
    size_code_id:string;
    sort_order:string;
    color_description:string;
    base_color:string;
    hex_value:string;
    createdby:number;
    created_date:string;
    updatedby:number;
    updated_date:string;
    IsSelected:boolean;
    Issue:number;
    SelectedIssue:CountryStateCityColor [];// =new CountryStateCityColor();
    SelectedParentIssue:CountryStateCityColor =new CountryStateCityColor();
    RootCause:number;
    SelectedRootCause:CountryStateCityColor =new CountryStateCityColor();
    Location:number;
    SelectedLocation:CountryStateCityColor[];//=new CountryStateCityColor();
    ProUpload:string;
    ReferenceNo:string;
    files: Array<file>;
    Quantity:number;
    constructor()
    constructor(obj:intakeOrdersModel)
    constructor(obj?:any){
        this.order_id=obj && obj.order_id||0;
        this.order_number=obj && obj.order_number||'';
        this.vendor_number=obj && obj.vendor_number||'';
        this.req_by_date=obj && obj.req_by_date||'';
        this.price_year=obj && obj.price_year||'';
        this.season_code_id=obj && obj.season_code_id||'';
        this.product_number=obj && obj.product_number||'';
        this.category_code_id=obj && obj.category_code_id||'';
        this.grade_code_id=obj && obj.grade_code_id||'';
        this.subcategory_code_id=obj && obj.subcategory_code_id||'';
        this.sex_code=obj && obj.sex_code||'';
        this.hstariff_id=obj && obj.hstariff_id||'';
        this.country_of_origin_id=obj && obj.country_of_origin_id||'';
        this.prim_season_code=obj && obj.prim_season_code||'';
        this.product_sku=obj && obj.product_sku||'';
        this.product_qty=obj && obj.product_qty||'';
        this.product_weight=obj && obj.product_weight||'';
        this.size_code_id=obj && obj.size_code_id||'';
        this.sort_order=obj && obj.sort_order||'';
        this.color_description=obj && obj.color_description||'';
        this.base_color=obj && obj.base_color||'';
        this.hex_value=obj && obj.hex_value||'';
        this.createdby=obj && obj.createdby||0;
        this.created_date=obj && obj.created_date||'';
        this.updatedby=obj && obj.updatedby||0;
        this.updated_date=obj && obj.updated_date||'';
        this.IsSelected=obj && obj.IsSelected?true:false;
        this.SelectedIssue =obj && obj.SelectedIssue || [];
        this.SelectedParentIssue=obj && obj.SelectedParentIssue || [];
        this.SelectedRootCause=obj && obj.SelectedRootCause || [];
        this.SelectedLocation=obj && obj.SelectedLocation || [];
        this.ReferenceNo=obj && obj.ReferenceNo||'';
        this.files= obj && obj.files || [];
        this.Quantity=obj && obj.Quantity || 0;
    }
    fillIssue(){

    }
}

export class CountryStateCityColor{
    id:number;
    code:string;
    name:string;
    ParentID:number;
    CategoryCode:string;
    constructor()
    constructor(obj:CountryStateCityColor)
    constructor(obj?:any){
        this.id=obj && obj.id || 0;
        this.code=obj && obj.code ||'';
        this.name=obj && obj.name || '';
        this.ParentID=obj && obj.ParentID || 0;
        this.CategoryCode=obj && obj.CategoryCode ||'';
    }
}

export class file {
    type: string;
    url: string;
    order_id:number;
    attachmentid:number;
    constructor()
    constructor(_file: file)
    constructor(_file?: any) {
        this.type = _file && _file.type || '';
        this.url = _file && _file.url || '';
        this.order_id=_file && _file.detailid || 0;
        this.attachmentid=_file && _file.attachmentid || 0;
    }
  }