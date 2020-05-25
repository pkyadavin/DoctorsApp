import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { UserService } from "./User.Service.js";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { AgGridNg2 } from "ag-grid-angular";
import { GridOptions } from "ag-grid-community";
import { User } from "./User.model";
import { Property, Util } from "../../app.util";
import { message } from "../../controls/pop/index";
import { CommonService } from "../../shared/common.service";
import { GlobalVariableService } from "../../shared/globalvariable.service";
import { EditComponent } from "../../shared/edit.component";
import { BsModalComponent } from "ng2-bs3-modal";
import { ToolTipComponent } from "../../shared/tooltip.component";
import { SidebarService } from "../sidebar/sidebar.service";
import { ImageColumnComponent } from "../../shared/image-column.component";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";

declare var $: any;
declare var XLSX: any;
@Component({
  selector: "UserGrid",
  providers: [UserService,ApplicationInsightsService],
  templateUrl: "./user.html"
})
export class UserGrid extends Property {
  @Input() userGridType: string;
  @Input("Scope") Scope: string;
  @Input() AvailableUsers: any;
  @Output() notifyUser: EventEmitter<User> = new EventEmitter<User>();
  IsGridLoaded: boolean = false;
  IsEditorVisible: boolean = false;
  filterText: string;
  loading: boolean;
  //users: Observable<User[]>;
  userlist: User[];
  singleUser: User;
  dataSource: any;
  gridOptions: GridOptions;
  errorMessage: string;
  isEditUser = false;
  isDeleteUser = false;
  isSelectedID: number;
  //moduleTitle: string;
  moduleTitle1: string;
  columnDefs = [{}];
  LocalAccess = [];
  partnerID: number;
  UserScope: string;

  ShowUploadbutton: boolean = true;
  importErrorMessage: string;
  regXMLData: any;
  Result: string = "";
  selectedValue: string;
  jsonlist: any;
  templatePath: string;
  ImportResults: any;
  ImportStatus: string = "";
  ImportInProcess: boolean = false;
  @ViewChild("fileInput") fileInput;
  @ViewChild("importPopup") _importPopup: BsModalComponent;
  //UserType: any;
  userid: number = 0;
  isRowClicked: boolean = false;
  constructor(
    private _util: Util,
    private userService: UserService,
    private _menu: SidebarService,
    private _router: Router,
    private activateRoute: ActivatedRoute,
    private _globalService: GlobalVariableService,
    private commonService: CommonService,
    private _appInsightService: ApplicationInsightsService
  ) {
    super();
    var dd =
      activateRoute.snapshot.parent.url[0].path +
      "/" +
      activateRoute.snapshot.parent.url[1].path;
    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;
    //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path +'/'+ activateRoute.snapshot.parent.url[1].path);
    var partnerinfo = _globalService.getItem("partnerinfo");
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    //this.loadPermissionByModule(this.moduleTitle);

    this.gridOptions = {
      rowData: this.userlist,
      columnDefs: null,
      enableColResize: true,
      enableServerSideSorting: true,
      enableServerSideFilter: true,
      pagination: true,
      rowModelType: "infinite",
      paginationPageSize: 20,
      rowHeight: 38,
      maxConcurrentDatasourceRequests: 2,
      suppressRowClickSelection: false,
      cacheOverflowSize: 2,
      rowSelection: "single",
      rowDeselection: true,
      maxBlocksInCache: 2,
      cacheBlockSize: 20,
      context: {
        componentParent: this
      }
    };
  }

  @ViewChild("pop") _popup: message;

  ngOnInit() {
    this._appInsightService.logPageView('Users', this._router.url);
    this.filterText = null;
    this.loading = true;
    this.activateRoute.params.subscribe((param: any) => {
      if (param["Scope"]) this.Scope = param["Scope"];
    });

    if (this.userGridType == "popup") {
      $("#divHeader").addClass("widget-header");
      this.gridOptions.rowSelection = "multiple";
      this.gridOptions.suppressRowClickSelection = true;
    } else {
      $("#divHeader").addClass("widget-header widget-header1");
      this.gridOptions.rowSelection = "single";
      $("#divgrid").addClass("marginTop34");
      this.gridOptions.suppressRowClickSelection = false;
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
        debugger;
        this.userService
          .loadAll(
            params.startRow,
            params.endRow,
            sortColID,
            sortDirection,
            this.filterText,
            this.partnerID,
            "PTR001",
            null
          )
          .subscribe(result => {
            debugger;
            this.isRowClicked = false;
            console.log(result.recordsets);
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
                " }"
              );
            });
            this.e_localize = JSON.parse("{" + node_editor.join(",") + "}");

            if (this.userGridType == "popup") {
              $.each(this.AvailableUsers, function(i, v) {
                var ind = rowsThisPage
                  .map(function(e) {
                    return e.UserID;
                  })
                  .indexOf(v.UserID);
                if (ind > -1) {
                  rowsThisPage.splice(ind, 1);
                }
              });

              this.h_localize.unshift({
                headerName: "Select User",
                width: 100,
                //headerCellRenderer: this.selectAllRenderer,
                checkboxSelection: true
              });
            } else {
              var coldef = this.h_localize.find(
                element => element.field == "UserName"
              );
              if (coldef != null && this.hasPermission("View")) {
                coldef.cellRendererFramework = EditComponent;
              }
            }
            this.h_localize.splice(4, 0, {
              headerName: "Role",
              field: "Role",
              width: 200
              // cellRendererFramework: ToolTipComponent
            });
            var coldef = this.h_localize.find(
              element => element.field == "IsActive"
            );
            if (coldef != null) {
              coldef.cellRendererFramework = ImageColumnComponent;
            }
            if (!this.gridOptions.columnApi.getAllColumns())
              this.gridOptions.api.setColumnDefs(this.h_localize);

            console.log("column def:", this.h_localize);

            // see if we have come to the last page. if we have, set lastRow to
            // the very last row of the last page. if you are getting data from
            // a server, lastRow could be returned separately if the lastRow
            // is not in the current page.

            var lastRow = result.totalcount;
            debugger;
            if (rowsThisPage.length <= 0)
              this.gridOptions.api.showNoRowsOverlay();
            else this.gridOptions.api.hideOverlay();
            params.successCallback(rowsThisPage, lastRow);

            this.isEditUser = false;
            this.isDeleteUser = false;
          });
      }
    };

    this.gridOptions.datasource = this.dataSource;

    this.loading = false;
  }

  OpenTooltip(item) {
    //console.log(item);
    //alert("Mouse enter event");
  }

  LeaveTooltip(item) {
    //console.log(item);
    //alert("Mouse Leave event");
  }

  // ChangeUserType(userType) {
  //     this.Scope = userType;
  //     this.gridOptions.api.setDatasource(this.dataSource);
  // }

  AddSelected() {
    var data = this.gridOptions.api.getSelectedRows();
    this.onActionChk(data);
  }

  onRowClicked(e) {
    this.isRowClicked = true;
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      if (actionType == "selectUser") {
        return this.onActionChk(data);
      } else if (actionType == "edit") {
        this.onEditUser(data.UserID);
      }
    }
  }

  public onActionChk(data: any) {
    this.notifyUser.emit(data);
    // console.log(data);
  }

  EditClicked(val) {
    this.onEditUser(val.UserID);
  }

  onSelectionChanged() {
    this.singleUser = this.gridOptions.api.getSelectedRows()[0];
    if (this.singleUser != undefined) {
      this.userid = this.singleUser.UserID;
      this.isEditUser = true;
      this.isDeleteUser = true;
      if (!this.singleUser) {
        this.isEditUser = false;
        this.isDeleteUser = false;
      }
    }
  }

  onAddUser() {
    this.userid = 0;
    this.isSelectedID = 0;
    this.IsEditorVisible = true;
  }

  onEditUser(UserID) {
    if (UserID <= 0) {
      this._util.error("Please select user", "Alert");
      return;
    }
    this.isSelectedID = UserID;
    this.IsEditorVisible = true;
  }

  onConfirmPopup(userId: number) {
    this.userService.remove(userId).subscribe(
      _user => {
        this.gridOptions.api.setDatasource(this.dataSource);
      },
      error => (this.errorMessage = <any>error)
    );
  }

  onDeleteUser(userId: number) {
    var me: any = this;
    if (this.singleUser != null && userId != 0) {
      this._popup.Confirm(
        "Delete",
        "Do you really want to delete it?",
        function() {
          me.userService.remove(me.singleUser.UserID).subscribe(
            _Roles => {
              me._popup.Alert("Alert", "User removed successfully.");
              me.gridOptions.api.setDatasource(me.dataSource);
              me.ListView = true;
            },
            error => {
              me.errorMessage = <any>error;
              if (
                me.errorMessage.indexOf(
                  "The DELETE statement conflicted with the REFERENCE constraint"
                ) > -1
              ) {
                me.errorMessage =
                  "Could not remove user, It has refrenced from other information.";
              }
              me._util.error(me.errorMessage, "Alert");
            }
          );
        }
      );
    }
  }

  onFilterChanged() {
    this.isRowClicked = false;
    if (this.filterText === "") {
      this.filterText = null;
    }
    // this.gridOptions.api.setQuickFilter(this.filterText);
    this.gridOptions.api.setDatasource(this.dataSource);
  }

  // async loadPermissionByModule(Module: string) {
  //     var partnerinfo = this._globalService.getItem('partnerinfo')[0];
  //     await this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
  //         returnvalue => {
  //             var localpermission = returnvalue[0] || [];
  //             this.LocalAccess = localpermission.map(function (item) {
  //                 return item['FunctionName'];
  //             });
  //             //if (this.IsGridLoaded) {
  //             //    this.gridOptions.api.setDatasource(this.dataSource);
  //             //}
  //         }
  //     )
  // }

  ChangeEditorVisibility(data) {
    if (data) {
      this.gridOptions.api.setDatasource(this.dataSource);
    }
    var node = this.gridOptions.api.getSelectedNodes()[0];
    if (node) {
      node.setSelected(false);
    }

    this.IsEditorVisible = false;
  }

  selectFile(type): void {
    if (type == 0) {
      this.templatePath = "";
    } else {
      this.templatePath = "";
    }

    this._importPopup.open();
    this.ShowUploadbutton = true;

    this.ImportResults = [];
    this.ImportStatus = "";
  }

  close() {
    this._importPopup.close();
    this.ShowUploadbutton = true;

    var me = this;
    me.fileInput.nativeElement.value = "";
    me.ImportResults = [];
    me.ImportStatus = "";

    this.gridOptions.api.setDatasource(this.dataSource);
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
        me.userService.importUsers(me.regXMLData, 7).subscribe(
          returnvalue => {
            me.Result = returnvalue.result;
            me.ImportResults = returnvalue.result.split("#");

            if (me.ImportResults.length > 1) {
              me.ImportResults.splice(me.ImportResults.length - 1, 1);
              me.ImportStatus = "Failed";
            } else {
              me.ImportStatus = "Success";
              me.gridOptions.api.setDatasource(me.dataSource);
            }
            me.fileInput.nativeElement.value = "";
            me.ImportInProcess = false;
          },
          error => {
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
    //["ItemNumber", "ArticleNumber", "ItemName", "ItemDescription", "Manufacturer", "ItemModel", "ItemPrice"]
    var jsonstring = "";
    if (Range == "") {
      this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      //for (let d of this.jsonlist) {
      //    if (this.jsonlist.hasOwnProperty[d]) {
      //        this.jsonlistFinal.push(d);
      //    }
      //}

      jsonstring = JSON.stringify({ root: this.jsonlist });
    } else {
      //this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: Range });
      this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: 0 });

      jsonstring = this.jsonlist;
    }

    this.regXMLData = jsonstring;
  }
}
