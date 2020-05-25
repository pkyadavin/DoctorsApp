import { Component, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';

//import { ICellEditorAngularComp } from 'ag-grid-angular/main';

import { AgEditorComponent } from 'ag-grid-angular';

@Component({
    selector: 'numeric-cell',
    template: ` <input type="textBox" [(ngModel)]="TxtValue"  (keypress)="isNumberorText($event)" (blur)="changeByControl($event)">`//`<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value"/>`
})
export class NumericEditorComponent implements AgEditorComponent {

    private params: any;
    RoleList: any[];
    TxtValue: string;
    RuleControlTypeID: any;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.TxtValue = params.value;
    }

    getValue(): any {
        return this.TxtValue;
    }

    public changeByControl(e) {
        this.params.data.Quantity = this.TxtValue;
    }


    isNumberorText(event) {
      //  return false;
        return (event.charCode == 8 || event.charCode == 0) ? null : ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode >= 96 && event.charCode <= 105));
      
    }

   
}


