import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class OrderSettingsService {
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "OrderSettings";

    constructor(private http: HttpClient) {
        this.http = http;
    }

    getOrderSetting(id: number): Observable<any> {
        return this.http.get(this.action_Url + "/" + id);
    }

    Save(id: number, _orderSettings: any): Observable<any> {

        return this.http.post(this.action_Url + "/" + id, JSON.stringify(_orderSettings));
    }
    //Get Module WorkFlow List for selected module
    getModuleWFList(id: number): Observable<any> {
        return this.http.get(this.action_Url + "/wfdetails/" + id);
    }
}