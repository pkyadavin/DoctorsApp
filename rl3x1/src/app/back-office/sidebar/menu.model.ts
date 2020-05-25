// import { TypedJson } from '../Property.js';

import {TypedJson} from '../../app.util'
declare var $: any;

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
        this.LabelCode = m && m.LabelCode || null;       
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