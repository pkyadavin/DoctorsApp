﻿import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProductGradeService } from './product-grade.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/RX';
// import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { ProductGradeModel } from './product-grade.model.js';
// import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from "../../shared/active.component";
import { LoaderService } from '../../loader/loader.service';
declare var $: any;
@Component({
    selector: 'ProductGradeGrid',
    providers: [ProductGradeService],
    templateUrl: './product-grade.html'
})

export class ProductGrade extends Property {
    IsGridLoaded: boolean = false;
    @Input() GridType: string;
  //  @Input('PartnerId') PartnerId: number;
    @Output() notifyGradeCode: EventEmitter<any> = new EventEmitter<any>();
    Gradelist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    //countries: ProductGradeModel[];
    IsLoaded: boolean = false;
    ListView: boolean = true;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    RegionList: any;
    UserID: number;
   isSaveClick: any;

    columnDefs = [
        { headerName: 'Region', width: 120 },
        { headerName: 'Category Code', field: "BillingCode", width: 200 },
        { headerName: 'Description', field: "BillingCodeName", width: 200 },
        { headerName: 'ISActive', field: "Description", width: 200 }

    ];
    CurrentGradeObj: ProductGradeModel = new ProductGradeModel();
    constructor(
        private _util: Util,private _menu: SidebarService, private _router: Router,
        private GradeService: ProductGradeService, public commonService: CommonService, private _globalService: GlobalVariableService, 
        private activateRoute: ActivatedRoute, private loaderService: LoaderService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID=partnerinfo[0].UserId;
       
    }
    ngOnInit() {
       // this.loadPermissionByModule(this.moduleTitle);
         this.GetRegions();
        this.filterText = null;
        this.Gradelist = [];
        this.gridOptions = {
            rowData: this.Gradelist,
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
                this.GradeService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {
                        this.loaderService.display(false);
                        var rowsThisPage = result.recordsets[0];
                        this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType });
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
                        
                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var localeditor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                        });
                        this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                        var rowsThisPage = result.recordsets[0];
                        debugger;
                        this.IsLoaded = true;
                        // if (this.GridType == "popup") {
                        //     localize.unshift({
                        //         headerName: "Select",
                        //         width: 200,
                        //         template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                        //     });
                        //     localize.unshift({
                        //         headerName: "GradeId",
                        //         width: 200,
                        //         field: "GradeId",
                        //         hide: true,
                        //     });
                        // }
                        debugger;
                        var coldef = this.h_localize.find(element => element.field == "GradeCd");
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
                        this.isEditConfigSetup$ = false;
                        this.isDeleteConfigSetup$ = false;
                    },
                    error => {
                        this.loaderService.display(false);
                        this.errorMessage = <any>error;
                    });
            } 
        }

        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }
    onSelectionChanged() {
        this.isEditConfigSetup$ = true;
        this.isDeleteConfigSetup$ = true;
        this.CurrentGradeObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentGradeObj) {
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
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "select") {
                this.notifyGradeCode.emit(data);
                console.log(data);
            }
            else if (actionType == "edit") {
                this.CurrentGradeObj = data;
                this.onEditCategory();

            }
        }
    }
    EditClicked(val) {
        this.CurrentGradeObj = val;
        this.onEditCategory();
    }
    GetRegions() {
        this.GradeService.getRegions().
            subscribe(
           region => {

                this.RegionList =region;
               // alert(JSON.stringify(this.RegionList));
            },
            Error => this.errorMessage = <any>Error
            );
    }
    onAddCategory() {
        this.ListView = false;
        this.IsLoaded = true;
        this.CurrentGradeObj = new ProductGradeModel();
        if (this.CurrentGradeObj.IsActive == undefined) {
        
            this.CurrentGradeObj.IsActive = true;
          
        }
    }

    onEditCategory() {
        debugger;
        this.ListView = false;
        
        if (this.CurrentGradeObj.IsActive.toString() == 'Yes') {
            this.CurrentGradeObj.IsActive = true;
        }
        else {
            this.CurrentGradeObj.IsActive = false;
        }

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

        this.CurrentGradeObj.UserID = this.UserID
        if (this.CurrentGradeObj.GradeId == undefined) {
            this.CurrentGradeObj.GradeId = 0;
        }

      //  console.log(JSON.stringify(this.CurrentCountryObj));
      this.loaderService.display(true);
        this.GradeService.Save(this.CurrentGradeObj)
            .subscribe(returnvalue => {
                this.loaderService.display(false);
                var result = returnvalue.data;
                debugger;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentGradeObj = new ProductGradeModel();
                    this.Cancel('save');
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentGradeObj = new ProductGradeModel();
                    this.Cancel('update');
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
            error => {
                this.loaderService.display(false);
                this.errorMessage = <any>error;
            });
            //error => this.errorMessage = <any>error);
    }

    Cancel(action) {
        this.ListView = true;
        this.isAddConfigSetup$ = true;
        this.isDeleteConfigSetup$ = false;
        this.isCancel$ = false;
        var node = this.gridapi.getSelectedNodes()[0];
        if(action=='back')
            node['data'].IsActive=node['data'].IsActive==true?"Yes":"No";
        if (node) {
            node.setSelected(false);
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