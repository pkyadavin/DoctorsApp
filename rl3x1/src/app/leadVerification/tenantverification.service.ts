import { Injectable, Inject } from "@angular/core"
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from,throwError } from "rxjs";
import { map } from 'rxjs/operators';
import{ConfigurationConstants} from '../shared/constants'
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class TenantVerificationService {

    tenantAdmins: Observable<any>
    private _tenantAdmins: BehaviorSubject<any>;
    private baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.CPORTALBASEURL;
    }

    TenantVerification(_data: any): Observable<any> {        
        return this.http.post(this.baseUrl + "tenantadmins/tenantverify", JSON.stringify(_data));
    } 
    TenantReSendVerification(_data: any): Observable<any> {        
        return this.http.post(this.baseUrl + "tenantadmins/tenantresendverify", JSON.stringify(_data));
    } 
    CheckTenantVerification(_data: any): Observable<any> {
        
        return this.http.post(this.baseUrl + "tenantadmins/checktenantverify", JSON.stringify(_data));
    } 
    private extractData(res: Response) {
        // if (res && res.json().error) {
        //     throw (res.json().error.message);
        // }
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