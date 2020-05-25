import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Metadata } from './metadata-config.model';
import { ConfigurationConstants } from '../../shared/constants'
import { AuthService } from '../../authentication/auth.service'
@Injectable()
export class MetadataService {
    users: Observable<Metadata[]>

    private baseUrl: string;
    private actionUrl: string;
    private dataStore: {
        metadata : Metadata[]
    };

    constructor(  private http : HttpClient, private loginservice:AuthService ) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.actionUrl = this.baseUrl + 'typelookup';
        this.dataStore = { metadata: [] };
    }
 
    loadAll(typegroup: string, startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        this.actionUrl = this.baseUrl + 'typelookup';
        return this.http.get(`${this.actionUrl}/${typegroup}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    getTypeLookUpByGroupName(typegroup: string): Observable<any> {
        this.actionUrl = this.baseUrl + 'typelookup/get/'+ typegroup;
        return this.http.get(`${this.actionUrl}`);
    }

    getTypeLookUpsByGroupName(typegroups: Array<string>): Observable<any> {
        this.actionUrl = this.baseUrl + 'typelookup/getall';
        return this.http.post(`${this.actionUrl}`, JSON.stringify(typegroups));
    } 

    create(typegroup: string, confiToAdd: Metadata): Observable<any> {
        this.actionUrl = this.baseUrl + 'typelookup/';
        //confiToAdd.CreatedBy = confiToAdd.ModifyBy = this.loginservice.loginUserID;
        confiToAdd.CreatedDate = confiToAdd.ModifyDate = new Date();
        return this.http.post(`${this.actionUrl}`, JSON.stringify(confiToAdd));
    }

    remove(typegroup, typeLookupId: number): Observable<any> {
        this.actionUrl = this.baseUrl + 'typelookup/';
        return this.http.delete(`${this.actionUrl}/${typeLookupId}`);
    }

    update(typegroup: string, confiToUpdate: Metadata): Observable<any> {
        this.actionUrl = this.baseUrl + 'typelookup/';
        //confiToUpdate.ModifyDate = new Date();
        return this.http.put(`${this.actionUrl}`, JSON.stringify(confiToUpdate));

    }
}
