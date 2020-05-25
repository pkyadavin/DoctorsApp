import { Component, ViewChild } from '@angular/core';
import { NodeMasterService } from './nodemaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { NodeMaster } from './nodemaster.model';
import { Property, Util } from '../../app.util';
import { message } from '../../controls/pop/index.js';
import { CommonService } from '../../shared/common.service'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';

declare var $: any;

@Component({
    selector: 'NodeMaster',
    providers: [NodeMasterService],
    templateUrl: './nodemaster.html'
})

export class NodeMasterComponent extends Property  {
    filterText: string;
    loading: boolean;
    nodeMasterlist: NodeMaster[];
    formField: [{}];
    currentNode: NodeMaster;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    isAddNodeMaster$ = true;
    isEditNodeMaster$ = false;
    isDeleteNodeMaster$ = false;
    isNodeMasterList$ = true;
    isCancel$ = false;
    IsGridLoaded: boolean;
    isSaveClick: boolean = false;
    LocalAccess = [];
    partnerID: number;

    columnDefs = [
        { headerName: 'Node', field: "Node", width: 250 },
        //{ headerName: 'IsActive', field: "IsActive", width: 200 },
        {
            headerName: 'IsActive',
            field: 'Active',
            width: 80,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding"><i class="'+params.value.toString()+'"></i></span> </div>';
            }
            //template: '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"> <span ng-cell-text class="ng-binding"><i class={{row.entity["Active"]}}></i></span> </div>'
        },
        { headerName: 'Created By', field: "CreatedBy", width: 150 },
        { headerName: 'Created Date', field: "CreatedDate", width: 150 },
        { headerName: 'Modified By', field: "ModifyBy", width: 150 },
        { headerName: 'Modified Date', field: "ModifyDate", width: 150 }
    ];

    constructor(private _util:Util, private _menu: SidebarService, private _router:Router,
        private nodeMasterService: NodeMasterService, private _activatedRoute: ActivatedRoute, private _globalService: GlobalVariableService, private commonService: CommonService) {
        super()
        //this.moduleTitle = _globalService.getModuleTitle(_activatedRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
    }

    @ViewChild('pop') _popup: message;

    ngOnInit() {
        this.loadPermissionByModule(this.moduleTitle);
        this.filterText = null;
        this.loading = true;
        this.gridOptions = {
            rowData: this.nodeMasterlist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            ///paginationpaginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
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
                this.nodeMasterService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {

                        //var rowsThisPage = result.recordsets[0];
                        //var localize = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                        var rowsThisPage = result.recordsets[0];
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                        //var isPermission = this.LocalAccess.indexOf("View") == -1 ? false : true;
                        //this.IsGridLoaded = true;
                        //this._globalService.setLinkCellRender(localize, 'Node', isPermission); 



                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var node_editor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
                        });
                        this.e_localize = JSON.parse("{" + node_editor.join(',') + "}");

                        if(!this.gridOptions.columnApi.getAllColumns())
                        this.gridOptions.api.setColumnDefs(this.h_localize);
                        // see if we have come to the last page. if we have, set lastRow to
                        // the very last row of the last page. if you are getting data from
                        // a server, lastRow could be returned separately if the lastRow
                        // is not in the current page.

                        var lastRow = result.totalcount;

                        params.successCallback(rowsThisPage, lastRow);

                        this.isEditNodeMaster$ = false;
                    });
            }
        }

        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }

    onSelectionChanged() {
        this.isEditNodeMaster$ = true;
        this.currentNode = this.gridOptions.api.getSelectedRows()[0];

        if (!this.currentNode) {
            this.isEditNodeMaster$ = false;
        }
        //var nodeId = this.gridOptions.api.getSelectedRows()[0].ID;

        //this.nodeMasterService.load(nodeId).subscribe(result => {
        //    if (nodeId == 0) {
        //        this.currentNode = result[0];
        //    }
        //    else {
        //        this.currentNode = result[0][0];
        //    }
        //    this.formField = result[1];
        //    //this.IsLoaded = true;
        //});
    }

    onSubmit(form: any) {
        //if(form.valid)
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            })
            this.isSaveClick = true;
            return;
        }

        if (this.currentNode.NodeID == 0) {
            this.nodeMasterService.create(this.currentNode).subscribe(returnvalue => {
                this.CancelNodeMaster();
                this.isEditNodeMaster$ = false;
                this.gridOptions.api.setDatasource(this.dataSource);
                this._util.error('Sub-Inventory detail saved successfully.',"Alert");
            }, error => {
                this.errorMessage = <any>error
                this._util.error(this.errorMessage,"Error");
            });
        }
        else {
            this.nodeMasterService.update(this.currentNode).subscribe(returnvalue => {
                this.CancelNodeMaster();
                this.isEditNodeMaster$ = false;
                this.gridOptions.api.setDatasource(this.dataSource);
                this._util.error('Sub-Inventory detail saved successfully.','Alert');
            }, error => {
                this.errorMessage = <any>error
                this._util.error('Error', this.errorMessage,"Error");
            });
        }
    }


    ShowHideAdd() {
        this.isAddNodeMaster$ = false;
        this.isEditNodeMaster$ = false;
        //this.isDeleteNodeMaster$ = false;
        this.isNodeMasterList$ = false;
        this.isCancel$ = true;
        this.currentNode = new NodeMaster();
        this.currentNode.NodeID = 0;
        this.currentNode.Node = "";
        this.currentNode.IsActive = true;
        this.currentNode.CreatedBy = 44;
        this.currentNode.ModifyBy = 44;
    }

    ShowHideEdit() {
        this.isAddNodeMaster$ = true;
        this.isEditNodeMaster$ = true;
        //this.isDeleteNodeMaster$ = true;
        this.isCancel$ = true;
        this.isNodeMasterList$ = false;
        
    }

    CancelNodeMaster() {
        this.isAddNodeMaster$ = true;
       // this.isEditNodeMaster$ = false;
        //this.isDeleteNodeMaster$ = false;
        this.isCancel$ = false;
        this.isNodeMasterList$ = true;

        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
        //this._router.navigate(['app.node']);
    }

    Delete() {
        this._popup.Confirm('Delete', 'Do you really want to delete it?', this.onConfirmPopup());
    }

    onConfirmPopup() {
        this.nodeMasterService.remove(this.currentNode.NodeID)
            .subscribe(
            _configSetup => {
                this.isAddNodeMaster$ = true;
                this.isEditNodeMaster$ = false;
                this.isCancel$ = false;
                this.isNodeMasterList$ = true;
                this.gridOptions.api.setDatasource(this.dataSource);
                //this._router.navigate(['app.configsetup']);
            },
            error => this.errorMessage = <any>error);

        //if (confirm('Do you want to delete this Node?')) {
        //    if (this.currentNode != null && NodeMasterId != 0) {
        //        this.nodeMasterService.remove(NodeMasterId);
        //    }
        //}
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0]||[];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {

                this.ShowHideEdit();

            }
        }
    }
}