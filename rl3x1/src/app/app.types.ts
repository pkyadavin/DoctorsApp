declare var $: any;
import {TypedJson} from './app.util'

export class Menu {
    ID: number;
    Title: string;
    NavigateURL: string;
    LabelCode: string;
    Order: number;
    ParentID: number;
    All: boolean;
    Permissions: Permission[];
    Childs: Menu[];

    constructor();
    constructor(m: Menu);
    constructor(m?: any) {
        this.ID = m && m.ID || 0;
        this.Title = m && m.Title || null;
        this.NavigateURL = m && m.NavigateURL || null;
        this.LabelCode = m && m.LableCode || null; 
        this.Order = m && m.Order || 0;
        this.ParentID = m && m.ParentID || 0;
        this.All = m && m.All || 0;
        this.Permissions = m && m.Permissions || [];
        this.Childs = m && TypedJson.parse<Array<Menu>>(m.Childs) || [];
    }
}

export class Permission {
    ID: number;
    ModuleId: number;
    Code: string;
    Display_Name: string;
    IsApplicable: boolean;    
}

export class MenuCollection {
    Menus: Menu[]
    constructor();
    constructor(m: Menu[])
    constructor(m?: any) {
        this.Menus = m && new MenuCollection(m.Childs).Menus || []
    }
}



export class command
{
    Name: string;
    Display:string;
    Color:string;
    Icon:string;
    Callback:string;

    FilterOptions:advanceFilter;

    constructor()
    constructor(command?: command)
    constructor(command?: any) {
        this.Name = command && command.Name || null;
        this.Display = command && command.Display || null;
        this.Color = command && command.Color || null;
        this.Icon = command && command.Icon || null;
        this.Callback = command && command.Callback || null;

        //this.FilterOptions = command && command.FilterOptions || null;
    }
}
export class advanceFilter
{
    Name: string;
    Display:string;
    Control:string;
    Data:Array<any>;
    Callback:string;

    constructor()
    constructor(advanceFilter?: advanceFilter)
    constructor(advanceFilter?: any) {
        this.Name = advanceFilter && advanceFilter.Name || null;
        this.Display = advanceFilter && advanceFilter.Display || null;
        this.Control = advanceFilter && advanceFilter.Control || null;
        this.Data = advanceFilter && advanceFilter.Data || null;
        this.Callback = advanceFilter && advanceFilter.Callback || null;
    }
}
export class appSession
{
    ID:string;

    constructor()
    constructor(appSession?: appSession)
    constructor(appSession?: any){
        this.ID = appSession && appSession.ID || null;
    }
}

export class recent
{
    ID:string;

    constructor()
    constructor(recent?: recent)
    constructor(recent?: any){
        this.ID = recent && recent.ID || null;
    }
}