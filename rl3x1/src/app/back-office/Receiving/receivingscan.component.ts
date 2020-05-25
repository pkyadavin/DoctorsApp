import { Component, ViewChild, Input, Output, ChangeDetectorRef } from '@angular/core';
import { MRNService } from '../Receiving/receiving.service';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { MRN, MRNLine, MRNActionInput, IncomingTask, PendingArtifacts } from './receiving.model'
import { ReceivingQtyEditorComponent } from './receivingqtyeditor.component'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MetadataService } from '../MetadataConfig/metadata-config.Service';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { BsModalComponent } from 'ng2-bs3-modal'
import { message, modal } from '../../controls/pop';
import { AddressInput } from '../../shared/address.model';
import { EventEmitter } from '@angular/core';
import { EditComponent } from '../../shared/edit.component'
import { EditIamgeComponent } from '../../controls/clickable/imagelink.component'
import { Util } from 'src/app/app.util';

declare var $: any;

@Component({
    selector: 'MRNScanEditor',    
    providers: [MRNService, MetadataService],
    templateUrl: './receivingscan.html'
})
export class MRNScanEditor {
    filterValue: string;
    @ViewChild('ItemPopup') _itemPopup: BsModalComponent;
    @ViewChild('modalPartner') _partner: modal;
    @ViewChild('modalReceiving') _Receiving: modal;
    @ViewChild('modalScanSN') _modalScanSN: modal;
    @ViewChild('modalTaskQueue') _modalTaskQueue: modal;
    @ViewChild('modalOrderLog') _modalOrderLog: modal;
    @ViewChild('AccessoriesModel') _accessoriesModel: modal;
    popuptype = "popup";
    @ViewChild('pop') _popup: message;
    @ViewChild('modalFromAddress') _address: modal;
    partnerType = "PTR002";
    addressInput: AddressInput = {
        MaptableName: "PartnerAddressMap",
        MapTableColumn: "PartnerID",
        MapColumnValue: "0",
    };
    addressGridPopup: boolean = false;
    IsReceivingLoad: boolean = false;
    IsShowDiscrepancy: boolean = false;
    modalPartner: BsModalComponent;
    mrnActionInput: MRNActionInput;
    moduleTitle: string;
    @Output() ScanVisibilityChange = new EventEmitter();
    @Input("selectedId") CurrentMRNId: number;
    @Input("permission") permission: boolean;
    @Input("type") type: string;
    @Input("indexLocalTask") indexLocalTask: any;
    CurrentMRN: MRN = new MRN();
    CurrentActionId: number;
    CurrentActionName: string;
    PreviousActionName: string;
    CurrentModuleWorkFlowDetailID: number;
    PreviousModuleWorkFlowDetailID: number = 0;
    arrCurrentMRNLine: MRNLine[] = [];
    CurrentReceivingAction: any;
    ModuleSource: string = ""
    IsEditReceivingHidden: boolean = false;
    MRNEditor: any;
    IsLoaded: boolean;
    errorMessage: string;
    dataSourceLines: any;
    partnerInfo: any;
    IncomingTask: IncomingTask;

    IsLinesGridLoaded: boolean = false;

    ReceivingActionList = [];
    ReceivingActionRulesList = [];
    RefTypeList: any;
    ShipViaList: any;
    PaymentTermsList: any;
    CarriersList: any;

    FromAddressEnable: boolean = false;
    wizard: any;

    CurrentScannedSN: any;
    CurrentScannedSNList = [];
    CurrentPackageNumber: string = "";
    ItemStatusList = [];
    DiscrepancyList = [];
    IsItemStatusListLoaded: boolean = false;
    IsDiscrepancyLoaded: boolean = false;
    CurrentItemStatusId: number;
    DiscrepancyID: number;
    Discrepancy: string;
    DiscrepancyRemark: string;
    CurrentContainerNumber: string = "";
    CurrentRemarks: string = "";
    NodeList = [];
    GradeList = [];
    OrderLogs = [];
    CurrentNodeId: number;
    LocationList = [];
    CurrentLocationId: number;

    localTask: any;
    IsFromTaskQueue: boolean;
    CurrentTask: any;
    CurrentTaskSource: string = "";
    tabMode: string;
    LastNextStatusID: number;
    IsCurrentReceivingCompleted: boolean;

    gridOptionsOrderLog: GridOptions;
    gridOptionsLines: GridOptions;

    PendingArtifactsList: any;
    DynamicControls: any;  
    RuleGroup: any; 
    IsShowDefaultQueston: boolean = true;
    IsShowQuestionnaireRule: boolean = true;
    SelectedDamageGraphLocations: any;
    SelectedGraphLocation: string = "";
    AccessoriesList: any;
    //ItemAccessories: string = "";
    SelectedAccessories: any;
    SelectedData: any;
    SelectedItemName: string = "";
    SelectedItemNumber: string = "";

    columnDefs = [
        { headerName: 'Item #', field: "ItemNumber", width: 100, cellRenderer: 'group' },
        { headerName: 'MRNHeaderID', field: "MRNHeaderID", width: 150, hide: true },
        { headerName: 'MRN Number', field: "MRNNumber", width: 100 },
        { headerName: 'Start Date', field: "StartDate", width: 150 },
        { headerName: 'Task', field: "Task", width: 100 },
        { headerName: 'Item Name', field: "ItemName", width: 150  },
        { headerName: 'Serial #', field: "SerialNumber", width: 100 },
        { headerName: 'Quantity', field: "Quantity", width: 80 },
        { headerName: 'Created By', field: "CreatedBy", width: 100 },
        { headerName: 'Aging Days', field: "AgingDays", width: 100 }
    ]

    columnDefsLines = [
        //{
        //    headerName: '', field: "Remove", Width: 25, editable: false, hide: false, cellRendererFramework: EditComponent            
        //},
        { headerName: 'AWB#', field: "ShippingNumber", width: 150, cellRendererFramework: EditComponent  },
        { headerName: 'Item Name', field: "ItemDescription", width: 200, suppressFilter: true },
        //{ headerName: 'Model #/SKU', field: "ModelName", width: 150, suppressFilter: true },
        //{ headerName: 'Serial #/Quantity', field: "SerialQuantity", width: 170, suppressFilter: true },
        { headerName: 'Item Serial #', field: "SerialNumber", width: 150, suppressFilter: true },
        { headerName: 'Quantity', field: "Quantity", width: 100, suppressFilter: true },        
        { headerName: 'Return Reason', field: "ReturnReason", width: 200, suppressFilter: true },
        { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
        { headerName: 'Status', field: "StatusName", width: 150 },        
        //{ headerName: 'Item Conditions', field: "ItemConditions", width: 150 },
        //{ headerName: 'Grade', field: "PackageNumber", width: 150 },
        //{ headerName: 'Container #', field: "ContainerNumber", width: 150 },        
        //{ headerName: 'Sub-Inventory', field: "SubInventory", width: 150 },
        //{ headerName: 'Location', field: "Location", width: 150 },
        //{ headerName: 'Remarks', field: "Remarks", width: 150 },
        //{ headerName: 'Discrepancy', field: "Discrepancy", width: 150 },
        //{ headerName: 'Discrepancy Remark', field: "DiscrepancyRemark", width: 250 }, 
        //{ headerName: 'Accessories', field: "AccessoriesName", width: 250 }, 
    ];

    IsPreviousLinesGridVisible: boolean = false;
    CurrentPreviousLine: any;
    CurrentPreviousLineAddedSNCount: number;
    TempPreviousLinesList = [];
    PreviousLinesList = [];
    PreviousLinesGridOptions: GridOptions;
    PreviousLinescolumnDefs = [
        {
            headerName: '', field: "Select", Width: 25, editable: false, hide: false, cellRendererFramework: EditComponent            
        },
        { headerName: 'Product Name', field: "ItemDescription", width: 250, suppressFilter: true },
        { headerName: 'Model #/SKU', field: "ModelName", width: 150, suppressFilter: true },
        { headerName: 'Serial #/Quantity', field: "SerialQuantity", width: 170, suppressFilter: true },
        { headerName: 'Sales Order #', field: "SONumber", width: 150, suppressFilter: true },
        { headerName: 'Return Reason', field: "ReturnReason", width: 200, suppressFilter: true },
        { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },        
        { headerName: 'Status', field: "StatusName", width: 150 },    
               
    ]

    ScannedSNList = [];
    TempScannedSNList = [];
    ScannedSNGridOptions: GridOptions;
    ScannedSNListVerified: boolean = false;
    ScannedSNColumnDefs = [
        {
            headerName: '', field: "Action", Width: 50, editable: false,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteScannedSN" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i> Delete</button></div>';
            }
        },
        { headerName: 'Serial Number', field: "SerialNumber" }
    ]

    TaskQueueList = [];
    TaskQueueGridOptions: GridOptions;
    TaskQueueColumnDefs = [
        { headerName: '', field: "RefID", hide: true },
        {
            headerName: '', field: "Action", Width: 50, editable: false,
            cellRenderer: function (params: any) {
                return '<a style="cursor:pointer;" id="selectRef">Select</a>';
            }
        },
        { headerName: 'Reference No', field: "RefNumber" },
        { headerName: 'Reference Type', field: "RefType" },
        { headerName: 'Task', field: "Task" },
        { headerName: 'Task Date', field: "TaskDate" }
    ]

    getNodeChildDetails(rowItem) {
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

    constructor(
        private mrnService: MRNService, public _util: Util,
        private _router: Router, private route: ActivatedRoute, private _config: MetadataService,
        private _global: GlobalVariableService, private ref: ChangeDetectorRef) {
        this.moduleTitle = _global.getModuleTitle(route.snapshot.parent.url[0].path);        

    };

    ngOnInit() {

        $("#ModelImageEditor").hide();
        $("#LodingDiv").hide();

        this.partnerInfo = this._global.getItem('partnerinfo');
        this.mrnActionInput = new MRNActionInput();
        this.IncomingTask = new IncomingTask();


        //this.route.queryParams.subscribe(params => {
        if (this.indexLocalTask != null && this.indexLocalTask != undefined) {
            this.CurrentTask = this.indexLocalTask;
            this.IsFromTaskQueue = false;
            //this.CurrentTaskSource = "edit";
            this.CurrentTaskSource = "new";
            this.CurrentMRNId = 0;
        }
        else if (this.localTask != null || this.localTask != undefined) {
            this.CurrentTask = this.localTask;
            this.IsFromTaskQueue = false;
            this.IsPreviousLinesGridVisible = true;
            this.CurrentTaskSource = "new";
        }
        else if (this._global.TaskQue != null || this._global.TaskQue != undefined) {
            this.CurrentTask = this._global.TaskQue;
            this.IsFromTaskQueue = true;
            this.IsPreviousLinesGridVisible = true;
            this.CurrentTaskSource = "queue";
        }

        if (this.CurrentTask != null) {
            this.IncomingTask.RefId = this.CurrentTask.RefID;
            this.IncomingTask.RefNumber = this.CurrentTask.RefNumber;
            this.IncomingTask.RefType = this.CurrentTask.RefType;
            this.IncomingTask.Action = this.CurrentTask.Task;

            if (this.IncomingTask.RefType == "PO") {
                this.IncomingTask.RefCode = "MREF001";
            }
            else if (this.IncomingTask.RefType == "STO") {
                this.IncomingTask.RefCode = "MREF002"
            }
            else if (this.IncomingTask.RefType == "IO") {
                this.IncomingTask.RefCode = "MREF003"
            }
            else if (this.IncomingTask.RefType == "SRO") {
                this.IncomingTask.RefCode = "MREF004";                    
            }
            else if (this.IncomingTask.RefType == "REC") {
                //this.IncomingTask.RefNumber =
                //this.IncomingTask.RefCode = "MREF002"
            }

            if (this.IncomingTask.Action == "Receive") {
                this.IncomingTask.ActionCode = "TSK005";
            }
            else if (this.IncomingTask.Action == "Inspect") {
                this.IncomingTask.ActionCode = "TSK006";
            }
            else if (this.IncomingTask.Action == "Put-Away") {
                this.IncomingTask.ActionCode = "TSK008";
            }
            
            this.ItemStatusList.push({ "TypeLookUpID": 0, "TypeName": "test" });

        }
        else {
            //this.mrnActionInput.ActionCode = "TSK005";
            // this.mrnActionInput.RefTypeCode = "";
        }
        if (this.type == "index") {
            //this.CurrentMRNId = +params['ID'];
            //this.IsEditReceivingHidden = true;
        }
        else {
            // this.IsEditReceivingHidden = false;

            if (this.IncomingTask.RefType == "REC") {
                this.CurrentMRNId = this.IncomingTask.RefId;
            }
            else {
                this.CurrentMRNId = 0;
            }
        }

        //});

        if (this.localTask == undefined) {
            this.LoadAllGridDefinitions();
        }

        if (this.IncomingTask.RefNumber != undefined && this.tabMode != "manual")
            this.GetModuleWorkFlow(this.IncomingTask.RefType, this.IncomingTask.RefNumber);

        this.IsShowDiscrepancy = this.ShowPerMission('RR00033');

        this.mrnService.getTypeLookUpByName("RuleGroup").subscribe(rulegroup => {
            this.RuleGroup = rulegroup.recordsets[0];
        });
    }

    IsDiscrepancyLoadedChange() {
        this.IsDiscrepancyLoaded = this.IsDiscrepancyLoaded ? false : true;
    }

    LoadAllGridDefinitions() {

     this.gridOptionsOrderLog = {
            rowData: this.OrderLogs,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single',
            getNodeChildDetails: this.getNodeChildDetails,
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },
        }

        this.gridOptionsLines = {
            rowData: this.arrCurrentMRNLine,
            columnDefs: this.columnDefsLines,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            //rowModelType: 'pagination',
            //paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2,
            context: {
                componentParent: this
            }
        };


        this.PreviousLinesGridOptions = {
            rowData: [],
            columnDefs: this.PreviousLinescolumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single',
            suppressRowClickSelection: true,
            singleClickEdit:true,
            context: {
                componentParent: this
            }
        }

        this.ScannedSNGridOptions = {
            rowData: [],
            columnDefs: this.ScannedSNColumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        }

        this.TaskQueueGridOptions = {
            rowData: [],
            columnDefs: this.TaskQueueColumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single'
        }
    }

    CustomOnInit() {
        
        if (this.CurrentMRNId == 0) {            
            this.AddNewMRNHeader();
        }
        else {
            this.mrnService.load(this.CurrentMRNId).subscribe(result => {
                this.CurrentMRN = result[0][0];
                this.OrderLogs = result[2];
                if (this.OrderLogs && this.OrderLogs.length > 0) {
                    if (this.OrderLogs[0].recordset) {
                        this.OrderLogs = JSON.parse(this.OrderLogs[0].recordset);
                    } else {
                        this.OrderLogs = [];
                    }
                }
                //console.log(this.OrderLogs);
                this.CurrentMRN.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;

                if (this.IncomingTask.RefType == "REC") {
                    //  this.mrnActionInput.ReferenceNumber = this.CurrentMRN.RefrenceNumber;
                    this.IncomingTask.RefCode = this.CurrentMRN.MRNTypeCode;
                    // this.mrnActionInput.RefTypeCode = this.CurrentMRN.MRNTypeCode;
                }

                this.PopulateMRNLines();

                if (this.CurrentMRN.ModuleStatusMapID == this.LastNextStatusID) {
                    this.IsCurrentReceivingCompleted = true;
                }

            });

        }

        this.PopulateRefTypes();
        this.PopulateShipVia();
        this.PopulatePaymentTerms();
        this.PopulateCarriers();

        if (this.ShowPerMission('RC007'))
            this.PopulateItemStatuses();
        if (this.ShowPerMission('RR00033'))
            this.PopulateDiscrepancy();        
        if (this.ShowPerMission('RC010'))
            this.PopulateNodes();
        if (this.ShowPerMission('RC015'))
            this.PopulateLocation();
        if (this.ShowPerMission('RC006'))
            this.PopulateGrade();

        this.CreatePreviousLinesDynamicGrid();
    }

    AddNewMRNHeader() {
        this.CurrentMRN = new MRN();
        this.CurrentMRN.Id = 0;
        this.CurrentMRN.MRNNumber = "Auto Number";
        this.CurrentMRN.PaymentTermID = 0;
        this.CurrentMRN.ShipViaID = 0;
        this.CurrentMRN.MRNTypeID = 0;
        //this.CurrentMRN.CarrierID = 0;
        //this.CurrentMRN.ToPartnerName = this.partnerInfo[0].LogInUserPartnerName;
        //this.CurrentMRN.ToPartnerId = this.partnerInfo[0].LogInUserPartnerID;
        //this.CurrentMRN.ToPartnerAddress = this.partnerInfo[0].LogInUserPartnerAddress;
        //this.CurrentMRN.ToAddressId = this.partnerInfo[0].AddressID;
        //this.CurrentMRN.RefrenceNumber = this.IncomingTask.RefNumber;
        this.CurrentMRN.ActionCode = this.IncomingTask.ActionCode;
        this.CurrentMRN.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
        this.CurrentModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
        this.CurrentMRN.CreatedBy = this.partnerInfo[0].UserId;

        if (this.IncomingTask != null && this.IncomingTask.RefCode == "MREF001")
            this.GetPartnerDetailsByPO(this.IncomingTask);
        else if (this.IncomingTask != null && this.IncomingTask.RefCode == "MREF002")
            this.GetPartnerDetailsBySTO(this.IncomingTask);
        else if (this.IncomingTask != null && this.IncomingTask.RefCode == "MREF003")
            this.GetPartnerDetailsByIO(this.IncomingTask);
        //else if (this.IncomingTask != null && this.IncomingTask.RefCode == "MREF004")
        //    this.GetPartnerDetailsBySRO(this.IncomingTask);

        this.GetRefHeaderLines();

        //this.PopulateMRNActionInput(this.CurrentMRN);
    }

    GetModuleWorkFlow(reftype, refnumber) {
        this.mrnService.GetWorkflowID(reftype, refnumber).subscribe(_value => {
            this.PopulateActions(_value.recordsets[0][0]["WorkFlowID"]);
        });
    }

    PopulateActions(WorkFlowID: number) {
        //this.ReceivingActionList = [
        //    { "Id": 1, "name": "Receive" },
        //    { "Id": 2, "name": "Inspect" },
        //    { "Id": 3, "name": "Put Away" }
        //];

        this.mrnService.GetReceivingActions(WorkFlowID).subscribe(_actions => {
            // this.ReceivingActionList = _actions[0];

            var indexCurrentAction = 0;
            var currentActionCode = "";
            var i = 0;

            for (let entry of _actions[0]) {
                //console.log(entry); // 1, "string", false
                var obj: any = {}
                obj.ModuleWorkFlowDetailID = entry.ModuleWorkFlowDetailID;
                obj.ActionCode = entry.ActionCode;
                obj.ActionName = entry.ActionName;
                obj.CurrentStatusCode = entry.CurrentStatusCode;
                obj.CurrentStatusName = entry.CurrentStatusName;
                obj.NextStatusCode = entry.NextStatusCode;
                obj.NextStatusName = entry.NextStatusName;

                if (obj.ActionCode == this.IncomingTask.ActionCode) {
                    obj.IsActive = "1";
                    obj.Class = "active";
                    obj.IsEnable = true;
                    currentActionCode = obj.ActionCode;
                    this.CurrentReceivingAction = entry;
                    this.CurrentModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
                    indexCurrentAction = i;
                }
                else {
                    obj.IsActive = "0";

                    if (currentActionCode == "") {
                        obj.Class = "complete";
                        obj.IsEnable = false;
                    }
                }
                this.ReceivingActionList.push(obj);
                i = i + 1;
            }


            this.ReceivingActionRulesList = _actions[1];
            //this.mrnActionInput.Rules = this.ReceivingActionRulesList.filter(item => item.ActionCode == this.mrnActionInput.ActionCode);
            this.wizard = this.ReceivingActionList;


            //this.CurrentActionId = this.ReceivingActionList.filter(m => m.IsActive == "1")[0].Id;
            this.CurrentActionName = this.ReceivingActionList.filter(m => m.IsActive == "1")[0].ActionName;

            if (indexCurrentAction > 0) {
                //this.CurrentActionId = _actions[0][indexCurrentAction - 1].Id;
                this.PreviousModuleWorkFlowDetailID = _actions[0][indexCurrentAction - 1].ModuleWorkFlowDetailID;

            }

            //Calculate last moduleStatusMapID of this workflow/rec
            var count = _actions.length;
            //this.LastNextStatusID = _actions[0][count - 1].NextStatusID;
            var index = _actions[0].filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID);
            if (index.length > 0) {
                this.LastNextStatusID = index[0].NextStatusID;
            }

            this.CustomOnInit();
        }, error => this.errorMessage = <any>error);
    }

    AddSearchItems(data) {
        for (var i = 0; i <= data.length; i++) {
            var line = new MRNLine();
            line.Id = 0;
            line.ItemMasterID = data[i].ItemMasterID;
            line.ItemNumber = data[i].ItemNumber;
            line.ItemDescription = data[i].ItemDescription;
            line.SerialNumber = data[i].SerialNumber;
            line.PackageNumber = data[i].PackageNumber;            
            line.StatusID = data[i].StatusID;
            line.ItemStatusID = data[i].ItemStatusID;
            line.ItemStatus = data[i].ItemStatus;
            line.Status = data[i].Status;
            line.Remarks = data[i].Remarks;
            line.ContainerNumber = data[i].ContainerNumber;
            line.PendingQuantity = data[i].PendingQuantity;
            line.ReceiveType = data[i].ReceiveType;
            line.ShippingNumber = data[i].ShippingNumber;
            line.PreviousModuleWorkFlowDetailID = this.PreviousModuleWorkFlowDetailID;
            line.NodeID = data[i].NodeID;
            line.LocationID = data[i].LocationID;
            line.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
            line.Status = this.CurrentReceivingAction.NextStatusName;
            line.StatusCode = this.CurrentReceivingAction.NextStatusCode;
            line.ReferenceNumber = data[i].ReferenceNumber;
            line.RefType = data[i].RefType;
            line.CreatedDate = data[i].CreatedDate;
            line.FromPartner = data[i].FromPartner;
            line.FromPartnerId = data[i].FromAccountID;
            line.FromPartnerAddressId = data[i].FromPartnerAddressId;
            line.ToPartner = this.partnerInfo[0].LogInUserPartnerName;
            line.ToPartnerId = this.partnerInfo[0].LogInUserPartnerID;
            line.ToPartnerAddressId = this.partnerInfo[0].AddressID;
            line.BOLNumber = data[i].BillNumber;
            line.Source = data[i].RMASource;
            line.CarrierID = data[i].CarrierID;
            line.CarrierName = data[i].CarrierName;
            line.AttachedDocument = data[i].AttachedDocument;

            if (data[i].PendingQuantity != undefined && data[i].PendingQuantity > 0)
                line.Quantity = data[i].PendingQuantity;
            else
                line.Quantity = data[i].Quantity;

            if (this.ShowPerMission('RC006')) {
                line.PackageNumber = this.CurrentPackageNumber;
            }

            if (this.ShowPerMission('RC007')) {
                line.ItemStatusID = this.CurrentItemStatusId;                
            }

            if (this.ShowPerMission('RR00033')) {                
                if (this.IsDiscrepancyLoaded) {
                    line.DiscrepancyID = this.DiscrepancyID;
                    line.Discrepancy = this.DiscrepancyList.filter(f => f.TypeLookUpID == this.DiscrepancyID)[0].TypeName;
                    line.DiscrepancyRemark = this.DiscrepancyRemark;
                }
            }

            if (this.ShowPerMission('RC008')) {
                line.Remarks = this.CurrentRemarks;
            }

            if (this.ShowPerMission('RC009')) {
                line.ContainerNumber = this.CurrentContainerNumber;
            }

            if (this.ShowPerMission('RC010')) {
                line.NodeID = this.CurrentNodeId;
            }
            if (this.ShowPerMission('RC015')) {
                line.LocationID = this.CurrentLocationId;
            }

            var itemStatuses = this.ItemStatusList.filter(s => s.TypeLookUpID == this.CurrentItemStatusId);
            if (itemStatuses.length > 0) {
                line.ItemStatus = itemStatuses[0].TypeName;
            }
            var itemNodes = this.NodeList.filter(s => s.NodeID == this.CurrentNodeId);
            if (itemNodes.length > 0) {
                line.Node = itemNodes[0].Node;
            }
            var itemLocations = this.LocationList.filter(s => s.LocationID == this.CurrentLocationId);
            if (itemLocations.length > 0) {
                line.Location = itemLocations[0].LocationName;
            }
            if (this.IncomingTask.ActionCode = "TSK005")
                line.RefHeaderID = this.IncomingTask.RefId;
            //add new line to bottom grid
            this.arrCurrentMRNLine.push(line);

            var dataFiltered = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID);
            this.gridOptionsLines.api.setRowData(dataFiltered);

            //Remove from pending list.
            var index = this.PreviousLinesList.indexOf(data[i]);
            this.PreviousLinesList.splice(index, 1);
            this.TempPreviousLinesList.push(data[i]);
            this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
            this.CurrentScannedSN = null;
            this.IsPreviousLinesGridVisible = false;
            //if (this.PreviousLinesList.length == 0)
            //    this.IsPreviousLinesGridVisible = false;
        }        
    }

    OnSearch() {
        if (this.filterValue) {  
            
            //var SelectedData = this.arrCurrentMRNLine.filter(line => line.SerialNumber.toLowerCase() == this.filterValue.toLowerCase() || line.ShippingNumber.toLowerCase() == this.filterValue.toLowerCase() || line.ItemNumber.toLowerCase() == this.filterValue.toLowerCase());
            var SelectedData = this.arrCurrentMRNLine.filter(line => line.ShippingNumber.toLowerCase() == this.filterValue.toLowerCase());
            if (SelectedData.length > 0) {
                this._util.info("This item has already been added.", "info");                
            }
            else {                
                //var PendingData = this.PreviousLinesList.filter(line => line.SerialNumber.toLowerCase() == this.filterValue.toLowerCase() || line.ShippingNumber.toLowerCase() == this.filterValue.toLowerCase() || line.ItemNumber.toLowerCase() == this.filterValue.toLowerCase());
                var PendingData = this.PreviousLinesList.filter(line => line.ShippingNumber.toLowerCase() == this.filterValue.toLowerCase());
                if (PendingData.length > 0) {
                    this.IsPreviousLinesGridVisible = true;
                    this.PreviousLinesGridOptions.api.setRowData(PendingData);
                    //this.AddSearchItems(PendingData);

                    if (!this.ValidateLineItem()) {
                        this.filterValue = "";
                        this.IsPreviousLinesGridVisible = false;
                        return;
                    }
                    else {
                        this.filterValue = "";
                        this.IsPreviousLinesGridVisible = false;
                        for (var i = 0; i < PendingData.length; i++) {
                            this.EditClicked(PendingData[i], 'Select');
                        }
                        //this.EditClicked(PendingData[0], 'Select');
                    }                    
                }
                else {
                    this._util.warning("Invalid Item.", "warning");
                }
            }

            //var PendingData = this.PreviousLinesList.filter(line => line.SerialNumber.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1 || line.ShippingNumber.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1 || line.ItemNumber.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
            //if (PendingData.length > 0) {
            //    this.IsPreviousLinesGridVisible = true;
            //    this.PreviousLinesGridOptions.api.setRowData(PendingData);
            //    this.AddSearchItems(PendingData);
            //}
            //else {
            //    Toast.ShowAlertBox(1, "Alert", "Invalid Item.", 1);
            //}
        }
        else {
            this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
        }        
    }

    GetRefHeaderLines() {

        this.mrnService.GetRMALines(this.partnerInfo[0].UserId, this.partnerInfo[0].LogInUserPartnerID, this.IncomingTask.RefCode).subscribe(_data => {
            //this.ReceivingActionList = _actions[0];
            this.PreviousLinesList = _data;
            this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
        }, error => this.errorMessage = <any>error);
    }

    GetPartnerDetailsByPO(iTask: IncomingTask) {
        this.mrnService.GetPartnerDetailsByPO(iTask).subscribe(_data => {
            //this.ReceivingActionList = _actions[0];
            this.CurrentMRN.FromPartnerId = _data[0].PartnerID;
            this.CurrentMRN.FromPartnerName = _data[0].PartnerName;
            this.CurrentMRN.FromPartnerAddress = _data[0].FromAddress;
            this.CurrentMRN.FromAddressId = _data[0].FromAddressId;
            this.CurrentMRN.ShipViaID = _data[0].ShipViaTypeID; 
            this.CurrentMRN.PaymentTermID = _data[0].PayTermTypeID;
            this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine);
        }, error => this.errorMessage = <any>error);
    }

    GetPartnerDetailsBySTO(iTask: IncomingTask) {
        this.mrnService.GetPartnerDetailsBySTO(iTask).subscribe(_data => {
            //this.ReceivingActionList = _actions[0];
            this.CurrentMRN.FromPartnerId = _data[0].PartnerID;
            this.CurrentMRN.FromPartnerName = _data[0].PartnerName;
            this.CurrentMRN.FromPartnerAddress = _data[0].FromAddress;
            this.CurrentMRN.FromAddressId = _data[0].FromAddressId;
            this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine);
        }, error => this.errorMessage = <any>error);
    }

    GetPartnerDetailsByIO(iTask: IncomingTask) {
        this.mrnService.GetPartnerDetailsByIO(iTask).subscribe(_data => {
            //this.ReceivingActionList = _actions[0];
            this.CurrentMRN.FromPartnerId = _data[0].PartnerID;
            this.CurrentMRN.FromPartnerName = _data[0].PartnerName;
            this.CurrentMRN.FromPartnerAddress = _data[0].FromAddress;
            this.CurrentMRN.FromAddressId = _data[0].FromAddressId;
            this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine);
        }, error => this.errorMessage = <any>error);
    }
    //GetPartnerDetailsBySRO(iTask: IncomingTask) {
    //    this.mrnService.GetPartnerDetailsBySRO(iTask).subscribe(_data => {
    //        //this.ReceivingActionList = _actions[0];
    //        this.CurrentMRN.FromPartnerId = _data.recordsets[0][0].PartnerID;
    //        this.CurrentMRN.FromPartnerName = _data.recordsets[0][0].PartnerName;
    //        this.CurrentMRN.FromPartnerAddress = _data.recordsets[0][0].FromAddress;
    //        this.CurrentMRN.FromAddressId = _data.recordsets[0][0].FromAddressId;
    //        this.CurrentMRN.Source = _data.recordsets[0][0].Source;
    //        this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine);
    //    }, error => this.errorMessage = <any>error);
    //}

    PopulateMRNLines() {
        this.mrnService.GetLines(this.CurrentMRNId).subscribe(_lines => {
            //this.ReceivingActionList = _actions[0];
            this.arrCurrentMRNLine = _lines[0];
            this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine);
            //if (this.arrCurrentMRNLine.length > 0)
            //    this.mrnActionInput.RefTypeId = this.arrCurrentMRNLine[0].RefHeaderID;

            var dataFiltered = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID);
            this.gridOptionsLines.api.setRowData(dataFiltered);

            this.PreviousLinesList = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.PreviousModuleWorkFlowDetailID);
            this.RemoveLinesAlreadySelected(dataFiltered);
            this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);

        }, error => this.errorMessage = <any>error);
    }

    PopulateRefTypes() {
        this._config.getTypeLookUpByGroupName("MRNRefType").subscribe(_ConfigTypes => {
            this.RefTypeList = $.grep(_ConfigTypes, function (x) {
                return true;
            });
            //var index = this.RefTypeList.filter(item => item.TypeName.indexOf("PO") > 0);
            if (this.IncomingTask != null) {
                var item = this.RefTypeList.filter(item => item.TypeCode == this.IncomingTask.RefCode);

                if (item.length > 0) {
                    this.CurrentMRN.MRNTypeID = item[0].TypeLookUpID;
                    this.CurrentMRN.MRNTypeName = item[0].TypeName;
                }
            }
        }, error => this.errorMessage = <any>error);
    }

    PopulateShipVia() {
        this._config.getTypeLookUpByGroupName("ShipVia").subscribe(_ConfigTypes => {
            this.ShipViaList = $.grep(_ConfigTypes, function (x) {
                return true;
            });
        }, error => this.errorMessage = <any>error);
    }

    PopulatePaymentTerms() {
        this._config.getTypeLookUpByGroupName("PayTerms").subscribe(_ConfigTypes => {
            this.PaymentTermsList = $.grep(_ConfigTypes, function (x) {
                return true;
            });
        }, error => this.errorMessage = <any>error);
    }

    PopulateCarriers() {
        this.mrnService.GetCarriers(this.CurrentMRN.ToPartnerId).subscribe(_carrier => {
            this.CarriersList = $.grep(_carrier, function (x) {
                return true;
            });
        }, error => this.errorMessage = <any>error);
    }

    PopulateItemStatuses() {
        this.mrnService.GetAllStatusByType("ItemStatus").subscribe(returnvalue => {
            this.ItemStatusList = returnvalue;            
            this.IsItemStatusListLoaded = true;
        });        
    }

    PopulateDiscrepancy() {        
        this.mrnService.GetAllStatusByType("Discrepancy").subscribe(returnvalue => {
            this.DiscrepancyList = returnvalue;
        });
    }

    PopulateNodes() {
        this.mrnService.GetNodes().subscribe(returnvalue => {
            this.NodeList = returnvalue;
        });
    }

    PopulateGrade() {
        this.mrnService.GetGrade().subscribe(returnvalue => {
            
            this.GradeList = returnvalue;
            this.CurrentPackageNumber = "undefined";            
        });
    }

    PopulateLocation() {
        this.mrnService.GetLocationByPartner(this.partnerInfo[0].LogInUserPartnerID).subscribe(returnvalue => {
            this.LocationList = returnvalue;
        });
    }

    //PopulateMRNActionInput(mrn: MRN) {

    //    this.mrnActionInput.Id = this.IncomingTask.RefId;
    //    this.mrnActionInput.PartnerId = mrn.ToPartnerId;

    //    if (this.IncomingTask.RefType != "MRN") {
    //        this.mrnActionInput.ReferenceNumber = this.IncomingTask.RefNumber;
    //        this.mrnActionInput.RefTypeId = this.IncomingTask.RefId;
    //    }

    //    if (this.PreviousModuleWorkFlowDetailID != undefined || this.PreviousModuleWorkFlowDetailID) {
    //        this.mrnActionInput.PreviousLines = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.PreviousModuleWorkFlowDetailID);

    //    }




    //}

    onActionSelectionChanged() {


        //var selectedGridModuleWorkFlowDetailID = this.gridOptions.api.getSelectedRows()[0].ModuleWorkFlowDetailID;

        //var dataFiltered = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == selectedGridModuleWorkFlowDetailID);
        //this.gridOptionsLines.api.setRowData(dataFiltered);
    }

    selectPartner() {
        this._partner.open();
    }

    PartnerEvent(e) {
        this.CurrentMRN.FromPartnerId = e.PartnerID;
        this.CurrentMRN.FromPartnerName = e.PartnerName;
        this.FromAddressEnable = true;

        //this.columnDefsLines = this.columnDefsLines.splice(3);
        //this.gridOptionsLines.api.setColumnDefs(this.columnDefsLines);
        this._partner.close();

    }

    selectVendorAddress(type) {
        if (type == "To") {
            this.addressInput = new AddressInput();
            this.addressInput.MaptableName = "PartnerAddressMap";
            this.addressInput.MapTableColumn = "PartnerID";
            this.addressInput.MapColumnValue = this.CurrentMRN.ToPartnerId.toString();
            this._address.open();
        }
        else {
            if (this.CurrentMRN.FromPartnerId > 0) {
                this.addressInput = new AddressInput();
                this.addressInput.MaptableName = "PartnerAddressMap";
                this.addressInput.MapTableColumn = "PartnerID";
                this.addressInput.MapColumnValue = this.CurrentMRN.FromPartnerId.toString();
                this._address.open();
            }
            else
                this._popup.Alert('Alert', 'Item Info updated successfully.', false);
        }
        this.addressGridPopup = true;

    }

    onAddressSelect(e) {
        //console.log(event);
        this._address.close();
        this.addressGridPopup = false;

        if (this.CurrentMRN.FromPartnerId == e.PartnerID) {
            this.CurrentMRN.FromAddressId = e.PartnerAddressMapID;
            this.CurrentMRN.FromPartnerAddress = e.Address1 + "," + e.Address2 + "," + e.City + "," + e.StateName + "," + e.CountryName;
        }
        else if (this.CurrentMRN.ToPartnerId == e.PartnerID) {
            this.CurrentMRN.ToAddressId = e.PartnerAddressMapID;
            this.CurrentMRN.ToPartnerAddress = e.Address1 + "," + e.Address2 + "," + e.City + "," + e.StateName + "," + e.CountryName;
        }

    }

    onSubmit() {
        if (this.arrCurrentMRNLine.length > 0) {           

            var me: any = this;
            $.each(me.arrCurrentMRNLine, function (index, value) {               
                for (var i = 1; i < value.Quantity; i++) {                    
                    me.arrCurrentMRNLine.push(value);
                }                
            });

            $.each(me.arrCurrentMRNLine, function (index, value) {
                value.Quantity = 1;
            });

            this.CurrentMRN.MRNLines = this.arrCurrentMRNLine;
            this.CurrentMRN.CreatedBy = this.partnerInfo[0].UserId;

            if ((this.CurrentTask.RefType == "PO" || this.CurrentTask.RefType == "IO")) {

                var SNs = [];
                this.arrCurrentMRNLine.filter(g => g.ReceiveType == "Yes" && g.SerialNumber.length > 0).forEach(
                    (line) => {
                        SNs.push({ "SerialNumber": line.SerialNumber });
                    }
                );
                if (SNs.length > 0) {
                    this.mrnService.ValidateSN(SNs).subscribe(result => {
                        if (result[0].length > 0) {
                            var stringSN = "";
                            result[0].forEach(
                                (item) => {
                                    stringSN += item.SerialNumber + ",";
                                });
                            this._popup.Alert('Alert', "Below Serial Numbers already exists in system." + stringSN);
                        }
                        else {
                            this.SaveMRN();
                        }

                    });
                }
                else {
                    this.SaveMRN();
                }

            }
            else {
                this.SaveMRN();
            }
        }
        else {
            this._util.warning("Please select at least one item to receive.", "warning");   
        }


    }

    SaveMRN() {
        
        this.mrnService.SaveScanMRN(this.CurrentMRN).subscribe(returnvalue => {

            var me = this;
            var message = this.IncomingTask.Action;
            this._popup.Alert('Alert', returnvalue.MRNNumberList + ' ' + message+' added successfully.', function () {
                me.ScanVisibilityChange.emit(true);
            });
        });

        //console.log(this.CurrentMRN);
    }    

    onCancel() {
        this._global.TaskQue = null;
        this.indexLocalTask = null;
        this.ScanVisibilityChange.emit(false);
    }

    //OnAddMRNLine() {
    //    this.IsReceivingLoad = true;
    //    this.PopulateMRNActionInput(this.CurrentMRN);
    //    this._Receiving.open();
    //}

    ValidateLineItem() {
        
        if (this.ShowPerMission('RC007')) {
            
            if (this.CurrentItemStatusId == undefined || isNaN(this.CurrentItemStatusId)) {
                this._util.info("Enter Input Item Conditions.", "info");
                return false;
            }
        } 

        if (this.ShowPerMission('RC006')) {
            if (this.CurrentPackageNumber.length < 1 || this.CurrentPackageNumber == "undefined") {
                this._util.info("Enter Grade.","info");
                return false;
            }
        }               

        if (this.ShowPerMission('RC009')) {
            if (this.CurrentContainerNumber.length < 1) {
                this._util.info("Enter Input Temporary Container Number.", "info");
                return false;
            }
        }

        if (this.ShowPerMission('RC010')) {
            if (typeof this.CurrentNodeId === undefined || isNaN(this.CurrentNodeId)) {
                this._util.info("Select Sub-Inventory Code.", "info");
                return false;
            }
        }
        if (this.ShowPerMission('RC015')) {
            if (typeof this.CurrentLocationId === undefined || isNaN(this.CurrentLocationId)) {
                this._util.info("Select Location.", "info");
                return false;
            }
        }

        if (this.ShowPerMission('RR00033')) {
            if (this.IsDiscrepancyLoaded) {                
                if (typeof this.DiscrepancyID === undefined || isNaN(this.DiscrepancyID)) {

                    this._util.info("Select Discrepancy.", "info");
                    return false;
                }

                if (this.DiscrepancyRemark == undefined || this.DiscrepancyRemark.length < 1) {
                    this._util.info("Enter Discrepancy Remark.", "info");
                    return false;
                }
            }            
        }

        return true;
    }

    //ItemScaned() {
    //    var item = this.PreviousLinesList.filter(f => f.ItemNumber == this.CurrentScannedSN || f.SerialNumber == this.CurrentScannedSN)[0]
    //    if (item)
    //        this.EditClicked(item, 'Select');
    //    else {            
    //        var existingitem = this.arrCurrentMRNLine.filter(f => f.ItemNumber == this.CurrentScannedSN || f.SerialNumber == this.CurrentScannedSN)[0]
    //        if (existingitem) {
    //            this._popup.Alert("Alert", "Item already added.");
    //        }
    //        else {
    //            this._popup.Alert("Alert", "Invalid Item.");
    //        }
    //        this.CurrentScannedSN = null;
    //    }
    //}

    //OpenAccessoriesPopUp(ItemModelID) {
    //    this.mrnService.loadAllAccessories(ItemModelID).subscribe(returnvalue => {
    //        this.AccessoriesList = returnvalue[0];            
    //        if (this.AccessoriesList.length > 0) {
    //            this._accessoriesModel.open();
    //        }            
    //    });
    //}

    //onAccessoriesChange(MapId) {        
    //    alert($('#ModelAccessories').val());
    //}

    AddSelectedLine(data) {
        var line = new MRNLine();
        line.Id = 0;
        line.ItemMasterID = data.ItemMasterID;
        line.ItemNumber = data.ItemNumber;
        line.ItemDescription = data.ItemDescription;
        line.SerialNumber = data.SerialNumber;

        line.PackageNumber = data.PackageNumber;
        line.StatusID = data.StatusID;
        line.ItemStatusID = data.ItemStatusID;
        line.ItemStatus = data.ItemStatus;
        line.Status = data.Status;
        line.Remarks = data.Remarks;
        line.ContainerNumber = data.ContainerNumber;
        line.PendingQuantity = data.PendingQuantity;
        line.ReceiveType = data.ReceiveType;
        line.ShippingNumber = data.ShippingNumber;
        line.PreviousModuleWorkFlowDetailID = this.PreviousModuleWorkFlowDetailID;
        line.NodeID = data.NodeID;
        line.LocationID = data.LocationID;
        line.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
        line.Status = this.CurrentReceivingAction.NextStatusName;
        line.StatusCode = this.CurrentReceivingAction.NextStatusCode;
        line.ReferenceNumber = data.ReferenceNumber;
        line.RefType = data.RefType;
        line.CreatedDate = data.CreatedDate;
        line.FromPartner = data.FromPartner;
        line.FromPartnerId = data.FromAccountID;
        line.FromPartnerAddressId = data.FromPartnerAddressId;
        line.ToPartner = this.partnerInfo[0].LogInUserPartnerName;
        line.ToPartnerId = this.partnerInfo[0].LogInUserPartnerID;
        line.ToPartnerAddressId = this.partnerInfo[0].AddressID;
        line.BOLNumber = data.BillNumber;
        line.Source = data.RMASource;
        line.CarrierID = data.CarrierID;
        line.CarrierName = data.CarrierName;

        line.ReturnReasonType = data.ReturnReasonType;
        line.FromAccountID = data.FromAccountID;
        line.ReturnReasonID = data.ReturnReasonID;
        line.SalesReturnOrderDetailID = data.SalesReturnOrderDetailID;
        line.ItemModelID = data.ItemModelID;
        line.ModelName = data.ModelName;
        line.SerialQuantity = data.SerialQuantity;
        line.SONumber = data.SONumber;
        line.ReturnReason = data.ReturnReason;
        line.StatusName = data.StatusName;
        line.AttachedDocument = data.AttachedDocument;

        if (data.PendingQuantity != undefined && data.PendingQuantity > 0)
            line.Quantity = data.PendingQuantity;
        else
            line.Quantity = data.Quantity;

        if (this.ShowPerMission('RC006')) {
            line.PackageNumber = this.CurrentPackageNumber;
        }
        else {
            line.PackageNumber = "N/A";
        }

        if (this.ShowPerMission('RC007')) {
            line.ItemStatusID = this.CurrentItemStatusId;
            line.ItemConditions = this.ItemStatusList.filter(f => f.TypeLookUpID == this.CurrentItemStatusId)[0].TypeName;
        }
        else {
            line.ItemConditions = "N/A";
        }

        if (this.ShowPerMission('RC009')) {
            line.ContainerNumber = this.CurrentContainerNumber;
        }
        else {
            line.ContainerNumber = "N/A";
        }

        if (this.ShowPerMission('RC010')) {
            line.NodeID = this.CurrentNodeId;
            line.SubInventory = $("#Node option:selected").text();
        }
        else {
            line.SubInventory = "N/A";
        }

        if (this.ShowPerMission('RC015')) {
            line.LocationID = this.CurrentLocationId;
            line.Location = $("#Location option:selected").text();
        }
        else {
            line.Location = "N/A";
        }

        if (this.ShowPerMission('RC008')) {
            line.Remarks = this.CurrentRemarks;
        }
        else {
            line.Remarks = "N/A";
        }

        if (this.ShowPerMission('RR00033')) {
            if (this.IsDiscrepancyLoaded) {
                line.DiscrepancyID = this.DiscrepancyID;
                if (typeof this.DiscrepancyID !== 'undefined' && this.DiscrepancyID != undefined) {
                    line.Discrepancy = this.DiscrepancyList.filter(f => f.TypeLookUpID == this.DiscrepancyID)[0].TypeName;
                    line.DiscrepancyRemark = this.DiscrepancyRemark;
                }
                else {
                    //line.Discrepancy = "N/A";
                    line.DiscrepancyRemark = "N/A";
                }
            }
        }

        if (this.ShowPerMission('RR00035')) {
                       
            //$("#ModelAccessories option:selected").each(function () {
            //    AccessoriesName = AccessoriesName + $(this).text() + ",";
            //});

            var AccessoriesName = "";
            var AccessoriesID = "";
            $.each(this.SelectedAccessories, function (i, v) {
                if (AccessoriesName == "") {
                    AccessoriesName = v.Name;
                    AccessoriesID = v.ID;
                }
                else {
                    AccessoriesName = AccessoriesName + "," + v.Name;
                    AccessoriesID = AccessoriesID + "," + v.ID;
                }
            });

            line.AccessoriesName = AccessoriesName;
            line.AccessoriesID = AccessoriesID;
        }
        else {
            line.AccessoriesID = "";
            line.AccessoriesName = "N/A";
        }

        var itemStatuses = this.ItemStatusList.filter(s => s.TypeLookUpID == this.CurrentItemStatusId);
        if (itemStatuses.length > 0) {
            line.ItemStatus = itemStatuses[0].TypeName;
        }
        var itemNodes = this.NodeList.filter(s => s.NodeID == this.CurrentNodeId);
        if (itemNodes.length > 0) {
            line.Node = itemNodes[0].Node;
        }
        var itemLocations = this.LocationList.filter(s => s.LocationID == this.CurrentLocationId);
        if (itemLocations.length > 0) {
            line.Location = itemLocations[0].LocationName;
        }
        if (this.IncomingTask.ActionCode = "TSK005")
            line.RefHeaderID = this.IncomingTask.RefId;

        //add new line to bottom grid
        this.arrCurrentMRNLine.push(line);

        var dataFiltered = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID);
        this.gridOptionsLines.api.setRowData(dataFiltered);


        //remove  line from top grid
        var index = this.PreviousLinesList.indexOf(data);
        this.PreviousLinesList.splice(index, 1);
        this.TempPreviousLinesList.push(data);
        this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
        this.CurrentScannedSN = null;
        if (this.PreviousLinesList.length == 0)
            this.IsPreviousLinesGridVisible = false;
    }

    SelectAccessories(AccessoryID, checked, AccessoryName) {

        var me = this;

        var index = me.SelectedAccessories.filter(f => f.ID == AccessoryID);
        if (checked) {
            if (index.length == 0) {
                var data = { ID: AccessoryID, Name: AccessoryName };
                me.SelectedAccessories.push(data);
            }
        }
        else {

            $.each(me.SelectedAccessories, function (i, v) {
                if (v.ID == AccessoryID) {
                    me.SelectedAccessories.splice(i, 1);
                    return false;;
                }
            });
        }
    }

    AddAccessories() {

        if (this.SelectedAccessories.length > 0) {
            this._accessoriesModel.close();
            this.AddSelectedLine(this.SelectedData);            
        }
        else {
            this._util.warning('Select atleast one accessories.', 'warning');
        }
                
        //if ($('#ModelAccessories').val() != null) {
        //    this.ItemAccessories = $('#ModelAccessories').val().toString();
        //    this._accessoriesModel.close();
        //    this.AddSelectedLine(this.SelectedData);
        //}
        //else {
        //    Toast.errorToast('Select atleast one accessories.');           
        //}
    }

    EditClicked(data, Action) {

        this.SelectedData = data;
        this.SelectedAccessories = [];

        if (Action == 'Select') {
            if (!this.ValidateLineItem()) {
                return;
            }

            if (this.ShowPerMission('RR00035')) {
                this.mrnService.loadAllAccessories(data.ItemModelID).subscribe(returnvalue => {
                    this.AccessoriesList = returnvalue[0];
                    if (this.AccessoriesList.length > 0) {
                        this._accessoriesModel.open();
                    }
                    else {
                        //this.ItemAccessories = "";
                        this.AddSelectedLine(data);
                    }
                });
            }
            else {
                //this.ItemAccessories = "";
                this.AddSelectedLine(data);
            }
        }
        else if (Action == 'Remove') {
            if (this.IsCurrentReceivingCompleted == true) {
                this._popup.Alert("Alert", "This receiving is already closed,cannot be deleted now");
                return;
            }

            if (data.Id == 0) {
                //remove  line from bottom grid
                var index = this.arrCurrentMRNLine.indexOf(data);
                this.arrCurrentMRNLine.splice(index, 1);
                this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID));

                //add  line back to top grid
                var deletedLine = this.TempPreviousLinesList.filter(g => g.ItemMasterID == data.ItemMasterID)[0];

                //if (this.PreviousLinesList.filter(g => g.ItemMasterID == deletedLine.ItemMasterID).length == 0) {
                //    this.PreviousLinesList.push(deletedLine);
                //}
                //else {

                //}
                if (this.PreviousLinesList.filter(g => g.SalesReturnOrderDetailID == deletedLine.SalesReturnOrderDetailID).length == 0) {
                    this.PreviousLinesList.push(deletedLine);
                }
                else {

                }
                this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
            }
            else {
                this._popup.Alert("Alert", "This item is already processed[" + data.Status + "],cannot be deleted now");
            }

            if (this.arrCurrentMRNLine.length == 0)
                this.IsPreviousLinesGridVisible = true;
        }
        else if (Action == 'ShippingNumber') {
            this.TrackShipment(data);
        }
    }

    SelectPreviousLineItem(e) {       
                
        //$("#partWizardstepIdTSK005").class = "complete";
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");

            //if (!this.ValidateLineItem())
            //    return;


            if (actionType === "selectPreviousLineItem") {
                if (data.ReceiveType == "Yes" && data.SerialNumber == undefined) {
                    this.CurrentPreviousLine = data;

                    //resetting data;
                    this.CurrentScannedSN = "";
                    this.ScannedSNList = [];
                    this.ScannedSNGridOptions.api.setRowData(this.ScannedSNList);

                    this._modalScanSN.open();
                    this.CurrentPreviousLineAddedSNCount = this.arrCurrentMRNLine.filter(g => g.ItemMasterID == this.CurrentPreviousLine.ItemMasterID).length;

                }
                else {


                    var line = new MRNLine();
                    line.Id = 0;
                    line.ItemMasterID = data.ItemMasterID;
                    line.ItemNumber = data.ItemNumber;
                    line.ItemDescription = data.ItemDescription;
                    line.SerialNumber = data.SerialNumber;

                    line.PackageNumber = data.PackageNumber;
                    line.StatusID = data.StatusID;
                    line.ItemStatusID = data.ItemStatusID;
                    line.ItemStatus = data.ItemStatus;
                    line.Status = data.Status;
                    line.Remarks = data.Remarks;
                    line.ContainerNumber = data.ContainerNumber;
                    line.PendingQuantity = data.PendingQuantity;
                    line.ReceiveType = data.ReceiveType;
                    line.PreviousModuleWorkFlowDetailID = this.PreviousModuleWorkFlowDetailID;
                    line.NodeID = data.NodeID;
                    line.LocationID = data.LocationID;
                    line.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
                    line.Status = this.CurrentReceivingAction.NextStatusName;
                    line.StatusCode = this.CurrentReceivingAction.NextStatusCode;
                    line.ReferenceNumber = this.IncomingTask.RefNumber;
                    line.AttachedDocument = data.AttachedDocument;

                    if (data.PendingQuantity != undefined && data.PendingQuantity > 0)
                        line.Quantity = data.PendingQuantity;
                    else
                        line.Quantity = data.Quantity;

                    if (this.ShowPerMission('RC006')) {
                        line.PackageNumber = this.CurrentPackageNumber;
                        
                    }
                    if (this.ShowPerMission('RC007')) {
                        line.ItemStatusID = this.CurrentItemStatusId;                        
                    }

                    if (this.ShowPerMission('RR00033')) {                        
                        if (this.IsDiscrepancyLoaded) {
                            line.DiscrepancyID = this.DiscrepancyID;
                            line.Discrepancy = this.DiscrepancyList.filter(f => f.TypeLookUpID == this.DiscrepancyID)[0].TypeName;
                            line.DiscrepancyRemark = this.DiscrepancyRemark;
                        }
                    }

                    if (this.ShowPerMission('RC008')) {
                        line.Remarks = this.CurrentRemarks;
                    }

                    if (this.ShowPerMission('RC009')) {
                        line.ContainerNumber = this.CurrentContainerNumber;
                    }

                    if (this.ShowPerMission('RC010')) {
                        line.NodeID = this.CurrentNodeId;
                    }
                    if (this.ShowPerMission('RC015')) {
                        line.LocationID = this.CurrentLocationId;
                    }
                    
                    var itemStatuses = this.ItemStatusList.filter(s => s.TypeLookUpID == this.CurrentItemStatusId);
                    if (itemStatuses.length > 0) {
                        line.ItemStatus = itemStatuses[0].TypeName;
                    }
                    var itemNodes = this.NodeList.filter(s => s.NodeID == this.CurrentNodeId);
                    if (itemNodes.length > 0) {
                        line.Node = itemNodes[0].Node;
                    }
                    var itemLocations = this.LocationList.filter(s => s.LocationID == this.CurrentLocationId);
                    if (itemLocations.length > 0) {
                        line.Location = itemLocations[0].LocationName;
                    }
                    if (this.IncomingTask.ActionCode = "TSK005")
                        line.RefHeaderID = this.IncomingTask.RefId;
                    //add new line to bottom grid
                    this.arrCurrentMRNLine.push(line);

                    var dataFiltered = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID);
                    this.gridOptionsLines.api.setRowData(dataFiltered);


                    //remove  line from top grid
                    var index = this.PreviousLinesList.indexOf(data);
                    this.PreviousLinesList.splice(index, 1);
                    this.TempPreviousLinesList.push(data);
                    this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);

                }
            }

        }
        this.CurrentScannedSN = null;
        if (this.PreviousLinesList.length == 0)
            this.IsPreviousLinesGridVisible = false;

    }

    RowClickMainGrid(e) {
        var control = $("input:focus");
        if (control && control.length > 0) {
            this.CurrentScannedSN = null;
            return;
        }
        //$("#partWizardstepIdTSK005").class = "complete";
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");

            if (this.IsCurrentReceivingCompleted == true) {
                this._popup.Alert("Alert", "This receiving is already closed,cannot be deleted now");
                return;
            }
                
            if (actionType === "deleteMainGridItem") {

                if (data.Id == 0) {
                    //remove  line from bottom grid
                    var index = this.arrCurrentMRNLine.indexOf(data);
                    this.arrCurrentMRNLine.splice(index, 1);
                    this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID));

                    //add  line back to top grid
                    var deletedLine = this.TempPreviousLinesList.filter(g => g.ItemMasterID == data.ItemMasterID)[0];

                    if (this.PreviousLinesList.filter(g => g.ItemMasterID == deletedLine.ItemMasterID).length == 0) {
                        this.PreviousLinesList.push(deletedLine);
                    }
                    else {

                    }
                    this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
                }
                else {
                    this._popup.Alert("Alert", "This item is already processed["+data.Status+"],cannot be deleted now");
                }

                if (this.arrCurrentMRNLine.length == 0)
                    this.IsPreviousLinesGridVisible = true;
            }

        }

    }

    //RowClickedScannedSN(e) {
    //    if (e.event.target !== undefined) {
    //        let data = e.data;
    //        let actionType = e.event.target.getAttribute("Id");

    //        if (actionType === "deleteScannedSN") {
    //            var index = this.ScannedSNList.indexOf(data);
    //            this.ScannedSNList.splice(index, 1);
    //            this.ScannedSNGridOptions.api.setRowData(this.ScannedSNList);
    //        }
    //    }
    //}

    //RestoreDeletedPreviousLine() {
    //}

    //CloseAddScannedSNPopup() {
    //    for (let SN of this.ScannedSNList) {
    //        var line = new MRNLine();
    //        line.Id = 0;
    //        line.ItemMasterID = this.CurrentPreviousLine.ItemMasterID;
    //        line.ItemNumber = this.CurrentPreviousLine.ItemNumber;
    //        line.ItemDescription = this.CurrentPreviousLine.ItemDescription;
    //        line.SerialNumber = SN.SerialNumber;
    //        line.ReceiveType = this.CurrentPreviousLine.ReceiveType;
    //        line.Quantity = 1;
    //        line.PackageNumber = this.CurrentPackageNumber;
    //        line.StatusID = this.CurrentPreviousLine.StatusID;
    //        line.Status = this.CurrentPreviousLine.Status;
    //        line.Remarks = this.CurrentPreviousLine.Remarks;
    //        line.ContainerNumber = this.CurrentPreviousLine.ContainerNumber;
    //        line.NodeID = this.CurrentPreviousLine.NodeID;
    //        line.Node = this.CurrentPreviousLine.Node;
    //        line.LocationID = this.CurrentPreviousLine.LocationID;
    //        line.Location = this.CurrentPreviousLine.Location;
    //        line.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
    //        line.Status = this.CurrentReceivingAction.NextStatusName;
    //        line.StatusCode = this.CurrentReceivingAction.NextStatusCode;
    //        line.ReferenceNumber = this.IncomingTask.RefNumber;

    //        if (this.IncomingTask.ActionCode = "TSK005")
    //            line.RefHeaderID = this.IncomingTask.RefId;

    //        this.arrCurrentMRNLine.push(line);
    //        this.gridOptionsLines.api.setRowData(this.arrCurrentMRNLine);
    //    }

    //    this.CurrentScannedSN = "";
    //    this.ScannedSNList = [];
    //    this.ScannedSNGridOptions.api.setRowData(this.ScannedSNList);

    //    if (this.CurrentPreviousLine.Quantity == this.arrCurrentMRNLine.filter(g => g.ItemMasterID == this.CurrentPreviousLine.ItemMasterID).length) {
    //        //remove  line from top grid
    //        var index = this.PreviousLinesList.indexOf(this.CurrentPreviousLine);
    //        this.PreviousLinesList.splice(index, 1);
    //        this.TempPreviousLinesList.push(this.CurrentPreviousLine);
    //        this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);

    //    }

    //    this._modalScanSN.dismiss();
    //}

    //OnAddScannedSN() {
    //    var filtered = this.ScannedSNList.filter(item => item.SerialNumber == this.CurrentScannedSN);
    //    var filteredBottomGrid = this.arrCurrentMRNLine.filter(g => g.ReceiveType == "Yes" && g.SerialNumber.length > 0 && g.SerialNumber == this.CurrentScannedSN);

    //    if (filteredBottomGrid.length > 0) {
    //        this._popup.Alert('Alert', this.CurrentScannedSN + ' has already been added earlier', function () {
    //            return;
    //        });
    //    }

    //    var maxqty = this.CurrentPreviousLine.PendingQuantity;
    //    this.CurrentPreviousLineAddedSNCount = this.arrCurrentMRNLine.filter(g => g.ItemMasterID == this.CurrentPreviousLine.ItemMasterID).length;
    //    if (filtered.length == 0 && filteredBottomGrid.length==0 && this.ScannedSNList.length + this.CurrentPreviousLineAddedSNCount < maxqty) {
    //        this.ScannedSNList.push({ "SerialNumber": this.CurrentScannedSN });
    //        this.ScannedSNGridOptions.api.setRowData(this.ScannedSNList);
    //    }

    //}

    ClickSelectLineItemsAccordian(form: any) {
        for (var i in form.controls) {
            form.controls[i].markAsTouched();
        }
        if (this.PreviousLinesList.length > 0) {
            this.IsPreviousLinesGridVisible = !this.IsPreviousLinesGridVisible;
            $("#partWizard").wizard();
        }
        else {
            this.IsPreviousLinesGridVisible = false;
            this._util.info("No item is available.", "info");
        }
    }

    GetPreviousLinesGridVisiblity(form: any) {
        for (var i in form.controls) {
            form.controls[i].markAsTouched();
        }

        return this.IsPreviousLinesGridVisible;
    }

    ShowPerMission(RuleCode: string): boolean {

        if (this.IsCurrentReceivingCompleted == true)
            return false;

        if (typeof (this.ReceivingActionRulesList) == 'undefined') {
            return false;
        }
        else {
            //var index = this.ReceivingActionRulesList.findIndex(x => x.RuleCode == RuleCode && x.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID)
            //if (index >= 0) {
            var index = this.ReceivingActionRulesList.filter(line => line.RuleCode == RuleCode && line.ModuleWorkFlowDetailID == this.CurrentModuleWorkFlowDetailID);
            if (index.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }

    }


    CreatePreviousLinesDynamicGrid() {

        //if (this.ShowPerMission('RC006')) {
        //    this.PreviousLinescolumnDefs.push({
        //        headerName: "Is Serializable",
        //        width: 200,
        //        field: "ReceiveType",

        //    })

        //    this.PreviousLinescolumnDefs.push({
        //        headerName: "Pending Quantity",
        //        width: 200,
        //        field: "PendingQuantity",

        //    })
        //}
        

        //if (this.PreviousModuleWorkFlowDetailID != 0) {

        //    this.PreviousLinescolumnDefs.push({
        //        headerName: "Serial#",
        //        width: 200,
        //        field: "SerialNumber"

        //    })
        //    this.PreviousLinescolumnDefs.push({
        //        headerName: "Status",
        //        width: 200,
        //        field: "Status"

        //    })
        //}

        if (this.ShowPerMission("RC007")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Item Conditions",
                width: 200,
                field: "ItemConditions"

            });

            this.columnDefsLines.push({
                headerName: "Item Conditions",
                width: 200,
                field: "ItemConditions"

            });
        }

        if (this.ShowPerMission("RC006")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Grade",
                width: 200,
                field: "PackageNumber"

            });

            this.columnDefsLines.push({
                headerName: "Grade",
                width: 200,
                field: "PackageNumber"

            });
        }

        if (this.ShowPerMission("RC009")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Container #",
                width: 150,
                field: "ContainerNumber"

            });

            this.columnDefsLines.push({
                headerName: "Container #",
                width: 150,
                field: "ContainerNumber"

            });
        }

        if (this.ShowPerMission("RC010")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Sub-Inventory",
                width: 150,
                field: "SubInventory"

            });

            this.columnDefsLines.push({
                headerName: "Sub-Inventory",
                width: 150,
                field: "SubInventory"

            });
        }

        if (this.ShowPerMission("RC015")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Location",
                width: 150,
                field: "Location"

            });

            this.columnDefsLines.push({
                headerName: "Location",
                width: 150,
                field: "Location"

            });
        }

        if (this.ShowPerMission("RC008")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Remarks",
                width: 150,
                field: "Remarks"

            });

            this.columnDefsLines.push({
                headerName: "Remarks",
                width: 150,
                field: "Remarks"

            });
        }

        if (this.ShowPerMission("RR00033")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Discrepancy",
                width: 150,
                field: "Discrepancy"

            });

            this.columnDefsLines.push({
                headerName: "Discrepancy",
                width: 150,
                field: "Discrepancy"

            });
        }

        if (this.ShowPerMission("RR00033")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Discrepancy Remark",
                width: 250,
                field: "DiscrepancyRemark"

            });

            this.columnDefsLines.push({
                headerName: "Discrepancy Remark",
                width: 250,
                field: "DiscrepancyRemark"

            });
        }

        if (this.ShowPerMission("RR00035")) {
            this.PreviousLinescolumnDefs.push({
                headerName: "Accessories",
                width: 250,
                field: "AccessoriesName"

            });

            this.columnDefsLines.push({
                headerName: "Accessories",
                width: 250,
                field: "AccessoriesName"

            });
        }

        this.PreviousLinesGridOptions.api.setColumnDefs(this.PreviousLinescolumnDefs);
        this.gridOptionsLines.api.setColumnDefs(this.columnDefsLines);
    }

    RemoveLinesAlreadySelected(dataFiltered) {

        for (var row of dataFiltered) {
            var temp = this.PreviousLinesList.filter(g => g.ItemMasterID == row.ItemMasterID && g.ModuleWorkFlowDetailID == this.PreviousModuleWorkFlowDetailID && g.Quantity == row.Quantity);
            if (temp.length > 0) {
                var index = this.PreviousLinesList.indexOf(temp[0]);

                if (index != -1) {
                    this.PreviousLinesList.splice(index, 1);
                    this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
                }
            }
        }
    }

    PopulateTaskQueue() {

    }

    SelectRefHeaderFromTaskQueue(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");

            if (actionType === "selectRef") {
                this.localTask = new IncomingTask();
                this.localTask.RefID = data.RefID;
                this.localTask.RefNumber = data.RefNumber;
                this.localTask.RefType = data.RefType;
                this.localTask.Task = data.Task;

                this.ngOnInit();
            }

            this._modalTaskQueue.close();
        }
    }

    ShowOrderLog() {
        this._modalOrderLog.open();
        this.gridOptionsOrderLog.api.setRowData(this.OrderLogs);
    }

    onOpenTaskQueue() {
        this.mrnService.GetRefsFromTaskQueue(0, 100, null, null, 'Receive', this.partnerInfo[0].LogInUserPartnerID, this.partnerInfo[0].UserId).subscribe(_data => {
            this.TaskQueueList = _data.recordsets[0];
            this.TaskQueueGridOptions.api.setRowData(this.TaskQueueList);
            this._modalTaskQueue.open();
        }, error => this.errorMessage = <any>error);
    }

    onTaskTabClick(e) {
        //this.CurrentTask.Task = e;
        //this.tabMode = "manual";
        //this.ngOnInit();
        //var dataFiltered = this.arrCurrentMRNLine.filter(line => line.ModuleWorkFlowDetailID == 1486);
        //this.gridOptionsLines.api.setRowData(dataFiltered);
    }

    //Attached Document Popup code
    CloseItemPopup() {
        $('#divItemPopup').modal('hide');
    }

    EditImageClicked(item) {

        var me: any = this;        
        var ReturnReasonType = item.ReturnReasonType;
        var PartnerID = item.FromAccountID;
        var ReturnReasonID = item.ReturnReasonID;
        var SalesReturnOrderDetailID = item.SalesReturnOrderDetailID;
        var ItemModelID = item.ItemModelID;
        var Quantity = item.Quantity;
        me.SelectedItemNumber = item.ItemNumber;
        me.SelectedItemName = item.ItemDescription;

        if (ReturnReasonType == "Account") {
            me.mrnService.loadDynamicControls(ReturnReasonID, PartnerID, SalesReturnOrderDetailID, Quantity, 0).subscribe(returnvalue => {

                var viewableData = returnvalue[0];
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                $('#divItemPopup').modal('show');

            }, error => {

            });
        }
        else {
            me.mrnService.loadDynamicControlsModelWise(ReturnReasonID, ItemModelID, SalesReturnOrderDetailID, Quantity, 0).subscribe(returnvalue => {

                var viewableData = returnvalue[0];
                me.SetDynamicControl(viewableData);
                me.SetGraphLocation();

                $('#divItemPopup').modal('show');

            }, error => {

            });
        }
    }

    SetDynamicControl(viewableData) {

        var me: any = this; 

        me.PendingArtifactsList = [];
        me.DynamicControls = [];

        $.each(viewableData, function (i, v) {
            if (v.ControlType == "File") {

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
                    me.PendingArtifactsList.push(Artifact);

                });
            }

        });

        console.log(me.PendingArtifactsList);

        $.each(viewableData, function (i, v) {
            if (v.DropDownValue != "" && v.DropDownValue != null) {
                v.DropDownValue = JSON.parse(v.DropDownValue);
            }
            if (v.ControlType == 'File') {
                v.ControlValue = "";
            }
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
    }

    ChangeView(frm, to, direction) {

        if (direction == 'right') {
            $("." + to).show();
            $("." + frm).hide();
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

    SelectUnSelectLocation(id) {
        //if ($("#" + id).attr("class").indexOf("insetShadow") >= 0) {

        //    $("#" + id).removeClass("insetShadow");

        //    for (let c of this.SelectedDamageGraphLocations) {
        //        if (c.name == id) {
        //            var indx = this.SelectedDamageGraphLocations.map(function (e) { return e; }).indexOf(c);
        //            this.SelectedDamageGraphLocations.splice(indx, 1);
        //        }
        //    }
        //}
        //else {
        //    var graphData = { name: id };
        //    this.SelectedDamageGraphLocations.push(graphData);
        //    $("#" + id).addClass("insetShadow");
        //}
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

    TrackShipment(val) {
        if (val.ShippingNumber) {
            if (val.CarrierName.toUpperCase() == "UPS") {
                var a = $("<a>")
                    .attr("href", "http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber1=" + val.ShippingNumber + "&track.x=0&track.y=0")
                    .attr("target", "_blank")
                    .attr("download", "img.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
            }
            else if (val.CarrierName.toUpperCase() == "FEDEX") {
                var a = $("<a>")
                    .attr("href", "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" + val.AWBNumber)
                    .attr("target", "_blank")
                    .attr("download", "img.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
            }
        }
    }    
}