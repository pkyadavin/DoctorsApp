import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { ConfigurationConstants } from '../../shared/constants';
import { ReturnReason } from './returnreason.model';

@Injectable()
export class ReturnReasonService {
    returnReasons: Observable<ReturnReason[]>;
    private _returnReasons: BehaviorSubject<ReturnReason[]>;
    private baseUrl: string;
    private dataStore: {
        returnReasons: ReturnReason[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { returnReasons: [] };
        this._returnReasons = <BehaviorSubject<ReturnReason[]>>new BehaviorSubject([]);
        this.returnReasons = this._returnReasons.asObservable();
    }

    GetRMAActionType(): Observable<any> {
        return this.http.get(this.baseUrl + "common/RMAActionType");
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID, Scope): Observable<any> {
        return this.http.get(`${this.baseUrl}returnreason/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${Scope}`);
    }

    loadReturnReasonById(RMAActionCodeID: number, TypeCode: string): Observable<any> {
        return this.http.get(`${this.baseUrl}returnreason/${RMAActionCodeID}/${TypeCode}`);
    }

    GetFullfillmentFlag(): Observable<any> {
        return this.http.get(`${this.baseUrl}returnreason/GetFullfillmentFlag`);
    }

    SaveReturnReason(returnReasons: ReturnReason): Observable<any> {
        return this.http.post(`${this.baseUrl}returnreason/${returnReasons.RMAActionCodeID}`, JSON.stringify(returnReasons));

    }

    remove(RMAActionCodeID: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}returnreason/${RMAActionCodeID}`);
    }
}
