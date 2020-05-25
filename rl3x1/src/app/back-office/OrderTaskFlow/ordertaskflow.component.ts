import { Component, Pipe, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { OrderTaskFlowService } from './ordertaskflow.service';
import { OrderTaskFlowModel, TaskFlowDetail, TaskDetail } from './ordertaskflow.model';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../../shared/common.service';
import { message, modal } from '../../controls/pop/index.js';
import { BsModalComponent } from 'ng2-bs3-modal'
import { Router, ActivatedRoute } from '@angular/router';
import { OrderBy } from "../../pipes/orderby.pipe";
import { Util } from 'src/app/app.util';

declare var $: any;

@Component({
    selector: 'Order-TaskFlow',
    styles: ['>>> .modal-xl {width: 55%}'],
    providers: [OrderTaskFlowService, CommonService],
    templateUrl: './ordertaskflow.html'
})

export class OrderTaskFlow {
    @Input() TaskModuleID: number;
    @Output() notifyOrderTaskFlow: EventEmitter<OrderTaskFlowModel> = new EventEmitter<OrderTaskFlowModel>();
    @ViewChild('OrderTaskFlowPopUp')
    modal: BsModalComponent;
    CurrentTaskFlow: OrderTaskFlowModel;
    LocalAccess: ["Add", "Edit", "Delete"];
    errorMessage: string;
    mType: number;
    TaskFlowPopup: boolean = true;
    TaskFlowID: number=0;
    ActionList: any;
    TaskFlowDetailCollection: TaskFlowDetail[];
    SetCurrentState: number=0;
    SetNextState: number = 0;
    SetActionID: number = 0;
    SetActionName: string = "";
    SetActionOrder: number = 0;
    SetRuleList: any;
    SetStatusList: any;

    constructor(private _util:Util,private $OrderTaskFlowService: OrderTaskFlowService, private $CommonService: CommonService, private activatedRoute: ActivatedRoute) {       
       
    }

    ngOnInit() {
        //this.TaskModuleID = 1120; //RMA Order

        this.$CommonService.getModuleStatus(this.TaskModuleID)
            .subscribe(
            _status => {
                this.SetStatusList = _status;
            },
            error => this.errorMessage = <any>error);

        this.$OrderTaskFlowService.getModuleRules(this.TaskModuleID)
            .subscribe(
            _rules => {
                this.SetRuleList = _rules;
            },
            error => this.errorMessage = <any>error);

        this.$OrderTaskFlowService.getTaskActions(this.TaskModuleID)
            .subscribe(
            _actions => {
                this.ActionList = _actions;

                this.$OrderTaskFlowService.getTaskFlow(this.TaskModuleID)
                    .subscribe(
                    _taskFlow => {
                        this.CurrentTaskFlow = new OrderTaskFlowModel(_taskFlow[0][0]);

                        if (this.CurrentTaskFlow.TaskFlowDetails.length > 0) {
                            this.TaskFlowDetailCollection = JSON.parse(this.CurrentTaskFlow.TaskFlowDetails);
                        }
                        else {
                            this.TaskFlowDetailCollection = [];
                        }

                        this.TaskFlowID = this.CurrentTaskFlow.ModuleWorkFlowID;

                        this.ClearTask();

                        this.CurrentTaskFlow.TaskFlowDetails = this.TaskFlowDetailCollection;
                        this.notifyOrderTaskFlow.emit(this.CurrentTaskFlow);
                    },
                    error => this.errorMessage = <any>error);
            },
            error => this.errorMessage = <any>error);
       
    }
    @ViewChild('pop') _popup: message;


    AddEditTaskFlow(actionId: number, sortOrder: number, actionName: string, divId:string) {

        this.SetActionID = actionId;
        this.SetActionName = actionName;
        this.SetActionOrder = sortOrder;
        this.SetCurrentState = 0;
        this.SetNextState = 0;
        for (let r of this.SetRuleList) {
            r.isSelected = false;
        }
        var taskdetail = $.grep(this.TaskFlowDetailCollection, function (n, i) { return n.ModuleActionMapID == actionId });

        if (taskdetail.length > 0) {
            this.SetCurrentState = taskdetail[0].CurrentModuleStatusMapID;
            this.SetNextState = taskdetail[0].NextModuleStatusMapID;

            var savedRules = taskdetail[0].ActionRules;

            if (savedRules.length > 0) {
                var savedRuleIds = $.map(savedRules, function (n, i) {
                    return n.ModuleRuleMapID;
                });

                for (let r of this.SetRuleList) {
                    if ($.inArray(r.ModuleRuleMapID, savedRuleIds) > -1) { // (r.ModuleRuleMapID == savedRules.ModuleRuleMapID) {
                        r.isSelected = true;
                    }
                    else {
                        r.isSelected = false;
                    }
                }
            }
            
           //var selectedRules = savedRules.filter(r => r.isSelected == true).map(function (e) {
           //     return e;
           // })
        }

        this.modal.open();
        
    }

    onDropTaskDetails(e: any) {

        if (this.ActionList.length > 0) {

            var sortIndex = 0;

            for (let action of this.ActionList) {

                sortIndex = sortIndex + 1;

                for (let task of this.TaskFlowDetailCollection) {
                    if (action.ModuleActionMapID == task.ModuleActionMapID) {
                        task.ActionOrder = sortIndex;
                        break;
                    }
                }
                action.SortOrder = sortIndex;
            }
        }
        this.CurrentTaskFlow.TaskFlowDetails = this.TaskFlowDetailCollection;
        this.notifyOrderTaskFlow.emit(this.CurrentTaskFlow);
    }

    onSaveTaskFlowDetailEvent(retObj: TaskDetail) {

        //if (retObj.IsError) {
        //    this._popup.Alert('Alert', retObj.ErrorMessage);
        //    return;
        //}

        this.modal.close();
        //this.modal.dismiss();
        var actionrules = [];

        var taskdetail = $.grep(this.TaskFlowDetailCollection, function (n, i) { return n.ModuleActionMapID == retObj.ActionID });
        if (taskdetail.length > 0) {
            taskdetail[0].CurrentModuleStatusMapID = retObj.CurrentState;
            taskdetail[0].NextModuleStatusMapID = retObj.NextState;
            taskdetail[0].ActionOrder = retObj.ActionOrder;

            taskdetail[0].ActionRules = [];

            if (this.SetRuleList.length > 0) {

                for (let r of this.SetRuleList) {
                    if (r.isSelected) {
                        let newItem = { ModuleWFDetailRuleMapID: 0, ModuleWorkFlowDetailID: taskdetail[0].ModuleWorkFlowDetailID, ModuleRuleMapID: r.ModuleRuleMapID }
                        actionrules.push(newItem);
                    }
                }
            }
            taskdetail[0].ActionRules = actionrules;
        }
        else {

            if (this.SetRuleList.length > 0) {

                for (let r of this.SetRuleList) {
                    if (r.isSelected) {
                        let newItem = { ModuleWFDetailRuleMapID: 0, ModuleWorkFlowDetailID: 0, ModuleRuleMapID: r.ModuleRuleMapID }
                        actionrules.push(newItem);
                    }
                }
            }
            var sortOrder = 1;
            if (this.TaskFlowDetailCollection.length > 0){
                sortOrder = this.TaskFlowDetailCollection[this.TaskFlowDetailCollection.length - 1].ActionOrder + 1;
            }
            
            this.SetActionOrder = sortOrder;
            this.SetCurrentState = 0;
            this.SetNextState = 0;

            let newTaskDetailItem = { ModuleWorkFlowDetailID: 0, ModuleWorkFlowID: this.TaskFlowID, CurrentModuleStatusMapID: retObj.CurrentState, NextModuleStatusMapID: retObj.NextState, ModuleActionMapID: retObj.ActionID, ActionOrder: sortOrder, ActionRules: actionrules };
            this.TaskFlowDetailCollection.push(newTaskDetailItem);
        }

        this.ClearTask();

        this.CurrentTaskFlow.TaskFlowDetails = this.TaskFlowDetailCollection;
        this.notifyOrderTaskFlow.emit(this.CurrentTaskFlow);
    }

    onClearTaskFlowDetailEvent(retObj: TaskDetail)
    {
        //this._popup.Confirm('Clear', 'Do you really want to remove this item?', function () {

        //    this.modal.close();

        //    var taskDetail = $.grep(this.TaskFlowDetailCollection, function (n, i) { return n.ModuleActionMapID == retObj.ActionID });

        //    if (taskDetail.length > 0) {
        //        var indx = this.TaskFlowDetailCollection.map(function (e) { return e; }).indexOf(taskDetail);
        //        this.TaskFlowDetailCollection.splice(indx, 1);
        //    }
        //});
        this.modal.close();
        var taskDetail = $.grep(this.TaskFlowDetailCollection, function (n, i) { return n.ModuleActionMapID == retObj.ActionID });

        if (taskDetail.length > 0) {
            var indx = this.TaskFlowDetailCollection.map(function (e) { return e.ModuleActionMapID; }).indexOf(taskDetail[0].ModuleActionMapID);
            this.TaskFlowDetailCollection.splice(indx, 1);
        }

        this.ClearTask();

        this.CurrentTaskFlow.TaskFlowDetails = this.TaskFlowDetailCollection;
        this.notifyOrderTaskFlow.emit(this.CurrentTaskFlow);
       
    }

    onCancelTaskFlowDetailEvent(e) {
        this.modal.close();
    }

    ClearTask() {
        //-----------Highlight actions with color based on task states available of not------------------------------------------
        if (this.ActionList.length > 0) {

            //var actionIds = this.TaskFlowDetailCollection.filter(t => t.CurrentModuleStatusMapID > 0 && t.NextModuleStatusMapID > 0).map(function (e) {
            //    return e.ModuleActionMapID;
            //})
            //var actionIds = $.map(this.TaskFlowDetailCollection, function (n, i) {
            //    return n.ModuleActionMapID;
            //});

            for (let action of this.ActionList) {

                var taskDetail = this.TaskFlowDetailCollection.filter(t => t.CurrentModuleStatusMapID > 0 && t.NextModuleStatusMapID > 0 && t.ModuleActionMapID == action.ModuleActionMapID).map(function (e) {
                    return e;
                })

                if (taskDetail.length > 0) {
                    var fromStatus = '';
                    var toStatus = '';
                    fromStatus = this.SetStatusList.filter(s => s.ModuleStatusMapID == taskDetail[0].CurrentModuleStatusMapID).map(function (e) {
                        return e.StatusName;
                    })

                    toStatus = this.SetStatusList.filter(s => s.ModuleStatusMapID == taskDetail[0].NextModuleStatusMapID).map(function (e) {
                        return e.StatusName;
                    })
                    action.IsTask = true;
                    action.currState = fromStatus; //taskDetail[0].CurrentModuleStatusMapID;
                    action.nextState = toStatus; //taskDetail[0].NextModuleStatusMapID;
                    if (taskDetail[0].ActionRules.length > 0) {
                        action.IsRule = true;
                    }
                    else {
                        action.IsRule = false;
                    }
                }
                else {
                    action.IsTask = false;
                    action.currState = '';
                    action.nextState = '';
                    action.IsRule = false;
                }
            }
        }
            //---------------------------------------------------------------------------------------------------------------------
    }
}