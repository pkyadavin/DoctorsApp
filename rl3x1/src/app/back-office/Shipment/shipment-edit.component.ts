import { Component, ViewChild, Input, EventEmitter, ErrorHandler, Output, NgZone } from '@angular/core';
import { ShipmentService } from './Shipment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { ShipmentModel, TrackCarrier, ShipingService } from './Shipment.model'
import { BsModalComponent } from 'ng2-bs3-modal'
import { CommonService } from '../../shared/common.service'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SalesReturnOrder } from '../SalesReturnOrder/SalesReturnOrder.model';
import { SalesReturnOrderGrid } from '../SalesReturnOrder/SalesReturnOrder.component';
import { message } from '../../controls/pop';
import { ReturnQtyEditorComponent } from '../SalesReturnOrder/ReturnQtyEditor.component'
import { Util } from 'src/app/app.util';
declare var $: any;

@Component({
    selector: 'Shipment-Editor',
    providers: [ShipmentService],
    templateUrl: './shipment-edit.html',
    styles: ['>>> .modal-xl { width: 60%; }']
})
export class ShipmentOrderEditor {
    @ViewChild('rmaGridPopUp') modal: BsModalComponent;
    RMAGridPopup: boolean = false;
    setRMAGridType: string = "popup";
    @ViewChild('pop') _popup: message;
    @ViewChild('SroList') SroList: SalesReturnOrderGrid;
    moduleTitle: string;
    SalesReturnOrders: Observable<SalesReturnOrder[]>;
    SalesReturnOrderList: SalesReturnOrder[];
    @Input() selectedId: string;
    @Output() EditorVisibilityChange = new EventEmitter();
    @Input("sroReq") SROReq: string;
    @Input("PermDetails") Permissions: string[] = [];
    CurrentOrderDetail: ShipmentModel = new ShipmentModel();
    OrderEditor: any;
    IsLoaded: boolean = false;
    CarrierList: any = [];
    gridOptionsEditOrders: GridOptions;
    filterValue: string = null;
    dataSource: any;
    showDeleteButton: boolean = false;
    ShowTrackShipment: boolean = false;
    ShowShippingLevel: boolean = false;
    CurrentServiceCost: number = 0;

    columnDefs: any = [
        { "field": "SalesReturnRMANumber", "headerName": "RMA Number", "width": 200, "suppressFilter": "true", "SortOrder": 2 },
        { "field": "OrderDate", "headerName": "Order Date", "width": 200, "suppressFilter": "true", "SortOrder": 7 },
        { "field": "ItemNumber", "headerName": "Item #", "width": 200, "suppressFilter": "true", "SortOrder": 5 },
        { "field": "SerialNumber", "headerName": "Serial #", "width": 200, "suppressFilter": "true", "SortOrder": 4 },
        { "headerName": 'Quantity', "field": "Quantity", "width": 100, "suppressFilter": true, "cellRendererFramework": ReturnQtyEditorComponent, "cellEditorFramework": ReturnQtyEditorComponent, "SortOrder": 4 },
        { "field": "ReturnReason", "headerName": "Return Reason", "width": 200, "suppressFilter": "true", "SortOrder": 7 },
        //{ "field": "SONumber", "headerName": "Sales Order #", "width": 200, "suppressFilter": "true", "SortOrder": 3 },
        //{ "field": "BillNumber", "headerName": "BOL #", "width": 200, "suppressFilter": "true", "SortOrder": 3 }, 
        //{ "field": "StatusName", "headerName": "Status", "width": 200, "suppressFilter": "true", "SortOrder": 5 },
        //{ "field": "ItemQty", "headerName": "Item Qty", "width": 200, "suppressFilter": "true", "SortOrder": 6 },
        //{ "field": "PartnerName", "headerName": "Requester", "width": 200, "suppressFilter": "true", "SortOrder": 6 },       
        //{ "field": "StatusName", "headerName": "Status", "width": 200, "suppressFilter": "true", "SortOrder": 8 },
        //{ "field": "CreatedBy", "headerName": "Created By", "width": 200, "suppressFilter": "true", "SortOrder": 9 },
    ];
    //{ "field": "FromAddress", "headerName": "Origin Address", "width": 200, "suppressFilter": "true", "SortOrder": 16 }];
    partnerID: number;
    paramType: string;
    paramID: string;
    RMADetailID: string = null;
    AvailableData: any;
    selectedSalesReturnDetailID: number = 0;
    isOnEditMode: boolean = false;
    ShippingNumber: string = "";
    ReturnNumber: string = "";
    ReturnDate: string = "";
    ShipDate: string = "";
    DeliveryTo: string = "";
    DeliveryLocation: string = "";
    DeliveryDate: string = "";
    ReturnStatus: string = "";
    @ViewChild('TracingPopup') _tracingPopup: BsModalComponent;
    TrackCarrierDetails: TrackCarrier;
    SelectedOrderLineItems: any
    ShipToName: string;
    ShipingServices: Array<ShipingService>;

    constructor(private _util: Util, public myService: ShipmentService, public cService: CommonService, private _router: Router, 
        private route: ActivatedRoute, private formBuilder: FormBuilder, private _globalService: GlobalVariableService, private _ngZone: NgZone) {

        this.route.queryParams.subscribe(params => {
            this.paramType = params["Task"];
            this.paramID = params["ID"];
            if (this.paramType != undefined && this.paramType == "Ship") {
                this.RMADetailID = this.paramID;
            }
        });
        this.gridOptionsEditOrders = {
            rowData: this.SalesReturnOrderList,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };
    }


    ngOnInit(me: any = this) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.CurrentOrderDetail.RequesterID = partnerinfo.LogInUserPartnerID;
        this.CurrentOrderDetail.ReturnFacilityID = partnerinfo.ReturnFacilityID;
        this.CurrentOrderDetail.Requester = partnerinfo.LogInUserPartnerName;
        this.CurrentOrderDetail.FromAddress = partnerinfo.LogInUserPartnerAddress;
        this.CurrentOrderDetail.AddressTo = partnerinfo.ReturnFacilityAddress;
        this.ShipToName = partnerinfo.ReturnFacilityName;
        this.CurrentOrderDetail.FromAddressID = partnerinfo.AddressID;
        this.CurrentOrderDetail.ToAddressID = partnerinfo.AddressID;
        this.ShowShippingLevel = false;
        this.ShowTrackShipment = false;

        this.moduleTitle = this._globalService.getModuleTitle(this.route.snapshot.parent.url[0].path);
        this.IsLoaded = false;
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        // alert(JSON.stringify(partnerinfo));
        this.partnerID = partnerinfo.LogInUserPartnerID;
        //this.gridOptionsEditOrders = {
        //    rowData: this.SalesReturnOrderList,
        //    columnDefs: this.columnDefs,
        //    enableColResize: true,
        //    enableServerSideSorting: true,
        //    enableServerSideFilter: true,
        //    rowModelType: 'pagination',
        //    paginationPageSize: 20,
        //    paginationOverflowSize: 2,
        //    rowSelection: 'single',
        //    maxConcurrentDatasourceRequests: 2,
        //    paginationInitialRowCount: 1,
        //    maxPagesInCache: 2
        //};

        //alert(this.selectedId);
        //this.CurrentOrderDetail.ShippingNumber = "Auto";
        this.myService.load(partnerinfo.UserId, this.selectedId, this.partnerID).subscribe(result => {

            this.CarrierList = result[2];           
            if (this.selectedId == null || this.selectedId == '') {
                this.isOnEditMode = false;
                this.CurrentOrderDetail.CarrierID = 0;//this.CarrierList.length > 0 ? this.CarrierList[0].CarrierID : "0";
                this.CurrentOrderDetail.CarrierCode = "";//this.CarrierList.length > 0 ? this.CarrierList[0].Code : "";
                this.CurrentOrderDetail.ShipDate = this.GetCurrentDate();

                this.openGridPopup();
            }
            else {
                this.isOnEditMode = true;
                this.CurrentOrderDetail.ShipmentID = result[0][0].ShipmentID;
                this.CurrentOrderDetail.ShippingNumber = result[0][0].ShipmentNumber;
                this.CurrentOrderDetail.AWBNumber = result[0][0].AWBNumber;
                this.CurrentOrderDetail.ShipDate = result[0][0].ShipDate;
                this.CurrentOrderDetail.CarrierID = result[0][0].CarrierID;
                this.CurrentOrderDetail.CarrierEmailID = result[0][0].CarrierEmailID;
                this.CurrentOrderDetail.CarrierRemarks = result[0][0].CarrierRemarks;
                this.CurrentOrderDetail.Length = result[0][0].Length;
                this.CurrentOrderDetail.Width = result[0][0].Width;
                this.CurrentOrderDetail.Height = result[0][0].Height;
                this.CurrentOrderDetail.Weight = result[0][0].Weight;
                this.CurrentOrderDetail.CarrierName = result[0][0].CarrierName;
            }
            var localize = JSON.parse(result[1][0].ColumnDefinations);
            var localeditor = localize.map(function (e) {
                return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
            });
            this.OrderEditor = JSON.parse("{" + localeditor.join(',') + "}");
            this.IsLoaded = true;

        });


        me.myService.loadAllRMAOrdersInShippingNumber('aaa', 0, 1000000, null, null, this.filterValue, this.partnerID, this.selectedId, this.RMADetailID).
            subscribe(
            result => {
                me.SalesReturnOrderList = result.recordsets[0];
                var rowsThisPage = result.recordsets[0];
                //  me.columnDefs = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                // var isPermission = this.Permissions.indexOf("View") == -1 ? false : true;
                // this._globalService.setLinkCellRender(this.columnDefs, 'SalesReturnRMANumber', isPermission);
                //  this.columnDefs.find(element => element.field == "PONumber").cellRenderer = this.poCellRender;
                //setTimeout(function () {
                //console.log(JSON.stringify(me.columnDefs));
                //console.log(JSON.stringify(me.SalesReturnOrderList));
                //me.gridOptionsEditOrders = {
                //    rowData: me.SalesReturnOrderList,
                //    columnDefs: me.columnDefs,
                //    enableColResize: true,
                //    enableServerSideSorting: true,
                //    enableServerSideFilter: true,
                //    rowSelection: 'single',
                //    context: {
                //        componentParent: me
                //    }
                //};
                me.gridOptionsEditOrders.api.setRowData(me.SalesReturnOrderList);
                //}, 2000);
            });

    }

    GetCurrentDate() {
        var date = new Date();

        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();

        return (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + '-' + y;
    }

    ShippingLevels() {

        if (this.SelectedOrderLineItems.ShippingLabelURL) {
            var a = $("<a>")
                .attr("href", this.SelectedOrderLineItems.ShippingLabelURL)
                .attr("target", "_blank")
                .attr("download", "img.png")
                .appendTo("body");

            a[0].click();
            a.remove();
        }
        else {
            this._util.error("No shipping label available", "error");
        }
    }

    TrackShipment() {

        this.myService.TrackOrderShipping(this.SelectedOrderLineItems.SalesReturnOrderDetailID).
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
                        this.CallTrackAPi(this.SelectedOrderLineItems.SalesReturnOrderDetailID.toString(), result[0][0].carrier.toLowerCase(), result[0][0].Domain, result[0][0].ShippingNumber);
                    }
                    else {
                        this._util.error("No shipping records available", "error");
                    }
                }
                else {
                    this._util.error("No shipping records available", "error");
                }

            });
    }

    CallTrackAPi(SalesReturnOrderDetailID, Carrier, Domain, ShippingNumber) {
        this.myService.CarrierTrack(SalesReturnOrderDetailID, Carrier, Domain, ShippingNumber).subscribe(data => {

            if (data.Status == "Success" || data.Status.indexOf("success") > -1) {
                if (data.RLTrackActivities.length != 0) {
                    this.TrackCarrierDetails = data.RLTrackActivities;
                    this._tracingPopup.open();
                }
                else {
                    this._util.error("No shipping records available", "error");
                }
            }
            else {
                this._util.error(data.Status, "error");
            }
        }
            , error => {
                //Wheel.loadingwheel(false);
            });
    }

    CloseTrackingPopup() {
        this._tracingPopup.close();
    }

    onEditSelectionChanged() {

        this.SelectedOrderLineItems = this.gridOptionsEditOrders.api.getSelectedRows()[0];
        if (!this.SelectedOrderLineItems) {
            this.ShowShippingLevel = false;
            this.ShowTrackShipment = false;
        }
        else {
            if (this.SelectedOrderLineItems.ShippingNumber) {
                this.ShowTrackShipment = true;
            }
            else {
                this.ShowTrackShipment = false;
            }

            if (this.SelectedOrderLineItems.ShippingLabelURL) {
                this.ShowShippingLevel = true;
            }
            else {
                this.ShowShippingLevel = false;
            }
        }


        // this.isEditVisible = true;
        // if (this.selectTab == 'Open') {
        // this.CurrentSalesReturnOrder = this.gridOptionsEditOrders.api.getSelectedRows()[0];
        //} else if (this.selectTab == 'Closed') {
        //    this.CurrentSalesReturnOrder = this.gridOptionsClosedOrders.api.getSelectedRows()[0];
        //} else if (this.selectTab == 'Discrepant') {
        //    this.CurrentSalesReturnOrder = this.gridOptionsDiscrepantOrders.api.getSelectedRows()[0];
        //}
    }

    removeSelected() {
        var me = this;
        var index;

        $.each(me.SalesReturnOrderList, function (i, v) {
            if (me.selectedSalesReturnDetailID == v.SalesReturnOrderDetailID) {
                index = i;
            }
        });
        me.SalesReturnOrderList.splice(index, 1);

        if (me.gridOptionsEditOrders.api)
            me.gridOptionsEditOrders.api.setRowData(me.SalesReturnOrderList);

    }

    onRowClicked(e) {

        if (e.event.target !== undefined) {
            let data = e.data;

            // alert(data.ShippingNumber);
            if (data.ShipmentNumber == null || data.ShipmentNumber == "") {
                this.selectedSalesReturnDetailID = data.SalesReturnOrderDetailID;
                this.showDeleteButton = true;
            }
            else {
                this.selectedSalesReturnDetailID = 0;
                this.showDeleteButton = false;
            }
        }
    }

    onCancel() {
        this.EditorVisibilityChange.emit(false);
    }

    openGridPopup() {

        this.RMAGridPopup = true;
        if (this.SroList)
            this.SroList.ReLoadPopUp();
        this.modal.open();
    }

    rmaGridEvent(event) {
        var me = this;
        var msg: string = "";

        $.each(event, function (i, v) {
            var users = me.SalesReturnOrderList.filter(u => u.SalesReturnOrderDetailID == v.SalesReturnOrderDetailID);
            if (users.length > 0) {
                msg = msg + v.SalesReturnRMANumber + ", ";
            }
            else {
                me.modal.close();
                me.RMAGridPopup = false;

                me.SalesReturnOrderList.push(v);
            }
        });

        if (msg.length > 0) {
            me._popup.Alert('Alert', msg + " already exists.");
        }

        if (me.gridOptionsEditOrders.api)
            me.gridOptionsEditOrders.api.setRowData(me.SalesReturnOrderList);

        //var users = this.SalesReturnOrderList.filter(u => u.SalesReturnOrderDetailID == event.SalesReturnOrderDetailID);
        //if (users.length > 0) {            
        //    Toast.errorToast('Same record already exists.');
        //}
        //else {
        //    this.modal.close();
        //    this.RMAGridPopup = false;     

        //    this.SalesReturnOrderList.push(event);            
        //    this.gridOptionsEditOrders.api.setRowData(this.SalesReturnOrderList);            
        //}  
    }

    submitShipment() {
        var me = this;
        // if (typeof me.CurrentOrderDetail.ShipDate === 'undefined' || me.CurrentOrderDetail.ShipDate == '') {
        //     this._util.error("Shipping Date is required.", "error");
        //     return;
        // }
        // if (typeof me.CurrentOrderDetail.CarrierID === 'undefined' || me.CurrentOrderDetail.CarrierID == 0 || me.CurrentOrderDetail.CarrierID == undefined || me.CurrentOrderDetail.CarrierID == null) {
        //     this._util.error("Shipping Carrier is required.", "error");
        //     return;
        // }
        // if (me.SalesReturnOrderList.length == 0) {
        //     this._util.error("RMA Order is required.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID != 0 && (!me.CurrentOrderDetail.Length || !me.CurrentOrderDetail.Width || !me.CurrentOrderDetail.Height)) {
        //     this._util.error("Package dimentions are required.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID != 0 && (me.CurrentOrderDetail.Length < 0 || me.CurrentOrderDetail.Width < 0 || me.CurrentOrderDetail.Height < 0)) {
        //     this._util.error("Package dimentions should be greater than 0.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID != 0 && !me.CurrentOrderDetail.Weight) {
        //     this._util.error("Package weight required.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID != 0 && me.CurrentOrderDetail.Weight < 0) {
        //     this._util.error("Package weight should be greater than 0.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID == 0 && !me.CurrentOrderDetail.CarrierName) {
        //     this._util.error("Carrier name is required.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID == 0 && !me.CurrentOrderDetail.AWBNumber) {
        //     this._util.error("AWB Number is required.", "error");
        //     return;
        // }
        // if (me.CurrentOrderDetail.CarrierID != 0 && !me.CurrentOrderDetail.ServiceCode) {
        //     this._util.error("Service Method is required.", "error");
        //     return;
        // }

        var selectedRecords = "";
        $.each(this.SalesReturnOrderList, function (i, v) {
            if (v.ShippingNumber == null || v.ShippingNumber == "") {
                selectedRecords += v.SalesReturnOrderDetailID + ',';
            }
        });
        me.CurrentOrderDetail.Items = this.SalesReturnOrderList;
        me.CurrentOrderDetail.SelectedRecords = selectedRecords;
        //alert(selectedRecords);
        let srod = this.SalesReturnOrderList[0].SalesReturnOrderDetailID.toString();
        let Carriers = this.CarrierList.filter(f => f.CarrierID == this.CurrentOrderDetail.CarrierID);//[0].CarrierName.toLowerCase(); 
        if (Carriers.length > 0) {
            me.CurrentOrderDetail.CarrierName = Carriers[0].CarrierName.toLowerCase();
            me.myService.generateTrackingNumber(srod, me.getSubdomain(), me.CurrentOrderDetail).subscribe(returnvalue1 => {
                if (returnvalue1.Status == "Success") {
                    this._util.success('Order(s) successfully shipped.', "success");
                    me.EditorVisibilityChange.emit(true);
                }
                else {
                    this._util.error(returnvalue1.Status, "error");
                }
            },
                error => {
                    //this._popup.Alert('Error', error);
                    this._util.error(error, "error");
                });
        }
        else {
            me.myService.SaveShipment(this.CurrentOrderDetail).subscribe(returnvalue => {
                this._util.success('Order(s) successfully shipped.', 'success');
                me.EditorVisibilityChange.emit(true);
            },
                error => {
                    this._util.error(error, "error");
                });
        }
        //me.CurrentOrderDetail.SelectedRecords = selectedRecords;
        //me.myService.SaveShipment(this.CurrentOrderDetail).subscribe(returnvalue => {
        //    Toast.successToast('Order(s) successfully shipped.');
        //    //alert();
        //    me.EditorVisibilityChange.emit(true);            
        //},
        //    error => {
        //        Toast.errorToast(error);
        //    });

    }

    getSubdomain() {
        var fullUrl = window.location.host;
        var urlParts = fullUrl.split('.');
        var subdomain = urlParts[0];
        var domain = urlParts[1];
        if (subdomain.indexOf("localhost") != -1)
            return "colehaan";
        else
            return subdomain;
    }

    ValidateEmail(emailvalue) {
        var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!filter.test(emailvalue)) {
            return false;
        }
        else {
            return true;
        }
    }

    CarrierChanged() {
        let Carriers = this.CarrierList.filter(f => f.CarrierID == this.CurrentOrderDetail.CarrierID);
        this.CurrentOrderDetail.CarrierCode = Carriers.CarrierCode
    }

    GetServices() {
        let Carriers = this.CarrierList.filter(f => f.CarrierID == this.CurrentOrderDetail.CarrierID);
        if (this.CurrentOrderDetail.CarrierID
            && this.CurrentOrderDetail.Weight
            && this.CurrentOrderDetail.Height
            && this.CurrentOrderDetail.Width
            && this.CurrentOrderDetail.Length) {
            this.CurrentOrderDetail.CarrierName = Carriers[0].CarrierName.toLowerCase();
            this.myService.LoadAvilableServices(this.getSubdomain(), this.CurrentOrderDetail).subscribe(returnvalue => {
                if (Carriers[0].Code == "CG001")
                    this.ShipingServices = $.map(JSON.parse(returnvalue.Content).TimeInTransitResponse.TransitResponse.ServiceSummary,
                        function (n, i) { return new ShipingService(n) });
                else if (Carriers[0].Code == "CG002")
                    this.ShipingServices = returnvalue;
            },
            error => {
                this._util.error(error, "error");
            });
        }
    }

    ClearServices() {
        this.ShipingServices = null;
        this.CurrentOrderDetail.ServiceCode = undefined;        
        this.CurrentServiceCost = 0;
    }

    ShowFreight() {
        let Service: ShipingService = this.ShipingServices.filter(f => f.Code == this.CurrentOrderDetail.ServiceCode)[0];
        if (Service.Cost) {
            this.CurrentServiceCost = Service.Cost;
        }
        else {
            this.CurrentServiceCost = 0;
        }
    }

    GetFreight() {
        let Carriers = this.CarrierList.filter(f => f.CarrierID == this.CurrentOrderDetail.CarrierID);
        let Service: ShipingService = this.ShipingServices.filter(f => f.Code == this.CurrentOrderDetail.ServiceCode)[0];
        if (Service.Cost) {
            this.CurrentServiceCost = Service.Cost;
        }
        else {
            if (Carriers[0].Code == "CG001") {
                this.myService.LoadRate(this.getSubdomain(), this.CurrentOrderDetail).subscribe(returnvalue => {
                    var Charges = JSON.parse(returnvalue.Content).RateResponse.RatedShipment.TotalCharges;
                    this.CurrentServiceCost = Service.Cost = Charges.MonetaryValue;// + ' ' + Charges.CurrencyCode;            
                },
                    error => {
                        this._util.error(error, "error");
                    });
            }
        }
    }

    ItemQuantityChanged(item) {
        if (this.gridOptionsEditOrders.api)
            this.gridOptionsEditOrders.api.setRowData(this.SalesReturnOrderList);
        else
            this.gridOptionsEditOrders.rowData = this.SalesReturnOrderList;
    }
}

