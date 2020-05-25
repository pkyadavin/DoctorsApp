import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Partner, PartnerAddress } from './Partner.model';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class PartnerService {
    partners: Observable<Partner[]>
    private baseUrl: string;
    //private dataStore: {
    //    partners: Partner[]
    //};

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        //this.dataStore = { partners: [] };
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerType, status, partnerID, PIN, ChildOnly: boolean): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerType}/${status}/${partnerID}/${PIN}/${ChildOnly}`);
    }
 
    loadAllByPost(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerType, status, partnerID, PIN, ChildOnly: boolean, arry: any): Observable<any> {
        return this.http.post(`${this.baseUrl}partners/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerType}/${status}/${partnerID}/${PIN}/${ChildOnly}`, JSON.stringify(arry));
    }

    loadChilds(partnerType, partnerID, Scope): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/ChildAccounts/${partnerType}/${partnerID}/${Scope}`);
    }

    load(partnerId: number | string, typeId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getbyId/${partnerId}/${typeId}`);
    }

    loadByCode(partnerCode: string | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getbyCode/${partnerCode}`);
    }

    GetModuleControlValue(): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/GetModuleControlValue`);
    }

    importAccount(data, partnerID): Observable<any> {
        return this.http.post(`${this.baseUrl}partners/import/${partnerID}`, JSON.stringify(data));

    }


    loadAccountDetail(accId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getAccountbyId/${accId}`);
    }

    loadPartnerODPair(partnerId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getPartnerODPair/${partnerId}`);
    }


    GetPartnerODMap(partnerId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/GetPartnerODMap/${partnerId}`);
    }

    GetCarrierODPairByLaneId(CarrierLaneID: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/GetCarrierODPairByLaneId/${CarrierLaneID}`);
    }

    loadPartnerLane(partnerId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getPartnerLane/${partnerId}`);
    }



    loadPartnerLaneCol(FormName: string): Observable<any> {
        return this.http.get(`${this.baseUrl}address/addressColumn/${FormName}`);
    }

    loadOrigionDestAddress(partnerId: number | string, typeID: number | string, AddressID: number | string, formName: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getOrigionDestAddress/${partnerId}/${typeID}/${AddressID}/${formName}`);
    }

    loadRouteLocation(): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/GetRouteLocation`);
    }

    remove(partnerId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}partners/${partnerId}`);
    }

    save(partner: any, PartnerType: string): Observable<any> {
        return this.http.post(`${this.baseUrl}partners/save/${PartnerType}`, JSON.stringify(partner));

    }

    updatePartnerAddress(partnerAddress: PartnerAddress[], deletedAddressId: number[], PartnerID: number): Observable<any> {
        return this.http.post(`${this.baseUrl}partners/postPartnerAddress/${deletedAddressId}/${PartnerID}`, JSON.stringify(partnerAddress));
    }

    getPartnerAddress(id: number | string, addressId: number | string, loginPartnerID: number): Observable<any> {
        return this.http.get(this.baseUrl + "partners/" + id + "/address/" + addressId + "/" + loginPartnerID);
    }

    loadUserRoleMapping(partnerId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/UserRole/${partnerId}`);
    }

    loadConfigMaps(partnerId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/ConfigMap/${partnerId}`);
    }

    loadAllPartner(FacilityID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getAllPartner/${FacilityID}`);
    }

    loadRetReasonRuleMapping(partnerId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/ReasonRule/${partnerId}`);
    }

    getPartnerFacilityMap(PartnerID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getPartnerFacilityMap/${PartnerID}`);
    }
    getHubsPartnersMap(PartnerID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/getPartnerByHub/${PartnerID}`);
    }

    loadSeasonalConfigData(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerType, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerType}/${status}/${partnerID}`);
    }

    getLanguagesForBrand(partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/Languages/${partnerID}`);
    }

    getFAQForBrand(langCode, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}partners/FAQ/${partnerID}/${langCode}`);
    }

}
