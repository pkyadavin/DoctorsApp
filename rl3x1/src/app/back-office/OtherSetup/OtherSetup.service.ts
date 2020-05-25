import { Injectable, Inject } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { OtherSetup } from "./OtherSetup.model";
import { Observable, BehaviorSubject } from 'rxjs';
import { ConfigurationConstants } from '../../shared/constants'
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';

@Injectable()
export class OtherSetupService {
    otherSetup: Observable<OtherSetup[]>
    private _otherSetup: BehaviorSubject<OtherSetup[]>;
    private baseUrl: string;
    endpoint_Url: string = ConfigurationConstants.BASEURL;
    action_Url: string = this.endpoint_Url + "othersetup";

    private dataStore: {
        otherSetup: OtherSetup[];
    }

    constructor(private http: HttpClient, private _auth: AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        this.dataStore = { otherSetup: [] };
        this._otherSetup = <BehaviorSubject<OtherSetup[]>>new BehaviorSubject([]);
        this.otherSetup = this._otherSetup.asObservable();
    }

    loadAll(startIndex, endIndex, partnerID): Observable<any> {
        return this.http.get(`${this.baseUrl}othersetup/LoadOtherSetup/${startIndex}/${endIndex - startIndex}/${partnerID}`);
    }

    Save(_data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}othersetup`, JSON.stringify(_data));
    }

    UploadItemImage(formdata: any): Observable<any> {
        return Observable.create(observer => {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (me: any = this) {
                if (req.readyState === 4 && this.status == 200) {
                    var response = JSON.parse(req.responseText);
                    observer.next(response);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete();
                }
            }

            req.open("POST", `${this.action_Url}/doc`);
            req.setRequestHeader('Authorization', 'Bearer ' + this._auth.getAuthorizationToken());
            req.setRequestHeader('scope', this._auth.getScope());
            req.setRequestHeader('user', this._auth.getAuthorizationUser());
            req.send(formdata);
            //return Observable.empty();
        });
    }
}
