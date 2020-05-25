import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { SalesReturnOrder, ApprovalDetails } from './SalesReturnOrder.model';
import { ConfigurationConstants } from '../../shared/constants'
import { AuthService } from 'src/app/authentication/auth.service';
@Injectable()
export class SalesReturnOrderService {
    salesReturnOrders: Observable<SalesReturnOrder[]>
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "salesreturnorder";
    private baseAPIUrl: string = ConfigurationConstants.BASEAPIURL;

    //baseAPIUrl: string = "";
    private baseUrl: string;
    private dataStore: {
        salesReturnOrders: SalesReturnOrder[]
    };
    constructor(private http: HttpClient, private _auth:AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        //this.baseAPIUrl = ConfigurationConstants.BASEAPIURL; 
        this.dataStore = { salesReturnOrders: [] };
    }
    loadAll(status, startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID, GridType, Scope): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/${status}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${GridType}/${Scope}`);
    }
    load(UserId: number | string,id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetSROHeaderById/${UserId}/${id}`);
    }

    loadSROList(UserId: number, StatusCode: string, PartnerId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetSalesReturnOrderByStatus/${UserId}/${StatusCode}/${PartnerId}`);
    }

    loadSROReceivedList(UserId: number, PartnerID: number, ListType: string): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetSalesReturnReceivedItems/${UserId}/${PartnerID}/${ListType}`);
    }

    loadSRORejectedList(UserId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetSalesReturnRejectedItems/${UserId}`);
    }

    GetSroByRMANumber(PartnerID: number, RMANumber: string): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetSroByRMANumber/${PartnerID}/${RMANumber}`);
    }

    getRefundAmount(rid: number, pid: number, qt: number, at: number, md: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/getrefundamount/${rid}/${pid}/${qt}/${at}/${md}`);
    }

    GetRMALog(SalesReturnOrderHeaderID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRMALog/${SalesReturnOrderHeaderID}`);
    }

    GetDiscrepancyList(SalesReturnOrderDetailID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRMADiscrepancy/${SalesReturnOrderDetailID}`);
    }

    GetReturnReasonType(ModuleID: number, Code: string): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetReturnReasonType/${ModuleID}/${Code}`);
    }

    RejectReasonForConsumer(UserId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRejectReasonForConsumer/${UserId}`);
    }

    getTypeLookUpByName(typegroup: string): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/getTypeLookUpByName/${typegroup}`);
    }

    GetReturnReason(): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetReturnReason`);
    }

    loadSODetails(soNumber: string, isCP: boolean, column: string, UserPartnerID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetSODetailsBySONumber/${soNumber}/${isCP}/${column}/${UserPartnerID}`);
    }

    loadDynamicControls(RMAActionCodeID: number, PartnerID: number, SalesReturnOrderDetailID: number, Quantity:number, Price:number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRMADynamicControls/${RMAActionCodeID}/${PartnerID}/${SalesReturnOrderDetailID}/${Quantity}/${Price}`);
    }

    loadDynamicControlsModelWise(RMAActionCodeID: number, ModelID: number, SalesReturnOrderDetailID: number, Quantity: number, Price: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRMADynamicControlsModelWise/${RMAActionCodeID}/${ModelID}/${SalesReturnOrderDetailID}/${Quantity}/${Price}`);
    }

    generateTrackingNumber(RMAID: string, tenant: string): Observable<any> {
        return this.http.post(`${this.baseAPIUrl}api/carrier/ship?tenant=${tenant}&carrier=ups&RMAID=${RMAID}`, null);
    }

    TrackOrderShipping(SalesReturnOrderDetailID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/TrackShipping/${SalesReturnOrderDetailID}`);
    }

    GetShippingLabel(SalesReturnOrderDetailID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/ShippingLabel/${SalesReturnOrderDetailID}`);
    }

    CarrierTrack(RMAID: string, carrier: string, tenant: string, number: string): Observable<any> {
        return this.http.post(`${this.baseAPIUrl}api/carrier/track?RMAID=${RMAID}&carrier=${carrier}&tenant=${tenant}&number=${number}`, null);
    }
     
    //loadReceivingItemById(id: number | string): Observable<PurchaseOrder> {
    //    return this.http.get(`${this.baseUrl}purchaseorder/GetPoReceivingItemByPoHeaderid/${id}`).map(this.extractData)
    //}

    SaveSRO(srorderitem: SalesReturnOrder): Observable<any> {
        console.log(JSON.stringify(srorderitem));
        return this.http.post(`${this.baseUrl}salesreturnorder`, JSON.stringify(srorderitem));   
    }

    ApproveSRO(sroappritem: any): Observable<any> {
        return this.http.post(`${this.baseUrl}salesreturnorder/approval`, JSON.stringify(sroappritem));
    }

    ResolveDescrapency(items: any): Observable<any> {
        return this.http.post(`${this.baseUrl}salesreturnorder/ResolveDescrapency`, JSON.stringify(items));
    }

    getArtifactDetails(id: number): Observable<any> {
        return this.http.get(this.action_Url + "/artifacts/" + id);
    }

    UploadItemImage(formdata: any): Observable<any> {
        return Observable.create(observer => {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (me: any = this) {
                if (req.readyState === 4 && this.status == 200) {
                    console.log(req.response); //Outputs a DOMString by default
                    var response = JSON.parse(req.responseText);
                    observer.next(response);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete();
                }
            }

            req.open("POST", `${this.baseUrl}productcatalog/doc`);
            req.setRequestHeader('Authorization', 'Bearer ' + this._auth.getAuthorizationToken());
            req.setRequestHeader('scope', this._auth.getScope());
            req.setRequestHeader('user', this._auth.getAuthorizationUser());
            req.send(formdata);
            //return Observable.empty();
        });
    }

    UploadReturnDocs(formdata: any): Observable<any> {
        return Observable.create(observer => {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (me: any = this) {
                if (req.readyState === 4 && this.status == 200) {
                    console.log(req.response); //Outputs a DOMString by default
                    var response = JSON.parse(req.responseText);
                    observer.next(response);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete();
                }
            }
            req.open("POST", `${this.action_Url}/doc`);
            req.setRequestHeader('Authorization', 'Bearer ' + this._auth.getAuthorizationToken());
            req.setRequestHeader('scope', this._auth.getScope());
            req.setRequestHeader('user', this._auth.getAuthorizationUser());
            req.send(formdata);
            //return Observable.empty();
        });
    }

    UploadFromBase64(ImageString: string): Observable<any> {
        return this.http.post(`${this.baseAPIUrl}api/Consumer/uploadrmaimages`, ImageString);
    }

    ExportToExcel(OrderType): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/ExportToExcel/${OrderType}`, { responseType: 'blob' })
            // .map(response => {
            //     debugger;
            //     if (response.status == 400) {
            //         return "FAILURE";
            //     } else if (response.status == 200) {
            //         var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            //         var blob = new Blob([(<any>response)._body], { type: contentType });
            //         console.log(blob);
            //         return blob;
            //     }
            // });
    }
}
