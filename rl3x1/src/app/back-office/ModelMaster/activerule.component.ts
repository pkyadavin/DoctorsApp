import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'editor-activerule-cell',
    template: `
            <input [(ngModel)]="ItemCheckValue" type="checkbox" (change)="checkboxChange($event)" style="opacity:1 !important;left:14px;"/>
    `
})

export class ActiveRuleComponent implements AgEditorComponent {
    private params: any;
    ItemCheckValue: boolean;

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.ItemCheckValue = params.value;
    }

    getValue(): any {
        return this.ItemCheckValue;
    }

    public checkboxChange(e) {
        this.params.data.isActive = this.ItemCheckValue;
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