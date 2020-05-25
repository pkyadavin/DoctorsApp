import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { ConfigurationConstants } from '../../shared/constants';
import { Rule } from './rule.model.js';

@Injectable()
export class RuleService {
    rules: Observable<Rule[]>;
    private _rules: BehaviorSubject<Rule[]>;
    private baseUrl: string;
    private dataStore: {
        rules: Rule[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { rules: [] };
        this._rules = <BehaviorSubject<Rule[]>>new BehaviorSubject([]);
        this.rules = this._rules.asObservable();
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}rule/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    loadRuleById(ruleId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}rule/${ruleId}`);
    }

    InsertUpdateRule(rule: Rule): Observable<any> {
        return this.http.post(`${this.baseUrl}rule/${rule.RuleID}`, JSON.stringify(rule));
    }

    moveup(ruleId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}rule/move/${ruleId}`);
    }

    save(rule: any): Observable<any> {
        return this.http.post(`${this.baseUrl}rule`, JSON.stringify(rule));
    }

    deletebyRuleId(ruleId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}rule/${ruleId}`);
    }
}