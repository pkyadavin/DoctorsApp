export class ProductGroupingModel {
    GroupId: number;
    CatId:number;
    CatCd: string;
    CatDesc:string;
    SubCatId:number;
    SubCatCd:string;
    SubCatDesc:string;
    GradeId:number;
    GradeCd:string;
    GradeDesc:string;
    IsActive: boolean;
    UserID: number;
    CreatedBy:string;
    CreatedDate:string;
    ModifiedBy:string;
    ModifiedDate:string;
    tempid:number;
    constructor()
    constructor(obj:ProductGroupingModel)
    constructor(obj?:any){
        this.GroupId = obj && parseInt(obj.GroupId) || 0;
        this.CatId = obj && parseInt(obj.CatId) || 0;
        this.CatCd = obj && obj.CatCd || '';
        this.CatDesc = obj && obj.CatDesc || '';
        this.SubCatId = obj && parseInt(obj.SubCatId) || 0;
        this.SubCatCd = obj && obj.SubCatCd || '';
        this.SubCatDesc = obj && obj.SubCatDesc || '';
        this.GradeId = obj && parseInt(obj.GradeId) || 0;
        this.GradeCd = obj && obj.GradeCd || '';
        this.GradeDesc = obj && obj.GradeDesc || '';
        this.IsActive = obj && obj.IsActive || true;
        this.tempid = obj && obj.tempid || 0;
    }


 }