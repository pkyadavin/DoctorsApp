import { Component, EventEmitter, ViewChild } from "@angular/core";
import { RegionService } from "./region.service";
import { Region, Area } from "./region.model";
import { Observable } from "rxjs";
import { GridOptions } from "ag-grid-community";
import { Tabs } from "../../controls/tabs/tabs.component.js";
import { Tab } from "../../controls/tabs/tab.component.js";
import { MetadataService } from "../MetadataConfig/metadata-config.Service.js";
import { TypeLookUp } from "./typelookup.model";
import { RegionProperties } from "./region.properties.js";
import { message, modal } from "../../controls/pop/index";
import { CommonService } from "../../shared/common.service";
import { GlobalVariableService } from "../../shared/globalvariable.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TypedJson, Util } from "../../app.util";
import { Country, State, City, Language } from "../../shared/common.model";
import { UserService } from "../user/User.Service";
import { EditComponent } from "../../shared/edit.component";
import { ActiveComponent } from "../../shared/active.component";
import { SidebarService } from "../sidebar/sidebar.service";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
declare var $: any;

@Component({
  selector: "all-region",
  providers: [
    MetadataService,
    DatePipe,
    UserService,
    ApplicationInsightsService
  ],
  styles: [
    ">>> .ag-cell-focus { -webkit-user-select: text !important;-moz-user-select: text !important;-ms-user-select: text !important;user-select: text !important; }"
  ],
  templateUrl: "./region.template.html"
})
export class Regions extends RegionProperties {
  IsGridLoaded: boolean = false;
  _ListView: Boolean = true;
  partnerID: number;
  isSaveClick: boolean = false;
  filtercityVal: string = "";
  countryList: Country[];
  action: string;
  @ViewChild("pop") _popup: message;
  @ViewChild("modelArea") _modelArea: modal;
  CurrentRegion: Region;

  constructor(
    private _util: Util,
    private _router: Router,
    private _menu: SidebarService,
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
    this._ListView = true;
    var partnerinfo = _globalService.getItem("partnerinfo");
    this.filtercityVal = "";

    this.gridOptions = {
      rowData: this.Regions,
      columnDefs: null,
      enableColResize: true,
      enableServerSideSorting: true,
      pagination: true,
      rowModelType: "infinite",
      paginationPageSize: 20,
      rowSelection: "single",
      rowDeselection: true,
      maxConcurrentDatasourceRequests: 2,
      cacheOverflowSize: 2,
      maxBlocksInCache: 2,
      cacheBlockSize: 20,
      rowHeight: 38,
      context: {
        componentParent: this
      }
    };

    this.dataSource = {
      rowCount: null, // behave as infinite scroll
      paginationPageSize: 20,
      paginationOverflowSize: 20,
      maxConcurrentDatasourceRequests: 2,
      maxPagesInPaginationCache: 20,
      getRows: (params: any) => {
        var sortColID = null;
        var sortDirection = null;
        if (typeof params.sortModel[0] != "undefined") {
          sortColID = params.sortModel[0].colId;
          sortDirection = params.sortModel[0].sort;
        }

        this.$Region
          .getallRegions(
            params.startRow,
            params.endRow,
            sortColID,
            sortDirection,
            this.filterValue
          )
          .subscribe(
            _Regions => {
              debugger;
              this.Regions = _Regions.recordsets[0];
              this.LocalAccess = JSON.parse(_Regions.access_rights).map(
                function(e) {
                  return e.FunctionType;
                }
              );
              var localize = JSON.parse(
                _Regions.recordsets[1][0].ColumnDefinations
              );
              this.h_localize = $.grep(localize, function(n, i) {
                return n.ShowinGrid === true;
              });
              var localeditor = localize.map(function(e) {
                return (
                  '"' +
                  e.field +
                  '": {"headerName": "' +
                  e.headerName +
                  '", "isRequired": ' +
                  e.isRequired +
                  ', "isVisible": ' +
                  e.isVisible +
                  ', "isEnabled": ' +
                  e.isEnabled +
                  ', "width": ' +
                  e.width +
                  " }"
                );
              });
              this.e_localize = JSON.parse("{" + localeditor.join(",") + "}");

              var coldef = this.h_localize.find(
                element => element.field == "RegionName"
              );
              if (coldef != null && this.hasPermission("View")) {
                coldef.cellRendererFramework = EditComponent;
              }
              var coldef1 = this.h_localize.find(
                element => element.field == "RegionCode"
              );
              if (coldef1 != null && this.hasPermission("View")) {
                coldef1.cellRendererFramework = EditComponent;
              }
debugger;
              var coldefActive = this.h_localize.find(
                element => element.field == "IsActive"
              );
              if (coldefActive != null && coldefActive.field == "IsActive") {
                coldefActive.cellRendererFramework = ActiveComponent;
              }

              //setTimeout(function(){this.gridOptions.api.setColumnDefs(this.h_localize),1000});
              this.gridOptions.api.setColumnDefs(this.h_localize);
              var lastRow = _Regions.totalcount;
              if (this.Regions.length <= 0)
                this.gridOptions.api.showNoRowsOverlay();
              else this.gridOptions.api.hideOverlay();

              params.successCallback(this.Regions, lastRow);
              this.CurrentRegion = new Region();
            },
            error => (this.errorMessage = <any>error)
          );
      }
    };

    //this.gridOptions.pagination=true;
    this.gridOptions.datasource = this.dataSource;
    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;

    var partnerinfo = _globalService.getItem("partnerinfo");
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    //this.loadPermissionByModule(partnerinfo[0].UserId, partnerinfo[0].LogInUserPartnerID, this.moduleTitle);
    this.userService.loadCountries().subscribe(country => {
      this.countryList = country;
    });
  }
  
  ngOnInit() {
    this._appInsightService.logPageView('Regions', this._router.url);
  }
  
  async loadPermissionByModule(userID, logInUserPartnerID, moduleTitle) {
    await this.commonService
      .loadPermissionByModule(userID, logInUserPartnerID, moduleTitle)
      .subscribe(returnvalue => {
        var localpermission = returnvalue[0];
        this.LocalAccess = localpermission.map(function(item) {
          return item["FunctionName"];
        });
      });
  }

  Show() {
    this.CurrentRegion = new Region();
    this.CurrentRegion.IsActive = true;
    this._ListView = false;
  }

  edit() {
    //this.CurrentRegion.IsActive = this.CurrentRegion.IsActive.toString() == 'Yes' ? true : false;
    this._ListView = false;
  }

  ChangeEditorVisibility(data) {
    if (data) {
      this.gridOptions.datasource = this.dataSource;
      this.CurrentRegion = new Region();
    }
    this._ListView = true;
  }

  EditClicked(val) {
    if (val.IsActive == "Yes") {
      val.IsActive = true;
    } else {
      val.IsActive = false;
    }
    this.CurrentRegion = val;
    this._ListView = false;
  }

  onSelectionChanged() {
    if (this.gridOptions.api.getSelectedRows()[0].IsActive == "Yes") {
      this.gridOptions.api.getSelectedRows()[0].IsActive = true;
    } else {
      this.gridOptions.api.getSelectedRows()[0].IsActive = false;
    }
    this.CurrentRegion = this.gridOptions.api.getSelectedRows()[0];

    if (!this.CurrentRegion) {
      this.CurrentRegion = new Region();
    }
  }

   onFilterChanged() {
    if (this.filterValue === "") {
      this.filterValue = null;
    }
    this.gridOptions.api.setDatasource(this.dataSource);
    //this.gridOptions.api.setQuickFilter(this.filterValue);
  }
}
