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

@Injectable()
export class GaReturnsService {
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

  getGAReturnOrders(
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
      `${this.baseUrl}ga_return/${startIndex}/${endIndex -
        startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${fromDate}/${toDate}/${Status}/${brandCode}`
    );
    //return require('src/assets/RMA.json');
  }

  saveGARequest(data: any): Observable<any> {
    debugger;
    return this.http.post(
      `${this.baseUrl}ga_return/saveGAIAreturn`,
      JSON.stringify(data)
    );
  }

  post_GA_AuthorizedRequest(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}ga_return/ga_authorizationRequest`,
      JSON.stringify(data)
    );
  }

  post_BP_AuthorizedRequest(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}ga_return/bp_authorizationRequest`,
      JSON.stringify(data)
    );
  }

  returnGARequestDetail(
    filterValue: string,
    queueStatus: string
  ): Observable<any> {
    debugger;
    if (filterValue.indexOf("dsc2") != -1)
      return this.http.get(
        `${this.baseUrl}ga_return/${queueStatus}/${filterValue}`
      );
    else
      return this.http.get(
        `${this.baseUrl}bp_return/${queueStatus}/${filterValue}`
      );
  }
}
