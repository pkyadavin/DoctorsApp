import { TypedJson } from '../../app.util';
declare var $: any;
export class Location{
    PartnerLocationID: number;
    LocationCode: string;
    RowIndex: string;
    LocationName: string;
    IsActive: boolean;
    UserID: number;
    PartnerID: number;
    PartnerName: string;
    FrameID: string;
    ColorCode: string;

}

export class LocationStructure {
    PartnerLocationID: number;
    ParentPartnerLocationID: number;
    LocationCode: string;
    TenantLocationCode: string;
    LocationName: string;
    FrameID: number;
    ColorCode: string;
    RowIndex: number;
    Childs: Array<LocationStructure>;
    constructor()
    constructor(ls: LocationStructure)
    constructor(ls?: any) {
        this.PartnerLocationID = ls && ls.PartnerLocationID || 0;
        this.ParentPartnerLocationID = ls && ls.ParentPartnerLocationID || 0;
        this.LocationCode = ls && ls.LocationCode || null;
        this.TenantLocationCode = ls && ls.TenantLocationCode || this.LocationCode;
        this.LocationName = ls && ls.LocationName || null;
        this.FrameID = ls && ls.FrameID || 0;
        this.ColorCode = ls && ls.ColorCode || null;
        this.RowIndex = ls && ls.RowIndex || 0;
        this.Childs = ls && $.map(TypedJson.parse<Array<LocationStructure>>(ls.Childs), function (v, i) { return new LocationStructure(v); }) || null;
        //TypedJson.parse<Array<LocationStructure>>(ls.Childs)
    }
}