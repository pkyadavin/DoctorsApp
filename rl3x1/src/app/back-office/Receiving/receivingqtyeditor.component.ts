import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';
@Component({
    selector: 'editor-cell',
    template: `
        <div #container>
            <button  [disabled]="Quantity == 1 || PreviousModuleWorkFlowDetailID>0 || ReceiveType=='Yes'" type="button" class="btn btn-default btn-sm btn-prev" (click)="less()" style="padding:1px 4px!important;position:relative;"> <i class="fa fa-angle-left"></i></button>
                <label style="min-width: 30px;">{{Quantity}}</label>
            <button [disabled]="Quantity == MaxQuantity || PreviousModuleWorkFlowDetailID>0  || ReceiveType=='Yes'" type="button" class="btn btn-default btn-sm btn-next" (click)="more()" style="padding:1px 4px!important;position:relative;"><i class="fa fa-angle-right"></i></button>
        </div>
    `
})
export class ReceivingQtyEditorComponent implements AgEditorComponent {
    params: any;
    ID: number;
    IsSerializable: boolean;
    Quantity: number;
    MaxQuantity: number;
    ReceiveType: string;
    PreviousModuleWorkFlowDetailID: number;

    agInit(params: any): void {
        this.params = params;
        //this.ID = params.node.data.RMARepairPartID;
        this.Quantity = params.value;
        this.MaxQuantity = params.node.data.PendingQuantity;
        this.ReceiveType = params.node.data.ReceiveType;
        this.PreviousModuleWorkFlowDetailID = params.node.data.PreviousModuleWorkFlowDetailID;
        //this.IsSerializable = params.node.data.ItemReceiveType.TypeCode == 'ITR002' ? true : false;
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