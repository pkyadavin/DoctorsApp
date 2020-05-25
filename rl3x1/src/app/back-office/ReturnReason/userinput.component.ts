import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'input-chekbox-cell',
    template: `
            <input [disabled]="!enabled" [(ngModel)]="ItemCheckValue" type="checkbox" (change)="checkboxChange($event)" style="opacity:1 !important;left:14px;"/>
    `
    //template: `<label style="float:right!important; margin-top:8px!important;">
    //                                        <input  class="checkbox-slider colored-palegreen cb_parent"  type="checkbox"  (change)="checkboxChange($event)" [(ngModel)]="ItemCheckValue">
    //                                        <span class="text"></span>
    //                                    </label>`
})

export class checkBoxInputComponent implements AgEditorComponent {
    private params: any;
    ItemCheckValue: boolean;
    IsComboLoaded: boolean = false;
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.enabled = this.params.data.isaccount == 1 ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
        this.ItemCheckValue = params.value;
    }

    getValue(): any {
        return this.ItemCheckValue;
    }

    public checkboxChange(e) {
        this.params.data.UserInput = this.ItemCheckValue;
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);
        }
        //console.log(this.params);
        //  this.params.context.ShowOrder("a");
        //console.log(e);
        //this.params.column.gridOptionsWrapper.gridOptions.api.startEditingCell({
        //    rowIndex: this.params.node.rowIndex,
        //    colKey: this.params.column.colId,
        //    keyPress: this.ItemStatusID,
        //    charPress: this.ItemStatusID
        //});
        //this.params.column.gridOptionsWrapper.gridOptions.api.stopEditing();
    }

}