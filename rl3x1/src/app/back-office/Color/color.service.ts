import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class ColorService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}color/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }
    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}color`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}state/Remove/${ID}`);
    }    
}
