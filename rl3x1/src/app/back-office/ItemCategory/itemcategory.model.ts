export class Itemcategory {
    ItemCategoryID: number;
    CategoryCode: string = null;
    CategoryName: string = null;
    IsActive: boolean = false;
    ParentCategoryID: number;
    CreatedBy: string;
    CreatedDate: Date;
    ModifyBy: string;
    ModifyDate: Date;
}