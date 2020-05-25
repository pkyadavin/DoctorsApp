import { Component, Inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TemplateServices } from "../template.service";
import { DOCUMENT, KeyValue } from "@angular/common";
import { ReturnService } from "../return.service";
import { WINDOW } from "../../../../app.window";
import { TypedJson } from "src/app/app.util";
import { keyValue } from "../return.model";

declare var $: any;

@Component({
  selector: "app-t3",
  templateUrl: "./t3.component.html",
  styleUrls: ["./t3.component.css"]
})
export class T3Component implements OnInit {
  //languageList: any;
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private templateService: TemplateServices,
    private _returnService: ReturnService
  ) {}
  languageList: any;
  selectedLang: any = "en-us";
  urlArr: any;
  domain: any;
  brand: any;
  email: string;
  orderItem: any;
  langKeyVal: any;
  currentStep: string;
  get orderFound(): boolean {
    return this._returnService.orderFound;
  }

  get imgBanner(): boolean {
    return this._returnService.brandconfig != null &&
      this._returnService.brandconfig.Banner
      ? this._returnService.brandconfig.Banner
      : "assets/img/dot.png";
  }

  get imgLogo(): boolean {
    return this._returnService.brandconfig != null &&
      this._returnService.brandconfig.Logo
      ? this._returnService.brandconfig.Logo
      : "assets/img/arc-teryx-logo-black-transparent.png";
  }

  get lblSummaryLabel(): string {
    return this._returnService.lblSummaryLabel == undefined
      ? "Warranty Checker"
      : this._returnService.lblSummaryLabel;
  }

  get imgLogoLink(): boolean {
    return this._returnService.brandconfig != null &&
      this._returnService.brandconfig.logoNavigationURL
      ? this._returnService.brandconfig.logoNavigationURL
      : "";
  }

  get ancjabrasupportURL(): boolean {
    return this._returnService.brandconfig != null &&
      this._returnService.brandconfig.supportassistanceURL
      ? this._returnService.brandconfig.supportassistanceURL
      : "";
  }

  get anctrademarkLink(): boolean {
    if (this._returnService.brandconfig) {
      return this._returnService.brandconfig.trademarkURL
        ? this._returnService.brandconfig.trademarkURL
        : "https://www.jabra.in/";
    } else return false;
  }

  get ancsafewarningLink(): boolean {
    if (this._returnService.brandconfig) {
      return this._returnService.brandconfig.safetywarningURL
        ? this._returnService.brandconfig.safetywarningURL
        : "https://www.jabra.in/";
    } else return false;
  }

  get anccookiespolicyLink(): boolean {
    if (this._returnService.brandconfig) {
      return this._returnService.brandconfig.cookiesPolicyURL
        ? this._returnService.brandconfig.cookiesPolicyURL
        : "https://www.jabra.in/";
    } else return false;
  }

  get ancdecconfirmatyLink(): boolean {
    if (this._returnService.brandconfig) {
      return this._returnService.brandconfig.declarationconformityURL
        ? this._returnService.brandconfig.declarationconformityURL
        : "https://www.jabra.in/";
    } else return false;
  }

  get anccommercialDeclarationURLLink(): boolean {
    if (this._returnService.brandconfig) {
      return this._returnService.brandconfig.commercialDeclarationURL
        ? this._returnService.brandconfig.commercialDeclarationURL
        : "https://www.jabra.in/";
    } else return false;
  }

  get ancprivacyPolicyURLLink(): boolean {
    if (this._returnService.brandconfig) {
      return this._returnService.brandconfig.privacyPolicyURL
        ? this._returnService.brandconfig.privacyPolicyURL
        : "https://www.jabra.in/";
    } else return false;
  }

  getlangval(key) {
    if (this._returnService.langKeyVal) {
      let langObj = this._returnService.langKeyVal.filter(
        f => f.LanugaugeKey == key && f.formname == "Common"
      )[0];
      if (langObj) {
        if (langObj.ChangedLangValue) {
          return langObj.ChangedLangValue;
        } else return langObj.EngLangValue;
      }
    }
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('customer_portal');
    this.orderItem = JSON.parse(sessionStorage.getItem("searchItemChechked"));

    this.email = this._activatedRoute.snapshot.paramMap.get("email");
    if (!this.email) {
      this._activatedRoute.queryParams.subscribe(_params => {
        this.email = _params["email"];
      });
    }

    this.domain = this._activatedRoute.snapshot.paramMap
      .get("domain")
      .toLowerCase();
    this.brand = this._activatedRoute.snapshot.paramMap
      .get("brand")
      .toLowerCase();

    sessionStorage.setItem("_s", this.domain);
    this.urlArr = this._router.url.split("/");
    if (this.urlArr.length > 0) {
      //debugger;
      this.selectedLang = this.urlArr[8].toLowerCase().split("?")[0];
      this.currentStep = this.urlArr[7].toLowerCase();
    }
    let SchemaArray: Array<keyValue> = [
      { key: "portal", value: "portal" },
      { key: "res", value: "res" },
      { key: "return", value: "return" },
      { key: "template", value: "t3" },
      { key: "brand", value: "" },
      { key: "scope", value: this.domain },
      { key: "step", value: "" },
      { key: "language", value: "" },
      { key: "ordernumber", value: this.urlArr[9] }
    ];

    this._returnService.setTemplateSchema = SchemaArray;
  debugger;
    if (this.email) {
      this._returnService.getTemplateSchema([
        { key: "brand", value: this.brand },
        { key: "language", value: this.selectedLang + "?email=" + this.email }
      ]);
    } else {
      this._returnService.getTemplateSchema([
        { key: "brand", value: this.brand },
        { key: "language", value: this.selectedLang }
      ]);
    }
    //debugger;
    this._returnService
      .getLanguage(this.brand, this.selectedLang)
      .subscribe(data => {
        this.languageList = data;
        this.selectedLang = this.urlArr[8].toLowerCase().split("?")[0];
        var languageCodeList = this.languageList.map(function(e1) {
          return e1.Code;
        });
        if (!languageCodeList.includes(this.selectedLang)) {
          this.selectedLang = "en-us";
        }
      });
  }

  goTrackAll() {
    this.window.location.href = this._returnService.getTemplateSchema([
      { key: "step", value: "track-all" },
      { key: "ordernumber", value: "" }
    ]);
  }

  onLanguageChange() {
    let link = "";
    if (this._router.url.indexOf("track-all") > 0) {
      link = "track-all";
      this._returnService.removeKeyFromTemplateSchema([
        { key: "ordernumber", value: "" }
      ]);
    } else if (this._router.url.indexOf("track") > 0) link = "track";
    else if (this._router.url.indexOf("step3") > 0) link = "step3";
    else if (this._router.url.indexOf("search") > 0) {
      link = "search";
      this._returnService.removeKeyFromTemplateSchema([
        { key: "ordernumber", value: "" }
      ]);
    } else link = "step1";

    if (this.email) {
      window.location.href = this._returnService.getTemplateSchema([
        { key: "language", value: this.selectedLang + "?email=" + this.email },
        { key: "step", value: link }
      ]);
    } else {
      window.location.href = this._returnService.getTemplateSchema([
        { key: "language", value: this.selectedLang },
        { key: "step", value: link }
      ]);
    }
  }
}
