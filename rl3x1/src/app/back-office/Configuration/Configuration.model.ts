export class ConfigurationModel {
  PartnerID: number;
  AirportID: number;
  PartnerCode: string;
  PartnerName: string;
  ContactName: string;
  ReturnReason: String;
  Banner: String;
  Logo: String;
  HomePageNavigationURL: string;
  ContactPageNavigationURL: string;
  returnPolicyNavigationURL: string;
  maxParcels: Number;
  FAQ: String;
  FAQ_Language: string;

  host: String;
  portnumber: String;
  username: String;
  pass: String;
  SSLValue: String;

  MercahntKey: String;
  MercahntPassword: String;

  ContactNumber: string;
  Email: string;
  ERPNumber: string;
  RegionID: number;
  PartnerParentID: number;
  ParentPartnerName: string;
  ParentFacilityID: number;
  ParentFacilityName: string;
  PartnerTypeID: number;
  InvoiceStoreCode: string;
  PaymentApproval: boolean;
  RepairCommandID: number;
  RepairLocationID: number;
  RepairNodeID: number;
  CityCategoryID: number;
  FacilityAddressonInvoice: boolean;
  OrganisationTypeID: number;
  IsActive: boolean;
  ConfigMaps: any;
  PartnerAddresses: any;
  UserRoles: any;
  Users: any;
  AccountReasons: any;
  SeasonalConfig: any;
  SponsonshipConfig: any;
  AccountReasonRules: any;
  FacilityMap: any;
  HubPartnerMap: any;
  OrgionAddressList: any;
  DestinationAddressList: any;
  PartnerODList: any;
  PartnerLaneList: any;
  OrgSubType: any;
  TeleCode: string;
  ReturnReasonType: number;

  locateserialnumberURL: any;
  supportassistanceURL: any;
  trademarkURL: any;
  safetywarningURL: any;
  cookiesPolicyURL: any;
  declarationconformityURL: any;
  commercialDeclarationURL: any;
  privacyPolicyURL: any;

  constructor();
  constructor(Partner: ConfigurationModel)
  constructor(Partner?: any) {
      this.PartnerID = Partner && Partner.PartnerID || 0;
      this.AirportID = Partner && Partner.AirportID || undefined;
      this.PartnerCode = Partner && Partner.PartnerCode || '';
      this.PartnerName = Partner && Partner.PartnerName || '';
      this.ContactName = Partner && Partner.ContactName || '';
      this.ContactNumber = Partner && Partner.ContactNumber || '';
      this.Email = Partner && Partner.Email || '';
      this.ERPNumber = Partner && Partner.ERPNumber || '';
      this.InvoiceStoreCode = Partner && Partner.InvoiceStoreCode || '';
      this.RegionID = Partner && Partner.RegionID || undefined;
      this.PartnerParentID = Partner && Partner.PartnerParentID || undefined;
      this.ParentPartnerName = Partner && Partner.ParentPartnerName || '';
      this.ParentFacilityID = Partner && Partner.ParentFacilityID || undefined;
      this.ParentFacilityName = Partner && Partner.ParentFacilityName || '';
      this.PartnerTypeID = Partner && Partner.PartnerTypeID || undefined;
      this.RepairCommandID = Partner && Partner.RepairCommandID || undefined;
      this.CityCategoryID = Partner && Partner.CityCategoryID || undefined;
      this.OrganisationTypeID = Partner && Partner.OrganisationTypeID || undefined;
      this.FacilityAddressonInvoice = Partner && Partner.FacilityAddressonInvoice || false;
      this.PaymentApproval = Partner && Partner.PaymentApproval || false;
      this.IsActive = Partner && Partner.IsActive || false;
      this.ConfigMaps = Partner && Partner.ConfigMaps || [];
      this.PartnerAddresses = Partner && Partner.PartnerAddresses || [];
      this.UserRoles = Partner && Partner.UserRoles || [];
      this.Users = Partner && Partner.Users || [];
      this.AccountReasons = Partner && Partner.AccountReasons || [];
      this.AccountReasonRules = Partner && Partner.AccountReasons || [];
      this.FacilityMap = Partner && Partner.FacilityMap || [];

      this.OrgionAddressList = Partner && Partner.OrgionAddressList || [];
      this.DestinationAddressList = Partner && Partner.DestinationAddressList || [];
      this.PartnerODList = Partner && Partner.PartnerODList || [];
      this.PartnerLaneList = Partner && Partner.PartnerLaneList || [];
      this.OrgSubType = Partner && Partner.OrgSubType[0] || null;
      this.TeleCode = Partner && Partner.TeleCode || '';

      this.ReturnReason = Partner && Partner.ReturnReason || '';
      this.Logo = Partner && Partner.Logo || null;
      this.Banner = Partner && Partner.Banner || null;
      this.maxParcels = Partner && Partner.maxParcels || 2;
      this.host = Partner && Partner.host || '';
      this.portnumber = Partner && Partner.portnumber || '';
      this.username = Partner && Partner.username || '';
      this.pass = Partner && Partner.pass || '';
      this.SSLValue = Partner && Partner.SSLValue || false;

      this.SeasonalConfig = Partner && Partner.SeasonalConfig || [];

      this.locateserialnumberURL = Partner && Partner.locateserialnumberURL || '';
      this.supportassistanceURL = Partner && Partner.supportassistanceURL || '';
      this.trademarkURL = Partner && Partner.trademarkURL || '';
      this.safetywarningURL = Partner && Partner.safetywarningURL || '';
      this.cookiesPolicyURL = Partner && Partner.cookiesPolicyURL || '';
      this.declarationconformityURL = Partner && Partner.declarationconformityURL || '';
      this.commercialDeclarationURL = Partner && Partner.commercialDeclarationURL || '';
      this.privacyPolicyURL = Partner && Partner.privacyPolicyURL || '';
  }

}
