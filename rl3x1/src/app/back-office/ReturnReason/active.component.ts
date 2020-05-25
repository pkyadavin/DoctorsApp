import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'active-chekbox-cell',
    //template: 
    //`
    //        <input [(ngModel)]="ItemCheckValue" type="checkbox" (change)="checkboxChange($event)" style="opacity:1 !important;left:14px;"/>
    //`
    template: `<label style="float:right!important; margin-top:5px!important;margin-left:-8px!important;">
                                            <input  class="checkbox-slider colored-palegreen cb_parent"  type="checkbox"  (change)="checkboxChange($event)" [(ngModel)]="ItemCheckValue">
                                            <span class="text"></span>
                                        </label>`
})

export class ActiveComponent implements AgEditorComponent {
    private params: any;
    ItemCheckValue: boolean;
    IsComboLoaded: boolean = false;

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
        this.params.context.componentParent.notifyParent();
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);
        }
        //if (this.params.data.isActive) {
        //    this.params.node.setSelected(true);
        //}
        //else {
        //    this.params.node.setSelected(false);
        //}
            
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