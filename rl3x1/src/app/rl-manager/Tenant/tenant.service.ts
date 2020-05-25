import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Tenant } from './tenant.model';
import { ConfigurationConstants } from '../../shared/constants'
import { retry, catchError, tap, finalize } from 'rxjs/operators';
@Injectable()
export class TenantService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.ADMINPORTALBASEURL;
    }

    loadAll(OrderStatus, startIndex, endIndex, sortColumn, sortDirection, filterValue): Observable<any> {

        return this.http.get(`${this.baseUrl}tenant/${OrderStatus}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}`);
    }

    remove(tenant: Tenant): Observable<any> {
        return this.http.delete(`${this.baseUrl}tenant/${tenant.TenantID}`);
    }


    GetTenantByID(tenantid: number): Observable<any> {
        return this.http.get(`${this.baseUrl}tenant/getbyid/${tenantid}`);
    }

    ApproveTenant(_Tenant: any): Observable<any> {
        return this.http.post(this.baseUrl + "tenant/approve", JSON.stringify(_Tenant));
    }

    UpdateTenantDatabase(_Tenant: any): Observable<any> {
        return this.http.post(this.baseUrl + "tenant/UpdateTenantDatabase", JSON.stringify(_Tenant));
    }

    UpdateFTP(_TenantFTP: any): Observable<any> {
        return this.http.post(this.baseUrl + "tenant/TenantFTP", JSON.stringify(_TenantFTP));
    }

    EnvironmentPrepare(scope): Observable<any> {        
     return this.http.post(`${this.baseUrl}env/prepare/${scope}`, null);
    }
    EnvironmentInit(scope): Observable<any> {
         return this.http.post(`${this.baseUrl}env/init/${scope}`, null);
    }
    
    EnvironmentProcess(scope): Observable<any> {
        return this.http.post(`${this.baseUrl}env/process/${scope}`, null)
        .pipe(
            retry(10), // retry a failed request up to 3 times
            //delay(2000)
          );
    }
    Environmentconclude(scope): Observable<any> {
        return this.http.post(`${this.baseUrl}env/conclude/${scope}`, null);
    }
}
