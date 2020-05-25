import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from './region.model';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class RegionService {
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = ConfigurationConstants.BASEURL + "region";

    constructor(private http: HttpClient) {
        this.http = http;
    }

    getallRegions(startIndex, endIndex, sortColumn, sortDirection, filterValue): Observable<any> {
        return this.http.get(`${this.action_Url}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}`)        ;
    }

    getAllCountries():Observable<any>{
        return this.http.get(this.endpoint_Url + "countries");
    }

    getRegion(id: number): Observable<any> {
        return this.http.get(this.action_Url+"/" + id);
    }

    Save(_region: any): Observable<any> {
        console.log(JSON.stringify(_region));
        debugger;
        return this.http.post(this.action_Url, JSON.stringify(_region));
    }

    getAllCurrencies(): Observable<any> {
        return this.http.get(this.action_Url + "/Currency");
    }

    getTimeZone(): Observable<any> {
        return this.http.get(this.action_Url + "/TimeZone");
    }

    getAllCarrierGateway(id: number): Observable<any> {
        return this.http.get(this.action_Url + "/CarrierGateway/" + id);
    }

    getCustomerCarrierGateway(CarrierListType: string, PartnerID: number): Observable<any> {
        return this.http.get(`${this.action_Url}/CustomerCarrierGateway/${CarrierListType}/${PartnerID}`);
    }

    SaveContryConfiguration(data: any): Observable<any> {
        //debugger;
        return this.http.post(`${this.action_Url}/contryConfiguration`, JSON.stringify(data));
    }

}
