import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { AuthService } from '../authentication/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.auth.getAuthorizationToken();
    const authUser:string = this.auth.getAuthorizationUser();
    const scope:string=this.auth.getScope();

    this.auth.CheckCurrentSession();
    var authReq = req.clone();
    if(req.url.includes('coureon.com'))
      return next.handle(authReq);
      //|| req.url.includes('/lookup/languages'))
    else if(req.url.includes('/portal/return'))
      authReq = req.clone({ setHeaders: { 'Content-Type':'application/json', Authorization: "Bearer "+authToken, scope:sessionStorage.getItem('_s') } });
    else if(req.url.includes('/portal/uploads/'))
      authReq = req.clone({ setHeaders: { scope:sessionStorage.getItem('_s') } });
    else if(req.url.includes('/oauth/token'))
      authReq = req.clone({ setHeaders: { scope:scope } });
    else if(req.url.includes('/uploads/'))
      authReq = req.clone({ setHeaders: { Authorization: "Bearer "+authToken, user:authUser,scope:scope } });
    else if(authToken)
      authReq = req.clone({ setHeaders: { 'Content-Type':'application/json', Authorization: "Bearer "+authToken, user:authUser,scope:scope } });
    else
      authReq = req.clone({ setHeaders: {'Content-Type':'application/json', scope:scope } });    
    return next.handle(authReq);
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/