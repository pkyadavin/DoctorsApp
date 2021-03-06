﻿import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../../shared/constants'
@Injectable()
export class LocationService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}returnReasonLocation/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }
    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}returnReasonLocation`, JSON.stringify(_data));
    }
    remove(ID: number, ParentID: number): any {

        return this.http.delete(`${this.baseUrl}returnReasonLocation/Remove/${ID}/${ParentID}`);
    }
    getCategories(): Observable<any> {
        return this.http.get(`${this.baseUrl}returnReasonLocation/getCategories`);
    }
}
