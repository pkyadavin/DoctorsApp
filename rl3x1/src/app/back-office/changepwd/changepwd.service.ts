import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from, throwError } from "rxjs";
import { ConfigurationConstants } from '../../shared/constants'
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ChangePwdService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = ConfigurationConstants.BASEURL;
  }  

  ChangePassword(pwdchangeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}users/changePassword/${pwdchangeData.userId}`, JSON.stringify(pwdchangeData));
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
}