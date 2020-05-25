import { Injectable, Inject } from "@angular/core"
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { ConfigurationConstants } from '../../shared/constants';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LanguageService {
    private baseUrl: string;

    private dataStore: {
        locations: Location[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { locations: [] };
    }

    GetLanguageData(formid, languageid, brandid): any {
        return this.http.get(`${this.baseUrl}language/${formid}/${languageid}/${brandid}`);
    }
    GetMappedLanguages(): any {
        return this.http.get(`${this.baseUrl}language/mapped`);
    }
    GetBrands(): any {
        return this.http.get(`${this.baseUrl}common/brands`);
    }

    Save(_mode: boolean, _data: any): Observable<any> {
        
        return this.http.post(`${this.baseUrl}language/${_mode}`, JSON.stringify(_data));
    }
}
