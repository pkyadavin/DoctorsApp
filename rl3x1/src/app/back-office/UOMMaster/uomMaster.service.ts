import { Injectable, Inject } from '@angular/core';
//import { Headers, Response, RequestOptions, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { UOMMaster } from './uomMaster.model';
import { ConfigurationConstants } from '../../shared/constants';
import { TypeLookup } from '../../shared/common.model';
import { HttpClient } from '@angular/common/http';
 
@Injectable()
export class UOMMasterService {
    uoms: Observable<UOMMaster[]>
    private baseUrl: string;
    private dataStore: {
        uomMasters: UOMMaster[]
    };

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { uomMasters: [] };

    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID): Observable<any> {
       // alert('UOMMasterService loadAll');
        return this.http.get(`${this.baseUrl}UOMMaster/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);//.map(this.extractData);
    }

    // private extractData(res: Response) {
    //     let body = res.json();
    //     return body|| {};
    // }

    loadUOM(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}UOMMaster/GetUOMData/${id}`);//.map(this.extractData);
    }


    create(uom: UOMMaster): Observable<any> {
        return this.http.post(`${this.baseUrl}UOMMaster`, JSON.stringify(uom))

    }

    update(uom: UOMMaster): Observable<any> {
        return this.http.put(`${this.baseUrl}UOMMaster/${uom.UOMID}`, JSON.stringify(uom))

    }
    getUOMTypeData(id: number | string): Observable<any> {
 
        return this.http.get(`${this.baseUrl}UOMMaster/UOMTypes/${id}`);//.map(this.extractData);
    }
   
    //getTypeLookUpByName(typegroup: string): Observable<any> {
 
    //    return this.http.get(this.baseUrl + "common/typelookup/" + typegroup)
    //        .map(this.extractData)
    //        .catch((res: Response) => this.handleError(res));
    //}



    getTypeLookUpByName(typegroup: string, selectedid: number): Observable<any> {
 
        //return this.http.get(this.baseUrl + "common/typelookup/" + typegroup)
        //    .map(this.extractData)
        //    .catch((res: Response) => this.handleError(res));
        return this.http.get(`${this.baseUrl}UOMMaster/UOMTypes/${typegroup}/${selectedid}`);//.map(this.extractData);
    }


    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err =  JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    
}
