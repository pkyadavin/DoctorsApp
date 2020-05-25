import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { OrderTaskFlowService } from './ordertaskflow.service';
import { TaskFlowDetail, OrderTaskFlowModel, TaskDetail } from './ordertaskflow.model';
import { OrderTaskFlowProperties } from './ordertaskflow.properties';
import { Observable } from 'rxjs';
import { CommonService } from '../../shared/common.service';
import { message, modal } from '../../controls/pop';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
    selector: 'AddEditOrderTaskFlow',
    providers: [OrderTaskFlowService, CommonService],
    templateUrl: './addedittaskflow.html'
})

export class AddEditOrderTaskFlow {
    @Input() ModuleID: number;
    @Input() ActionID: number;
    @Input() ActionOrder: number;
    @Input() CurrentState: number=0;
    @Input() NextState: number=0;
    @Input() ActionName: string="";
    PassedObject: TaskDetail = new TaskDetail();
    @Output() notifyTaskFlowDetail: EventEmitter<TaskDetail> = new EventEmitter<TaskDetail>();
    @Output() clearTaskFlowDetail: EventEmitter<TaskDetail> = new EventEmitter<TaskDetail>();
    @Output() cancelTaskFlowDetail: EventEmitter<string> = new EventEmitter<string>();
    @Input() StatusList: any;
    @Input() StatusList1: any;
    @Input() RuleList: any;
    LocalAccess: ["Add", "Edit", "Delete"];
    errorMessage: string;

    constructor(private $OrderTaskFlowService: OrderTaskFlowService, private $CommonService: CommonService, private activatedRoute: ActivatedRoute) {       
        this.errorMessage = '';
    }

    ngOnInit() {

    }

    @ViewChild('pop') _popup: message;

    SaveTaskFlow() {

        this.PassedObject.ErrorMessage = '';
        this.PassedObject.IsError = false;
        this.errorMessage = '';
        if (this.CurrentState == 0) {
            //this._popup.Alert('Alert', 'Current State cannot be blank.');
            //this.PassedObject.ErrorMessage = 'Current State cannot be blank.';
            this.errorMessage = 'Current State cannot be blank.';
            //this.PassedObject.IsError = true;
            return;
        }
        else if (this.NextState == 0) {
            //this._popup.Alert('Alert', 'Next State cannot be blank.');
            //this.PassedObject.ErrorMessage = 'Next State cannot be blank.';
            this.errorMessage = 'Next State cannot be blank.';
            //this.PassedObject.IsError = true;
            return;
        }
        else if (this.CurrentState == this.NextState) {
            //this._popup.Alert('Alert', 'Next State cannot be same as Current State.');
            //this.PassedObject.ErrorMessage = 'Next State cannot be same as Current State.';
            this.errorMessage = 'Next State cannot be same as Current State.';
            //this.PassedObject.IsError = true;
            return;
        }
        else {
            this.PassedObject.ActionID = this.ActionID;
            this.PassedObject.CurrentState = this.CurrentState;
            this.PassedObject.NextState = this.NextState;
            this.PassedObject.ActionOrder = this.ActionOrder;
            // this.CurrentState = 0;
            // this.NextState = 0;
        }

        this.notifyTaskFlowDetail.emit(this.PassedObject);
    }

    ClearTaskFlow() {
        //this.ActionID = 0;
        

        this.PassedObject.ActionID = this.ActionID;
        this.PassedObject.CurrentState = this.CurrentState;
        this.PassedObject.NextState = this.NextState;
        this.PassedObject.ActionOrder = this.ActionOrder;
        this.CurrentState = 0;
        this.NextState = 0;
        this.ActionOrder = 0;

        this.clearTaskFlowDetail.emit(this.PassedObject);
    }

    CancelTaskFlow() {
        this.cancelTaskFlowDetail.emit('cancel');
    }
}