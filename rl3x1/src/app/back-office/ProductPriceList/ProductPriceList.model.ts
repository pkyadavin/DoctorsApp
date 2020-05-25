export class ProductPriceListModel {
    MapId: number;
    ProductNo: number;
    PriceListCd: string;
    PriceListDescr: string;
    CrncyCd: string;
    RegionID: number;
    MacroRegionCd: string;
    Price: number;
    SuggRetail: number;
    CostPrice: number;
    ProductDescr: string;
    SeasonID: number;
    PrimSeasonCd: string;
    GradeId: number;
    GradeCd: string;
    CatID: number;
    CatCd: string;
    IsActive: boolean;
    InValidReason: string;

    constructor(acc?: any) {
      this.ProductNo = acc && acc.ProductNo || 0 ;
      this.PriceListCd = acc && acc.PriceListCd || null ;
      this.PriceListDescr = acc && acc.PriceListDescr || null ;
      this.CrncyCd = acc && acc.CrncyCd || null ;
      this.MacroRegionCd = acc && acc.MacroRegionCd || null ;
      this.Price = acc && acc.Price || 0 ;
      this.SuggRetail = acc && acc.SuggRetail || 0 ;
      this.CostPrice = acc && acc.CostPrice || 0 ;
      this.ProductDescr = acc && acc.ProductDescr || null ;
      this.PrimSeasonCd = acc && acc.PrimSeasonCd || null ;
      this.GradeCd = acc && acc.GradeCd || null ;
      this.CatCd = acc && acc.CatCd || null ;
    }
}
