import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { SOOrder } from './soOrder.model';
import { ConfigurationConstants } from '../../shared/constants'
import { map } from 'rxjs/operators';
@Injectable()
export class SOService {
    stockTransfer: Observable<SOOrder[]>
    private baseUrl: string;
    private dataStore: {
        stockTransfer: SOOrder[]
    };

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { stockTransfer: [] };
    }

    loadOpenSTO(startIndex, endIndex, sortColumn, sortDirection, filterValue, Status, partnerid, Scope): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${Status}/${partnerid}/${Scope}`);
    }

    loadSTOByID(id: number | string): Observable<SOOrder> {
        return this.http.get<SOOrder>(`${this.baseUrl}soOrder/GetSTOData/${id}`);
    }
    loadOrderLinesByID(id: number | string): Observable<SOOrder> {
        return this.http.get<SOOrder>(`${this.baseUrl}soOrder/GetSOLineData/${id}`);
    }

    loadPartners(): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/GetPartners`);
    }

    CheckAllowExcel(): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/CheckAllowExcel`);
    }

    loadAllRefType(): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/AllRefType/`);
    }

    loadAddressById(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/loadAddressbyId/${id}`);
    }

    CheckSOAvailability(number, type): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/CheckAvailability/${number}/${type}`);
    }

    create(soOrder: SOOrder): Observable<any> {
        return this.http.post(`${this.baseUrl}soOrder`, JSON.stringify(soOrder))

    }

    importSO(data, partnerID): Observable<any> {
        return this.http.post(`${this.baseUrl}soOrder/import/${partnerID}`, JSON.stringify(data));

    }

    update(soOrder: SOOrder): Observable<any> {
        return this.http.put(`${this.baseUrl}soOrder/${soOrder.SOHeaderID}`, JSON.stringify(soOrder))

    }
    ExportToExcel(OrderType, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}soOrder/ExportToExcel/${OrderType}/${partnerID}`, { responseType: "blob" })
            .pipe(
                map(response => {                   
                        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        var blob = new Blob([(<any>response)._body], { type: contentType });
                        return blob;
                })
            );
    }

}