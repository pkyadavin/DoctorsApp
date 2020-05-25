import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReturnService } from "../../return.service";
import { returnBase } from "../../return.base";
import { Util } from "src/app/app.util";
import { TemplateServices } from "../../template.service";
import { NgForm } from "@angular/forms";
import { T3Model } from "../t3.model";
import { WINDOW } from "src/app/app.window";
import { Title } from "@angular/platform-browser";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { ReturnReasonSeries } from "src/app/back-office/analytics/graphical/graphical.component";
import { ReturnReasons } from "src/app/back-office/Partner/returnreason.component";
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;

@Component({
  selector: "app-t3-step1",
  templateUrl: "./t3-step1.component.html",
  styleUrls: ["./t3-step1.component.css"],
  providers: [ApplicationInsightsService]
})
export class T3Step1Component extends T3Model implements OnInit {
  today: number = Date.now();
  filterResult: any;
  returnReasonItems: string;
  returnReasonName: any[];
  //allTechnologies: this.reasons: any[][];
  //user = new this.reasons:any[][]
  constructor(
    private _activatedRout: ActivatedRoute,
    private _returnServic: ReturnService,
    private _utilily: Util,
    private _routr: Router,
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
      _routr,
      _templateService,
      windowObj,
      titleServiceObj, ngxUiLoaderService
    );

    if (_routr.url.indexOf("step1") > -1) this.formname = "Return";
    this._appInsightService.logPageView(this.formname, _routr.url);
  }

  ngOnInit() {
    // debugger;
    this.ordernumber = this._activatedRout.snapshot.paramMap.get("order");
    this.hash = this._activatedRout.snapshot.paramMap.get("hash");
    this.language = this._activatedRout.snapshot.paramMap.get("language");
    this.brand = this._returnServic.getValueFromSchemaByKey("brand");

    this.GetDataFromOrderService();
    //debugger;

    if (!this.order) {
      this.setConfig();
      //debugger;
      this._routr.navigate([
        this._returnServic.getTemplateSchema([
          { key: "step", value: "search" },
          { key: "ordernumber", value: "" }
        ])
      ]);
    } else {
      this.processableItems = [];
      let orderItem = JSON.parse(sessionStorage.getItem("searchItemChechked"));

      for (var val of orderItem) {
        if (val.isSelected) {
          val.customer.address.country_code = val.customer.address.country;
          val.customer.address.state = val.customer.address.state_code;
          val.items[0].extra.return_DC = "DSC1";
          val.items[0].extra.service_type = "Standard";
          this.processableItems.push(val);
        }
      }
      this.isLoaded = true;
      this._returnServic.lblSummaryLabel = "RETURN DECLARATION";
    }
    this.titleServiceObj.setTitle(this._returnServic.lblSummaryLabel);
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("step-3");

    if (this.returnReasonName) {
      this.returnReasonName = undefined;
    }
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("step-3");
  }
}
