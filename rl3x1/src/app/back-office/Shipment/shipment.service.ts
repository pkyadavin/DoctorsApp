import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ShipmentModel } from './shipment.model';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class ShipmentService {
    shipmentModel: Observable<ShipmentModel[]>
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "shipmentorder";
    private baseAPIUrl: string = ConfigurationConstants.BASEAPIURL;
    private carrier_BaseAPIUrl: string = ConfigurationConstants.BASEAPIURLForCarrier;

    private baseUrl: string;
    private dataStore: {
        shipmentModel: ShipmentModel[]
    };
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { shipmentModel: [] };
    }
    
    loadAll(status, startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}shipmentorder/${status}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }
    load(UserId: number | string, ShippingNumber: string, PartnerID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}shipmentorder/GetSROHeaderByShippingNumber/${UserId}/${ShippingNumber}/${PartnerID}`);
    }
    LoadAvilableServices(tenant: string, ShipmentData: any): Observable<any> {
        console.log(JSON.stringify(ShipmentData));
        return this.http.post(`${this.carrier_BaseAPIUrl}api/carrier/compare?tenant=${tenant}`, JSON.stringify(ShipmentData));
    }
    LoadRate(tenant: string, ShipmentData: any): Observable<any> {
        return this.http.post(`${this.carrier_BaseAPIUrl}api/carrier/rate?tenant=${tenant}`, JSON.stringify(ShipmentData));
    }
    loadAllRMAOrdersInShippingNumber(status, startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID, ShippingNumber, RMADetailID): Observable<any> {
        return this.http.get(`${this.baseUrl}shipmentorder/allshippedorders/${status}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${ShippingNumber}/${RMADetailID}`);
    }
    TrackOrderShipping(SalesReturnOrderDetailID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}shipmentorder/TrackShipping/${SalesReturnOrderDetailID}`);
    }
    CarrierTrack(RMAID: string, carrier: string, tenant: string, number: string): Observable<any> {
        return this.http.post(`${this.carrier_BaseAPIUrl}api/carrier/track?RMAID=${RMAID}&carrier=${carrier}&tenant=${tenant}&number=${number}`, null);
    }
    SaveShipment(itemdata: ShipmentModel): Observable<any> {
        return this.http.post(`${this.baseUrl}shipmentorder`, JSON.stringify(itemdata));
    }
    generateTrackingNumber(RMAID: string, tenant: string, ShipmentData:any): Observable<any> {
        return this.http.post(`${this.carrier_BaseAPIUrl}api/carrier/ship?tenant=${tenant}&RMAID=${RMAID}`, JSON.stringify(ShipmentData));
    }
    
}
