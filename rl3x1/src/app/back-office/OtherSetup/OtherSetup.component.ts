import { Component, ElementRef, ViewChild } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { OtherSetup } from "./OtherSetup.model.js";
import { AgGridNg2 } from "ag-grid-angular";
import { Property, Util } from "../../app.util";
import { OtherSetupService } from "./OtherSetup.Service.js";
import { message, modal } from "../../controls/pop/index.js";
import { GlobalVariableService } from "../../shared/globalvariable.service";
import { CommonService } from "../../shared/common.service";
import { GridOptions } from "ag-grid-community";
import { SidebarService } from "../sidebar/sidebar.service.js";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";

declare var $: any;

@Component({
  selector: "OtherSetupGrid",
  providers: [OtherSetupService, ApplicationInsightsService],
  templateUrl: "./otherSetup.html"
})
export class OtherSetupGrid extends Property {
  IsGridLoaded: boolean = false;
  otherSetup: OtherSetup[];
  MessageSetUpKeyValueData: Observable<any>;
  gridOptions: GridOptions;
  errorMessage: string;
  dataSource: any;
  partnerID: number;
  UserID: number;
  LocalAccess = [];
  isSaveClick: any;
  IsEditButtonShow: boolean = false;
  IsEditMode: boolean = false;
  IsShowImageUpload: boolean = false;

  columnDefs = [];

  CurrentSetup: OtherSetup = new OtherSetup();

  constructor(
    private _util: Util,
    private otherSetupService: OtherSetupService,
    private _menu: SidebarService,
    private _router: Router,
    private _globalService: GlobalVariableService,
    private _activateRoute: ActivatedRoute,
    private commonService: CommonService,
    private _appInsightService: ApplicationInsightsService
  ) {
    super();
    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;
    var partnerinfo = _globalService.getItem("partnerinfo");
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    this.UserID = partnerinfo[0].UserId;
    this.loadPermissionByModule(this.moduleTitle);
  }

  @ViewChild("pop") _popup: message;
  @ViewChild("pop1") _popup1: modal;
  ngOnInit() {
    this._appInsightService.logPageView('Other Setup', this._router.url);
    this.gridOptions = {
      rowData: this.otherSetup,
      columnDefs: null,
      enableColResize: true,
      enableServerSideSorting: true,
      pagination: true,
      rowModelType: "infinite",
      paginationPageSize: 20,
      rowSelection: "single",
      maxConcurrentDatasourceRequests: 2,
      paginationStartPage: 1,
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
      maxPagesInPaginationCache: 2,
      getRows: (params: any) => {
        var sortColID = null;
        var sortDirection = null;
        if (typeof params.sortModel[0] != "undefined") {
          sortColID = params.sortModel[0].colId;
          sortDirection = params.sortModel[0].sort;
        }
        this.otherSetupService
          .loadAll(params.startRow, params.endRow, this.partnerID)
          .subscribe(result => {
            var rowsThisPage = result.recordsets[0];
            var localize = JSON.parse(
              result.recordsets[1][0].ColumnDefinations
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

            var rowsThisPage = result.recordsets[0];

            this._globalService.setLinkCellRender(localize, "Code", true);
            //this._globalService.setLinkCellRender(localize, 'Code', true);

            if (!this.gridOptions.columnApi.getAllColumns())
              this.gridOptions.api.setColumnDefs(this.h_localize);
            // see if we have come to the last page. if we have, set lastRow to
            // the very last row of the last page. if you are getting data from
            // a server, lastRow could be returned separately if the lastRow
            // is not in the current page.
            var lastRow = 0;
            if (result.recordsets.length > 0)
              lastRow = result.recordsets[0][1].TotalCount;

            params.successCallback(rowsThisPage, lastRow);
          });
      }
    };
    this.gridOptions.datasource = this.dataSource;
  }

  ImageFile: FileList;
  handleReturnDocs(ctrl, e, controls, me1: any) {
    var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (file.length > 0) {
      var pattern = /image-*/;
      var reader = new FileReader();
      if (!file[0].type.match(pattern)) {
        this._util.error("Invalid image format", "Alert");
        return;
      }

      this.ImageFile = file;
      let formData: FormData = new FormData();
      for (let i = 0; i < this.ImageFile.length; i++) {
        formData.append("SRODocs", this.ImageFile[0]);
      }

      this.otherSetupService.UploadItemImage(formData).subscribe(data => {
        if (data.result == "Success") {
          this.CurrentSetup.ImagePath = data.FileUrl;
        } else {
          this.CurrentSetup.ImagePath = "";
        }
      });
    } else {
    }
  }

  Save(form) {
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
    this.CurrentSetup.UserID = this.UserID;
    if (
      this.CurrentSetup.IsActive == undefined ||
      this.CurrentSetup.IsActive == false
    ) {
      this.CurrentSetup.IsActive = false;
    } else {
      this.CurrentSetup.IsActive = true;
    }

    if (this.CurrentSetup.ConfigSetupID == undefined) {
      this.CurrentSetup.ConfigSetupID = 0;
    }

    this.otherSetupService.Save(this.CurrentSetup).subscribe(
      returnvalue => {
        var result = returnvalue.data;
        if (result == "Updated") {
          this._util.success(
            "Record has been updated successfully.",
            "Success",
            "Success"
          );
          this.Cancel();
          this.gridOptions.api.setDatasource(this.dataSource);

          return;
        } else {
          this._util.error(result, "Error");
          return;
        }
      },
      error => (this.errorMessage = <any>error)
    );
  }

  ShowEditMode() {
    this.IsEditMode = true;
  }

  Cancel() {
    this.IsEditButtonShow = false;
    this.IsEditMode = false;
  }

  loadPermissionByModule(Module: string) {
    var partnerinfo = this._globalService.getItem("partnerinfo")[0];
    this.commonService
      .loadPermissionByModule(
        partnerinfo.UserId,
        partnerinfo.LogInUserPartnerID,
        this.moduleTitle
      )
      .subscribe(returnvalue => {
        var localpermission = returnvalue[0];
        this.LocalAccess = localpermission.map(function(item) {
          return item["FunctionName"];
        });
      });
  }

  showImagePreview() {
    $("#previewImage").css("display", "block");
    $("#previewImage").attr("src", this.CurrentSetup.ImagePath);
  }

  hideImagePreview() {
    $("#previewImage").css("display", "none");
    $("#previewImage").attr("src", "");
  }

  onSelectionChanged() {
    this.CurrentSetup = this.gridOptions.api.getSelectedRows()[0];
    if (this.CurrentSetup.ValueType == "Image") {
      this.IsShowImageUpload = true;
    } else this.IsShowImageUpload = false;

    if (this.CurrentSetup) this.IsEditButtonShow = true;
    else this.IsEditButtonShow = false;
  }

  onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      if (actionType == "edit") {
        this.CurrentSetup = data;

        if (this.CurrentSetup.ValueType == "Image")
          this.IsShowImageUpload = true;
        else this.IsShowImageUpload = false;

        this.IsEditMode = true;
      }
    }
  }
}
