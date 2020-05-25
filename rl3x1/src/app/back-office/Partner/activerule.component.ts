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
        if (this.params.context.componentParent.notifyChange) {
            this.params.context.componentParent.notifyChange(this.params.data);
        }
    }
}