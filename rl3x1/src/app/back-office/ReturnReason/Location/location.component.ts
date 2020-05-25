import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LocationService } from './location.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../../shared/common.service'
import { Property, Util } from '../../../app.util';
import { LocationModel } from './location.model';
import { message, modal } from '../../../controls/pop/index.js';
import { GlobalVariableService } from '../../../shared/globalvariable.service';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from "../../../shared/active.component";
import { LoaderService } from 'src/app/loader/loader.service';

declare var $: any;
@Component({
    selector: 'LocationGrid',
    providers: [LocationService],
    templateUrl: './location.html'
})

export class Location extends Property {
    IsGridLoaded: boolean = false;
    [x: string]: any;
    @Input() GridType: string;
    //  @Input('PartnerId') PartnerId: number;
    @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
    Countrylist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    issues: LocationModel[];
    IsLoaded: boolean = false;
    ListView: boolean = true;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    CategoryList: any;
    UserID: number;
    isSaveClick: any;
    selectedCategory: number = 6;    

    CurrentLocationObj: LocationModel = new LocationModel();
    
    constructor(
        private _util: Util, private _menu: SidebarService, private _router: Router,
        private locationService: LocationService, public commonService: CommonService, 
        private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute, 
        private loaderService: LoaderService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;
        this.ListView=true;
        //debugger;

    }
    @ViewChild('pop') _popup: message;
    ngOnInit() {
        //debugger;
        // this.loadPermissionByModule(this.moduleTitle);
        this.GetCategories();
        this.setDataSource();
        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }

    setDataSource() {

        this.filterText = null;
        this.Countrylist = [];
        this.gridOptions = {
            rowData: this.Countrylist,
            columnDefs: null,                       
            enableColResize: true,
            enableServerSideSorting: true,
            pagination: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationpaginationOverflowSize: 2,
            rowSelection: 'single',
            rowDeselection: true,
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInPaginationCache: 2,
            cacheOverflowSize: 2,
            //infiniteInitialRowCount: 1,
            maxBlocksInCache: 2,
            cacheBlockSize: 20,
            context: {
                componentParent: this
            }
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
                // if (typeof (this.PartnerId) == 'undefined') {
                //    this.PartnerId = 0;
                //  }
                //debugger;
                this.loaderService.display(true);
                this.locationService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                        result => {
                            var rowsThisPage = result.recordsets[0];
                            debugger;
                            this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType });
                            var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                            this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === 1; });
                            var localeditor = localize.map(function (e) {
                                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                            });
                            this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                            var rowsThisPage = result.recordsets[0];
                            //debugger;
                            this.IsLoaded = true;
                            if (this.GridType == "popup") {
                                localize.unshift({
                                    headerName: "Select",
                                    width: 200,
                                    template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                                });
                                localize.unshift({
                                    headerName: "CountryID",
                                    width: 200,
                                    field: "CountryID",
                                    hide: true,
                                });
                            }
                            //debugger;
                            var coldef = this.h_localize.find(element => element.field == "Name");
                            if (coldef != null && this.hasPermission("View")) {
                                coldef.cellRendererFramework = EditComponent;
                            }
                            var coldef = this.h_localize.find(element => element.field == "IsActive");
                            if (coldef != null) {
                                coldef.cellRendererFramework = ImageColumnComponent;
                                coldef.cellRendererFramework = ActiveComponent;
                            }
                            if (!this.gridOptions.columnApi.getAllColumns())
                                this.gridOptions.api.setColumnDefs(this.h_localize);

                            var lastRow = result.totalcount;
                            params.successCallback(rowsThisPage, lastRow);
                            this.loaderService.display(false);
                            this.isEditConfigSetup$ = false;
                            this.isDeleteConfigSetup$ = false;
                        });
            }
        }
       
    }

    onSelectionChanged() {
        this.isEditConfigSetup$ = true;
        this.isDeleteConfigSetup$ = true;
        this.CurrentLocationObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentLocationObj) {
            this.isEditConfigSetup$ = false;
            this.isDeleteConfigSetup$ = false;
        }
    }
    gridapi = null;
    gridcolumnapi = null;
    onGridReady(gridParams) {
        this.gridapi = gridParams.api;
        this.gridcolumnapi = gridParams.columnApi;
        this.gridapi.setDatasource(this.dataSource)
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.loaderService.display(true);
        this.gridapi.setDatasource(this.dataSource);
        this.loaderService.display(false);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "select") {
                this.notifyBillingCode.emit(data);
                console.log(data);
            }
            else if (actionType == "edit") {
                this.CurrentLocationObj = data;
                this.onEditLocation();

            }
        }
    }
    EditClicked(val) {
        this.loaderService.display(true);
        this.CurrentLocationObj = val;
        this.onEditLocation();
    }
    
    onAddLocation() {
        this.ListView = false;       
        //this.IsLoaded = true;
        this.CurrentLocationObj = new LocationModel();
        if (this.CurrentLocationObj.IsActive == undefined) {

            this.CurrentLocationObj.IsActive = true;
        }
        this.CurrentLocationObj.ID = this.selectedRegion;
    }

    onEditLocation() {
        debugger;
        this.ListView = false;        
        if (this.CurrentLocationObj.IsActive.toString() == 'Yes') {
            this.CurrentLocationObj.IsActive = true;
        }
        else {
            this.CurrentLocationObj.IsActive = false;
        }
        this.selectedCategory = this.CurrentLocationObj.CategoryID;
        this.loaderService.display(false);
    }
    
    Save(form) {
        debugger;
        this.loaderService.display(true);
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            })
            this.isSaveClick = true;
            this.loaderService.display(false);
            return;
        }

        this.CurrentLocationObj.UserID = this.UserID
        if (this.CurrentLocationObj.ID == undefined) {
            this.CurrentLocationObj.ID = 0;
            this.CurrentLocationObj.CategoryID = this.selectedCategory;
        }
        
        //  console.log(JSON.stringify(this.CurrentLocationObj));
        this.locationService.Save(this.CurrentLocationObj)
            .subscribe(returnvalue => {
                var result = returnvalue.data;
                this.loaderService.display(false);
                //debugger;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentLocationObj = new LocationModel();
                    this.Cancel();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentLocationObj = new LocationModel();
                    this.Cancel();
                    return;
                }               
            },
                error => this.errorMessage = <any>error);
    }    
    
    Cancel() {
        this.ListView = true;
        this.isAddConfigSetup$ = true;
        this.isDeleteConfigSetup$ = false;
        this.isCancel$ = false;
        this.gridapi.setDatasource(this.dataSource);
        this.loaderService.display(false);
        var node = this.gridapi.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }

    GetCategories() {
        this.locationService.getCategories().
            subscribe(
                c => {

                    this.CategoryList = c;
                    //alert(JSON.stringify(this.CategoryList));
                },
                Error => this.errorMessage = <any>Error
            );
    }

    getCategory(value: number) {
        //debugger;
        this.selectedRegion = value;
        this.CurrentLocationObj.CategoryID = this.selectedCategory;
        this.gridapi.setDatasource(this.dataSource);
    }
}
