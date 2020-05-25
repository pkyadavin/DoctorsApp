import {
  Component,
  OnChanges,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit
} from "@angular/core";
import { PartnerService } from "./Partner.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { AgGridNg2 } from "ag-grid-angular";
import { GridOptions } from "ag-grid-community";
import { Partner } from "./Partner.model";
import { Property, Util } from "../../app.util";
import { CommonService } from "../../shared/common.service";
import { message } from "../../controls/pop/index.js";
import { GlobalVariableService } from "../../shared/globalvariable.service";
import { BsModalComponent } from "ng2-bs3-modal";
import { EditComponent } from "../../shared/edit.component";
import { SidebarService } from "../sidebar/sidebar.service";
import { ImageColumnComponent } from "src/app/shared/image-column.component";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
declare var XLSX: any;

@Component({
  selector: "PartnerGrid",
  providers: [PartnerService, ApplicationInsightsService],
  styles: [
    ">>> .ag-cell-focus { -webkit-user-select: text !important;-moz-user-select: text !important;-ms-user-select: text !important;user-select: text !important; }"
  ],
  templateUrl: "./partner.html"
})
export class Partners extends Property implements OnInit {
  IsGridLoaded: boolean = false;
  //@Input() partnerType: string = 'PTR001';
  @Input() partnerType: string;
  @Input() showAllType: string = "0";
  @Input() PIN: string;
  CurrentPIN: string = "";
  @Input() partnerGridType: string;
  @Output() notifyPartner: EventEmitter<Partner> = new EventEmitter<Partner>();
  filterText: string;
  loading: boolean;
  partnerlist: Partner[];
  singlePartner: Partner;
  IsEditorVisible: boolean = false;
  dataSource: any;
  gridOptions: GridOptions;
  errorMessage: string;
  isAddPartner = true;
  isEditPartner = false;
  isDeletePartner = false;
  Permissions: any;
  selectedId: number;
  LocalAccess = [];
  status: number = 0;
  partnerID: number;
  @Input() AvailableUsers: any;

  columnDefs = [
    //{ headerName: 'ID', field: "ID", width: 120 },
    //{ headerName: 'First Name', field: "FirstName", width: 200 },
    //{ headerName: 'Partner Name', field: "PartnerName", width: 200 },
    //{ headerName: 'Email', field: "Email", width: 200 },
    //{ headerName: 'Cell Number', field: "CellNumber", width: 150 },
    //{ headerName: 'Partner Type', field: "PartnerType", width: 150 },
    //{ headerName: 'Created Date', field: "CreatedDate", width: 100 },
    //{ headerName: 'Modified Date', field: "ModifyDate", width: 100 }
  ];

  ShowUploadbutton: boolean = true;
  importErrorMessage: string;
  regXMLData: any;
  Result: string = "";
  selectedValue: string;
  jsonlist: any;
  ImportResults: any;
  ImportStatus: string = "";
  ImportInProcess: boolean = false;
  @ViewChild("fileInput") fileInput;
  @ViewChild("importPopup") _importPopup: BsModalComponent;
  Subject: string;
  ChildOnly: boolean = false;
  constructor(
    private loaderService: LoaderService,
    private _util: Util,
    private partnerService: PartnerService,
    private _menu: SidebarService,
    private _router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _globalService: GlobalVariableService,
    private commonService: CommonService,
    private _appInsightService: ApplicationInsightsService
  ) {
    super();
    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;

    var partnerinfo = _globalService.getItem("partnerinfo");
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
  }

  @ViewChild("pop") _popup: message;
  gridapi = null;
  gridcolumnapi = null;
  onGridPartnerReady(gridParams) {
    this.gridapi = gridParams.api;
    this.gridcolumnapi = gridParams.columnApi;
    this.gridapi.setDatasource(this.dataSource);
  }
  ngOnInit() {

    this.partnerType == "PTR001" ? "Facility" : "Brand"
    this._appInsightService.logPageView(this.partnerType, this._router.url);

    if (this.partnerGridType == "popup") {
      this.status = 1;
    }

    //alert(this.partnerType);

    this.gridOptions = {
      rowData: this.partnerlist,
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

    if (this.partnerGridType == "userpopup") {
      this.gridOptions.rowSelection = "multiple";
      $("#divheader").addClass("widget-header");
      this.gridOptions.suppressRowClickSelection = true;
      this.ChildOnly = true;
    } else {
      this.gridOptions.rowSelection = "single";
      $("#divheader").addClass("widget-header widget-header1");
      $("#divgrid").addClass("marginTop34");
      this.gridOptions.suppressRowClickSelection = false;
      this.ChildOnly = false;
    }

    this.dataSource = {
      rowCount: null,
      paginationPageSize: 20,
      paginationOverflowSize: 2,
      maxPagesInPaginationCache: 2,
      getRows: (params: any) => {
        var sortColID = null;
        var sortDirection = null;
        if (typeof params.sortModel[0] != "undefined") {
          sortColID = params.sortModel[0].colId;
          sortDirection = params.sortModel[0].sort;
        }
        var facilityIds = [];
        if (this.AvailableUsers)
          facilityIds = this.AvailableUsers.map(function(e) {
            return e.PartnerID;
          });
          this.loaderService.display(true);
        this.partnerService
          .loadAllByPost(
            params.startRow,
            params.endRow,
            sortColID,
            sortDirection,
            this.filterText,
            this.partnerType,
            this.status,
            this.partnerID,
            this.PIN,
            this.ChildOnly,
            { jsonData: JSON.stringify(facilityIds) }
          )
          .subscribe(result => {
            this.loaderService.display(false);
            var rowsThisPage = result.recordsets[0];

            this.LocalAccess = JSON.parse(result.access_rights).map(function(
              e
            ) {
              return e.FunctionType;
            });
            var localize = JSON.parse(
              result.recordsets[1][0].ColumnDefinitions
            );
            this.h_localize = $.grep(localize, function(n, i) {
              return n.ShowinGrid === true;
            });
            var node_editor = localize.map(function(e) {
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
                "}"
              );
            });
            this.e_localize = JSON.parse("{" + node_editor.join(",") + "}");
            if (this.partnerGridType == "userpopup") {
              this.h_localize.unshift({
                headerName: "Select",
                width: 100,
                checkboxSelection: true
              });
            } else if (this.partnerGridType == "popup") {
              this.h_localize.unshift({
                headerName: "Select",
                width: 70,
                template:
                  '<a style="cursor:pointer;" data-action-type="selectPartner">Select</a>'
              });
            } else {
              // var coldef = this.h_localize.find(
              //   element => element.field == "PartnerName"
              // );
              // if (coldef != null && this.hasPermission("View")) {
              //   coldef.cellRendererFramework = EditComponent;
              // }

              var coldef = this.h_localize.find(
                element => element.field == "PartnerCode"
              );
              if (coldef != null && this.hasPermission("View")) {
                coldef.cellRendererFramework = EditComponent;
              }
            }

            var coldef = this.h_localize.find(
              element => element.field == "IsActive"
            );
            if (coldef != null) {
              coldef.cellRendererFramework = ImageColumnComponent;
            }

            if (!this.gridcolumnapi.getAllColumns())
              this.gridapi.setColumnDefs(this.h_localize);

            // see if we have come to the last page. if we have, set lastRow to
            // the very last row of the last page. if you are getting data from
            // a server, lastRow could be returned separately if the lastRow
            // is not in the current page.

            var lastRow = result.totalcount;
            if (rowsThisPage.length <= 0) this.gridapi.showNoRowsOverlay();
            else this.gridapi.hideOverlay();

            params.successCallback(rowsThisPage, lastRow);

            this.isEditPartner = false;
            this.isDeletePartner = false;
          });
      }
    };

    this.gridOptions.datasource = this.dataSource;
    this._ActivatedRoute.params.subscribe((param: any) => {
      //Need to check impect
      // this.partnerType = (this.partnerType && !param['ID']) ? this.partnerType : param['ID'];
      this.partnerType = this.partnerType ? this.partnerType : param["ID"];
    });
    this.filterText = null;
    this.loading = true;
    if (this.gridapi) this.gridapi.setDatasource(this.dataSource);
    this.loading = false;
  }

  AddSelected() {
    var data = this.gridapi.getSelectedRows();
    this.onActionChk(data);
  }

  onSelectionChanged() {
    this.singlePartner = this.gridapi.getSelectedRows()[0];
    this.isEditPartner = true;
    this.isDeletePartner = true;

    if (!this.singlePartner) {
      this.isEditPartner = false;
      this.isDeletePartner = false;
    }
  }

  onAddPartner() {
    this.selectedId = 0;
    this.IsEditorVisible = true;
  }

  onEditPartner(PartnerID) {
    this.selectedId = PartnerID;
    this.IsEditorVisible = true;
  }

  onDeletePartner(me: any = this) {
    var partnerId = this.singlePartner.PartnerID;
    if (partnerId != 0) {
      this._popup.Confirm(
        "Delete",
        "Are you sure you want to delete it? ",
        function() {
          me.partnerService.remove(partnerId).subscribe(
            result => {
              if (result.data == "deleted") {
                me._util.success("Deleted successfully.", "success");
                me.gridapi.setDatasource(me.dataSource);
              } else {
                me._util.error(
                  "Cannot be deleted.It is being used in other modules.",
                  "error"
                );
              }
            },
            error => {
              this.loaderService.display(false);
              me.errorMessage = <any>error;
              if (
                me.errorMessage.indexOf(
                  "The DELETE statement conflicted with the REFERENCE constraint"
                ) > -1
              ) {
                me.errorMessage =
                  "Could not remove " +
                  (this.partnerType == "PTR001" ? "Facility" : "Account") +
                  ", It has refrenced from other information.";
              }
              me._util.error(me.errorMessage, "error");
            }
          );
        }
      );
    }
  }

  onFilterChanged() {
    if (this.filterText === "") {
      this.filterText = null;
    }
    this.gridapi.setDatasource(this.dataSource);
  }

  onPartnerTypeChanged(type) {
    if (this.filterText === "") {
      this.filterText = null;
    }
    this.partnerType = type;
    this.gridapi.setDatasource(this.dataSource);
  }

  onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      if (actionType == "selectPartner") {
        return this.onActionChk(data);
      } else if (actionType == "edit") {
        this.onEditPartner(data.PartnerID);
      }
    }
  }

  ShowForm(partnerID, clone) {
    this.onEditPartner(partnerID);
  }
  EditClicked(val) {
    this.onEditPartner(val.PartnerID);
  }
  public onActionChk(data: any) {
    this.notifyPartner.emit(data);
  }

  ChangeEditorVisibility(data) {
    if (data) {
      this.gridapi.setDatasource(this.dataSource);
      this.singlePartner = new Partner();
      this.isEditPartner = false;
    }
    this.IsEditorVisible = false;

    var node = this.gridapi.getSelectedNodes()[0];
    if (node) {
      node.setSelected(false);
    }
  }

  selectFile(): void {
    this._importPopup.open();
    this.ImportResults = [];
    this.ImportStatus = "";
    this.ShowUploadbutton = true;
  }

  close() {
    this._importPopup.close();
    this.ShowUploadbutton = true;
    var me = this;
    me.fileInput.nativeElement.value = "";
    this.gridapi.setDatasource(this.dataSource);
  }

  onChangeFileInput(event): void {
    if (event.currentTarget.files.length == 1) {
      this.ShowUploadbutton = false;
      this.ImportResults = [];
      this.ImportStatus = "";
    }
  }

  addFile(): void {
    try {
      this.Result = "";
      let fi = this.fileInput.nativeElement;
      var file: File = fi.files[0];

      if (file == undefined) {
        this.Result = "Excel File Required!";
        return;
      }
      var fileName = file.name;
      var fileExt = fileName.substring(fileName.lastIndexOf("."));

      if ([".xls", ".xlsx"].indexOf(fileExt) < 0) {
        this.Result = "Invalid File Extension!";
        return;
      }

      var partnerinfo = this._globalService.getItem("partnerinfo")[0];
      var me = this;
      var myReader: FileReader = new FileReader();
      myReader.onload = function(event) {
        var result = event.target["result"];
        var workbook = XLSX.read(result, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        me.ReadExcel(worksheet, "A1:I2");
        me.ImportInProcess = true;
        me.partnerService.importAccount(me.regXMLData, 7).subscribe(
          returnvalue => {
            me.Result = returnvalue.result;
            me.ImportResults = returnvalue.result.split("#");

            if (me.ImportResults.length > 1) {
              me.ImportResults.splice(me.ImportResults.length - 1, 1);
              me.ImportStatus = "Failed";
            } else {
              me.ImportStatus = "Success";
              me.gridapi.setDatasource(me.dataSource);
            }
            me.fileInput.nativeElement.value = "";
            me.ImportInProcess = false;
          },
          error => {
            me.loaderService.display(false);
            me.errorMessage = <any>error;
            me.ImportInProcess = false;
          }
        );
      };
      myReader.readAsArrayBuffer(file);
    } catch (e) {
      this.Result = e;
    }
  }

  ReadExcel(worksheet, Range) {
    var jsonstring = "";
    if (Range == "") {
      this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      jsonstring = JSON.stringify({ root: this.jsonlist });
    } else {
      //this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: Range });
      this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: 0 });

      jsonstring = this.jsonlist;
    }
    this.regXMLData = jsonstring;
  }
}
