export class registrationfulldata {
    registrationsteps: registrationsteps;
}
export class TenantLoginModel {
    username: string;
    password: string;
    isRememberOn: boolean;
}
export class ContactUsModel {
    AskingRequestADemo: boolean;
    CompanyName: string;
    Name: string;
    EmailId: string;
    Country: string;
    Mobile: string;
    Message: string;
    RequestType: string;
}
export class registrationsteps {
    tenantdata: tenantdata;
    itemtypes: itemtypes;
    orderselection: orderselection;
    globalconfigrations: globalconfigrations;
    facilities: facilities;
    partner: partner;
    //node: node;
    nodes: any;
    status: any;
    locationstructure: any;
    workflow: workflow;
}
export class tenantdata {
    companyname: string;
    countryname: string;
    domainname: string;
    consumerdomain: string;
    prefix: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    zipcode: string;
    validfrom: string;
    validto: string;
    noofusers: string;
    logourl: string;
    claimtype: string = 'PRO';
    confirmemail: string;
    statename: string;
    confirmpassword: string;
    domain: string;
    cdomain: string;
    isdomainvalid: string;
    iscdomainvalid: string;
    currency: string;
    IsHaveCallCenter: string = '';
    features: string = '';
    nameoncard: string;
    cardnumber: string;
    cardexpiry: string;
    cvvnumber: string;  
    IsUserActivated: boolean;

    constructor()
    constructor(tenantdata: tenantdata)
    constructor(tenantdata?: any) {

        this.companyname = tenantdata && tenantdata.companyname.trim() || '';
        this.domainname = tenantdata && tenantdata.domainname.trim() || '';
        //this.domain = tenantdata && tenantdata.domainname || '';
        this.consumerdomain = tenantdata && tenantdata.consumerdomain.trim() || '';
        //this.cdomain = tenantdata && tenantdata.consumerdomain || '';
        this.prefix = tenantdata && tenantdata.prefix.trim() || '';
        this.firstname = tenantdata && tenantdata.firstname.trim() || '';
        this.lastname = tenantdata && tenantdata.lastname.trim() || '';
        this.username = tenantdata && tenantdata.username.trim() || '';
        this.password = tenantdata && tenantdata.password.trim() || '';
        this.email = tenantdata && tenantdata.email.trim() || '';
        this.phone = tenantdata && tenantdata.phone.trim() || '';
        this.country = tenantdata && tenantdata.country.trim() || '';
        this.state = tenantdata && tenantdata.state.trim() || '';
        this.city = tenantdata && tenantdata.city.trim() || '';
        this.address1 = tenantdata && tenantdata.address1.trim() || '';
        this.address2 = tenantdata && tenantdata.address2.trim() || '';
        this.zipcode = tenantdata && tenantdata.zipcode.trim() || '';
        this.validfrom = tenantdata && tenantdata.validfrom || '';
        this.validto = tenantdata && tenantdata.validto || '';
        this.noofusers = tenantdata && tenantdata.noofusers || '';
        this.logourl = tenantdata && tenantdata.logourl.trim() || '';
        this.claimtype = tenantdata && tenantdata.claimtype.trim() || 'pro';
        this.currency = tenantdata && tenantdata.currency.trim() || '';
        //this.confirmemail = tenantdata && tenantdata.confirmemail || tenantdata && tenantdata.email ;
        //this.statename = tenantdata && tenantdata.statename || '';
        //this.confirmpassword = tenantdata && tenantdata.confirmpassword || tenantdata && tenantdata.password;
        //this.domain = tenantdata && tenantdata.domain || '';
        //this.cdomain = tenantdata && tenantdata.cdomain || '';
        //this.isdomainvalid = tenantdata && tenantdata.isdomainvalid || '';
        //this.iscdomainvalid = tenantdata && tenantdata.iscdomainvalid || '';
        this.features = tenantdata && tenantdata.features.trim() || '';
        this.nameoncard = tenantdata && tenantdata.nameoncard.trim() || '';
        this.cardnumber = tenantdata && tenantdata.cardnumber.trim() || '';
        this.cardexpiry = tenantdata && tenantdata.cardexpiry.trim() || '';
        this.cvvnumber = tenantdata && tenantdata.cvvnumber.trim() || '';
        this.IsUserActivated = tenantdata && tenantdata.IsUserActivated || false;
    }
}

export class Tenantrawdata {
    companyname: string;
    countryname: string;
    domainname: string;
    consumerdomain: string;
    prefix: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    zipcode: string;
    validfrom: string;
    validto: string;
    noofusers: string;
    logourl: string;
    claimtype: string = 'PRO';
    confirmemail: string;
    statename: string;
    confirmpassword: string;
    domain: string;
    cdomain: string;
    isdomainvalid: string;
    iscdomainvalid: string;
    currency: string;
    currencyID: number;
    IsHaveCallCenter: string = '';
    features: string;
    nameoncard: string;
    cardnumber: string;
    cardexpiry: string;
    cvvnumber: string; 
    IsUserActivated: boolean; 

    constructor()
    constructor(tenantdata: tenantdata)
    constructor(tenantdata?: any) {
        
        this.companyname = tenantdata && tenantdata.companyname || '';
        //this.countryname = tenantdata && tenantdata.countryname.trim ||  '';        
        this.domainname = tenantdata && tenantdata.domainname || '';
        this.domain = tenantdata && tenantdata.domainname ||  '';
        this.consumerdomain = tenantdata && tenantdata.consumerdomain ||  '';
        this.cdomain = tenantdata && tenantdata.consumerdomain ||  '';
        this.prefix = tenantdata && tenantdata.prefix ||  '';
        this.firstname = tenantdata && tenantdata.firstname ||  '';
        this.lastname = tenantdata && tenantdata.lastname ||  '';
        this.username = tenantdata && tenantdata.username ||  '';
        this.password = tenantdata && tenantdata.password ||  '';
        this.email = tenantdata && tenantdata.email ||  '';
        this.phone = tenantdata && tenantdata.phone ||  '';
        this.country = tenantdata && tenantdata.country ||  '';
        this.state = tenantdata && tenantdata.state ||  '';
        this.city = tenantdata && tenantdata.city ||  '';
        this.address1 = tenantdata && tenantdata.address1 ||  '';
        this.address2 = tenantdata && tenantdata.address2 ||  '';
        this.zipcode = tenantdata && tenantdata.zipcode ||  '';
        this.validfrom = tenantdata && tenantdata.validfrom ||  '';
        this.validto = tenantdata && tenantdata.validto ||  '';
        this.noofusers = tenantdata && tenantdata.noofusers ||  '';
        this.logourl = tenantdata && tenantdata.logourl ||  '';
        this.claimtype = tenantdata && tenantdata.claimtype ||  'pro';
        this.confirmemail = tenantdata && tenantdata.confirmemail || tenantdata && tenantdata.email;
        //this.statename = tenantdata && tenantdata.statename.trim() ||  '';
        this.confirmpassword = tenantdata && tenantdata.confirmpassword || tenantdata && tenantdata.password;
        //this.domain = tenantdata && tenantdata.domain.trim() ||  '';
        //this.cdomain = tenantdata && tenantdata.cdomain.trim() ||  '';
        this.isdomainvalid = tenantdata && tenantdata.isdomainvalid ||  '';
        this.iscdomainvalid = tenantdata && tenantdata.iscdomainvalid ||  '';
        this.currency = tenantdata && tenantdata.currency ||  '';
        this.currencyID = tenantdata && tenantdata.currencyID || 0;
        this.features = tenantdata && tenantdata.features ||  '';
        this.nameoncard = tenantdata && tenantdata.nameoncard ||  '';
        this.cardnumber = tenantdata && tenantdata.cardnumber ||  '';
        this.cardexpiry = tenantdata && tenantdata.cardexpiry ||  '';
        this.cvvnumber = tenantdata && tenantdata.cvvnumber || ''; 
        this.IsUserActivated = tenantdata && tenantdata.IsUserActivated || false;  
    }
}

export class FTPDetails {
    FTP: string;
    FTPUser: string;
    FTPPassword: string;
    UpdateToCustomer: boolean = false;   

    constructor()
    constructor(FTPDetails: FTPDetails)
    constructor(FTPDetails?: any) {
        this.FTP = FTPDetails && FTPDetails.FTP || '';
        this.FTPUser = FTPDetails && FTPDetails.FTPUser || '';
        this.FTPPassword = FTPDetails && FTPDetails.FTPPassword || '';
        this.UpdateToCustomer = FTPDetails && FTPDetails.UpdateToCustomer || false;
    }
}

export class itemtypes {
    itemtype: itemtype;
    isserialnumber: string = '';
    specialidentifer: specialidentifer;
}
export class itemtype {
    itemtype: any;
    isSerialnumber: number;
}
export class orderselection {
    INO001: any;
    OTO001: any;
    MTO001: any;
    ADO001: any;
}
export class globalconfigrations {
    currencies: any[];
    timezone: any[];
    language: any[];
}
export class facilities {
    defaultfacilities: any;
    customfacilities: any;
}
export class partner {
    partnertypes: any;
    custompartnertypes: any;
}
export class workflow {
    intask: any;
    outtask: any;
    repairtask: any;

}


export class country {
    countryID: number;
    countrycode: string;
    countrycame: string;
    regionname: string;
    currencycode: string;
    currencysymbol: string;
}
export class state {
    stateID: number;
    statename: string;
    countryID: number;
}
export class typelookup {
    typelookupID: number;
    typecode: number;
    typename: string;
    typegroup: string;
    description: string;

}
export class orderlist {
    orderlistID: number;
    orderlistCode: string;
    ordername: string;
    orderdescription: string;
    parentorderlistID: number;
}
export class Region {
    RegionID: number;
    RegionCode: string;
    RegionName: string;
    Description: string;
    IsActive: boolean;
    currencyID: number;
    languageID: number;
    creativedate: Date;
    ModifyDate: Date;
    CreatedBy: string;
    ModifyBy: string;
    CostCode: any;
    BillingCode: any;
    Gateways: any;
    ConfigMap: any;
}

export class specialidentifer {
    value: string = "";
    otheridentifer: string = "";
}
export class adminconfigsetup {
    adminconfigsetupID: number;
    sectioncode: string;
    sectionkey: string;
    sectionkeyvalue: string;
    sortorder: number;
}
export class currency {
    currencyID: number;
    currencycode: string;
    currencyname: string;
    currencysymbol: string;
    country: string;
}
export class node {
    id: number;
    node: string;
    description: string;
    isactive: number;
}
export class timezone {
    timezoneId: number;
    timezonename: string;
    timezonedescription: string;
    constructor()
    constructor(timezone: timezone)
    constructor(timezone?: any) {
        this.timezoneId = timezone && timezone.timezoneId || 145;
        this.timezonename = timezone && timezone.timezonename || 'Coordinated Universal Time';
        this.timezonedescription = timezone && timezone.timezonedescription || '(UTC) Coordinated Universal Time';
    }
}
export class language {
    languageID: number;
    name: string;
    code: string;
    isactive: number;

}