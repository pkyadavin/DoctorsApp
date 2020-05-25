import { Component, OnInit, Inject, Input } from "@angular/core";
import { returnBase } from "../../return.base";
import { ActivatedRoute, Router } from "@angular/router";
import { ReturnService } from "../../return.service";
import { Util } from "src/app/app.util";
import { TemplateServices } from "../../template.service";
import {
  _returnsObject,
  returnExtra,
  _additionalHeaderInfo,
  address
} from "../../return.model";
// import { NgForm } from "@angular/forms";
import { T3Model } from "../t3.model";
import { WINDOW } from "src/app/app.window";
import { Title } from "@angular/platform-browser";
import { from } from "rxjs";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;

@Component({
  selector: "app-t3-step2",
  templateUrl: "./t3-step2.component.html",
  styleUrls: ["./t3-step2.component.css"],
  providers: [ApplicationInsightsService]
})
export class T3Step2Component extends T3Model implements OnInit {
  today: number = Date.now();
  selected_in_freight_value: any = [];
  selected_out_freight_value: any = [];

  _customerNewAddres = new address();

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
      titleServiceObj, 
      ngxUiLoaderService
    );
    if (_routr.url.indexOf("step2") > -1) this.formname = "Return";
    this._appInsightService.logPageView(this.formname, _routr.url);
  }

  get ancLogoLink(): boolean {
    return this._returnServic.brandconfig == undefined
      ? "https://www.jabra.in/"
      : this._returnServic.brandconfig.homePageNavigationURL
      ? this._returnServic.brandconfig.homePageNavigationURL
      : "https://www.jabra.in/";
  }
  get ancContactUsLink(): boolean {
    return this._returnServic.brandconfig == undefined
      ? "https://www.jabra.in/"
      : this._returnServic.brandconfig.contactPageNavigationURL
      ? this._returnServic.brandconfig.contactPageNavigationURL
      : "https://www.jabra.in/";
  }

  ngOnInit() {
    // debugger;
    this.language = this._activatedRout.snapshot.paramMap.get("language");
    this.brand = this._returnServic.getValueFromSchemaByKey("brand");
    // this.brand = this._activatedRout.snapshot.paramMap.get("brand");

    this.GetDataFromOrderService();
    if (!this.order) {
      this._routr.navigate([
        this._returnServic.getTemplateSchema([{ key: "step", value: "step1" }])
      ]);
    }

    this._returnServic.lblSummaryLabel = "SHIPPING OPTIONS";
    this.titleServiceObj.setTitle(this._returnServic.lblSummaryLabel);

    if (this.brandconfig != undefined) {
      let returnLinkContact = this.brandconfig.returnPolicyNavigationURL
        ? this.brandconfig.returnPolicyNavigationURL
        : "https://www.jabra.in/";
      $("#ancReturnPolicy").attr("href", returnLinkContact);
    }
    // debugger;
    if (sessionStorage.getItem("frieghtItem") != null) {
      let orderfrieghtItem = JSON.parse(sessionStorage.getItem("frieghtItem"));

      this.selected_in_freight_value = Object.values(
        orderfrieghtItem["inbound_feight"]
      );
      this.selected_out_freight_value = Object.values(
        orderfrieghtItem["outbound_feight"]
      );
      console.log(
        "frightItemFound",
        JSON.parse(sessionStorage.getItem("frieghtItem"))
      );
    }

    selected_in_freight: [];

    this.fetchAddHeaderInfoforStep2();
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("step-4");

    sessionStorage.setItem(
      "searchItemChechked",
      JSON.stringify(this.processableItems)
    );
  }

  fetchAddHeaderInfoforStep2() {
    debugger;
    this.new_added_address.country_code = this.processableItems[0].customer.address.country;
    this._addHeaderInfo.select_customer = this.processableItems[0].customer;
    this._addHeaderInfo.primary_email = this.processableItems[0].customer.primary_email;
    this._addHeaderInfo.secondary_email = this.processableItems[0].customer.secondary_email;
    var cnt = 0;
    for (var val of this.processableItems) {
      if (val.isSelected) {
        if (cnt == 0) val.customer.address.isDefault = true;

        cnt++;
        this.customerShippingAddressList.push(val.customer.address);
      }
    }
    console.log(this.customerShippingAddressList);
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("step-4");
  }
  checked: boolean = false;
}
