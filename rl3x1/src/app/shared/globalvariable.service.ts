/* global.service.ts */

import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationConstants } from '../shared/constants'
import { DOCUMENT } from '@angular/platform-browser';
@Injectable()
export class GlobalVariableService {
    public portal: string = "";
    public TypeCode: string = "";
    public RefTypeID: string = "";
    public PartnerID: string = "";

    public DispatchHeaderID: string = "";
    public Skin: string = "assets/css/skins/blue.css";
    public isLoader: boolean;
    public logInUserPartnerObj: any;
    public TaskQue: any;
    public ItemMasterID: number = 0;
    isloadeTaskQueue: boolean;
    baseUrl: string;
    public newRolesObj: any;

    constructor(@Inject(DOCUMENT) private document) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.isLoader = false;
        this.isloadeTaskQueue = false;
        this.Skin = "assets/css/skins/blue.css";
    }

    requestReturnSOChange: Subject<string> = new Subject<string>();
    SOChange(value: string) {
        this.requestReturnSOChange.next(value);
    }

    //loader 
    loaderVisibilityChange: Subject<boolean> = new Subject<boolean>();
    loader(value: boolean) {
        this.isLoader = value;
        this.loaderVisibilityChange.next(this.isLoader);
    }
    //Change Default Partner
    ChangePartner: Subject<any> = new Subject<any>();
    newPartner(value: any) {
        this.logInUserPartnerObj = value;
        this.ChangePartner.next(this.logInUserPartnerObj);
    }

    //taskqueue
    loadeTaskQueueChange: Subject<boolean> = new Subject<boolean>();
    loadeTaskQueue(value: boolean) {
        this.isloadeTaskQueue = value;
        this.loadeTaskQueueChange.next(this.isloadeTaskQueue);
    }
    //UserRoles
    NotifyRole: Subject<any> = new Subject<any>();
    newRoles(value: any) {
        this.newRolesObj = value;
        this.NotifyRole.next(this.newRolesObj);
    }


    setLinkCellRender(colDefs, fieldName, IsPermission) {
        if (IsPermission) {
            var coldef = colDefs.find(element => element.field == fieldName);
            if (coldef != null) {
                coldef.cellRenderer = this.cellEditRender;
            }
        }
    }

    cellEditRender(val) {
        if (val == null || val.value == undefined)
            return;
        if (val != null) {
            return '<a style="cursor:pointer;" data-action-type="edit">' + val.value + '</a>';
        }
        return val;
    }

    private Data = {};

    setItem(varName: string, value: any) {
        this.Data[varName] = value;
        sessionStorage.setItem(varName, JSON.stringify(value));
    }

    setThemeAttribute() {
        //  this.Skin = 'assets/css/skins/' + theme + '.css';
        this.Skin = 'assets/css/skins/' + sessionStorage.getItem('theme') + '.css';
        this.document.getElementById('theme').setAttribute('href', this.Skin);
    }

    getItem(varName: string) {
        var value = sessionStorage.getItem(varName);
        return JSON.parse(value);
    }

    setOption(varName: string, value: any) {
        this.Data[varName] = value;
    }

    getOption(varName: string) {
        return this.Data[varName];
    }

    getModuleTitle(navRouteKey: string) {
        var title = '';

        navRouteKey = '/' + navRouteKey;

        var menuItems = this.getItem('menuItems');

        if (menuItems != undefined) {
            var route = menuItems.filter(m => m.routeKey == navRouteKey)[0];
            if (route != undefined) {
                title = route.title;
                this.setItem("moduleTitle", title);
            }
            else {
                title = this.getItem("moduleTitle");
            }
        }

        return title;
    }

    getModuleDescription(navRouteKey: string) {
        var description = '';

        navRouteKey = '/' + navRouteKey;

        var menuItems = this.getItem('menuItems');

        if (menuItems != undefined) {
            var route = menuItems.filter(m => m.routeKey == navRouteKey)[0];
            if (route != undefined) {
                description = route.description;
                this.setItem("moduledescription", description);
            }
            else {
                description = this.getItem("moduledescription");
            }
        }

        return description;
    }
}