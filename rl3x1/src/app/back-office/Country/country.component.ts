import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CountryService } from './Country.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { CountryModel } from './Country.model.js';
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from "../../shared/active.component";
import { TypeLookUp } from './typelookup.model';
import { LoaderService } from 'src/app/loader/loader.service';
declare var $: any;
@Component({
    selector: 'CountryGrid',
    providers: [CountryService],
    templateUrl: './country.html'
})

export class Country extends Property {
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
    countries: CountryModel[];
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
    selectedRegion: number = 1;

    columnDefs = [
        { headerName: 'Region', width: 120 },
        { headerName: 'Country Code', field: "BillingCode", width: 200 },
        { headerName: 'Country Name', field: "BillingCodeName", width: 200 },
        { headerName: 'ISActive', field: "Description", width: 200 }
    ];
    CurrentCountryObj: CountryModel = new CountryModel();
    selectedCarrierGateway: string;
    constructor(
        private _util: Util, private _menu: SidebarService, private _router: Router,
        private countryService: CountryService, public commonService: CommonService, 
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
    ngOnInit() {
        //debugger;
        // this.loadPermissionByModule(this.moduleTitle);
        this.GetRegions();
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
                this.countryService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID, this.selectedRegion).
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
                            var coldef = this.h_localize.find(element => element.field == "CountryName");
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
        this.CurrentCountryObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentCountryObj) {
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
                this.CurrentCountryObj = data;
                this.onEditCountry();

            }
        }
    }
    EditClicked(val) {
        this.loaderService.display(true);
        this.CurrentCountryObj = val;
        this.onEditCountry();
    }
    GetRegions() {
        this.countryService.getRegions().
            subscribe(
                region => {

                    this.RegionList = region;
                    //alert(JSON.stringify(this.RegionList));
                },
                Error => this.errorMessage = <any>Error
            );
    }
    onAddCountry() {
        this.ListView = false;
        this.InitCarrierGateway();
        //this.IsLoaded = true;
        this.CurrentCountryObj = new CountryModel();
        if (this.CurrentCountryObj.IsActive == undefined) {

            this.CurrentCountryObj.IsActive = true;
        }
        this.CurrentCountryObj.RegionID = this.selectedRegion;
    }

    onEditCountry() {
        //debugger;
        this.ListView = false;
        this.InitCarrierGateway();
        if (this.CurrentCountryObj.IsActive.toString() == 'Yes') {
            this.CurrentCountryObj.IsActive = true;
        }
        else {
            this.CurrentCountryObj.IsActive = false;
        }
        this.loaderService.display(false);
    }
    InitCarrierGateway() {
      this.countryService.getAllCarrierGateway(this.CurrentCountryObj.CountryID).subscribe(
        _AllCarrierGatewayCollection => {
          this.AllCarrierGateway = JSON.parse(
            JSON.stringify(_AllCarrierGatewayCollection)
          );
          this.AllCarrierGatewayCollection = _AllCarrierGatewayCollection.map(
            function(e) {
              return new TypeLookUp(e);
            }
          );
          this.selectedCarrierGateway = this.AllCarrierGateway[0].TypeCode;
          this.onSelectedCarrierGatewayChanged();
        },
        error => (this.errorMessage = <any>error)
      );
    }

    onSelectedCarrierGatewayChanged() {
      this.CarrierGatewayAttribute = this.AllCarrierGatewayCollection.filter(
        d => d.TypeCode === this.selectedCarrierGateway
      ).map(function(e) {
        e.Attributes = $.grep(e.Attributes, function(f, i) {
          if (f.AttributeValue && f.AttributeValue == "false") {
            f.AttributeValue = false;
          } else if (f.AttributeValue && f.AttributeValue == "true") {
            f.AttributeValue = true;
          } else if (f.TypeName == "Brands") {
            if (f.AttributeValue) {
              if (f.AttributeValue[0]) {
                if (!f.AttributeValue[0].PartnerID) {
                  f.AttributeValue = JSON.parse(f.AttributeValue);
                }
              }
            } else f.AttributeValue = [];
          }
          return f;
        });
        return e.Attributes;
      })[0];
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
            return;
        }

        this.CurrentCountryObj.UserID = this.UserID
        if (this.CurrentCountryObj.CountryID == undefined) {
            this.CurrentCountryObj.CountryID = 0;
        }
        this.CurrentCountryObj.Gateways =this.GetGateways();
        //  console.log(JSON.stringify(this.CurrentCountryObj));
        this.countryService.Save(this.CurrentCountryObj)
            .subscribe(returnvalue => {
                var result = returnvalue.data;
                this.loaderService.display(false);
                //debugger;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentCountryObj = new CountryModel();
                    this.Cancel();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentCountryObj = new CountryModel();
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
    GetGateways(){
      var Gateways: Array<any>=new Array<any>();
      for(var carrier in this.AllCarrierGatewayCollection)
      {
          for(var Property in  this.AllCarrierGatewayCollection[carrier].Attributes)
          {
            Gateways.push(this.AllCarrierGatewayCollection[carrier].Attributes[Property]);
          }
      }

      return Gateways;
    }

    onDeleteCountry() {
        return;
        // var me = this;
        // this._popup.Confirm('Delete', 'Do you realy want to remove this Record?', function () {

        //     me.countryService.remove(me.CurrentCountryObj.CountryID)
        //         .subscribe(
        //         Result => {
        //             var result = Result.data;
        //             if (result == "Deleted") {
        //                 //this._popup.Alert('Alert', 'Record Deleted Successfully');
        //                 me.gridOptions.api.setDatasource(me.dataSource);
        //                 me.Cancel();
        //                 return;
        //             }
        //         },
        //         error => this.errorMessage = <any>error);

        // });
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

    getRegion(value: number) {
        //debugger;
        this.selectedRegion = value;
        this.CurrentCountryObj.RegionID = this.selectedRegion;
        this.gridapi.setDatasource(this.dataSource);
    }
}
