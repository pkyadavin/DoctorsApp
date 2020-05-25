import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class caseCreationService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}caseCreation/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }
    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}caseCreation`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}caseCreation/Remove/${ID}`);
    }
    getRegions(): Observable<any> {
        return this.http.get(`${this.baseUrl}caseCreation/getRegions`);
    }
    searchPOWoNo(powono: string){
        return this.http.get(`${this.baseUrl}caseCreation/SearchPOWo/${powono}`) ;
    }
    getStateByCountry(countryid: string){
        return this.http.get(`${this.baseUrl}caseCreation/GetStateByCountry/${countryid}`) ;
    }
    GetColorSizeIssueCountry(){
        return this.http.get(`${this.baseUrl}caseCreation/GetColorSizeIssueCountry`) ;
    }
    GetPersonalInfoByNo(AccountNo : string){
        return this.http.get(`${this.baseUrl}caseCreation/GetPersonalInfoByNo/${AccountNo}`) ;
    }

    uploadImages(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}uploads/files`, data);
    }
    getLocationFromCategory(catcode:string){
        return this.http.get(`${this.baseUrl}caseCreation/getLocation/${catcode}`)
    }
}
