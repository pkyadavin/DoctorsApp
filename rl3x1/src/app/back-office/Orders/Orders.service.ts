import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
import { Colors } from './Models/colors.model';
import { ProductSizeModel } from './Models/ProductSize.model';
import { SeasonModel } from './Models/season.model';
import { CountryModel } from './Models/Country.model';
import { SubCategoryModel } from './Models/Subcategory.model';
import { CategoryModel } from './Models/Category.model';
import { GradeModel } from './Models/Grade.model';
@Injectable()
export class OrdersService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}Orders/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    loadColors(): Observable<Colors[]> {
      return this.http.get<Colors[]>(`${this.baseUrl}Orders/Colors`);
    }

    loadProductSize(): Observable<ProductSizeModel[]> {
      return this.http.get<ProductSizeModel[]>(`${this.baseUrl}Orders/ProductSize`);
    }

    loadSeason(): Observable<SeasonModel[]> {
      return this.http.get<SeasonModel[]>(`${this.baseUrl}Orders/Season`);
    }

    loadCountry(): Observable<CountryModel[]> {
      return this.http.get<CountryModel[]>(`${this.baseUrl}Orders/Country`);
    }

    loadSubcategory(): Observable<SubCategoryModel[]> {
      return this.http.get<SubCategoryModel[]>(`${this.baseUrl}Orders/Subcategory`);
    }

    loadGrade(): Observable<GradeModel[]> {
      return this.http.get<GradeModel[]>(`${this.baseUrl}Orders/Grade`);
    }

    loadCategory(): Observable<CategoryModel[]> {
      return this.http.get<CategoryModel[]>(`${this.baseUrl}Orders/Category`);
    }

    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}Orders`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}Orders/Remove/${ID}`);
    }
}
