import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { SidebarService } from "../sidebar/sidebar.service";
import { Util } from "src/app/app.util";
import { AuthService } from "src/app/authentication/auth.service";
import { timezone } from "src/app/leads/lead.model";
declare var $: any;
@Component({
  selector: "app-command",
  templateUrl: "./command.component.html",
  styleUrls: ["./command.component.css"]
})
export class CommandComponent implements OnInit {
  home_route: string = "";
  _route: string = "";
  _Timezones: any = [];
  Timezone: number;

  constructor(
    private router: Router,
    private _menu: SidebarService,
    private _util: Util,
    private _auth: AuthService
  ) {
    router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        $(".rl-scanner").addClass("rl-scanner-inactive");
        $("body").removeClass("no-scroll");
      } else if (event instanceof NavigationEnd) {
        this.home_route =
          (router.url.split("/")[1] == "back-office"
            ? "/back-office"
            : "/manage") + "/home";
        var _thisRoute =
          (this._menu.menus &&
            this._menu.menus.filter(
              f => this.router.url.indexOf(f.routeKey) > -1
            )[0]) ||
          null;
        this._route = _thisRoute ? _thisRoute.description : "";
        //sessionStorage.setItem("currentRoute", this._route);
      }
    });
  }

  ngOnInit() {
    // this._menu.getAllTimeZone().subscribe(res=>{
    //   this._Timezones = res.data;
    //   this.Timezone = JSON.parse(this._auth.getAuthorizationUser()).tz;
    // }, error=>{});
  }

  // setLanding()
  // {
  //    this._menu.resetLanding(this.router.url).subscribe(
  //      data=>{
  //        this._util.success("Your landing page has been reset.","success")
  //      },
  //      error=>{
  //       this._util.error(error, 'error')
  //      }
  //    );
  // }

  // resetLanding()
  // {
  //    this._menu.resetLanding('/back-office/home').subscribe(
  //      data=>{
  //        this._util.success("Your landing page has been reset.","success")
  //      },
  //      error=>{
  //       this._util.error(error, 'error')
  //      }
  //    );
  // }

  // resetTimezone()
  // {
  //    this._menu.resetTimezone(this.Timezone).subscribe(
  //      data=>{
  //        this._util.success("Your timezone has been reset.","success")
  //      },
  //      error=>{
  //       this._util.error(error, 'error')
  //      }
  //    );
  // }
}
