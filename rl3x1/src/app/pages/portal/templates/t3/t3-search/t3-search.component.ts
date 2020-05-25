import { Component, OnInit, Inject } from "@angular/core";
import { returnBase } from "../../return.base";
import { ActivatedRoute, Router } from "@angular/router";
import { ReturnService } from "../../return.service";
import { TemplateServices } from "../../template.service";
import { Util } from "src/app/app.util";
import { NgForm } from "@angular/forms";
import { T3Model } from "../t3.model";
import { WINDOW } from "src/app/app.window";
import { Title } from "@angular/platform-browser";
import { _returnsObject, _OrderObject } from "../../return.model";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;

@Component({
  selector: "app-t3-search",
  templateUrl: "./t3-search.component.html",
  styleUrls: ["./t3-search.component.css"],
  providers: [ApplicationInsightsService]
})
export class T3SearchComponent extends T3Model implements OnInit {
  selected_in_freight_value: any = [];
  selected_out_freight_value: any = [];
  constructor(

    private _activatedRout: ActivatedRoute,
    private _returnServic: ReturnService,
    private _utilily: Util,
    _router: Router,
    private _appInsightService: ApplicationInsightsService,
    private _templateService: TemplateServices,
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
      titleServiceObj, ngxUiLoaderService
    );
    if (_router.url.indexOf("search") > -1) this.formname = "Search Page";
    //this._appInsightService.logPageView(this.formname, _router.url);
    this._returnServic.orderFound = true;
  }

  get lblFAQs(): boolean {
    return this._returnServic.FAQ;
  }

  get anclocateserialnumberURL(): boolean {
    return this._returnServic.brandconfig != null &&
      this._returnServic.brandconfig.locateserialnumberURL
      ? this._returnServic.brandconfig.locateserialnumberURL
      : "";
  }

  get ancjabrasupportURL(): boolean {
    return this._returnServic.brandconfig != null &&
      this._returnServic.brandconfig.supportassistanceURL
      ? this._returnServic.brandconfig.supportassistanceURL
      : "";
  }

  ngOnInit() {
    var data: any;
    this.language = this._activatedRout.snapshot.paramMap
      .get("language")
      .toLowerCase();
    this.brand = this._returnServic.getValueFromSchemaByKey("brand");
    this.ordernumber = this._activatedRout.snapshot.paramMap.get("ordernumber");
    this.GetDataFromOrderService();
    if (!this.order) {
      this.setConfig();
      this.current_customer_data.forEach(item => (item.isSelected = false));
      this.processableItems = [];

      if (sessionStorage.getItem("searchItemChechked") != null) {
        let orderItem = JSON.parse(
          sessionStorage.getItem("searchItemChechked")
        );
        for (var val of orderItem) {
          if (val.isSelected) {
            this.processableItems.push(val);
          }
        }

        console.log("processableItems", this.processableItems);
        if (orderItem != null) {
          this.current_customer_data = orderItem;
        }
      }
    } else {
      this.isLoaded = true;
      this._returnServic.lblSummaryLabel = this.getlangval("lbl_banner_search");
    }
    this._returnServic.lblSummaryLabel = this.getlangval("lbl_banner_search");
  }
}
