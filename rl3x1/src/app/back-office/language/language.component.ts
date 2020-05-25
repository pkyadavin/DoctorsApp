import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  AfterContentChecked
} from "@angular/core";
import { LanguageService } from "./language.service";
import { AnalyticsService } from "../analytics/analytics.service";
import { Util } from "src/app/app.util";
import { debug } from "util";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { Router } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-language",
  templateUrl: "./language.component.html",
  styleUrls: ["./language.component.css"],
  providers: [LanguageService, AnalyticsService, ApplicationInsightsService]
})
export class LanguageComponent implements OnInit, AfterContentChecked {
  public FormList: string[];
  public selectedFormId: number = 0;
  public LanguageList: any[];
  public SelectedLanguageList: any[];
  public SelectedLanguage: string;
  public SelectedLanguageId: any;
  public SelectedLanguageObj: any;
  public data: any[];
  public brands: any = [];

  public IsLanguageData: boolean = true;
  SelectedBrandID: number = 2;
  LanguageSelected: any = null;
  LangSelected: any = null;
  public name: string;

  constructor(
    private languageService: LanguageService,
    private _util: Util,
    private _analytics: AnalyticsService,
    private _router: Router,
    private _appInsightService: ApplicationInsightsService
  ) {
    this.data = [];
  }

  ngOnInit() {
    this._appInsightService.logPageView("Language Setup", this._router.url);
    this.fillForm();
  }
  ngAfterContentChecked() {
    $(
      "#ddlSelectedLanguage option[ng-reflect-value=" +
        this.SelectedLanguageId +
        "]"
    ).attr("selected", "selected");
  }

  fillForm() {
    this.languageService.GetBrands().subscribe(data => {
      debugger;
      this.brands = data;
      this.SelectedBrandID = this.brands[0].PartnerID;

      this.bindData().then(data => {
        debugger;
        this.selectedFormId = this.FormList[0]["key"];
        if (this.SelectedLanguageList != null) {
          this.SelectedLanguageId = this.SelectedLanguageList[0].key;
          this.SelectedLanguageObj = this.SelectedLanguageList[0];

          this.LangSelected = this.SelectedLanguageList;
        }
        //debugger;
        this.FillGrid();
      });
    });
    debugger;
  }

  bindData() {
    var promise = new Promise((resolve, reject) => {
      this.languageService
        .GetLanguageData(0, 0, this.SelectedBrandID)
        .subscribe(result => {
          this.LanguageList = JSON.parse(result.recordsets[0][0].LanguageList);
          this.FormList = JSON.parse(result.recordsets[1][0].FormList);
          this.SelectedLanguageList = JSON.parse(
            result.recordsets[2][0].SelectedLanguageList
          );
          debugger;
          resolve();
        });
    });
    return promise;
  }

  SelectLanguageForward() {
    if (this.LanguageSelected == null || this.LanguageSelected == undefined) {
      this._util.error("Please select available language.", "");
      return;
    }
    var ind = 0;
    var item = this.LanguageSelected[0];
    if (this.SelectedLanguageList == null) {
      this.SelectedLanguageList = this.SelectedLanguageList || [];
      this.SelectedLanguageList.push({
        key: item.key,
        value: item.value
      });
    } else {
      ind = this.SelectedLanguageList.map(function(e) {
        return e.key;
      }).indexOf(item.key);
    }
    var indSplice = this.LanguageList.map(function(e) {
      return e.key;
    }).indexOf(item.key);
    if (ind < 0) {
      this.LanguageList.splice(indSplice, 1);
      this.SelectedLanguageList.push(JSON.parse(JSON.stringify(item)));
    }
    this.LanguageSelected = null;
  }

  SelectLanguageBackForward() {
    //debugger;
    if (this.LangSelected == null || this.LangSelected == undefined) {
      this._util.error("Please select language from selected list.", "");
      return;
    }
    //debugger;
    if (
      this.SelectedLanguageObj != undefined &&
      this.SelectedLanguageObj.IsDefault == true
    ) {
      this._util.error(
        "Default Language cannot be removed from selected list.",
        ""
      );
      return;
    }
    this.data = [];
    this.SelectedLanguageId = 0;
    var item = this.SelectedLanguageObj;
    var ind = this.LanguageList.map(function(e) {
      return e.key;
    }).indexOf(item.key);
    var indSplice = this.SelectedLanguageList.map(function(e) {
      return e.key;
    }).indexOf(item.key);
    if (ind < 0) {
      this.SelectedLanguageList.splice(indSplice, 1);
      this.LanguageList.push(JSON.parse(JSON.stringify(item)));
    }
    //debugger;
    this.LangSelected = this.SelectedLanguageList[0].key;
    this.OnSelectLanguage(this.SelectedLanguageList[0]);
  }

  onSelect(key) {
    this.data = [];
    if (key.length > 0) {
      this.selectedFormId = key;
      this.FillGrid();
    }
  }

  OnSelectLanguage(LanguageObj) {
    this.SelectedLanguageObj = LanguageObj;
    if (this.selectedFormId == undefined || this.selectedFormId <= 0) {
      this._util.error("Please select form.", "");
      return;
    }
    this.FillGrid();
  }

  OnSelectBrand(BrandObj) {
    debugger;
    this.SelectedBrandID = BrandObj;
    if (this.SelectedBrandID == undefined || this.SelectedBrandID <= 0) {
      this._util.error("Please select Brand.", "");
      return;
    }
    // this.fillForm();
    this.bindData().then(data => {
      debugger;
      this.selectedFormId = this.FormList[0]["key"];
      if (this.SelectedLanguageList != null) {
        this.SelectedLanguageId = this.SelectedLanguageList[0].key;
        this.SelectedLanguageObj = this.SelectedLanguageList[0];

        this.LangSelected = this.SelectedLanguageList;
      }
      //debugger;
      this.FillGrid();
    });
  }

  FillGrid() {
    this.data = [];
    this.SelectedLanguage = this.SelectedLanguageObj.value;
    this.languageService
      .GetLanguageData(
        this.selectedFormId,
        this.SelectedLanguageId,
        this.SelectedBrandID
      )
      .subscribe(result => {
        debugger;
        this.data = JSON.parse(result.recordsets[3][0].LanguageResource);
        if (this.data == null) this.IsLanguageData = false;
        else this.IsLanguageData = true;
      });
  }

  onAdd() {
    if (this.SelectedLanguageId != 0) {
      if (this.data.length <= 0) {
        this._util.error("No data found to save.", "");
        return;
      }
      this.DoTransaction(true);
    } else if (this.SelectedLanguageId == 0) {
      this.DoTransaction(false);
    }
  }

  DoTransaction(mode) {
    debugger;
    if (this.SelectedLanguageId.length > 0)
      this.SelectedLanguageId = this.SelectedLanguageId[0];

    var postData = {
      langformMap: this.data.map(x => {
        return {
          ID: x.ID,
          EngLangKey: x.EngLangKey,
          ChangedLangValue: x.ChangedLangValue,
          FormID: this.selectedFormId,
          LanguageID: this.SelectedLanguageId
        };
      }),
      langbrandMap: this.SelectedLanguageList.map(y => {
        return { BrandID: this.SelectedBrandID, LanguageID: y.key };
      })
    };
    this.languageService.Save(mode, postData).subscribe(result => {
      if (result.data == "updated") {
        this._util.success("Record has been saved successfully.", "");
        this.FillGrid();
        //this.fillForm();
      } else if (result.data == "deleted") {
        this._util.success("Record has been deleted successfully.", "");
        this.fillForm();
        this.data = [];
      } else this._util.error(result.data, "");
    });
  }
}
