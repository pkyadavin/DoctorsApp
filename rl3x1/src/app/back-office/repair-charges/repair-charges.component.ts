import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Repair_ChargesService } from './repair-charges.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import {Repair_ChargesModel} from './repair-charges.model'
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { LoaderService } from '../../loader/loader.service';


declare var $: any;
@Component({
    selector: 'CountryGrid',
    providers: [Repair_ChargesService],
    templateUrl: './repair-charges.html'
})

export class repair_charges extends Property {
  [x: string]: any;
    IsGridLoaded: boolean = false;
    @Input() GridType: string;
  //  @Input('PartnerId') PartnerId: number;
    @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
    Resolutionlist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    repaircharges: Repair_ChargesModel[];
    IsLoaded: boolean = false;
    ListView: boolean = true;  
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    UserID: number;
   isSaveClick: any;

    columnDefs = [
        { headerName: 'Resolution', width: 200 },
        { headerName: 'Bill to Customer', field: "BillingCode", width: 100 },
        { headerName: 'Bill to Arc’Teryx ', field: "BillingCodeName", width: 100 },
        { headerName: 'Cost Calculation', width: 200 },
        { headerName: 'Price List Column', field: "BillingCode", width: 100 },             
        { headerName: 'ISActive', field: "Description", width: 200 }

    ];
    CurrentRepair_ChargesObj: Repair_ChargesModel = new Repair_ChargesModel();




    constructor(
        private _util: Util,private _menu: SidebarService, private _router: Router, private loaderService: LoaderService,
        private repairchargesevice: Repair_ChargesService , public commonService: CommonService, private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute, ) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID=partnerinfo[0].UserId;
        this.ListView=true;
        //this.CurrentRepair_ChargesObj.IsActive=true;
    }
    ngOnInit() {
       // this.loadPermissionByModule(this.moduleTitle);
        this.filterText = null;
        this.Resolutionlist = [];
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
              this.loaderService.display(true);
                this.repairchargesevice.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType });
                     
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var localeditor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                        });
                     
                        this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                       
                        var rowsThisPage = result.recordsets[0];
                       
                        this.IsLoaded = true;
                        if (this.GridType == "popup") {
                            localize.unshift({
                                headerName: "Select",
                                width: 200,
                                template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                            });
                            localize.unshift({
                                headerName: "ID",
                                width: 200,
                                field: "ID",
                                hide: true,
                            });
                        }
                       
                        var coldef = this.h_localize.find(element => element.field == "repair_action");
                        if (coldef != null && this.hasPermission("View")) {
                            coldef.cellRendererFramework = EditComponent;
                        }
                        var coldef = this.h_localize.find(element => element.field == "IsActive");
                        if (coldef != null) {
                            coldef.cellRendererFramework = ImageColumnComponent;
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

        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }
    onSelectionChanged() {
        this.isEditConfigSetup$ = true;
        this.isDeleteConfigSetup$ = true;
        this.CurrentRepair_ChargesObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentRepair_ChargesObj) {
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
        this.gridapi.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }
    onRowClicked(e) {
        debugger;
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "select") {
               
                console.log(data);
            }
            else if (actionType == "edit") {
                this.CurrentRepair_ChargesObj = data;
                this.onEditCountry();

            }
        }
    }
    EditClicked(val) {
        debugger;
        this.CurrentRepair_ChargesObj = val;
        this.onEditresolution();
    }
    
    onAddCountry() {
        this.ListView = false;     
        this.IsLoaded = true;
        this.CurrentRepair_ChargesObj = new Repair_ChargesModel();
        if (this.CurrentRepair_ChargesObj.IsActive == undefined) {

            this.CurrentRepair_ChargesObj.IsActive = true;

        }
    }

    onEditresolution() {
        this.loaderService.display(true);
        this.ListView = false;     
        if (this.CurrentRepair_ChargesObj.IsActive.toString() == 'Yes') {
            this.CurrentRepair_ChargesObj.IsActive = true;
        }
        else {
            this.CurrentRepair_ChargesObj.IsActive = false;
        }
        this.loaderService.display(false);
    } 

  
    Save(form) {
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

        this.CurrentRepair_ChargesObj.UserID = this.UserID
        if (this.CurrentRepair_ChargesObj.repair_chargesid == undefined) {
            this.CurrentRepair_ChargesObj.repair_chargesid = 0;
        }
        
       console.log(JSON.stringify(this.CurrentRepair_ChargesObj));
        this.repairchargesevice.Save(this.CurrentRepair_ChargesObj)
            .subscribe(returnvalue => {
                var result = returnvalue.data;
                this.loaderService.display(false);

                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentRepair_ChargesObj = new Repair_ChargesModel();
                    this.Cancel();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentRepair_ChargesObj = new Repair_ChargesModel();
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
        this.isCancel$ = false;
        var node = this.gridapi.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }

    onAddrepaircharges() {
        this.ListView = false;
        this.IsLoaded = true;
        this.CurrentRepair_ChargesObj = new Repair_ChargesModel();
        if (this.CurrentRepair_ChargesObj.IsActive == undefined) {        
            this.CurrentRepair_ChargesObj.IsActive = true;
            this.CurrentRepair_ChargesObj.repair_chargesid = 0;
          
        }
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];

        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
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
}
