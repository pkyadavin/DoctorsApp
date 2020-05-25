export class Metadata {
    TypeLookUpID: number;
    TypeCode: string;
    TypeName: string;
    Description: string;
    SortOrder: number;
    IsActive: string;
    CreatedBy: number;
    CreatedDate: Date;
    ModifyBy: number;
    ModifyDate: Date;
    TypeGroup: string;

    constructor();
    constructor(Metadatas: Metadata)
    constructor(Metadatas?: any) {
        this.TypeLookUpID = Metadatas && Metadatas.TypeLookUpID || 0;
        this.TypeCode = Metadatas && Metadatas.TypeCode || '';
        this.TypeName = Metadatas && Metadatas.TypeName || '';
        this.Description = Metadatas && Metadatas.Description || '';
        this.SortOrder = Metadatas && Metadatas.SortOrder || null;
        this.TypeGroup = Metadatas && Metadatas.TypeGroup || '';
        this.CreatedBy = Metadatas && Metadatas.CreatedBy || 0;
        this.CreatedDate = Metadatas && Metadatas.CreatedDate || new Date().getUTCDate;
        this.ModifyBy = Metadatas && Metadatas.ModifyBy || 0;
        this.ModifyDate = Metadatas && Metadatas.ModifyDate || new Date().getUTCDate;
        this.IsActive = Metadatas && Metadatas.IsActive || true;

    }
}