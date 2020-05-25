import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'editor-chekbox-cell',
    template: `
            <input [disabled]="!enabled" [(ngModel)]="ItemCheckMandatoryValue" type="checkbox" (change)="checkboxMandatoryChange($event)" style="opacity:1 !important;left:14px;"/>
    `
})

export class checkBoxMandatoryComponent implements AgEditorComponent {
    private params: any;
    ItemCheckMandatoryValue: boolean;
    IsComboLoaded: boolean = false;
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.ItemCheckMandatoryValue = params.value
        this.enabled = this.params.data.isaccount == 1 ? (this.params.data.isOverRidable.toString().toUpperCase() == "YES" && this.params.data.isActive) : this.params.data.isActive;
    }

    getValue(): any {
        return this.ItemCheckMandatoryValue;
    }

    public checkboxMandatoryChange(e) {
        this.params.data.isMandatory = this.ItemCheckMandatoryValue;
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