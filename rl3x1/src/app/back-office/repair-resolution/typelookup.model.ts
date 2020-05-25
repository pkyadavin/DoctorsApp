import { TypedJson } from '../../app.util';

interface ITypeLookUp {
    TypeLookUpID: number;
    TypeCode: string;
    TypeName: string;
    TypeGroup: string;
    Description: string;
    Attributes: Array<ITypeLookUp>;
}
export class TypeLookUp {
    TypeLookUpID: number;
    CountryConfigMapID: number;
    isActive: boolean;
    TypeCode: string;
    TypeName: string;
    TypeGroup: string;
    Description: string;
    Attributes: Array<ITypeLookUp>;

    constructor();
    constructor(TypeLookUp: ITypeLookUp)
    constructor(TypeLookUp?: any) {
        this.CountryConfigMapID = TypeLookUp && TypeLookUp.CountryConfigMapID || 0;
        this.TypeLookUpID = TypeLookUp && TypeLookUp.TypeLookUpID || 0;
        this.TypeCode = TypeLookUp && TypeLookUp.TypeCode || '';
        this.TypeName = TypeLookUp && TypeLookUp.TypeName || '';
        this.TypeGroup = TypeLookUp && TypeLookUp.TypeGroup || '';
        this.Description = TypeLookUp && TypeLookUp.Description || '';
        this.isActive = TypeLookUp && TypeLookUp.isActive || false;
        this.Attributes = TypeLookUp && TypeLookUp.Attributes && TypedJson.parse<Array<ITypeLookUp>>(TypeLookUp.Attributes) || new Array<ITypeLookUp>();
    }
}
