import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
import { Colors } from './Models/colors.model';
import { ProductSizeModel } from './Models/ProductSize.model';
@Injectable()
export class CaseAssessmentService {
    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}CaseAssessment/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    loadColors(): Observable<Colors[]> {
      return this.http.get<Colors[]>(`${this.baseUrl}Orders/Colors`);
    }

    loadProductSize(): Observable<ProductSizeModel[]> {
      return this.http.get<ProductSizeModel[]>(`${this.baseUrl}Orders/ProductSize`);
    }

    Save(_data: any): Observable<any> {

        return this.http.post(`${this.baseUrl}CaseAssessment`, JSON.stringify(_data));
    }
    remove(ID: number): any {

        return this.http.delete(`${this.baseUrl}state/Remove/${ID}`);
    }
}
