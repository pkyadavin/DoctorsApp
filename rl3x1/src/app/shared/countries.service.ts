import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Countries } from './Countries.model';
import { ConfigurationConstants } from '../shared/constants'
@Injectable()
export class CountriesService {
    countries: Observable<Countries[]>
    private baseUrl: string;
    private dataStore: {
        countries: Countries[]
    };

    constructor( private http:HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { countries: [] };
    }
    loadCountries(): Observable<any> {
        return this.http.get(`${this.baseUrl}countries/`);
    }

    getCountryById(CountryID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}countries/getCountryNameByID/${CountryID}`);
    }
}