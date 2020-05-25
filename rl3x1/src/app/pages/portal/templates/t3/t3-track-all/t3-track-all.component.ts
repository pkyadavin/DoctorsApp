import { Component, OnInit, Inject } from "@angular/core";
import { returnBase } from "../../return.base";
import { ActivatedRoute, Router } from "@angular/router";
import { ReturnService } from "../../return.service";
import { Util } from "src/app/app.util";
import { TemplateServices } from "../../template.service";
import { T3Model } from "../t3.model";
import { WINDOW } from "src/app/app.window";
import { Title } from "@angular/platform-browser";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $;

@Component({
  selector: "app-t3-track-all",
  templateUrl: "./t3-track-all.component.html",
  styleUrls: ["./t3-track-all.component.css"],
  providers: [ApplicationInsightsService]
})
export class T3TrackAllComponent extends T3Model implements OnInit {
  all_returns: any = [];
  domain: string;
  cust_name: string = "";
  cust_email: string = "";
  cust_phone: string = "1-514-645-9087";
  search_history_text: string = "";
  email: string = "";
  constructor(
    private _activatedRout: ActivatedRoute,
    private _returnServic: ReturnService,
    private _utilily: Util,
    _router: Router,
    private _templateService: TemplateServices,
    private _appInsightService: ApplicationInsightsService,
    @Inject(WINDOW) private windowObj: Window,
    private titleServiceObj: Title,
    ngxUiLoaderService: NgxUiLoaderService
  ) {
    super(
      _activatedRout,
      _returnServic,
      _utilily,
      _router,
      _templateService,
      windowObj,
      titleServiceObj,
      ngxUiLoaderService
    );
    if (_router.url.indexOf("track-all") > -1) this.formname = "TrackAll";
    this._appInsightService.logPageView(this.formname, _router.url);
  }
  ngOnInit() {
    $("#div_processbar").attr("style", "display:none");
    // debugger;
    // if (this.brand == "dsc2") this.email = "xyz@jabra.com";
    // // this._activatedRout.snapshot.paramMap.get("email");
    // else this.email = "xyz@blueparrott.com";
    // // if (!email) {
    // //   this._activatedRout.queryParams.subscribe(_params => {
    // //     email = _params["email"];
    // //   });
    // // }
    // this.cust_email = this.email;
    this.language = this._activatedRout.snapshot.paramMap.get("language");
    this.domain = sessionStorage.getItem("_s");
    this.brand = this._returnServic.getValueFromSchemaByKey("brand");
    this.formname = "TrackAll";
    this.setConfig();
    this._returnServic.orderFound = true;
    this.seachreturnHistory();
  }

  seachreturnHistory() {
    if (this.brand == "dsc2") this.email = "xyz@jabra.com";
    else this.email = "xyz@blueparrott.com";
 
    this.cust_email = this.email;
    var searchText =
      this.search_history_text != "" ? this.search_history_text : "REF";
    this.startloader();
    this._returnServic
      .myorders(this.cust_email.replace("+", "%20"), this.brand, searchText)
      .subscribe(
        data => {
          this.stoploader();
          if (data != null) {
            this.all_returns = data.recordsets[0];
            this.all_returns.forEach(element => {
              this.cust_email = element.email;
              this.cust_name = element.name;
            });
          }
        },
        error => {}
      );
  }
}
