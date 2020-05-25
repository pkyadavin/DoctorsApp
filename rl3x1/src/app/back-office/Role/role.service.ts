import { Injectable, Inject } from '@angular/core';
// import { Http, Response, Headers } from '@angular/http';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from,throwError } from "rxjs";
// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/catch'
// import { Observable } from 'rxjs/Observable';
import { Role } from './role.model';
import { Menu } from '../sidebar/menu.model'; 
import { Permission } from '../sidebar/menu.model';
import { DashBoard } from './role.model';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class RoleService {    
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "role/";

    constructor(private http: HttpClient) {
        
    }

    getallRoles(PartnerID, startIndex, endIndex, sortColumn, sortDirection, filterValue): Observable<any> {
        return this.http.get(`${this.action_Url}${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${PartnerID}`);
    }

    GetUserType(): Observable<any> {
        return this.http.get(this.endpoint_Url + "common/usertype");
    }

    getRole(id: number): Observable<any> {
        return this.http.get(this.action_Url + id);
    }

    getAccessCategory(id: number): Observable<any> {
        return this.http.get(this.action_Url + 'category/' + id);
    }

    getAccess(mid: number, rid: number): Observable<any> {
        return this.http.get(this.action_Url + 'subcategory/' + mid + '/' + rid);
    }

    Save(_permission: any[]): Observable<any> {      
        return this.http.post(this.action_Url, JSON.stringify(_permission));
    }

    getalldboards(): Observable<any> {
        return this.http.get(this.action_Url);
    }

    Delete(id: number): Observable<any> {
        return this.http.delete(this.action_Url + id);
    }

    private extractData(res: Response) {
        return res.json();
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        //console.log(errorMessage);
        return throwError(errorMessage);
      }
}