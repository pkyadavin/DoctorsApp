import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { State } from './states.model';
import { ConfigurationConstants } from '../shared/constants'
@Injectable()
export class StatesService {
    states: Observable<State[]>
    private baseUrl: string;
    private dataStore: {
        states: State[]
    };

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { states: [] };
    }
    loadStates(countryID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}states/${countryID}`);
    }

    getStateById(StateID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}states/getStateNameByID/${StateID}`);
    }
}
