import { Component, ViewChild, Input, EventEmitter, ErrorHandler, Output, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { SalesReturnOrderService } from './SalesReturnOrder.service';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SalesReturnOrder, SalesReturnOrderDetail, SRODetailReasonValue, PendingArtifacts, Artifacts, ApprovalDetails, TaskQueueDetails, TrackCarrier } from './SalesReturnOrder.model';
import { MetadataService } from '../MetadataConfig/metadata-config.Service.js';
import { CommonService } from '../../shared/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal'
import { ItemMaster } from '../../controls/ItemSelector/ItemSelector.Model';
import { TypeLookUp } from '../Region/typelookup.model';
import { OrderTabSource } from '../../controls/OrderTabManager/OrderTabSource.Model'
import { Receive, LineItem } from '../../controls/OrderTabManager/OrderTabSource.Model'
import { AddressInput } from '../../shared/address.model';
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { EditArtifactComponent } from '../../controls/clickable/editartifact.component';
declare var $: any;
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs/Subscription';
import { ReturnQtyEditorComponent } from './ReturnQtyEditor.component'
import { EditComponent } from '../../shared/edit.component'
import { EditIamgeComponent } from '../../controls/clickable/imagelink.component'
import { returnreasoncontrols } from './multiple.controls';
import { SelectComponent } from '../Region/select.component'
// import { Util } from 'src/app/app.util';
import { AuthService } from 'src/app/authentication/auth.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { Property, Util } from '../../app.util';

@Component({
    selector: 'SROrder-Editor',
    providers: [MetadataService, SalesReturnOrderService],
    //styles: ['>>> .modal-xxl { width: 1100px; }', '>>> .modal-xl { width: 60%!important; }'],
    templateUrl: './salesreturnordereditor.html'
})
export class SROrderEditor implements ErrorHandler {
    showTopPanel: boolean = false;
    ApproveOrRejectTitle: string;
    placeHolderForSearch: string;
    @ViewChild('OtherInfoPopup') _OtherInfoPopup: modal;
    @ViewChild('modalPartner') _partner: modal;
    @ViewChild('modalReject') _reject: modal;
    @ViewChild('modalOrderLog') _modalOrderLog: modal;
    @ViewChild('modalDiscrepancy') _modalDiscrepancy: modal;
    @ViewChild('approvepopconfirm') approvepopconfirm: modal;
    popuptype = "popup";
    partnerType = "PTR001";
    wizard: any;
    CurrentSelectedItem: any = { DynamicControls: null };
    SelectedItemForAssignControls: any;
    CurrentSROrder: SalesReturnOrder = new SalesReturnOrder();
    CurrentSROrderDetail: SalesReturnOrderDetail = new SalesReturnOrderDetail();
    CurrentSROApprovalDetail: ApprovalDetails = new ApprovalDetails();
    orderTabSource: OrderTabSource = new OrderTabSource();
    formField: [{}];
    gridOptionsLineItems: GridOptions;
    gridOptionsOrderLog: GridOptions;
    gridOptionsDiscrepancy: GridOptions;
    moduleTitle: string;
    srOrderForm: FormControl;
    srOrderEditor: any;
    searchValue: string = '';
    searchLineItem: string;
    selectedRetReason: number;
    selectedFulfilmentType: number;
    selectedDamageType: number;
    @Input() selectedId: number;
    IsAccountLogin: boolean = false;
    IsControlsOnEditMode: boolean = false;
    IsDocsAvailable: boolean = false;
    @Input() IsCP: boolean = false;
    _subscription: Subscription;
    @Input() IsHome: boolean = false;
    @Output() CPEditorVisibilityChange = new EventEmitter();
    @Output() EditorVisibilityChange = new EventEmitter();
    @Input("sroReq") SROReq: string;
    @Input("PermDetails") Permissions: string[] = [];
    IsLoaded: boolean;
    PartnerReasonList: any;
    DamageTypeList: any;
    DeliveryTypes: any;
    ReturnReasonList: any;
    ReturnTypeList: any;
    ReturnReasonRulesList: any;
    FilteredReturnReason: any;
    SelectedRulesList: any;
    partnerList: any;
    OrderLineItemsList: any
    SelectedOrderLineItems: any
    isSaveClick: boolean = false;
    addressInput: AddressInput;
    addressGridPopup: boolean = false;
    SROWizard: boolean = false;
    SelectedGraphLocation: string = "";
    HideSearch: boolean = false;
    SelectedDamageGraphLocations: any;
    IsGridLoaded: boolean;
    IsEdit: boolean = false;
    dataSource: any;
    SODetailgridOptions: GridOptions;
    SOEditDetailgridOptions: GridOptions;
    AllTypeLookups: Array<TypeLookUp>;
    ArtifactType: TypeLookUp = null;
    Artifacts: any = [];
    CarrierList: any = [];
    ApproversList: any;
    SelectedLines: any;
    IsApproval: boolean = false;
    IsCameForShip: boolean = false;
    IsReject: boolean = false;
    FromQueue: boolean = false;
    TQDetails: TaskQueueDetails;
    AllApprovalTypes: Array<TypeLookUp>;
    AllArtifactTypes: Array<TypeLookUp>;
    RejectReasonsList: any;
    CurrentStatus: number;
    DynamicControls: any;
    DynamicControlsResultData: any;
    PendingArtifactsList: Array<PendingArtifacts> = new Array<PendingArtifacts>();
    NewArtifacts: PendingArtifacts = new PendingArtifacts();
    SelectedLinesList: Array<SalesReturnOrderDetail> = new Array<SalesReturnOrderDetail>();
    paramType: string;
    paramID: string;
    isCameFromTaskQueue: boolean = false;
    //selectedSODetailID: number = 0;
    SelectedItemInfoID: number = 0;
    ShowShippingLevel: boolean = false;
    ShowTrackShipment: boolean = false;
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
    RuleGroup: any;
    ReturnReasonType: string;
    IsDocumentEditMode: boolean = false;
    SelectedItemName: string = "";
    SelectedItemNumber: string = "";
    FileGroupList: any;
    OrderLogs = [];
    IsShowDeliveryType: boolean = true;
    partnerDetails: any;
    OrderRMANumber: string = "";
    TenantName: string = "";
    IsDiscrepancy: boolean = false;
    ItemsDiscrepancyList: any;
    RejectReasonRemark: string = "";
    RejectReasonID: number;

    ArtifactgridOptions: GridOptions;
    ArtifactcolumnDefs = [{
        headerName: 'Document', field: "FileName", width: 100,
    },
    { headerName: 'Doc Type', field: "DocType", width: 100 },
    { headerName: 'Url', field: "FileUrl", width: 600 },
    { headerName: 'System Name', field: "SystemGenName", width: 200 }];
    

    DiscrepancycolumnDefs = [        
        { headerName: '', field: "Resolve", width: 75, cellRendererFramework: SelectComponent },
        { headerName: 'AWB#', field: "AWBNumber", width: 150 },
        { headerName: 'Quantity', field: "ShipQuantity", width: 75 },
        { headerName: 'Discrepancy Quantity', field: "DiscrepancyQuantity", width: 125 },
        { headerName: 'Discrepancy', field: "Discrepancy", width: 140 },
        { headerName: 'Discrepancy Remark', field: "DiscrepancyRemark", width: 200 },
        { headerName: 'Created Date', field: "CreatedDate", width: 100 },
        { headerName: 'Created By', field: "CreatedBy", width: 175 },        
    ];

    SOcolumnDefs: any;
    //SOcolumnDefs = [
    //    { headerName: '', field: "Action", width: 50, headerCellRenderer: this.selectAllRenderer, checkboxSelection: true },        
    //    //{ headerName: 'Serial #', field: "SerialNumber", width: 150 },
    //    { headerName: 'Item Number', field: "ItemNumber", width: 150 },
    //    { headerName: 'Item Description', field: "ItemDescription", width: 200 },
    //    { headerName: 'Serial#/Quantity', field: "QuantitySerialNumber", width: 150 },
    //    //{ headerName: 'Reason', field: "ReturnReason", width: 200, cellRendererFramework: EditComponent },
    //    {
    //        headerName: "Return Reason", field: "ReturnReason", width: 300,
    //        cellRendererFramework: returnreasoncontrols, editable: false, suppressFilter: true
    //    },
    //    { headerName: 'Docs', field: "ItemDocs", width: 75, cellRendererFramework: EditIamgeComponent },
    //    //{
    //    //    headerName: 'Qty.', field: "Quantity", width: 100, suppressFilter: true, editable: true,
    //    //    cellRendererFramework: ReturnQtyEditorComponent, cellEditorFramework: ReturnQtyEditorComponent
    //    //},      
    //    { headerName: 'Item Price (' + this.partnerDetails[0].CurrencySymbol +')', field: "ItemPrice", width: 100 },
    //    { headerName: 'Return Amount', field: "ReturnPrice", width: 100 },        
    //    { headerName: 'SO #', field: "SONumber", width: 100 },
    //    { headerName: 'SOHeader', field: "SOHeaderID", width: 50, hide: true },
    //    { headerName: 'SODetail', field: "SODetailID", width: 50, hide: true },
    //    { headerName: 'ItemInfoID', field: "ItemInfoID", width: 50, hide: true },
    //    { headerName: 'WarrantyStatusID', field: "WarrantyStatusID", width: 50, hide: true }
    //];

    SOcolumnDefs1: any;
    //SOcolumnDefs1 = [
    //    { headerName: '#', field: "ItemSeq", suppressFilter:true, width: 50 },
    //    { headerName: 'Product Name', field: "ModelName", width: 200 },
    //    { headerName: 'Model #/ SKU', field: "SKUCode", width: 150 },
    //    { headerName: 'Serial #/ Quantity', field: "SerialNumberQuantity", width: 150 }, 
    //    { headerName: 'Sales Order #', field: "SONumber", width: 200 },
    //    //{ headerName: 'Return Reason', field: "ReturnReason", width: 200, cellRendererFramework: EditComponent },
    //    { headerName: 'Return Reason', field: "ReturnReason", width: 200 },
    //    { headerName: 'Docs', field: "ItemDocs", width: 200, cellRendererFramework: EditIamgeComponent },
    //    { headerName: 'Item Price', field: "ItemPrice", width: 200 },
    //    { headerName: 'Return Price', field: "ReturnPrice", width: 200 },
    //    { headerName: 'Status', field: "StatusName", width: 200 },
    //    { headerName: 'Status', field: "StatusName", width: 200 },
    //    { headerName: 'Sub-Inventory', field: "Node", width: 150 },
    //    { headerName: 'Grade', field: "Grade", width: 100 },
    //    { headerName: 'Container #', field: "Container", width: 150 },        
    //    { headerName: 'Carrier Ref. No', field: "ShippingNumber", width: 200 },
    //    { headerName: 'AWB Date', field: "ShipDate", width: 100 },
    //    { headerName: 'Carrier', field: "CarrierName", width: 100 },
    //    { headerName: 'Carrier Email ID', field: "CarrierEmailID", width: 150 },
    //    { headerName: 'Carrier Remarks', field: "CarrierRemarks", width: 200 }
    //    //{ headerName: 'WarrantyStatusID', field: "WarrantyStatusID", width: 50, hide: true }
    //];

    @ViewChild('addressPopUp') _address: BsModalComponent;
    @ViewChild('pop') _popup: message;
    constructor(private _util:Util, private _auth:AuthService, private _menu : SidebarService, 
        private srOrderService: SalesReturnOrderService, public cService: CommonService, private mservice: MetadataService, private _router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder, private _globalService: GlobalVariableService, private _ngZone: NgZone, private ref: ChangeDetectorRef, private elRef: ElementRef) {
            window['angularImageEditorRef'] = {
                zone: _ngZone,
                component: this
            };
        this.route.queryParams.subscribe(params => {
            this.paramType = params["Type"];
            this.paramID = params["ID"];
            if (this.paramType != undefined) {
                this.isCameFromTaskQueue = true;
            }
            //if (this.paramType == "Approve") {
            //    this.IsApproval = true;
            //}
            if (this.paramType == "Ship") {
                this.IsCameForShip = true;
            }
        });
        this._subscription = _globalService.requestReturnSOChange.subscribe((value) => {
            this.searchValue = value;
            this.onSearch();
        });
        this.placeHolderForSearch = "Enter/Scan Serial/Item Number";
        this.srOrderForm = new FormControl({
            UserName: ''

        });
        this.addressInput = {
            MaptableName: "PartnerAddressMap",
            MapTableColumn: "PartnerID",
            MapColumnValue: "0",
        }

        this.SelectedDamageGraphLocations = [];
        this.mservice.getTypeLookUpsByGroupName(['ReturnArtifact'])
            .subscribe(
            _TypeLookUps => {
                setTimeout(() => {
                    this.AllTypeLookups = _TypeLookUps;
                    debugger;
                    this.AllArtifactTypes = this.AllTypeLookups.filter(d => d.TypeGroup == "ReturnArtifact");
                });
            },
            error => this.handleError = <any>error);
    };
    ngOnDestroy() {
        window['angularImageEditorRef'] = null;
    }
    ngOnInit() {
        $("#ModelImageEditor").hide();
        $("#LodingDiv").hide();

        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;

        if (this.moduleTitle == "")
            this.moduleTitle = "Account RMA Orders";

        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        var customerinfo = this._globalService.getItem('customerinfo');

        this.CurrentSROrder.Requester = partnerinfo.LogInUserPartnerName;
        this.CurrentSROrder.ContactPerson = partnerinfo.ContactName;
        this.CurrentSROrder.ContactNumber = partnerinfo.ContactNumber;
        this.CurrentSROrder.ContactEmailID = partnerinfo.Email;
        this.CurrentSROrder.FromAddress = partnerinfo.LogInUserPartnerAddress;
        this.CurrentSROrder.FromAddressID = partnerinfo.AddressID;
        this.CurrentSROrder.ToPartnerID
        this.TenantName = partnerinfo.TenantName;
        this.CurrentSROrder.ReturnFacilityID = partnerinfo.ReturnFacilityID;

        this.SOcolumnDefs = [
            //{ headerName: '', field: "Action", width: 50, headerCellRenderer: this.selectAllRenderer, checkboxSelection: true }, 
            { headerName: 'Item Serial#', field: "SerialNumber", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 100, suppressFilter: true, cellRendererFramework: ReturnQtyEditorComponent, cellEditorFramework: ReturnQtyEditorComponent },
            { headerName: 'Item Number', field: "ItemNumber", width: 150 },
            { headerName: 'Item Description', field: "ItemDescription", width: 200 },
            {
                headerName: "Return Reason", field: "ReturnReason", width: 300,
                cellRendererFramework: returnreasoncontrols, editable: false, suppressFilter: true
            },
            { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
            //{
            //    headerName: 'Qty.', field: "Quantity", width: 100, suppressFilter: true, editable: true,
            //    cellRendererFramework: ReturnQtyEditorComponent, cellEditorFramework: ReturnQtyEditorComponent
            //},      
            { headerName: 'Item Price (' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 130 },
            { headerName: 'Refund Amount  (' + partnerinfo.CurrencySymbol + ')', field: "ReturnPrice", width: 140 },
            //{ headerName: 'SO #', field: "SONumber", width: 150 },
            { headerName: 'SOHeader', field: "SOHeaderID", width: 50, hide: true },
            { headerName: 'SODetail', field: "SODetailID", width: 50, hide: true },
            { headerName: 'ItemInfoID', field: "ItemInfoID", width: 50, hide: true },
            { headerName: 'WarrantyStatusID', field: "WarrantyStatusID", width: 50, hide: true }
        ];

        this.SOcolumnDefs1 = [
            { headerName: '', width: 25, checkboxSelection: this.isRowSelectable },
            { headerName: '#', field: "ItemSeq", suppressFilter: true, width: 50 },
            { headerName: 'Item Serial#', field: "SerialNumber", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 100 },
            { headerName: 'Item Number', field: "ItemNumber", width: 150 },
            { headerName: 'Item Description', field: "ItemDescription", width: 200 },
            { headerName: 'Return Reason', field: "ReturnReason", width: 300 },
            { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
            { headerName: 'Item Price (' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 130 },
            { headerName: 'Refund Amount  (' + partnerinfo.CurrencySymbol + ')', field: "ReturnPrice", width: 140 },
            //{ headerName: 'SO #', field: "SONumber", width: 150 },                      
            { headerName: 'Status', field: "StatusName", width: 200 },
            //{ headerName: 'Sub-Inventory', field: "Node", width: 150 },
            //{ headerName: 'Grade', field: "Grade", width: 100 },
            //{ headerName: 'Container #', field: "Container", width: 150 }, 
            //{ headerName: 'Discrepancy', field: "DiscrepancyID", width: 150 },            
        ];

        this.cService.getTypeLookUpByName("RuleGroup").subscribe(rulegroup => {
            this.RuleGroup = rulegroup;
        });

        this.FillFileGroup();
        this.ShowShippingLevel = false;
        this.ShowTrackShipment = false;

        this.ApproveOrRejectTitle = '';
        this.DynamicControls = [];
        this.DynamicControlsResultData = {};
        this.TQDetails = new TaskQueueDetails();
        if (this.SROReq === undefined) {
            var task = this._globalService.TaskQue;
            this.FromQueue = this.SROWizard = true;
        }
        else if (this.SROReq == 'Edit') {
            this.SROWizard = true;
        }

        if (task != null) {
            this.selectedId = this.TQDetails.RefId = task.RefID;
            this.TQDetails.RefNumber = task.RefNumber;
            this.TQDetails.RefType = task.RefType;
            this.TQDetails.Action = task.Task;
        }
        if (this.selectedId != 0) {
            $("#SROWizard").wizard();
            this.SOcolumnDefs = this.SOcolumnDefs1;
        }
        this.SODetailgridOptions = {
            rowData: this.OrderLineItemsList,
            columnDefs: this.SOcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,

            rowSelection: 'multiple',
            suppressRowClickSelection: true,
            context: {
                componentParent: this
            }
        };

        // var columnDefs1 = [
        //     {headerName: "Group", field: 'group', cellRenderer:'agGroupCellRenderer'},
        //     {headerName: "Athlete", field: "athlete"},
        //     {headerName: "Year", field: "year"},
        //     {headerName: "Country", field: "country"}
        // ];

        var OrderColumnDefs = [
            {headerName: "Item", field: 'group', width: 170, cellRenderer:'agGroupCellRenderer'},
            { headerName: 'Item #', field: "ItemNumber", width: 100 },
            { headerName: 'Serial Number/Quantity', field: "QuantitySerialNumber", width: 125 },
            //{ headerName: 'RMA Number', field: "RMANumber", width: 120 },
            { headerName: 'Receiving Number', field: "MRNNumber", width: 120 },
            { headerName: 'Start Date', field: "StartDate", width: 120 },
            { headerName: 'Status', field: "Task", width: 100 },
            { headerName: 'MRNHeaderID', field: "MRNHeaderID", width: 100, hide: true },
            //{ headerName: 'Item Name', field: "ItemName", width: 150 },        
            //{ headerName: 'Quantity', field: "Quantity", width: 80 },
            //{ headerName: 'Created By', field: "CreatedBy", width: 130 },
            { headerName: 'Aging Days', field: "AgingDays", width: 100 }
        ];

        this.gridOptionsOrderLog = {
            rowData: this.OrderLogs,
            columnDefs: OrderColumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single',
            getNodeChildDetails: this.getNodeChildDetails,
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },            
        }        

        this.gridOptionsDiscrepancy = {
            rowData: this.ItemsDiscrepancyList,
            columnDefs: this.DiscrepancycolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            //suppressRowClickSelection: true,
            context: {
                componentParent: this
            }
        };
        this.SOEditDetailgridOptions = {
            rowData: this.OrderLineItemsList,
            columnDefs: this.SOcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'multiple',
            context: {
                componentParent: this
            }
        };
        this.ArtifactgridOptions = {
            rowData: this.PendingArtifactsList,
            columnDefs: this.ArtifactcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            singleClickEdit: true,
            context: {
                componentParent: this
            }
        };
        this.IsLoaded = false;

        this.LoadRMA()

        this.cService.loadRoles()
            .subscribe(_roles => {
                this.ApproversList = _roles;
                //this.rolegridOptions.api.setRowData(this.AllRoleCollection);
            },
            error => this.handleError = <any>error);
        //this.GetDevicePhotos();
        this.IsLoaded = true;
    }

    isRowSelectable(rowNode) {

        //if (this.SelectedOrderLineItems.NeedApproval)
            //    this.IsApproval = true;
            //else
            //    this.IsApproval = false;

        var IsShow: boolean = false;
        IsShow = rowNode.data.NeedApproval ? true : false;

        return IsShow;
    }

    SelectItem(cell) {
        
        var items = { ID: cell.ID };  
        this.srOrderService.ResolveDescrapency(items).subscribe(returnvalue => {            
            if (returnvalue.result == "Success") {
                
                this._util.success("SRO Updated Successfully.","Success","Success");                
                this.IsDiscrepancy = false;

                this.srOrderService.GetDiscrepancyList(this.SelectedOrderLineItems.SalesReturnOrderDetailID).subscribe(result => {
                    if (result[0]) {
                        this.ItemsDiscrepancyList = result[0];
                        this.gridOptionsDiscrepancy.api.setRowData(this.ItemsDiscrepancyList);                        
                    }                    
                });
            }
            else {
                this._util.error(returnvalue.result, 'error');                
            }           
        });       
    }  
    
    ResolveDiscrepancy() {

        if (this.SelectedOrderLineItems.length > 1) {            
            this._util.error('Please select only one item to resolve discrepancy.', 'error');
            return;
        }

        if (this.SelectedOrderLineItems[0].SalesReturnOrderDetailID) {
            this.srOrderService.GetDiscrepancyList(this.SelectedOrderLineItems[0].SalesReturnOrderDetailID).subscribe(result => {
                if (result[0]) {
                    this.ItemsDiscrepancyList = result[0];
                    this.gridOptionsDiscrepancy.api.setRowData(this.ItemsDiscrepancyList);
                    this._modalDiscrepancy.open();
                }
                else {                   
                    this._util.error('No data found.', 'error');
                    return;
                }
            });
        }
        else {
            this._util.error('Please select a item.', 'error');            
        }        
    }

    FillFileGroup() {
        this.srOrderService.getTypeLookUpByName("CNT012").subscribe(filegroup => {
            this.FileGroupList = filegroup.recordsets[0];
        }); 
    }

    MakeVideoThumb(id, code) {        
        $("#" + code + id).width(200).height(175);
        //$("#" + id).get(0).play();
        $("#div" + code + id).show(); 
        $("#divRemove" + code + id).hide();     
    }
    MakeVideoSmall(id, code) {       
        $("#" + code + id).width(50).height(50);
        $("#" + code + id).get(0).pause(); 
        $("#div" + code + id).hide();
        $("#divRemove" + code + id).show();
    }

    LoadRMA() {

        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.srOrderService.load(partnerinfo.UserId, this.selectedId).subscribe(result => {

            if (this.selectedId == 0) {
                this.CurrentSROrder.SalesReturnOrderHeaderID = 0;
                this.CurrentSROrder.OrderDate = new Date().toISOString();                

                if (this.IsCP) {
                    this.moduleTitle = "Sales Return Order";
                    $("#header-info :input").attr("disabled", true);
                }
                //else {
                //    var partnerinfo = this._globalService.getItem('partnerinfo')[0];
                //    this.CurrentSROrder.ToPartnerID = partnerinfo.LogInUserPartnerID;
                //    this.CurrentSROrder.ToPartnerName = partnerinfo.LogInUserPartnerName;
                //}

                if (this.IsCP) {
                    this.LoadRejectReasonForConsumer();
                }
                else {
                    this.ReturnTypeList = result[5];
                }
                this.DeliveryTypes = result[7];
                if (this.DeliveryTypes.length == 1) {
                    this.IsShowDeliveryType = false;
                    this.CurrentSROrder.DeliveryTypeID = this.DeliveryTypes[0].TypeLookUpID;
                }
                else {
                    this.IsShowDeliveryType = true;
                }         
                this.CurrentSROrderDetail.SalesReturnOrderDetailID = 0;
                this.IsEdit = false;
            }
            else {                
                debugger;
                var partnerinfo = this._globalService.getItem('partnerinfo')[0];

                this.CurrentSROrder = result[0][0];
                this.OrderRMANumber = this.CurrentSROrder.SalesReturnRMANumber;
                this.FillOrderLog();

                this.CurrentSROrder.DeliveryTypeID = result[2][0].DeliveryTypeID;
                
                if (typeof this.CurrentSROrder.ShippingNumber !== 'undefined' && this.CurrentSROrder.ShippingNumber != null) {
                    this.IsCameForShip = true;
                }
                //if (typeof this.CurrentSROrder.ShipDate === 'undefined')
                //    this.CurrentSROrder.ShipDate = new Date().toISOString();
                
                this.CurrentSROrderDetail.SalesReturnOrderDetailID = this.CurrentSROrder.SalesReturnOrderDetailID;                  
                this.OrderLineItemsList = result[2];

                // alert(JSON.stringify(this.OrderLineItemsList[0]));
                if (typeof this.OrderLineItemsList !== 'undefined' && this.OrderLineItemsList.length > 0) {
                    this.CurrentSROrderDetail.ReturnTypeID = this.OrderLineItemsList[0].ParentActionCodeID;
                }

                this.SOEditDetailgridOptions.rowData = this.OrderLineItemsList;

                if (this.SODetailgridOptions.api)
                    this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
                else
                    this.SODetailgridOptions.rowData = this.OrderLineItemsList;                    

                //this.SODetailgridOptions.columnDefs["0"].checkboxSelection = !this.IsEdit;

                if (this.selectedId > 0) {
                    this.SODetailgridOptions.suppressRowClickSelection = false;
                    //this.SODetailgridOptions.columnDefs["0"].checkboxSelection = false;
                }
                else {
                    this.SODetailgridOptions.suppressRowClickSelection = true;
                }

                this.searchValue = this.CurrentSROrder.SONumber;
                this.ReturnReasonList = result[5];
                this.ReturnReasonRulesList = result[6];
                
                if (typeof this.ReturnReasonRulesList !== 'undefined' && this.ReturnReasonRulesList.length > 0) {
                    this.SelectedRulesList = this.ReturnReasonRulesList.filter(rl => rl.ReturnReasonID == this.CurrentSROrderDetail.ReturnReasonID);
                }

                this.PendingArtifactsList = result[7];
                for (let i of result[7]) {
                    this.NewArtifacts[i.DocType].push(i);
                }
                
                if (this.ArtifactgridOptions.api)
                    this.ArtifactgridOptions.api.setRowData(this.PendingArtifactsList);
                else
                    this.ArtifactgridOptions.rowData = this.PendingArtifactsList;

                this.RejectReasonsList = result[8];
                this.AllApprovalTypes = result[9];

                //if (result[9].length > 0) {
                //    this.CurrentSROrderDetail.ApproverTypeID = result[9][0].TypeLookUpID;
                //    this.CurrentSROrderDetail.ApprovalRoleID = result[9][0].ApprovalRoleID;

                //}
                if (result[10].length > 0)
                    this.CurrentStatus = result[10][0].StatusName;

                this.ReturnTypeList = result[11];

                this.CarrierList = result[12];
                this.DeliveryTypes = result[13];
                this.IsEdit = true;
            }
            var localize = JSON.parse(result[1][0].ColumnDefinations);
            // console.log(JSON.stringify(localize));
            //this.partnerList = result[2];
            //this.PartnerReasonList;
            this.DamageTypeList = result[3];
            this.wizard = result[4];

            var localeditor = localize.map(function (e) {
                return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
            });
            this.srOrderEditor = JSON.parse("{" + localeditor.join(',') + "}");

            if (typeof this.OrderLineItemsList !== 'undefined' && this.OrderLineItemsList.length > 0) {
                this.CurrentSROrderDetail.ReturnReasonID = this.OrderLineItemsList[0].PartnerReturnReasonMapID;
                this.onReasonChange(this.OrderLineItemsList[0].PartnerReturnReasonMapID);
            }

            this.IsGridLoaded = true;
        }
        );
    } 

    FillOrderLog() {
        this.srOrderService.GetRMALog(this.selectedId).subscribe(result => {
            
            this.OrderLogs = JSON.parse(result[0][0].recordset); 
            console.log(this.OrderLogs);
            
        });
    } 

    ShowOrderLog() {
        this._modalOrderLog.open();
        this.gridOptionsOrderLog.api.setRowData(this.OrderLogs);
    } 

    getNodeChildDetails(rowItem) {
        debugger;
        if (rowItem.group) {
            return {
                group: true,
                // open C be default
                expanded: rowItem.group === 'Group C',
                // provide ag-Grid with the children of this group
                children: rowItem.participants,
                // this is not used, however it is available to the cellRenderers,
                // if you provide a custom cellRenderer, you might use it. it's more
                // relavent if you are doing multi levels of groupings, not just one
                // as in this example.
                field: 'group',
                // the key is used by the default group cellRenderer
                key: rowItem.group,
            };
        } else {
            return null;
        }
    } 
     
    LoadRejectReasonForConsumer() {

        var partnerinfo = this._globalService.getItem('partnerinfo')[0];

        this.srOrderService.RejectReasonForConsumer(partnerinfo.UserId).subscribe(result => {
            this.ReturnTypeList = result[0];
        });
    }

    handleError(error) {
        console.log(error)
    }
    changePlaceHolderText(name) {
        this.placeHolderForSearch = name;
        this.searchValue = "";
        $("#searchText").focus();
    }
    selectAllRenderer(params) {
        var cb = document.createElement('input');
        cb.setAttribute('type', 'checkbox');
        cb.style.cssText = "opacity:1 !important;left:10px; top: -1px";

        var eHeader = document.createElement('label');
        var eTitle = document.createTextNode(params.colDef.headerName);
        eHeader.appendChild(cb);
        eHeader.appendChild(eTitle);

        cb.addEventListener('change', function (e) {
            if ($(this)[0].checked) {
                params.api.selectAll();
            } else {
                params.api.deselectAll();
            }
        });
        return eHeader;
    }
    onApprRej() {
        //Need to change this logic

        for (let r of this.AllApprovalTypes) {
            if ($.inArray(r.TypeName, this.Permissions) > -1) {
                this.CurrentSROApprovalDetail.ApproverTypeID = r.TypeLookUpID;
            }
        }
        //var first = this.AllApprovalTypes.find(x => x.TypeName == this.Permissions[4]);
        //var second = this.AllApprovalTypes.find(x => x.TypeName == this.Permissions[5]);
        //if (first === undefined)
        //    this.CurrentSROApprovalDetail.ApproverTypeID = second.TypeLookUpID;
        //else
        //    this.CurrentSROApprovalDetail.ApproverTypeID = first.TypeLookUpID;
        this.IsApproval = true;
    }
    onCancelApproval() {
        this.IsApproval = false;
        //this.CurrentSROApprovalDetail = new ApprovalDetails();
    }
    onReasonChange(selected, me: any = this) {

        me.ReturnReasonList = me.ReturnReasonList.filter(rl => rl.ParentActionCodeID == selected);

        me.DynamicControls = [];
        if (selected != 'undefined') {
            //if (!this.IsEdit)
            me.SelectedRulesList = me.ReturnReasonRulesList.filter(rl => rl.ReturnReasonID == selected);
            //this.GetDevicePhotos();

            //alert(this.CurrentSROrder.ToPartnerID);
            var customerinfo = this._globalService.getItem('customerinfo');
            var partnerinfo = this._globalService.getItem('partnerinfo')[0];

            var UserPartnerID = partnerinfo.LogInUserPartnerID;

            if (this.IsCP) {
                UserPartnerID = this.CurrentSROrder.ToPartnerID;
            }

            //me.srOrderService.loadDynamicControls(selected, (me.isCameFromTaskQueue ? me.CurrentSROrder.FromAccountID : UserPartnerID), me.CurrentSROrderDetail.SalesReturnOrderDetailID).subscribe(returnvalue => {
            //    //console.log(JSON.stringify(returnvalue));

            //    var viewableData = returnvalue[0];//.filter(rl => rl.UserInput == 1);
                                
            //    me.ReturnReasonList = returnvalue[1];
            //    if (returnvalue[1].length > 0) {
            //        if (me.ReturnReasonList.length == 1) {
            //            me.CurrentSROrderDetail.ReturnTypeID = returnvalue[1][0].RMAActionCodeID;
            //        }
            //    }
            //    else
            //        me.CurrentSROrderDetail.ReturnTypeID = undefined;

            //    //alert(JSON.stringify(this.ReturnReasonList));
            //    $.each(viewableData, function (i, v) {
            //        //if (v.ControlType == 'Select List') {
            //        if (v.DropDownValue != "") {
            //            v.DropDownValue = JSON.parse(v.DropDownValue);
            //        }
            //        //}
            //        if (v.ControlType == 'Position On Item') {
            //            me.SelectedGraphLocation = v.ControlValue;
            //        }
            //    });
            //    me.DynamicControls = viewableData;

            //}, error => {
            //    Wheel.loadingwheel(false);
            //});

        }
        else
            this.SelectedRulesList = null;
    }

    //onReturnTypeChange(selected) {
    //    this.FilteredReturnReason = this.ReturnReasonList.filter(rl => rl.ReturnTypeID == selected);
    //}

    searchItems(w) {
        //alert(w.TypeCode);
        if (w.TypeCode == "SROCMD001") {
            var filterValue = this.OrderLineItemsList.filter(f => f.ItemNumber.toLowerCase().indexOf(w.searchLineItem.toLowerCase()) != -1
                || f.ItemDescription.toLowerCase().indexOf(w.searchLineItem.toLowerCase()) != -1
                || f.ManufacturerName.toLowerCase().indexOf(w.searchLineItem.toLowerCase()) != -1
                || f.ModelName.toLowerCase().indexOf(w.searchLineItem.toLowerCase()) != -1);
            this.SODetailgridOptions.api.setRowData(w.SearchText === '' ? this.OrderLineItemsList : filterValue);
        }
        //else {
        //}        
    }
    onSearch() {
        debugger;
        if (this.searchValue.trim() == "") {            
            this._util.error('Please Enter ' + this.placeHolderForSearch, 'error');
            return;
        }
        else {
            $("#partWizard").wizard();
        }
        var place = this.placeHolderForSearch;
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        debugger;
        this.srOrderService.loadSODetails(this.searchValue, this.IsCP, 'Item', partnerinfo.LogInUserPartnerID).subscribe(
            result => { 
                debugger;               
                if (result[0].length > 0) {
                    if (this.OrderLineItemsList) {
                        for (let i of result[0]) {
                            var AllExists = $.grep(this.OrderLineItemsList, function (n, v) {
                                return (n.SerialNumber == i.SerialNumber && n.ItemNumber == i.ItemNumber);
                            });
                            if (AllExists.length == 0) {
                                this.OrderLineItemsList.push(i);
                            }
                        }
                        this.searchValue = "";
                    }
                    else {
                        this.OrderLineItemsList = result[0];
                        this.searchValue = "";
                    }
                    this.ReturnReasonType = result[0][0].RMAReturnType;
                    this.CPEditorVisibilityChange.emit({ show: true });

                    if (this.IsCP) {
                        this.CurrentSROrder.ToPartnerID = result[1][0].SOPartnerID;
                        this.CurrentSROrder.ToPartnerName = result[1][0].SOPartnerName;
                        this.CurrentSROrder.CustomerID = result[1][0].SOPartnerID; 
                    }
                    else {
                        this.CurrentSROrder.ToPartnerID = result[0][0].PartnerID;
                        this.CurrentSROrder.ToPartnerName = result[0][0].PartnerName;
                        this.CurrentSROrder.CustomerID = result[1][0].FromAccID;
                    }

                    this.CurrentSROrder.Requester = result[1][0].PartnerName;
                    this.CurrentSROrder.ContactPerson = result[1][0].ContactName;
                    this.CurrentSROrder.ContactNumber = result[1][0].ContactNumber;
                    this.CurrentSROrder.ContactEmailID = result[1][0].Email;
                    this.CurrentSROrder.FromAddress = result[1][0].FromAddress;
                    this.CurrentSROrder.FromAddressID = result[1][0].PartnerAddressMapID;

                    this.ReturnReasonList = result[2];
                    this.ReturnReasonRulesList = result[3];
                    this.IsGridLoaded = true;
                    this.SROWizard = true;
                    if (this.SODetailgridOptions.api)
                        this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
                    else
                        this.SODetailgridOptions.rowData = this.OrderLineItemsList;                    
                }
                else {
                    //this.CPEditorVisibilityChange.emit({ show: false, searchMsg: true });
                    //this.SROWizard = false;
                    if (!this.IsCP) {                        
                        this._util.error('No Matching Record Found.', 'error');
                    }
                }
            });
        this.cService.loadRoles()
            .subscribe(_roles => {
                this.ApproversList = _roles;
            },
            error => this.handleError = <any>error);
    }
    Approval(userChoice, flag, f, reject?: boolean, me: any = this) {
        if (userChoice != '') {
            this.IsReject = flag;
            var msg = 'Are you sure you want to ' + userChoice + ' the Return ?';
            this._popup.Confirm('Alert', msg,
                function () {
                    me.IsReject = flag;
                    me.UserSelection = userChoice;
                    if (userChoice == 'approve' || (userChoice == 'reject' && reject))
                        me.onSubmitApproval();
                    else if (userChoice == 'reject')
                        me._reject.open();
                });
        }
    }

    Approve(me: any = this) {

        me.IsReject = false;
        //me.ApproveOrRejectTitle = "Approve";
        //$('#ApproveOrReject').modal({
        //    backdrop: 'static',
        //    keyboard: false
        //});
        me.onSubmitApproval();        
    }

    Reject(me: any = this) {
        me.IsReject = true;
        me.ApproveOrRejectTitle = "Reject";
        $('#ApproveOrReject').modal({
            backdrop: 'static',
            keyboard: false
        });        
    }       
    
    ChangeReturnReason(item,x) {
        
        var me: any = this;
        me.IsDocumentEditMode = true;
        var PartnerID = item.FromAccountID;
        var ReturnReasonID = item.ReturnReasonID;
        var ItemModelID = item.ItemModelID;
        me.DynamicControls = [];
        me.PendingArtifactsList = [];        

        me.SelectedItemNumber = item.ItemNumber != "" ? item.ItemNumber : item.SerialNumber;
        me.SelectedItemName = item.ItemDescription;

        me.SelectedItemInfoID = item.ItemInfoID;

        if (this.ReturnReasonType == "Account") {
            debugger;
            me.srOrderService.loadDynamicControls(ReturnReasonID, PartnerID, 0, item.Quantity, item.ItemPrice).subscribe(returnvalue => {
                debugger;
                var viewableData = returnvalue[0];
                item.ReturnPrice = returnvalue[1][0].RefundAmount;
                var iteminList = me.OrderLineItemsList.filter(f => f.ItemNumber == item.ItemNumber)[0];
                iteminList.ReturnPrice = item.ReturnPrice;
                                
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (this.SODetailgridOptions.api)
                    this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
                else
                    this.SODetailgridOptions.rowData = this.OrderLineItemsList;

            }, error => {

            });
        }
        else {
            me.srOrderService.loadDynamicControlsModelWise(ReturnReasonID, ItemModelID, 0, item.Quantity, item.ItemPrice).subscribe(returnvalue => {
                var viewableData = returnvalue[0];
                item.ReturnPrice = returnvalue[1][0].RefundAmount;
                var iteminList = me.OrderLineItemsList.filter(f => f.ItemNumber == item.ItemNumber)[0];
                iteminList.ReturnPrice = item.ReturnPrice;                

                $.each(viewableData, function (i, v) {
                    v.PartnerReturnReasonRuleMapID = v.ItemModelReturnReasonRuleMapID;
                });

                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();    

                if (this.SODetailgridOptions.api)
                    this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
                else
                    this.SODetailgridOptions.rowData = this.OrderLineItemsList;            

            }, error => {

            });
        }       
    }

    ItemQuantityChanged(item) {
        if (item.ReturnReasonID > 0) {
            this.srOrderService.getRefundAmount(item.ReturnReasonID, item.FromAccountID, item.Quantity, item.ItemPrice, 0).subscribe(returnvalue => {
                debugger;
                var iteminList = this.OrderLineItemsList.filter(f => f.ItemNumber == item.ItemNumber)[0];
                iteminList.ReturnPrice = returnvalue[0].RefundAmount;
                if (this.SODetailgridOptions.api)
                    this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
                else
                    this.SODetailgridOptions.rowData = this.OrderLineItemsList;
            }, error => {

            });
        }
        else {
            if (this.SODetailgridOptions.api)
                this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
            else
                this.SODetailgridOptions.rowData = this.OrderLineItemsList;
        }
    }

    EditClicked(item) {  
        debugger;      
        var me: any = this;
        me.IsDocumentEditMode = true;
        var PartnerID = item.FromAccountID;
        var ReturnReasonID = item.ReturnReasonID;        
        var ItemModelID = item.ItemModelID;
        //me.SelectedItemNumber = item.ItemNumber;
        me.SelectedItemNumber = item.ItemNumber != "" ? item.ItemNumber : item.SerialNumber;
        me.SelectedItemName = item.ItemDescription;
        
        me.SelectedItemInfoID = item.ItemInfoID;

        $.each(me.OrderLineItemsList, function (i, v) {
            if (v.ItemInfoID == item.ItemInfoID) {                                

                if (v.isControlsAdded) {
                    me.DynamicControls =[];
                    me.PendingArtifactsList = [];
                    me.NewArtifacts = new PendingArtifacts();
                    me.DynamicControls = v.DynamicControls;
                    me.PendingArtifactsList = v.Artifacts;                    

                    if (me.DynamicControls.length > 0) {

                        var QuestionnaireRule = me.DynamicControls.filter(x => x.RuleGroupID == 1818);
                        if (QuestionnaireRule.length > 0)
                            me.IsShowQuestionnaireRule = true;
                        else
                            me.IsShowQuestionnaireRule = false;

                        var DefaultRule = me.DynamicControls.filter(x => x.RuleGroupID == 1817);
                        if (DefaultRule.length > 0)
                            me.IsShowDefaultQueston = true;
                        else
                            me.IsShowDefaultQueston = false;
                       

                        $.each(me.DynamicControls, function (i, v) {
                            if (v.ControlType == "File" && v.ControlValue != "") {

                                var ArtifactsDetails = v.ControlValue;
                                $.each(ArtifactsDetails, function (k, x) {

                                    var IsVideo: boolean = false;
                                    var IsDoc: boolean = false;
                                    var IsSheet: boolean = false;
                                    var IsPdf: boolean = false;
                                    var IsOther: boolean = false;
                                    var IsImage: boolean = false;

                                    if (x.FileType == "video") {
                                        IsVideo = true;
                                        IsDoc = false;
                                        IsSheet = false;
                                        IsPdf = false;
                                        IsOther = false;
                                        IsImage = false;
                                    }
                                    else if (x.FileType == "Image") {
                                        IsVideo = false;
                                        IsDoc = false;
                                        IsSheet = false;
                                        IsPdf = false;
                                        IsOther = false;
                                        IsImage = true;
                                    }
                                    else if (x.FileType == "pdf") {
                                        IsVideo = false;
                                        IsDoc = false;
                                        IsSheet = false;
                                        IsPdf = true;
                                        IsOther = false;
                                        IsImage = false;
                                    }
                                    else if (x.FileType == "sheet") {
                                        IsVideo = false;
                                        IsDoc = false;
                                        IsSheet = true;
                                        IsPdf = false;
                                        IsOther = false;
                                        IsImage = false;
                                    }
                                    else if (x.FileType == "document") {
                                        IsVideo = false;
                                        IsDoc = true;
                                        IsSheet = false;
                                        IsPdf = false;
                                        IsOther = false;
                                        IsImage = false;
                                    }
                                    else {
                                        IsVideo = false;
                                        IsDoc = false;
                                        IsSheet = false;
                                        IsPdf = false;
                                        IsOther = true;
                                        IsImage = false;
                                    }

                                    var Artifact = { DocType: x.DocType, DocTypeID: x.DocTypeID, FileName: x.FileName, FileType: x.FileType, FileUrl: x.FileUrl, ID: x.ID, IsDoc: IsDoc, IsImage: IsImage, IsOther: IsOther, IsPdf: IsPdf, IsSheet: IsSheet, IsVideo: IsVideo, SystemGenName: x.SystemGenName };
                                    me.NewArtifacts[v.RuleCode].push(Artifact);

                                });
                            }

                        });    

                        me.SetGraphLocation();

                        $('#divItemPopup').modal('show');
                    }
                    else {                        
                        me._util.error('There is no document attachment required for this return reason.', 'error');
                    }
                }
                else {
                    me.SetDocumentPopUp(ReturnReasonID, PartnerID, ItemModelID, item.Quantity, item.ItemPrice);
                    if (me.DynamicControls.length > 0) {
                        $('#divItemPopup').modal('show');
                    }
                    else {
                        me._util.error('There is no document attachment required for this return reason.', 'error');                       
                    }
                }
            }
        });        
    }

    SetDocumentPopUp(ReturnReasonID, PartnerID, ItemModelID, Quantity, ItemPrice) {
        var me: any = this;
debugger;
        if (this.ReturnReasonType == "Account") {
            me.srOrderService.loadDynamicControls(ReturnReasonID, PartnerID, 0, Quantity, ItemPrice).subscribe(returnvalue => {

                var viewableData = returnvalue[0];
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (me.DynamicControls.length > 0) {
                    $('#divItemPopup').modal('show');
                }
                else {                    
                    me._util.error('There is no document attachment required for this return reason.', 'error');
                }

            }, error => {

            });
        }
        else {
            me.srOrderService.loadDynamicControlsModelWise(ReturnReasonID, ItemModelID, 0, Quantity, ItemPrice).subscribe(returnvalue => {

                var viewableData = returnvalue[0];

                $.each(viewableData, function (i, v) {
                    v.PartnerReturnReasonRuleMapID = v.ItemModelReturnReasonRuleMapID;                    
                });

                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (me.DynamicControls.length > 0) {
                    $('#divItemPopup').modal('show');
                }
                else {                    
                    me._util.error('There is no document attachment required for this return reason.', 'error');
                }

            }, error => {

            });
        }
    }    

    AssignControldsDataToItem() {
        var me = this;
    
        if (me.ValidateDynamicControls()) {

            //if (this.SelectedItem.length > 0) {
            //    this.SelectedItem[0].IsDocAttached = true;
            //}
            //else {
            //    $.each(me.ItemsDetails, function (i, v) {
            //        if (v.ItemID == me.SelectedItemID) {
            //            v.DynamicControlsData = me.DynamicControls;
            //            v.Artifacts = me.PendingArtifactsList;
            //            v.IsDocAttached = true;
            //        }
            //    });
            //}
            me.PendingArtifactsList = [];
            $.each(me.NewArtifacts['RR00009'], function (i, v) {
                me.PendingArtifactsList.push(v);
            });
            $.each(me.NewArtifacts['RR00037'], function (i, v) {
                me.PendingArtifactsList.push(v);
            });
            $.each(me.NewArtifacts['RR00038'], function (i, v) {
                me.PendingArtifactsList.push(v);
            });
            $.each(me.OrderLineItemsList, function (i, v) {
                if (v.ItemInfoID == me.SelectedItemInfoID) {
                    
                    v.DynamicControls = me.DynamicControls;
                    v.Artifacts = me.PendingArtifactsList;
                    v.isControlsAdded = true;
                    v.IsDocAttached = true;
                    //console.log(v.DynamicControls);
                }
            });                       

            //me.OrderLineItemsList.filter(f => f.SODetailID == me.selectedSODetailID)[0].DynamicControls = me.SelectedItemForAssignControls;
            //me.OrderLineItemsList.filter(f => f.SODetailID == me.selectedSODetailID)[0].isControlsAdded = true;
            //console.log(JSON.stringify(me.OrderLineItemsList));
            me.PendingArtifactsList = [];
            me.SelectedItemForAssignControls = [];

            if (me.SODetailgridOptions.api)
                me.SODetailgridOptions.api.setRowData(me.OrderLineItemsList);
            else
                me.SODetailgridOptions.rowData = me.OrderLineItemsList;

            //me.SODetailgridOptions.api.refreshView();

            $('#divItemPopup').modal('hide');
        }
    }

    onSubmitApproval() {
        var me = this;
        //if (me.CurrentSROApprovalDetail.ApproverTypeID === undefined) {
        //    Toast.errotToast('Approver is required.');
        //    return;
        //}
        if (me.IsReject) {
            if (me.RejectReasonID === undefined) {
                this._util.error('Reject Reason is required.', 'error');
                return;
            }
        }

        var ApprovalArray = [];
        $.each(me.SelectedOrderLineItems, function (i, v) {
            me.CurrentSROApprovalDetail = new ApprovalDetails();
            me.CurrentSROApprovalDetail.SRODetailID = v.SalesReturnOrderDetailID;
            me.CurrentSROApprovalDetail.ApproverTypeID =v.TypeLookUpID;
            me.CurrentSROApprovalDetail.ApprovalRoleID = v.ApprovalRoleID;
            me.CurrentSROApprovalDetail.IsRejected = me.IsReject ? 1 : 0;
            me.CurrentSROApprovalDetail.Remarks = me.RejectReasonRemark;
            me.CurrentSROApprovalDetail.RejectReasonID = me.RejectReasonID;
            ApprovalArray.push(me.CurrentSROApprovalDetail);
        });        
       

        me.srOrderService.ApproveSRO(ApprovalArray).subscribe(returnvalue => {
            debugger;
            if (returnvalue.result.indexOf("Success") > -1) {
                var msg = returnvalue.result;
                msg = msg.split(';');

                if (me.SelectedOrderLineItems.RMASource == "Customer") {
                    if (me.DeliveryTypes.filter(f => f.TypeLookUpID == me.SelectedOrderLineItems.DeliveryTypeID)[0].TypeCode == "FFT00001" && msg[1] == "0") {
                        me.srOrderService.generateTrackingNumber(me.SelectedOrderLineItems.SalesReturnOrderDetailID.toString(), me._auth.getScope()).subscribe(returnvalue1 => {

                            $('#ApproveOrReject').modal('hide');
                            me._util.success("RMA Updated Successfully.","Success","Success");
                            me.IsApproval = false;
                            me.LoadRMA();
                        },
                            error => {                                
                                me._util.error(error, 'error');
                            });
                    }
                }
                else {
                    $('#ApproveOrReject').modal('hide');
                    me._util.success("RMA Updated Successfully.","Success","Success");
                    me.IsApproval = false;
                    //me.EditorVisibilityChange.emit(true);
                    me.LoadRMA();
                }

                //me.IsApproval = false;
                //me.EditorVisibilityChange.emit(true);
            }
        });
            //});
    }
    onSubmit(form) {  
        debugger;
        var IsValid: boolean = true;
        this.SODetailgridOptions.api.selectAll();
        this.SelectedLines = this.SODetailgridOptions.api.getSelectedRows();
        if (this.SelectedLines.length == 0) {
            IsValid = false;
            this._util.warning('Please select at least one item.', 'warning');
            return;
        }        

        for (let item of this.SelectedLines) {
            if (item.ReturnReasonID == null || item.ReturnReasonID == undefined || item.ReturnReasonID == "") {
                IsValid = false;
                this._util.warning('Please select a return reason for selected items.', 'warning');
                return;
            }            
        }

        var me = this;
        $.each(this.SelectedLines, function (i, v) {
            me.DynamicControls = v.DynamicControls;
            me.SetGraphLocation();
            if (v.Artifacts) {
                me.PendingArtifactsList = v.Artifacts;
            }
            else {
                me.PendingArtifactsList = [];
            }

            me.NewArtifacts = new PendingArtifacts();
            $.each(me.PendingArtifactsList, function (i, v) {
                if (v.DocType == "RR00009") {
                    me.NewArtifacts['RR00009'].push(v);
                }
                if (v.DocType == "RR00037") {
                    me.NewArtifacts['RR00037'].push(v);
                }
                if (v.DocType == "RR00038") {
                    me.NewArtifacts['RR00038'].push(v);
                }
            });
            
            if (!me.ValidateDynamicControls()) {
                IsValid = false;
                return;
            }
        });

        if (!form.valid) {
            IsValid = false;
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                me.isSaveClick = !form.valid;
            })
            me.isSaveClick = true;
            return;
        } 
        
        //$.each(this.SelectedLines, function (i, v) {            
        //    if (!v.isControlsAdded) {
        //        IsValid = false;                
        //        return false;
        //    }
        //});
        
        this.SelectedLinesList = [];
        if (this.CurrentSROrder.SalesReturnOrderHeaderID == 0 && (this.SelectedLines != undefined && this.SelectedLines.length != 0)) {
            for (let item of this.SelectedLines) {
                var dtl = new SalesReturnOrderDetail();
                dtl.SalesReturnOrderDetailID = 0;
                dtl.SalesReturnRMANumber = '';
                dtl.ItemInfoID = item.ItemInfoID;
                dtl.WarrantyStatusID = item.WarrantyStatusID;
                dtl.SOHeaderID = item.SOHeaderID;
                dtl.SODetailID = item.SODetailID;
                dtl.Quantity = item.Quantity;
                dtl.ReturnPrice = item.ReturnPrice; //item.ItemPrice;
                dtl.ReturnReasonID = item.ReturnReasonID;
                dtl.ReturnTypeID = item.ReturnTypeID;
                dtl.DynamicControls = item.DynamicControls;
                dtl.DeliveryTypeID = this.CurrentSROrder.DeliveryTypeID;
                this.SelectedLinesList.push(dtl);
            }
        }
        else {
            this.isSaveClick = true;

            if (this.SROWizard) {
                this._util.warning('Please Select a Line to process Return', 'warning');
            }
            else if (this.SelectedLines.filter(f => f.isControlsAdded == false).length > 0) {
                this._util.warning('Please Additional info to all selected items.', 'warning');
            }
            else {
                if (this.SelectedLines != undefined && this.SelectedLines.length == 0)
                this._util.warning('Please Search a Sales Order to process Return', 'warning');
            }
            return;
        }
                
        this.CurrentSROrder.OrderLines = this.SelectedLinesList;
        this.CurrentSROrder.IsCP = this.IsCP;
        this.CurrentSROrder.ReturnReasonType = this.ReturnReasonType;

       
        if (IsValid) {
            debugger;
            this.srOrderService.SaveSRO(me.CurrentSROrder).subscribe(returnvalue => {                              
                var RMANumber = "RMA Order " + returnvalue.recordsets[0][0].SalesReturnRMANumber + " Created Successfully.";
                this._util.success(RMANumber,"Success","Success");
                me.EditorVisibilityChange.emit(true);
                me.CPEditorVisibilityChange.emit({ show: false });
             
            },
                error => {
                    this._util.error(error,"Error");
                
                });
        }
        else {
            this._util.error('Please enter all required fields.',"Error");
        
        }
    }

    onSubmitAWB() {

        //if (this.orderTabSource.LineItems.LineItemList.length == 0) {
        //    this.isSaveClick = true;
        //    return;
        //}

        //Get all selected lines

        this.SelectedLines = this.SODetailgridOptions.api.getSelectedRows();
        //Check in case of "Add Sales Return"
        //if (this.CurrentSROrder.SalesReturnOrderHeaderID>0) {
        for (let item of this.OrderLineItemsList) {
            var dtl = new SalesReturnOrderDetail();
            dtl.SalesReturnOrderDetailID = item.SalesReturnOrderDetailID;
            dtl.SalesReturnRMANumber = '';
            dtl.ItemInfoID = item.ItemInfoID;
            dtl.WarrantyStatusID = item.WarrantyStatusID;
            dtl.SOHeaderID = item.SOHeaderID;
            dtl.SODetailID = item.SODetailID;
            dtl.Quantity = item.Quantity;
            dtl.ReturnPrice = item.ItemPrice;
            dtl.ReturnReasonID = this.CurrentSROrderDetail.ReturnReasonID;
            //dtl.DamageLocation = this.SelectedGraphLocation;
            //dtl.DamageTypeID = this.CurrentSROrderDetail.DamageTypeID;

            this.SelectedLinesList.push(dtl);
        }
        //}

        var me = this;

        if (me.IsCameForShip) {
            if (typeof me.CurrentSROrder.ShippingNumber === 'undefined' || me.CurrentSROrder.ShippingNumber == '') {
                this._util.warning("Shipping Number is required.", "warning");
                return;
            }
            if (typeof me.CurrentSROrder.ShipDate === 'undefined' || me.CurrentSROrder.ShipDate == '') {
                this._util.warning("Shipping Date is required.", "warning");
                return;
            }
            if (typeof me.CurrentSROrder.CarrierID === 'undefined' || me.CurrentSROrder.CarrierID == '') {
                this._util.warning("Shipping Carrier is required.", "warning");
                return;
            }
            if (me.srOrderEditor.CarrierEmailID.isRequired) {
                if (me.CurrentSROrder.CarrierEmailID === 'undefined' || me.CurrentSROrder.CarrierEmailID == '') {
                    this._util.warning("Carrier Email Id is required.", "warning");
                    return;
                }
            }
            if (me.CurrentSROrder.CarrierEmailID != "") {
                if (!me.ValidateEmail(me.CurrentSROrder.CarrierEmailID)) {
                    me._util.warning("Carrier Email Id is invalid.", "warning");
                    return;
                }
            }
        }
        //if (me.ValidateDynamicControls()) {

        // alert(JSON.stringify(this.SelectedLinesList));
        this.CurrentSROrder.DynamicControlsData = this.DynamicControlsResultData;
        this.CurrentSROrder.OrderLines = this.SelectedLinesList;//Added selected lines
        if (this.PendingArtifactsList.length > 0)
            this.CurrentSROrder.Artifacts = this.PendingArtifactsList;//Added artifacts list
        if (this.SelectedRulesList.length > 0)
            this.CurrentSROrder.RulesList = this.SelectedRulesList; //Added rules with values

        // alert(JSON.stringify(this.CurrentSROrder.ArtifactsList));

        this.CurrentSROrder.IsCP = this.IsCP;
        this.srOrderService.SaveSRO(this.CurrentSROrder).subscribe(returnvalue => {
            this._util.success("RMA Order successfully shipped.","Success","Success");
            me.EditorVisibilityChange.emit(true);
            me.CPEditorVisibilityChange.emit({ show: false });
        },
            error => {                
                this._util.error(error, 'error');
            });

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
    onCancel() {
        this.EditorVisibilityChange.emit(false);
    }

    close() {
        this._address.close();
        this.addressGridPopup = false;
    }
    selectPartner() {
        this._partner.open();
    }
    Prev() {
        this.HideSearch = false;
    }

    Next() {
        this.SelectedLines = this.SODetailgridOptions.api.getSelectedRows();
        if (this.selectedId == 0) {
            this.HideSearch = true;
            $("#partWizard").wizard("selectedItem").step - 1;
        }
        else {
            $("#SROWizard").wizard("selectedItem").step - 1;
        }
        //if (this.selectedId == 0) {
        //    var selectedLines = this.SODetailgridOptions.api.getSelectedRows();
        //    if (selectedLines.length == 0)
        //        return false;
        //    else
        //        this.HideSearch = true;
        //}
        //else

    }

    //onEditClick() {
    //    if (this.selectedId != 0) {
    //        //var stepCnt = $("#SROWizard").wizard("selectedItem").step - 1;
    //        //if (stepCnt == 0)
    //            $("#SROWizard").wizard();
    //    }
    //}

    AddReturnDocs() {
        var thisElement = <HTMLInputElement>document.getElementById("returnArtifact");
        thisElement.click();
    }

    GetDevicePhotos() {
        this.ArtifactType = null;
        this.srOrderService.getArtifactDetails(this.CurrentSROrderDetail.SalesReturnOrderDetailID)
            .subscribe(
            _Order => {
                this.Artifacts = _Order;
                this.ArtifactgridOptions.api.setRowData(this.Artifacts);
            },
            error => this.handleError = <any>error);
    }

    ShowDamageLocationPopUp(me: any = this) {
        //if (me.selectedId == 0) {
        $('#myModalForDamageLocation').modal({
            backdrop: 'static',
            keyboard: false
        });
        //}
    }

    ClearAllSelectedDamageLocations() {
        $(".front").css("display", "block");
        $(".right").css("display", "none");
        $(".left").css("display", "none");
        $(".top").css("display", "none");
        $(".bottom").css("display", "none");
        $(".back").css("display", "none");

        $(".damagelocations").each(function (index) {
            if ($(this).attr("class").indexOf("insetShadow") >= 0) {
                $(this).removeClass("insetShadow");
            }
        });
        this.SelectedGraphLocation = "";
        this.SelectedDamageGraphLocations = [];
    }    

    AddSelectedGraphLocation() {
        var damagelocations = "";
        if (this.SelectedDamageGraphLocations.length > 0) {
            for (let c of this.SelectedDamageGraphLocations) {
                damagelocations += c.name + ", ";
            }
            damagelocations = damagelocations.substr(0, damagelocations.length - 2);
        }

        this.SelectedGraphLocation = damagelocations;// $scope.SelectedDamageGraphLocations[0].name;
        $('#myModalForDamageLocation').modal('hide');
    }

    SelectUnSelectLocation(id) {

        if ($("#" + id).attr("class").indexOf("insetShadow") >= 0) {

            $("#" + id).removeClass("insetShadow");

            for (let c of this.SelectedDamageGraphLocations) {
                if (c.name == id) {
                    var indx = this.SelectedDamageGraphLocations.map(function (e) { return e; }).indexOf(c);
                    this.SelectedDamageGraphLocations.splice(indx, 1);
                }
            }
            //angular.forEach($scope.SelectedDamageGraphLocations, function (val, indx) {
            //    if (val.name == id) {
            //        $scope.SelectedDamageGraphLocations.splice(indx, 1);
            //    }
            //})
        }
        else {
            var graphData = { name: id };
            this.SelectedDamageGraphLocations.push(graphData);
            $("#" + id).addClass("insetShadow");
        }
    }

    ChangeView(frm, to, direction) {

        if (direction == 'right') {
            //$("." + to).show("slide", { direction: "right" }, 200);
            $("." + to).show();
            $("." + frm).hide();
            //$("."+frm).setAttribute("
        }
        if (direction == 'left') {
            $("." + to).show();
            $("." + frm).hide();
        }
        if (direction == 'up') {
            $("." + to).show();
            $("." + frm).hide();
        }
        if (direction == 'down') {
            $("." + to).show();
            $("." + frm).hide();
        }
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
    openImageEditor() {
        debugger;
        $("#imageeditorframe").attr("src", "../../../lib/editonimage/index.html");
        $('#customImageEditor').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    justCloseImageEditorPop() {
        $('#customImageEditor').modal('hide');
    }    
    showImagePreview(url) {
        //alert(url);
        $("#previewImage").css("display", "block");
        $("#previewImage").attr("src", url);
    }
    hideImagePreview() {
        // alert();
        $("#previewImage").css("display", "none");
        $("#previewImage").attr("src", "");
    }
    removeUploadedFiles(i, RuleCode) {
        var me: any = this;
        me.NewArtifacts[RuleCode].splice(i, 1);
        if (me.NewArtifacts[RuleCode].length == 0) {
            $.each(me.DynamicControls, function (Jindex, Jvalue) {
                if (Jvalue.UserInput == 1) {
                    if (Jvalue.ControlType == 'File' && Jvalue.RuleCode == RuleCode) {
                        Jvalue.ControlValue = "";
                    }
                }
            });
        }
    }

    ValidateDynamicControls() {

        var IsFormValid = true;
        var LabelName = "";
        var me: any = this;
        me.DynamicControlsResultData = {
            Result: []
        };
        if (typeof me.DynamicControls !== 'undefined') {
            $.each(me.DynamicControls, function (Jindex, Jvalue) {
                if (Jvalue.UserInput == 1) {
                    if (Jvalue.ControlType == 'Position On Item') {
                        Jvalue.ControlValue = me.SelectedGraphLocation;
                        if (Jvalue.ControlValue == null || Jvalue.ControlValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {

                            var data11 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: Jvalue.ControlValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data11);
                        }
                    }
                    if (Jvalue.ControlType == 'File') {

                        if (me.NewArtifacts[Jvalue.RuleCode] != undefined && me.NewArtifacts[Jvalue.RuleCode] != null) {
                            if (me.NewArtifacts[Jvalue.RuleCode].length == 0 && Jvalue.IsRequired) {
                                LabelName = Jvalue.ControlLabel;
                                IsFormValid = false;
                            }
                            else {
                                Jvalue.ControlValue = me.NewArtifacts[Jvalue.RuleCode];
                            }
                        }
                        else {
                            LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                    }

                    if (Jvalue.ControlType == 'radio') {
                        var checkedValue = "";
                        $.each(Jvalue.ControlOptions, function (optkey, optval) {
                            if (optval.isselected) {
                                checkedValue = optval.optionid;
                            }
                        });
                        if (checkedValue == null || checkedValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: checkedValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data);
                        }
                    }
                    if (Jvalue.ControlType == 'Yes/No') {
                        var checkedValue = "";
                        checkedValue = Jvalue.ControlValue;
                        if ((checkedValue == null || checkedValue == "") && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: checkedValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data);
                        }
                    }
                    if (Jvalue.ControlType == 'checkbox') {
                        var checkedValue = "";
                        $.each(Jvalue.ControlOptions, function (optkey, optval) {
                            if (optval.isselected) {
                                checkedValue += optval.optionid + ",";
                            }
                        });
                        if (checkedValue.length > 0)
                            checkedValue = checkedValue.substr(0, checkedValue.length - 1);

                        if (checkedValue == null || checkedValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data111 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: checkedValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data111);
                        }
                    }
                    if (Jvalue.ControlType == 'Select List') {
                        if (Jvalue.ControlValue == null || Jvalue.ControlValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data1 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: Jvalue.ControlValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data1);
                        }
                    }
                    if (Jvalue.ControlType == 'Number') {
                        if (Jvalue.ControlValue == null || Jvalue.ControlValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data2 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: Jvalue.ControlValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data2);
                        }
                    }
                    if (Jvalue.ControlType == 'Text') {
                        if (Jvalue.ControlValue == null || Jvalue.ControlValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data3 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: Jvalue.ControlValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data3);
                        }
                    }
                    if (Jvalue.ControlType == 'textarea') {
                        if (Jvalue.ControlValue == null || Jvalue.ControlValue == "" && Jvalue.IsRequired) {
                            if (LabelName == "")
                                LabelName = Jvalue.ControlLabel;
                            IsFormValid = false;
                        }
                        else {
                            var data4 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: Jvalue.ControlValue, UserInput: Jvalue.UserInput };
                            me.DynamicControlsResultData.Result.push(data4);
                        }
                    }
                }
                else {
                    var data14 = { ID: Jvalue.PartnerReturnReasonRuleMapID, Value: Jvalue.ControlValue, UserInput: Jvalue.UserInput };
                    me.DynamicControlsResultData.Result.push(data14);
                }

            });

            if (IsFormValid) {
                //$.each(me.SelectedItem, function (i, v) {
                //    if (v.ItemID == me.SelectedItemID) {
                //        v.DynamicControlsData = me.DynamicControls;
                //        v.Artifacts = me.PendingArtifactsList;
                //    }
                //});           

                return true;
            }
            else {
                this._util.warning(LabelName + " is required.", "warning");
                return false;
            }
        }
        else {
            this._util.warning("Return reason is required.", "warning");
            return false;
        }
    }

    radSetSelectedValue(cvalue, optionid, PartnerReturnReasonRuleMapID) {
        var me: any = this;

        $.each(me.DynamicControls, function (Jindex, Jvalue) {
            if (Jvalue.UserInput == 1) {
                if (Jvalue.PartnerReturnReasonRuleMapID == PartnerReturnReasonRuleMapID) {
                    $.each(Jvalue.DropDownValue, function (i, v) {
                        v.isselected = "0";
                    });

                    $.each(Jvalue.DropDownValue, function (i, v) {
                        if (optionid == v.optionid) {
                            v.isselected = "1";
                        }
                    });
                }
            }
        });
    }

    //radSetSelectedValue(cvalue, optionid, PartnerReturnReasonRuleMapID) {
    //    var me: any = this;
    //    $.each(me.SelectedItemForAssignControls, function (Jindex, Jvalue) {
    //        if (Jvalue.UserInput == 1) {
    //            if (Jvalue.PartnerReturnReasonRuleMapID == PartnerReturnReasonRuleMapID) {
    //                $.each(Jvalue.DropDownValue, function (i, v) {
    //                        v.isselected = "0";
    //                });
    //                $.each(Jvalue.DropDownValue, function (i, v) {
    //                    if (optionid == v.optionid) {
    //                        v.isselected = "1";
    //                        Jvalue.ControlValue = v.optionid;
    //                    }
    //                });
    //            }
    //        }
    //    });
    //}
    //onRowClicked(e) {
    //    if (e.event.target !== undefined) {
    //        let data = e.data;
    //        let actionType = e.event.target.getAttribute("data-action-type");
    //        if (actionType == "edit") {
               
    //        }
    //        else if (actionType == "SelectRMA") {
                
    //        }
    //    }
    //}
    onSelectionChanged() {

        var me = this;
        me.IsApproval = false;
        me.IsDiscrepancy = false;

        me.SelectedOrderLineItems = me.SOEditDetailgridOptions.api.getSelectedRows();
        $.each(me.SelectedOrderLineItems, function (i, v) {
            if (v.NeedApproval)
                me.IsApproval = true;

            if (v.IsDiscrepancy)
                me.IsDiscrepancy = true;
        });
        
        if (!this.SelectedOrderLineItems) {
            //this.ShowShippingLevel = false;
            //this.ShowTrackShipment = false;
            //this.IsApproval = false;
        }
        else {            
            //if (this.SelectedOrderLineItems.ShippingNumber) {                
            //    this.ShowTrackShipment = true;
            //}
            //else {                
            //    this.ShowTrackShipment = false;
            //}

            //if (this.SelectedOrderLineItems.ShippingLabelURL) {
            //    this.ShowShippingLevel = true;                
            //}
            //else {
            //    this.ShowShippingLevel = false;                
            //}

            //this.IsApproval = true;

            //if (this.SelectedOrderLineItems.NeedApproval)
            //    this.IsApproval = true;
            //else
            //    this.IsApproval = false;

            //if (this.SelectedOrderLineItems.IsDiscrepancy)
            //    this.IsDiscrepancy = true;
            //else
            //    this.IsDiscrepancy = false;
        } 
    }

    ShippingLevels() {
        //Wheel.loadingwheel(true);
        this.srOrderService.GetShippingLabel(this.SelectedOrderLineItems.SalesReturnOrderDetailID).
            subscribe(
            result => {
                //Wheel.loadingwheel(false);
                if (result[0].length != 0) {
                    if (result[0][0].ShippingLabelUrl && result[0][0].ShippingLabelUrl != "") {
                        var a = $("<a>")
                            .attr("href", result[0][0].ShippingLabelUrl)
                            .attr("target", "_blank")
                            .attr("download", "img.png")
                            .appendTo("body");

                        a[0].click();

                        a.remove();
                    }
                    else {

                        this._util.info("Alert", "No shipping label available", "info");
                    }
                }
                else {
                    this._util.info("Alert", "No shipping label available", "info");
                }
            });
    }

    TrackShipment() {
        
        if (this.SelectedOrderLineItems.SalesReturnOrderDetailID) {
            if (this.SelectedOrderLineItems.CarrierName.toUpperCase() == "UPS") {
                var a = $("<a>")
                    .attr("href", "http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber1=" + this.SelectedOrderLineItems.ShippingNumber + "&track.x=0&track.y=0")
                    .attr("target", "_blank")
                    .attr("download", "img.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
            }
            else if (this.SelectedOrderLineItems.CarrierName.toUpperCase() == "FEDEX") {
                var a = $("<a>")
                    .attr("href", "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" + this.SelectedOrderLineItems.ShippingNumber)
                    .attr("target", "_blank")
                    .attr("download", "img.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
            }
        }
    }

    //TrackShipment() {
        
    //    this.srOrderService.TrackOrderShipping(this.SelectedOrderLineItems.SalesReturnOrderDetailID).
    //        subscribe(
    //        result => {

    //            if (result[0].length != 0) {
    //                this.ShippingNumber = result[0][0].ShippingNumber;
    //                this.ReturnNumber = result[0][0].SalesReturnRMANumber;
    //                this.ReturnDate = result[0][0].CreatedDate;
    //                this.ShipDate = result[0][0].ShipDate;
    //                this.DeliveryTo = result[0][0].PartnerName;
    //                this.DeliveryLocation = result[0][0].DilveryLocation;
    //                this.ReturnStatus = result[0][0].StatusName;

    //                if (result[0][0].ShippingNumber) {
    //                    this.CallTrackAPi(this.SelectedOrderLineItems.SalesReturnOrderDetailID.toString(), result[0][0].carrier.toLowerCase(), result[0][0].Domain, result[0][0].ShippingNumber);
    //                }
    //                else {
    //                    Toast.ShowAlertBox(1, "Alert", "No shipping records available", 1);                                                
    //                }
    //            }
    //            else {                    
    //                Toast.ShowAlertBox(1, "Alert", "No shipping records available", 1);
    //            }

    //        });
    //}

    //CallTrackAPi(SalesReturnOrderDetailID, Carrier, Domain, ShippingNumber) {
    //    this.srOrderService.CarrierTrack(SalesReturnOrderDetailID, Carrier, Domain, ShippingNumber).subscribe(data => {

    //        if (data.Status == "Success" || data.Status.indexOf("success") > -1) {
    //            if (data.RLTrackActivities.length != 0) {                    
    //                this.TrackCarrierDetails = data.RLTrackActivities;
    //                this._tracingPopup.open();
    //            }
    //            else {
    //                Toast.ShowAlertBox(1, "Alert", "No shipping records available", 1);
    //            }
    //        }
    //        else {
    //            Toast.ShowAlertBox(1, "Alert", data.Status, 1);
    //        }
    //    }
    //        , error => {
    //            //Wheel.loadingwheel(false);
    //        });
    //}

    CloseTrackingPopup() { 
        this._tracingPopup.close();       
        //$('#divTracingPopup').modal('hide');
        //Wheel.loadingwheel(false);
    }

    //Attached Document Popup code
    CloseItemPopup() {
        $('#divItemPopup').modal('hide');
    }

    ShowAttachedDocument(item) {
        var me: any = this;        
        var ReturnReasonType = item.ReturnReasonType;
        var PartnerID = item.FromAccountID;
        var ReturnReasonID = item.ReturnReasonID;
        var SalesReturnOrderDetailID = item.SalesReturnOrderDetailID;
        var ItemModelID = item.ItemModelID;

        me.SelectedItemNumber = item.ItemNumber != "" ? item.ItemNumber : item.SerialNumber;
        me.SelectedItemName = item.ItemDescription;
         
        if (ReturnReasonType == "Account") {
            me.srOrderService.loadDynamicControls(ReturnReasonID, PartnerID, SalesReturnOrderDetailID, item.Quantity, item.ItemPrice).subscribe(returnvalue => {

                var viewableData = returnvalue[0];
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (me.DynamicControls.length > 0) {

                    $('#divItemPopup').modal('show');
                }
                else {
                    me._util.warning("There is no document attachment required for this return reason.", "");
                }                

            }, error => {

            });
        }
        else {
        
            me.srOrderService.loadDynamicControlsModelWise(ReturnReasonID, ItemModelID, SalesReturnOrderDetailID, item.Quantity, item.ItemPrice).subscribe(returnvalue => {

                var viewableData = returnvalue[0];                
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (me.DynamicControls.length > 0) {

                    $('#divItemPopup').modal('show');
                }
                else {                    
                    me._util.warning("There is no document attachment required for this return reason.", "");
                }

            }, error => {

            });
        }
    }

    EditImageClicked(item) {
        if (item.SalesReturnOrderDetailID == 0) {
            if (item.ReturnReasonID == null || item.ReturnReasonID == undefined || item.ReturnReasonID == "") {                
                this._util.error('Please select a return reason.', 'error');
            }
            else {
                this.EditClicked(item);
            }
        }
        else {
            this.ShowAttachedDocument(item)
        }

        //if (this.SODetailgridOptions.api)
        //    this.SODetailgridOptions.api.setRowData(this.OrderLineItemsList);
        //else
        //    this.SODetailgridOptions.rowData = this.OrderLineItemsList;
    }

    SetDynamicControl(viewableData) {

        var me: any = this;
        var IsDocCompleted: boolean = true;

        me.PendingArtifactsList = [];
        me.DynamicControls = [];
        me.NewArtifacts = new PendingArtifacts();
        $.each(viewableData, function (i, v) {

            if (v.ControlType == "File" && v.ControlValue != "") {

                var ArtifactsDetails = JSON.parse(v.ControlValue);
                $.each(ArtifactsDetails, function (k, x) {

                    var IsVideo: boolean = false;
                    var IsDoc: boolean = false;
                    var IsSheet: boolean = false;
                    var IsPdf: boolean = false;
                    var IsOther: boolean = false;
                    var IsImage: boolean = false;

                    if (x.FileType == "video") {
                        IsVideo = true;
                        IsDoc = false;
                        IsSheet = false;
                        IsPdf = false;
                        IsOther = false;
                        IsImage = false;
                    }
                    else if (x.FileType == "Image") {
                        IsVideo = false;
                        IsDoc = false;
                        IsSheet = false;
                        IsPdf = false;
                        IsOther = false;
                        IsImage = true;
                    }
                    else if (x.FileType == "pdf") {
                        IsVideo = false;
                        IsDoc = false;
                        IsSheet = false;
                        IsPdf = true;
                        IsOther = false;
                        IsImage = false;
                    }
                    else if (x.FileType == "sheet") {
                        IsVideo = false;
                        IsDoc = false;
                        IsSheet = true;
                        IsPdf = false;
                        IsOther = false;
                        IsImage = false;
                    }
                    else if (x.FileType == "document") {
                        IsVideo = false;
                        IsDoc = true;
                        IsSheet = false;
                        IsPdf = false;
                        IsOther = false;
                        IsImage = false;
                    }
                    else {
                        IsVideo = false;
                        IsDoc = false;
                        IsSheet = false;
                        IsPdf = false;
                        IsOther = true;
                        IsImage = false;
                    }

                    var Artifact = { FileUrl: x.FileUrl, DocType: x.DocumentType, IsVideo: IsVideo, IsDoc: IsDoc, IsSheet: IsSheet, IsPdf: IsPdf, IsOther: IsOther, IsImage: IsImage };
                    me.NewArtifacts[v.RuleCode].push(Artifact);
                    
                });
            }

        });        

        $.each(viewableData, function (i, v) {
            if (v.DropDownValue != "" && v.DropDownValue != null) {
                v.DropDownValue = JSON.parse(v.DropDownValue);
            }

            if (v.IsRequired)
                IsDocCompleted = false;
            //if (v.ControlType == 'File') {
            //    v.ControlValue = "";
            //}
        });

        me.DynamicControls = viewableData;           

        //me.DynamicControls = viewableData.filter(x => x.ControlType != "File");
        var QuestionnaireRule = me.DynamicControls.filter(x => x.RuleGroupID == 1818);
        if (QuestionnaireRule.length > 0)
            me.IsShowQuestionnaireRule = true;
        else
            me.IsShowQuestionnaireRule = false;

        var DefaultRule = me.DynamicControls.filter(x => x.RuleGroupID == 1817);
        if (DefaultRule.length > 0)
            me.IsShowDefaultQueston = true;
        else
            me.IsShowDefaultQueston = false;

        $.each(me.OrderLineItemsList, function (i, v) {            
            if (v.ItemInfoID == me.SelectedItemInfoID) {
                v.DynamicControls = me.DynamicControls; 
                v.Artifacts = me.PendingArtifactsList;
                v.IsDocAttached = IsDocCompleted;
                if (me.DynamicControls.length == 0) {
                    v.isControlsAdded = true;                    
                    v.AttachedDocument = 0;
                }
                else {
                    v.isControlsAdded = false;                    
                    v.AttachedDocument = me.DynamicControls.length;
                }               
            }
        });        
    }    

    SetGraphLocation() {

        var me: any = this;

        me.SelectedGraphLocation = "";
        me.SelectedDamageGraphLocations = [];

        var PositionOnItem = me.DynamicControls.filter(x => x.ControlType == "Position On Item");
        if (PositionOnItem.length > 0) {
            if (PositionOnItem[0].ControlValue != "") {
                var arr = PositionOnItem[0].ControlValue.split(",");
                $.each(arr, function (i, v) {
                    me.ref.detectChanges();

                    var graphData = { name: v.trim() };
                    me.SelectedDamageGraphLocations.push(graphData);
                    $("#" + v.trim()).addClass("insetShadow");
                    me.ref.detectChanges();
                });
            }
        }

        var damagelocations = "";
        if (me.SelectedDamageGraphLocations.length > 0) {
            for (let c of this.SelectedDamageGraphLocations) {
                damagelocations += c.name + ", ";
            }
            damagelocations = damagelocations.substr(0, damagelocations.length - 2);
        }
        me.SelectedGraphLocation = damagelocations;
    }  
    onDocumentChange(selected, me: any = this) {

        if (selected != "") {
            sessionStorage.setItem('DocumentType', selected);
            $("#returnArtifact" + selected).click();
        }
    } 
    ReturnDocs: FileList;
    handleReturnDocs(ctrl, e, controls, me1: any) {
        debugger;
        var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (file.length > 0) {
            //var pattern = /image-*/;
            var pattern = /ssfs-*/;
            var reader = new FileReader();
            if (!file[0].type.match(pattern)) {

                //9999999
                //file[0].size
                var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                if (file.length > 0) {

                    this.ReturnDocs = file;
                    let formData: FormData = new FormData();
                    for (let i = 0; i < this.ReturnDocs.length; i++) {
                        formData.append('SRODocs', this.ReturnDocs[0]);
                    }

                    $("#LodingDiv").show();
                    $("#ModelImageEditor").hide();
                    $("#ModelDynemicControl").hide();
                    $("#ModelFooter").hide();
                    this.srOrderService.UploadItemImage(formData).subscribe(data => {
                        
                        if (data.result == 'Success') {

                            var objArtifacts = new Artifacts();
                            objArtifacts.ID = controls.PartnerReturnReasonRuleMapID; //parseInt(sessionStorage.getItem('PartnerReturnReasonRuleMapID'));
                            objArtifacts.FileName = data.FileName;
                            objArtifacts.FileUrl = data.FileUrl;
                            objArtifacts.SystemGenName = data.SystemGenName;
                            objArtifacts.DocTypeID = 1647;// this.ArtifactType.TypeLookUpID;                
                            objArtifacts.DocType = sessionStorage.getItem('DocumentType');// this.ArtifactType.TypeName;
                            objArtifacts.IsImage = false;

                            if (file[0].type.indexOf("video") > -1) {
                                objArtifacts.FileType = "video";
                                objArtifacts.IsVideo = true;
                                objArtifacts.IsDoc = false;
                                objArtifacts.IsSheet = false;
                                objArtifacts.IsPdf = false;
                                objArtifacts.IsOther = false;
                            }
                            else if (file[0].type.indexOf("pdf") > -1) {
                                objArtifacts.FileType = "pdf";
                                objArtifacts.IsVideo = false;
                                objArtifacts.IsDoc = false;
                                objArtifacts.IsSheet = false;
                                objArtifacts.IsPdf = true;
                                objArtifacts.IsOther = false;
                            }
                            else if (file[0].type.indexOf("sheet") > -1) {
                                objArtifacts.FileType = "sheet";
                                objArtifacts.IsVideo = false;
                                objArtifacts.IsDoc = false;
                                objArtifacts.IsSheet = true;
                                objArtifacts.IsPdf = false;
                                objArtifacts.IsOther = false;
                            }
                            else if (file[0].type.indexOf("document") > -1) {
                                objArtifacts.FileType = "document";
                                objArtifacts.IsVideo = false;
                                objArtifacts.IsDoc = true;
                                objArtifacts.IsSheet = false;
                                objArtifacts.IsPdf = false;
                                objArtifacts.IsOther = false;
                            }
                            else {
                                objArtifacts.FileType = "other";
                                objArtifacts.IsVideo = false;
                                objArtifacts.IsDoc = false;
                                objArtifacts.IsSheet = false;
                                objArtifacts.IsPdf = false;
                                objArtifacts.IsOther = true;
                            }

                            $.each(this.DynamicControls, function (i, v) {
                                if (v.PartnerReturnReasonRuleMapID == objArtifacts.ID) {
                                    v.ControlValue = "";
                                }
                            });                           

                            this.NewArtifacts[sessionStorage.getItem('DocumentType')].push(objArtifacts);
                            this.ref.detectChanges();
                        }
                        else {
                            this._util.error(data.message, "error");
                        }
                        $("#LodingDiv").hide();
                        $("#ModelImageEditor").hide();
                        $("#ModelDynemicControl").show();
                        $("#ModelFooter").show();
                    });
                }

                console.log(this.PendingArtifactsList);

            }
            else {

                var reader = new FileReader();
                reader.onload = function (e) {

                    me1 = e;

                    sessionStorage.setItem('ImageDataForEdit', me1.target.result);
                    $("#imageeditorframe").attr("src", "../../../lib/editonimage/index.html");

                    $("#ModelImageEditor").show();
                    $("#ModelDynemicControl").hide();
                    $("#ModelFooter").hide();

                };
                reader.readAsDataURL(file[0]);

                sessionStorage.setItem('PartnerReturnReasonRuleMapID', controls.PartnerReturnReasonRuleMapID);
            }
        }
        else {
            //this.ArtifactType = null;
        }
    }

    CloseImageEditorPop() {

        $("#ModelImageEditor").hide();
        $("#ModelDynemicControl").show();
        $("#ModelFooter").show();
    }

    saveImageEditorPop(item) {
        debugger;
        var me: any = this;

        //$('.dynamicmycontrols input[type="file"]').find(function (file) {
        // alert(this.prop('files')[0]);
        var file = $("#returnArtifact" + sessionStorage.getItem('DocumentType'));
        // alert(file);
        me.ReturnDocs = file;// $(this)[0];//.prop('files')[0];

        let formData: FormData = new FormData();
        for (let i = 0; i < me.ReturnDocs.length; i++) {
            // alert(me.ReturnDocs[0]);
            formData.append('SRODocs', me.ReturnDocs[0]);
        }

        //var imagestring = sessionStorage.getItem('ImageEdittedData');
        var imagestring = item;
        imagestring = imagestring.split(",")[1];
        // formData.append('fileBase64', imagestring);

        $("#LodingDiv").show();
        $("#ModelImageEditor").hide();
        $("#ModelDynemicControl").hide();
        $("#ModelFooter").hide();

        me.srOrderService.UploadFromBase64(imagestring).subscribe(res => {
            var response: any;
            response = JSON.parse(res);
            var data = response[0];
            if (data.message == 'Success') {

                var objArtifacts = new Artifacts();
                objArtifacts.ID = parseInt(sessionStorage.getItem('PartnerReturnReasonRuleMapID'));// controls.PartnerReturnReasonRuleMapID;
                objArtifacts.FileName = me.ReturnDocs[0].files[0].name; //data.FileName;
                objArtifacts.FileUrl = data.FileUrl;
                objArtifacts.SystemGenName = data.SystemGenName;
                objArtifacts.DocTypeID = 1647;// this.ArtifactType.TypeLookUpID;                
                objArtifacts.DocType = sessionStorage.getItem('DocumentType');
                objArtifacts.FileType = "Image";
                objArtifacts.IsVideo = false;
                objArtifacts.IsImage = true;
                objArtifacts.IsDoc = false;
                objArtifacts.IsSheet = false;
                objArtifacts.IsPdf = false;
                objArtifacts.IsOther = false;

                $.each(me.DynamicControls, function (i, v) {
                    if (v.PartnerReturnReasonRuleMapID == objArtifacts.ID) {
                        v.ControlValue = "";
                    }
                });

                me.NewArtifacts[sessionStorage.getItem('DocumentType')].push(objArtifacts);
                me.ref.detectChanges();
                me.ArtifactType = null;

                $("#LodingDiv").hide();
                $("#ModelImageEditor").hide();
                $("#ModelDynemicControl").show();
                $("#ModelFooter").show();
            }
            else {
                this._util.error(data.message, "error");
            }
        });
    }
}


