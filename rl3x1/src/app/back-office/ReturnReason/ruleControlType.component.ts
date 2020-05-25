//import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
//import { GridOptions } from 'ag-grid-community'
//import { AgEditorComponent } from 'ag-grid-angular';
//import { MetadataService } from '../../component/MetadataConfig/metadata-config.service'; 

//@Component({
//    selector: 'editor-cell',
//    providers: [MetadataService],
//    template: `
//        <div #container>
//                    <select [(ngModel)]="ItemStatusID" class="form-control" (change)="comboChange($event)">
//                        <option [value]="undefined" disabled="disabled">--Select Status--</option>
//                        <option *ngFor="let Status of ControlTypeList" [value]="Status.TypeLookUpID">
//                            {{Status.TypeName}}
//                        </option>
//                    </select>
//         </div>
//    `
//})

//export class RuleControlTypeComponent implements AgEditorComponent {
//    private params: any;
//    ControlTypeList: any[];
//    ItemStatusID: number;
//    IsComboLoaded: boolean = false;


//    constructor(
//        private _metaDataConfig: MetadataService) {
       
//    }

//    agInit(params: any): void {
//        this.params = params;
//        this.ItemStatusID = params.value;
//        this.ControlTypeList = JSON.parse(this.params.data.TypeGroupControl);
//    }

//    getValue(): any {
//        return this.ItemStatusID;
//    }

//    public comboChange(e) {
//        this.params.data.RuleControlTypeID = this.ItemStatusID;
//        this.params.context.componentParent.notifyParent();
//    }

//}