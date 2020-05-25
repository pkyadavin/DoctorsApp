import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./authentication/auth.service";
import { SidebarService } from "./back-office/sidebar/sidebar.service";
import { WINDOW } from "./app.window";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(WINDOW) private window: Window,
    private _menu: SidebarService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(state.url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(next, state) && this.hasAccess(state.url);
  }

  checkLogin(url: string): boolean {
    if (
      this.authService.getAuthorizationToken() &&
      this.authService.isSessionValid()
    ) {
      if (url == "/") {
        if (this.authService.getScope() == "manage")
          this.router.navigate(["/manage/home"]);
        else this.router.navigate(["/back-office/home"]);
      }
      return true;
    }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    var host = this.window.location.hostname;
    let scope: string = host.split(".")[0];
    if (scope == "jabracp-dev") {
      this.router.navigate(["portal/404"]);
      return false;
    }
    if (url == "/")
      this.router.navigate(["/auth/login"], { relativeTo: this.route });
    else
      this.router.navigate(["/auth/login"], {
        queryParams: { returnUrl: url },
        relativeTo: this.route
      });
    return false;
  }
  
  hasAccess(url: string) {
    var _hasAccess = true;
    var myRoute = url;
    var tree = url.split("/");
    if (url.indexOf("queue") != -1) {
      var tree = url.split("/");
      if (tree.length > 5) {
        myRoute = tree.slice(0, 6).join("/");
      }
    } else if (url.indexOf("initiate") != -1) {
      var tree = url.split("/");
      if (tree.length > 4) {
        myRoute = tree.slice(0, 5).join("/");
      }
    }
    var _hasAccess =
      (this._menu.menus &&
        this._menu.menus.filter(f => f.routeKey === myRoute).length > 0) ||
      false;
    if (
      !_hasAccess &&
      url.indexOf("/home") == -1 &&
      url.indexOf("/confirmation") == -1
    ) {
      if (this.authService.getScope() == "manage")
        this.router.navigate(["/manage/home"]);
      else this.router.navigate(["/back-office/home"]);
    }
    return true;
  }
}
