export class Tenant {
    ID: number;
    TenantID: number;
    TenantName: string;
    TenantCode: string;
    EmailId: string;
    Domain: string;
    DBServer: string;
    DBUserName: string;
    DBPassword: string;
    DBServerName: string;
    LogoUrl: string;
    CurrencyID: number;
    IsCallCenterSupport: string;
    Comment: string;
    IsTenantSignOff: boolean;
    ActionAllowed: boolean;
    ClaimType: string;
    IsPaymentReceive: string;  
    Status: string;   
    IsInvoiceGeneration: boolean;
    IsActivated:boolean;

    constructor(Tenant: Tenant)
    constructor(Tenant?: any) {
        this.ID = Tenant && Tenant.TenantID || 0;
        this.TenantID = Tenant && Tenant.TenantID || 0;
        this.TenantName = Tenant && Tenant.TenantName || '';
        this.TenantCode = Tenant && Tenant.TenantCode || '';
        this.EmailId = Tenant && Tenant.EmailId || '';
        this.Domain = Tenant && Tenant.Domain || '';
        this.DBServer = Tenant && Tenant.DBServer || '';
        this.DBUserName = Tenant && Tenant.DBUserName || '';
        this.DBPassword = Tenant && Tenant.DBPassword || '';
        this.DBServerName = Tenant && Tenant.DBServerName || '';
        this.LogoUrl = Tenant && Tenant.LogoUrl || '';
        this.CurrencyID = Tenant && Tenant.CurrencyID || 0;
        this.Comment = Tenant && Tenant.Comment || null;
        this.IsTenantSignOff = Tenant && Tenant.IsTenantSignOff || false;
        this.ActionAllowed = Tenant && Tenant.IsTenantSignOff == null ? true : false;
        this.ClaimType = Tenant && Tenant.ClaimType || '';
        this.Status = Tenant && Tenant.Status || '';
        this.IsInvoiceGeneration = Tenant && Tenant.IsInvoiceGeneration || false;
        this.IsActivated = Tenant && Tenant.IsActivated || false;
    }
}
