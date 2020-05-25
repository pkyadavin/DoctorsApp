import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants';
import { Colors } from './Models/colors.model';
import { ProductSizeModel } from './Models/ProductSize.model';
import { SubCategoryModel } from './Models/SubCategory.model';
import { GradeModel } from './Models/Grade.model';
import { CategoryModel } from './Models/Category.model';
@Injectable()
export class ProductCatalogService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}ProductCatalog/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    loadColors(): Observable<Colors[]> {
      return this.http.get<Colors[]>(`${this.baseUrl}ProductCatalog/Colors`);
    }

    loadProductSize(): Observable<ProductSizeModel[]> {
      return this.http.get<ProductSizeModel[]>(`${this.baseUrl}ProductCatalog/ProductSize`);
    }


    loadSubcategory(): Observable<SubCategoryModel[]> {
      return this.http.get<SubCategoryModel[]>(`${this.baseUrl}ProductCatalog/Subcategory`);
    }

    loadGrade(): Observable<GradeModel[]> {
      return this.http.get<GradeModel[]>(`${this.baseUrl}ProductCatalog/Grade`);
    }

    loadCategory(): Observable<CategoryModel[]> {
      return this.http.get<CategoryModel[]>(`${this.baseUrl}ProductCatalog/Category`);
    }

    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}ProductCatalog`, JSON.stringify(_data));
    }
    Update(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}ProductCatalog/Update`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}ProductCatalog/Remove/${ID}`);
    }
    getRegions(): Observable<any> {
        return this.http.get(`${this.baseUrl}ProductCatalog/getRegions`);
    }
}
