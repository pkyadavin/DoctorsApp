import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class B2BUserService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}B2BUser/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }
    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}B2BUser`, JSON.stringify(_data));
    }
    Update(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}B2BUser/Update`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}B2BUser/Remove/${ID}`);
    }
    getRegions(): Observable<any> {
        return this.http.get(`${this.baseUrl}B2BUser/getRegions`);
    }
    getCountry(): Observable<any> {
        return this.http.get(`${this.baseUrl}B2BUser/getCountry`);
    }
    getCountryServiceType():Observable<any>{
        return this.http.get(`${this.baseUrl}B2BUser/getCountryServiceType`)
    }
    getStateByID(countryid:number): Observable<any> {
        return this.http.get(`${this.baseUrl}B2BUser/getStateByID/`+countryid);
    }
    getCityByID(countryid:number,stateid:number):Observable<any>{
        return this.http.get(`${this.baseUrl}B2BUser/getCityByID/`+countryid+'/'+stateid);
    }
    getServiceType():Observable<any>{
        return this.http.get(`${this.baseUrl}B2BUser/getServiceType`);
    }
    getStatePromise(countryid:number) {
        return this.http.get(`${this.baseUrl}B2BUser/getStateByID/`+countryid).toPromise();
    }
    getCityPromise(countryid:number,stateid:number){
        return this.http.get(`${this.baseUrl}B2BUser/getCityByID/`+countryid+'/'+stateid).toPromise();
    }
    getSelectedCountryStateCity(billcountry:number,shipcountry:number,billstate:number,shipstate:number):Observable<any>{
        return this.http.get(`${this.baseUrl}B2BUser/getSelectedCountryStateCity/`+billcountry+'/'+shipcountry+'/'+billstate+'/'+shipstate);
    }
}
