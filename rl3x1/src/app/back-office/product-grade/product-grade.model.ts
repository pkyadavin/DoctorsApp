export class ProductGradeModel {
    GradeId: number;
    GradeCd: string;
    Description: string;
    IsActive: boolean;
    UserID: number;
    CreatedBy:string;
    CreatedDate:string;
    ModifiedBy:string;
    ModifiedDate:string;
    constructor()
    constructor(obj:ProductGradeModel)
    constructor(obj?:any){
        this.GradeId=obj && obj.GradeId||0;
        this.GradeCd=obj && obj.GradeCd||'';
        this.Description=obj && obj.Description||'';
        this.IsActive=obj && obj.IsActive||true;
        this.UserID=obj && obj.UserID||0;
    }
 }