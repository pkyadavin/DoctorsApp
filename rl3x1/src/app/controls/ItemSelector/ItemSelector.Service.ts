
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ItemMaster } from './ItemSelector.Model';
import { ConfigurationConstants } from '../../shared/constants'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemSelectorService {
    itemselectors: Observable<ItemMaster[]>
    private baseUrl: string;
    private dataStore: {
        itemselectors: ItemMaster[]
    };

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { itemselectors: [] };
        //this._timezones = <BehaviorSubject<TimeZone[]>>new BehaviorSubject([]);
        //this.users = this._users.asObservable();
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, Paramdata, PartnerId): Observable<any> {
        return this.http.get(`${this.baseUrl}itemmaster/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${Paramdata}/${PartnerId}`);//.map(this.extractData);
    }

    // private extractData(res: Response) {
    //     let body = res.json();
    //     return body || {};
    // }


    load(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}itemmaster/${id}`);//.map(this.extractData)
    }

}
