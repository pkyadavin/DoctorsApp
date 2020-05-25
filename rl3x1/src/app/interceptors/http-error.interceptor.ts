import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError, tap, finalize } from "rxjs/operators";
declare var $: any;
let requests: number = 0;
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    requests++;
    //console.log('requests(+): '+requests+'-'+request.url);
    $(".blocker").removeClass("blocker-inactive");
    $("body").addClass("no-scroll");
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //debugger;
        let errorMessage = "";
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          //console.log("Error Code:",error);
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
      }),
      finalize(() => {
        //debugger;
        requests--;
        if (requests <= 0) $(".blocker").addClass("blocker-inactive");
        $("body").removeClass("no-scroll");
        //console.log("Error Code:",error);
        //console.log('requests(-f): '+requests+'-'+request.url);
      })
    );
  }
}
