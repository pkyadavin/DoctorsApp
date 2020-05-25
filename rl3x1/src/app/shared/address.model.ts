import {PartnerAddress} from '../back-office/Partner/partner.model'
export class Address {
    RowNumber: number;
    AddressID: number;
    Address1: string="";
    Address2: string="";
    City: string="";
    CountryID: number;
    StateID: number;
    ZipCode: string="";
    FixedLineNumber: string="";
    CellNumber: string="";
    Createdby: string="";
    CreatedDate: string="";
    ModifyBy: string="";
    ModifyDate: string="";
    IsActive: boolean=false;
    AddressTypeID: number;
    TypeName: string="";
    Description: string="";

    PostType: string="";
    ParentFormName: string="";
    StateName: string="";
    CountryName: string="";
    // Country:Country;
    // State:any;

    constructor();
    constructor(Address: Address)
    constructor(Address: PartnerAddress)
    constructor(Address?: any)
    {
        this.RowNumber = Address && Address.RowNumber || 0;
        this.AddressID = Address && Address.AddressID || undefined;
        this.Address1 = Address && Address.Address1 || '';
        this.Address2 = Address && Address.Address2 || '';
        this.City = Address && Address.City || '';
        this.CountryID = Address && Address.CountryID || undefined;
        this.StateID = Address && Address.StateID || null;

        this.ZipCode = Address && Address.ZipCode || undefined;
        this.FixedLineNumber = Address && Address.FixedLineNumber || undefined;
        this.CellNumber = Address && Address.CellNumber || undefined;
        this.Createdby = Address && Address.Createdby || undefined;
        this.CreatedDate = Address && Address.CreatedDate || undefined;
        this.ModifyBy = Address && Address.ModifyBy || undefined;
        this.ModifyDate = Address && Address.ModifyDate || undefined;
        this.IsActive = Address && Address.IsActive || false;

        this.AddressTypeID = Address && Address.AddressTypeID || undefined;
        this.TypeName = Address && Address.TypeName || undefined;
        this.Description = Address && Address.Description || undefined;
        this.PostType = Address && Address.PostType || 'insert';
        this.ParentFormName = Address && Address.ParentFormName || 'partner';
        this.StateName = Address && Address.StateName || undefined;
        this.CountryName = Address && Address.CountryName || undefined;

        // this.Country = Address && new Country(Address.Country) || null;
        // this.State = Address && Address.State || null;

    }
}
export class AddressInput {
    MaptableName: string = "";
    MapTableColumn: string = "";
    MapColumnValue: string = "";
}

