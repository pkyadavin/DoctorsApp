import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'editor-chekbox-cell',
    template: `
            <input [disabled]="!enabled" [(ngModel)]="ItemCheckValue" type="checkbox" (change)="checkboxChange($event)" style="opacity:1 !important;left:14px;"/>
    `
})

export class checkBoxComponent implements AgEditorComponent {
    private params: any;
    ItemCheckValue: boolean;
    IsComboLoaded: boolean = false;
    enabled: boolean;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.ItemCheckValue = params.value;
        this.enabled = this.params.data.isActive;
    }

    getValue(): any {
        return this.ItemCheckValue;
    }

    public checkboxChange(e) {
        this.params.data.isOverRidable = this.ItemCheckValue;
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