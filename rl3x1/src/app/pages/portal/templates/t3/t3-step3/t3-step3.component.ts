import { Component, OnInit, Inject } from "@angular/core";
import { Util } from "src/app/app.util";
import { Router, ActivatedRoute } from "@angular/router";
import { ReturnService } from "../../return.service";
import { TemplateServices } from "../../template.service";
import { returnBase } from "../../return.base";
import { T3Model } from "../t3.model";
import { WINDOW } from "src/app/app.window";
import { PlatformLocation } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { _returnsObject } from "src/app/back-office/returns/returns.model";
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $: any;

@Component({
  selector: "app-t3-step3",
  templateUrl: "./t3-step3.component.html",
  styleUrls: ["./t3-step3.component.css"],
  providers: [ApplicationInsightsService]
})
export class T3Step3Component extends T3Model implements OnInit {
  return_data_confirm: _returnsObject;
  today: number = Date.now();
  fileshow: any;

  constructor(
    private _activatedRout: ActivatedRoute,
    private _returnServic: ReturnService,
    _utilily: Util,
    private _routr: Router,
    private _templateService: TemplateServices,
    @Inject(WINDOW) private windowObj: Window,
    location: PlatformLocation,
    private _appInsightService: ApplicationInsightsService,
    private titleServiceObj: Title,
    ngxUiLoaderService: NgxUiLoaderService
  ) {
    super(
      _activatedRout,
      _returnServic,
      _utilily,
      _routr,
      _templateService,
      windowObj,
      titleServiceObj,
      ngxUiLoaderService
    );
    if (_routr.url.indexOf("step3") > -1) this.formname = "Summary";
    this._appInsightService.logPageView(this.formname, _routr.url);
    //redirect on back button.
    location.onPopState(() => {
      this.windowObj.location.href = this._returnServic.getTemplateSchema([
        { key: "step", value: "step1" },
        { key: "ordernumber", value: this.order.customer_order.order_number }
      ]);
    });
  }

  ngOnInit() {
    this.language = this._activatedRout.snapshot.paramMap.get("language");
    this.ordernumber = this._activatedRout.snapshot.paramMap.get("order");
    this.brand = this._returnServic.getValueFromSchemaByKey("brand");
    this.formname = "Summary";
    this.setConfig();
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("step-5");
    this.fetchReturndetail_byref();
  }

  fetchReturndetail_byref() {
    //debugger;
    var sendparam = this.ordernumber + "|" + this.language + "|" + this.brand;
    this._returnServic.trackstatusByRef(sendparam).subscribe(
      data => {
        //console.log("data.payload", data.payload);
        debugger;
        if (data.payload != null) {
          this.return_data_confirm = data.payload;
          this.return_data_confirm.items.forEach(element => {
            let files_update: any;
            files_update = element.files;
            element.files = JSON.parse(files_update);
          });
          this._internal_ref_number = this.return_data_confirm.internal_order_number;
          
        }
      },
      error => {}
    );
  }
  viewpop(){
    let asc = this.return_data_confirm.items[0].files[0].url;
    window.location.href = asc;
   }
  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("step-5");
  }
}
