import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class CityService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID, countryID, stateID): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}city/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${countryID}/${stateID}`);
    }

    Save(_data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}city`, JSON.stringify(_data));
    }
   
    getCountries(): Observable<any> {
        //debugger;
        return this.http.get(`${this.baseUrl}country/getCountries`);
    }

    getStates(countryID): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}country/getStates/${countryID}`);
    }
}
