import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class CountryService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID, RegionID): Observable<any> {
        //debugger;
        return this.http.get(`${this.baseUrl}country/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${RegionID}`);
    }
    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}country`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}country/Remove/${ID}`);
    }
    getRegions(): Observable<any> {
        return this.http.get(`${this.baseUrl}country/getRegions`);
    }

    getAllCarrierGateway(ID: number): Observable<any> {
      return this.http.get(`${this.baseUrl}country/CarrierGateway/${ID}`);
     }
}
