import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ManufacturerService } from './Manufacturer.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AgGridModule } from 'ag-grid-angular';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'

import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';

import { Manufacturer } from './Manufacturer.model';
import { message, modal } from '../../controls/pop';
import { SidebarService } from '../sidebar/sidebar.service';
import { GlobalVariableService } from 'src/app/shared/globalvariable.service';
declare var $: any;

@Component({
    selector: 'Manufacturer',
    providers: [ManufacturerService],
    templateUrl: './Manufacturer.html'

})

export class ManufacturerComponent extends Property {

    @Input() manufacturereGridType: string;
    @Output() notifyManufacturereModel: EventEmitter<any> = new EventEmitter<any>();
    @Output('close') closeEvent = new EventEmitter();
    isAllowDelete: boolean;

    CurrentObj: Manufacturer = new Manufacturer(null);
    Manufacturerlist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    ListView: boolean = true;
    partnerID: number;
    isSaveClick: any;
    columnDefs = [
        { headerName: 'Location Code', field: "BillingCodeLookupId", hide: true, width: 120 },
        { headerName: 'Location Name', field: "BillingCode", width: 200 },
        { headerName: 'Index Row', field: "BillingCodeName", width: 200 },
        { headerName: 'FrameID', field: "Description", width: 200 },
        { headerName: 'ColorCode', field: "Description", width: 200 }

    ];

    constructor(
        private manufacturerService: ManufacturerService, public commonService: CommonService
        , private activateRoute: ActivatedRoute
        , private _menu: SidebarService
        , private _util: Util
        , private _router: Router
        , private _globalService: GlobalVariableService
    ) {
        super();
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);

        var partnerinfo = _globalService.getItem('partnerinfo');

        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;


        this.partnerID = partnerinfo[0].LogInUserPartnerID;

        //if (this.manufacturereGridType == "popuprefress") {
        //    this.isAllowDelete = false;
        //}
        //else {
        //    this.isAllowDelete = true;
        //} 

    }
    @ViewChild('pop') _popup: message;
    @ViewChild('pop1') _popup1: modal;
    @ViewChild('modalFacility') _fac: modal;
    ngOnInit() {

        if (this.manufacturereGridType == "popuprefress")
            this.moduleTitle = "Product Manufacturer";

        //this.loadPermissionByModule(this.moduleTitle);
        this.filterText = null;
        this.gridOptions = {
            rowData: this.Manufacturerlist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            rowHeight: 38,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
               };
        this.dataSource = {
            rowCount: null,
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
                this.manufacturerService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                        result => {

                            var rowsThisPage = result.recordsets[0];
                            var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
                            this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                            var localeditor = localize.map(function (e) {
                                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                            });
                            this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                            var rowsThisPage = result.recordsets[0];
                            if(!this.gridOptions.columnApi.getAllColumns())
                            this.gridOptions.api.setColumnDefs(this.h_localize);
                            // see if we have come to the last page. if we have, set lastRow to
                            // the very last row of the last page. if you are getting data from
                            // a server, lastRow could be returned separately if the lastRo
                            var lastRow = result.totalcount;
                            params.successCallback(rowsThisPage, lastRow);
                        });
            }
        }

        this.gridOptions.datasource = this.dataSource;

        this.loading = false;
    }

    onSelectionChanged() {
        this.CurrentObj = new Manufacturer(this.gridOptions.api.getSelectedRows()[0]);
    }
    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }
    onRowClicked(e) {

        //if (e.event.target !== undefined) {
        //    let data = e.data;
        //    let actionType = e.event.target.getAttribute("data-action-type");            
        //    if (actionType == "selectItemModel") {
        //        return this.onActionChk(data);
        //    }
        //    else if (actionType == "edit") {
        //        this.OnEditModel(data.ModelID);
        //    }
        //}
    }
    public onActionChk(data: any) {
        //this.notifyItemModel.emit(data);
    }
    onAdd() {
        this.CurrentObj = new Manufacturer(null);
        this.CurrentObj.IsActive = true;
        this.ListView = false;
    }
    closepopup() {
        this.notifyManufacturereModel.emit();
    }
    onEdit() {

        if (String(this.CurrentObj.IsActive) == 'Yes' || this.CurrentObj.IsActive == true) {
            this.CurrentObj.IsActive = true;
        }
        else {
            this.CurrentObj.IsActive = false;
        }
        this.ListView = false;
    }

    Save(form) {

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

        if (String(this.CurrentObj.IsActive) == 'Yes' || this.CurrentObj.IsActive) {
            this.CurrentObj.IsActive = true;
        }
        else {
            this.CurrentObj.IsActive = false;
        }

        this.manufacturerService.Save(this.CurrentObj)
            .subscribe(returnvalue => {

                var result = returnvalue.data;
                var me = this;
                if (result == "Added") {
                    // this._popup.Alert('Alert', 'Manufacturere Saved Successfully', function () {
                    // });
                    this._util.success('Manufacturer saved successfully.', '');
                    me.Cancel();
                    if (this.manufacturereGridType == "popuprefress") {
                        this.notifyManufacturereModel.emit();
                    }
                    //if (this.manufacturereGridType == "popuprefress")
                    //{                        
                    //    this.notifyManufacturereModel.emit();
                    //}
                    //else
                    //{
                    //    this._popup.Alert('Alert', 'Record Saved Successfully', function () {
                    //        me.Cancel();
                    //    });
                    //}
                }
                else if (result == "Updated") {
                    // this._popup.Alert('Alert', 'Manufacturere Updated Successfully', function () {
                    // });
                    this._util.success('Manufacturer updated successfully.', '');
                    me.Cancel();

                    if (this.manufacturereGridType == "popuprefress") {
                        this.notifyManufacturereModel.emit();
                    }
                }
                else if (result == "Code Exists") {
                    // this._popup.Alert('Alert', 'Manufacturere Code already exists');
                    this._util.error('Manufacturer Code already exists.', '');
                }
                else {
                    //this._popup.Alert('Alert', 'Something went wrong. Please Contact system administrator.');
                    this._util.error('Something went wrong. Please Contact system administrator', '');
                }
            },
                error => this.errorMessage = <any>error);
    }
    onDelete() {
        var me = this;
        this._popup.Confirm('Delete', 'Do you want to remove this Record?', function () {

            me.manufacturerService.remove(me.CurrentObj.ID)
                .subscribe(
                    Result => {
                        var result = Result.data;
                        if (result == "Deleted") {
                            me.gridOptions.api.setDatasource(me.dataSource);
                            me.Cancel();

                            if (me.manufacturereGridType == "popuprefress") {
                                me.notifyManufacturereModel.emit();
                            }
                            //if (me.manufacturereGridType == "popuprefress") {                                                      
                            //    me.notifyManufacturereModel.emit();
                            //}
                            //else {   
                            //    me.gridOptions.api.setDatasource(me.dataSource);                                                   
                            //    me.Cancel();
                            //}
                        }
                    },
                    error => this.errorMessage = <any>error);

        });
    }
    Cancel() {
        this.ListView = true;
        this.CurrentObj = new Manufacturer(null);
        //var node = this.gridOptions.api.getSelectedNodes()[0];
        //if (node) {
        //    node.setSelected(false);
        //}

    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
            }
        )
    }



}