import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MRN, IncomingTask } from './receiving.model';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class MRNService {
    arrRMAItemInfo: Observable<MRN[]>
    autoComplete: any;
    private baseUrl: string;
    private dataStore: {
        dataRMAItemInfo: MRN[]
    };

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { dataRMAItemInfo: [] };
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerId, UserId, tabType, actioncode): Observable<any> {
        // return this.http.get(`${this.baseUrl}ItemInfo/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}`).map(this.extractData);
        return this.http.get(`${this.baseUrl}receiving?StartIndex=${startIndex}&PageSize=${endIndex - startIndex}&SortColumn=${sortColumn}&SortDirection=${sortDirection}&FilterValue=${filterValue}&PartnerId=${partnerId}&UserId=${UserId}&tabType=${tabType}&actioncode=${actioncode}`);
    } 

    loadAllDamaged(ItemModelID: number | string): Observable<any> {        
        return this.http.get(`${this.baseUrl}Models/GetModelDamaged/${ItemModelID}`);
    }   

    loadAllAccessories(ItemModelID: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetItemAccessories/${ItemModelID}`);
    }

    load(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/get/${id}`);
    }

    SaveMRN(mrn: MRN): Observable<any> {
        return this.http.post(`${this.baseUrl}receiving`, JSON.stringify(mrn));
    }
    SavePutAway(mrn: any): Observable<any> {
        return this.http.post(`${this.baseUrl}receiving/SavePutAway`, JSON.stringify(mrn));
    }
    SaveScanMRN(mrn: MRN): Observable<any> {
        return this.http.post(`${this.baseUrl}receiving/Scan`, JSON.stringify(mrn));
    }
    ValidateSN(SNList: any): Observable<any> {
        return this.http.post(`${this.baseUrl}receiving/ValidateSN`, JSON.stringify(SNList));
    }

    GetCarriers(partnerId): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/Carriers`);
    }

    GetWorkflowID(reftype, refnumber): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetWorkflowID?RefType=${reftype}&RefNumber=${refnumber}`);
    }

    GetReceivingActions(workflowID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/ReceivingActions/${workflowID}`);
    }

    GetLines(headerId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/Lines/${headerId}`);
    }

    GetRefsFromTaskQueue(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerId, UserId): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/TaskQueue?StartIndex=${startIndex}&PageSize=${endIndex - startIndex}&SortColumn=${sortColumn}&SortDirection=${sortDirection}&FilterValue=${filterValue}&PartnerId=${partnerId}&UserId=${UserId}`);
    }

    GetPartnerDetailsByPO(iTask: IncomingTask): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetPartnerDetailsByPO/${iTask.RefType}/${iTask.RefId}`);
    }

    GetPartnerDetailsBySTO(iTask: IncomingTask): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetPartnerDetailsBySTO/${iTask.RefType}/${iTask.RefId}`);
    }

    GetPartnerDetailsByIO(iTask: IncomingTask): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetPartnerDetailsByIO/${iTask.RefType}/${iTask.RefId}`);
    }
    GetPartnerDetailsBySRO(iTask: IncomingTask): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetPartnerDetailsBySRO/${iTask.RefType}/${iTask.RefId}`);
    }

    GetNodes(): Observable<any> {
        return this.http.get(`${this.baseUrl}common/Node`);
    }
    GetGrade(): Observable<any> {
        return this.http.get(`${this.baseUrl}common/Grade`);
    }
    GetLocationByPartner(partnerId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/Location/${partnerId}`);
    }
    GetLocationByCode(partnerId: number, LocationCode: string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/LocationByCode/${partnerId}/${LocationCode}`);
    }
    GetPartnerLocationByPartner(partnerId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}common/PartnerLocation/${partnerId}`);
    }
    GetAllStatusByType(Type): Observable<any> {
        return this.http.get(`${this.baseUrl}common/typelookup/${Type}`);
    }
    GetRefHeaderLines(TypeCode, RefTypeID, PartnerID, UserID): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetRefHeaderLines/${TypeCode}/${RefTypeID}/${PartnerID}/${UserID}`);
    }
    GetRMALines(Userid, PartnerId, RefType): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetRMALines/${Userid}/${PartnerId}/${RefType}`);
    }
    GetReceivingScanItem(PartnerId, ScanValue): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetReceivingScanItem/${PartnerId}/${ScanValue}`);
    }
    OnSearchItemNumber(startsWith) {
        return this.autoComplete.http.get(`${this.autoComplete.http.global.baseUrl}common/SearchItemNumber/${startsWith}/${this.autoComplete.http.global.TypeCode}/${this.autoComplete.http.global.RefTypeID}`);
    }

    OnSearchSerialNumber(startsWith) {
        return this.autoComplete.http.get(`${this.autoComplete.http.global.baseUrl}common/SearchSerialNumber/${startsWith}/${this.autoComplete.http.global.ItemMasterID}/${this.autoComplete.http.global.PartnerID}`);
    }
    ExportToExcel(OrderType): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/ExportToExcel/${OrderType}`, { responseType: 'blob' })
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

    loadDynamicControls(RMAActionCodeID: number, PartnerID: number, SalesReturnOrderDetailID: number, Quantity: number, Price: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRMADynamicControls/${RMAActionCodeID}/${PartnerID}/${SalesReturnOrderDetailID}/${Quantity}/${Price}`);
    }

    loadDynamicControlsModelWise(RMAActionCodeID: number, ModelID: number, SalesReturnOrderDetailID: number, Quantity: number, Price: number): Observable<any> {
        return this.http.get(`${this.baseUrl}salesreturnorder/GetRMADynamicControlsModelWise/${RMAActionCodeID}/${ModelID}/${SalesReturnOrderDetailID}/${Quantity}/${Price}`);
    }

    getTypeLookUpByName(typegroup: string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/getTypeLookUpByName/${typegroup}`);
    }
    GetMRNItem(PartnerID: number, ActionCode: string, MRNNumber: string, UserID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetMRNItem/${PartnerID}/${ActionCode}/${MRNNumber}/${UserID}`);
    }
    ScanSerialItem(PartnerID: number, MRNNumber: string, FilterValue: string, ActionCode: string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/ScanSerialItem/${PartnerID}/${MRNNumber}/${FilterValue}/${ActionCode}`);
    }
    ScanNonSerialItem(PartnerID: number, StatusCode: string, FilterValue: string, SalesReturnOrderNumber: string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/ScanNonSerialItem/${PartnerID}/${StatusCode}/${FilterValue}/${SalesReturnOrderNumber}`);
    }
    UpdateContainer(item: any, Action: string): Observable<any> {
        return this.http.put(`${this.baseUrl}receiving/${Action}`, JSON.stringify(item))
    }
    GetContainer(Action: string, PartnerID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetContainer/${Action}/${PartnerID}`);
    }
    CheckContainer(Container:string): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/CheckContainer/${Container}`);
    }
    GetPutAwayContainer(PartnerID: number, UserID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GetPutAwayContainer/${PartnerID}/${UserID}`);
    }
    UpdateMrnItemStatus(item: any): Observable<any> {
        return this.http.put(`${this.baseUrl}receiving`, JSON.stringify(item))
    }
    GenerateContainerNumber(PartnerID: number): Observable<any> {
        return this.http.get(`${this.baseUrl}receiving/GenerateContainerNumber/${PartnerID}`);
    }
}