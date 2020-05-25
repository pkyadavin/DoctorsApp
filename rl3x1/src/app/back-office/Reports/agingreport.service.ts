import { Injectable, Inject } from "@angular/core"
//import { Http, Headers, Response, RequestOptions, BaseRequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/map';
import { ConfigurationConstants } from '../../shared/constants';
import { AgingReport, PostAgingReport } from './agingreport.model';
import { HttpClient } from '@angular/common/http';
@Injectable()

export class AgingReportService {
    agingReports: Observable<AgingReport[]>;
    private _agingReports: BehaviorSubject<AgingReport[]>;
    private baseUrl: string;
    private dataStore: {
        agingReports: AgingReport[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { agingReports: [] };
        this._agingReports = <BehaviorSubject<AgingReport[]>>new BehaviorSubject([]);
        this.agingReports = this._agingReports.asObservable();
    }

    loadAll(postAging: PostAgingReport): Observable<any> {
        return this.http.post(`${this.baseUrl}reports`, JSON.stringify(postAging)).map(this.extractData);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
