import { Injectable, Inject } from "@angular/core"
//import { Headers, Response, RequestOptions, BaseRequestOptions, Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/map';
import { Manufacturer } from "./Manufacturer.model";
import { ConfigurationConstants } from '../../shared/constants';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ManufacturerService {
    locations: Observable<Location[]>
    private _Manufacturers: BehaviorSubject<Location[]>;
    private baseUrl: string;

    private dataStore: {
        locations: Location[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { locations: [] };
        this._Manufacturers = <BehaviorSubject<Location[]>>new BehaviorSubject([]);
        this.locations = this._Manufacturers.asObservable();
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}manufacturer/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);//.map(this.extractData);
    }

    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}manufacturer/Remove/${ID}`);//.map(this.extractData);
    }

    Save(_data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}manufacturer`, JSON.stringify(_data));
        // .map(this.extractData)
        // .catch((res: Response) => this.handleError(res));
    }
    // private extractData(res: Response) {
    //     let body = res.json();
    //     return body || {};
    // }
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
