import { Injectable, Inject } from "@angular/core"
import { Observable, BehaviorSubject, of, from, throwError } from "rxjs";
import { map } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { ConfigurationConstants } from 'src/app/shared/constants';
import { AuthService } from 'src/app/authentication/auth.service';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AnalyticsService {
    baseUrl: string;
    
    constructor(private http: HttpClient, private _auth: AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    getPartners(): Observable<any>
    {
        return this.http.get(`${this.baseUrl}common/partners/assigned`);
    }
    
    getTypes(typegroup: string): Observable<any> {
        return this.http.get(this.baseUrl + "common/typelookup/" + typegroup);
    }
    getreportdata(report:string, filter_data:any): Observable<any>
    {
        return this.http.post(`${this.baseUrl}report/webreport/${report}`, JSON.stringify(filter_data));
    }
    getstatisticsdata(report:string, startDate:String,endDate:String): Observable<any>
    {
        return this.http.get(`${this.baseUrl}report/webreport/${report}/${startDate}/${endDate}`);
    }
    getgraphicaldata(filter_data:any): Observable<any> {
        return this.http.post(`${this.baseUrl}report/graphical`, JSON.stringify(filter_data));
    }
    download(report:string, filter_data:any): Observable<any>
    {
        return this.http.post(`${ConfigurationConstants.BASEAPIURLForCarrier}api/download/${report}`, JSON.stringify(filter_data));
    }
}