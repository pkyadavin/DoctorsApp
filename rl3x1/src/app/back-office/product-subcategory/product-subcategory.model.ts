export class ProductSubCategoryModel {
    SubCatID: number;
    SubCatCd: string;
    CategoryCode:string;
    Description: string;
    IsActive: boolean;
    UserID: number;
    CreatedBy:string;
    CreatedDate:string;
    ModifiedBy:string;
    ModifiedDate:string;
    constructor()
    constructor(obj:ProductSubCategoryModel)
    constructor(obj?:any){
        this.SubCatID=obj && obj.SubCatID ||0;
        this.SubCatCd=obj && obj.SubCatCd ||'';
        this.CategoryCode=obj && obj.CategoryCode ||'';
        this.Description=obj && obj.Description ||'';
        this.IsActive=obj && obj.IsActive ||true;
        this.UserID=obj && obj.UserID ||0;
    }
 }