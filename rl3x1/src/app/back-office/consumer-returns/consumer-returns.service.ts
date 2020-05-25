import { Injectable, Inject } from "@angular/core";
import { Observable, BehaviorSubject, of, from, throwError } from "rxjs";
import { map, switchMap, filter } from "rxjs/operators";
import { retry, catchError } from "rxjs/operators";
import { ConfigurationConstants } from "src/app/shared/constants";
import { AuthService } from "src/app/authentication/auth.service";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";
import { Util } from "src/app/app.util";
import { keyValue } from "./consumer-returns.model";
@Injectable()
export class ConsumerReturnsService {
  URLSchema: Array<keyValue>;

  tenantAdmins: Observable<any>;
  _tenantAdmins: BehaviorSubject<any>;
  baseUrl: string;
  carrierAPI: string;
  actionUrl: string;

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _util: Util
  ) {
    this.baseUrl = ConfigurationConstants.BASEURL;
  }

  getConsumerReturnOrders(
    startIndex,
    endIndex,
    sortColumn,
    sortDirection,
    filterValue,
    Status,
    fromDate,
    toDate,
    brandCode
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}consumer_return/${startIndex}/${endIndex -
      startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${fromDate}/${toDate}/${Status}/${brandCode}`
    );
    //return require('src/assets/RMA.json');
  }

  saveConsumerRequest(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}consumer_return/saveConsumerreturn`,
      JSON.stringify(data)
    );
  }

  returnConsumerRequestDetail(
    filterValue: string,
    queueStatus: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}consumer_return/${queueStatus}/${filterValue}`
    );
  }

  getProductDetail(
    filterValue: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}common/allitems/${filterValue}`
    );
  }

  getColorDetail(
    filterValue: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}common/allcolor/${filterValue}`
    );
  }
  
  getTemplateSchema(keyval: any): string {
    var arr: any = [];
    console.log(keyValue);
    keyval.forEach((v1, i1) => {
      this.URLSchema.forEach((v2, i2) => {
        // console.log('v2',v2.value);
        // console.log('v1',v1.value);
        if (v2.key == v1.key) {
          v2.value = v1.value;
        }
      });
    });

    this.URLSchema.forEach((v, i) => {
      arr.push(v.value);
    });

    return arr.join("/");
  }

  consumer_authorizationRequest(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}consumer_return/consumer_authorizationRequest`,
      JSON.stringify(data)
    );
  }

  consumer_initiation(langcode: string, brandcode: string): Observable<any> {
    //debugger;
    return this.http.get(
      `${this.baseUrl}consumer_return/consumerInitiation/${langcode}/${brandcode}`
    );
  }
}