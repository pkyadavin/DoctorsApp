import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community'
import { AgEditorComponent } from 'ag-grid-angular';
declare var $: any;

@Component({
    selector: 'editor-activerule-cell',
    template: `
            <input id="checkbox{{PartnerID}}" [(ngModel)]="DefaultPartnerCheck" type="checkbox" (change)="checkboxChange(PartnerID)" style="opacity:1 !important;left:14px;"/>
    `
})

export class DefaultPartnerComponent implements AgEditorComponent {
    private params: any;
    DefaultPartnerCheck: boolean;
    PartnerID: any;

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.DefaultPartnerCheck = params.value;
        this.PartnerID = params.node.data.PartnerID;
    }

    getValue(): any {
        return this.DefaultPartnerCheck;
    }

    checkboxChange(PartnerID) {

        this.params.api.forEachNode(function (node) {
            node.data.isDefault = false;
        });

        this.params.data.isDefault = this.DefaultPartnerCheck;

        $('#defaultP input[type=checkbox]').each(function () {
            var arr = this.id.split('checkbox');
            this.checked = false;

            if (PartnerID == arr[1]) {
                this.checked = true;
            }
        });
    }

}