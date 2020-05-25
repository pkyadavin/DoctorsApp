import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LocationService } from './Location.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service'
import { Property, TypedJson, Util } from '../../app.util';
import { Location, LocationStructure } from './Location.model';
import { message, modal } from '../../controls/pop';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
declare var $: any;
@Component({
    selector: 'Location',
    providers: [LocationService],
    templateUrl: './Location.html'
   
})

export class LocationGrid extends Property {
    IsGridLoaded: boolean = false;
    @Output() notifyLocation: EventEmitter<any> = new EventEmitter<any>();
    popuptype: string= 'popup';
    billingcodelist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
  //  billingCodes: BillingCodeModel[];
    IsLoaded: boolean;
    ListView: boolean = true;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isCancel$ = false;
    UserID: number;
    isSaveClick: any;
    this: number;
    PartnerLocationID: number;
    Currentlevelname: string;
    CurrentCode: string;
    LocationStructure: LocationStructure = new LocationStructure();

    columnDefs = [
        { headerName: 'Location Code', field: "BillingCodeLookupId", hide: true, width: 120 },
        { headerName: 'Location Name', field: "BillingCode", width: 200 },
        { headerName: 'Index Row', field: "BillingCodeName", width: 200 },
        { headerName: 'FrameID', field: "Description", width: 200 },
        { headerName: 'ColorCode', field: "Description", width: 200 }

    ];
    CurrentLocationObj: Location = new Location();
    constructor(private _menu: SidebarService, private _router:Router,private _util:Util,
        private locationService: LocationService, public commonService: CommonService, private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute, ) {
        super();
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;

    }
    @ViewChild('pop') _popup: message;
    @ViewChild('pop1') _popup1: modal;
    @ViewChild('modalFacility') _fac: modal;
    @ViewChild('RowNColumn') _RowNColumn: modal;
    @ViewChild('modelRename') _Rename: modal;
    ngOnInit() {
        this.loadPermissionByModule(this.moduleTitle);
        this.IsLoaded = false;
        this.filterText = null;
        this.billingcodelist = [];
        this.gridOptions = {
            rowData: this.billingcodelist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            pagination:true,
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
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
               // if (typeof (this.PartnerId) == 'undefined') {
               //     this.PartnerId = 0;
               // }
                this.locationService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
                        var isPermission = this.LocalAccess.indexOf("View") == -1 ? false : true;
                       //this.IsGridLoaded = true;
                        // this._globalService.setLinkCellRender(localize, 'LocationCode', isPermission);
                        // this._globalService.setLinkCellRender(localize, 'LocationName', isPermission);
                        
                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var localeditor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
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
                        this.isEditConfigSetup$ = false;
                    });
            }
        }

        this.gridOptions.datasource = this.dataSource;

        this.loading = false;
    }
    selectFacility() {
        this._fac.open();
    }
    PartnerEvent(e) {
        this.CurrentLocationObj.PartnerName = e.PartnerName;
        this.CurrentLocationObj.PartnerID = e.PartnerID;
        this._fac.close();
    }
    onSelectionChanged() {
        
        this.isEditConfigSetup$ = true;
        this.CurrentLocationObj = this.gridOptions.api.getSelectedRows()[0];

        if (!this.CurrentLocationObj) {
            this.isEditConfigSetup$ = false;
        }
     
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }
    onAdd() {

        this.ListView = false;
        this.IsLoaded = true;
        this.CurrentLocationObj = new Location();
        this.CurrentLocationObj.IsActive = true;
    }
  

    onEdit() {       
        if (String(this.CurrentLocationObj.IsActive) == 'Yes' || this.CurrentLocationObj.IsActive == true) {
            this.CurrentLocationObj.IsActive = true;
        }
        else {
            this.CurrentLocationObj.IsActive = false;
        }
        this.ListView = false;
        this.locationService.loadStructure(this.CurrentLocationObj.PartnerLocationID).subscribe(
            result => {
                this.LocationStructure = new LocationStructure(TypedJson.parse<LocationStructure>(result.recordsets));
            });
    }
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "select") {
                this.notifyLocation.emit(data);
            }
            else if (actionType == "edit") {
                this.onEdit();
            }
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
        if (this.CurrentLocationObj.RowIndex != null) {
            var x = parseInt(this.CurrentLocationObj.RowIndex);
           if (isNaN(x)) {
               this._util.warning( 'Row Index must be in numbers',"Alert");
               return false;
           }
       }

       this.CurrentLocationObj.UserID = this.UserID;
       //this.CurrentLocationObj.PartnerID = this.partnerID;
        if (this.CurrentLocationObj.PartnerLocationID == undefined) {
            this.CurrentLocationObj.PartnerLocationID = 0;
       }
      
        if (String(this.CurrentLocationObj.IsActive) == 'Yes' || this.CurrentLocationObj.IsActive) {
            this.CurrentLocationObj.IsActive = true;
        }
        else {
            this.CurrentLocationObj.IsActive =false;
        }

        this.locationService.Save(this.CurrentLocationObj)
            .subscribe(returnvalue => {
                var result = returnvalue.data;
                // alert(result);
                if (result == "Added") {
                    this._util.success('Saved successfully.',"Success","Success");
                    this.gridOptions.api.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentLocationObj = new Location();
                    this.Cancel();
               
                }
                else if (result == "Updated") {
                    this._util.success('Updated successfully.',"Success","success");
                    this.gridOptions.api.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    
                    this.CurrentLocationObj = new Location();
                    this.Cancel();
                    return;
                }
                else if (result == "Code Exists") {
                    this._util.error('Location Code already exists.',"Alert");
                    return;
                }
                else {
                    this._util.error('Something went wrong. Please Contact system administrator.',"Alert");
                    return;
                }
            },
            error => this.errorMessage = <any>error);
    }
    onDelete() {
        var me = this;
        this._popup.Confirm('Delete', 'Do you really want to remove this location?', function () {

            me.locationService.remove(me.CurrentLocationObj.PartnerLocationID)
                .subscribe(
                Result => {
                    var result = Result.data;
                    if (result == "Deleted") {
                        me.gridOptions.api.setDatasource(me.dataSource);
                        me.Cancel();
                        return;
                    }
                },
                error => this.errorMessage = <any>error);

        });
    }
    Cancel() {
        this.ListView = true;
        this.isAddConfigSetup$ = true;
        this.isCancel$ = false;

        var node = this.gridOptions.api.getSelectedNodes()[0];
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
            }
        )
    }

    AddRowNColumnEventCallback($event) {
        this.PartnerLocationID = $event.PartnerLocationID
        this._RowNColumn.open();
        $("#grid").gridCreator();
    }

    AddDynamicLocations = function () {
        var RNC = $("#spnRowNColumn").html();
        var RowNColumns = RNC.split('x');
        var Rows = RowNColumns[0];
        var Columns = RowNColumns[1];
        this._RowNColumn.close();
        this.locationService.AddLocations(this.PartnerLocationID, Rows, Columns, this.CurrentLocationObj.PartnerLocationID)
            .subscribe(
            _Order => {
                this.locationService.loadStructure(this.CurrentLocationObj.PartnerLocationID).subscribe(
                    result => {
                        this.LocationStructure = new LocationStructure(TypedJson.parse<LocationStructure>(result.recordsets));
                    });
                this._util.success( 'Locations have been added successfully.',"Alert");
            },
            error => this.errorMessage = <any>error);
    }
    EditRowNColumnEventCallback() { }
    RenameLocationCallback($event) {
        this.PartnerLocationID = $event.PartnerLocationID;
        this.Currentlevelname = $event.LocationName;
        this.CurrentCode = $event.TenantLocationCode;
        
        this._Rename.open();
    }
    DeleteLocationEventCallback($event) {
        var me: any = this;
        this._popup.Confirm('Delete', 'Are you sure you want to remove this location?', function () {                
            me.locationService.remove($event.PartnerLocationID)
                .subscribe(
                _Order => {
                    me.locationService.loadStructure(me.CurrentLocationObj.PartnerLocationID).subscribe(
                        result => {
                            me.LocationStructure = new LocationStructure(TypedJson.parse<LocationStructure>(result.recordsets));
                            console.log(me.LocationStructure);
                        });
                        this._util.success('Location has been deleted successfully.',"Alert");
                },
                error => me.errorMessage = <any>error);
        });
    }
    ShowPopUp(id) {
        $('#div' + id).css("display", "block");
    }
    HidePopUp(id) {
        $('.popover').css("display", "none");
        $('#div' + id).css("display", "none");
    }
    RenameLocation() {
        if (this.Currentlevelname && this.CurrentCode) {
            this.locationService.RenameLocation(this.PartnerLocationID, this.Currentlevelname,this.CurrentCode)
                .subscribe(
                _Order => {                    
                    this.locationService.loadStructure(this.CurrentLocationObj.PartnerLocationID).subscribe(
                        result => {
                            //console.log(result);
                            this.LocationStructure = new LocationStructure(TypedJson.parse<LocationStructure>(result.recordsets));                           
                            this.Currentlevelname = null;
                            this.CurrentCode = null;                            
                        });

                    if (_Order.data == "Success")
                    {
                        this._Rename.close();
                        this._util.success('Locations have been renamed successfully.','Alert');
                    }
                    else
                        this._util.error( _Order.data,"Alert");                        
                },
                error => this.errorMessage = <any>error);
        }
        else {
            this.Currentlevelname = null;
            this.CurrentCode = null;            
            this._util.warning('Please enter all required fields.',"Alert");
        }
    }
}