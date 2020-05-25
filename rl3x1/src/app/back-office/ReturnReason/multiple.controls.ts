import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'multiple-controls',
    template: `
            <input [disabled]="!enabled" class="form-control" *ngIf="ControlTypeID==1653 || ControlTypeID==1654" type="textBox" [(ngModel)]="TxtValue" (keypress)="isNumberorText($event)" (blur)="changeByControl($event)">
            
            <select [disabled]="!enabled" *ngIf="ControlTypeID==1658" [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">
                    <option value=""  selected="selected">--Select--</option>
                    <option *ngFor="let role of RoleList" [value]="role.RoleID">
                        {{role.RoleName}}
                    </option>
             </select>
    `
})

export class multiplecontrols implements AgEditorComponent {
    private params: any;
    RoleList: any[];
    TxtValue: string;
    ControlTypeID: any;
    DamageList: any[];
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        if (params.value == null)
            params.value = "";
        this.params = params;
        this.TxtValue = params.value;
        this.enabled = this.params.data.isaccount == true ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
        this.ControlTypeID = this.params.data.ControlTypeID
        this.RoleList = JSON.parse(this.params.data.RoleControl);
        //this.DamageList = JSON.parse(this.params.data.DamageControl);
    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        this.params.data.RuleValue = this.TxtValue;
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