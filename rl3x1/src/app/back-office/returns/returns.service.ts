import { Injectable, Inject } from "@angular/core"
import { Observable, BehaviorSubject, of, from, throwError } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { ConfigurationConstants } from 'src/app/shared/constants';
import { AuthService } from 'src/app/authentication/auth.service';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Util } from 'src/app/app.util';

@Injectable()
export class ReturnsService {
    tenantAdmins: Observable<any>
    _tenantAdmins: BehaviorSubject<any>;
    baseUrl: string;
    carrierAPI: string;
    actionUrl: string;

    constructor(private http: HttpClient, private _auth: AuthService, private _util: Util) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.carrierAPI = ConfigurationConstants.BASEAPIURLForCarrier;
        //this.carrierAPI = "http://localhost:5000/";
    }

    order(filterValue: string): Observable<any> {
        //return this.http.get(`${this.baseUrl}return/order/${filterValue}`);
        //debugger;
        var options = filterValue.split('|');
        var data = { "ordernumber": options[0], "email": options[1], "LanguageCode": options[2], "BrandCode": (options.length > 3 && options[3] || 'none') }
        return this.http.post(`${this.baseUrl}return/findorder`, JSON.stringify(data));
    }
    orders(AdvancefilterValue: any): Observable<any> {
        //debugger;
        return this.http.post(`${this.baseUrl}return/orders`, JSON.stringify(AdvancefilterValue));
    }
    returnOrder(filterValue: string, queueStatus: string): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}return/${queueStatus}/${filterValue}`);
    }
    return(): boolean {
        return true;
    }
    getReturnOrders(startIndex, endIndex, sortColumn, sortDirection, filterValue, Status, fromDate, toDate, brandCode): Observable<any> {
        return this.http.get(`${this.baseUrl}return/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${fromDate}/${toDate}/${Status}/${brandCode}`);
        //return require('src/assets/RMA.json');
    }

    getlabels(data: any): Observable<any> {
        //console.log(JSON.stringify(data));
        return this.http.post(`${this.carrierAPI}api/carrier`, JSON.stringify(data));
    }

    saveGNRequest(data: any): Observable<any> {
        debugger;
        return this.http.post(
          `${this.baseUrl}return/saveGNreturn`,
          JSON.stringify(data)
        );
    
      }

    saveRMA(data: any, isWarrantyReturnApproved: boolean): Observable<any> {
        //debugger;
        if (data.returnfreight && data.returnfreight.active == true && isWarrantyReturnApproved == true) {
            return this.getlabels(data).pipe(switchMap(result => {
                if (result.status != "ERROR" && result.status != 'FATAL') {
                    var _parcels = data.shipment.parcels;
                    if (result.packages) {
                        data.shipment.parcels = result.packages;
                    }
                    data.labels = result.labelURLs;
                    data.custom_declaration = result.customURLs;

                    //=========New for oversized========//
                    if (data.shipment.parcels.length == _parcels.length) {
                        for (let index = 0; index < data.shipment.parcels.length; index++) {
                            data.shipment.parcels[index].oversized = _parcels[index].oversized;
                        }
                    }
                    return this.http.post(`${this.baseUrl}return/customer`, JSON.stringify(data));
                }
                else {
                    this._util.error("An error has occured while generating the shipping label. Apologies for the inconvenience." + (result.errorMessage ? " - " + result.errorMessage : ''), "Alert");
                    return Observable.empty();
                }
            }));
        }
        else {
            return this.http.post(`${this.baseUrl}return/customer`, JSON.stringify(data));
        }
    }

    uploadImages(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}uploads/files`, data);
    }

    postReturnNotes(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}return/note`, JSON.stringify(data));
    }

    postAuthorizedRequest(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}return/boOrderReject`, JSON.stringify(data));
    }

    getReturnNotes(order: string): Observable<any> {
        return this.http.get(`${this.baseUrl}return/notes/${order}`)
    }

    scanRMA(RMANumber: string, oldStatus: string, newStatus: string): Observable<any> {
        return this.http.get(`${this.baseUrl}return/status/${RMANumber}/${oldStatus}/${newStatus}`)
    }

    UpdateRMAFile(data: any, rmanumber: string): Observable<any> {
        return this.http.post(`${this.baseUrl}return/files/${rmanumber}`, data);
    }

    getUBParcelStatus1(trackNumber): Promise<any> {
        let headers: HttpHeaders = new HttpHeaders({
            'api_key': '72f01b7f-9bc6-41c9-ba1e-8d7481d2cfa7'
        });
        let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        httpOptions.headers = httpOptions.headers.append('api_key', '72f01b7f-9bc6-41c9-ba1e-8d7481d2cfa7');
        return new Promise((resolve, reject) => {
            this.http.get('https://api.coureon.com/api/v1_6/tracking/' + trackNumber, httpOptions)
                .toPromise()
                .then(
                    res => { // Success
                        //console.log(res);
                        resolve(res);
                    }
                );
        });
    }

    GenerateCustomDecalartionLabel(data: any): Observable<any> {
        //return this.http.post(`http://localhost:5000/api/carrier/GenerateShippingLabel`, JSON.stringify(data));
        return this.http.post(`${this.carrierAPI}api/carrier/GenerateCustomDecalartionLabel`, JSON.stringify(data));
    }    

    getPartners(): Observable<any>
    {
        return this.http.get(`${this.baseUrl}common/partners/assigned`);
    }
}
