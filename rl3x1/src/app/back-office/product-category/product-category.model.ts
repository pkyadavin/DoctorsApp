export class ProductCategoryModel {
    CatID: number;
    CatCd: string;
    CategoryCode:string;
    Description: string;
    IsActive: boolean;
    UserID: number;
    CreatedBy:string;
    CreatedDate:string;
    ModifiedBy:string;
    ModifiedDate:string;
    constructor()
    constructor(obj:ProductCategoryModel)
    constructor(obj?:any){
        this.CatID=obj && obj.CatID||0;
        this.CatCd=obj && obj.CatCd||'';
        this.CategoryCode=obj && obj.CategoryCode||'';
        this.Description=obj && obj.Description||'';
        this.IsActive=obj && obj.IsActive||true;
        this.UserID=obj && obj.UserID||0;
    }
    
}