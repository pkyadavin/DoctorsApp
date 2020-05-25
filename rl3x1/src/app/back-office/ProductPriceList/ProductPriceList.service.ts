import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import { BehaviorSubject } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
import { GradeModel } from './Models/Grade.model';
import { CategoryModel } from './Models/Category.model';
import { SeasonModel } from './Models/Season.model';
import { RegionModel } from './Models/Region.model';
@Injectable()
export class ProductPriceListService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}ProductPriceList/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    loadGrade(): Observable<GradeModel[]> {
      return this.http.get<GradeModel[]>(`${this.baseUrl}ProductPriceList/Grade`);
    }

    loadSeason(): Observable<SeasonModel[]> {
      return this.http.get<SeasonModel[]>(`${this.baseUrl}ProductPriceList/Season`);
    }

    loadRegion(): Observable<RegionModel[]> {
      return this.http.get<RegionModel[]>(`${this.baseUrl}ProductPriceList/Region`);
    }

    loadCategory(): Observable<CategoryModel[]> {
      return this.http.get<CategoryModel[]>(`${this.baseUrl}ProductPriceList/Category`);
    }

    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}ProductPriceList`, JSON.stringify(_data));
    }
    Update(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}ProductPriceList/Update`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}ProductPriceList/Remove/${ID}`);
    }
    getRegions(): Observable<any> {
        return this.http.get(`${this.baseUrl}ProductPriceList/getRegions`);
    }
}
