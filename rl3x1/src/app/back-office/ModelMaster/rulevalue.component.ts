import { Component } from '@angular/core';
//import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'editor-rulevalue-cell',
    template: `
            <input style="width:170px" [disabled]="isOverRidable=='No'" *ngIf="RuleControlTypeID==1653 || RuleControlTypeID==1654" type="textBox" [(ngModel)]="TxtValue"  (keypress)="isNumberorText($event)" (blur)="changeByControl($event)">
            <select style="width:170px" [disabled]="isOverRidable=='No'" *ngIf="RuleControlTypeID==1658" [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">
                <option [value]="undefined" disabled="disabled">--Select Role--</option>
                <option *ngFor="let role of RoleList" [value]="role.RoleID">
                    {{role.RoleName}}
                </option>
            </select>
    `
})
//<label *ngIf="isOverRidable=='No'" style= "min-width: 200px;" > {{RuleValue }}</label>
//<input *ngIf="isOverRidable=='Yes'"[(ngModel)] = "RuleValue" type= "textbox"(change) = "textboxChange($event)" />
export class RuleValueComponent implements AgEditorComponent {
    private params: any;
    TxtValue: boolean;
    isOverRidable: any;
    RuleControlTypeID: any;
    RoleList: any[];
    DamageTypeList: any[];

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.TxtValue = params.value;
        this.isOverRidable = params.node.data.isOverRidable;
        this.RuleControlTypeID = this.params.data.RuleControlTypeID;
        this.RoleList = JSON.parse(this.params.data.RoleControl);
        //this.DamageTypeList = JSON.parse(this.params.data.DamageType);

    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        this.params.data.RuleValue = this.TxtValue;
    }

    isNumberorText(event) {
        if (this.RuleControlTypeID == 596) {
            return (event.charCode == 8 || event.charCode == 0) ? null : ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode >= 96 && event.charCode <= 105));
        }
        else return true;
    }

}