import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { RMAActionCode } from './RMAActionCode.model';
import { TypeLookup } from '../../shared/common.model';
//import { ModelMaster } from '../ModelMaster/modelmaster.model';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class RMAActionCodeService {
    //modelmasters: Observable<ModelMaster[]>
   rmaactioncodes: Observable<RMAActionCode[]>
    private baseUrl: string;   
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;       
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,patnerID): Observable<any> {
       
        return this.http.get(`${this.baseUrl}rmaactioncodes/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${patnerID}`);
    }
   
    getavailableTab(Id: number,rid:number): Observable<any> {
        return this.http.get(`${this.baseUrl}rmaactioncodes/AvailableRMATab/${Id}/${rid}`);
    }
    
    getRMATab(Id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}rmaactioncodes/GetItemRMAData/${Id}`);
    }

    loadTypeLookUps(): Observable<any> { 
        var rmaactioncodeId = 0;
        return this.http.get(`${this.baseUrl}rmaactioncodes/AllTypeLookUp/${rmaactioncodeId}`);
    }     

    load(id: number | string): Observable<any> {
     
        return this.http.get(`${this.baseUrl}rmaactioncodes/${id}`);
    } 
 
    loadByRMATypeID(id: number | string): Observable<any> {

        return this.http.get(`${this.baseUrl}rmaactioncodes/loadByRMATypeID/${id}`);
    } 
   
    loadByRMAItemRMATypeID(id: number | string): Observable<any> {

        return this.http.get(`${this.baseUrl}rmaactioncodes/loadByRMAItemRMATypeID/${id}`);
    } 

    Save(_data: any, UserId: number): Observable<any> {
     
        return this.http.post(`${this.baseUrl}rmaactioncodes/${UserId}`, JSON.stringify(_data));

    }
    remove(rmaactioncodeId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}rmaactioncodes/${rmaactioncodeId}`);
    }
    //FOr SKU

    loadSKUs(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}rmaactioncodes/AllSKUs/${id}`);
    }
    loadAllSKUs(): Observable<any> {
        return this.http.get(`${this.baseUrl}rmaactioncodes/AllSKU/`);
    }
    loadItemSKU(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}rmaactioncodes/GetItemSKUData/${id}`);
    }
}
