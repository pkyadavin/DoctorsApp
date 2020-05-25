import {
  Component,
  EventEmitter,
  ViewChild,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { RegionService } from "./region.service";
import { Region, Area, TypeGroupModel, SaveGroupModel } from "./region.model";
import { Observable } from "rxjs";
import { GridOptions } from "ag-grid-community";
import { Tabs } from "../../controls/tabs/tabs.component.js";
import { Tab } from "../../controls/tabs/tab.component.js";
import { MetadataService } from "../MetadataConfig/metadata-config.Service.js";
import { TypeLookUp } from "./typelookup.model";
import { RegionProperties } from "./region.properties.js";
import { message, modal } from "../../controls/pop/index.js";
import { CommonService } from "../../shared/common.service";
import { GlobalVariableService } from "../../shared/globalvariable.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TypedJson, Util } from "../../app.util";
import { Country, State, City, Language } from "../../shared/common.model";
import { UserService } from "../user/User.Service";
import { EditComponent } from "../../shared/edit.component";
import { country } from "src/app/leads/lead.model";
import { SidebarService } from "../sidebar/sidebar.service";
import { BsModalComponent } from "ng2-bs3-modal";
import { brand } from "../user/User.model";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { Form } from "@angular/forms";

// import { IDropdownSettings } from 'ng-multiselect-dropdown';

declare var $: any;

@Component({
  selector: "customer-region",
  providers: [
    MetadataService,
    DatePipe,
    UserService,
    ApplicationInsightsService
  ],

  templateUrl: "./customerregion.template.html"
})
export class CustomerRegions extends RegionProperties {
  UserId: number;
  ConfigGroup: string;
  isSaveClick: boolean;
  dropdownList: Array<brand>;
  [x: string]: any;
  //servicetypeArray: Array<TypeGroupModel>;
  //labeltypeArray: Array<TypeGroupModel>;
  //selectedBrands: Array<brand>;
  //selectgroupsave: SaveGroupModel;
  dropdownSettings = {};
  selectedItems = [];

  @Input() SelectedRegion: any;
  @Input() Scope: any;
  @Input() access: any;
  @Output() EditorVisibilityChange = new EventEmitter();
  @ViewChild("CountryPopUp") modalCountry: BsModalComponent;
  selectedCarrierGateway: string;
  IsCountryEdit: boolean = false;
  constructor(
    private _util: Util,
    private _menu: SidebarService,
    private _router: Router,
    private $Region: RegionService,
    private userService: UserService,
    public commonService: CommonService,
    private _globalService: GlobalVariableService,
    private $Config: MetadataService,
    private activateRoute: ActivatedRoute,
    private _datePipe: DatePipe,

    private _appInsightService: ApplicationInsightsService
  ) {
    super();
    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;
    var partnerinfo = _globalService.getItem("partnerinfo");
    this.UserId = partnerinfo[0].UserId;
    this.popupSelectedCountries = [];
    this.ListView=true;

  }

  ngOnInit() {
    this.InitCarrierGateway();
    this.LocalAccess = this.access;
    this.gridOptions.datasource = this.dataSource;

  }
  InitCarrierGateway() {
    this.$Region.getAllCarrierGateway(this.SelectedRegion.RegionID ).subscribe(
      _AllCarrierGatewayCollection => {
        this.AllCarrierGateway = JSON.parse(
          JSON.stringify(_AllCarrierGatewayCollection)
        );
        this.AllCarrierGatewayCollection = _AllCarrierGatewayCollection.map(
          function(e) {
            return new TypeLookUp(e);
          }
        );
        this.selectedCarrierGateway = this.AllCarrierGateway[0].TypeCode;
        this.onSelectedCarrierGatewayChanged();
      },
      error => (this.errorMessage = <any>error)
    );
  }

  onSelectedCarrierGatewayChanged() {
    this.CarrierGatewayAttribute = this.AllCarrierGatewayCollection.filter(
      d => d.TypeCode === this.selectedCarrierGateway
    ).map(function(e) {
      e.Attributes = $.grep(e.Attributes, function(f, i) {
        if (f.AttributeValue && f.AttributeValue == "false") {
          f.AttributeValue = false;
        } else if (f.AttributeValue && f.AttributeValue == "true") {
          f.AttributeValue = true;
        } else if (f.TypeName == "Brands") {
          if (f.AttributeValue) {
            if (f.AttributeValue[0]) {
              if (!f.AttributeValue[0].PartnerID) {
                f.AttributeValue = JSON.parse(f.AttributeValue);
              }
            }
          } else f.AttributeValue = [];
        }
        return f;
      });
      return e.Attributes;
    })[0];
  }
  onSelectionChanged() {
    this.CurrentRegion = this.gridOptions.api.getSelectedRows()[0];
    this.InitCarrierGateway();
    if (!this.CurrentRegion) {
      this.CurrentRegion = new Region();
    }
  }

  Save(regionId: number): void {}

  CancelForm() {
    this.EditorVisibilityChange.emit(false);
  }

  GetGateways(){
    var Gateways: Array<any>=new Array<any>();
    for(var carrier in this.AllCarrierGatewayCollection)
    {
        for(var Property in  this.AllCarrierGatewayCollection[carrier].Attributes)
        {
          Gateways.push(this.AllCarrierGatewayCollection[carrier].Attributes[Property]);
        }
    }

    return Gateways;
  }
  onSubmit(form: any) {
    debugger;
    var isActiveSelected = false;
    var isFormValid = true;
    if (!form.valid) {
      for (var i in form.controls) {
        form.controls[i].markAsTouched();
      }
      form.valueChanges.subscribe(data => {
        this.isSaveClick = !form.valid;
      });
      this.isSaveClick = true;
      return;
    }
    debugger;
    this.SelectedRegion.Gateways =this.GetGateways();

    this.$Region.Save(this.SelectedRegion).subscribe(
      _result => {
        debugger;
        if (_result.ReturnRegionID >= 0) {
          this._util.success("Saved successfully.", "Success", "Success");
          this.EditorVisibilityChange.emit(true);
        } else {
          this._util.error("Region Code/Name is already in use.", "Error");
        }
      },
      error => {
        this._util.error(error, "Error");
      }
    );
  }

  InitComponent() {}

 }
