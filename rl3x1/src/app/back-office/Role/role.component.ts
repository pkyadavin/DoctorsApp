import { Component, ElementRef, ErrorHandler, ViewChild } from "@angular/core";
import { RoleService } from "./role.service";
import { Role } from "./role.model";
// import { Observable } from 'rxjs/Observable';
import { Observable, BehaviorSubject, from, throwError } from "rxjs";
import { GridOptions } from "ag-grid-community";
import { Menu, MenuCollection } from "../sidebar/menu.model";
import { Permission } from "../sidebar/menu.model";
import { DashBoard } from "./role.model";
import { GlobalVariableService } from "../../shared/globalvariable.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../../shared/common.service";
import { message, modal } from "../../controls/pop";
import { Property, TypedJson, Util } from "../../app.util";
import { EditComponent } from "../../shared/edit.component";
import { SidebarService } from "../sidebar/sidebar.service";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
//import { DownloadComponent } from "../download/download.component";
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
@Component({
  selector: "all-roles",
  providers: [RoleService, ApplicationInsightsService],
  templateUrl: "./role.template.html"
})
export class Roles extends Property implements ErrorHandler {
  @ViewChild("pop") _popup: message;
  Roles: Role[];
  DashBoards: DashBoard[];
  CurrentRole: Role;
  private _ListView: Boolean = true;
  LocalAccess: any = [];
  errorMessage: string;
  Permi: any[];
  moduleTitle: string;
  gridOptions: GridOptions;
  Permissions: any;
  isEditVisible: boolean;
  isSaveClick: boolean;
  filterText: string;
  partnerID: any;
  dataSource: any = [];
  filterValue: string;
  columnDefs = [];
  isExpend: boolean = false;
  //@ViewChild("download") _downloadComponent: DownloadComponent;

  get ListView(): Boolean {
    return this._ListView;
  }
  set ListView(lv: Boolean) {
    this._ListView = lv;
    if (lv == false) {
      this.isExpend = false;
    }
  }

  onCheckRenderer(param) {}

  constructor(
    private _util: Util,
    private _menu: SidebarService,
    private element: ElementRef,
    private $Role: RoleService,
    private commonService: CommonService,
    private _globalService: GlobalVariableService,
    private activateRoute: ActivatedRoute,
    private _router: Router,
    private loaderService: LoaderService,
    private _appInsightService: ApplicationInsightsService
  ) {
    super();
    try {
      var partnerinfo = _globalService.getItem("partnerinfo");
      this.partnerID = partnerinfo[0].LogInUserPartnerID;
      this.moduleTitle = this._menu.menus.filter(
        f => f.routeKey === this._router.url
      )[0].title;
      this.CurrentRole = new Role();

      this.gridOptions = {
        rowData: [],
        columnDefs: null,
        enableColResize: true,
        enableServerSideSorting: true,
        pagination: true,
        enableServerSideFilter: true,
        rowModelType: "infinite",
        paginationPageSize: 50,
        rowHeight: 38,
        enableFilter: true,
        enableSorting: true,
        // paginationOverflowSize: 2,
        rowSelection: "single",
        maxConcurrentDatasourceRequests: 2,
        // paginationInitialRowCount: 1,
        // maxPagesInCache: 2,
        context: {
          componentParent: this
        }
      };
    } catch (err) {}

    this.isEditVisible = false;
  }

  ngOnInit() {
    
    this._appInsightService.logPageView("Roles", this._router.url);
    this.filterText = null;

    this.dataSource = {
      rowCount: null, // behave as infinite scroll
      paginationPageSize: 50,
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
        this.loaderService.display(true);
        this.$Role
          .getallRoles(
            this.partnerID,
            params.startRow,
            params.endRow,
            sortColID,
            sortDirection,
            this.filterText
          )
          .subscribe(
            _Orders => {
              //debugger;
              this.LocalAccess = _Orders.recordsets[2].map(function(e) {
                return e.FunctionType;
              });
              if (!this.hasPermission("View")) {
                this._router.navigate(["dashboard"]);
              }
              //debugger;
              this.Roles = _Orders.recordsets[0];
              var localize = JSON.parse(
                _Orders.recordsets[1][0].ColumnDefinations
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
                element => element.field == "RoleName"
              );
              if (coldef != null && this.hasPermission("View")) {
                coldef.cellRendererFramework = EditComponent;
              }

              if (!this.gridOptions.columnApi.getAllColumns())
                this.gridOptions.api.setColumnDefs(this.h_localize);
              var lastRow = _Orders.totalcount;
              if (this.Roles.length <= 0)
                this.gridOptions.api.showNoRowsOverlay();
              else this.gridOptions.api.hideOverlay();

              params.successCallback(this.Roles, lastRow);
              this.loaderService.display(false);
              this.CurrentRole = new Role();
            },
            error => (this.errorMessage = <any>error)
          );
      }
    };
    
    this.gridOptions.datasource = this.dataSource;
    this.ListView = true;

    this.$Role.getalldboards().subscribe(returnvalue => {
      this.DashBoards = returnvalue;
    });
    //this._downloadComponent.moduleName = "Role";
  }

  handleError(error) {}
  gridapi = null;
  onFilterChanged() {
    this.loaderService.display(true);
    if (this.filterText === "") {
      this.filterText = null;
    }
    this.gridOptions.api.setDatasource(this.dataSource);
    this.loaderService.display(false);
  }
  dboardchange() {
    var cdb = this.DashBoards.filter(
      d =>
        d.DashBoardMasterID ===
        parseInt(this.CurrentRole.DashBoardMasterID.toString())
    )[0];
    this.CurrentRole.DashBoardDescription =
      (cdb && cdb.DashBoardDescription) || "";
  }

  ExpendAll(isExpend) {
    if (isExpend) {
      $("#accordion .collapse").collapse("show");
    } else {
      $("#accordion .collapse").collapse("hide");
    }
  }

  AssignFullPermission(id: string, pid: string) {
    var thisElement = <HTMLInputElement>document.getElementById(id);
    if (thisElement.classList.contains("cb_child")) {
      var x = <HTMLCollectionOf<Element>>$(".cg_" + pid);
      var y = <HTMLCollectionOf<Element>>$(".cg_" + pid + ":checked");
      var parentElement = <HTMLInputElement>document.getElementById(pid);
      parentElement.checked = y.length == x.length; // ? true : false;
    }
    var childElements = <HTMLCollectionOf<Element>>(
      document.getElementsByClassName("cb_child_" + id)
    );
    Array.from(childElements).forEach(f =>
      this.AssignPermission(f.attributes["id"].value, thisElement.checked)
    );
  }

  AssignPermission(id: string, access?: boolean) {
    var thisElement = <HTMLInputElement>document.getElementById(id);
    thisElement.checked = access;
    var childElements = <HTMLCollectionOf<Element>>(
      document.getElementsByClassName(id)
    );
    Array.from(childElements).forEach(f => {
      if (f.attributes["id"]) {
        var permissionElement = <HTMLInputElement>(
          document.getElementById(f.attributes["id"].value)
        );
        permissionElement.checked = thisElement.checked;
      }
    });
  }

  Show() {
    this.CurrentRole = new Role();
    this.CurrentRole.RoleID = 0;
    this.ShowRole();
  }

  ShowRole() {
    this.$Role.getAccessCategory(this.CurrentRole.RoleID).subscribe(
      _Authorization => {
        console.log(this.CurrentRole.RoleID);
        this.CurrentRole.Authorization = $.map(
          TypedJson.parse<Array<Menu>>(_Authorization[0]),
          function(v, i) {
            return new Menu(v);
          }
        );
      },
      error => {
        this.errorMessage = <any>error;
      }
    );

    this.ListView = false;
  }

  EditClicked(val) {
    this.CurrentRole = val;
    this.ShowRole();
  }

  onSelectionChanged() {
    try {
      this.CurrentRole = this.gridOptions.api.getSelectedRows()[0];
      this.isEditVisible = true;
      // this.ChangeHomePageOption(this.CurrentRole.UserType);
      if (!this.CurrentRole) {
        this.isEditVisible = false;
      }
    } catch (err) {}
  }

  Save(form) {
    // console.log(form.value.RoleName.length)
    if (!form.valid) {
      for (var i in form.controls) {
        console.log(form.controls);
        form.controls[i].markAsTouched();
      }
      form.valueChanges.subscribe(data => {
        this.isSaveClick = !form.valid;
      });
      this.isSaveClick = true;
      return;
    }

    var Scope = $.map($(".c_c_permission:not(:checked)"), function(i) {
      return i.id.replace("checkbox", "");
    });
    var Access = $.map($(".c_c_permission:checked"), function(i) {
      return i.id.replace("checkbox", "");
    });

    this.Permi = [
      { r: JSON.stringify(this.CurrentRole), na: Scope, a: Access }
    ];
    this.$Role.Save(this.Permi).subscribe(
      _Authorization => {
        if (_Authorization.result == "Duplicated") {
          this._util.error("Role Name already exists.", "Alert");
          return;
        }
        if (this.CurrentRole.RoleID == 0) {
          this.CurrentRole.RoleID = _Authorization.data[0][0].ID;
          this.CurrentRole.Authorization = $.map(
            TypedJson.parse<Array<Menu>>(_Authorization.data[1]),
            function(v, i) {
              return new Menu(v);
            }
          );
          this._util.success("Saved successfully.", "Success");
        } else {
          this._util.success("Updated successfully.", "Success");
          this.ListView = true;
        }
      },
      error => {
        this.errorMessage = <any>error;
        this._util.error(this.errorMessage, "Error");
      }
    );
  }

  Delete(me: any = this) {
    this._popup.Confirm(
      "Delete",
      "Do you really want to remove this role?",
      function() {
        me.$Role.Delete(me.CurrentRole.RoleID).subscribe(
          _Roles => {
            var result = _Roles;

            if (
              result.data
                .toLowerCase()
                .indexOf("conflicted with the reference") > -1
            ) {
              me._util.warning(
                "Role cannot be deleted.It is being used in other modules.",
                "Alert"
              );
            } else {
              me._util.success(
                "Role removed successfully.",
                "Success",
                "Success"
              );
            }

            me.gridOptions.api.setDatasource(me.dataSource);
          },
          error => {
            me.errorMessage = <any>error;
            me._util.error(me.errorMessage, "Alert");
          }
        );
      }
    );
  }

  Cancel() {
    this.CurrentRole = new Role();
    this.CurrentRole.RoleID = 0;
    this.ListView = true;
  }

  ShowPerMission(permission: string): boolean {
    if (typeof this.Permissions == "undefined") {
      return false;
    } else {
      var index = this.Permissions.findIndex(x => x.FunctionName == permission);
      if (index >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      if (actionType == "edit") {
        this.CurrentRole = data;
        this.ShowRole();
      }
    }
  }
}
