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
import { ReturnsService } from "../returns.service";
import { ReturnDataService } from "../returns-data.service";
import { EditComponent } from "src/app/shared/edit.component";
import { debug } from "util";
import { filter } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styles: [
    ">>> .ag-cell-focus { -webkit-user-select: text !important;-moz-user-select: text !important;-ms-user-select: text !important;user-select: text !important; }"
  ],
  styleUrls: ["./queue.component.css"]
})
export class QueueComponent extends Property implements OnInit, OnDestroy {
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
      headerName: "RMA #",
      field: "RLRefnumber",
      width: 160,
      cellRendererFramework: EditComponent
    },
    {
      headerName: "Warranty",
      field: "warrantystatus",
      width: 125
    },
    {
      headerName: "Status",
      field: "RHstatus",
      width: 175,
      cellRenderer: this.statusRender
    },
    { headerName: "RMA Source", field: "Source", width: 135 },
    { headerName: "Country", field: "CountryCode", width: 135 },
    { headerName: "RSO", field: "RSO", width: 135 },
    { headerName: "Return Type", field: "ServiceType", width: 135 },
    { headerName: "RMA Date", field: "returnDate", width: 135 }
  ];

  columnDefs_pnd = [
    {
      headerName: "REF #",
      field: "RLRefnumber",
      width: 160,
      cellRendererFramework: EditComponent
    },
    { headerName: "Warranty", field: "warrantystatus", width: 125 },
    {
      headerName: "Status",
      field: "RHstatus",
      width: 175,
      cellRenderer: this.statusRender
    },
    { headerName: "RMA Source", field: "Source", width: 135 },
    { headerName: "Country", field: "CountryCode", width: 135 },
    { headerName: "RSO", field: "RSO", width: 135 },
    { headerName: "Return Type", field: "ServiceType", width: 135 },
    { headerName: "Requested Date", field: "returnDate", width: 135 }
  ];

  columnDefs_oow = [
    {
      headerName: "REF #",
      field: "RLRefnumber",
      width: 160,
      cellRendererFramework: EditComponent
    },
    { headerName: "Product Count", field: "totalItem", width: 150 },
    {
      headerName: "Customer Name",
      field: "customerName",
      width: 175
    },
    { headerName: "Country", field: "CountryCode", width: 135 },
    { headerName: "RSO", field: "RSO", width: 135 },
    { headerName: "Return Type", field: "ServiceType", width: 150 },
    { headerName: "Requested Date", field: "returnDate", width: 150 }
  ];

  constructor(
    private _util: Util,
    private _menu: SidebarService,
    private _router: Router,
    private _returnService: ReturnsService,
    private _globalService: GlobalVariableService,
    private _route: ActivatedRoute,
    private _dataService: ReturnDataService
  ) {
    super();
  }

  ngDoCheck() {
    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;
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
    debugger;
    this._route.paramMap.subscribe(param => {
      this.status = param.get("Code");
      this.brandCode = param.get("brand");
      this.filterValue = null;
      this.dateFilter = null;
    debugger;
      if (this.status.toLowerCase() == "all") {
        var date = new Date();
        this.dateFilter = [];
        this.dateFilter.push(
          new Date(`${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`)
        );
        this.dateFilter.push(new Date());
      }
    });

    this._router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.location.reload();
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
        let count = 0;
        if (this.dateFilter) {
          fromDate = "";
          toDate = "";
          this.dateFilter.forEach(element => {
            var item = element.toString().split(" ", 4);
            for (let index = 0; index < item.length; index++) {
              if (index > 0) {
                if (count == 0) {
                  fromDate += item[index] + " ";
                } else {
                  toDate += item[index] + " ";
                }
              }
            }
            count++;
          });
        }
        //debugger;
        //=========Date Filter============//
        this._returnService
          .getReturnOrders(
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
              //debugger;
              var rowsThisPage = result.recordsets[0];
              this.Permissions = result.recordsets[1];
              this.LocalAccess = result.recordsets[1].map(function(e) {
                return e.FunctionType;
              });
              if (!this.hasPermission("View")) {
                this._router.navigate(["dashboard"]);
              }

              if (this.hasPermission("View")) {
                //this.setLinkCellRender(this.columnDefs, 'RMANumber', true);
              }
              //debugger;
              if (this.status == "glb")
                this.gridOptions.api.setColumnDefs(this.columnDefs_glb);
              else if (this.status == "pnd")
                this.gridOptions.api.setColumnDefs(this.columnDefs_pnd);
              else this.gridOptions.api.setColumnDefs(this.columnDefs_oow);
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
    //this.gridOptions.api.redrawRows();
    // var params = { force: isForceRefreshSelected() };
    // this.gridApi.refreshCells(params);
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
  }

  ngOnDestroy() {}

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

  Show(mode: string) {
    //debugger;
    if (mode == "Add") {
      this.ntID = 0;
      this._router.navigate(["back-office/returns/inspection"]);
    }
  }

  Delete(me: any = this) {}

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
    //   if (e.event.target !== undefined) {
    //     let data = e.data;
    //     let actionType = e.event.target.getAttribute("data-action-type");
    //     if (actionType == "edit") {
    //       console.log('click:', data);
    //       this.getOrderDetailOnRowClick(data.RMANumber, data.status);
    //       //this.getOrderDetailOnRowClick('RMA05032018002');
    //     }
    //   }
  }

  EditClicked(data) {
    this.getOrderDetailOnRowClick(
      data.RMANumber,
      data.status,
      data.CoTrackingNo
    );
  }

  getOrderDetailOnRowClick(RMANumber, status, CoTrackingNo) {
    //console.log('stt:', status);
    var _extraParam = "0";
    if (CoTrackingNo.toLowerCase() == "dccreated") {
      _extraParam = CoTrackingNo.toLowerCase();
    }
    this._router.navigate([
      "back-office/returns/queue/" +
        this.status.toLowerCase() +
        "/" +
        this.brandCode.toLowerCase() +
        "/" +
        RMANumber +
        "/" +
        _extraParam
    ]);
  }

  scanRMAByRMANumber(RMANumber: string) {
    this._returnService
      .scanRMA(RMANumber.replace("+", "-"), "initiated", this.status)
      .subscribe(_result => {
        if (_result.recordsets[0][0].Status == 1) {
          this._util.success("Scanned successfully.", "Success");
          if (_result.recordsets[0][0].RMANumber) {
            this._router.navigate([
              "back-office/returns/queue/" +
                this.status.toLowerCase() +
                "/" +
                _result.recordsets[0][0].RMANumber +
                "/" +
                RMANumber.replace("+", "-")
            ]);
          }
          if (this.gridOptions) {
            this.gridOptions.api.setDatasource(this.dataSource);
          }
        } else if (_result.recordsets[0][0].Status == 0) {
          this._util.error(_result.recordsets[0][0].ErrorMessage, "Error");
        }
      });
  }
}
