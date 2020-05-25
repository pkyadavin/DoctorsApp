import { Injectable, Inject } from "@angular/core";
import { Observable, BehaviorSubject, of, from, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ConfigurationConstants } from "src/app/shared/constants";
import { AuthService } from "src/app/authentication/auth.service";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
  JsonpInterceptor
} from "@angular/common/http";
import { keyValue, _OrderObject } from "./return.model";
import { AnyFn } from "@ngrx/store/src/selector";
import { Util } from "src/app/app.util";
declare var $: any;

@Injectable()
export class ReturnService {
  tenantAdmins: Observable<any>;
  _tenantAdmins: BehaviorSubject<any>;
  baseUrl: string;
  carrierAPI: string;
  actionUrl: string;

  private _orderFound: boolean = false;
  private _brandconfig: any;
  private _FAQ: any;
  private _langKeyVal: any;
  private _lblSummaryLabel: string;

  get orderFound(): boolean {
    return this._orderFound;
  }
  set orderFound(lv: boolean) {
    this._orderFound = lv;
  }
  get brandconfig(): any {
    return this._brandconfig;
  }
  set brandconfig(lv: any) {
    this._brandconfig = lv;
  }
  get FAQ(): any {
    return this._FAQ;
  }
  set FAQ(lv: any) {
    this._FAQ = lv;
  }
  get langKeyVal(): any {
    return this._langKeyVal;
  }
  set langKeyVal(lv: any) {
    this._langKeyVal = lv;
  }
  get lblSummaryLabel(): string {
    return this._lblSummaryLabel;
  }
  set lblSummaryLabel(lv: string) {
    this._lblSummaryLabel = lv;
  }

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _util: Util
  ) {
    this.baseUrl = ConfigurationConstants.BASEURL;
    this.carrierAPI = ConfigurationConstants.BASEAPIURLForCarrier;
    //this.carrierAPI = "http://localhost:5000/";
  }
  URLSchema: Array<keyValue>;

  getTemplateByObject(key: any): any {
    let Obj = this.URLSchema.filter(f => f.key == key)[0];
    //console.log('keyDisplay',Obj);
    return Obj.value;
  }
  getTemplateSchema(keyval: any): string {
    var arr: any = [];
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

  getValueFromSchemaByKey(key: string) {
    let Obj = this.URLSchema.filter(f => f.key == key)[0];
    if (Obj) return Obj.value;
    else return "";
  }

  removeKeyFromTemplateSchema(keyval: any) {
    keyval.forEach((v1, i1) => {
      this.URLSchema.forEach((v2, i2) => {
        if (v2.key == v1.key) {
          this.URLSchema.splice(i2, 1);
        }
      });
    });
  }

  set setTemplateSchema(templateSchema) {
    this.URLSchema = templateSchema;
  }

  getLanguage(
    BrandCode: string,
    LanguageCode: string = "en-us"
  ): Observable<any> {
    this.actionUrl =
      this.baseUrl +
      "lookup/languages/" +
      BrandCode +
      "/" +
      LanguageCode +
      "/0";
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get(this.actionUrl, httpOptions);
  }

  brandConfig(brand: string, language: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}lookup/languages/${brand}/${language}`
    );
  }

  order(filterValue: string): Observable<any> {
    console.log(filterValue);
    var options = filterValue.split("|");
    var data = {
      ordernumber: options[0],
      email: options[1],
      LanguageCode: options[2],
      BrandCode: (options.length > 3 && options[3]) || "none"
    };
    // console.log("orderdata: "+JSON.stringify(data));
    return this.http.post(
      `${this.baseUrl}portal/return/findorder`,
      JSON.stringify(data)
    );
  }

  myorders(
    filterValue: string,
    brand: string,
    searchtext: string
  ): Observable<any> {
    debugger;
    return this.http.get(
      `${this.baseUrl}portal/return/track-all/${filterValue}/${brand}/${searchtext}`
    );
  }

  getCountryandReason(filterValue: string) {
    var options = filterValue.split(",");
    var data = {
      LanguageCode: options[0],
      BrandCode: options[1]
    };
    return this.http.post(
      `${this.baseUrl}portal/ga_return/fetchreturndata`,
      JSON.stringify(data)
    );
  }
  trackstatusByRef(filterValue: string): Observable<any> {
    //debugger;
    return this.http.get(
      `${this.baseUrl}portal/return/trackByRef/${filterValue}`
    );
  }

  returnOrder(filterValue: string): Observable<any> {
    return this.http.get(`${this.baseUrl}portal/return/all/${filterValue}`);
  }

  getReturnOrders(
    startIndex,
    endIndex,
    sortColumn,
    sortDirection,
    filterValue,
    Status
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}return/${startIndex}/${endIndex -
      startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${Status}`
    );
  }

  saveRMAOrderDetail(data: any): Observable<any> {
    //console.log(JSON.stringify(data))
    return this.http.post(
      `${this.baseUrl}return/customer`,
      JSON.stringify(data)
    );
  }

  uploadImages(_formData: any): Observable<any> {
    debugger;
    console.log("_formData", _formData);
    return this.http.post(`${this.baseUrl}portal/uploads/files`, _formData);
    //return this.http.post(`${this.baseUrl}common/userimage`, JSON.stringify(data));
  }

  getlabels(data: any): Observable<any> {
    //console.log(JSON.stringify(data));
    return this.http.post(
      `${this.carrierAPI}api/carrier`,
      JSON.stringify(data)
    );
  }

  saveTempRMA(data: any): Observable<any> {
    //debugger;
    return this.http.post(
      `${this.baseUrl}portal/return/saveGNreturn`,
      JSON.stringify(data)
    );
  }
  //#region APIs for GA/IA return flow
  saveGAIA(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}portal/ga_return/saveGAIAreturn`,
      JSON.stringify(data)
    );
  }

  getGAIAConfirmation(filterValue: string): Observable<any> {
    //debugger;
    return this.http.get(
      `${this.baseUrl}portal/ga_return/trackByRef/${filterValue}`
    );
  }
  //#endregion

  //Cancel the return request
  cancelrequest(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}portal/return/cancelReturnRequest`,
      JSON.stringify(data)
    );
  }

  saveRMA(
    data: any,
    isInWarranty: boolean,
    errMsg: string,
    generate_label: boolean
  ): Observable<any> {
    if (isInWarranty == true || generate_label == false) {
      return this.http.post(
        `${this.baseUrl}portal/return/customer`,
        JSON.stringify(data)
      );
    } else {
      return this.getlabels(data).pipe(
        switchMap(result => {
          if (result.status != "ERROR" && result.status != "FATAL") {
            var _parcels = data.shipment.parcels;

            if (result.packages) {
              data.shipment.parcels = result.packages;
            }

            data.labels = result.labelURLs;
            data.custom_declaration = result.customURLs;

            //=========New for oversized========//
            if (data.shipment.parcels.length == _parcels.length) {
              for (
                let index = 0;
                index < data.shipment.parcels.length;
                index++
              ) {
                data.shipment.parcels[index].oversized =
                  _parcels[index].oversized;
              }
            }

            return this.http.post(
              `${this.baseUrl}portal/return/customer`,
              JSON.stringify(data)
            );
          } else {
            this._util.error(
              errMsg +
              (result.errorMessage ? +" - " + result.errorMessage : ""),
              "Alert"
            );
            return Observable.empty();
          }
        })
      );
    }
  }

  getUBParcelStatus1(trackNumber): Promise<any> {
    let headers: HttpHeaders = new HttpHeaders({
      api_key: "72f01b7f-9bc6-41c9-ba1e-8d7481d2cfa7"
    });
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    httpOptions.headers = httpOptions.headers.append(
      "api_key",
      "72f01b7f-9bc6-41c9-ba1e-8d7481d2cfa7"
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          "https://api.coureon.com/api/v1_6/tracking/" + trackNumber,
          httpOptions
        )
        .toPromise()
        .then(res => {
          // Success
          //console.log(res);
          resolve(res);
        });
    });
  }

  GenerateCustomDecalartionLabel(data: any): Observable<any> {
    return this.http.post(
      `http://localhost:3000/api/carrier/GenerateShippingLabel`,
      JSON.stringify(data)
    );
    //return this.http.post(`${this.carrierAPI}api/carrier/GenerateCustomDecalartionLabel`, JSON.stringify(data));
  }

  //#region APIs for BlueParrott return flow
  saveBlueParrottReturn(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}portal/bp_return/saveBPreturn`,
      JSON.stringify(data)
    );
  }

  getBPConfirmation(filterValue: string): Observable<any> {
    //debugger;
    return this.http.get(
      `${this.baseUrl}portal/bp_return/trackByRef/${filterValue}`
    );
  }
  //#endregion

  //region Consumer flow
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

  returnConsumerRequestDetail(
    filterValue: string,
    queueStatus: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}portal/consumer_return/${queueStatus}/${filterValue}`
    );
  }

  updaetConsumerreturn(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}portal/consumer_return/updaetConsumerreturn`,
      JSON.stringify(data)
    );
  }

  consumer_initiation(langcode: string, brandcode: string): Observable<any> {
    //debugger;
    return this.http.get(
      `${this.baseUrl}portal/consumer_return/consumerInitiation/${langcode}/${brandcode}`
    );
  }

  //endregion
}
