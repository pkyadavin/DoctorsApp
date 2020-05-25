import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';
@Component({
    selector: 'editor-cell',
    template: `
        <div #container>
            <button  [disabled]="Quantity == 1 || TypeCode == 'ITR002'" type="button" class="btn btn-default btn-sm btn-prev" (click)="less()" style="padding:1px 4px!important;position:relative;"> <i class="fa fa-angle-left"></i></button>
                <label style="min-width: 30px;">{{Quantity}}</label>
            <button [disabled]="Quantity == MaxQuantity || TypeCode == 'ITR002'" type="button" class="btn btn-default btn-sm btn-next" (click)="more()" style="padding:1px 4px!important;position:relative;"><i class="fa fa-angle-right"></i></button>
        </div>
    `
})
export class ReturnQtyEditorComponent implements AgEditorComponent {
    params: any;
    ID: number;
    IsSerializable: boolean;
    Quantity: number;
    MaxQuantity: number;
    SODetailID: number;
    TypeCode: string;


    agInit(params: any): void {
        this.params = params;
        this.Quantity = params.value;
        this.MaxQuantity = params.node.data.MaxQuantity || params.node.data.ItemQty;
        this.SODetailID = params.node.data.SODetailID;
        this.TypeCode = params.node.data.TypeCode;
    }

    getValue(): any {
        return this.Quantity;
    }

    more() {
        this.Quantity += 1;    
        this.params.data.Quantity = this.Quantity;
        if (this.params.context.componentParent.ItemQuantityChanged) {
            this.params.context.componentParent.ItemQuantityChanged(this.params.data);
        }
    }

    less() {
        if (this.Quantity > 1) {
            this.Quantity -= 1;
            this.params.data.Quantity = this.Quantity;
            if (this.params.context.componentParent.ItemQuantityChanged) {
                this.params.context.componentParent.ItemQuantityChanged(this.params.data);
            }
        }
    }
}