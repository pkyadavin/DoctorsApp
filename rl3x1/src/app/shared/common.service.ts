import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Language } from './common.model';
import { ConfigurationConstants } from '../shared/constants';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class CommonService {
    private baseUrl: string;
    private _auth: AuthService;
    constructor(private http: HttpClient
        , private auth: AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this._auth = auth;
    }

    getRegionLookup(): Observable<any> {
        return this.http.get(this.baseUrl + "common/regions/");
    }

    getRepairItems(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID, requireQty): Observable<any> {

        return this.http.get(`${this.baseUrl}common/repairitems/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${requireQty}`);
    }

    getAirportLookup(): Observable<any> {
        return this.http.get(this.baseUrl + "common/airports/");
    }

    getAllLanguages(): Observable<any> {
        return this.http.get(this.baseUrl + "common/languages");
    }

    getAllLocations(): Observable<any> {
        return this.http.get(this.baseUrl + "common/AllLocations");
    }

    getAllNodes(): Observable<any> {
        return this.http.get(this.baseUrl + "common/Node");
    }

    getTypeLookUpByName(typegroup: string): Observable<any> {
        return this.http.get(this.baseUrl + "common/typelookup/" + typegroup);
    }

    getTypeLookUpsByName(typegroups: Array<string>): Observable<any> {
        return this.http.post(`${this.baseUrl}common/typelookups`, JSON.stringify(typegroups));
    }

    loadUsers(): Observable<any> {
        return this.http.get(this.baseUrl + "common/users");
    }

    loadUOM(): Observable<any> {
        return this.http.get(this.baseUrl + "common/GetUOMs");
    }

    loadRoles(rt: string = null): Observable<any> {
        return this.http.get(this.baseUrl + "common/roles/" + rt);
    }

    loadCarriers(): Observable<any> {
        return this.http.get(this.baseUrl + "common/GetCarriers");
    }

    loadPartners(): Observable<any> {
        return this.http.get(this.baseUrl + "common/partners");
    }

    loadPartnersByUsers(userID: number): Observable<any> {
        return this.http.get(this.baseUrl + "common/partners/assigned/" + userID);
    }

    loadBrands(): Observable<any> {
        return this.http.get(this.baseUrl + "common/brands");
    }
    loadReturnReasons(): Observable<any> {
        return this.http.get(this.baseUrl + "common/returnreasons");
    }

    loadReasonRules(): Observable<any> {
        return this.http.get(this.baseUrl + "common/returnrules");
    }


    getModuleStatus(moduleId: number): Observable<any> {
        return this.http.get(this.baseUrl + "common/status/" + moduleId);
    }

    getModuleActions(moduleId: number): Observable<any> {
        return this.http.get(this.baseUrl + "common/action/" + moduleId);
    }

    getDefaultPartner(): Observable<any> {

        return this.http.get(this.baseUrl + 'common/defaultpartner/');
    }


    getNewDefaultPartner(): Observable<any> {

        return this.http.get(this.baseUrl + 'common/newdefaultpartner/');
    }

    getWFHierarchy(moduleId: number): Observable<any> {
        return this.http.get(this.baseUrl + "common/hierarchy/" + moduleId);
    }

    loadPermissionByModule(userId: number, partnerId: number, Module: string): Observable<any> {
        return this.http.get(`${this.baseUrl}module/GetPermissionByModule/${userId}/${partnerId}/${Module}`);
    }

    getDashBoardCode(): Observable<any> {

        return this.http.get(this.baseUrl + 'common/DashBoardCode/');
    }

    UploadUserImage(formdata: any): Observable<any> {
        return Observable.create(observer => {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (me: any = this) {
                if (req.readyState === 4 && this.status == 200) {
                    var response = JSON.parse(req.responseText);
                    observer.next(response);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete();
                }
            }
            req.open("POST", `${this.baseUrl}common/userimage`);
            req.setRequestHeader('Authorization', 'Bearer ' + this._auth.getAuthorizationToken());
            req.setRequestHeader('scope', this._auth.getScope());
            req.setRequestHeader('user', this.auth.getAuthorizationUser());
            req.send(formdata);
            //return Observable.empty();
        });
    }
}