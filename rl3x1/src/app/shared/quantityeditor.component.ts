import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';
@Component({
    selector: 'editor-cell',
    // template: `
    //    <div #container style="margin-left: -5px">
    //        <button *ngIf="Quantity > 1" type="button" class="btn btn-default btn-sm btn-prev" (click)="less()" style="padding:1px 4px!important;position:relative;top:-3px;"> <i class="fa fa-angle-left"></i></button>
    //            <label>{{Quantity}}</label>
    //        <button *ngIf="!IsSerializable" type="button" class="btn btn-default btn-sm btn-next" (click)="more()" style="padding:1px 4px!important;position:relative;top:-3px;"><i class="fa fa-angle-right"></i></button>
    //    </div>
    //`
    template: `
        <div #container>
            <button *ngIf="ID == 0 && !IsSerializable" [disabled]="Quantity == 1" type="button" class="btn btn-default btn-sm btn-prev" (click)="less()" style="padding:1px 4px!important;position:relative;"> <i class="fa fa-angle-left"></i></button>
                <label style="min-width: 55px;">{{Quantity}}</label>
            <button *ngIf="ID == 0 && !IsSerializable" type="button" class="btn btn-default btn-sm btn-next" (click)="more()" style="padding:1px 4px!important;position:relative;"><i class="fa fa-angle-right"></i></button>
        </div>
    `
})
export class QuantityEditorComponent implements AgEditorComponent {
    params: any;
    ID: number;
    IsSerializable: boolean;
    Quantity: number;

    agInit(params: any): void {
        this.params = params;
        this.ID = params.node.data.RMARepairPartID;
        this.Quantity = params.value;
        this.IsSerializable = params.node.data.ItemReceiveType.TypeCode == 'ITR002' ? true : false;
        //console.log(this.params);
    }

    getValue(): any {
        return this.Quantity;
    }

    more() {
        this.params.column.gridOptionsWrapper.gridOptions.api.startEditingCell({
            rowIndex: this.params.node.rowIndex,
            colKey: this.params.column.colId,
            keyPress: null,
            charPress: (this.Quantity + 1).toString()
        });
        this.Quantity += 1;
        //this.params.column.gridOptionsWrapper.gridOptions.api.stopEditing();
    }

    less() {
        if (this.Quantity > 1) {
            this.params.column.gridOptionsWrapper.gridOptions.api.startEditingCell({
                rowIndex: this.params.node.rowIndex,
                colKey: this.params.column.colId,
                keyPress: null,
                charPress: (this.Quantity - 1).toString()
            });
            this.Quantity -= 1;
            //this.params.column.gridOptionsWrapper.gridOptions.api.stopEditing();
        }
    }
}