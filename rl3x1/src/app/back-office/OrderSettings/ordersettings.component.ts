import { BrowserModule } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { OrderSettingsService } from './ordersettings.service';
import { OrderTaskFlowService } from '../OrderTaskFlow/ordertaskflow.service';
import { orderSettings } from './ordersettings.model';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { GridOptions } from 'ag-grid-community'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Tabs } from '../../controls/tabs/tabs.component.js';
import { Tab } from '../../controls/tabs/tab.component.js';
import { MetadataService } from '../MetadataConfig/metadata-config.Service.js';
import { TypeLookUp } from '../region/typelookup.model';
import { message, modal } from '../../controls/pop/index.js';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderTaskFlowModel } from '../OrderTaskFlow/ordertaskflow.model';
import { CommonService } from '../../shared/common.service'
import { ReturnReasonCustomer } from '../Partner/returnreasonforcustomer.component'
import { CustomerRegions } from '../Region/customerregion.component'
import { SidebarService } from '../sidebar/sidebar.service';
import { Util } from 'src/app/app.util';
declare var $: any;

@Component({
    selector: 'all-ordersettings',
    //styles: ['>>> .modal-xxl { width: 1100px; }', '>>> .modal-xl { width: 60%!important; }'],
    providers: [MetadataService],
    templateUrl: './ordersettings.template.html'
})

export class OrderSettings {
    Settings: orderSettings;
    TaskFlows: OrderTaskFlowModel = new OrderTaskFlowModel();;
    SetModuleID: any;
    LocalAccess: ["Add", "Edit", "Delete"];
    errorMessage: string='';
    mType: number;
    reg: any;
    regTask: any;
    moduleTitle: any;
    moduleWFList: any;
    isWorkFlowSaved: boolean = true;
    isWFPopup: boolean = false; 
    @ViewChild('ReturnReason') _ReturnReason: ReturnReasonCustomer;
    CarrierListType: string = "Customer";
    partnerId: number = 0;

    @ViewChild('workflowPopUp') _workFlow: BsModalComponent;
    constructor(private _util:Util,private _menu:SidebarService, private _router:Router, private $OrderSetting: OrderSettingsService, private $OrderTaskFlow: OrderTaskFlowService, private $Config: MetadataService, private activatedRoute: ActivatedRoute, private _globalService: GlobalVariableService, public commonService: CommonService, private activateRoute: ActivatedRoute) {       
        this.activatedRoute.params.subscribe(
            (param: any) => {
                this.mType = param['ID'];
                this.SetModuleID = this.mType;
            });
            this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        this.loadPermissionByModule(this.moduleTitle);
    }
    ngOnInit() {
        this.$OrderSetting.getOrderSetting(this.mType)
            .subscribe(
            _OrderSettings => {
                this.Settings = new orderSettings(_OrderSettings[0][0]);    
                 
                //console.log(_OrderSettings[0][0].TabList[0].TabControls);            
            },
            error => this.errorMessage = <any>error);

    }
    @ViewChild('pop') _popup: message;
    @ViewChild('CustomerRegion') _customerRegion: CustomerRegions;

    controlObject(n1) {
        if (n1.ControlType == 'checkbox') {
            return $.map(n1.ControlOptions.filter(f => f.isselected == true), function (n2, i2) {
                return { "ModuleConfigId": n1.ModuleConfigId, "ControlType": n1.ControlType, "ControlValueId": n2.optionid, "ControlCode": n1.ControlCode, "ControlLabel": n1.ControlLabel, "ControlOptions": [], "ChildControls": [], "ControlValue": n2.isselected };
            });
        }
        else if (n1.ControlType == 'radio' || n1.ControlType == 'dropdown') {
            if (n1.ControlValueId != "" && n1.ControlValueId > 0)
                return { "ModuleConfigId": n1.ModuleConfigId, "ControlType": n1.ControlType, "ControlValueId": n1.ControlValueId, "ControlCode": n1.ControlCode, "ControlLabel": n1.ControlLabel, "ControlOptions": [], "ChildControls": [], "ControlValue": true };
        }
        else {
            return { "ModuleConfigId": n1.ModuleConfigId, "ControlType": n1.ControlType, "ControlValueId": null, "ControlCode": n1.ControlCode, "ControlLabel": n1.ControlLabel, "ControlOptions": [], "ChildControls": [], "ControlValue": n1.ControlValue };
        }
    }

    LoadReason() {
        this._customerRegion.InitComponent();
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, Module).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
            }
        )
    }


    Save(me: any = this) {
        if (this._ReturnReason) {
            var rrStatus = this._ReturnReason.onSaveEvent();
            if (rrStatus && !rrStatus.status) {
                this._util.error(rrStatus.msg,"error");
                return;
            }
        }

        var bb = this.Settings;
        var aa = this.Settings.TabList[0].TabName;
        
        var ChildConfigs = [];

        var ModuleConfigs = $.map(this.Settings.TabList, function (n, i) {
            return $.map(n.TabControls, function (n1, i1) {
                if (n1.ChildControls && n1.ChildControls.length > 0) {
                    ChildConfigs.push(me.controlObject(n1.ChildControls[0]));
                }
                return me.controlObject(n1);
            });
        });

        var taskflowdetails = $.map(this.TaskFlows.TaskFlowDetails, function (n, i) {
            return n.CurrentModuleStatusMapID > 0 && n.NextModuleStatusMapID > 0;
        })

        if (taskflowdetails.length == 0) {
            this._util.error('Task Workflow not mapped properly.',"error");
            return;
        }

        ////-----------------------------------------------------
        //Save task flow here
        this.regTask = [{ 'TaskFlow': JSON.stringify(this.TaskFlows) }]
        this.$OrderTaskFlow.Save(this.mType, this.regTask)
            .subscribe(_taskflows => {
                //---------------------------------------------
                this.reg = [{ 'Settings': JSON.stringify($.merge(ModuleConfigs, ChildConfigs)) }];
                this.$OrderSetting.Save(this.mType, this.reg)
                    .subscribe(
                    _Settings => {
                        this._util.success('Settings have been updated successfully.',"success");
                    },
                    error => this.errorMessage = <any>error);
                //---------------------------------------------
            }, error => this.errorMessage = <any>error);
         ////------------------------------------------------------

       
    }
    onSaveTaskFlowEvent(e) {
        this.isWorkFlowSaved = false;
        this.isWorkFlowSaved = true;
        this.TaskFlows = e;
        //this.modal.close();
       
    }

    close() {
        this._workFlow.close();
    }
    viewWorkFlow(event) {
        this.isWFPopup = true;
        var widget = $($(event.target).parents(".widget")[0]);
        var button = $($(event.target)[0]);
        var compress = "fa-compress";
        var expand = "fa-expand";
        if (widget.hasClass("maximized")) {
            if (button) {
                button.addClass(expand).removeClass(compress);
            }
            widget.removeClass("maximized");
            widget.find(".widget-body").css("height", "auto");
        } else {
            if (button) {
                button.addClass(compress).removeClass(expand);
            }
            widget.addClass("maximized");
            if (widget) {
                var windowHeight = $(window).height();
                var headerHeight = widget.find(".widget-header").height();
                widget.find(".widget-body").height(windowHeight - headerHeight);
            }
        }
    }
    //LoadModuleWFData() {
    //    //Load ModuleWF
    //    //this.$OrderSetting.getModuleWFList(this.mType).subscribe(objModule => {
    //    //    this.moduleWFList = objModule[0];
    //    //},
    //    //    error => this.errorMessage = <any>error);
    //}
}