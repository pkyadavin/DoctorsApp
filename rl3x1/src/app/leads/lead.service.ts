import { Injectable, Inject } from "@angular/core"
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from,throwError } from "rxjs";
import { map } from 'rxjs/operators';
import{ConfigurationConstants} from '../shared/constants'
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { environment } from '../../environments/environment'

@Injectable()
export class LeadService {
    tenantAdmins: Observable<any>
    private _tenantAdmins: BehaviorSubject<any>;
    private baseUrl: string;
    private baseAPIUrl: string;

     constructor(private http: HttpClient,private _auth : AuthService) {
         this.baseUrl = ConfigurationConstants.CPORTALBASEURL;
         this.baseAPIUrl = ConfigurationConstants.ADMINPORTALBASEURL;
     }  

    private extractData(res: Response) {
        // if (res && res.json().error) {
        //     throw (res.json().error.message);
        // }
        return res.json();
    }    

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        //console.log(errorMessage);
        return throwError(errorMessage);
      }
    
    GetFeaturesList(TenantID: number = 0): Observable<any> {
        // return this.http.get<any>(`${this.baseUrl}tenantadmins/getproductFeatures/${TenantID}`)
        // .pipe(
        //     retry(1),
        //     catchError(this.handleError)
        //  );

        return this.http.get<any>(`${this.baseUrl}tenantadmins/getproductFeatures/${TenantID}`);        
    } 
    ValidateEmail(email: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}tenantadmins/ValidateEmail/${email}`); 
        //return this.http.get(`${this.baseUrl}tenantadmins/ValidateEmail/${email}`).map(this.extractData);
    }
    GetDomainsList(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/domains`);
    } 
    IsCompanyExists(_data: any): Observable<any> {        
        return this.http.post(this.baseUrl + "tenantadmins/checkcompanyexists", JSON.stringify(_data));
    } 
    GetAdminStateListByCountryID(countryId): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/states/${countryId}`);
    }
    GetAdminCountryList(): Observable<any> {      
        return this.http.get(`${this.baseUrl}tenantadmins/countries`);
    } 
    Save(_data: any): Observable<any> {  
        //  return this.http.post(`${this.baseUrl}tenantadmins`, JSON.stringify(_data));
     
         return Observable.create(observer => {
             var req = new XMLHttpRequest();
             req.onreadystatechange = function (me: any = this) {
                if (req.readyState === 4 && this.status == 200) {
                    //console.log(req.response); 
                    //Outputs a DOMString by default 
                    var response = JSON.parse(req.responseText);
                     observer.next(response);
                     //call complete if you want to close this stream (like a promise)
                     observer.complete();
                }
            }
            req.open("POST", `${this.baseUrl}tenantadmins`);
            req.setRequestHeader('Authorization', 'Bearer ' + this._auth.getAuthorizationToken());
            req.setRequestHeader('scope', this._auth.getScope());
            req.setRequestHeader('user', this._auth.getAuthorizationUser());
             req.send(_data);            
         });
    }
    TermsAndConditions(_data: any): Observable<any> {        
        return this.http.get(`${this.baseUrl}tenantadmins/configsetup/${_data}`);
    } 

    getTypeLookUpByName(typegroup: string): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getTypeLookUpByName/${typegroup}`);
    }           
    GetUnAssignedFeaturesList(TenantID: number = 0): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getUnAssignedProductFeatures/${TenantID}`);
    }  
     
    GetDynamicHeaderNameList(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/headerNameDescList`);
    }    
    GetDynamicDataByTypeName(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/typelookup`);
    }
    GetOrderListSubHeading(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/orderListSubHeading`);
    }    
    GetOrderListHeading(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/orderListHeading`);
    }    
    GetOrderHeadingList(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/orderHeadingList`);
    }     
    GetAvailableCurrency(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getAllCurrency`);
    }

    GetCurrencyListByCurrencyID(Id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getCurrencyById/${Id}`);
    }    
    GetAvailableTimeZone(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getAllTimeZone`);
    }
    GetTimeZoneListByTimeZoneID(Id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getTimeZoneById/${Id}`);
    }    
    GetAvailableLanguage(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getAllLanguage`);
    }

    GetLanguageListByLanguageID(Id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/getLanguageBId/${Id}`);
    }   
    GetTypeLookUpDataByFacilityType(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/facilitytype`);
    }    
    GetTypeLookUpDataByPartnerType(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/partnertype`);
    }

    getavailableTab(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/AvailableRMATab`);
    }

    getRMATab(Id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/GetItemRMAData/${Id}`);
    }    
    GetNodeList(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/nodes`);
    }
    GetTypeLookUpDataByItemStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}tenantadmins/itemStatus`);
    }      
    GetActionsGroupBySystemList(): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/actionsGroupBySystem`);
    }
   GetActionsGroupByOutTaskList(): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/actionsGroupByOutTask`);
   }     
   GetActionsGroupByInTaskList(): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/actionsGroupByInTask`);
   }    
   GetActionsGroupByRepairTaskList(): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/actionsGroupByRepairTask`);
   }
   ValidateZipCode(code: string): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/ValidateZip/${code}`);
   }   
   ValidateEmailUpdate(email: string, tenantId: number): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/ValidateEmailUpdate/${email}/${tenantId}`);
   }
   GetTenantByID(tenantid: number): Observable<any> {
       return this.http.get(`${this.baseUrl}tenantadmins/getbyid/${tenantid}`);
   }   
   Update(_data: any): Observable<any> {
       return this.http.post(this.baseUrl + "tenantadmins/update", JSON.stringify(_data));
   } 
   updateFeaturs(_data: any): Observable<any> {
       return this.http.post(this.baseUrl + "tenantadmins/updateFeaturs", JSON.stringify(_data));
   }
   ChangePassword(_data: any): Observable<any> {       
       return this.http.post(this.baseUrl + "tenantadmins/changepassword", JSON.stringify(_data));       
   }
    
   IsCompanyExistsForUpdate(_data: any): Observable<any> {       
       return this.http.post(this.baseUrl + "tenantadmins/checkcompanyexistsupdate", JSON.stringify(_data));
   } 
   TenantLogin(_data: any): Observable<any> {       
       return this.http.post(this.baseUrl + "tenantadmins/tenantlogin", JSON.stringify(_data));
   } 
   ForgotPassword(_data: any): Observable<any> {       
       return this.http.post(this.baseUrl + "tenantadmins/forgotpassword", JSON.stringify(_data));
   } 
   ContactRequest(_data: any): Observable<any> {       
       return this.http.post(this.baseUrl + "tenantadmins/contactrequest", JSON.stringify(_data));
   }
   
   EnvironmentPrepare(scope): Observable<any> {
       console.log(this.baseAPIUrl + "-"+ scope);
    return this.http.post(`${this.baseAPIUrl}env/prepare/${scope}`, null);
   }
   EnvironmentInit(scope): Observable<any> {
        return this.http.post(`${this.baseAPIUrl}env/init/${scope}`, null);
   }    
}
