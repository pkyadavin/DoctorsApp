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
//import { AddressInput } from '../shared/address.model';
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
    selector: 'PutAwayEditor',    
    providers: [MetadataService, MRNService, LocationService],
    templateUrl: './putaway.html'
})
export class PutAwayEditor extends ReceivingProperties {
    //@ViewChild('RuleModel') _ruleModel: modal;
    @ViewChild('modalRLocations') _modalRLocations: modal;
    //@ViewChild('modalOrderLog') _modalOrderLog: modal;
   // @ViewChild('modalContainer') _modalContainer: modal;
    //@Output() ScanVisibilityChange = new EventEmitter();
    //@Input("ActionCode") ActionCode: string;
    //@Input("MRNNumber") MRNNumber: string;
    //@Input("AllowScan") AllowScan: boolean;
    moduleTitle: string;
    PutAwayItemList: any;
    //dataSource: any;
    partnerInfo: any;
    //ScanPlaceholder: string ="Scan Serial#";
    //ScanType: string ="SerielNumber";
    //ScanValue: string;
    //errorMessage: string;
    CurrentMRN: MRN = new MRN();    
    ScanLine: MRNLine[] = [];
    CurrentReceivingAction: any;
    ReceivingActionRulesList = [];           
    //RefTypeList: any;
    //ItemStatusList = [];
    //DiscrepancyList = [];
    //NodeList = [];
    //GradeList = [];
    LocationList = [];
    //IsDiscrepancyLoaded: boolean = false;
    //CurrentItemStatusId: number;
    //CurrentItemDamagedType: string = "undefined";
    //DiscrepancyID: number;
    //Discrepancy: string;
    //DiscrepancyRemark: string;
    //DiscrepancyQuantity: number = 0;
    CurrentContainerNumber: string = "";
    //CurrentRemarks: string = "";
    LocationStructure: LocationStructure = new LocationStructure();
    SelectedLocation: any;
    SelectedDamageGraphLocations: any;
    PendingArtifactsList: any;
    DynamicControls: any;
    IsShowDefaultQueston: boolean = true;
    IsShowQuestionnaireRule: boolean = true;   
    //AccessoriesList: any;
    //IsAccessoriesLoded: boolean = false;
    //CurrentPackageNumber: string = "undefined";
    //DamagedTypeList: any;
    //IsShowDamagedTypeList: boolean = false;
    //CurrentNodeId: number;
    CurrentLocationId: number;
    RuleGroup: any;
    CurrentAction: ReceivingAction = new ReceivingAction();
    //CurrentRMANumber: string = ""; 
    //OrderLogs = [];
    AccessPermissions: any;
    arrCurrentMRNLine: MRNLine[] = [];
    ItemLocation: string = "";
    IsContainerVisible: boolean;    
    ContainerList: any;  
    CurrentContainer: string = "";
    SelectedItemNumber:string;
    SelectedItemName:string;
    
    constructor(
        private mrnService: MRNService, private _util:Util,
        private _router: Router, private route: ActivatedRoute, private _config: MetadataService,
        private _global: GlobalVariableService, private ref: ChangeDetectorRef, private locationService: LocationService) {
        super() 
        this.moduleTitle = this._global.getModuleTitle(this.route.snapshot.parent.url[0].path + '/' + this.route.snapshot.parent.url[1].path);
    };

    ngOnInit() {
        this.LoadGridoption();                   

        this.CurrentAction.ActionCode = "TSK008";
        this.CurrentAction.Action = "Put-Away";
        this.CurrentAction.ScanStatusID = "ST015";
        this.IsContainerVisible = true;
        
        this.partnerInfo = this._global.getItem('partnerinfo');
        this.mrnService.getTypeLookUpByName("RuleGroup").subscribe(rulegroup => {
            this.RuleGroup = rulegroup.recordsets[0];
        });
                
        this.CurrentMRN = new MRN();
        $("#ItemLocation").focus();      

        this.BindContainerGrid();
        this.PopulateLocation();                        
    }    
    LoadGridoption() {
        this.LineGridOptions = {
            rowData: this.PutAwayItemList,
            columnDefs: this.PutAwayColumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'multiple',
            //suppressRowClickSelection: true,
            context: {
                componentParent: this
            }
        }               
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
        if (Action == 'Container') {
            this.ShowContainerItem(data);
        }        
    }    
    ClearMRN() {
        $("#ItemLocation").focus();
        this.ScanLine = []; 
        this.CurrentMRN = new MRN();  
        this.CurrentContainerNumber = "";        
        this.CurrentLocationId = undefined;
        this.SelectedLocation = null;
        this.ItemLocation = "";        
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
            if (v.ControlType == "File" && v.ControlValue !="") {

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
        this.PutAwayItem();       
    }
    OpenLocationPopup(event) {        
        this._modalRLocations.open();
    }
    OnScanLocation() {
        
        this.mrnService.GetLocationByCode(this.partnerInfo[0].LogInUserPartnerID, this.ItemLocation).subscribe(returnvalue => {           
            if (returnvalue.length != 0)
            {
                this.SelectedLocation = returnvalue[0];                
                this.ItemLocation = this.SelectedLocation.LocationName;

                this.PutAwayItem(); 
            }
            else {
                this._util.error("Invalid location code.", "error");
                this.ItemLocation = "";
            }
                          
        });
    }
    //Code location end
    
    ShowContainerItem(data) {  
        this.CurrentContainer = data.Container; 

        //this.CurrentMRN = JSON.parse(data.MrnHeader)[0];
        this.PutAwayItemList = JSON.parse(data.Items);
        this.CurrentReceivingAction = JSON.parse(data.ModuleWorkflow)[0];
        this.LineGridOptions.api.setRowData(this.PutAwayItemList);       
               
        this.IsContainerVisible = false;        
    }
    ContainerExit() {
        this.CurrentContainer = "";
        this.IsContainerVisible = true;
        this.CurrentMRN = new MRN();
        this.PutAwayItemList = [];
        this.CurrentReceivingAction = [];

        this.LineGridOptions.api.setRowData(this.PutAwayItemList);         
    }
    BindContainerGrid() {
        this.mrnService.GetPutAwayContainer(this.partnerInfo[0].LogInUserPartnerID, this.partnerInfo[0].UserId).
            subscribe(
            result => {
                this.ContainerList = result[1];
                this.ContainerPutAwayGridOptions.api.setRowData(this.ContainerList);                
            });
    }    
    PutAwayItem() {        

        var PostMRNData = [];
        var me = this;
        var SelectedLines = me.ContainerPutAwayGridOptions.api.getSelectedRows();
        if (SelectedLines.length == 0) {
            this._util.warning("Please select at least one container.", "warning");
            this.ClearMRN();
            return;
        }

        $.each(SelectedLines, function (ind, val) { 

            me.CurrentMRN = new MRN();
            me.ScanLine = [];            
                                   
            me.CurrentReceivingAction = JSON.parse(val.ModuleWorkflow)[0];
            //me.CurrentMRN = JSON.parse(val.MrnHeader)[0];
            me.CurrentMRN.CreatedBy = me.partnerInfo[0].UserId;
            me.CurrentMRN.ModuleWorkFlowDetailID = me.CurrentReceivingAction.ModuleWorkFlowDetailID;
            me.CurrentMRN.ModuleStatusMapID = me.CurrentReceivingAction.CurrentStatusID;

            me.ScanLine = JSON.parse(val.Items); 

            $.each(me.ScanLine, function (i, v) {
                v.Id = 0;
                v.PreviousModuleWorkFlowDetailID = v.ModuleWorkFlowDetailID;
                v.ModuleWorkFlowDetailID = me.CurrentReceivingAction.ModuleWorkFlowDetailID;
                v.Status = me.CurrentReceivingAction.NextStatusName;
                v.StatusCode = me.CurrentReceivingAction.NextStatusCode;
                v.ToPartner = me.partnerInfo[0].LogInUserPartnerName;
                v.ToPartnerId = me.partnerInfo[0].LogInUserPartnerID;
                v.ToPartnerAddressId = me.partnerInfo[0].AddressID;
                v.IsContainerClosed = true;
                v.LocationID = me.SelectedLocation.PartnerLocationID;
                v.Location = me.SelectedLocation.LocationName;                
            });

            me.CurrentMRN.MRNLines = me.ScanLine;
                       
            PostMRNData.push(me.CurrentMRN);
        });      

        this.mrnService.SavePutAway(PostMRNData).subscribe(returnvalue => {
            if (returnvalue.MRNNumber == "Error") {
                this._util.error("System error generated at this moment. Please contact system administrator.", "error");                
                this.ClearMRN();
            }
            else {
                this._util.success("Put-Away Successfully.", "success");                
                this.BindContainerGrid();                
            }

            this.ClearMRN();
        });                 
    }
}