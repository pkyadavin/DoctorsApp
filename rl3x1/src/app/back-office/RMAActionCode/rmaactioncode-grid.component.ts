import { Component } from '@angular/core';
import { RMAActionCodeService } from './RMAActionCode.Service.js';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { RMAActionCode } from './RMAActionCode.model'
import { ActivatedRoute } from '@angular/router';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Property, Util } from '../../app.util'; 
import { CommonService } from '../../shared/common.service'
import { SidebarService } from '../sidebar/sidebar.service.js';

declare var $: any;

@Component({
    selector: 'RMAActionCodeGrid',
    providers: [RMAActionCodeService],
    templateUrl: './rmaactioncode.html'
})

export class RMAActionCodeGrid extends Property {
    IsGridLoaded: boolean = false;
    selectedId: number
    filterText: string;
    loading: boolean;
    IsEditorVisible: boolean = false;
    rmaactioncodelist: RMAActionCode[];
    CurrentRMAActionCode: RMAActionCode;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    isAddRMAActionCode = true;
    isEditRMAActionCode = false;
    isDeleteRMAActionCode = false;
    moduleTitle: string;
    partnerID: any;
    LocalAccess: any = [];


    constructor(private _util:Util, private _menu:SidebarService,
        private rmaactioncodeService: RMAActionCodeService, public commonService: CommonService, private _router: Router, private _globalService: GlobalVariableService, private _activateRoute: ActivatedRoute) {
        super()
        //this.moduleTitle = this._globalService.getModuleTitle(this._activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.loadPermissionByModule(partnerinfo[0].UserId, partnerinfo[0].LogInUserPartnerID, this.moduleTitle);
    }
    gridapi = null;
    onGridReady(gridParams){
        this.gridapi = gridParams.api;
        gridParams.api.setDatasource(this.dataSource)
    }
    ngOnInit() {      
        this.filterText = null;
        this.loading = true;

        this.gridOptions = {
            rowData: this.rmaactioncodelist,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationpaginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            rowHeight: 38,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };
        this.dataSource = {
            rowCount: null,
            paginationPageSize: 20,
            paginationOverflowSize: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.rmaactioncodeService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {                   
                        var rowsThisPage = result.recordsets[0];
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                        //var isPermission = this.LocalAccess.indexOf("View") == -1 ? false : true;
                        //this.IsGridLoaded = true;
                        //this._globalService.setLinkCellRender(localize, 'RMAActionCode', isPermission); 
                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var node_editor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
                        });
                        this.e_localize = JSON.parse("{" + node_editor.join(',') + "}");

                        if(!this.gridOptions.columnApi.getAllColumns())
                        this.gridOptions.api.setColumnDefs(this.h_localize);

                        var lastRow = result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);

                        this.isEditRMAActionCode = false;
                        this.isDeleteRMAActionCode = false;
                    });
            }
        }
    }

    onSelectionChanged() {
        this.CurrentRMAActionCode = this.gridOptions.api.getSelectedRows()[0];        
        this.isEditRMAActionCode = true;
        this.isDeleteRMAActionCode = true;
        if (!this.CurrentRMAActionCode) {
            this.isEditRMAActionCode = false;
            this.isDeleteRMAActionCode = false;
        }

    }

    onAddRMAActionCode() {
        this.selectedId = 0;
        this.IsEditorVisible = true;
    }

    onEditRMAActionCode(RMAActionCodeID) {
        this.selectedId = RMAActionCodeID;
        this.IsEditorVisible = true;     
    }

    onDeleteRMAActionCode(rmaactioncodeId: number) {
        if (confirm('Do you want to delete this rma action?')) {
            if (this.CurrentRMAActionCode != null && rmaactioncodeId != 0) {
                this.rmaactioncodeService.remove(rmaactioncodeId);
            }
        }
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }

    loadPermissionByModule(userID, logInUserPartnerID, moduleTitle) {
        this.commonService.loadPermissionByModule(userID, logInUserPartnerID, moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }

    ChangeEditorVisibility(data) {
        if (data) {
            this.gridOptions.api.setDatasource(this.dataSource);
            this.isEditRMAActionCode = false;
            this.isDeleteRMAActionCode = false;
        }
        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }

        this.IsEditorVisible = false;
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {

                this.onEditRMAActionCode(data.RMAActionCodeID);

            }
        }
    }
}