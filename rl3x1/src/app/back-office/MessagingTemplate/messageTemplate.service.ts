import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/map';
import { MessageTemplate } from "./MessageTemplate.model";
import { ConfigurationConstants } from '../../shared/constants';
import { MessagingKeyValue } from './MessagingKeyValue.model.js';

@Injectable()
export class MessageTemplateService {
    messageTemplates: Observable<MessageTemplate[]>
    private _messageTemplates: BehaviorSubject<MessageTemplate[]>;
    private baseUrl: string;

    private dataStore: {
        messageTemplates: MessageTemplate[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { messageTemplates: [] };
        this._messageTemplates= <BehaviorSubject<MessageTemplate[]>>new BehaviorSubject([]);
        this.messageTemplates = this._messageTemplates.asObservable();
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue,partnerID): Observable<any> {
        var a=this.http.get(`${this.baseUrl}messageTemplate/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
        return this.http.get(`${this.baseUrl}messageTemplate/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }
    loadkey(): Observable<any> {
        return this.http.get(`${this.baseUrl}messageTemplate/getMessageKeyValue`);
    }
    remove(ID: number): any
    {
   
        return this.http.delete(`${this.baseUrl}messageTemplate/RemoveTemplate/${ID}`);
    }
   
    Save(_data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}messageTemplate`, JSON.stringify(_data));
    }  
}
