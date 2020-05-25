import { environment } from '../../environments/environment';
export class ErrorConstants {    
    public static get ADMINPORTALBASEURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/manage/"; }
    public static get CPORTALBASEURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/portal/"; }
    public static get BASEURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/"; }
    public static get BASEAPIURL(): string { return environment.scheme+"://"+environment.alias+"."+environment.host+"/"; }
    public static get BASEAPIURLForCarrier(): string { return environment.scheme+"://"+environment.logistics; }
    public static errortest:string ='test mesage';
    // public static get ADMINPORTALBASEURL(): string { return "http://localhost:3000/manage/"; }
    // public static get CPORTALBASEURL(): string { return "http://localhost:3000/portal/"; }
    // public static get BASEURL(): string { return "http://localhost:3000/"; }
    // public static get BASEAPIURL(): string { return "http://localhost:3000/"; }
    // public static get BASEAPIURLForCarrier(): string { return environment.scheme+"://"+environment.logistics; }
}
