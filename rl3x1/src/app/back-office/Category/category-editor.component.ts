import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModelService } from './category.service';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Model } from './category.model';
import { SKU } from './sku.model';
import { GridOptions } from 'ag-grid-community'
//import { ItemMaster } from '../../controls/ItemSelector/ItemSelector.Model';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { message, modal } from '../../controls/pop/index.js';
import { effecton } from '../ReturnReason/effecton.controls';
import { effecttype } from '../ReturnReason/effecttype.controls';
import { valuetype } from '../ReturnReason/valuetype.controls';
import { checkBoxInputComponent } from '../ReturnReason/userinput.component';
import { checkBoxMandatoryComponent } from '../ReturnReason/chkBoxMandatory';
import { ActiveComponent } from '../ReturnReason/active.component';
import { EditComponent } from '../../shared/edit.component'
import { CommonService } from 'src/app/shared/common.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { Util } from 'src/app/app.util';
import { CategoryRuleValueComponent } from './rulevalue.component';
declare var $: any;

@Component({
    selector: 'Model-editor',
    providers: [ModelService],
    templateUrl: './categoryeditor.html'

})

export class ModelEditor {

    setUserGridType: string = "popup";
    setmodelPopupType: string = "popup";
    IsFileAvailable: boolean = false;
    @ViewChild('rulePopUp') rulePopUp: BsModalComponent;
    @ViewChild('retReasonGridPopUp') modalReturnReason: BsModalComponent;
    @ViewChild('itemModelGridPopUp') modalItemModel: BsModalComponent;
    @ViewChild("itemSelector") itemSelectorModel: BsModalComponent;
    CurrentModel: Model = new Model();
    CurrentSKU: SKU = new SKU();
    modelForm: FormControl;
    errorMessage: string;
    skueditor: any;
    modeleditor: any
    grouplist: any;
    IsLoaded: boolean;
    @Input("selectedId") selectedId: number;
    @Input("permission") permission: boolean;
    @Input("GridType") GridType: string;
    @Output() EditorVisibilityChange = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();
    SKUgridOptions: GridOptions;
    SKUlist: any;
    filterValue: string
    dataSource: any;
    isEditVisible: boolean;
    IsGridLoaded: boolean;
    IsSKULoaded: boolean;
    ModelSKUList: any;
    ItemcategoryList: any;
    Paramdata: string;
    CatHeaderName: string;
    moduleTitle: string;
    isSaveClick: boolean = true;
    ReturnReasonGridPopup: boolean = false;
    AllReasonCollection: any;
    AllRuleCollection: any;
    ReasonRuleCollection: any;
    AvailableReasons: any;
    AvailableRules: any;
    selectedRules: any;
    reasonGridOptions: GridOptions;
    ruleGridOptions: GridOptions;
    AccessoriesGridOptions: GridOptions;
    DamagedGridOptions: GridOptions;
    CurrentReturnReason: any = null;
    IsReturnReasonShow: boolean = false;
    AccessoriesList: any;
    DamagedList: any;
    CurrentAccessories: any = null;
    CurrentDamaged: any = null;
    IsDamagedEditorVisible: boolean = false;
    DamagedName: string = "";

    GridcolumnDefs =
        [
            { headerName: 'Item Name', field: "ItemName", width: 150 },
            { headerName: 'Description', field: "ItemDescription", width: 150 },
            { headerName: 'SKU Code', field: "SKUCode", width: 150 },
            { headerName: 'EAN Code', field: "EANCode", width: 150 },
            //{ headerName: 'Discount%', field: "ItemDiscountPC", width: 150 },
            { headerName: 'Item Price', field: "ItemPrice", width: 150 },
        ];

    reasoncolumnDefs = [
        //{ headerName: 'Reason Code', field: "ReasonCode", width: 150 },
        { headerName: 'Return Reason', field: "ReasonName", width: 350 },
        { headerName: 'Type', field: "TypeName", width: 100 },
        //{ headerName: 'Fulfilment Type', field: "ReturnType", width: 260 }
        { headerName: 'Approver Level 1', field: "ApproverOne", width: 150 },
        { headerName: 'Approver Level 2', field: "ApproverTwo", width: 150 },
        { headerName: 'Proof Of Purchase', field: "ProofPurchase", width: 150 },
        //{ headerName: 'Damage Evidence', field: "DamageEvidence", width: 150 },
        { headerName: '', field: "Configure", Width: 25, editable: false, hide: false, cellRendererFramework: EditComponent }
    ];

    AccessoriesColumnDefs = [
        { headerName: 'Model Name', field: "ModelName", width: 350 },
        { headerName: 'Description', field: "ModelDescription", width: 350 },
        { headerName: 'Category', field: "CategoryName", width: 350 },

    ];

    DamagedColumnDefs = [
        { headerName: 'Damaged Type', field: "DamagedName", width: 450 },

    ];

    rulecolumnDefs = [
        {
            headerName: "Active", field: "isActive", pinned: 'left', width: 70, suppressFilter: true,
            cellRendererFramework: ActiveComponent, editable: false
        },
        //{ headerName: 'Active', field: "isActive", width: 80, cellRendererFramework: ActiveRuleComponent },
        { headerName: 'Rule Name', field: "RuleName", width: 250 },
        { headerName: 'Overridable', field: "isOverRidable", width: 100, hide: true },
        {
            headerName: 'Mandatory', field: "isMandatory", width: 100,
            cellRendererFramework: checkBoxMandatoryComponent, editable: true, suppressFilter: true
        },
        { headerName: 'Rule Value', field: "RuleValue", width: 220, cellRendererFramework: CategoryRuleValueComponent },

        {
            headerName: "User Input?", field: "UserInput", width: 110, hide: true,
            cellRendererFramework: checkBoxInputComponent, editable: true, suppressFilter: true
        },
        {
            headerName: "Based On", field: "RuleValueEffectTO", width: 150,
            cellRendererFramework: effecton, editable: false
        },
        {
            headerName: "Trigger Value", field: "RuleValueEffect", width: 100, suppressFilter: true,
            cellRendererFramework: effecttype, editable: false
        },

        {
            headerName: "Value Type", field: "IsFixedRuleValue", width: 150, suppressFilter: true,
            cellRendererFramework: valuetype, editable: false
        },

        //{
        //    headerName: "Rule Group", field: "RuleGroup", width: 150
        //},
    ];

    SKUData = {
        SKUID: 0,
        SKUDescription: '',
        SKUName: '',
        Price: '',
        ModelID: 0,
        IsActive: true
    };
    constructor(
        private modelService: ModelService
        , private _router: Router
        , private route: ActivatedRoute
        , private formBuilder: FormBuilder
        , private commonService$: CommonService
        , private _menu: SidebarService,
        private _util:Util
    ) {
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
    };

    //@ViewChild('pop') _popup: message;
    @ViewChild('pop2') _popup2: modal;
    ngOnInit() {


        if (this.GridType == "popuprefress") {
            this.moduleTitle = "Product Model";
            $('#divEditHeader').addClass('widget-header');
        }
        else {
            $('#divEditHeader').addClass('widget-header widget-header1');
            $('#divEditForm').addClass('marginTop34');
        }

        this.Paramdata = 'ModelMaster';
        this.IsLoaded = false;
        this.modelService.loadModel(this.selectedId).subscribe(modelmaster => {
            if (this.selectedId != 0) {
                this.CurrentModel = modelmaster[0][0];
                this.CatHeaderName = (this.permission) ? "Edit " + this.moduleTitle : this.moduleTitle;

                if (this.CurrentModel.InstructionDoc != "" && this.CurrentModel.InstructionDoc != null)
                    this.IsFileAvailable = true;
                else {
                    this.IsFileAvailable = false;
                    this.CurrentModel.InstructionDoc = "";
                }
            }
            else {
                this.CurrentModel = new Model();
                this.CurrentModel.IsActive = true;
                this.CurrentModel.ModelID = 0;
                this.CatHeaderName = "Add " + this.moduleTitle;
                this.IsFileAvailable = false;
                this.CurrentModel.InstructionDoc = "";
            }
            //added for dynamic Field--------
            //var localize = modelmaster[1];
            var localize = JSON.parse(modelmaster[1][0].ColumnDefinations);
            if (this.selectedId != 0) {
                var localeditor = localize.map(function (e) {
                    return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                });
            }
            else {

                var localeditor = localize.map(function (e) {

                    e.isEnabled = 1;
                    return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                });
            }
            this.modeleditor = JSON.parse("{" + localeditor.join(',') + "}");
            this.IsLoaded = true;
            //-----------------------------------------------------------
        });
        this.modelService.loadCategory().subscribe(modelmaster => {
            this.grouplist = modelmaster;


        });

        // Grid loading
        this.SKUgridOptions = {
            rowData: this.SKUlist,
            columnDefs: this.GridcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };

        this.reasonGridOptions = {
            rowData: this.AllReasonCollection,
            columnDefs: this.reasoncolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };

        this.AccessoriesGridOptions = {
            rowData: this.AccessoriesList,
            columnDefs: this.AccessoriesColumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };

        this.DamagedGridOptions = {
            rowData: this.DamagedList,
            columnDefs: this.DamagedColumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };

        this.ruleGridOptions = {
            rowData: this.AvailableRules,
            columnDefs: this.rulecolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };

        this.modelService.loadAllSKU(this.selectedId).subscribe(modelmaster => {
            this.ModelSKUList = modelmaster;
            if (this.SKUgridOptions.api)
                this.SKUgridOptions.api.setRowData(this.ModelSKUList);

        });

        this.modelService.loadAllAccessories(this.selectedId).subscribe(accessories => {
            this.AccessoriesList = accessories[0];
            this.AccessoriesGridOptions.api.setRowData(this.AccessoriesList);
        });

        this.modelService.loadAllDamaged(this.selectedId).subscribe(damaged => {
            this.DamagedList = damaged[0];
            this.DamagedGridOptions.api.setRowData(this.DamagedList);
        });

        this.IsReturnReasonShow = true;
        //this.modelService.GetModuleControlValue().subscribe(returnreason => {
        //    var ReturnReason = returnreason[0][0].ReturnReasonValue;
        //    if (ReturnReason.toLowerCase() == "all" || ReturnReason.toLowerCase() == "product model")
        //        this.IsReturnReasonShow = true;
        //    else
        //        this.IsReturnReasonShow = false;

        //}, error => this.errorMessage = <any>error);

        this.commonService$.loadReasonRules()
            .subscribe(_rules => {
                this.AllRuleCollection = _rules;
                this.InitPartnerReturnReason(this.CurrentModel.ModelID); //ItemModelId
            },
                error => this.errorMessage = <any>error);

    }

    ApplyRule() {
        var me: any = this;
        var ProofPurchase: string = "No";
        var DamageEvidence: string = "No";
        var ApproverOne: string = "No";
        var ApproverTwo: string = "No";

        var IsValidRuleConfigration: boolean = true;
        if (this.ruleGridOptions.api && this.ruleGridOptions.api != null) {
            this.ruleGridOptions.api.forEachNode(function (node) {
                var item = me.ReasonRuleCollection.filter(d => d.RuleID == node.data.RuleID && d.ReasonID == node.data.ReasonID)[0];
                if (item != undefined) {

                    if (node.data.isActive) {
                        switch (node.data.ControlTypeName) {
                            case "Number":
                                if ((!node.data.RuleValue || !node.data.RuleValueEffect || !node.data.RuleValueEffectTO || node.data.IsFixedRuleValue == undefined) && !node.data.UserInput) {
                                    IsValidRuleConfigration = false;
                                    return false;
                                }
                                break;
                            case "Text":
                                if (!node.data.RuleValue && !node.data.UserInput) {
                                    IsValidRuleConfigration = false;
                                    return false;
                                }
                                break;
                            case "Roles List":
                                if (!node.data.RuleValue || !node.data.RuleValueEffect || !node.data.RuleValueEffectTO || node.data.IsFixedRuleValue == undefined || node.data.IsFixedRuleValue == "") {
                                    IsValidRuleConfigration = false;
                                    return false;
                                }
                                break;
                        }
                    }

                    item.RuleValue = node.data.RuleValue;
                    item.isActive = node.data.isActive;
                    item.isOverRidable = node.data.isOverRidable;
                    item.isMandatory = node.data.isMandatory;
                    item.IsFixedRuleValue = node.data.IsFixedRuleValue;
                    item.RuleValueEffect = node.data.RuleValueEffect;
                    item.RuleValueEffectTO = node.data.RuleValueEffectTO;
                    item.UserInput = node.data.UserInput;

                    if (node.data.RuleCode == "RR00009")
                        ProofPurchase = node.data.isActive == true ? "Yes" : "No";
                    if (node.data.RuleCode == "RR00037")
                        DamageEvidence = node.data.isActive == true ? "Yes" : "No";
                    if (node.data.RuleCode == "RR00021")
                        ApproverOne = node.data.isActive == true ? "Yes" : "No";
                    if (node.data.RuleCode == "RR00022")
                        ApproverTwo = node.data.isActive == true ? "Yes" : "No";

                    $.each(me.AvailableReasons, function (i, v) {
                        if (v.ReasonID == item.ReasonID) {
                            v.ApproverOne = ApproverOne;
                            v.ApproverTwo = ApproverTwo;
                            v.ProofPurchase = ProofPurchase;
                            v.DamageEvidence = DamageEvidence;
                        }
                    });
                }

            })
        }

        if (!IsValidRuleConfigration) {            
            this._util.error("Please fill all the active rule configuration.","alert");
            return;
        }

        this.rulePopUp.close();

        if (this.reasonGridOptions.api)
            this.reasonGridOptions.api.setRowData(this.AvailableReasons);

        if (me.AvailableReasons.length != 0 && me.reasonGridOptions.api) {
            me.reasonGridOptions.api.forEachNode(function (node) {
                if (node.data.ReasonID === me.CurrentReturnReason.ReasonID) {
                    node.setSelected(true);
                }
            });
        }
        else {
            this.ruleGridOptions.api.setRowData([])
        }
    }

    EditClicked(data, Action) {
        if (Action == 'Configure') {
            this.rulePopUp.open();
        }
    }

    onSubmit(form) {
        var me = this;
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

        var IsValidRuleConfigration: boolean = true;
        if (this.ruleGridOptions.api && this.ruleGridOptions.api != null) {
            this.ruleGridOptions.api.forEachNode(function (node) {
                if (node.data.isActive) {
                    switch (node.data.ControlTypeName) {
                        case "Number":
                            if ((!node.data.RuleValue || !node.data.RuleValueEffect || !node.data.RuleValueEffectTO || node.data.IsFixedRuleValue == undefined) && !node.data.UserInput) {
                                IsValidRuleConfigration = false;
                                return false;
                            }
                            break;
                        case "Text":
                            if (!node.data.RuleValue && !node.data.UserInput) {
                                IsValidRuleConfigration = false;
                                return false;
                            }
                            break;
                        case "Roles List":
                            if (!node.data.RuleValue || !node.data.RuleValueEffect || !node.data.RuleValueEffectTO || node.data.IsFixedRuleValue == undefined || node.data.IsFixedRuleValue == "") {
                                IsValidRuleConfigration = false;
                                return false;
                            }
                            break;
                    }
                }

            })
        }

        if (!IsValidRuleConfigration) {            
            this._util.error("Please fill all the active rule configuration.","Alert");
            return;
        }

        this.CurrentModel.AllItemMasterList = this.ModelSKUList;
        this.CurrentModel.AccountReasons = this.AvailableReasons;
        this.CurrentModel.AccountReasonRules = this.ReasonRuleCollection;
        this.CurrentModel.Accessories = this.AccessoriesList;
        this.CurrentModel.Damaged = this.DamagedList;

        if (this.CurrentModel.ModelID == 0) {
            this.modelService.create(this.CurrentModel).subscribe(returnvalue => {
                //this._popup.Alert('Alert', 'Model Master Created successfully.', function () { });
                this._util.success('Model Master created successfully.','');
                me.EditorVisibilityChange.emit(true);
                if (this.GridType == "popuprefress") {
                    me.closeEvent.emit();
                }
            }, error => this._util.error(error, 'error'));
        }
        else {
            this.modelService.update(this.CurrentModel).subscribe(returnvalue => {
                this._util.success('Model Master updated successfully.', '');
                //this._popup.Alert('Alert', 'Model Master updated successfully.', function () { });
                me.EditorVisibilityChange.emit(true);

                if (this.GridType == "popuprefress") {
                    me.closeEvent.emit();
                }
                }, error => this._util.error(error, 'error'));
        }
    }

    ProductFile: FileList;
    handleReturnDocs(ctrl, e, controls, me1: any) {

        var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (file.length > 0) {            
            this.ProductFile = file;
            let formData: FormData = new FormData();
            for (let i = 0; i < this.ProductFile.length; i++) {
                formData.append('SRODocs', this.ProductFile[0]);
            }

            this.modelService.UploadProductDoc(formData).subscribe(data => {
                if (data.result == 'Success') {
                    this.IsFileAvailable = true;
                    this.CurrentModel.InstructionDoc = data.FileUrl;
                }
                else {
                }
            });
        }
        else {
        }
    }

    onCancel() {
        this.isEditVisible = false;
        this.EditorVisibilityChange.emit(false);
    }

    OnSelect() {
        this._popup2.open();
    }

    SelectItem() {
        this.itemSelectorModel.open();
    }
    itemListChange($event) {
        this.ModelSKUList = $event;
        this.SKUgridOptions.api.setRowData($event);
    }
    onGridSelectionChanged() {
        this.isEditVisible = true;
        this.CurrentSKU = this.SKUgridOptions.api.getSelectedRows()[0];
    }

    onCancelPopup() {

    }

    SelectCategory() {
        this.CurrentModel.CategoryName = this.ItemcategoryList.CategoryName;
        this.CurrentModel.CategoryID = this.ItemcategoryList.ItemCategoryID;
        this._popup2.close();

    }

    GetDataNew(item: any) {
        this.ItemcategoryList = item;
    }

    openReturnReasonGridPopup() {
        this.ReturnReasonGridPopup = true;
        this.modalReturnReason.open();
    }

    RemoveReturnReason() {
        var ind = this.AvailableReasons.map(function (e) { return e.ReasonID; }).indexOf(this.CurrentReturnReason.ReasonID);
        if (ind > -1) {
            this.ReasonRuleCollection = this.ReasonRuleCollection.filter(f => f.ReasonID != this.CurrentReturnReason.ReasonID)
            this.AvailableReasons.splice(ind, 1);
            this.reasonGridOptions.api.setRowData(this.AvailableReasons);
            this.CurrentReturnReason = null;
            if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
                this.reasonGridOptions.api.forEachNode(function (node) {
                    if (node.childIndex === 0) {
                        node.setSelected(true);
                    }
                });
            }
            else {
                this.ruleGridOptions.api.setRowData([])
            }
        }

        if (this.reasonGridOptions.api)
            this.reasonGridOptions.api.setRowData(this.AvailableReasons);

        if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
            this.reasonGridOptions.api.forEachNode(function (node) {
                node.setSelected(true);
            });
        }
    }

    onSelectedReasonChanged(me: any = this) {
        let data = this.reasonGridOptions.api.getSelectedRows()[0];
        this.CurrentReturnReason = this.reasonGridOptions.api.getSelectedRows()[0];
        this.AvailableRules = this.AllRuleCollection.filter(ur => ur.ReasonID == data.ReasonID || ur.ReasonID == null).map(function (e) {
            return e;
        })

        if (this.AvailableRules.length > 0) {
            this.ruleGridOptions.api.setRowData(this.AvailableRules);
            this.ruleGridOptions.api.forEachNode(function (node) {
                var item = me.ReasonRuleCollection.filter(d => d.RuleID == node.data.RuleID && d.ReasonID == node.data.ReasonID)[0];
                if (item != undefined) {
                    node.data.RuleValue = item.RuleValue;
                    node.data.isOverRidable = item.isOverRidable;
                    node.data.isMandatory = item.isMandatory;
                    node.data.IsFixedRuleValue = item.IsFixedRuleValue;
                    node.data.RuleValueEffect = item.RuleValueEffect;
                    node.data.RuleValueEffectTO = item.RuleValueEffectTO;
                    node.data.UserInput = item.UserInput;
                    node.data.isActive = item.isActive;
                }
                else {
                    let newItem = {
                        ReasonID: node.data.ReasonID,
                        RuleID: node.data.RuleID,
                        RuleControlTypeID: node.data.RuleControlTypeID,
                        RuleValue: node.data.RuleValue,
                        isOverRidable: node.data.isOverRidable,
                        isMandatory: node.data.isMandatory,
                        IsFixedRuleValue: node.data.IsFixedRuleValue,
                        RuleValueEffect: node.data.RuleValueEffect,
                        RuleValueEffectTO: node.data.RuleValueEffectTO,
                        UserInput: node.data.UserInput,
                        isActive: node.data.isActive
                    };
                    me.ReasonRuleCollection.push(newItem);
                }

            })
        }
    }

    ReturnReasonGridEvent(event) {
        var me = this;

        me.modalReturnReason.close();
        me.ReturnReasonGridPopup = false;
        var msg: string = "";

        $.each(event, function (i, v) {
            var reasons = me.AvailableReasons.filter(u => u.ReasonID == v.RMAActionCodeID);
            if (reasons.length > 0) {
                msg = msg + v.RMAActionName + ", ";
            }
            else {
                me.AvailableReasons.push({
                    PartnerReturnReasonMapID: 0,
                    ReasonID: v.RMAActionCodeID,
                    ReasonCode: v.RMAActionCode,
                    ReasonName: v.RMAActionName,
                    ReturnType: v.ReturnType,
                    TypeName: v.TypeName,
                    ApproverOne: false,
                    ApproverTwo: false,
                    ProofPurchase: false,
                    DamageEvidence: false
                });
            }
        });

        if (msg.length > 0) {            
            this._util.error(msg+" already exists.","Alert");
        }

        if (me.reasonGridOptions.api)
            me.reasonGridOptions.api.setRowData(me.AvailableReasons);

        if (me.AvailableReasons.length != 0 && me.reasonGridOptions.api) {
            me.reasonGridOptions.api.forEachNode(function (node) {
                node.setSelected(true);
            });
        }
    }

    InitPartnerReturnReason(ItemModelID: number) {
        this.modelService.loadRetReasonRuleMapping(ItemModelID)
            .subscribe(_reasonrule => {
                this.AllReasonCollection = _reasonrule.recordsets[0];
                this.ReasonRuleCollection = _reasonrule.recordsets[1];
                this.AvailableReasons = this.AllReasonCollection;
                if (this.reasonGridOptions.api)
                    this.reasonGridOptions.api.setRowData(this.AvailableReasons);

                if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
                    this.reasonGridOptions.api.forEachNode(function (node) {
                        if (node.childIndex === 0) {
                            node.setSelected(true);
                        }
                    });
                }
            },
                error => this.errorMessage = <any>error);
    }

    notifyParent() {
        this.ruleGridOptions.api.refreshView();
    }

    notifyChange(e, me: any = this) {
        if (e.RuleCode == "RR00021" || e.RuleCode == "RR00022") {
            var RoleControl = JSON.parse(e.RoleControl).filter(x => x.RoleID == e.RuleValue);
            if (RoleControl[0]) {
                if (RoleControl[0].TotalAssignUser == 0) {                    
                     this._util.error('Attention: Please do not forgot to assign a user to this role.',"Alert");
                }
            }
        }

        var item = me.ReasonRuleCollection.filter(d => d.RuleID == e.RuleID && d.ReasonID == e.ReasonID)[0];
        if (item != undefined) {
            item.RuleValue = e.RuleValue
            item.isOverRidable = e.isOverRidable;
            item.isMandatory = e.isMandatory;
            item.IsFixedRuleValue = e.IsFixedRuleValue;
            item.RuleValueEffect = e.RuleValueEffect;
            item.RuleValueEffectTO = e.RuleValueEffectTO;
            item.UserInput = e.UserInput;
            item.isActive = e.isActive;
        }
    }

    openAccessoriesPopup() {
        this.ReturnReasonGridPopup = true;
        this.modalItemModel.open();
    }

    RemoveAccessories() {
        var ind = this.AccessoriesList.map(function (e) { return e.ItemModelID; }).indexOf(this.CurrentAccessories.ItemModelID);
        if (ind > -1) {
            this.AccessoriesList.splice(ind, 1);
            this.AccessoriesGridOptions.api.setRowData(this.AccessoriesList);
            this.CurrentAccessories = null;
        }
    }

    onAccessoriesSelectionChanged() {
        this.CurrentAccessories = this.AccessoriesGridOptions.api.getSelectedRows()[0];
    }

    onDamagedSelectionChanged() {
        this.CurrentDamaged = this.DamagedGridOptions.api.getSelectedRows()[0];
    }

    RemoveDamaged() {
        var idx = this.DamagedList.indexOf(this.CurrentDamaged);
        this.DamagedList.splice(idx, 1);
        this.DamagedGridOptions.api.setRowData(this.DamagedList);
        this.CurrentDamaged = null;
    }

    AddDamaged() {
        this.IsDamagedEditorVisible = true;
    }
    SaveDamaged() {
        if (this.DamagedName == "") {            
            this._util.error('Please enter damaged type.',"Alert");
            return;
        }

        var item = { "DamagedID": 0, "DamagedName": this.DamagedName, "ItemModelID": this.selectedId };
        this.DamagedList.push(item);
        this.IsDamagedEditorVisible = false;
        this.DamagedName = "";
        this.DamagedGridOptions.api.setRowData(this.DamagedList);
    }
    CancelDamaged() {
        this.IsDamagedEditorVisible = false;
    }

    ItemModelGridEvent(event) {

        this.modalItemModel.close();

        var accessories = this.AccessoriesList.filter(u => u.ItemModelID == event.ModelID);
        if (accessories.length > 0) {
            //this._popup.Alert('Alert', 'Same accessories already exists.');
            this._util.error("Same accessories already exists.", "");
        }
        else {
            this.AccessoriesList.push({
                ItemModelID: event.ModelID,
                ModelName: event.ModelName,
                ModelDescription: event.ModelDescription,
                CategoryName: event.CategoryName
            });

            if (this.AccessoriesGridOptions.api)
                this.AccessoriesGridOptions.api.setRowData(this.AccessoriesList);
        }
    }
}


