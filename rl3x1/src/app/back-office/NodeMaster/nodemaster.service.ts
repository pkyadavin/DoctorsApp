import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { NodeMaster } from './nodemaster.model';
import { ConfigurationConstants } from '../../shared/constants'

@Injectable()
export class NodeMasterService {
    nodeMasters: Observable<NodeMaster[]>
    private baseUrl: string;
    //private dataStore: {
    //    NodeMasters: NodeMaster[]
    //};

    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        // this.dataStore = { NodeMasters: [] };
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, PartnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}nodemaster/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${PartnerID}`);
    }

    load(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}nodemaster/GetNodeById/${id}`);
    }


    loadAllActiveNode(): Observable<any> {
        return this.http.get(`${this.baseUrl}nodemaster/loadAll`);
    }

    create(nodeMaster: NodeMaster): Observable<any> {
        return this.http.post(`${this.baseUrl}nodemaster`, JSON.stringify(nodeMaster));
    }

    remove(nodeMasterId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}nodemaster/${nodeMasterId}`);
    }

    update(nodeMaster: NodeMaster): Observable<any> {
        return this.http.put(`${this.baseUrl}nodemaster/${nodeMaster.NodeID}`, JSON.stringify(nodeMaster));

    }
}
