import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Address } from './address.model';
import { ConfigurationConstants } from '../shared/constants'
@Injectable()
export class AddressService {
    address: Observable<Address[]>
    private baseUrl: string;
    private dataStore: {
        address: Address[]
    };

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { address: [] };
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    loadAddressByID(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}address/${id}`);
    }

    loadAddressType(TypeGroup: string): Observable<any> {
        return this.http.get(`${this.baseUrl}address/addressType/${TypeGroup}`);
    }

    loadAddressCol(FormName: string): Observable<any> {
        return this.http.get(`${this.baseUrl}address/addressColumn/${FormName}`);
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, MapTableName, MapTableColumn, MapColumnValue): Observable<any> {
        return this.http.get(`${this.baseUrl}address/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${MapTableName}/${MapTableColumn}/${MapColumnValue}`);
    }
    AddAddress(_item: any): Observable<any> {
        return this.http.post(this.baseUrl + 'address/', JSON.stringify(_item));
    }
}