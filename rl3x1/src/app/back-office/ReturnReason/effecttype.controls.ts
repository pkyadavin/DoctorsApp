import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'multiple-controls',
    template: `<select [disabled]="!enabled" *ngIf="ControlTypeID==1653" [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">' +
                   '<option value="" selected="selected" >--Select--</option>' +
                    '<option value="1">+</option>' +
                    '<option value="2">-</option>' +
                    '<option value="3">*</option>' +
                    '<option value="4">/</option>' +
                    '</select>
                    <select [disabled]="!enabled" *ngIf="ControlTypeID==1658" [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">' +
                    '<option value="" selected="selected" >--Select--</option>' +
                    '<option value="5">>=</option>' +
                    '<option value="6"><=</option>' 
                    '</select>`
})

export class effecttype implements AgEditorComponent {
    private params: any;
    RoleList: any[];
    TxtValue: string;
    ControlTypeID: any;
    DamageList: any[];
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        if (params.value == null)
            params.value = "";
        this.TxtValue = params.value;
        this.enabled = this.params.data.isaccount == true ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
        this.ControlTypeID = this.params.data.ControlTypeID
    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        this.params.data.RuleValueEffect = this.TxtValue;
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);
        }
    }


    isNumberorText(event) {
        if (this.ControlTypeID == 1653) {
            return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
        }
        else return true;
    }

}