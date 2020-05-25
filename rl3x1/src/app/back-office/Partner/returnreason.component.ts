import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ReturnReason } from '../ReturnReason/returnreason.model';
import { ReturnReasonService } from '../ReturnReason/returnreason.service';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Property, Util } from '../../app.util';
import { message } from '../../controls/pop/index.js';
import { EditComponent } from '../../shared/edit.component'
import { SidebarService } from '../sidebar/sidebar.service';
import { ActiveComponent } from 'src/app/shared/active.component';

declare var $: any;
@Component({
    selector: 'ReturnReasons',
    templateUrl: './returnreason.html'
})

export class ReturnReasons extends Property {
    @Input() AvailableReasons: any;
    @Input() GridType: string;
    @Input() ScopeType: string;
    @Output() notifyReason: EventEmitter<ReturnReason> = new EventEmitter<ReturnReason>();
    returnReasons: ReturnReason[];
    currentReason: ReturnReason;
    filterText: string;
    ReturnReasondataSource: any;
    ReturnReasongridOption: GridOptions;
    errorMessage: string;
    ListView: boolean = true;
    partnerID: any;
    moduleTitle: any;
    isEditVisible: boolean = false;
    IsEditorVisible: boolean = false;
    columnDefs = [{}];
    @ViewChild('pop') _popup: message;
    selectedId: number = 0;
    IsGridLoaded: boolean = false;
    ReturnReasonType: any;
    Scope: string = "0";
    IsShowReturnReasonList: boolean = false;

    constructor(private _util: Util, private _menu: SidebarService, private _returnReasonService: ReturnReasonService, public commonService: CommonService, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService, private _router: Router) {
        super();
        this.filterText = null;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        this.loadPermissionByModule(this.moduleTitle);
    }
    resongridOptionsapi = null;
    resongridColumnsapi = null;
    onReturnReasonGridReady(gridparam) {
        this.resongridOptionsapi = gridparam.api;
        this.resongridColumnsapi = gridparam.columnApi;
    }
    ngOnInit() {

        this.activateRoute.params.subscribe(
            (param: any) => {
                if (param['Scope']) {
                    this.Scope = param['Scope'];
                }
            });

        this.ReturnReasongridOption = {
            rowData: this.returnReasons,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            rowDeselection: true,
            rowModelType: 'infinite',
            pagination: true,
            paginationPageSize: 20,
            cacheOverflowSize: 20,
            maxConcurrentDatasourceRequests: 2,
            infiniteInitialRowCount: 1,
            maxBlocksInCache: 20,
            rowHeight: 38,
            cacheBlockSize: 20,
            context: {
                componentParent: this
            }
        };

        this.LoadReturnReason();

        if (this.GridType == "popup") {
            $('#divHeader').addClass('widget-header');
            this.ReturnReasongridOption.rowSelection = "multiple";
            this.ReturnReasongridOption.suppressRowClickSelection = true;
            this.Scope = this.ScopeType;
            if (this.ScopeType == "RRA")
                this.IsShowReturnReasonList = true;
            else
                this.IsShowReturnReasonList = false;
        }
        else {
            $('#divHeader').addClass('widget-header widget-header1');
            this.ReturnReasongridOption.rowSelection = "single";
            this.ReturnReasongridOption.suppressRowClickSelection = false;
            this.IsShowReturnReasonList = false;
        }

        // this._returnReasonService.GetRMAActionType().subscribe(result => {
        //     this.ReturnReasonType = result.recordsets[0];
        // });        


        this.currentReason = new ReturnReason();
        this.ListView = true;
    }
    LoadReturnReason1() {
        if (this.resongridOptionsapi)
            this.resongridOptionsapi.setDatasource(this.ReturnReasondataSource);
    }


    LoadReturnReason() {
        this.ReturnReasondataSource = {
            rowCount: null,
            paginationPageSize: 20,
            paginationOverflowSize: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                var filterData = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }

                this._returnReasonService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID, this.Scope).
                    subscribe(
                        _result => {
                            var rowsThisPage = _result.recordsets[0];
                            //var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
                            var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
                            //var isPermission = this.ShowPerMission("View");
                            //this.IsGridLoaded = true;
                            //this._globalService.setLinkCellRender(localize, 'RMAActionCode', isPermission); 
                            if (this.GridType == "popup") {
                                //localize.unshift({
                                //    headerName: "Select Reason",
                                //    width: 200,
                                //    template: '<a style="cursor:pointer;" data-action-type="selectReason">Select</a>'
                                //});                            

                                $.each(this.AvailableReasons, function (i, v) {
                                    var ind = rowsThisPage.map(function (e) { return e.RMAActionCodeID; }).indexOf(v.ReasonID);
                                    if (ind > -1) {
                                        rowsThisPage.splice(ind, 1);
                                    }
                                });

                                localize.unshift({
                                    headerName: "Select Reason",
                                    width: 100,
                                    //headerCellRenderer: this.selectAllRenderer,
                                    checkboxSelection: true
                                });

                            }
                            else {
                                var coldef = localize.find(element => element.field == "RMAActionName");
                                if (coldef != null && this.hasPermission("View")) {
                                    coldef.cellRendererFramework = EditComponent;
                                }
                                var coldef1 = localize.find(element => element.field == "RMAActionCode");
                                if (coldef1 != null && this.hasPermission("View")) {
                                    coldef1.cellRendererFramework = EditComponent;
                                }
                            }
                            debugger;
                            var coldef4 = localize.find(element => element.field == "isActive");
                            if (coldef4 != null) {
                                coldef4.cellRendererFramework = ActiveComponent;
                            }
                            var coldef2 = localize.find(element => element.field == "OnCP");
                            if (coldef2 != null) {
                                coldef2.cellRendererFramework = ActiveComponent;
                            }

                            var coldef3 = localize.find(element => element.field == "OnBO");
                            if (coldef3 != null) {
                                coldef3.cellRendererFramework = ActiveComponent;
                            }

                            if (!this.resongridColumnsapi.getAllColumns())
                                this.resongridOptionsapi.setColumnDefs(localize);
                            this.returnReasons = _result;
                            //var lastRow = _result.totalcount;
                            var lastRow;
                            if (this.GridType == "popup")
                                lastRow = _result.recordsets[0].length;//.totalcount - (this.AvailableReasons.length<=_result.totalcount ? this.AvailableReasons.length:0);
                            else
                                lastRow = _result.totalcount;

                            params.successCallback(rowsThisPage, lastRow);

                            this.isEditVisible = false;
                        });
            }
        }
        this.ReturnReasongridOption.datasource = this.ReturnReasondataSource;
    }

    ChangeReturnReasonType(ReasonType) {

        this.Scope = ReasonType == "undefined" ? "RRA" : ReasonType;
        if (this.resongridOptionsapi)
            this.resongridOptionsapi.setDatasource(this.ReturnReasondataSource);
    }

    AddSelected() {
        var data = this.resongridOptionsapi.getSelectedRows();
        this.onActionChk(data);
    }

    //selectAllRenderer(params) {
    //    var cb = document.createElement('input');
    //    cb.setAttribute('type', 'checkbox');
    //    cb.style.cssText = "opacity:1 !important;left:10px; top: -1px";

    //    var eHeader = document.createElement('label');
    //    var eTitle = document.createTextNode(params.colDef.headerName);
    //    eHeader.appendChild(cb);
    //    eHeader.appendChild(eTitle);

    //    cb.addEventListener('change', function (e) {
    //        if ($(this)[0].checked) {
    //            params.api.selectAll();
    //        } else {
    //            params.api.deselectAll();
    //        }
    //    });
    //    return eHeader;
    //}

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "selectReason") {
                return this.onActionChk(data);
            }
            else if (actionType == "edit") {

                this.ShowEditor(data.RMAActionCodeID);

            }
        }
    }
    EditClicked(val) {
        this.ShowEditor(val.RMAActionCodeID);
    }
    public onActionChk(data: any) {
        this.notifyReason.emit(data);
    }

    onSelectionChanged() {
        this.currentReason = this.resongridOptionsapi.getSelectedRows()[0];
        this.isEditVisible = true;
        if (!this.currentReason) {
            this.isEditVisible = false;
        }
    }

    ShowEditor(codeId) {
        this.selectedId = codeId;
        this.IsEditorVisible = true;
    }

    onDelete() {
        var me = this;
        this._popup.Confirm('Delete', 'Are you sure you want to delete this? ', function () {
            me._returnReasonService.remove(me.currentReason.RMAActionCodeID).subscribe(_result => {
                me._popup.Alert('Alert', 'Deleted successfully.');
                me.resongridOptionsapi.setDatasource(me.ReturnReasondataSource);
            }, error => {
                me.errorMessage = <any>error;
                if (me.errorMessage.indexOf('The DELETE statement conflicted with the REFERENCE constraint') > -1) {
                    me.errorMessage = 'Could not remove this reason, It has refrenced from other information.'
                }
                me._popup.Alert('Error!', me.errorMessage);
            });
        });
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.resongridOptionsapi.setDatasource(this.ReturnReasondataSource);
        //this.resongridOptionsapi.setQuickFilter(this.filterText);
        this.isEditVisible = false;
    }

    ChangeEditorVisibility(data) {
        if (data) {
            this.resongridOptionsapi.setDatasource(this.ReturnReasondataSource);
            this.currentReason = new ReturnReason();
            this.isEditVisible = false;
        }
        var node = this.resongridOptionsapi.getSelectedNodes()[0];
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
            }
        )
    }

    ShowPerMission(permission: string): boolean {
        //var me: any = this;
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
}