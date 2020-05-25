import { Injectable, Inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { Observable } from 'rxjs/Observable';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class ReturnTypeService {
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "returntype";

    constructor(private http: HttpClient) {
        this.http = http;
    }

    getallReturnTypes(PartnerID, startIndex, endIndex, sortColumn, sortDirection, filterValue, Scope): Observable<any> {
        return this.http.get(`${this.action_Url}/${PartnerID}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${Scope}`);
    }

    getReturnType(id: string): Observable<any> {
        return this.http.get(this.action_Url + "/" + id);
    }

    Save(_order: any): Observable<any> {
        return this.http.post(this.action_Url, JSON.stringify(_order));
    }

    Delete(id: number): Observable<any> {
        return this.http.delete(this.action_Url + "/" + id);
    }

    getCategoryWiseReturnResons(RMAActionCode_Category: string): Observable<any> {
        return this.http.get(`${this.action_Url}/ReturnReason/${RMAActionCode_Category}`);
    }
}