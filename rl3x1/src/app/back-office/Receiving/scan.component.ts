import { Component, ViewChild, Input, Output, ChangeDetectorRef } from '@angular/core';
import { MRNService } from '../Receiving/receiving.service';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { MRN, MRNLine, MRNActionInput, IncomingTask, PendingArtifacts, ReceivingAction, MRNHeader } from './receiving.model'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MetadataService } from '../MetadataConfig/metadata-config.Service.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { BsModalComponent } from 'ng2-bs3-modal'
import { message, modal } from '../../controls/pop/index.js';
import { AddressInput } from '../../shared/address.model';
import { EventEmitter } from '@angular/core';
import { EditComponent } from '../../shared/edit.component'
import { LocationService } from '../Location/Location.Service';
import { Location, LocationStructure } from '../Location/Location.model.js';
import { DynamicLocation } from '../Receiving/DynamicLocation.component';
import { Property, TypedJson, Util } from '../../app.util';
import { EditIamgeComponent } from '../../controls/clickable/imagelink.component'
import { ReceivingProperties } from '../Receiving/receiving.properties'
declare var $: any;

@Component({
    selector: 'ScanEditor',
    providers: [MetadataService, MRNService, LocationService],
    templateUrl: './scan.html'
})
export class ScanEditor extends ReceivingProperties {
    @ViewChild('RuleModel') _ruleModel: modal;
    @ViewChild('modalRLocations') _modalRLocations: modal;
    @ViewChild('modalOrderLog') _modalOrderLog: modal;
    @ViewChild('modalContainer') _modalContainer: modal;
    @Output() ScanVisibilityChange = new EventEmitter();
    @Input("ActionCode") ActionCode: string;
    @Input("MRNNumber") MRNNumber: string;
    @Input("AllowScan") AllowScan: boolean;
    moduleTitle: string;
    ScanMRN: any;
    dataSource: any;
    partnerInfo: any;
    ScanPlaceholder: string = "Scan Serial#";
    ScanType: string = "SerielNumber";
    ScanValue: string;
    errorMessage: string;
    CurrentMRN: MRN = new MRN();
    ScanLine: MRNLine[] = [];
    CurrentReceivingAction: any;
    ReceivingActionRulesList = [];
    RefTypeList: any;
    ItemStatusList = [];
    DiscrepancyList = [];
    NodeList = [];
    GradeList = [];
    LocationList = [];
    IsDiscrepancyLoaded: boolean = false;
    CurrentItemStatusId: number;
    CurrentItemDamagedType: string = "undefined";
    DiscrepancyID: number;
    Discrepancy: string;
    DiscrepancyRemark: string;
    DiscrepancyQuantity: number = 0;
    CurrentContainerNumber: string = "";
    CurrentRemarks: string = "";
    LocationStructure: LocationStructure = new LocationStructure();
    SelectedLocation: any;
    SelectedDamageGraphLocations: any;
    PendingArtifactsList: any;
    DynamicControls: any;
    IsShowDefaultQueston: boolean = true;
    IsShowQuestionnaireRule: boolean = true;
    AccessoriesList: any;
    IsAccessoriesLoded: boolean = false;
    CurrentPackageNumber: string = "undefined";
    DamagedTypeList: any;
    IsShowDamagedTypeList: boolean = false;
    CurrentNodeId: number;
    CurrentLocationId: number;
    RuleGroup: any;
    CurrentAction: ReceivingAction = new ReceivingAction();
    CurrentRMANumber: string = "";
    OrderLogs = [];
    AccessPermissions: any;
    arrCurrentMRNLine: MRNLine[] = [];
    ItemLocation: string = "";
    IsContainerVisible: boolean;
    ContainerList: any;
    CurrentContainer: string = "";
    ReceivingModuleWorkFlowDetailID: number;
    SelectedItemNumber:string;
    SelectedItemName:string;
    constructor(
        private mrnService: MRNService, public _util: Util,
        private _router: Router, private route: ActivatedRoute, private _config: MetadataService,
        private _global: GlobalVariableService, private ref: ChangeDetectorRef, private locationService: LocationService) {
        super()
        this.moduleTitle = this._global.getModuleTitle(this.route.snapshot.parent.url[0].path + '/' + this.route.snapshot.parent.url[1].path);
    };

    ngOnInit() {
        this.LoadGridoption();

        if (this.ActionCode == "TSK006") {
            this.CurrentAction.ActionCode = "TSK006";
            this.CurrentAction.Action = "Inspected";
            this.CurrentAction.ScanStatusID = "ST023";
            this.IsContainerVisible = false;
        }
        else if (this.ActionCode == "TSK008") {
            this.CurrentAction.ActionCode = "TSK008";
            this.CurrentAction.Action = "Put-Away";
            this.CurrentAction.ScanStatusID = "ST015";
            this.IsContainerVisible = true;
        }
        else {
            this.CurrentAction.ActionCode = "TSK005";
            this.CurrentAction.Action = "Receiveing";
        }

        this.partnerInfo = this._global.getItem('partnerinfo');
        this.mrnService.getTypeLookUpByName("RuleGroup").subscribe(rulegroup => {
            this.RuleGroup = rulegroup.recordsets[0];
        });

        this.CurrentMRN = new MRN();
        $("#searchText").focus();

        this.BindItemGrid();
    }
    BindItemGrid() {
        this.dataSource = {
            rowCount: null,
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
                this.mrnService.GetMRNItem(this.partnerInfo[0].LogInUserPartnerID, this.ActionCode, this.MRNNumber, this.partnerInfo[0].UserId).
                    subscribe(
                    result => {
                        //console.log(result);
                        this.AccessPermissions = result[0];
                        var rowsThisPage
                        if (this.CurrentContainer != "")
                            rowsThisPage = result[1].filter(x => x.ContainerNumber == this.CurrentContainer);
                        else
                            rowsThisPage = result[1];

                        this.arrCurrentMRNLine = result[1];
                        if (this.arrCurrentMRNLine.length > 0) {
                            this.CurrentMRN.MRNHeaderID = this.arrCurrentMRNLine[0].MRNHeaderID;
                            this.PopulateActions(this.arrCurrentMRNLine[0].ModuleWorkFlowID);
                        }

                        this.OrderLogs = result[2];
                        if (this.OrderLogs && this.OrderLogs.length > 0) {
                            if (this.OrderLogs[0].recordset) {
                                this.OrderLogs = JSON.parse(this.OrderLogs[0].recordset);
                            } else {
                                this.OrderLogs = [];
                            }
                        }                        

                        if(!this.LineGridOptions.columnApi.getAllColumns()){
                            if (this.CurrentAction.ActionCode == "TSK005")
                            this.LineGridOptions.api.setColumnDefs(this.ReceivingColumnDefs);
                        else if (this.CurrentAction.ActionCode == "TSK006")
                            this.LineGridOptions.api.setColumnDefs(this.InspectColumnDefs);
                        else
                            this.LineGridOptions.api.setColumnDefs(this.PutAwayColumnDefs);
                        }
                       

                        var lastRow = result[1].length;
                        params.successCallback(rowsThisPage, lastRow);
                    });
            }
        }
        this.LineGridOptions.datasource = this.dataSource;
    }
    LoadGridoption() {
        this.gridOptionsOrderLog = {
            rowData: this.OrderLogs,
            columnDefs: this.OrderLogColumnDefs,
            enableColResize: true,
            enableSorting: true,
            rowSelection: 'single',
            getNodeChildDetails: this.getNodeChildDetails,
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },            
        }
        this.LineGridOptions = {
            rowData: this.ScanMRN,
            //columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2,
            context: {
                componentParent: this
            }
        };
        this.ContainerGridOptions = {
            rowData: this.ContainerList,
            columnDefs: this.ContainercolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'multiple',
            //suppressRowClickSelection: true,
            context: {
                componentParent: this
            }
        };
        this.ContainerPutAwayGridOptions = {
            rowData: this.ContainerList,
            columnDefs: this.ContainerPutAwaycolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'multiple',
            //suppressRowClickSelection: true,
            context: {
                componentParent: this
            }
        };
    }
    HasPermission(name: string): boolean {
        if (typeof (this.AccessPermissions) == 'undefined') {
            return false;
        }
        else {
            var index = this.AccessPermissions.findIndex(x => x.FunctionType == name)
            if (index >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    EditClicked(data, Action) {
        if (Action == 'ShippingNumber') {
            this.TrackShipment(data);
        }
        //else if (Action == 'Reopen') {
        //    this.UpdateContainer(data, Action);
        //}
        else if (Action == 'Container') {
            this.ShowContainerItem(data);
        }
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
    ChangeScanType(val) {
        if (val == "ItemNumber")
            this.ScanPlaceholder = "Scan Item Number";
        else
            this.ScanPlaceholder = "Scan Serial Number";
    }
    OnScan() {
        this.ScanLine = [];
        let cloned = this.arrCurrentMRNLine.map(x => Object.assign({}, x));

        var line = cloned.filter(line => (line.StatusCode == this.CurrentAction.ScanStatusID || line.StatusCode == "ST068") && (line.ItemNumber.toLowerCase() == this.ScanValue.toLowerCase() || line.SerialNumber.toLowerCase() == this.ScanValue.toLowerCase()));
        if (line.length > 0) {

            if (line[0].StatusCode == "ST068")
                this.ReceivedScanItem(line[0]);
            else
                this._ruleModel.open();

            this.ScanLine[0] = line[0];
            this.ScanLine[0].Id = 0;
            this.ScanLine[0].PreviousModuleWorkFlowDetailID = line[0].ModuleWorkFlowDetailID;
            this.ScanLine[0].ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
            this.ScanLine[0].Status = this.CurrentReceivingAction.NextStatusName;
            this.ScanLine[0].StatusCode = this.CurrentReceivingAction.NextStatusCode;
            this.ScanLine[0].ToPartner = this.partnerInfo[0].LogInUserPartnerName;
            this.ScanLine[0].ToPartnerId = this.partnerInfo[0].LogInUserPartnerID;
            this.ScanLine[0].ToPartnerAddressId = this.partnerInfo[0].AddressID;
            this.ScanLine[0].IsContainerClosed = false;
            
        }
        else {
            this._util.error("Invalid Serial Number or UPC.", "error");
        }
        this.ScanValue = "";
    }
    PopulateActions(WorkFlowID: number) {
        this.mrnService.GetReceivingActions(WorkFlowID).subscribe(_actions => {

            for (let entry of _actions[0]) {
                if (entry.ActionCode == this.CurrentAction.ActionCode) {
                    this.CurrentReceivingAction = entry;
                }

                if (entry.ActionCode == "TSK005") {
                    this.ReceivingModuleWorkFlowDetailID = entry.ModuleWorkFlowDetailID;
                }
            }

            this.ReceivingActionRulesList = _actions[1];
            this.mrnService.load(this.CurrentMRN.MRNHeaderID).subscribe(result => {
                this.CurrentMRN = result[0][0];
                //this.CurrentMRN.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
                this.CurrentMRN.ModuleStatusMapID = this.CurrentReceivingAction.CurrentStatusID;

                this.PopulateAccessories();
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
            });

        }, error => this.errorMessage = <any>error);
    }
    ClearMRN() {
        $("#searchText").focus();
        this.ScanLine = [];
        this.CurrentItemStatusId = undefined;
        this.CurrentPackageNumber = "undefined";
        this.CurrentContainerNumber = "";
        this.CurrentNodeId = undefined;
        this.CurrentLocationId = undefined;
        this.SelectedLocation = null;
        this.CurrentRemarks = "";
        this.IsDiscrepancyLoaded = false
        this.DiscrepancyID = undefined;
        this.DiscrepancyQuantity = 0
        this.DiscrepancyRemark = "";
        this.IsShowDamagedTypeList = false;
        this.CurrentItemDamagedType = "undefined";
        this.AccessoriesList = [];
        this.IsAccessoriesLoded = false;
        this._ruleModel.close();
    }
    SaveMRN() {

        if (!this.ValidateLineItem()) {
            return;
        }

        this.AddSelectedLine();
        this.CurrentMRN.CreatedBy = this.partnerInfo[0].UserId;
        this.CurrentMRN.ModuleWorkFlowDetailID = this.CurrentReceivingAction.ModuleWorkFlowDetailID;
        this.CurrentMRN.MRNLines = this.ScanLine;
        this.mrnService.SaveMRN(this.CurrentMRN).subscribe(returnvalue => {
            if (returnvalue.MRNNumber == "Error") {
                this._util.error("System error generated at this moment. Please contact system administrator.", "error");
                console.log(returnvalue.recordsets);
            }
            else {
                var item = this.ScanLine[0].SerialNumber != "" ? this.ScanLine[0].SerialNumber : this.ScanLine[0].ItemNumber;
                this._util.success(item + ' ' + this.CurrentAction.Action + " successfully.", "success");
                this.ClearMRN();

                if (this.LineGridOptions.api)
                    this.LineGridOptions.api.setDatasource(this.dataSource);
            }
        });
    }
    ValidateLineItem() {
        if (this.ShowPerMission('RC007')) {
            if (this.CurrentItemStatusId == undefined || isNaN(this.CurrentItemStatusId)) {
                this._util.warning("Select Input Item Conditions.", "warning");
                return false;
            }
            else if (this.CurrentItemStatusId == 171 && this.DamagedTypeList.length > 0 && (this.CurrentItemDamagedType.length < 1 || this.CurrentItemDamagedType == "undefined")) {
                this._util.warning("Select Damaged Type.", "warning");
                return false;
            }
        }

        if (this.ShowPerMission('RC006')) {
            if (this.CurrentPackageNumber.length < 1 || this.CurrentPackageNumber == "undefined") {
                this._util.warning("Select Grade.", "warning");
                return false;
            }
        }

        if (this.ShowPerMission('RC009') && !this.IsDiscrepancyLoaded) {
            if (this.CurrentContainerNumber.length < 1) {
                this._util.warning("Enter Container Number.", "warning");
                return false;
            }
        }

        if (this.ShowPerMission('RC010')) {
            if (typeof this.CurrentNodeId === undefined || isNaN(this.CurrentNodeId)) {
                this._util.warning("Select Sub-Inventory Code.", "warning");
                return false;
            }
        }
        if (this.ShowPerMission('RC015')) {
            if (!this.SelectedLocation) {
                this._util.warning("Scan or select a location.", "warning");
                return false;
            }
        }

        if (this.ShowPerMission('RR00033')) {
            if (this.IsDiscrepancyLoaded) {
                if (typeof this.DiscrepancyID === undefined || isNaN(this.DiscrepancyID)) {
                    this._util.warning("Select Discrepancy.", "warning");
                    return false;
                }

                //if (this.DiscrepancyQuantity == undefined || this.DiscrepancyQuantity == 0) {
                //    Toast.ShowAlertBox(1, "Alert", "Enter Discrepancy Quantity.", 1);
                //    return false;
                //}

                //if (this.DiscrepancyQuantity > ItemQuantity) {
                //    Toast.ShowAlertBox(1, "Alert", "Discrepancy quantity must be less than or equal to " + ItemQuantity, 1);
                //    return false;
                //}

                if (this.DiscrepancyRemark == undefined || this.DiscrepancyRemark.length < 1) {
                    this._util.warning("Enter Discrepancy Remark.", "warning");
                    return false;
                }
            }
        }

        if (this.ShowPerMission('RR00035')) {
            var Accessories = $('#ModelAccessories').val();
            if (this.AccessoriesList.length > 0 && (Accessories == undefined || Accessories.length == 0)) {
                this._util.warning("Select atleast one accessories.", "warning");
                return false;
            }
        }

        return true;
    }
    AddSelectedLine() {
        var me = this;

        $.each(me.ScanLine, function (i, v) {
            if (v.PendingQuantity != undefined && v.PendingQuantity > 0)
                v.Quantity = v.PendingQuantity;

            if (me.ShowPerMission('RC006')) {
                v.PackageNumber = me.CurrentPackageNumber;
            }

            if (me.ShowPerMission('RC007')) {
                v.ItemStatusID = me.CurrentItemStatusId;
                if (me.CurrentItemStatusId != 171)
                    v.ItemConditions = me.ItemStatusList.filter(f => f.TypeLookUpID == me.CurrentItemStatusId)[0].TypeName;
                else
                    v.ItemConditions = me.CurrentItemDamagedType;

                v.ItemDamagedType = me.CurrentItemDamagedType != "undefined" ? me.CurrentItemDamagedType : "";
            }

            if (me.ShowPerMission('RC009')) {
                v.ContainerNumber = me.CurrentContainerNumber;
            }

            if (me.ShowPerMission('RC010')) {
                v.NodeID = me.CurrentNodeId;
                v.SubInventory = $("#Node option:selected").text();
            }

            if (me.ShowPerMission('RC015')) {
                //line.LocationID = this.CurrentLocationId;
                //line.Location = $("#Location option:selected").text();
                if (!me.SelectedLocation)
                    return;
                v.LocationID = me.SelectedLocation.PartnerLocationID;
                v.Location = me.SelectedLocation.LocationName;
            }

            if (me.ShowPerMission('RC008')) {
                v.Remarks = me.CurrentRemarks;
            }

            if (me.ShowPerMission('RR00033')) {
                if (me.IsDiscrepancyLoaded) {
                    v.DiscrepancyID = me.DiscrepancyID;
                    if (typeof me.DiscrepancyID !== 'undefined' && me.DiscrepancyID != undefined) {
                        v.Discrepancy = me.DiscrepancyList.filter(f => f.TypeLookUpID == me.DiscrepancyID)[0].TypeName;
                        v.DiscrepancyRemark = me.DiscrepancyRemark;
                        //v.DiscrepancyQuantity = me.DiscrepancyQuantity;
                        v.DiscrepancyQuantity = 1;
                    }
                    //else {
                    //    line.DiscrepancyRemark = "N/A";
                    //    //line.DiscrepancyQuantity = undefined;
                    //}
                }
            }

            if (me.ShowPerMission('RR00035')) {

                var AccessoriesName = "";
                var AccessoriesID = "";

                $("#ModelAccessories > option").each(function () {
                    if (this.selected) {
                        if (AccessoriesName == "") {
                            AccessoriesName = this.text;
                            AccessoriesID = this.value;
                        }
                        else {
                            AccessoriesName = AccessoriesName + "," + this.text;
                            AccessoriesID = AccessoriesID + "," + this.value;
                        }
                    }
                });

                v.AccessoriesName = AccessoriesName;
                v.AccessoriesID = AccessoriesID;
            }

            var itemStatuses = me.ItemStatusList.filter(s => s.TypeLookUpID == me.CurrentItemStatusId);
            if (itemStatuses.length > 0) {
                v.ItemStatus = itemStatuses[0].TypeName;
            }
            var itemNodes = me.NodeList.filter(s => s.NodeID == me.CurrentNodeId);
            if (itemNodes.length > 0) {
                v.Node = itemNodes[0].Node;
            }
            var itemLocations = me.LocationList.filter(s => s.LocationID == me.CurrentLocationId);
            if (itemLocations.length > 0) {
                v.Location = itemLocations[0].LocationName;
            }
        });

    }
    ShowPerMission(RuleCode: string): boolean {

        if (typeof (this.ReceivingActionRulesList) == 'undefined') {
            return false;
        }
        else {
            var index = this.ReceivingActionRulesList.filter(line => line.RuleCode == RuleCode && line.ModuleWorkFlowDetailID == this.CurrentReceivingAction.ModuleWorkFlowDetailID);
            if (index.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    ShowDamagedType(item) {
        if (item == 171) {
            this.mrnService.loadAllDamaged(this.ScanLine[0].ItemModelID).subscribe(damaged => {
                this.DamagedTypeList = damaged[0];
                if (this.DamagedTypeList.length > 0)
                    this.IsShowDamagedTypeList = true;
                else
                    this.IsShowDamagedTypeList = false;
            });
        }
        else {
            this.DamagedTypeList = [];
            this.IsShowDamagedTypeList = false;
            this.CurrentItemDamagedType = "undefined";
        }
    }
    PopulateItemStatuses() {
        this.mrnService.GetAllStatusByType("ItemStatus").subscribe(returnvalue => {
            this.ItemStatusList = returnvalue;
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
        });
    }
    PopulateAccessories() {
        if (this.ShowPerMission('RR00035')) {
            this.mrnService.loadAllAccessories(this.ScanLine[0].ItemModelID).subscribe(returnvalue => {
                this.AccessoriesList = returnvalue[0];
                if (this.AccessoriesList.length > 0)
                    this.IsAccessoriesLoded = true;
                else
                    this.IsAccessoriesLoded = false;
            });
        }
        else {
            this.IsAccessoriesLoded = false;
        }
    }
    IsDiscrepancyLoadedChange() {
        this.IsDiscrepancyLoaded = this.IsDiscrepancyLoaded ? false : true;
        if (this.IsDiscrepancyLoaded)
            this.CurrentContainerNumber = "";
    }

    //Code for document popup start
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
        
        me.SelectedItemNumber = item.ItemNumber != "" ? item.ItemNumber : item.SerialNumber;
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
    onExit() {
        this.ScanVisibilityChange.emit(true);
    }
    SetDynamicControl(viewableData) {

        var me: any = this;
        me.PendingArtifactsList = [];
        me.DynamicControls = [];

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
                    me.PendingArtifactsList.push(Artifact);
                });
            }
        });

        $.each(viewableData, function (i, v) {
            if (v.DropDownValue != "" && v.DropDownValue != null) {
                v.DropDownValue = JSON.parse(v.DropDownValue);
            }
            if (v.ControlType == 'File') {
                v.ControlValue = "";
            }
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
    }
    ChangeView(frm, to, direction) {

        //if (direction == 'right') {
        //    $("." + to).show();
        //    $("." + frm).hide();
        //}
        //if (direction == 'left') {
        //    $("." + to).show();
        //    $("." + frm).hide();
        //}
        //if (direction == 'up') {
        //    $("." + to).show();
        //    $("." + frm).hide();
        //}
        //if (direction == 'down') {
        //    $("." + to).show();
        //    $("." + frm).hide();
        //}
    }
    SelectUnSelectLocation(id) {

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
    //Code for document popup end

    //Code location start    
    PopulateLocation() {
        this.mrnService.GetLocationByPartner(this.partnerInfo[0].LogInUserPartnerID).subscribe(returnvalue => {
            this.LocationList = returnvalue;
            this.CurrentLocationId = this.LocationList[0].LocationID;
            this.OnParentLocationChanged(this.LocationList[0].LocationID);
        });
    }
    OnParentLocationChanged(e) {
        this.locationService.loadStructure(e).subscribe(
            result => {
                this.LocationStructure = new LocationStructure(TypedJson.parse<LocationStructure>(result.recordsets));
                //this._modalRLocations.open();               
            });
    }
    OnLocationSelectedCallback($event) {
        this.SelectedLocation = $event;
        this.ItemLocation = $event.LocationName;
        this._modalRLocations.close();
    }
    OpenLocationPopup(event) {
        this._modalRLocations.open();
    }
    OnScanLocation() {

        this.mrnService.GetLocationByCode(this.partnerInfo[0].LogInUserPartnerID, this.ItemLocation).subscribe(returnvalue => {
            if (returnvalue.length != 0) {
                this.SelectedLocation = returnvalue[0];
                this.ItemLocation = this.SelectedLocation.LocationName;
            }
            else {
                this._util.warning("Invalid location code.", "warning");
                this.ItemLocation = "";
            }

        });
    }
    //Code location end

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
    ShowOrderLog() {
        this._modalOrderLog.open();
        this.gridOptionsOrderLog.api.setRowData(this.OrderLogs);
    }
    ShowContainerItem(data) {
        this.CurrentContainer = data.Container;
        if (this.LineGridOptions.api)
            this.LineGridOptions.api.setDatasource(this.dataSource);

        this.IsContainerVisible = false;
    }
    ContainerExit() {
        this.CurrentContainer = "";
        if (this.LineGridOptions.api)
            this.LineGridOptions.api.setDatasource(this.dataSource);

        this.IsContainerVisible = true;
    }
    //OpenContainerPopup() {
    //    this.mrnService.GetContainer(this.CurrentMRN.MRNHeaderID, "Release", this.partnerInfo[0].LogInUserPartnerID).
    //        subscribe(
    //        result => {
    //            this.ContainerList = result[0];
    //            if (this.ContainerList.length > 0) {
    //                this.ContainerGridOptions.api.setRowData(this.ContainerList);
    //                this._modalContainer.open();
    //            }
    //            else
    //                Toast.ShowAlertBox(1, "Alert", "Any container is not available.", 1);
    //        });
    //}
    //ReleaseContainer() {
    //    var SelectedLines = this.ContainerGridOptions.api.getSelectedRows();
    //    this.UpdateContainer(SelectedLines, "Release");
    //}
    //UpdateContainer(data, action) {
    //    this.mrnService.UpdateContainer(data, action).subscribe(returnvalue => {
    //        var response = JSON.parse(returnvalue._body);
    //        if (response.result != "Success") {
    //            Toast.errorToast("System error generated at this moment. Please contact system administrator.");
    //            console.log(response.result);
    //        }
    //        else {
    //            Toast.successToast("Container updated successfully.");
    //            this._modalContainer.close();
    //            if (this.LineGridOptions.api)
    //                this.LineGridOptions.api.setDatasource(this.dataSource);
    //        }
    //    });
    //}

    //PutAwayItem() {

    //    var me = this;
    //    var SelectedLines = me.ContainerPutAwayGridOptions.api.getSelectedRows();
    //    if (SelectedLines.length == 0) {
    //        Toast.errorToast("Please select at least one container.");
    //        return;
    //    }

    //    me.ScanLine = [];
    //    let cloned = me.arrCurrentMRNLine.map(x => Object.assign({}, x));
    //    cloned = me.arrCurrentMRNLine.filter(function (x) {
    //        return SelectedLines.filter(line => line.Container == x.ContainerNumber).length > 0;
    //    });

    //    $.each(cloned, function (i, v) {
    //        v.Id = 0;
    //        v.PreviousModuleWorkFlowDetailID = v.ModuleWorkFlowDetailID;
    //        v.ModuleWorkFlowDetailID = me.CurrentReceivingAction.ModuleWorkFlowDetailID;
    //        v.Status = me.CurrentReceivingAction.NextStatusName;
    //        v.StatusCode = me.CurrentReceivingAction.NextStatusCode;
    //        v.ToPartner = me.partnerInfo[0].LogInUserPartnerName;
    //        v.ToPartnerId = me.partnerInfo[0].LogInUserPartnerID;
    //        v.ToPartnerAddressId = me.partnerInfo[0].AddressID;
    //        v.IsContainerClosed = true;
    //    });

    //    me.ScanLine = cloned;
    //    me.SaveMRN();
    //}
    CheckContainer() {
        this.mrnService.CheckContainer(this.CurrentContainerNumber).
            subscribe(
            result => {
                if (result[0].length > 0) {
                    this.CurrentContainerNumber = "";
                    this._util.error("Container is not available.", "error");
                }
            });
    }
    ReceivedScanItem(line) {
        var me = this;
        line.Id = 0;
        line.PreviousModuleWorkFlowDetailID = line.ModuleWorkFlowDetailID;
        line.ModuleWorkFlowDetailID = me.ReceivingModuleWorkFlowDetailID; 
        line.ToPartner = me.partnerInfo[0].LogInUserPartnerName;
        line.ToPartnerId = me.partnerInfo[0].LogInUserPartnerID;
        line.ToPartnerAddressId = me.partnerInfo[0].AddressID;
        line.IsContainerClosed = false;

        me.CurrentMRN.CreatedBy = me.partnerInfo[0].UserId;
        me.CurrentMRN.ModuleWorkFlowDetailID = me.ReceivingModuleWorkFlowDetailID;
        me.CurrentMRN.MRNLines = line;
        me.mrnService.SaveMRN(me.CurrentMRN).subscribe(returnvalue => {
            if (returnvalue.MRNNumber == "Error") {
                this._util.error("System error generated at this moment. Please contact system administrator.", "error");
                console.log(returnvalue.recordsets);
            }
            else {
                this._ruleModel.open();
                if (me.LineGridOptions.api)
                    me.LineGridOptions.api.setDatasource(me.dataSource);
            }
        });        
    }
    GenerateContainerNumber() {
        this.mrnService.GenerateContainerNumber(this.partnerInfo[0].LogInUserPartnerID).
            subscribe(
            result => {                
                if (result[0].length > 0) {
                    this.CurrentContainerNumber = result[0][0].ContainerNumber;                    
                }
            });
    }
    //UpdateItemStatus(data) {
    //    var item = { ModuleWorkFlowDetailID: this.ReceivingModuleWorkFlowID, InBoundID: data.Id };
    //    this.mrnService.UpdateMrnItemStatus(item).subscribe(returnvalue => {
    //        var response = JSON.parse(returnvalue._body);
    //        if (response.result != "Success") {
    //            Toast.errorToast("System error generated at this moment. Please contact system administrator.");
    //            console.log(response.result);
    //        }
    //        else {               
    //            if (this.LineGridOptions.api)
    //                this.LineGridOptions.api.setDatasource(this.dataSource);
    //        }
    //    });
    //}
}