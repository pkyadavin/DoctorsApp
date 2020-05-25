import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';
import { MRNService } from '../Receiving/receiving.service';
@Component({
    selector: 'editor-cell',
    template: `
        <div #container>
                    <select [(ngModel)]="ItemStatusID"  class="form-control" (change)="comboChange($event)">
                        <option [value]="0">--Select Status--</option>
                        <option *ngFor="let Status of StatusList" [value]="Status.TypeLookUpID">
                            {{Status.TypeName}}
                        </option>
                    </select>
         </div>
    `
})
export class StatusComboComponent implements AgEditorComponent {
    private params: any;
    StatusList: any[];
    ItemStatusID: number;
    IsComboLoaded: boolean = false;

    constructor(
        private mrnService: MRNService) {
        if (!this.IsComboLoaded) {
            this.mrnService.GetAllStatusByType("ItemStatus").subscribe(returnvalue => {
                this.StatusList = returnvalue;
                this.IsComboLoaded = true;
            });
        }
    }

    agInit(params: any): void {
        this.params = params;
        //this.StatusList = [
        //    { "Id": 1, "name": "Receive" },
        //    { "Id": 2, "name": "Inspect" },
        //    { "Id": 3, "name": "Put Away" }
        //];

        
    }

    getValue(): any {
        return this.ItemStatusID;
    }

    comboChange(e) {
        this.params.column.gridOptionsWrapper.gridOptions.api.startEditingCell({
            rowIndex: this.params.node.rowIndex,
            colKey: this.params.column.colId//,
            //keyPress: this.ItemStatusID,
            //charPress: this.ItemStatusID
        });
        //this.params.column.gridOptionsWrapper.gridOptions.api.stopEditing();
    }

}