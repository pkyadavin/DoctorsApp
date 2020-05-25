import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {AuthInterceptor} from './auth.interceptor';
import {UploadInterceptor} from './upload.interceptor';
import {HttpsInterceptor} from './https.interceptor';
import {HttpErrorInterceptor} from './http-error.interceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },  
    { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },  
  ];