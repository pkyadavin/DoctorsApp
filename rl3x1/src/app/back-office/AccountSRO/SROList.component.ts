import { Component, ViewChild, Input, EventEmitter, ErrorHandler, Output, NgZone, ChangeDetectorRef, ElementRef } from '@angular/core';
import { SalesReturnOrderService } from '../SalesReturnOrder/SalesReturnOrder.service';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SalesReturnOrder, SalesReturnOrderDetail, SRODetailReasonValue, PendingArtifacts, Artifacts, ApprovalDetails, TaskQueueDetails, TrackCarrier } from '../SalesReturnOrder/SalesReturnOrder.model';
import { MetadataService } from '../MetadataConfig/metadata-config.Service.js';
import { CommonService } from '../../shared/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal'
import { Receive, LineItem } from '../../controls/OrderTabManager/OrderTabSource.Model'
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
declare var $: any;
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs/Subscription';
import { EditComponent } from '../../shared/edit.component'
import { EditIamgeComponent } from '../../controls/clickable/imagelink.component'
import { SelectComponent } from '../Region/select.component'
import { Util } from 'src/app/app.util';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
    selector: 'SROrder-List',
    providers: [MetadataService, SalesReturnOrderService],    
    templateUrl: './SalesReturnOrderList.html'
})
export class SROrderList implements ErrorHandler {
    IsEditorVisible: boolean = false;
    FilterSROHeaderID: number;
    filterRMA: string;
    filterValue: string;
    selectedTab: string;
    isShowRefundAmount: boolean;   
    @ViewChild('pop') _popup: message; 
    @ViewChild('modalReject') _reject: modal;    
    @ViewChild('modalDiscrepancy') _modalDiscrepancy: modal;    
    CurrentSelectedItem: any = { DynamicControls: null };    
    CurrentSROApprovalDetail: ApprovalDetails = new ApprovalDetails();    
    gridOptionsDiscrepancy: GridOptions;
    moduleTitle: string;    
    searchValue: string = '';    
    selectedRetReason: number;    
    selectedDamageType: number;    
    IsDocsAvailable: boolean = false;    
    DamageTypeList: any;
    DeliveryTypes: any;   
    ReturnTypeList: any;
    ReturnReasonRulesList: any;
    FilteredReturnReason: any;
    SelectedRulesList: any;    
    OrderLineItemsList: any
    SelectedOrderLineItems: any    
    SelectedGraphLocation: string = "";    
    SelectedDamageGraphLocations: any;    
    Artifacts: any = [];    
    SelectedLines: any;
    IsApproval: boolean = false;    
    IsReject: boolean = false;    
    RejectReasonsList: any;
    CurrentStatus: number;
    DynamicControls: any;
    DynamicControlsResultData: any;
    PendingArtifactsList: Array<PendingArtifacts> = new Array<PendingArtifacts>();
    NewArtifacts: PendingArtifacts = new PendingArtifacts();
    SelectedLinesList: Array<SalesReturnOrderDetail> = new Array<SalesReturnOrderDetail>();        
    SelectedItemInfoID: number = 0;
    ShowShippingLevel: boolean = false;
    ShowTrackShipment: boolean = false;    
    RuleGroup: any;
    ReturnReasonType: string;
    IsDocumentEditMode: boolean = false;
    SelectedItemName: string = "";
    SelectedItemNumber: string = "";
    FileGroupList: any;    
    IsDiscrepancy: boolean = false;
    ItemsDiscrepancyList: any;
    RejectReasonRemark: string = "";
    RejectReasonID: number;
    LocalAccess: any = [];
    sroReq: string; 
    ApproveOrRejectTitle:string="";
    SrocolumnDefs: any;
    BookedInGridOptions: GridOptions;
    BookedInItemsList: any;   

    TransitGridOptions: GridOptions;
    TransitItemsList: any;    

    ApprovalGridOptions: GridOptions;
    ApprovalItemsList: any;
    ApprovalcolumnDefs: any;

    ReceivedGridOptions: GridOptions;
    ReceivedItemsList: any;
    ReceivedcolumnDefs: any;

    RejectedGridOptions: GridOptions;
    RejectedItemsList: any;
    RejectedcolumnDefs: any;

    PutAwayGridOptions: GridOptions;
    PutAwayItemsList: any;
    PutAwaycolumnDefs: any;

    DiscrepantGridOptions: GridOptions;
    DiscrepantItemsList: any;
    DiscrepantcolumnDefs: any;     
       
    errorMessage:string;
    gridapi = null;
    gridcolumnapi = null;
    onGridPartnerReady(gridParams){
        this.gridapi = gridParams.api;
        this.gridcolumnapi = gridParams.columnApi;
        this.gridapi.setRowData(this.BookedInItemsList);
    }

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
    
    constructor(private _util:Util, private _auth:AuthService,
        private srOrderService: SalesReturnOrderService, public cService: CommonService, private mservice: MetadataService, private _router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder, private _globalService: GlobalVariableService, private _ngZone: NgZone, private ref: ChangeDetectorRef, private elRef: ElementRef) {
        window['angularImageEditorRef'] = {
            zone: _ngZone,
            component: this
        };

        this.SelectedDamageGraphLocations = [];        
    };
    ngOnDestroy() {
        window['angularImageEditorRef'] = null;
    }
    ngOnInit() {
        $("#ModelImageEditor").hide();
        $("#LodingDiv").hide();

        if (this.route.snapshot.parent.url[1])
            this.moduleTitle = this._globalService.getModuleTitle(this.route.snapshot.parent.url[0].path + '/' + this.route.snapshot.parent.url[1].path);
        else
            this.moduleTitle = this._globalService.getModuleTitle(this.route.snapshot.parent.url[0].path);

        if (this.moduleTitle == "")
            this.moduleTitle = "Account RMA Orders";                             

        this.cService.getTypeLookUpByName("RuleGroup").subscribe(rulegroup => {
            this.RuleGroup = rulegroup;
        });

        this.DynamicControls = [];
        this.DynamicControlsResultData = {};

        this.LoadGridOption();
        this.FillFileGroup();
        this.LoadReturnReason();
        this.OnTabChanged("BookedIn");  

        var partnerinfo = this._globalService.getItem('partnerinfo');
        this.loadPermissionByModule(partnerinfo[0].UserId, partnerinfo[0].LogInUserPartnerID, this.moduleTitle);       
    }

    async loadPermissionByModule(userID, logInUserPartnerID, moduleTitle) {
        await this.cService.loadPermissionByModule(userID, logInUserPartnerID, moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });                
            }
        )
    }

    OnEditSROrder() {
        this.sroReq = "Add";
        this.FilterSROHeaderID = 0;
        this.IsEditorVisible = true;
    }

    ViewRMAItems() {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];

        if (this.filterRMA != undefined && this.filterRMA != "") {
            
            this.srOrderService.GetSroByRMANumber(partnerinfo.LogInUserPartnerID, this.filterRMA).subscribe(result => {
                if (result[0][0]) {                    
                    this.FilterSROHeaderID = result[0][0].SalesReturnOrderHeaderID;
                    this.sroReq = "Edit";
                    this.IsEditorVisible = true;
                }
                else {
                    this._popup.Alert('Alert', "Please enter a valid RMA number.");
                }
            });
        }
        else {            
            this._popup.Alert('Alert', "Please enter a valid RMA number.");
        }

        this.filterRMA = "";        
    }

    ChangeEditorVisibility(data) {        
        this.IsEditorVisible = false;
        this.OnTabChanged("BookedIn");
    }

    onSearch() {

        if (this.selectedTab == "InTransit") {
            this.TransitGridOptions.api.setQuickFilter(this.filterValue);
        }
        else if (this.selectedTab == "PendingApproval") {
            this.ApprovalGridOptions.api.setQuickFilter(this.filterValue);            
        }
        else if (this.selectedTab == "Received") {
            this.ReceivedGridOptions.api.setQuickFilter(this.filterValue);            
        }
        else if (this.selectedTab == "PutAway") {
            this.PutAwayGridOptions.api.setQuickFilter(this.filterValue);            
        }
        else if (this.selectedTab == "Discrepant") {
            this.DiscrepantGridOptions.api.setQuickFilter(this.filterValue);            
        }
        else if (this.selectedTab == "Rejected") {
            this.RejectedGridOptions.api.setQuickFilter(this.filterValue);            
        }
        else if (this.selectedTab == "BookedIn") {
            this.BookedInGridOptions.api.setQuickFilter(this.filterValue);
        }
    }

    LoadGridOption() {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];

        this.gridOptionsDiscrepancy = {
            rowData: this.ItemsDiscrepancyList,
            columnDefs: this.DiscrepancycolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,            
            rowSelection: 'single',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,          
            context: {
                componentParent: this
            }
        };
        
        this.SrocolumnDefs = [            
            { headerName: '#', field: "ItemSeq", suppressFilter: true, width: 50 },
            { headerName: 'Item Serial#', field: "SerialNumber", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 70 },
            { headerName: 'Item Number', field: "ItemNumber", width: 150 },
            { headerName: 'Item Description', field: "ItemDescription", width: 200 },
            { headerName: 'RMA Number', field: "RMANumber", width: 100 },
            { headerName: 'Return Reason', field: "ReturnReason", width: 225 },
            { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
            { headerName: 'Item Price (' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 120 },
            { headerName: 'Refund Amount  (' + partnerinfo.CurrencySymbol + ')', field: "ReturnPrice", width: 140 },
            //{ headerName: 'Status', field: "StatusName", width: 200 },            
        ];

        this.BookedInGridOptions = {
            rowData: this.BookedInItemsList,
            columnDefs: this.SrocolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,   
            context: {
                componentParent: this
            }
            // rowData: this.BookedInItemsList,
            // columnDefs: this.SrocolumnDefs,
            // headerHeight: 40,
            // rowHeight: 40,
            // onGridReady: () => {                
            //     this.OnTabChanged("BookedIn");
            // }
        };
        
        this.TransitGridOptions = {
            rowData: this.TransitItemsList,
            columnDefs: this.SrocolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,            
            rowSelection: 'single',  
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,             
            context: {
                componentParent: this
            }
        };

        this.ApprovalcolumnDefs = [
            { headerName: '', width: 25, checkboxSelection: true },
            { headerName: '#', field: "ItemSeq", suppressFilter: true, width: 50 },
            { headerName: 'Item Serial#', field: "SerialNumber", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 70 },
            { headerName: 'Item Number', field: "ItemNumber", width: 150 },
            { headerName: 'Item Description', field: "ItemDescription", width: 200 },
            { headerName: 'RMA Number', field: "RMANumber", width: 100 },
            { headerName: 'Return Reason', field: "ReturnReason", width: 225 },
            { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
            { headerName: 'Item Price (' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 120 },
            { headerName: 'Refund Amount  (' + partnerinfo.CurrencySymbol + ')', field: "ReturnPrice", width: 140 },
            //{ headerName: 'Status', field: "StatusName", width: 200 },            
        ];
        this.ApprovalGridOptions = {
            rowData: this.ApprovalItemsList,
            columnDefs: this.ApprovalcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'multiple',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,   
            context: {
                componentParent: this
            }
        };

        this.ReceivedGridOptions = {
            rowData: this.ReceivedItemsList,
            columnDefs: this.SrocolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,   
            context: {
                componentParent: this
            }
        };

        this.RejectedcolumnDefs = [
            { headerName: '#', field: "ItemSeq", suppressFilter: true, width: 50 },
            { headerName: 'Item Serial#', field: "SerialNumber", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 70 },
            { headerName: 'Item Number', field: "ItemNumber", width: 150 },
            { headerName: 'Item Description', field: "ItemDescription", width: 200 },
            { headerName: 'RMA Number', field: "RMANumber", width: 100 },
            { headerName: 'Return Reason', field: "ReturnReason", width: 225 },
            { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
            { headerName: 'Item Price (' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 120 },            
            //{ headerName: 'Status', field: "StatusName", width: 200 },            
        ];
        this.RejectedGridOptions = {
            rowData: this.RejectedItemsList,
            columnDefs: this.RejectedcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,   
            context: {
                componentParent: this
            }
        };

        this.PutAwayGridOptions = {
            rowData: this.PutAwayItemsList,
            columnDefs: this.SrocolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,   
            context: {
                componentParent: this
            }
        };

        this.DiscrepantcolumnDefs = [
            { headerName: '#', field: "ItemSeq", suppressFilter: true, width: 50 },
            { headerName: 'Item Serial#', field: "SerialNumber", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 70 },
            { headerName: 'Item Number', field: "ItemNumber", width: 150 },
            { headerName: 'Item Description', field: "ItemDescription", width: 200 },
            { headerName: 'RMA Number', field: "RMANumber", width: 100 },
            { headerName: 'Return Reason', field: "ReturnReason", width: 225 },
            { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
            { headerName: 'Item Price (' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 120 },
            //{ headerName: 'Status', field: "StatusName", width: 200 },  
            { headerName: 'Discrepancy', field: "DiscrepancyID", width: 100 },
            { headerName: 'Discrepancy Remark', field: "DiscrepancyRemark", width: 200 },          
        ];
        this.DiscrepantGridOptions = {
            rowData: this.DiscrepantItemsList,
            columnDefs: this.DiscrepantcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            pagination:true, 
            //rowModelType: "infinite",
            paginationPageSize: 20,   
            context: {
                componentParent: this
            }
        };
    }     

    OnTabChanged(Selected) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.selectedTab = Selected;

        if (this.selectedTab == "BookedIn") {            
            this.srOrderService.loadSROList(partnerinfo.UserId, "SOR63", partnerinfo.LogInUserPartnerID).subscribe(result => {
                this.BookedInItemsList = result[0];
                this.OrderLineItemsList = result[0];                 
                this.BookedInGridOptions.api.setRowData(this.BookedInItemsList);
        
                //this.BookedInGridOptions.api.setRowData(this.BookedInItemsList);
                console.log(this.BookedInItemsList);

            });
        }
        else if (this.selectedTab == "InTransit") {            
            this.srOrderService.loadSROList(partnerinfo.UserId, "SOR64,ST066", partnerinfo.LogInUserPartnerID).subscribe(result => {
                this.TransitItemsList = result[0];
                this.OrderLineItemsList = result[0];                
                this.TransitGridOptions.api.setRowData(this.TransitItemsList);
            });
        }
        else if (this.selectedTab == "PendingApproval") {            
            this.srOrderService.loadSROList(partnerinfo.UserId, "SOR62", partnerinfo.LogInUserPartnerID).subscribe(result => {
                this.ApprovalItemsList = result[0];
                this.OrderLineItemsList = result[0];               
                this.ApprovalGridOptions.api.setRowData(this.ApprovalItemsList);
            });
        }
        else if (this.selectedTab == "Received") {            
            this.srOrderService.loadSROReceivedList(partnerinfo.UserId, partnerinfo.LogInUserPartnerID,"Received").subscribe(result => {
                this.ReceivedItemsList = result[0];
                this.OrderLineItemsList = result[0];                
                this.ReceivedGridOptions.api.setRowData(this.ReceivedItemsList);
            });
        }
        else if (this.selectedTab == "PutAway") {
            this.srOrderService.loadSROReceivedList(partnerinfo.UserId, partnerinfo.LogInUserPartnerID,"PutAway").subscribe(result => {
                this.PutAwayItemsList = result[0];
                this.OrderLineItemsList = result[0];
                this.PutAwayGridOptions.api.setRowData(this.PutAwayItemsList);
            });
        }
        else if (this.selectedTab == "Discrepant") {
            this.srOrderService.loadSROList(partnerinfo.UserId, "SOR65", partnerinfo.LogInUserPartnerID).subscribe(result => {
                this.DiscrepantItemsList = result[0];
                this.OrderLineItemsList = result[0];                
                this.DiscrepantGridOptions.api.setRowData(this.DiscrepantItemsList);
            });
        }
        else if (this.selectedTab == "Rejected") {
            this.srOrderService.loadSRORejectedList(partnerinfo.UserId).subscribe(result => {
                this.RejectedItemsList = result[0];
                this.OrderLineItemsList = result[0];
                this.RejectedGridOptions.api.setRowData(this.RejectedItemsList);
            });
        }        
    }    

    SelectItem(cell) {
        
        var items = { ID: cell.ID };  
        this.srOrderService.ResolveDescrapency(items).subscribe(returnvalue => {            
            if (returnvalue.result == "Success") {
                this._popup.Alert('Alert', "SRO Updated Successfully.");
                this.IsDiscrepancy = false;

                this.srOrderService.GetDiscrepancyList(this.SelectedOrderLineItems.SalesReturnOrderDetailID).subscribe(result => {
                    if (result[0]) {
                        this.ItemsDiscrepancyList = result[0];
                        this.gridOptionsDiscrepancy.api.setRowData(this.ItemsDiscrepancyList);                        
                    }                    
                });

                this.OnTabChanged("Discrepant");
            }
            else {
                this._popup.Alert('Alert', returnvalue.result);
            }           
        });       
    }  
    
    ResolveDiscrepancy() {

        if (this.SelectedOrderLineItems.length > 1) {
            this._popup.Alert('Alert', "Please select only one item to resolve discrepancy.");
            return;
        }

        if (this.SelectedOrderLineItems.SalesReturnOrderDetailID) {
            this.srOrderService.GetDiscrepancyList(this.SelectedOrderLineItems.SalesReturnOrderDetailID).subscribe(result => {
                if (result[0]) {
                    this.ItemsDiscrepancyList = result[0];
                    this.gridOptionsDiscrepancy.api.setRowData(this.ItemsDiscrepancyList);
                    this._modalDiscrepancy.open();
                }
                else {
                    this._popup.Alert('Alert', "No data found.");
                    return;
                }
            });
        }
        else {
            this._popup.Alert('Alert', "Please select a item.");
        }        
    }

    FillFileGroup() {
        this.srOrderService.getTypeLookUpByName("CNT012").subscribe(filegroup => {
            this.FileGroupList = filegroup.recordsets[0];
        }); 
    }

    LoadReturnReason() {
        this.srOrderService.GetReturnReason().subscribe(result => {
            this.RejectReasonsList = result.recordsets[0];
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

    handleError(error) {
        console.log(error)
    }    

    Approve(me: any = this) {
        me.IsReject = false;        
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

    GetDynemicControl(ReturnReasonID, PartnerID, ItemModelID, ItemInfoID) {        
        var me: any = this;
        if (this.ReturnReasonType == "Account") {
            me.srOrderService.loadDynamicControls(ReturnReasonID, PartnerID, 0).subscribe(returnvalue => {

                var viewableData = returnvalue[0];                
                me.SelectedItemInfoID = ItemInfoID;
                me.SetDynamicControl(viewableData);
            }, error => {

            });
        }
        else {
            me.srOrderService.loadDynamicControlsModelWise(ReturnReasonID, ItemModelID, 0).subscribe(returnvalue => {

                var viewableData = returnvalue[0];

                $.each(viewableData, function (i, v) {
                    v.PartnerReturnReasonRuleMapID = v.ItemModelReturnReasonRuleMapID;
                });
               
                me.SelectedItemInfoID = ItemInfoID;
                me.SetDynamicControl(viewableData);

            }, error => {

            });
        }
    }
    
    EditClicked(item) { 
        var me: any = this;
        me.IsDocumentEditMode = true;
        var PartnerID = item.FromAccountID;
        var ReturnReasonID = item.ReturnReasonID;        
        var ItemModelID = item.ItemModelID;
        me.SelectedItemNumber = item.ItemNumber;
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

                        $('#divItemPopup2').modal('show');
                    }
                    else {
                        me._popup.Alert('Alert', 'There is no document attachment required for this return reason.');
                    }
                }
                else {
                    me.SetDocumentPopUp(ReturnReasonID, PartnerID, ItemModelID, item.Quantity, item.ItemPrice);
                    if (me.DynamicControls.length > 0) {
                        $('#divItemPopup2').modal('show');
                    }
                    else {
                        me._popup.Alert('Alert', 'There is no document attachment required for this return reason.');
                    }
                }
            }
        });        
    }

    SetDocumentPopUp(ReturnReasonID, PartnerID, ItemModelID, Quantity, ItemPrice) {
        var me: any = this;
        if (this.ReturnReasonType == "Account") {
            me.srOrderService.loadDynamicControls(ReturnReasonID, PartnerID, 0, Quantity, ItemPrice).subscribe(returnvalue => {

                var viewableData = returnvalue[0];
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (me.DynamicControls.length > 0) {
                    $('#divItemPopup2').modal('show');
                }
                else {
                    me._popup.Alert('Alert', 'There is no document attachment required for this return reason.');
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
                    $('#divItemPopup2').modal('show');
                }
                else {
                    me._popup.Alert('Alert', 'There is no document attachment required for this return reason.');
                }

            }, error => {

            });
        }
    }    

    onSubmitApproval() {
        var me = this;        
        if (me.IsReject) {
            if (me.RejectReasonID === undefined) {
                this._util.warning('Reject Reason is required.', 'warning');
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
            
            if (returnvalue.result.indexOf("Success") > -1) {
                var msg = returnvalue.result;
                msg = msg.split(';');

                if (me.SelectedOrderLineItems.RMASource == "Customer") {
                    if (me.DeliveryTypes.filter(f => f.TypeLookUpID == me.SelectedOrderLineItems.DeliveryTypeID)[0].TypeCode == "FFT00001" && msg[1] == "0") {
                        me.srOrderService.generateTrackingNumber(me.SelectedOrderLineItems.SalesReturnOrderDetailID.toString(), me._auth.getScope()).subscribe(returnvalue1 => {

                            $('#ApproveOrReject').modal('hide');
                            me._popup.Alert('Alert', 'RMA Updated Successfully.', function () {
                                me.IsApproval = false;
                            });
                        },
                        error => {
                            me._popup.Alert('Error', error);
                        });
                    }
                }
                else {
                    $('#ApproveOrReject').modal('hide');
                    me._popup.Alert('Alert', 'RMA Updated Successfully.', function () {
                        me.IsApproval = false;                       
                        me.OnTabChanged("PendingApproval");
                    });
                }                
            }
        });           
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
    
    justCloseImageEditorPop() {
        $('#customImageEditor').modal('hide');
    }    
    showImagePreview(url) {        
        $("#previewImage").css("display", "block");
        $("#previewImage").attr("src", url);
    }
    hideImagePreview() {        
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
    
    onSelectionChanged() {

        var me = this;
        me.IsApproval = false;
        me.IsDiscrepancy = false;

        me.SelectedOrderLineItems = me.ApprovalGridOptions.api.getSelectedRows();
        $.each(me.SelectedOrderLineItems, function (i, v) {
            if (v.NeedApproval)
                me.IsApproval = true;

            if (v.IsDiscrepancy)
                me.IsDiscrepancy = true;
        });        
    }

    DiscrepancySelectionChanged() {

        var me = this;        
        me.IsDiscrepancy = false;
        me.IsApproval = false;

        me.SelectedOrderLineItems = me.DiscrepantGridOptions.api.getSelectedRows()[0];

        if (me.SelectedOrderLineItems) {
            if (me.SelectedOrderLineItems.IsDiscrepancy)
                me.IsDiscrepancy = true;
            else
                me.IsDiscrepancy = false;
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

                        this._util.error("Alert", "Shipping label is not available.", "error");
                    }
                }
                else {
                    this._util.error("Alert", "Shipping label is not available.", "error");
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

    //Attached Document Popup code
    CloseItemPopup() {
        $('#divItemPopup2').modal('hide');
    }

    ShowAttachedDocument(item) {
        var me: any = this;        
        var ReturnReasonType = item.ReturnReasonType;
        var PartnerID = item.FromAccountID;
        var ReturnReasonID = item.ReturnReasonID;
        var SalesReturnOrderDetailID = item.SalesReturnOrderDetailID;
        var ItemModelID = item.ItemModelID;
        me.SelectedItemNumber = item.ItemNumber;
        me.SelectedItemName = item.ItemDescription;

        if (ReturnReasonType == "Account") {
            me.srOrderService.loadDynamicControls(ReturnReasonID, PartnerID, SalesReturnOrderDetailID, item.Quantity, item.ItemPrice).subscribe(returnvalue => {

                var viewableData = returnvalue[0];
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                if (me.DynamicControls.length > 0) {

                    $('#divItemPopup2').modal('show');
                }
                else {
                    me._popup.Alert('Alert', 'There is no document attachment required for this return reason.');
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

                    $('#divItemPopup2').modal('show');
                }
                else {
                    me._popup.Alert('Alert', 'There is no document attachment required for this return reason.');
                }

            }, error => {

            });
        }
    }

    EditImageClicked(item) {
        if (item.SalesReturnOrderDetailID == 0) {
            if (item.ReturnReasonID == null || item.ReturnReasonID == undefined || item.ReturnReasonID == "") {
                this._popup.Alert('Alert', 'Please select a return reason.');
            }
            else {
                this.EditClicked(item);
            }
        }
        else {
            this.ShowAttachedDocument(item)
        }        
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
        var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (file.length > 0) {
            var pattern = /image-*/;
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
            }
            else {

                var reader = new FileReader();
                reader.onload = function (e) {

                    me1 = e;
                    sessionStorage.setItem('ImageDataForEdit', me1.target.result);
                    $("#imageeditorframe").attr("src", "../../lib/editonimage/index.html");

                    $("#ModelImageEditor").show();
                    $("#ModelDynemicControl").hide();
                    $("#ModelFooter").hide();

                };
                reader.readAsDataURL(file[0]);

                sessionStorage.setItem('PartnerReturnReasonRuleMapID', controls.PartnerReturnReasonRuleMapID);
            }
        }
        else {            
        }
    }

    CloseImageEditorPop() {

        $("#ModelImageEditor").hide();
        $("#ModelDynemicControl").show();
        $("#ModelFooter").show();
    }

    saveImageEditorPop(item) {
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


