import { Injectable, Inject } from '@angular/core';
//import { Headers, Response, RequestOptions, BaseRequestOptions } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
//import 'rxjs/add/operator/map';
import { ModelMaster } from './modelmaster.model';
import { ModelMasterImage } from './modelmaster.model';
import { Manufacturer } from "./manufacturer.model";
import { ConfigurationConstants } from '../../shared/constants'
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/authentication/auth.service';

@Injectable()
export class ModelMasterService {

    modelmasters: Observable<ModelMaster[]>
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "ModelMasters";

    private baseUrl: string;
    private dataStore: {
        modelmasters: ModelMaster[]
    };

    constructor(private http: HttpClient, private _auth: AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { modelmasters: [] };

    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, status, partnerID): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}ModelMasters/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${status}/${partnerID}`);;
    }

    private extractData(res: Response | any) {
        if (res && res.json().error) {
            throw (res.json().error.message);
        }
        return res.json();
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            //const err = body.error || JSON.stringify(body);
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    loadManufacturer(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllManufacturer/`);
    }

    loadColors(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllColors/`);
    }
    //loadGroups(): Observable<any> {
    //    return this.http.get(`${this.baseUrl}ModelMasters/AllSubgroup/`);
    //}
    loadReceiveType(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllReceiveType/`);
    }

    loadReturnType(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllReturnType/`);
    }

    loadModel(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllModels/`);
    }


    loadUnits(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllUnits/`);
    }
    load(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/GetModelData/${id}`);
    }

    // loadItemSKU(id: number | string): Observable<ModelMaster[]> {
    //     return this.http.get(`${this.baseUrl}ModelMasters/GetItemSKUData/${id}`);
    // }
    loadItemImage(id: number | string): Observable<ModelMaster[]> {        
        return this.http.get<ModelMaster[]>(`${this.baseUrl}ModelMasters/GetItemImageData/${id}`);
    }

    //loadSKUs(id: number | string): Observable<any> {
    //    return this.http.get(`${this.baseUrl}ModelMasters/AllSKUs/${id}`);
    //}
    loadAllSKUs(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllSKU/`);
    }
    //

    loadItemMastertype(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/GetItemMasterTypeData/${id}`);
    }
    loadTypeLookUps(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllTypeLookUps/${id}`);
    }

    loadAllTypeLookUps(): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/AllTypeLookUp/`);
    }

    create(modelmaster: ModelMaster): Observable<any> {
        return this.http.post(`${this.baseUrl}ModelMasters`, JSON.stringify(modelmaster))

    }

    SaveItemImage(modelImage: ModelMasterImage): Observable<any> {
        return this.http.post(`${this.baseUrl}ModelMasters/itemImage`, JSON.stringify(modelImage))

    }

    //ValidateArticleNumber(itemmasterId: number, articlenumber: string): Observable<any> {
    //    return this.http.get(`${this.baseUrl}ModelMasters/CheckArticleNumber/${itemmasterId}/${articlenumber}`);
    //}        

    update(modelmaster: ModelMaster): Observable<any> {
        return this.http.put(`${this.baseUrl}ModelMasters/${modelmaster.ItemMasterID}`, JSON.stringify(modelmaster))

    }

    UpdateItemImage(itemImage: ModelMasterImage): Observable<any> {
        return this.http.put(`${this.baseUrl}ModelMasters/UpdateImage/${itemImage.ItemArtifactID}/${itemImage.ItemMasterID}/${itemImage.IsDefault}`, JSON.stringify(itemImage))

    }

    DeleteItemImage(itemImage: ModelMasterImage): Observable<any> {
        return this.http.put(`${this.baseUrl}ModelMasters/DeleteItemImage/${itemImage.ItemMasterID}/${itemImage.ItemArtifactID}`, JSON.stringify(itemImage))

    }

    remove(itemmasterId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}ModelMasters/${itemmasterId}`);
    }

    //DeleteItemImage(itemmasterId: number): Observable<any> {
    //    return this.http.delete(`${this.baseUrl}ModelMasters/DeleteItemImage/${itemmasterId}`);
    //        .catch((res: Response) => this.handleError(res));
    //}

    getItemInfoBySerialNumber(SNo: string): Observable<any> {
        return this.http.get(`${this.baseUrl}ModelMasters/GetItemInfoBySerialNumber/${SNo}`);
    }


    //this is for import
    importModelMaster(data, partnerID): Observable<any> {
        return this.http.post(`${this.baseUrl}ModelMasters/import/${partnerID}`, JSON.stringify(data));;

    }

    UploadItemImage(formdata: any): Observable<any> {
        return Observable.create(observer => {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (me: any = this) {
                if (req.readyState === 4 && this.status == 200) {
                    var response = JSON.parse(req.responseText);
                    observer.next(response);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete();
                }
            }

            req.open("POST", `${this.action_Url}/doc`);
            req.setRequestHeader('Authorization', 'Bearer ' + this._auth.getAuthorizationToken());
            req.setRequestHeader('scope', this._auth.getScope());
            req.setRequestHeader('user', this._auth.getAuthorizationUser());
            req.send(formdata);
            //return Observable.empty();
        });
    }
}
