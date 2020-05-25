export class ProductCatalogModel {
    MapId: number;
    ProductNo: number;
    ProductDescr: string;
    CatID: number;
    CatCd: string;
    GradeId: number;
    GradeCd: string;
    SubCatID: number;
    SubCatCd: string;
    SexCd: string;
    SKU: number;
    Weight: string;
    ProductSizeID: number;
    SizeCd: string;
    SizeDescr: string;
    ColorDescr: string;
    BaseColor: string;
    HexValue: string;
    ColorsID: number;
    IsActive: boolean;
    InValidReason: string;
    constructor(acc?: any) {
      this.ProductNo = acc && acc.ProductNo || 0 ;
      this.ProductDescr = acc && acc.ProductDescr || null ;
      this.CatCd = acc && acc.CatCd || null ;
      this.GradeCd = acc && acc.GradeCd || null ;
      this.SubCatCd = acc && acc.SubCatCd || null ;
      this.SexCd = acc && acc.SexCd || null ;
      this.SKU = acc && acc.SKU || null ;
      this.Weight = acc && acc.Weight || null ;
      this.SizeCd = acc && acc.SizeCd || null ;
      this.SizeDescr = acc && acc.SizeDescr || null ;
      this.ColorDescr = acc && acc.ColorDescr || null ;
      this.BaseColor = acc && acc.BaseColor || null ;
      this.HexValue = acc && acc.HexValue || null ;

    }
}


