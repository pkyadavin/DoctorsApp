import { Component } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'category-rulevalue-cell',
    template: `
            <input style="width:170px" [disabled]="!enabled" *ngIf="RuleControlTypeID==1653 || RuleControlTypeID==1654" type="textBox" [(ngModel)]="TxtValue"  (keypress)="isNumberorText($event)" (blur)="changeByControl($event)">
            <select style="width:170px" [disabled]="!enabled" *ngIf="RuleControlTypeID==1658" [(ngModel)]="TxtValue" class="form-control" (change)="changeByControl($event)">
                <option [value]="undefined" disabled="disabled">--Select Role--</option>
                <option *ngFor="let role of RoleList" [value]="role.RoleID">
                   {{role.RoleName}}
                </option>
            </select>
    `
})
//<label *ngIf="isOverRidable=='No'" style= "min-width: 200px;" > {{RuleValue }}</label>
//<input *ngIf="isOverRidable=='Yes'"[(ngModel)] = "RuleValue" type= "textbox"(change) = "textboxChange($event)" />
export class CategoryRuleValueComponent implements AgEditorComponent {
    private params: any;
    TxtValue: boolean;
    isOverRidable: any;
    RuleControlTypeID: any;
    RoleList: any[];
    DamageTypeList: any[];
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.TxtValue = params.value;
        this.enabled = this.params.data.isaccount == true ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
        this.RuleControlTypeID = this.params.data.RuleControlTypeID;
        this.RoleList = JSON.parse(this.params.data.RoleControl);
        //this.DamageTypeList = JSON.parse(this.params.data.DamageType);

    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        this.params.data.RuleValue = this.TxtValue;
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);

            if (this.RuleControlTypeID == 1658) {
                this.params.context.componentParent.alerttouser(this.params.data);
            }                        
        }
    }

    isNumberorText(event) {
        if (this.RuleControlTypeID == 1653) {
            return (event.charCode == 8 || event.charCode == 0) ? null : ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode >= 96 && event.charCode <= 105));
        }
        else return true;
    }

}