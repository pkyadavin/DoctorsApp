export class User {
    UserID: number;
    TenantID: number;
    Initials: string;
    UserImage: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    ImageURL: string;
    IsOnline: boolean;
    DisplayDate: string;
    CellNumber: string;
    UserName: string;
    Password: string;
    PasswordConfirmation: string;
    UserType: string;
    Address1: string;
    Address2: string;
    City: string;
    StateID: string;
    ZipCode: string
    FixedLineNumber: string;
    UserTheme: string;
    CountryID: string;
    RoleID: number;
    PartnerID: number;
    LanguageID: number;
    LanguageName: string;
    brands:any;
    UserRoles: any;
    partners:any;
    TeleCode: string;
    Scope: string;
    Action: string;   
    FailedLoginAttempt: number;
    IsActive:Boolean;
    IsFailedLoginLock: Boolean;
    ActualPassword:string;
    
    constructor();
    constructor(User: User)
    constructor(User?: any) {
        this.UserID = User && User.UserID || 0;
        this.TenantID = User && User.TenantID || 0;
        this.Initials = User && User.Initials || undefined;
        this.UserImage = User && User.UserImage || '/Assets/img/default.png';
        this.FirstName = User && User.FirstName || '';
        this.MiddleName = User && User.MiddleName || '';
        this.LastName = User && User.LastName || '';
        this.Email = User && User.Email || '';
        this.CellNumber = User && User.CellNumber || '';
        this.UserName = User && User.UserName || '';
        this.Password = User && User.Password || '';
        this.PasswordConfirmation = User && User.PasswordConfirmation || '';
        this.UserType = User && User.UserType || '';
        this.Address1 = User && User.Address1 || '';
        this.Address2 = User && User.Address2 || '';
        this.City = User && User.City || '';
        this.StateID = User && User.StateID || undefined;
        this.ZipCode = User && User.ZipCode || '';
        this.FixedLineNumber = User && User.FixedLineNumber || '';
        this.UserTheme = User && User.UserTheme || '';
        this.CountryID = User && User.CountryID || undefined;
        this.FixedLineNumber = User && User.FixedLineNumber || '';
        this.FixedLineNumber = User && User.FixedLineNumber || '';
        this.RoleID = User && User.RoleID || 0;
        this.PartnerID = User && User.PartnerID || 0;
        this.LanguageID = User && User.LanguageID || undefined;
        this.brands = User && User.brands || [];     
        this.UserRoles = User && User.UserRoles || [];
        this.partners = User && User.partners || [];
        this.TeleCode = User && User.TeleCode || '';
        this.Scope = User && User.Scope || 'PTR001';
        this.Action = User && User.Action || '';     
        this.FailedLoginAttempt = User && User.FailedLoginAttempt || 0;   
        this.IsActive = User && User.IsActive || true;   
        this.IsFailedLoginLock = User && User.IsFailedLoginLock || false;   
        this.ActualPassword = User && User.ActualPassword || ''; 
    }
}

export class brand{
    PartnerID: number;
    PartnerName: string;
    constructor();
    constructor(brand: brand)
    constructor(brand?: any)
    {
        this.PartnerID = brand && brand.PartnerID || 0;   
        this.PartnerName = brand && brand.PartnerName || '';   
    }
}




       