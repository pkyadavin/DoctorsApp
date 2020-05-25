import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { RepairActionCode } from "./repairactioncode.model"
import { ConfigurationConstants } from '../../shared/constants'
import { AuthService } from 'src/app/authentication/auth.service';

@Injectable()
export class RepairActionCodeService {
    repairActionCodes: Observable<RepairActionCode[]>
    private _repairactioncodes: BehaviorSubject<RepairActionCode[]>;
    private baseUrl: string;

    constructor(private http: HttpClient, private _loginService: AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue): Observable<any> {
        return this.http.get(`${this.baseUrl}repairactioncodes/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}`);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    load(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}repairactioncodes/${id}`);
    }
    Save(_data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}repairactioncodes`, JSON.stringify(_data));

    }
    remove(RepairActionCodeID: number): any {
        return this.http.delete(`${this.baseUrl}repairactioncodes/RemoveTemplate/${RepairActionCodeID}`);
    }
}