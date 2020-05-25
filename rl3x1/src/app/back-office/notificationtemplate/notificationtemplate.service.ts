import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { NotificationTemplate } from "./notificationtemplate.model"
import { Language } from "./language.model"
import { ScheduleDay } from "./ScheduleDay.model"
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class NotificationTemplateService {
    notificationTemplates: Observable<NotificationTemplate[]>
    private _notificationTemplates: BehaviorSubject<NotificationTemplate[]>;
    private baseUrl: string;

    private dataStore: {
        notificationTemplates: NotificationTemplate[];
    }

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { notificationTemplates: [] };
        this._notificationTemplates = <BehaviorSubject<NotificationTemplate[]>>new BehaviorSubject([]);
        this.notificationTemplates = this._notificationTemplates.asObservable();
    }

    loadAllLanguage(): Observable<Language[]> {
        return this.http.get<Language[]>(`${this.baseUrl}notificationtemplates/languages`);
    }

    loadLanguagesByBrandID(brandID): Observable<Language[]> {
        return this.http.get<Language[]>(`${this.baseUrl}notificationtemplates/languages/${brandID}`);
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}notificationtemplates/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}`);
    }

    loadAllScheduledays(): Observable<ScheduleDay[]> {
        return this.http.get<ScheduleDay[]>(`${this.baseUrl}notificationtemplates/scheduledays`);
    }

    load(ntID: number | string): Observable<NotificationTemplate> {
        return this.http.get<NotificationTemplate>(`${this.baseUrl}notificationtemplates/NotificationTemplate/${ntID}`);
    }

    loadOnChange(langID, code): Observable<NotificationTemplate> {
        return this.http.get<NotificationTemplate>(`${this.baseUrl}notificationtemplates/NotificationTemplate/${langID}/${code}`);
    }

    loadOnChangeByBrandID(langID, brandID, code): Observable<NotificationTemplate> {
        return this.http.get<NotificationTemplate>(`${this.baseUrl}notificationtemplates/NotificationBylang/${langID}/${brandID}/${code}`);
    }

    save(nt: NotificationTemplate): Observable<any> {
        return this.http.post(`${this.baseUrl}notificationtemplates`, JSON.stringify(nt));
    }

    remove(ntId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}notificationtemplates/${ntId}`);
    }
}