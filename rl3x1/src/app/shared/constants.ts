import { environment } from '../../environments/environment';
export class ConfigurationConstants {    
    // public static get ADMINPORTALBASEURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/manage/"; }
    // public static get CPORTALBASEURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/portal/"; }
    // public static get BASEURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/"; }
    // public static get BASEAPIURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/"; }
    // public static get BASEAPIURLForCarrier(): string { return environment.scheme+"://"+environment.logistics; }

    public static get ADMINPORTALBASEURL(): string { return "http://localhost:3000/manage/"; }
    public static get CPORTALBASEURL(): string { return "http://localhost:3000/portal/"; }
    public static get BASEURL(): string { return "http://localhost:3000/"; }
    public static get BASEAPIURL(): string { return "http://localhost:3000/"; }
    public static get BASEAPIURLForCarrier(): string { return environment.scheme+"://"+environment.logistics; }
}
export class CommonConstants
{
    //static readonly CityCategory = "CityCategory";
}

export enum eTypeLookup
{
    AddressType = <any>"AddressType",
    CityCategory = <any>"CityCategory",
    SponsorshipType = <any>"SponsorshipType",
    OrganizationType = <any>"OrganizationType"    
}

export class validateField{
    public static get mobNumberPattern (): string { return "^((\\+91-?)|0)?[0-9]{10}$"; }
    
}