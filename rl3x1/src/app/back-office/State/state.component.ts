import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { StateService } from './state.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { StateModel } from './state.model.js';
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from "../../shared/active.component";
import { LoaderService } from 'src/app/loader/loader.service';
declare var $: any;
@Component({
    selector: 'StateGrid',
    providers: [StateService],
    templateUrl: './state.html'
})

export class State extends Property {
    IsGridLoaded: boolean = false;
    @Input() GridType: string;
    //  @Input('PartnerId') PartnerId: number;
    @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
    Countrylist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    countries: StateModel[];
    IsLoaded: boolean = false;
    ListView: boolean = true;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    CountryList: any;
    UserID: number;
    isSaveClick: any;
    selectedCountry: number = 0;//First country shown in dropdown

    columnDefs = [       
        { headerName: 'State Code', field: "StateCode", width: 200 },
        { headerName: 'State Name', field: "StateName", width: 200 },
        { headerName: 'Description', field: "Description", width: 200 },
        { headerName: 'Active', field: "IsActive", width: 200 }        
    ];
    CurrentStateObj: StateModel = new StateModel();
    constructor(
        private _util: Util, private _menu: SidebarService, private _router: Router,
        private stateService: StateService, public commonService: CommonService, 
        private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute, 
        private loaderService: LoaderService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;
        //debugger;

    }
    ngOnInit() {
        //debugger;
        // this.loadPermissionByModule(this.moduleTitle);
        this.GetCountries();
        this.setDataSource();
        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }

    setDataSource() {
        
        this.filterText = null;
        this.Countrylist = [];
        this.gridOptions = {
            rowData: this.Countrylist,
            columnDefs: null,//this.columnDefs,
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
                this.stateService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID, this.selectedCountry).
                    subscribe(
                        result => {
                            var rowsThisPage = result.recordsets[0];
                            this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType });
                            var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                            this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                            var localeditor = localize.map(function (e) {
                                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                            });
                            this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                            var rowsThisPage = result.recordsets[0];
                            debugger;
                            this.IsLoaded = true;
                            
                            debugger;
                            var coldef = this.h_localize.find(element => element.field == "StateName");
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
        this.CurrentStateObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentStateObj) {
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
                this.CurrentStateObj = data;
                this.onEditState();

            }
        }
    }
    EditClicked(val) {
        this.loaderService.display(true);
        this.CurrentStateObj = val;
        this.onEditState();
    }
    GetCountries() {
        this.stateService.getCountries().
            subscribe(
                c => {

                    this.CountryList = c;
                    //alert(JSON.stringify(this.CountryList));
                },
                Error => this.errorMessage = <any>Error
            );
    }
    onAddState() {
        this.ListView = false;
        //this.IsLoaded = true;
        this.CurrentStateObj = new StateModel();
        if (this.CurrentStateObj.IsActive == undefined) {

            this.CurrentStateObj.IsActive = true;
        }
        this.CurrentStateObj.CountryID = this.selectedCountry; 
    }

    onEditState() {
        debugger;
        this.ListView = false;

        if (this.CurrentStateObj.IsActive.toString() == 'Yes') {
            this.CurrentStateObj.IsActive = true;
        }
        else {
            this.CurrentStateObj.IsActive = false;
        }
        this.CurrentStateObj.CountryID = this.selectedCountry; 
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

        this.CurrentStateObj.UserID = this.UserID
        if (this.CurrentStateObj.StateID == undefined) {
            this.CurrentStateObj.StateID = 0;
        }

        //  console.log(JSON.stringify(this.CurrentStateObj));
        this.stateService.Save(this.CurrentStateObj)
            .subscribe(returnvalue => {
                var result = returnvalue.data;
                this.loaderService.display(false);
                //debugger;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentStateObj = new StateModel();
                    this.Cancel();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentStateObj = new StateModel();
                    this.Cancel();
                    return;
                }
                else if (result == "Country Exists") {
                    this._util.error('Alert', 'Country already exists.');
                    return;
                }
                else {
                    this._util.error('Alert', 'Could not be saved. Something went wrong.');
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

    getCountry(value: number) {
        debugger;
        this.selectedCountry = value;
        this.CurrentStateObj.CountryID = this.selectedCountry; 
        this.gridapi.setDatasource(this.dataSource);
    }
}