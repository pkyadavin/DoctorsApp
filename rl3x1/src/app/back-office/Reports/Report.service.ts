import { Injectable, Inject } from "@angular/core"
 
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/map';
import { ConfigurationConstants } from '../../shared/constants'
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ReportService {
    
    private baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
    }

    GetInventories(partnerID, modelID, ItemID, NodeID, LocationID, startIndex, endIndex, sortColumn, sortDirection, FilterValue): Observable<any> {
        return this.http.get(`${this.baseUrl}reports/GetItems/${partnerID}/${modelID}/${ItemID}/${NodeID}/${LocationID}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${FilterValue}`);
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }
    //
    GetInventories1(partnerID, modelID, ItemID, NodeID, LocationID, startIndex, endIndex, sortColumn, sortDirection, FilterValue): Observable<any> {
        return this.http.get(`${this.baseUrl}reports/GetItems/${partnerID}/${modelID}/${ItemID}/${NodeID}/${LocationID}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${FilterValue}`);
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }
  
    GetInventoryHistory(partnerID, ItemID, startDate, endDate, startIndex, endIndex, sortColumn, sortDirection, FilterValue): Observable<any> {
        return this.http.get(`${this.baseUrl}reports/GetItemContextHistory/${partnerID}/${ItemID}/${startDate}/${endDate}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${FilterValue}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }
    GetInventoryHistory1(partnerID, ItemID, startDate, endDate, startIndex, endIndex, sortColumn, sortDirection, FilterValue): Observable<any> {
        return this.http.get(`${this.baseUrl}reports/GetItemContextHistory1/${partnerID}/${ItemID}/${startDate}/${endDate}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${FilterValue}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }


    GetItemSerials(partnerID, modelID, ItemID, NodeID, LocationID, startIndex, endIndex, sortColumn, sortDirection, FilterValue): Observable<any> {
        return this.http.get(`${this.baseUrl}reports/GetItemSerials/${partnerID}/${modelID}/${ItemID}/${NodeID}/${LocationID}/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${FilterValue}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }

    //added for pop up
    GetItemSerials1(partnerID: number, modelID: number, ItemID: number, NodeID: number, LocationID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}reports/GetItemSerials1/${partnerID}/${modelID}/${ItemID}/${NodeID}/${LocationID}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    }
    //till here



    load(id: number | string): Observable<any> {

        return this.http.get(`${this.baseUrl}reports/${id}`)
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));
    } 

    //GetInventories(searchParams:any): Observable<any> {
    //    return this.http.post(`${this.baseUrl}reports`, JSON.stringify(searchParams)) 
    //    //return this.http.post(`${this.baseUrl}reports/${partnerIDs}/${nodeIDs}/${modelIDs}/${locationIDs}/${itemNumberIDs}/${searchCriteria}`).map(this.extractData);
    //}


    Save(_data: any, HdrId: number, UserId: number, PartnerID: number): Observable<any> {
        return this.http.post(`${this.baseUrl}reports/${HdrId}/${UserId}/${PartnerID}`, JSON.stringify(_data))
            // .map(this.extractData)
            // .catch((res: Response) => this.handleError(res));

    }
    //Save(intakeorderitem: Inventory): Observable<any> {
    //    debugger;
    //    return this.http.post(`${this.baseUrl}intakeOrder`, JSON.stringify(intakeorderitem))
    //}

    // private extractData(res: Response) {
    //     let body = res.json();
    //     return body || {};
    // }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}