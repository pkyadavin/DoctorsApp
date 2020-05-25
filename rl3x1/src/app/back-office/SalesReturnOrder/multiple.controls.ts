import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'returnreason-controls',
    template: `
            <select [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">
                    <option value=""  selected="selected">--Select--</option>
                    <option *ngFor="let rma of ReturnTypeList" [value]="rma.RMAActionCodeID">
                        {{rma.RMAActionName}}
                    </option>
             </select>
    `
})

export class returnreasoncontrols implements AgEditorComponent {
    private params: any;
    ReturnTypeList: any[];
    TxtValue: string;
    ControlTypeID: any;
    DamageList: any[];
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        if (params.data.ReturnReasonID == null)
            params.data.ReturnReasonID = "";
        this.params = params;
        this.TxtValue = params.data.ReturnReasonID;
        //this.enabled = this.params.data.isaccount == true ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
        //this.ControlTypeID = this.params.data.ControlTypeID
        this.ReturnTypeList = JSON.parse(this.params.data.ReturnTypeList);
        //this.DamageList = JSON.parse(this.params.data.DamageControl);
    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        this.params.data.ReturnReasonID = this.TxtValue;
        this.params.context.componentParent.ChangeReturnReason(this.params.data, e);
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);
        }
    } 

}