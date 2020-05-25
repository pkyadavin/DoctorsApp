import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class OrderTaskFlowService {
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "ordertaskflow";

    constructor(private http: HttpClient) {
        this.http = http;
    }

    //getOrderModuleStatus(id: number): Observable<any> {
    //    return this.http.get(this.action_Url + "/status" + id)
    //        .map(this.extractData)
    //        .catch((res: Response) => this.handleError(res));
    //}

    getTaskFlow(id: number): Observable<any> {
        return this.http.get(this.action_Url + "/taskflow/" + id);
    }

    getModuleRules(moduleId: number): Observable<any> {
        return this.http.get(this.action_Url + "/rules/" + moduleId);
    }

    Save(id: number, taskflows: any): Observable<any> {

        return this.http.post(this.action_Url + "/" + id, JSON.stringify(taskflows));
    }

    getTaskActions(moduleId: number): Observable<any> {
        return this.http.get(this.action_Url + "/action/" + moduleId);
    }
}