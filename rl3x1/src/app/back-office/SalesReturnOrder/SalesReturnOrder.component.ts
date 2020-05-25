import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SalesReturnOrderService } from './SalesReturnOrder.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { SalesReturnOrder, TrackCarrier } from './SalesReturnOrder.model'
import { BsModalComponent } from 'ng2-bs3-modal'
import { CommonService } from '../../shared/common.service'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Util } from 'src/app/app.util';
import { SidebarService } from '../sidebar/sidebar.service';
declare var $: any;

@Component({
    selector: 'SalesReturnOrderGrid',
    providers: [SalesReturnOrderService],
    templateUrl: './SalesReturnOrder.html',
    //styles: ['>>> .modal-xxl { width: 1100px; }']
})
export class SalesReturnOrderGrid {    
    @Input() GridType: string = "";
    @Output() notifyRMAOrder: EventEmitter<any> = new EventEmitter<any>();
    itemSelectorModel: BsModalComponent;
    SalesReturnOrders: Observable<SalesReturnOrder[]>;
    SalesReturnOrderList: SalesReturnOrder[];
    @Input() ShippingRMAList: SalesReturnOrder[];
    gridOptionsOpenOrders: GridOptions;
    selectedId: number;
    gridOptionsClosedOrders: GridOptions;
    gridOptionsDiscrepantOrders: GridOptions;
    IsEditorVisible: boolean = false;
    ShowChart: boolean = true;
    filterValue: string
    dataSource: any;
    partnerID: number;
    sroReq: string;
    moduleTitle: string;
    errorMessage: string;
    isEditVisible: boolean;
    LocalAccess: any = [];
    IsGridLoaded: boolean;
    Tablist: any;
    selectTab: string;
    paramType: string;
    paramID: string;
    OrderStatus: string = 'Open';
    ShowShippingLevel: boolean = false;
    ShowTrackShipment: boolean = false;
    @ViewChild('TracingPopup') _tracingPopup: BsModalComponent;
    ShippingNumber: string = "";
    ReturnNumber: string = "";
    ReturnDate: string = "";
    ShipDate: string = "";
    DeliveryTo: string = "";
    DeliveryLocation: string = "";
    DeliveryDate: string = "";
    ReturnStatus: string = "";    
    TrackCarrierDetails: TrackCarrier;
    Scope: string = "";
    columnDefs = [
    ];
    isCameFromTaskQueue: boolean = false;

    CurrentSalesReturnOrder: SalesReturnOrder = new SalesReturnOrder();
    SelectedtReturnOrderID: number;

    constructor(private _util:Util, private _menu:SidebarService,
        private salesreturnorderservice: SalesReturnOrderService, private _router: Router, public commonService: CommonService, private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute) {
        this.activateRoute.queryParams.subscribe(params => {
            this.paramType = params["Type"];
            this.paramID = params["ID"];
            if (this.paramType != undefined) {
                this.isCameFromTaskQueue = true;
            }
        });
    }    

    loadPermissionByModule(userID, logInUserPartnerID, moduleTitle) {
        this.commonService.loadPermissionByModule(userID, logInUserPartnerID, moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                if (this.IsGridLoaded) {
                    if (this.gridOptionsOpenOrders.api)
                        this.gridOptionsOpenOrders.api.setDatasource(this.dataSource);
                }
            }
        )
    }

    ngOnInit() {
        this.activateRoute.params.subscribe(
            (param: any) => {
                if (param['Scope'])
                    this.Scope = param['Scope'];
                else
                    this.Scope = "Account";
            });
        
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
            
        this.filterValue = null;
        this.isEditVisible = false;
        this.ShowShippingLevel = false;
        this.ShowTrackShipment = false;

        this.Tablist = ['Open', 'Closed'];
        this.selectTab = 'Open';
        this.gridOptionsOpenOrders = {
            rowData: this.SalesReturnOrderList,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            //rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2,
            suppressRowClickSelection: false
        };
        this.gridOptionsClosedOrders = {
            rowData: this.SalesReturnOrderList,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };
        this.gridOptionsDiscrepantOrders = {
            rowData: this.SalesReturnOrderList,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };

        if (this.GridType == "popup") {
            this.gridOptionsOpenOrders.rowSelection = "multiple";
            this.gridOptionsOpenOrders.suppressRowClickSelection = true;
        }
        else {
            this.gridOptionsOpenOrders.rowSelection = "single";
            this.gridOptionsOpenOrders.suppressRowClickSelection = false;
        }

        this.LoadRMA();      

        var partnerinfo = this._globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.loadPermissionByModule(partnerinfo[0].UserId, partnerinfo[0].LogInUserPartnerID, this.moduleTitle);

        if (this.isCameFromTaskQueue) {
            this.OnEditSROrder(this.paramID);
            this.isCameFromTaskQueue = false;
        }
    }

    LoadRMA() {
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

                var RMAType = this.GridType;
                if (RMAType == "")
                    RMAType = "RMA"
                this.columnDefs = [];
                this.salesreturnorderservice.loadAll(this.selectTab, params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.partnerID, RMAType, this.Scope).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        this.columnDefs = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                        if (this.GridType == "popup") {                           
                            // $.each(this.ShippingRMAList, function (i, v) {
                            //     var ind = rowsThisPage.map(function (e) { return e.SalesReturnOrderDetailID; }).indexOf(v.SalesReturnOrderDetailID);
                            //     if (ind > -1) {
                            //         rowsThisPage.splice(ind, 1);
                            //     }
                            // });

                            this.columnDefs.unshift({
                                headerName: "Quantity",
                                width: 100,
                                field: "ItemQty"
                            });

                            this.columnDefs.unshift({
                                headerName: "Serial Number",
                                width: 150,
                                field: "SerialNumber"
                            });

                            this.columnDefs.unshift({
                                headerName: "Item#",
                                width: 150,
                                field: "ItemNumber"
                            });

                            var colHeader = this.columnDefs.find(element => element.headerName == "Select");
                            if (colHeader == undefined) {
                                this.columnDefs.unshift({
                                    headerName: "Select",
                                    width: 80,
                                    //headerCellRenderer: this.selectAllRenderer,
                                    checkboxSelection: true
                                });
                            }
                        }
                        else {
                            var isPermission = this.LocalAccess.indexOf("View Details") == -1 ? false : true;
                            this._globalService.setLinkCellRender(this.columnDefs, 'SalesReturnRMANumber', isPermission);
                            //this.columnDefs.find(element => element.field == "PONumber").cellRenderer = this.poCellRender;
                        }

                        this.IsGridLoaded = true;

                        if (this.selectTab == 'Open') {                            
                            this.gridOptionsOpenOrders.api.setColumnDefs(this.columnDefs);
                        } else if (this.selectTab == 'Closed') {                            
                            this.gridOptionsClosedOrders.api.setColumnDefs(this.columnDefs);
                        }
                        else if (this.selectTab == 'Discrepant') {
                            this.gridOptionsDiscrepantOrders.api.setColumnDefs(this.columnDefs);
                        }
                        var lastRow = rowsThisPage.length - this.ShippingRMAList.length;
                        params.successCallback(rowsThisPage, lastRow);

                        this.ShowShippingLevel = false;
                        this.ShowTrackShipment = false;
                    });
            }
        }
        this.gridOptionsOpenOrders.datasource = this.dataSource;
    }

    ReLoadPopUp() {
        this.selectTab = "Open";
        this.gridOptionsOpenOrders.api.setDatasource(this.dataSource);
    }

    AddSelected() {
        var data = this.gridOptionsOpenOrders.api.getSelectedRows();
        this.notifyRMAOrder.emit(data);
    }

    ExportToExcel() {
        let thefile = {};
        var reader = new FileReader();
        this.salesreturnorderservice.ExportToExcel(this.OrderStatus)
            .subscribe(data => window.open(window.URL.createObjectURL(data)),
            error => console.log("Error downloading the file."),
            () => console.log('Completed file download.'));
    }
    onSelectionChanged() {
        this.isEditVisible = true;
        this.ShowShippingLevel = true;
        this.ShowTrackShipment = true;

        if (this.selectTab == 'Open') {
            this.CurrentSalesReturnOrder = this.gridOptionsOpenOrders.api.getSelectedRows()[0];
        } else if (this.selectTab == 'Closed') {
            this.CurrentSalesReturnOrder = this.gridOptionsClosedOrders.api.getSelectedRows()[0];
        } else if (this.selectTab == 'Discrepant') {
            this.CurrentSalesReturnOrder = this.gridOptionsDiscrepantOrders.api.getSelectedRows()[0];
        }

        if (!this.CurrentSalesReturnOrder) {
            this.ShowShippingLevel = false;
            this.ShowTrackShipment = false;
        }
    }

    ShippingLevels() {
        //Wheel.loadingwheel(true);
        this.salesreturnorderservice.GetShippingLabel(this.CurrentSalesReturnOrder.SalesReturnOrderDetailID).
            subscribe(
            result => {
                //Wheel.loadingwheel(false);
                if (result[0].length != 0) {
                    if (result[0][0].ShippingLabelUrl && result[0][0].ShippingLabelUrl != "") {
                        //window.location.href = result[0][0].ShippingLabelUrl;
                        //window.open(result[0][0].ShippingLabelUrl, '_blank');

                        var a = $("<a>")
                            .attr("href", result[0][0].ShippingLabelUrl)
                            .attr("download", "img.png")
                            .appendTo("body");

                        a[0].click();

                        a.remove();
                    }
                    else {

                        this._util.error("Alert", "Shipping label is not available.", "error");                        
                    }                   
                }
                else {
                    this._util.error("Alert", "Shipping label is not available.", "error");
                }

            });
    }

    TrackShipment() {

        //Wheel.loadingwheel(true);
        this.salesreturnorderservice.TrackOrderShipping(this.CurrentSalesReturnOrder.SalesReturnOrderDetailID).
            subscribe(
            result => {

                if (result[0].length != 0) {
                    this.ShippingNumber = result[0][0].ShippingNumber;
                    this.ReturnNumber = result[0][0].SalesReturnRMANumber;
                    this.ReturnDate = result[0][0].CreatedDate;
                    this.ShipDate = result[0][0].ShipDate;
                    this.DeliveryTo = result[0][0].PartnerName;
                    this.DeliveryLocation = result[0][0].DilveryLocation;
                    this.ReturnStatus = result[0][0].StatusName;
                    
                    if (result[0][0].ShippingNumber) {
                        this.CallTrackAPi(this.CurrentSalesReturnOrder.SalesReturnOrderDetailID.toString(), result[0][0].carrier.toLowerCase(), result[0][0].Domain, result[0][0].ShippingNumber);
                    }
                    else {
                        this._util.error("Alert", "No shipping records are available.", "error");
                        //this._tracingPopup.open();
                        //Wheel.loadingwheel(false);                        
                    }                
                }
                else {
                    //Wheel.loadingwheel(false);
                    this._util.error("Alert", "No shipping records are available.", "error");
                }

            });
    }

    CallTrackAPi(SalesReturnOrderDetailID, Carrier, Domain, ShippingNumber) {
        this.salesreturnorderservice.CarrierTrack(SalesReturnOrderDetailID, Carrier, Domain, ShippingNumber).subscribe(data => {

            if (data.Status == "Success" || data.Status.indexOf("success") > -1) {
                if (data.RLTrackActivities.length != 0) {
                    //console.log(data.RLTrackActivities);
                    this.TrackCarrierDetails = data.RLTrackActivities;
                    this._tracingPopup.open();
                }
                else {
                    this._util.error("Alert", "No shipping records are available.", "error");
                }
            }
            else {
                this._util.error("Alert", data.Status);
            }
        }
        , error => {
            //Wheel.loadingwheel(false);
        });
    }

    CloseTrackingPopup() {
        $('#divTracingPopup').modal('hide');
    }

    OnEditSROrder(srOrderId) {
        if (srOrderId == 0)
            this.sroReq = 'Add';
        else
            this.sroReq = 'Edit';
       
        this.selectedId = srOrderId;        
        this.IsEditorVisible = true;
    }

    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }

        if (this.selectTab == 'Open') {
            this.gridOptionsOpenOrders.api.setQuickFilter(this.filterValue);
        } else if (this.selectTab == 'Closed') {
            this.gridOptionsClosedOrders.api.setQuickFilter(this.filterValue);
        } else if (this.selectTab == 'Discrepant') {
            this.gridOptionsDiscrepantOrders.api.setQuickFilter(this.filterValue);
        }
    }

    //SelectBillingCode() {
    //    this.itemSelectorModel.open();
    //}

    OnTabChanged($event) {
        //this.selectTab = $event;
        switch ($event) {
            case 'Closed': {
                if (this.selectTab != 'Closed') {
                    this.selectTab = $event;
                    this.gridOptionsClosedOrders.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsClosedOrders.api.setDatasource(this.dataSource);
                    this.OrderStatus = 'Closed';
                }
                break;
            }
            case 'Open': {
                if (this.selectTab != 'Open') {
                    this.selectTab = $event;
                    this.gridOptionsOpenOrders.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsOpenOrders.api.setDatasource(this.dataSource);
                    this.OrderStatus = 'Open';
                }
                break;
            }
            case 'Discrepant': {
                if (this.selectTab != 'Discrepant') {
                    this.selectTab = $event;
                    this.gridOptionsDiscrepantOrders.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsDiscrepantOrders.api.setDatasource(this.dataSource);
                    this.OrderStatus = 'Discrepant';
                }
                break;
            }
        }

        //this.LoadTabData($event);
    }
    ChangeEditorVisibility(data) {
        if (data) {
            //this.selectTab = "Open";
            this.OnTabChanged("Open")
            this.isEditVisible = false;
            this.ShowChart = false;
            setTimeout(() => {
                this.ShowChart = true;
            }, 1);
        }
        this.IsEditorVisible = false;
    }


    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {
                //this.OnEditSROrder(data.SalesReturnOrderDetailID);
                //11/30
                this.OnEditSROrder(data.SalesReturnOrderHeaderID);
            }
            else if (actionType == "SelectRMA") {

                //$.each(data, function (i, v) {
                //    v['ShippingNumber'] = "";
                //});
                //alert(JSON.stringify(data)); 
                              
                this.notifyRMAOrder.emit(data);
            }
        }
    }
}