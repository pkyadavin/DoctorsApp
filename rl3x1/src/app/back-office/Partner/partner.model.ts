
export class Partner {
    PartnerID: number;
    AirportID: number;
    PartnerCode: string;
    PartnerName: string;
    ContactName: string;
    host: String;
    portnumber: String;
    username: String;
    pass: String;
    SSLValue: String;
    MercahntKey: String;
    MercahntPassword: String;
    ContactNumber: string;
    Email: string;
    PartnerParentID: number;
    ParentPartnerName: string;
    ParentFacilityID: number;
    ParentFacilityName: string;
    PartnerTypeID: number;
    OrganisationTypeID: number;
    IsActive: boolean;
    PartnerAddresses: any;
    UserRoles: any;
    Users: any;
    OrgSubType: any;
    TeleCode: string;
    constructor();
    constructor(Partner: Partner)
    constructor(Partner?: any) {
        this.PartnerID = Partner && Partner.PartnerID || 0;
        this.AirportID = Partner && Partner.AirportID || undefined;
        this.PartnerCode = Partner && Partner.PartnerCode || '';
        this.PartnerName = Partner && Partner.PartnerName || '';
        this.ContactName = Partner && Partner.ContactName || '';
        this.ContactNumber = Partner && Partner.ContactNumber || '';
        this.Email = Partner && Partner.Email || '';
        this.PartnerParentID = Partner && Partner.PartnerParentID || undefined;
        this.ParentPartnerName = Partner && Partner.ParentPartnerName || '';
        this.ParentFacilityID = Partner && Partner.ParentFacilityID || undefined;
        this.ParentFacilityName = Partner && Partner.ParentFacilityName || '';
        this.PartnerTypeID = Partner && Partner.PartnerTypeID || undefined;
        this.OrganisationTypeID = Partner && Partner.OrganisationTypeID || undefined;
        this.IsActive = Partner && Partner.IsActive || false;
        this.PartnerAddresses = Partner && Partner.PartnerAddresses || [];
        this.UserRoles = Partner && Partner.UserRoles || [];
        this.Users = Partner && Partner.Users || [];
        this.OrgSubType = Partner && Partner.OrgSubType[0] || null;
        this.TeleCode = Partner && Partner.TeleCode || '';
        this.host = Partner && Partner.host || '';
        this.portnumber = Partner && Partner.portnumber || '';
        this.username = Partner && Partner.username || '';
        this.pass = Partner && Partner.pass || '';
        this.SSLValue = Partner && Partner.SSLValue || false;
    }
}

export class ConfigMap {
    PartnerConfigMapID: number;
    PartnerID: number;
    ConfigID: number;
    ConfigType: string;
    ConfigValue: string;
    Description: string;
    constructor();
    constructor(ConfigMap: ConfigMap)
    constructor(ConfigMap?: any) {
        this.PartnerID = ConfigMap && ConfigMap.PartnerID || 0;
        this.ConfigID = ConfigMap && ConfigMap.ConfigID || 0;
        this.ConfigType = ConfigMap && ConfigMap.ConfigType || '';
        this.ConfigValue = ConfigMap && ConfigMap.ConfigValue || '';
        this.Description = ConfigMap && ConfigMap.Description || '';
    }
}

export class PartnerAddress {
    RowNumber: number;
    PartnerAddressMapID: number;
    PartnerID: number;
    AddressTypeID: number;
    Description: string;
    TypeName: string;
    AddressID: number;
    Address1: string;
    Address2: string;
    City: string;
    CountryID: number;
    StateID: number;
    ZipCode: string;
    FixedLineNumber: string;
    CellNumber: string;
    CreatedBy: string;
    CreatedDate: Date;
    ModifyBy: string;
    ModifyDate: Date;
    IsActive: boolean;
    CreatedByName: string;
    ModifyByName: string;
    CreatedByID: number;
    ModifyByID: number;
}

export class UserRole {
    UserID: number;
    RoleID: number;
}
