import { Injectable, Inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { tap, delay, catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams,HttpBackend } from '@angular/common/http';
import { ConfigurationConstants } from '../shared/constants';
import { WINDOW } from '../app.window';
import { CustomURLEncoder } from '../shared/customUrlEncode';
import * as moment from "moment-timezone";
import { Router } from '@angular/router';
import { Util } from '../app.util';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  get loginUserName(): string {
    return JSON.parse(this.getAuthorizationUser()).username;
  }
  get loginUserID(): number {
    return JSON.parse(this.getAuthorizationUser()).UserID;
  }
  isLoggedIn = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  private actionUrl: string;
  baseURL: string = "";

  constructor(@Inject(WINDOW) private window: Window, private http: HttpClient, private backhttp: HttpClient ,private router: Router, private _util: Util,private bypasshandler: HttpBackend) {
    this.baseURL = ConfigurationConstants.BASEURL;
    this.backhttp = new HttpClient(bypasshandler);
  }

  CheckCurrentSession() {
    //debugger
    let CurrentMs = new Date().getTime();
    let host = localStorage.getItem(this.getHost());
    if (host) {
      let expirationMS = new Date(JSON.parse(atob(host)).accessTokenExpiresAt).getTime();
      let diff = expirationMS - CurrentMs;
      if (diff < (1000 * 60 * 2)) {
        this.isLoggedIn = false;
        localStorage.removeItem(this.getHost());
        sessionStorage.clear();
        this.router.navigate(['/auth/login']);
      }
    }
    else {
      // if (!(this.window.location.href.indexOf("login") > -1)) {
      //   this.router.navigate(['/auth/login']);
      // }
      if (this.window.location.href.indexOf("portal/res") > -1) {
        return true;
      } else if (!(this.window.location.href.indexOf("login") > -1)) {
        this.router.navigate(["/auth/login"]);
      } else {
        this.router.navigate(["/auth/login"]);
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {
    var base64_password = password //String with '+'
    let body = new HttpParams({ encoder: new CustomURLEncoder() })
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', base64_password);

    //let body = 'grant_type=password&username=' + username + '&password=' + password;// JSON.stringify({ grant_type:"password",username:username,password:password });
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "Basic " + btoa("democlient:democlientsecret")
      })
    };
    this.actionUrl = this.baseURL + "oauth/token";
    return this.backhttp.post(this.actionUrl, body, httpOptions)
      .pipe(
        map(user => {
          //debugger;
          if (user) {
            if (localStorage.getItem(this.getHost()))
              localStorage.removeItem(this.getHost());
            
              sessionStorage.clear();
            localStorage.setItem(this.getHost(), btoa(JSON.stringify(user)));
            setTimeout(() => { this.checkValidSession() }, 1000 * 60 * 59 * 4);
           
            debugger;
            var loggedInUser = JSON.parse(JSON.stringify(user)).user;
            var currentdate : any;
            currentdate = this.GetDate(new Date());
            var logindate = this.GetDate(loggedInUser.LastLoggedInDate);
            var pwdUpdateDate :any;
            pwdUpdateDate = new Date(loggedInUser.PasswordUpdateDate);
            
            //debugger;
            var cureentDateforPasswordexp = new Date();   

            var msec = cureentDateforPasswordexp.getTime() - pwdUpdateDate.getTime();
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            var days = Math.floor(hrs / 24);

           // debugger;
           console.log(loggedInUser);
            if (loggedInUser.FailedLoginAttempt >= 5 && currentdate != logindate) {
              this._util.error('Your Account has been locked due to 5 unsuccessful login attempts. Please contact your System Administrator.', "Error");
              this.isLoggedIn = false;
            }
            else {
              //debugger;
              // if(days >= 90)
              // {
              //   sessionStorage.setItem('passwrdExp',days.toString());
              // }
              sessionStorage.setItem('loginfrst',loggedInUser.IsFirstLoginAttempt);
              //debugger;
              if (loggedInUser.FailedLoginAttempt > 0) {
                this.updateLogin(username, 'Yes', true);
              }
              this.isLoggedIn = true;
            }            
            return this.isLoggedIn;
          }
        }),
        catchError((err) => {
          //debugger;
          this.isLoggedIn = false;

          var data = { UnLocked: false };
          console.log("username" + username)
          console.log("data" + data)
          this.UpdateInvalidLogin(username, 'No', data).
            subscribe(
              result => {
                debugger;
                
                console.log(result);
                if (result.result.trim() == 'locked') {
                  this._util.error('Your Account has been locked due to 5 unsuccessful login attempts. Please contact your System Administrator or try after 24 hour.', "Error");
                }
                else {
                  if (err.indexOf('Too Many Requests') > -1) {
                    this._util.error('Too many login attempts. Please try again after 5 minutes.', "Error");
                  }
                  else {
                    this._util.error('Invalid User Name or Password. Please try again.', "Error");
                  }
                }
              },
              error => {
                console.log('this is error:' + error);
                this._util.error('Invalid User Name or Password. Please try again.', "Error");
              });
          return of(this.isLoggedIn);
        })
      );
  }

  isSessionValid() {
    //let CurrentMs = moment().utc(Date()).getTime();
    //let expirationMS = moment().utc(JSON.parse(atob(localStorage.getItem(this.getHost()))).accessTokenExpiresAt).getTime();
    let CurrentMs = new Date().getTime();
    let expirationMS = new Date(JSON.parse(atob(localStorage.getItem(this.getHost()))).accessTokenExpiresAt).getTime();
    let diff = expirationMS - CurrentMs;
    return diff >= 0;
  }

  private checkValidSession() {
    //console.log('Hit At '+new Date().getSeconds());    
    //let CurrentMs = moment().utc(Date()).getTime();
    //let expirationMS = moment().utc(JSON.parse(atob(localStorage.getItem(this.getHost()))).accessTokenExpiresAt).getTime();
    let CurrentMs = new Date().getTime();
    let expirationMS = new Date(JSON.parse(atob(localStorage.getItem(this.getHost()))).accessTokenExpiresAt).getTime();
    let diff = expirationMS - CurrentMs;
    if (diff < (1000 * 60 * 2))
      this.silentlyLogin();
    // console.log('Expired in '+Math.abs((expirationMS-CurrentMs)/(1000*60))+' mins.');
  }

  private silentlyLogin() {
    let userName = JSON.parse(atob(localStorage.getItem(this.getHost()))).user.username;
    let password = JSON.parse(atob(localStorage.getItem(this.getHost()))).user.password;
    this.login(userName, password).subscribe(
      r => {
        if (r)
          return true;
        else
          return false;
      }
    );
  }

  refreshToken(): any {
    let body = 'grant_type=refresh_token&refresh_token=' + this.getRefreshToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "Basic " + btoa("democlient:democlientsecret")
      })
    };
    this.actionUrl = this.baseURL + "oauth/token";
    this.http.post(this.actionUrl, body, httpOptions)
      .pipe(
        map(user => {
          if (user) {
            localStorage.setItem(this.getHost(), btoa(JSON.stringify(user)));
            this.isLoggedIn = true;
            return this.isLoggedIn;
          }
        }),
        catchError((err) => {
          this.isLoggedIn = false;
          return of(this.isLoggedIn);
        })
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem(this.getHost());
  }

  getAuthorizationToken(): string {
    if (localStorage.getItem(this.getHost()))
      return JSON.parse(atob(localStorage.getItem(this.getHost()))).access_token;
    else
      return null;
  }

  getAuthorizationUser(): string {
    if (localStorage.getItem(this.getHost()))
      return JSON.stringify(JSON.parse(atob(localStorage.getItem(this.getHost()))).user);
    else
      return null;
  }

  getScope(): string {
    var host = this.window.location.hostname;
    let scope: string = host.split('.')[0];
    return scope;
  }

  getHost(): string {
    return this.window.location.hostname;
  }

  getUserScope(): string {
    return JSON.parse(atob(localStorage.getItem(this.getHost()))).user.scope;
  }

  public GetPasswordForUserName(user: any): Observable<any> {
    this.actionUrl = this.baseURL + 'authenticate/forgotpassword';
    return this.http.post(this.actionUrl, JSON.stringify(user));
  }

  private getRefreshToken(): any {
    if (localStorage.getItem(this.getHost()))
      return JSON.parse(atob(localStorage.getItem(this.getHost()))).refresh_token;
    else
      return null;
  }

  lookup(email: string) {
    this.actionUrl = this.baseURL + 'lookup/user/' + email;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.actionUrl, httpOptions);
  }

  ChangePassword(user: any): Observable<any> {
    return this.http.post(this.baseURL + 'users/resetpassword', JSON.stringify(user));
  }

  ResetPassword(pwdchangeData: any): Observable<any> {
    return this.http.put(`${this.baseURL}users/changePassword/${pwdchangeData.userId}`, JSON.stringify(pwdchangeData));
  }

  GetDate(mydate): string {
    var newdate = new Date(mydate);
    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1; //January is 0
    var yyyy = newdate.getFullYear();
    let val: string = "";

    if (dd < 10) {
      val = '0' + dd;
    }
    else {
      val = dd.toString();
    }

    if (mm < 10) {
      val = val + '/' + '0' + mm;
    }
    else {
      val = val + '/' + mm;
    }

    return val + '/' + yyyy;
  }

  updateLogin(username:string, locked:string, IsUnlocked:any) {
    var data = { UnLocked: IsUnlocked };
    this.UpdateInvalidLogin(username, locked, data).
      subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log('this is error:' + error);
        });
  }

  UpdateInvalidLogin(username: string, locked: string, Alldata: any): Observable<any> {
    //debugger;
    return this.http.put(`${this.baseURL}lookup/UpdateInvalidLogin/${username}/${locked}`, JSON.stringify(Alldata));
  }
}
