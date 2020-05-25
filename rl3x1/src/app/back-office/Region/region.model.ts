
export class Region {
    RegionID: number;
    RegionCode: string;
    RegionName: string;
    Description: string;
    IsActive: boolean;
    CurrencyID: number;
    LanguageID: number;
    TimeZoneID: number;
    CreativeDate: Date;
    ModifyDate: Date;
    CreatedBy: string;
    ModifyBy: string;
    Gateways:any;
    // CostCode: any;
    // BillingCode: any;
    // Gateways: any;
    // ConfigMap: any;
    DateTimeFormat: string;
    PhoneMask: string;
    //Areas: Array<Area>;

    constructor();
    constructor(Region: Region)
    constructor(Region?: any) {
        this.RegionID = Region && Region.RegionID || 0;
        this.RegionCode = Region && Region.RegionCode || 'AUTO';
        this.RegionName = Region && Region.RegionName || '';
        this.Description = Region && Region.Description || '';
        this.Gateways = Region && Region.Gateways || null;
        //  this.TimeZoneID = Region && Region.TimeZoneID || 'undefined';
        //  this.IsActive = Region && Region.IsActive || true;
        this.CreativeDate = Region && Region.RegionID || new Date().getUTCDate;
        this.ModifyDate = Region && Region.ModifyDate || new Date().getUTCDate;
        this.CreatedBy = Region && Region.CreatedBy || 0;
        this.ModifyBy = Region && Region.ModifyBy || 0;
        // this.CostCode = Region && Region.CostCode || [];
        // this.BillingCode = Region && Region.BillingCode || [];
        // this.ConfigMap = Region && Region.ConfigMap || [];
        // this.Areas = Region && Region.Areas || new Array<Area>();
    }
}

export class Area {
    RegionAreaCodeMapID: number;
    TransactionID: number;
    RegionID: number;
    AreaCodeID: number;
    CityID: number;
    City: string;
    AreaCode: string;
    constructor();
    constructor(Area: Area)
    constructor(Area?: any) {
        this.RegionAreaCodeMapID = Area && Area.RegionAreaCodeMapID || 0;
        this.TransactionID = Area && Area.TransactionID || +new Date();
        this.RegionID = Area && Area.RegionID || 0;
        this.AreaCodeID = Area && Area.AreaCodeID || 0;
        this.CityID = Area && Area.CityID || 0;
        this.City = Area && Area.City || '';
        this.AreaCode = Area && Area.AreaCode || '';

    }
}

export class CountryModel {
    CountryID: number;
    CountryName: string;
    CountryCode: string;
    CurrencyCode: string;
    CurrencySymbol: string;
    DollarExchangeRate: number;
    RegionID: number;
    RegionName: string;
    TeleCode: string;

    constructor();
    constructor(Country: CountryModel)
    constructor(Country?: any) {
        this.CountryID = Country && Country.CountryID || 0;
        this.CountryName = Country && Country.CountryName || '';
        this.CountryCode = Country && Country.CountryCode || '';
        this.CurrencyCode = Country && Country.CurrencyCode || '';
        this.CurrencySymbol = Country && Country.CurrencySymbol || '';
        this.RegionID = Country && Country.RegionID || 0;
        this.RegionName = Country && Country.RegionName || '';
        this.TeleCode = Country && Country.TeleCode || '';
    }
}

export class PopupCountryModel {
    CountryID: number;
    CountryName: string;
    CountryCode: string;
    CurrencyCode: string;
    CurrencySymbol: string;
    DollarExchangeRate: number;
    RegionID: number;
    RegionName: string;
    TeleCode: string;
    IsSelected: boolean;
}

export class TypeGroupModel {
    TypeLookUpID: number;
    TypeCode: string;
    TypeName: string;
    Description: string;
    TypeGroup: string;
    constructor();
    constructor(tg: TypeGroupModel)
    constructor(tg?: any) {
        this.TypeLookUpID = tg && tg.TypeLookUpID || 0;
        this.TypeCode = tg && tg.TypeCode || '';
        this.TypeName = tg && tg.TypeName || '';
        this.Description = tg && tg.Description || '';
        this.TypeGroup = tg && tg.TypeGroup || '';
    }
}
export class SaveGroupModel {
    TypeLookUpID: number;
    TypeCode: string;
    TypeName: string;
    Description: string;
    TypeGroup: string;
    constructor();
    constructor(sg: SaveGroupModel)
    constructor(sg?: any) {
        this.TypeLookUpID = sg && sg.TypeLookUpID || 0;
        this.TypeCode = sg && sg.TypeCode || '';
        this.TypeName = sg && sg.TypeName || '';
        this.Description = sg && sg.Description || '';
        this.TypeGroup = sg && sg.TypeGroup || '';
    }
}
