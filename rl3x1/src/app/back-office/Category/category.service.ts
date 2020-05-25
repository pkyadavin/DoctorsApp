import { Injectable, Inject } from '@angular/core';
//import { Headers, Response, RequestOptions, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { Model } from './category.model';
import { SKU } from './sku.model';
import { ConfigurationConstants } from '../../shared/constants'
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/authentication/auth.service';
@Injectable()
export class ModelService {

    models: Observable<Model[]>
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "Models";

    private baseUrl: string;
    private dataStore: {
        modelmasters: Model[]
    };

    constructor(private http: HttpClient, private _auth:AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { modelmasters: [] };

    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,status,partnerId): Observable<any> {
        //alert('ModelService loadAll');
        return this.http.get(`${this.baseUrl}Models/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${status}/${partnerId}`);//.map(this.extractData);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body|| {};
    }
    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    loadModel(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}Models/GetModelData/${id}`)
    }
    loadAllSKU(id: number | string): Observable<any> {
       // return this.http.get(`${this.baseUrl}Models/GetAllSKUs/${id}`).map(this.extractData)
        return this.http.get(`${this.baseUrl}Models/GetItemSKUData/${id}`);//.map(this.extractData)
    }
    loadAllAccessories(ItemModelID: number | string): Observable<any> {        
        //return this.http.get(`${this.baseUrl}Models/GetItemAccessories/${ItemModelID}`).map(this.extractData)
        return this.http.get(`${this.baseUrl}Models/GetItemAccessories/${ItemModelID}`)
            //.map(this.extractData)
            //.catch((res: Response) => this.handleError(res));
    }
    loadAllDamaged(ItemModelID: number | string): Observable<any> {
        //return this.http.get(`${this.baseUrl}Models/GetItemAccessories/${ItemModelID}`).map(this.extractData)
        return this.http.get(`${this.baseUrl}Models/GetModelDamaged/${ItemModelID}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }
    loadSKU(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}Models/GetSKUData/${id}`);//.map(this.extractData)
    }

    loadCategory(): Observable<any> {
        return this.http.get(`${this.baseUrl}Models/AllCategory/`);//.map(this.extractData)
    }

    create(model: Model): Observable<any> {
        return this.http.post(`${this.baseUrl}Models`, JSON.stringify(model))

    }

    update(model: Model): Observable<any> {
        return this.http.put(`${this.baseUrl}Models/${model.ModelID}`, JSON.stringify(model))

    }
    createSKU(sku: SKU): Observable<any> {
        return this.http.post(`${this.baseUrl}Models/CreateSKU`, JSON.stringify(sku))

    }

    updateSKU(sku: SKU): Observable<any> {
        return this.http.put(`${this.baseUrl}Models/UpdateSKU/${sku.SKUID}`, JSON.stringify(sku))

    }

    remove(ID: number | string): Observable<any>  {

        return this.http.delete(`${this.baseUrl}Models/RemoveModel/${ID}`);//.map(this.extractData);
    }

    UploadProductDoc(formdata: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/doc`, formdata);
    }

    loadRetReasonRuleMapping(ItemModelId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}Models/ReasonRule/${ItemModelId}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }    

    GetModuleControlValue(): Observable<any> {        
        return this.http.get(`${this.baseUrl}Models/GetModuleControlValue`);//.map(this.extractData)
    }

    
}
