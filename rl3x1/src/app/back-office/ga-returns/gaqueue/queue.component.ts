import { Component, OnInit, OnDestroy } from "@angular/core";
import { Property, Util } from "src/app/app.util";
import { GridOptions } from "ag-grid-community";
import { SidebarService } from "../../sidebar/sidebar.service";
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd
} from "@angular/router";
import { GlobalVariableService } from "src/app/shared/globalvariable.service";
import { EditComponent } from "src/app/shared/edit.component";
import { debug } from "util";
import { filter } from "rxjs/operators";
import { GaReturnsService } from "../ga_returns.service";
declare var $: any;
@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.css"]
})
export class GaQueueComponent extends Property implements OnInit, OnDestroy {
  ListView: boolean = true;
  filterValue: string = null;
  dateFilter: any;
  gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  errorMessage: string;
  ntID: number;
  dataSource: any;
  RMAData: any;
  status: string;
  brandCode: string;
  Tabs: any = [];

  columnDefs_glb = [
    {
      headerName: "Ref #",
      field: "RLRefnumber",
      width: 160,
      cellRendererFramework: EditComponent
    },
    {
      headerName: "Status",
      field: "RHstatus",
      width: 175,
      cellRenderer: this.statusRender
    },
    { headerName: "Product Count", field: "totalItem", width: 120 },
    { headerName: "Customer", field: "customerName", width: 150 },
    { headerName: "Customer Email", field: "customerEmail", width: 175 },
    { headerName: "Customer Company", field: "customerCompany", width: 175 },
    { headerName: "Country", field: "customercountry", width: 120 },
    { headerName: "RMA Date", field: "returnDate", width: 135 }
  ];

  columnDefs_pnd = [
    {
      headerName: "REF #",
      field: "RLRefnumber",
      width: 160,
      cellRendererFramework: EditComponent
    },
    {
      headerName: "Status",
      field: "RHstatus",
      width: 175,
      cellRenderer: this.statusRender
    },
    { headerName: "Product Count", field: "totalItem", width: 120 },
    { headerName: "Customer", field: "customerName", width: 150 },
    { headerName: "Customer Email", field: "customerEmail", width: 175 },
    { headerName: "Customer Company", field: "customerCompany", width: 175 },
    { headerName: "Country", field: "customercountry", width: 120 },
    { headerName: "Request Date", field: "returnDate", width: 135 }
  ];

  columnDefs_oow = [
    {
      headerName: "REF #",
      field: "RLRefnumber",
      width: 160,
      cellRendererFramework: EditComponent
    },
    { headerName: "Product Count", field: "totalItem", width: 120 },
    { headerName: "Customer", field: "customerName", width: 150 },
    { headerName: "Customer Email", field: "customerEmail", width: 175 },
    { headerName: "Customer Company", field: "customerCompany", width: 175 },
    { headerName: "Country", field: "customercountry", width: 120 },
    { headerName: "Request Date", field: "returnDate", width: 135 }
  ];

  columnDefs_bp_oow = [
    {
      headerName: "REF #",
      field: "RLRefnumber",
      width: 200,
      cellRendererFramework: EditComponent
    },
    { headerName: "Customer", field: "customerName", width: 200 },
    { headerName: "Customer Email", field: "customerEmail", width: 200 },
    { headerName: "Customer Company", field: "customerCompany", width: 200 },
    { headerName: "Country", field: "customercountry", width: 120 },
    { headerName: "Request Date", field: "returnDate", width: 160 }
  ];

  constructor(
    private _util: Util,
    private _menu: SidebarService,
    private _router: Router,
    private _returnService: GaReturnsService,
    private _globalService: GlobalVariableService,
    private _route: ActivatedRoute
  ) {
    super();
  }

  statusRender(status) {
    if (status == null || status.value == undefined) return;
    if (status != null) {
      switch (status.value) {
        case "Initiated":
          return `<span class="badge badge-warning" style="background-color: #ffbb34!important;"> ${status.value} </span>`;
        case "Received":
          return `<span class="badge badge-warning" style="background-color: #99d101!important;"> ${status.value} </span>`;
        case "Closed":
          return `<span class="badge badge-darkorange" style="background-color: #79a502!important;"> ${status.value} </span>`;
        case "Approved":
          return `<span class="badge badge-success" style="background-color: #ccc31c!important;"> ${status.value} </span>`;
        case "Open":
          return `<span class="badge badge-primary" style="background-color: #ccc31c!important;"> ${status.value} </span>`;
        default:
          return `<span class="badge badge-info"> ${status.value} </span>`;
      }
    }
    return status;
  }

  toggleScaner(status) {
    $(".scaner-body").animate(
      {
        "margin-right": status == 1 ? "0px" : "-500px"
      },
      1000
    );
    $("#scanRMA").focus();
    $("#scanner-close").toggleClass("scanner-open");
    $("#scanner-open").toggleClass("scanner-open");
  }

  ngOnInit() {
    this.Tabs = [
      { name: "Global RMA(s)", code: "glb" },
      { name: "Pending RMA(s)", code: "pnd" }
    ];

    this._route.paramMap.subscribe(param => {
      this.status = param.get("Code");
      this.brandCode = param.get("brand");
    });

    this._router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.gridOptions.api.setDatasource(this.dataSource);
      });

    this.renderRMAqueue(this.status);
  }

  renderRMAqueue(stCode) {
    this.status = stCode;
    this.gridOptions = {
      rowData: null,
      columnDefs: null,
      enableColResize: true,
      enableServerSideSorting: true,
      rowSelection: "single",
      rowDeselection: true,
      rowModelType: "infinite",
      pagination: true,
      paginationPageSize: 20,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 2,
      infiniteInitialRowCount: 1,
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
      maxConcurrentDatasourceRequests: 1,
      maxPagesInPaginationCache: 1,
      getRows: (params: any) => {
        var sortColID = null;
        var sortDirection = null;
        if (typeof params.sortModel[0] != "undefined") {
          sortColID = params.sortModel[0].colId;
          sortDirection = params.sortModel[0].sort;
        }

        //=========Date Filter============//
        var fromDate = null,
          toDate = null;
        //debugger;
        //=========Date Filter============//
        this._returnService
          .getGAReturnOrders(
            params.startRow,
            params.endRow,
            sortColID,
            sortDirection,
            this.filterValue,
            this.status,
            fromDate,
            toDate,
            this.brandCode
          )
          .subscribe(
            result => {
              var rowsThisPage = result.recordsets[0];
              this.Permissions = result.recordsets[1];
              this.LocalAccess = result.recordsets[1].map(function(e) {
                return e.FunctionType;
              });
              if (!this.hasPermission("View")) {
                this._router.navigate(["dashboard"]);
              }
              if (this.status == "glb" && this.brandCode == "dsc2")
                this.gridOptions.api.setColumnDefs(this.columnDefs_glb);
              else if (this.status == "pnd" && this.brandCode == "dsc2")
                this.gridOptions.api.setColumnDefs(this.columnDefs_pnd);
              else if (this.brandCode == "dsc2")
                this.gridOptions.api.setColumnDefs(this.columnDefs_oow);
              else this.gridOptions.api.setColumnDefs(this.columnDefs_bp_oow);

              if (result.totalcount == 0) this.gridApi.showNoRowsOverlay();
              else this.gridApi.hideOverlay();

              var lastRow = result.totalcount;
              params.successCallback(rowsThisPage, lastRow);
              this.ntID = 0;
            },
            error => {
              console.log("this is error:" + error);
            }
          );
      }
    };
    this.gridOptions.datasource = this.dataSource;
    //this.gridOptions.api.setDatasource(this.dataSource);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.gridApi.api != undefined) {
      this.gridApi.api.sizeColumnsToFit();
      setTimeout(function() {
        this.gridApi.api.sizeColumnsToFit();
      }, 2000);
    }
    this.gridApi.purgeServerSideCache([]);
  }

  setLinkCellRender(colDefs, fieldName, IsPermission) {
    if (IsPermission) {
      var coldef = colDefs.find(element => element.field == fieldName);
      if (coldef != null) {
        coldef.cellRenderer = this.cellEditRender;
      }
    }
  }

  cellEditRender(val) {
    if (val == null || val.value == undefined) return;
    if (val != null) {
      var control = `<a style="cursor:pointer; margin-right:4px" data-action-type="edit">
      ${val.value}</a>`;
      if (val.data && val.data.hasFiles)
        control +=
          '<i class="fa fa-paperclip" style="color:#919eab;font-size: 15px; cursor: pointer;"></i>';
      if (val.data && val.data.hasNotes)
        control +=
          ' <i class="fa fa-comment" style="color:#919eab;font-size: 15px; cursor: pointer;"></i>';
      return control;
    }
    return val;
  }

  onFilterChanged() {
    if (this.filterValue === "") {
      this.filterValue = null;
    }
    this.ntID = 0;
    this.gridOptions.api.setDatasource(this.dataSource);
  }

  ngOnDestroy() {}

  EditClicked(data) {
    this.getOrderDetailOnRowClick(data.RMANumber, data.status);
  }

  getOrderDetailOnRowClick(RMANumber, status) {
    var _extraParam = "0";
    this._router.navigate([
      "back-office/ga_returns/gaqueue/" +
        this.status.toLowerCase() +
        "/" +
        this.brandCode.toLowerCase() +
        "/" +
        RMANumber +
        "/" +
        _extraParam
    ]);
  }

  onSelectionChanged() {
    var nt = this.gridOptions.api.getSelectedRows()[0];
    if (nt) {
      this.ntID = nt.ID;
    } else {
      this.ntID = 0;
    }
  }

  onRowClicked(e) {
    return;
  }
}
