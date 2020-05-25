import { Component, ElementRef, ErrorHandler, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ReturnTypeService } from './returntype.service';
import { RMAActionCode } from '../RMAActionCode/rmaactioncode.model';
import { Observable } from 'rxjs/Observable';
import { GridOptions } from 'ag-grid-community'
import { Router, ActivatedRoute } from '@angular/router'
import { message, modal } from '../../controls/pop/index.js';
import { Property, Util } from '../../app.util';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { CommonService } from '../../shared/common.service'
import { EditComponent } from 'src/app/shared/edit.component';
import { SidebarService } from '../sidebar/sidebar.service';
import { ActiveComponent } from 'src/app/shared/active.component';
import { PartnerProperties } from '../Partner/partner.properties';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ReturnReasons } from '../Partner/returnreason.component';
declare var $: any;
@Component({
    selector: 'all-returntype',
    templateUrl: './returntype.template.html',
    styles: ['>>> .ag-cell-focus { -webkit-user-select: text !important;-moz-user-select: text !important;-ms-user-select: text !important;user-select: text !important; }']
})
export class ReturnTypeComponent extends PartnerProperties {

    @ViewChild('pop') _popup: message;
    @Input() GridType: string;
    @Output() notifyFulfilment: EventEmitter<RMAActionCode> = new EventEmitter<RMAActionCode>();
    ReturnTypes: Array<RMAActionCode>;
    CurrentReturnType: RMAActionCode;
    ListView: boolean;
    LocalAccess: any = [];
    errorMessage: string;
    moduleTitle: string;
    gridOptions: GridOptions;
    filterValue: string;
    partnerID: any;
    dataSource: any;
    partnerinfo: any;
    isSaveClick: boolean;
    Scope: string;
    UserID: number;
    columnDefs = [
        //{ headerName: 'Return Type', field: "RMAActionName", width: 250 },
        //{ headerName: "Type Code", field: "RMAactionCode", width: 250 },
        //{ headerName: "Created By", field: "CreatedBy", width: 250 },
        //{ headerName: "Created Date", field: "CreatedDate", width: 250 },
        //{ headerName: "Modified By", field: "ModifyBy", width: 250 },
        //{ headerName: "Modified Date", field: "ModifyDate", width: 250 }
    ];


    //============Return Reasons===============//
    dropdownList: Array<any> = [];
    dropdownSettings = {};
    selectedBrands: Array<any> = [];
    SelectedReasonCollection: Array<any> = [];

    @ViewChild('ReturnReasonGrid') _ReturnReasonGrid: ReturnReasons;
    @ViewChild('retReasonGridPopUp') modalReturnReason: BsModalComponent;
    @ViewChild('configPopUp') configPopUp: BsModalComponent;
    ReturnReasonGridPopup: boolean = false;
    configSetup: any;
    setUserGridType: string = "popup";



    // @ViewChild('configPopUp') configPopUp: BsModalComponent;
    // @ViewChild('retReasonGridPopUp') modalReturnReason: BsModalComponent;
    // reasonGridOptions: GridOptions;
    // reasoncolumnDefs = [

    //     { headerName: 'Reason Code', field: "ReasonCode", width: 150 },
    //     { headerName: 'Return Reason', field: "ReasonName", width: 500 },      
    //     { headerName: 'Customer Portal', field: "requiredonCustomerPortal", width: 130, cellRendererFramework: ImageColumnComponent },
    //     { headerName: 'Back Office', field: "RequiredonBackOffice", width: 130, cellRendererFramework: ImageColumnComponent },
    //     {
    //         headerName: 'Action', field: "Action", width: 100,
    //         cellRenderer: function (params: any) {
    //             return `<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" >
    //             <button Id="configureReturnReason" class="btn btn-primary btn-sm">
    //             <i Id="configureReturnReason" class="fa fa-gear"></i>
    //             </button>

    //             <button Id="deleteReturnReason" class="btn btn-danger btn-sm">
    //             <i Id="deleteReturnReason" class="fa fa-trash"></i>
    //             </button>
    //             </div>`;
    //         }
    //     }
    // ]
    // SelectedReasonCollection:any=[];

    // ReturnReasondataSource: any;
    // ReturnReasonGridPopup: boolean = false;
    // ReturnReasongridOption:GridOptions;
    // AllreasoncolumnDefs = [
    //     { headerName: "Select Reason",width: 150,checkboxSelection: true},
    //     { headerName: 'Reason Code', field: "ReasonCode", width: 150 },
    //     { headerName: 'Return Reason', field: "ReasonName", width: 300 },  
    //     { headerName: 'Active', field: "isActive", width: 100, cellRendererFramework: ActiveComponent },    
    //     { headerName: 'Customer Portal', field: "requiredonCustomerPortal", width: 130, cellRendererFramework: ImageColumnComponent },
    //     { headerName: 'Back Office', field: "RequiredonBackOffice", width: 130, cellRendererFramework: ImageColumnComponent }
    // ]
    //AllReasonCollection: any=[];
    // [
    //     { ReasonCode:'ACC001',ReasonName: 'Test 123', requiredonCustomerPortal: true, RequiredonBackOffice: true }
    // ];

    // dropdownList:Array<any>;
    // dropdownSettings = {};  
    // selectedBrands:Array<any>;

    // setUserGridType: string = "popup";
    // rrgridapi = null;  

    constructor(private _util: Util, private element: ElementRef, private $ReturnType: ReturnTypeService, private _menu: SidebarService, private _router: Router, private commonService: CommonService, private _globalService: GlobalVariableService, private activatedRoute: ActivatedRoute) {
        super()
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;
        this.loadPermissionByModule(this.moduleTitle);

        this.activatedRoute.params.subscribe(
            (param: any) => {
                this.Scope = param['Scope'];
            });
        if (this.GridType == 'popup') {
            this.Scope = 'RR002'
        }

        this.gridOptions = {
            // rowData: this.ReturnTypes,
            // columnDefs: null,
            // enableColResize: true,
            // enableServerSideSorting: true,
            // pagination: true,
            // //enableServerSideFilter: true,
            // rowModelType: "infinite",
            // paginationPageSize: 20,
            // //paginationOverflowSize: 2,
            // rowSelection: 'single',
            // maxConcurrentDatasourceRequests: 2,
            // //paginationInitialRowCount: 1,
            // //maxPagesInCache: 2,
            // context: {
            //     componentParent: this
            // }

            rowData: this.ReturnTypes,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single',
            rowDeselection: true,
            rowModelType: 'infinite',
            pagination: true,
            paginationPageSize: 20,
            cacheOverflowSize: 20,
            maxConcurrentDatasourceRequests: 2,
            infiniteInitialRowCount: 1,
            maxBlocksInCache: 20,
            cacheBlockSize: 20,
            rowHeight: 38,
            context: {
                componentParent: this
            }
        };
        this.partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.dataSource = {
            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            paginationOverflowSize: 20,
            maxConcurrentDatasourceRequests: 2,
            maxPagesInPaginationCache: 20,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }

                this.$ReturnType.getallReturnTypes(this.partnerinfo.LogInUserPartnerID, params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.Scope)
                    .subscribe(
                        _Orders => {
                            this.LocalAccess = _Orders.recordsets[2].map(function (e) { return e.FunctionType });
                            
                            this.ReturnTypes = _Orders.recordsets[0];
                            var localize = JSON.parse(_Orders.recordsets[1][0].ColumnDefinations);
                            this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                            var localeditor = localize.map(function (e) {
                                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + '}';
                            });

                            this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                            if (this.GridType == "popup") {
                                this.h_localize.unshift({
                                    headerName: "Select",
                                    width: 100,
                                    template: `<button class="btn-link" type="button" data-action-type="SelectFulfilment">Select</button>`
                                });
                            }

                            var coldef = this.h_localize.find(element => element.field == "RMAActionName");
                            if (coldef != null && this.hasPermission("View")) {
                                coldef.cellRendererFramework = EditComponent;
                            }

                            var coldef1 = this.h_localize.find(element => element.field == "RMAActionCode");
                            if (coldef1 != null && this.hasPermission("View")) {
                                coldef1.cellRendererFramework = EditComponent;
                            }

                            var coldef2 = this.h_localize.find(element => element.field == "isActive");
                            if (coldef2 != null) {
                                coldef2.cellRendererFramework = ActiveComponent;
                            }
                            
                            if (!this.gridOptions.columnApi.getAllColumns())
                                this.gridOptions.api.setColumnDefs(this.h_localize);
                            var lastRow = _Orders.totalcount;
                            if (this.ReturnTypes.length <= 0)
                                this.gridOptions.api.showNoRowsOverlay();
                            else
                                this.gridOptions.api.hideOverlay()
                            params.successCallback(this.ReturnTypes, lastRow);

                            this.CurrentReturnType = new RMAActionCode();
                        },
                        error => this.errorMessage = <any>error);
            }
        }
        this.gridOptions.datasource = this.dataSource;
        this.CurrentReturnType = new RMAActionCode();
        this.ListView = true;
    }

    ngOnInit() {

        //=============Return Resons==========//
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'PartnerID',
            textField: 'PartnerName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 2,
            allowSearchFilter: true
        };
        this.reasonGridOptions = {
            rowData: this.SelectedReasonCollection,
            columnDefs: this.reasoncolumnDefs,
            enableColResize: true,
            rowHeight: 38,
            maxConcurrentDatasourceRequests: 2,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };

        //   this.ReturnReasongridOption = {
        //       rowData: this.AllReasonCollection,
        //       columnDefs: this.AllreasoncolumnDefs,
        //       enableColResize: true,
        //       //enableServerSideSorting: true,
        //       //enableServerSideFilter: true,
        //       rowModelType: "infinite",
        //       pagination: true,
        //       paginationPageSize: 500,
        //       //paginationOverflowSize: 2,
        //       //rowSelection: 'multiple',
        //       maxConcurrentDatasourceRequests: 2,
        //       //paginationInitialRowCount: 1,
        //       //maxPagesInCache: 2,
        //       suppressRowClickSelection: false,
        //       context: {
        //           componentParent: this
        //       }
        //   };
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "SelectFulfilment") {
                this.notifyFulfilment.emit(data);
            }
        }
    }

    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterValue);
    }

    onSelectionChanged() {
        this.CurrentReturnType = new RMAActionCode(this.gridOptions.api.getSelectedRows()[0]);
    }
    EditClicked(val) {
        this.CurrentReturnType = val;
        if (val.isActive == 'Yes')
            this.CurrentReturnType.isActive = true;
        else
            this.CurrentReturnType.isActive = false;

        //this.getReturnReasons(this.CurrentReturnType.RMAActionCode);

        this.Show(this.CurrentReturnType.RMAActionCode);
    }
    Show(id) {
        if (id == 0)
            this.CurrentReturnType = new RMAActionCode();
        this.ListView = false;
        this.getReturnReasons(id);
        //console.log('e value:', this.e_localize);
    }
    Save(form: any, me: any = this) {
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            })
            this.isSaveClick = true;
            this._util.error('Please enter all required fields.', 'Error');
            return;
        }

        //console.log('Available reasosn:',this.AvailableReasons);
        if (this.Scope == 'RR005') {
            this.CurrentReturnType.Parameters = JSON.stringify(this.selectedBrands);
            this.CurrentReturnType.SelectedReturnReasons = this.AvailableReasons
        }
        //console.log('CurrentReturnType:',this.CurrentReturnType);
        this.reg = [{ 'returntype': JSON.stringify(this.CurrentReturnType), 'Scope': this.Scope }];
        this.$ReturnType.Save(this.reg)
            .subscribe(
                _Orders => {
                    // console.log('orders:', _Orders);
                    var SubmitType: string = "";
                    if (this.Scope == 'RR002')
                        SubmitType = "Fulfilment type"
                    else if (this.Scope == 'RR004')
                        SubmitType = "Item Grade"
                    else if (this.Scope == 'RR005')
                        SubmitType = "Return Reason Category"
                    else
                        SubmitType = "Pickup Type"

                    // if(_Orders.error)
                    // {
                    //     this._util.error(SubmitType + _Orders.error.message, 'error');
                    //     return;
                    // }

                    var me = this
                    this._util.success(SubmitType + (this.CurrentReturnType.RMAActionCodeID == 0 ? ' created' : ' updated ') + ' successfully.', "Success", "Success");

                    // this._popup.Alert('Alert', SubmitType + (this.CurrentReturnType.RMAActionCodeID == 0 ? ' created' : ' updated ') + ' successfully.')
                    this.ListView = true;
                },
                error => {
                    this.errorMessage = <any>error
                    this._util.error(this.errorMessage, 'Error');
                });
    }
    Delete(me: any = this) {
        var DeleteType: string = "";
        if (this.Scope == 'RR002')
            DeleteType = "Fulfilment type"
        else if (this.Scope == 'RR004')
            DeleteType = "Item Grade"
        else
            DeleteType = "Pickup Type"

        this._popup.Confirm('Delete', 'Do you really want to remove this ' + DeleteType + '?', function () {
            me.$ReturnType.Delete(me.CurrentReturnType.RMAActionCodeID)
                .subscribe(
                    _Order => {
                        me._util.success(DeleteType + ' deleted.', "Success", "Success");
                        me.gridOptions.api.setDatasource(me.dataSource);
                    },
                    error => {
                        me.errorMessage = <any>error;
                        me._util.error(error, "Error");
                    });
        });
    }
    Cancel() {
        this.CurrentReturnType = new RMAActionCode();
        this.ListView = true;
    }
    async loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        await this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
            }
        )
    }

    //================Return Reason===========//

    openReturnReasonGridPopup() {
        this.ReturnReasonGridPopup = true;
        this.modalReturnReason.open();
        this._ReturnReasonGrid.filterText = null;
        this._ReturnReasonGrid.LoadReturnReason1();
    }
    ApplyConfigSetup() {
        this.reasonGridOptions.api.refreshView();
        //this.AvailableReasons[0].configSetupVal.requiredonCustomerPortal = this.configSetup.requiredonCustomerPortal;
        this.configPopUp.close();
    }
    RR_EditClicked(data, Action) {
        if (this.Scope == "RR005" && Action == 'Configure') {
            this.configPopUp.open();
            this.configSetup = data;
            this.SetConfigSetup();
        }
    }
    SetConfigSetup() {
        //this.AvailableReasons.configSetupVal = true;
    }
    rrgridapi = null;
    onReasonGridReady(gridParams) {
        this.rrgridapi = gridParams.api;
    }
    onSelectedReasonChanged(me: any = this) {
        let data = me.rrgridapi.getSelectedRows()[0];
        me.CurrentReturnReason = me.rrgridapi.getSelectedRows()[0];
        me.AvailableRules = me.AllRuleCollection.filter(ur => ur.ReasonID == data.ReasonID).map(function (e) {
            e.isaccount = (me.Scope != "RR005");
            return e;
        })

        if (me.AvailableRules.length > 0) {

            me.ruleGridOptions.api.setRowData(me.AvailableRules);
            me.ruleGridOptions.api.forEachNode(function (node) {
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
        debugger
        var me = this;
        this.modalReturnReason.close();
        this.ReturnReasonGridPopup = false;
        var msg: string = "";

        $.each(event, function (i, v) {
            //var reasons = me.AvailableReasons.filter(u => u.ReasonID == v.RMAActionCodeID);
            var reasons = me.AvailableReasons.filter(u => u.ReasonID == v.RMAActionCodeID);
            if (reasons.length > 0) {
                msg = msg + v.RMAActionName + ", ";
                //me._popup.Alert('Alert', 'Same Reason already exists.');
            }
            else {
                me.AvailableReasons.push({
                    //PartnerReturnReasonMapID: 0,
                    CategoryReturnReasonMapId: 0,
                    ReasonID: v.RMAActionCodeID,
                    ReasonCode: v.RMAActionCode,
                    ReasonName: v.display_name,
                    isActive: true,
                    //ReturnType: v.ReturnType,
                    //TypeName: v.TypeName,
                    //ApproverOne: false,
                    //ApproverTwo: false,
                    //ProofPurchase: false,
                    //DamageEvidence: false,
                    requiredonCustomerPortal: v.RequiredonCustomerPortal
                    , RequiredonBackOffice: v.RequiredonBackOffice
                    , FileMandatory: v.FileUploadRequired
                    , CommentMandatory: v.CommentRequired
                    //, CommentRequired: v.CommentRequired
                    , ApprovalRequired: v.ApprovalRequired

                });
            }
        });

        if (msg.length > 0) {
            //this._Util.info("skipped " + msg + ", already exists.", "Alert");
        }

        if (this.rrgridapi) {
            //this.rrgridapi.setRowData(this.SelectedReasonCollection);
            this.rrgridapi.setRowData(this.AvailableReasons);
        }

        if (this.AvailableReasons.length != 0 && this.rrgridapi) {
            this.rrgridapi.forEachNode(function (node) {
                node.setSelected(true);
            });
        }
    }

    deleteReturnReason(e) {

        if (e.event.target != undefined) {
            let actionType = e.event.target.getAttribute("Id");
            if (actionType == "deleteReturnReason") {
                //let itemToDelete = e.data;
                // console.log(e.data);
                // var idx = this.AllReasonCollection.indexOf(itemToDelete);               
                // this.AllReasonCollection.splice(idx, 1);
                // this.reasonGridOptions.api.setRowData(this.AllReasonCollection);

                //let itemToDelete = this.AvailableReasons.filter(_item => _item.ReasonID == e.data.ReasonID)
                //var idx = this.AvailableReasons.indexOf(itemToDelete);
                //this.AvailableReasons.splice(idx, 1);
                this.AvailableReasons = this.AvailableReasons.filter(_item => _item.ReasonID != e.data.ReasonID)
                this.reasonGridOptions.api.setRowData(this.AvailableReasons);


            }
            else if (actionType == "configureReturnReason") {
                this.RR_EditClicked(e.data, 'Configure')
            }
        }

    }


    onItemSelect(item: any) {
        //console.log(item);
        //console.log('called12',this.selectedBrands);
    }
    onSelectAll(items: any) {
        //this.selectedBrands=items;
        //console.log(items);
    }

    getReturnReasons(_RMAActionCode) {
        debugger;
        this.AvailableReasons = [];
        this.$ReturnType.getCategoryWiseReturnResons(_RMAActionCode).subscribe(_reasons => {
            console.log('res:', _reasons);
            this.dropdownList = JSON.parse(_reasons.recordsets[0][0].all_assigned_brands);
            this.selectedBrands = JSON.parse(_reasons.recordsets[1][0].selected_brands);

            this.SelectedReasonCollection = JSON.parse(_reasons.recordsets[2][0].selected_return_reasons);
            //this.AllReasonCollection=JSON.parse(_reasons.recordsets[3][0].all_return_reasons);

            if (this.SelectedReasonCollection) {
                this.AvailableReasons = this.SelectedReasonCollection //this.AllReasonCollection;
            }
            if (this.rrgridapi) {
                this.rrgridapi.setRowData(this.AvailableReasons);
            }
            if (this.AvailableReasons.length != 0 && this.rrgridapi) {
                this.rrgridapi.forEachNode(function (node) {
                    if (node.childIndex === 0) {
                        node.setSelected(true);
                    }
                });
            }
        });
    }
}