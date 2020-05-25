import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UOMMasterService } from './uomMaster.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'

import { UOMMaster } from './uomMaster.model';
import { GlobalVariableService } from '../../shared/globalvariable.service';

import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { SidebarService } from '../sidebar/sidebar.service';
@Component({
    selector: 'UOMMasterGrid',
    providers: [UOMMasterService],
    templateUrl: './uomMaster.html'
})
export class UOMMasterGrid extends Property {
    models: Observable<UOMMaster[]>;

    @Input() unitmodelGridType: string;
    @Output() notifyUnitModel: EventEmitter<any> = new EventEmitter<any>();

    IsEditorVisible: boolean;
    selectedId: number;
    modellist: UOMMaster[];
    gridOptions: GridOptions;
    errorMessage: string;
    filterValue: string
    dataSource: any;
    isEditVisible: boolean;
    IsGridLoaded: boolean = false;
    partnerID: number;
    columnDefs =
        [
            { headerName: 'Article Name', field: "ArticleNumber", width: 200 },
            { headerName: 'Item Name', field: "ItemName", width: 200 },
        ];

    CurrentUOM: UOMMaster = new UOMMaster()
    constructor(private uomMasterService: UOMMasterService,private _util:Util
        , private _router: Router, private _globalService: GlobalVariableService
        , public commonService: CommonService
        , private activateRoute: ActivatedRoute
        , private _menu: SidebarService
    ) {
        super();
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        this.loadPermissionByModule(this.moduleTitle);
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
    }

    ngOnInit() {
        this.filterValue = null;
        this.isEditVisible = false;
        this.gridOptions = {
            rowData: this.modellist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            rowHeight: 38,
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
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
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.uomMasterService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.partnerID).
                    subscribe(
                        result => {
                            var rowsThisPage = result.recordsets[0];
                            //this.gridOptions.api.setColumnDefs(JSON.parse(result.recordsets[1][0].ColumnDefinitions));                       
                            //var lastRow = result.totalcount;
                            //params.successCallback(rowsThisPage, lastRow);
                            var colDefs;
                            //if (!this.IsGridLoaded)
                            colDefs = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                            //var isPermission = this.ShowPerMission("View");
                            //this.IsGridLoaded = true;
                            //this._globalService.setLinkCellRender(colDefs, 'UOMName', isPermission);

                            if(!this.gridOptions.columnApi.getAllColumns())
                            this.gridOptions.api.setColumnDefs(colDefs);
                            var lastRow = result.totalcount;
                            params.successCallback(rowsThisPage, lastRow);

                            this.isEditVisible = false;

                        });


            }
        }
        this.gridOptions.datasource = this.dataSource;
    }
    closepopup() {
        this.notifyUnitModel.emit();
    }
    onSelectionChanged() {
        this.isEditVisible = true;
        this.CurrentUOM = this.gridOptions.api.getSelectedRows()[0];
        if (!this.CurrentUOM) {
            this.isEditVisible = false;
        }
    }
    OnEditUOM(UOMID) {
        this.selectedId = UOMID;
        this.IsEditorVisible = true;
        //this._router.navigate(['EditUOM'], { queryParams: { ID: UOMID } });
    }

    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterValue);
    }
    ChangeEditorVisibility(data) {
        if (data) {
            this.gridOptions.api.setDatasource(this.dataSource);
            this.isEditVisible = false;
        }

        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }

        this.IsEditorVisible = false;
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, Module).subscribe(
            returnvalue => {
                this.Permissions = returnvalue[0];
                this.LocalAccess = returnvalue[0].map(function (item) {
                    return item['FunctionName'];
                });
                //added
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }

    ShowPerMission(permission: string): boolean {
        if (typeof (this.Permissions) == 'undefined') {
            return false;
        }
        else {
            var index = this.Permissions.findIndex(x => x.FunctionName == permission)
            if (index >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {

                this.OnEditUOM(data.UOMID);

            }
        }
    }

}