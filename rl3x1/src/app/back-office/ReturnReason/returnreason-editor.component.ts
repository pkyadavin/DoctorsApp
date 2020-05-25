import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service';
import { Tabs } from '../../controls/tabs/tabs.component';
import { Tab } from '../../controls/tabs/tab.component';
import { BsModalComponent } from 'ng2-bs3-modal'
import { eTypeLookup } from '../../shared/constants';
import { message } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { AuthService } from '../../authentication/auth.service';
import { ReturnReasonService } from './returnreason.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReturnReason, ReturnReasonRuleMap } from './returnreason.model';
import { Property, Util, TypedJson } from '../../app.util';
//import { RuleControlTypeComponent } from './ruleControlType.component';
import { checkBoxComponent } from './chkBox.component';
import { ActiveComponent } from 'src/app/shared/active.component';
import { checkBoxMandatoryComponent } from './chkBoxMandatory';
import { checkBoxInputComponent } from './userinput.component';
import { multiplecontrols } from './multiple.controls';
import { effecton } from './effecton.controls';
import { effecttype } from './effecttype.controls';
import { valuetype } from './valuetype.controls';
import { RMAActionCode } from '../RMAActionCode/rmaactioncode.model';
import { SidebarService } from '../sidebar/sidebar.service';
import { LanguageService } from '../language/language.service';
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
declare var $: any;

@Component({
    selector: 'ReturnReason-Editor',
    providers: [ReturnReasonService, CommonService, AuthService, ApplicationInsightsService],
    templateUrl: './returnreason-editor.html'
})

export class ReturnReasonEditor extends Property {
    @ViewChild('pop') _popup: message;
    @ViewChild('fulfilmentPopUp') _popupfulfilmentPopUp: BsModalComponent;
    @Output() EditorVisibilityChange = new EventEmitter();
    @Input() selectedId: number;
    @Input() permission: boolean;
    @Input() GridType: string;
    @Input() Scope: string;
    @Input() access: any;
    isFirstTimeLoad: boolean = true;
    isSaveClick: boolean = false;
    currentReason: ReturnReason = new ReturnReason();
    moduleTitle: any;
    returnReasonEditor: any;
    IsLoaded: boolean = false;
    AllAvailableRules: any;
    availableRuleMap: any;
    RuleMaped: any;
    AllReturnType: any;
    ReturnTypeMaped: Array<any> = new Array<any>();
    CurrentReturnType: any;
    RuleMapCollection: any;
    ControlTypeList: any;
    selectedRuleMap: any;
    ShowFulfilmentType: boolean;
    IsShowRule: boolean = false;
    controlTypeListHtml: string;
    agGridOptionRuleMap: GridOptions;
    agGridfulfilment: GridOptions;
    agGridfulfilmentcolumnDefs: any = [
        //{ headerName: "Code", field: "RMAActionCode", width: 250, editable: false, suppressFilter: true },
        { headerName: "Fulfilment", field: "RMAActionName", width: 250, editable: false, suppressFilter: true }
    ];
    OverRidable: boolean;
    IsRuleSelected: boolean = true;
    errorMsg: string = "";
    RuleMapcolumnDefs: any =
        [
            {
                headerName: "Active", field: "isActive", width: 70, suppressFilter: true,
                cellRendererFramework: ActiveComponent, editable: false
            },
            { headerName: "Rule Name", field: "RuleName", width: 250, editable: false, suppressFilter: true },
            //{
            //    headerName: "Rule Control Type", field: "RuleControlTypeID", width: 150,
            //    cellRendererFramework: RuleControlTypeComponent, editable: false
            //},
            //{ headerName: "Rule Control Type", field: "ControlTypeName", width: 150, editable: false },
            {
                headerName: "Overidable", field: "isOverRidable", width: 100,
                cellRendererFramework: checkBoxComponent, editable: false, suppressFilter: true
            },
            {
                headerName: "Mandatory", field: "isMandatory", width: 110,
                cellRendererFramework: checkBoxMandatoryComponent, editable: false, suppressFilter: true
            },
            {
                headerName: "Rule Value", field: "RuleValue", width: 150,
                cellRendererFramework: multiplecontrols, editable: false, suppressFilter: true
            },
            {
                headerName: "User Input?", field: "UserInput", width: 110, hide: true,
                cellRendererFramework: checkBoxInputComponent, editable: true, suppressFilter: true
            },
            {
                headerName: "Based On", field: "RuleValueEffectTO", width: 150,
                cellRendererFramework: effecton, editable: false
            },
            {
                headerName: "Trigger Value", field: "RuleValueEffect", width: 150, suppressFilter: true,
                cellRendererFramework: effecttype, editable: false
            },
            {
                headerName: "Value Type", field: "IsFixedRuleValue", width: 100, suppressFilter: true,
                cellRendererFramework: valuetype, editable: false
            },
            //{
            //    headerName: "Rule Group", field: "RuleGroup", width: 150
            //},
        ];
    public Languages: any = [];

    @ViewChild('retReasonGridPopUp') modalReturnReason: BsModalComponent;
    partnerID: any;

    constructor(private _util: Util, private _menu: SidebarService, private _returnReasonService: ReturnReasonService,
        private _router: Router, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService,
        private commonService$: CommonService, private _LoginService: AuthService, private languageService: LanguageService,
        private _appInsightService: ApplicationInsightsService) {
        super();
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        // this.getControlList();
        this.agGridOptionRuleMap = {
            rowData: this.RuleMaped,
            columnDefs: this.RuleMapcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'multiple',
            context: {
                componentParent: this
            }
        };
        this.agGridfulfilment = {
            rowData: this.ReturnTypeMaped,
            columnDefs: this.agGridfulfilmentcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'multiple',
            context: {
                componentParent: this
            }
        };

        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.filterText = null;
        this.ReturnReasondataSource = null;
    }

    ngOnInit() {
        this._appInsightService.logPageView("Return Reason Editor", this._router.url);
        this.LocalAccess = this.access;
        this.languageService.GetMappedLanguages().subscribe(data => {
            this.Languages = data;
        });
        this.returnReasonInit();
        this.LoadParentReturnReasonPopupGrid();
    }

    notifyParent() {
        this.agGridOptionRuleMap.api.refreshView();
    }

    openFulfilmentPopup() {
        this._popupfulfilmentPopUp.open();
    }

    notifyFulfilment(e) {
        var ind = this.ReturnTypeMaped.map(function (e1) { return e1.RMAActionCodeID; }).indexOf(e.RMAActionCodeID);
        if (ind > -1) {
            this._util.error('Fulfilment type already exists.', "Alert");
        }
        else {
            this.ReturnTypeMaped.push({ RMAActionCodeMapID: 0, RMAActionCodeID: e.RMAActionCodeID, RMAActionCode: e.RMAActionCode, RMAActionName: e.RMAActionName });
            this.agGridfulfilment.api.setRowData(this.ReturnTypeMaped);
            this._popupfulfilmentPopUp.close();
        }
    }
    onSelectedfulfilmentChanged() {
        this.CurrentReturnType = this.agGridfulfilment.api.getSelectedRows()[0];
    }
    RemoveFulfilment() {
        var ind = this.ReturnTypeMaped.map(function (e) { return e.RMAActionCodeID; }).indexOf(this.CurrentReturnType.RMAActionCodeID);
        if (ind > -1) {
            this.ReturnTypeMaped.splice(ind, 1);
            this.agGridfulfilment.api.setRowData(this.ReturnTypeMaped);
            this.CurrentReturnType = null;
        }
    }

    returnReasonInit() {
        this._returnReasonService.loadReturnReasonById(this.selectedId, "RLT002").subscribe(_result => {
            this.IsLoaded = true;
            debugger;
            this.currentReason = this.selectedId > 0 ? _result[0][0] : new ReturnReason();
            if (this.selectedId == 0) {
                this.currentReason = new ReturnReason();
            }
            else {
                this.currentParentReason = _result[5][0] ? _result[5][0] : new ReturnReason();
            }
            //this.currentReason.RMAActionCode = 'AUTO';
            this.currentReason.RMAActionCodeID = this.selectedId;
            this.currentReason.isActive = this.selectedId == 0 ? true : _result[0][0].isActive;
            this.currentReason.RMAActionName = TypedJson.parse(this.currentReason.RMAActionName);
            var localize = JSON.parse(_result[1][0].ColumnDefinations);
            var localeditor = localize.map(function (e) {
                return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
            });
            this.returnReasonEditor = JSON.parse("{" + localeditor.join(',') + "}");
            this.RuleMaped = _result[2];
            var defaultReturnType = { RMAActionCodeID: undefined, RMAActionName: '--Select--' };
            this.AllReturnType = _result[3];
            this.AllReturnType.push(defaultReturnType);
            this.RuleMapCollection = this.RuleMaped;
            if (this.agGridOptionRuleMap.api)
                this.agGridOptionRuleMap.api.setRowData(this.RuleMaped);
            this.ReturnTypeMaped = _result[4];
            if (this.ShowFulfilmentType)
                this.agGridfulfilment.api.setRowData(this.ReturnTypeMaped);

        }, error => this._util.error(error, 'error'));
    }

    moveToMap() {
        var item = new ReturnReasonRuleMap();
        for (let arm of this.availableRuleMap) {
            item.RuleID = arm.RuleID;
            item.RuleName = arm.RuleName;
            item.RuleCode = arm.RuleCode;
            //item.TypeGroupControl = arm.TypeGroupControl;
            item.RoleControl = arm.RoleControl;
            item.DamageControl = arm.DamageControl;
            item.ControlTypeID = arm.ControlTypeID;
            item.ControlTypeName = arm.ControlTypeName;

            var ind = this.AllAvailableRules.map(function (e) { return e.RuleCode; }).indexOf(item.RuleCode);
            if (ind > -1) {
                this.AllAvailableRules.splice(ind, 1);
                this.RuleMapCollection.push(JSON.parse(JSON.stringify(item)));
            }
        }
        this.agGridOptionRuleMap.api.setRowData(this.RuleMapCollection);
    }

    moveAllMap() {
        var fromCollection = $.grep(this.AllAvailableRules, function (value) {
            value.isActive = 1;
            value.isMandatory = 0;
            value.isOverRidable = 0;
            value.RMAActionCodeID = 0;
            value.ReturnReasonRuleMapID = 0;
            value.RuleValue = "";
            return value;
        });

        for (let item of fromCollection) {
            var ind = this.AllAvailableRules.map(function (e) { return e.RuleCode; }).indexOf(item.RuleCode);
            if (ind > -1) {
                this.AllAvailableRules.splice(ind, 1);
                this.RuleMapCollection.push(JSON.parse(JSON.stringify(item)));
            }
        }
        this.agGridOptionRuleMap.api.setRowData(this.RuleMapCollection);
    }

    moveBack() {
        for (let item of this.selectedRuleMap) {
            var ind = this.RuleMapCollection.map(function (e) { return e.RuleCode; }).indexOf(item.RuleCode);
            if (ind > -1) {
                this.RuleMapCollection.splice(ind, 1);
                this.AllAvailableRules.push(item);
            }
        }
        this.agGridOptionRuleMap.api.setRowData(this.RuleMapCollection);
    }

    moveAllBack() {
        var fromCollection = $.grep(this.RuleMapCollection, function (value) {
            return value;
        });

        for (let item of fromCollection) {
            var itemtoMove = this.RuleMapCollection.filter(d => d.RuleCode === item.RuleCode)[0];
            var ind = this.RuleMapCollection.map(function (e) { return e.RuleCode; }).indexOf(item.RuleCode);
            if (ind > -1) {
                this.RuleMapCollection.splice(ind, 1);
                this.AllAvailableRules.push(itemtoMove);
            }
        }
        this.agGridOptionRuleMap.api.setRowData(this.RuleMapCollection);
    }

    onSelectedRuleMap() {
        this.selectedRuleMap = this.agGridOptionRuleMap.api.getSelectedRows();
    }

    CancelForm() {
        this.EditorVisibilityChange.emit(false);
    }

    onSubmit(form: any) {
        var isActiveSelected = false;
        var isFormValid = true;
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
        var me = this;
        var flag = 0;
        var flagRule = 0;
        this.IsRuleSelected = true;
        this.currentReason.Scope = this.Scope;
        this.currentReason.CreatedBy = this.currentReason.ModifyBy = this._LoginService.loginUserID;
        this.currentReason.ReturnReasonRuleMapList = [{ 'ReturnReasonRuleMap': JSON.stringify(this.RuleMaped), 'fulfilmentmap': JSON.stringify(this.ReturnTypeMaped) }];
        this.currentReason.ParentId = this.currentParentReason.RMAActionCodeID;
        var me = this;
        this._returnReasonService.SaveReturnReason(this.currentReason).subscribe(_result => {
            debugger;
            if (_result.RMAActionCodeID >= 0) {

                this._util.success('Saved successfully.', "Success", "Success");
                me.EditorVisibilityChange.emit(true);
            }
            else {
                this._util.error("Return Code/Name is already in use.", "Error");
            }
        }, error => {
            this._util.error(error, "Error");
        });
    }

    //==================Parent Return Reason==================//
    ReturnReasondataSource: any;
    ReturnReasongridOption: GridOptions;
    returnReasons: ReturnReason[];
    IsShowReturnReasonList: boolean = false;
    filterText: string;
    currentParentReason: ReturnReason = new ReturnReason();
    resongridOptionsapi = null;
    resongridColumnsapi = null;
    onReturnReasonGridReady(gridparam) {
        this.resongridOptionsapi = gridparam.api;
        this.resongridColumnsapi = gridparam.columnApi;
    }

    LoadParentReturnReasonPopupGrid() {
        this.ReturnReasongridOption = {
            rowData: this.returnReasons,
            columnDefs: null,
            enableColResize: true,
            rowSelection: 'single',
            rowModelType: "infinite",
            pagination: true,
            paginationPageSize: 500,
            rowHeight: 38,
            maxConcurrentDatasourceRequests: 2,
            suppressRowClickSelection: false,
            context: {
                componentParent: this
            }
        };

        this.LoadReturnReason();

        $('#divHeader').addClass('widget-header widget-header1');
        //this.ReturnReasongridOption.rowSelection = "single";
        this.ReturnReasongridOption.suppressRowClickSelection = false;
        this.IsShowReturnReasonList = false;
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.resongridOptionsapi.setDatasource(this.ReturnReasondataSource);
        //this.isEditVisible = false;
    }

    LoadReturnReason() {
        this.ReturnReasondataSource = null;
        this.ReturnReasondataSource = {
            rowCount: null,
            paginationPageSize: 20,
            paginationOverflowSize: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                var filterData = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }

                this._returnReasonService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID, this.Scope).
                    subscribe(
                        _result => {
                            debugger;
                            var rowsThisPage = _result.recordsets[0];
                            var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);

                            //=========Remove sected reason from list========//
                            if (this.currentReason && this.currentReason.RMAActionCodeID > 0) {

                                var ind = rowsThisPage.map(function (e) { return e.RMAActionCodeID; }).indexOf(this.currentReason.RMAActionCodeID);
                                if (ind > -1) {
                                    rowsThisPage.splice(ind, 1);
                                }
                            }

                            localize.unshift({
                                headerName: "Select Reason",
                                width: 100,
                                //headerCellRenderer: this.selectAllRenderer,
                                checkboxSelection: true
                            });
                            var coldef4 = localize.find(element => element.field == "isActive");
                            if (coldef4 != null) {
                                coldef4.cellRendererFramework = ActiveComponent;
                            }
                            var coldef2 = localize.find(element => element.field == "OnCP");
                            if (coldef2 != null) {
                                coldef2.cellRendererFramework = ActiveComponent;
                            }

                            var coldef3 = localize.find(element => element.field == "OnBO");
                            if (coldef3 != null) {
                                coldef3.cellRendererFramework = ActiveComponent;
                            }

                            if (!this.resongridColumnsapi.getAllColumns())
                                this.resongridOptionsapi.setColumnDefs(localize);
                            this.returnReasons = _result;
                            var lastRow;
                            //if (this.GridType == "popup")
                            lastRow = rowsThisPage.length;
                            // else
                            //     lastRow = _result.totalcount;

                            params.successCallback(rowsThisPage, lastRow);

                            //this.isEditVisible = false;
                        });
            }
        }
        this.ReturnReasongridOption.datasource = this.ReturnReasondataSource;
    }

    LoadReturnReason1() {
        if (this.resongridOptionsapi && this.currentParentReason && this.currentParentReason.RMAActionCode != 'Auto') {
            this.resongridOptionsapi.forEachNode((node) => {
                if (node.data.RMAActionCodeID === this.currentParentReason.RMAActionCodeID) {
                    node.setSelected(true);
                }
            });
        }
    }

    openReturnReasonGridPopup() {
        this.modalReturnReason.open();
        this.LoadReturnReason1();
    }

    onSelectionChanged() {
        if (this.resongridOptionsapi.getSelectedRows()[0]) {
            this.currentParentReason = this.resongridOptionsapi.getSelectedRows()[0];
        }
        else {
            this.currentParentReason = new ReturnReason();
        }
        this.closeParentReturnReasonPopup();
    }

    closeParentReturnReasonPopup() {
        this.filterText = null;
        this.modalReturnReason.close();
    }

    onRowClicked(e) {
        // //console.log('e: ', e.api.getSelectedNodes()[0].data);
        // var _selectedNode = e.api.getSelectedNodes()[0];
        // this.resongridOptionsapi.api.forEachNode(node => (node.data.RMAActionCodeID === _selectedNode.data.RMAActionCodeID));
        // // if (e.event.target !== undefined) {
        // //     let data = e.data;
        // //     let actionType = e.event.target.getAttribute("data-action-type");
        // //     if (actionType == "selectReason") {
        // //         return this.onActionChk(data);
        // //     }
        // //     else if (actionType == "edit") {
        // //         //this.ShowEditor(data.RMAActionCodeID);
        // //     }
        // // }
    }

    public onActionChk(data: any) {
        //this.notifyReason.emit(data);
    }
    //==================End Parent Return Reason==================//
}



