import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'valuetype-controls',
    template: `<select [disabled]="!enabled" *ngIf="ControlTypeID==1653" [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">' +
                        '<option value="" selected="selected" >--Select--</option>' +
                        '<option value="1">FIXED</option>' +
                        '<option value="0">% OF</option>' +
                        '</select>
<input [disabled]="!enabled" class="form-control" *ngIf="ControlTypeID==1658" type="textBox" [(ngModel)]="TxtValue" (keypress)="isNumberorText($event)" (blur)="changeByControl($event)">`
})

export class valuetype implements AgEditorComponent {
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
        this.enabled = this.params.data.isaccount == true ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
        //this.TxtValue = params.value == "1" ? "1" : (params.value == false ? "0" : params.value);
        this.TxtValue = params.value;
        this.ControlTypeID = this.params.data.ControlTypeID
    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        //this.params.data.IsFixedRuleValue = this.TxtValue == "1" ? true : (this.TxtValue == "0" ? false : this.TxtValue);
        this.params.data.IsFixedRuleValue = this.TxtValue;
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);
        }
    }

    isNumberorText(event) {
        
        if (this.ControlTypeID == 1653 || this.ControlTypeID == 1658) {
            return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
        }
        else return true;
    }

}