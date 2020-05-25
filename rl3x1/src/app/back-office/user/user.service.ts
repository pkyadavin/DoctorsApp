import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './User.model';
import { Country, State, Language } from '../../shared/common.model';
import { ConfigurationConstants } from '../../shared/constants'
import { AuthService } from 'src/app/authentication/auth.service';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UserService {
    users: Observable<User[]>
    private baseUrl: string;

    constructor(private http: HttpClient, private _auth: AuthService) {
        this.baseUrl = ConfigurationConstants.BASEURL;
        //this.dataStore = { users: [] };
    }

    loadAll(startIndex, endIndex, sortColumn, sortDirection, filterValue, partnerID, Scope, userGridType): Observable<any> {
        debugger;
        return this.http.get(`${this.baseUrl}users/${startIndex}/${endIndex - startIndex}/${sortColumn}/${sortDirection}/${filterValue}/${partnerID}/${Scope}/${userGridType}`);
    }

    loadCountries(): Observable<any> {
        var userId = 0;
        return this.http.get(`${this.baseUrl}users/AllCountry/${userId}`);
    }

    loadStates(countryId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/AllState/${countryId}`);
    }

    loadCity(stateId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/AllCity/${stateId}`);
    }

    loadRoles(userId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/AllRole/${userId}`);
    }

    loadSelectedUserRoles(userId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/SelectedUserRoles/${userId}`);
    }

    loadPartners(userId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/AllPartner/${userId}`);
    }

    loadSelectedPartners(userId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/SelectedUserPartners/${userId}`);
    }

    load(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/${id}`);
    }

    GetUserType(): Observable<any> {
        return this.http.get(this.baseUrl + "common/usertype");
    }

    importUsers(data, partnerID): Observable<any> {
        return this.http.post(`${this.baseUrl}users/import/${partnerID}`, JSON.stringify(data));

    }

    remove(userId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}users/${userId}`);
    }

    save(user: any): Observable<any> {
        return this.http.post(`${this.baseUrl}uploads/UpdateUser`, user);
    }

    UploadProfileImage(formdata: any): Observable<any> {
        return this.http.post(`${this.baseUrl}uploads/profileimage`, formdata);
    }

    ChangePassword(pwdchangeData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}users/changePassword/${pwdchangeData.userId}`, JSON.stringify(pwdchangeData));
    }

    ChangeTheme(user: any): Observable<any> {
        return this.http.post(`${this.baseUrl}users/updateUserTheme/${user.UserID}`, JSON.stringify(user));
    }

    loadUserRoleMapping(userId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}users/UserRole/${userId}`);
    }

    setEncryption(keys, value){
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = CryptoJS.enc.Utf8.parse(keys);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    
        return encrypted.toString();
      }
    
      //This method is use for decrypt the value.
      setDecryption(keys, value){
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = CryptoJS.enc.Utf8.parse(keys);
        var decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
}
