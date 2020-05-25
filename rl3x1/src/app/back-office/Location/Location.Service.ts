import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { Location } from "./Location.model";
import { ConfigurationConstants } from '../../shared/constants';
//import { MessagingKeyValue } from './MessagingKeyValue.model.js';

@Injectable()
export class LocationService {
    locations: Observable<Location[]>
    private _locations: BehaviorSubject<Location[]>;
    private baseUrl: string;

    private dataStore: {
        locations: Location[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { locations: [] };
        this._locations = <BehaviorSubject<Location[]>>new BehaviorSubject([]);
        this.locations = this._locations.asObservable();
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,PartnerID): Observable<any> {

        return this.http.get(`${this.baseUrl}location/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${PartnerID}`);
    }

    loadStructure(PartnerLocationID): Observable<any> {

        return this.http.get(`${this.baseUrl}location/ByID/${PartnerLocationID}`);
    }

    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}location/RemoveLocation/${ID}`);
    }

    AddLocations(lid: number, r: number, c: number, f: number): Observable<any> {
        return this.http.post(`${this.baseUrl}location/AddLocations/${lid}/${r}/${c}/${f}`, null);
    }

    RenameLocation(lid: number, n: string, TenantCode: string): Observable<any> {
        return this.http.post(`${this.baseUrl}location/RenameLocation/${lid}/${n}/${TenantCode}`, null);
    }

    Save(_data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}location`, JSON.stringify(_data));
    }
}
