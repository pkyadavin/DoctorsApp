import { ViewChild, Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ItemSelectorService } from './ItemSelector.Service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'

import { ItemMaster } from './ItemSelector.Model'
import { message, modal } from '../../controls/pop/index.js';
import { NumericEditorComponent } from "../NumericEditor/numericEditor";
import { GlobalVariableService } from '../../shared/globalvariable.service';
declare var $: any;

@Component({

    selector: 'item-selector',
    providers: [ItemSelectorService],
    templateUrl: './ItemSelector.html'

})

export class ItemSelector implements OnChanges {
    @Output()
    itemListChange = new EventEmitter();
    //@Input('Source') ItemMasterList;
    @ViewChild('pop') _popup: message;
    itemMaster: ItemMaster;
    @Input('Source') itemMasterlist;
    @Input('ItemmasterId') ItemmasterId;
    @Input('Paramdata') Paramdata;
    gridOptions: GridOptions;
    gridOptionsselecteditem: GridOptions;
    filterValue: string
    dataSource: any;
    errorMessage: string;
    isEditVisible: boolean;
    IsGridLoaded: boolean;
    partnerID: number;
    columnDefs: any
    selectedcolumnDefs: any

    ngOnChanges(changes: SimpleChanges) {
        if (typeof (changes["itemMasterlist"]) != 'undefined' && typeof (changes["itemMasterlist"].currentValue) != 'undefined' && changes["itemMasterlist"].currentValue.length > 0) {
            // this.itemMasterlist = this.ItemMasterList;
            if (typeof (this.gridOptionsselecteditem) != 'undefined') {
                this.gridOptionsselecteditem.api.setRowData(this.itemMasterlist);

            }
        }
    }

    CurrentItemMaster: ItemMaster = new ItemMaster();
    constructor(
        private itemselectorService: ItemSelectorService
        , private _router: Router
        , private _globalService: GlobalVariableService) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.columnDefs = [
            {
                headerName: 'Action', field: "Action", Width: 50,
                cellRenderer: function (params: any) {
                    return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="selectitem" class="btn btn-primary btn-sm"><i class="fa fa-check-circle-o"></i> Select</button></div>';
                }
            },
            { headerName: 'Id', field: "ItemMasterID", width: 200, hide: true },
            { headerName: 'Name', field: "ItemName", width: 200 },
            { headerName: 'Number', field: "ItemNumber", width: 200 },
            { headerName: 'Description', field: "ItemDescription", width: 300 },
            { headerName: 'Price(' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 100 },
            { headerName: 'Quantity', editable: true, field: "Quantity", width: 100, cellEditorFramework: NumericEditorComponent }

        ];

    }


    ngOnInit() {
        this.filterValue = null;
        this.isEditVisible = false;
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        if (this.Paramdata != 'ModelMaster') {
            this.selectedcolumnDefs = [
                { headerName: 'Id', field: "ItemMasterID", width: 200, hide: true },
                { headerName: 'Name', field: "ItemName", width: 200 },
                { headerName: 'Number', field: "ItemNumber", width: 200 },
                { headerName: 'Description', field: "ItemDescription", width: 300 },
                { headerName: 'Price(' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 100 },
                { headerName: 'Quantity', editable: true, field: "Quantity", width: 100, cellEditorFramework: NumericEditorComponent },
                {
                    headerName: 'Action', field: "Action", Width: 50,
                    cellRenderer: function (params: any) {
                        return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteitem" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i> Delete</button></div>';
                    }
                }
            ];
        }
        else {
            this.selectedcolumnDefs = [
                { headerName: 'Id', field: "ItemMasterID", width: 200, hide: true },
                { headerName: 'Name', field: "ItemName", width: 200 },
                { headerName: 'Number', field: "ItemNumber", width: 200 },
                { headerName: 'Description', field: "ItemDescription", width: 300 },
                { headerName: 'Price(' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 100 },
                { headerName: 'Quantity', field: "Quantity", width: 100 },
                {
                    headerName: 'Action', field: "Action", Width: 50,
                    cellRenderer: function (params: any) {
                        return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteitem" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i> Delete</button></div>';
                    }
                }
            ];
        }
        this.gridOptions = {

            rowData: this.itemMasterlist,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
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
                if (typeof this.Paramdata === 'undefined') {
                    this.Paramdata = null;
                }
                var partnerinfo = this._globalService.getItem('partnerinfo');
                this.partnerID = partnerinfo[0].LogInUserPartnerID;
                this.itemselectorService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue
                    , this.Paramdata, this.partnerID).subscribe(
                        result => {
                            var rowsThisPage = result.recordsets[0];
                            if (typeof (this.ItemmasterId) != 'undefined') {

                                var lastRow = result.totalcount;
                                //--------rowsThisPage = rowsThisPage.filter(x => x.ItemMasterID != this.ItemmasterId);

                                lastRow = result.totalcount - 1;
                                params.successCallback(rowsThisPage, lastRow);
                            }
                            else {

                                params.successCallback(rowsThisPage, result.totalcount);
                            }
                        });
            }
        }
        this.gridOptions.datasource = this.dataSource;
        this.itemMasterlist = new Array<ItemMaster>();
        this.gridOptionsselecteditem = {
            rowData: this.itemMasterlist,
            columnDefs: this.selectedcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
        }
    }
    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterValue);
    }
    SelectItem(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");
            if (actionType === "selectitem") {
                this.itemMaster = e.data;
                if (this.itemMasterlist.indexOf(this.itemMaster) < 0) {
                    this.itemMasterlist.push(this.itemMaster);
                    this.gridOptionsselecteditem.api.setRowData(this.itemMasterlist);
                }
                else {
                    this._popup.Alert('Alert', 'Duplicate item');
                }
            }
        }
    }
    DeleteItem(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");
            if (actionType === "deleteitem") {
                this.itemMaster = e.data;
                var index = this.itemMasterlist.indexOf(this.itemMaster);
                this.itemMasterlist.splice(index, 1);
                this.gridOptionsselecteditem.api.setRowData(this.itemMasterlist);
            }
        }
    }
    SelectItemList() {
        this.itemListChange.emit(this.itemMasterlist);
    }

    CloseItemPopup() {
        $('#divItemPopup').modal('hide');
    }
}