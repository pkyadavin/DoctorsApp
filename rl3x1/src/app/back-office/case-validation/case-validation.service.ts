import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import 'rxjs/RX';
import { ConfigurationConstants } from '../../shared/constants'
@Injectable()
export class CaseValidationService {
  private baseUrl: string;
  endpoint_url: string = ConfigurationConstants.BASEURL + "CaseValidation";
  constructor(private http: HttpClient) {
    this.baseUrl = ConfigurationConstants.BASEURL;
  }
  getAllCaseValidation(filterValue: any): Observable<any> {
    
    return this.http.get(this.endpoint_url + `/putCase/${filterValue}`);
    
  }
  getCaseDetailsValidation(filterValue: any): Observable<any> {
    
    return this.http.get(this.endpoint_url + `/getCaseDetails/${filterValue}`);

  }
  getAddressVal(filterValue: any): Observable<any> {

    return this.http.get(this.endpoint_url + `/getEditAddress/${filterValue}`);

  }
  editCaseDetails(filterValue: any): Observable<any> {

    return this.http.get(this.endpoint_url + `/editCaseDetails/${filterValue}`);

  }
}
