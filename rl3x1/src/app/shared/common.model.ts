export class Country {
    CountryID: number;
    CountryName: string;
    CountryCode: string;
}

export class State {
    StateID: number;
    StateName: string;
}

export class City {
    CityID: number;
    City: string;
}

export class Language {
    LanguageID: number;
    Name: string;
    Code: string;
    IsDefault: boolean;
}

export class Settings {
    static skin: string = 'assets/css/skins/darkblue.css';
    static color: any[] = [{
        themeprimary: '#2dc3e8',
        themesecondary: '#fb6e52',
        themethirdcolor: '#ffce55',
        themefourthcolor: '#a0d468',
        themefifthcolor: '#e75b8d'
    }];
    static rtl: boolean = false;
    static fixed: any[] = [{
        navbar: false,
        sidebar: false,
        breadcrumbs: false,
        header: false
    }]
    //Label:
};

export class Airport {
    AirportID: number;
    AirportName: string;
    AirportCode: string;
}

export class RepairCommand {
    RepairCommandID: number;
    RepairCommandName: string;
    RepairCommandCode: string;
}

export class Region {
    RegionID: number;
    RegionName: string;
    RegionCode: string;
}


export class OrganisationType {
    OrganisationTypeID: number;
    OrganisationType: string;
    OrganisationTypeCode: string;
}

export class CityCategory {
    CityCategoryID: number;
    CityCategoryName: string;
    CityCategoryCode: string;
}

export class TypeLookup {
    TypeLookUpID: number;
    TypeName: string;
    TypeCode: string;
    TypeGroup: string;
}

export class User {
    userName: string;
    password: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    admin: boolean;
    UserType: string;
    forgetUserName: string;

    constructor() {
        this.userName = "";
        this.password = "";
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.admin = false;
        this.UserType = '';
        this.forgetUserName = '';
    }
}

