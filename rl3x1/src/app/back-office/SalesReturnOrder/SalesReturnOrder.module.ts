import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { routing } from './SalesReturnOrder.routes';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { ReturnQtyEditorComponent } from './ReturnQtyEditor.component';
import { SROrderEditor } from './SalesReturnOrder-editor.component';
import { SalesReturnOrderGrid } from './SalesReturnOrder.component';
import { returnreasoncontrols } from './multiple.controls';
import { SalesReturnOrderService } from './SalesReturnOrder.service';


@NgModule({
    imports: [routing, BsModalModule, CommonModule, FormsModule,AgGridModule.withComponents(
        [
            ReturnQtyEditorComponent, returnreasoncontrols
        ]), SharedModule, CommonModule],
    declarations: [ ReturnQtyEditorComponent, SROrderEditor
        , SalesReturnOrderGrid, returnreasoncontrols
    ]
    , providers: [SalesReturnOrderService]
     ,exports: [
        RouterModule,
        ReturnQtyEditorComponent, SROrderEditor
        , SalesReturnOrderGrid, returnreasoncontrols
    ],
    entryComponents: [
        
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class SalesReturnOrderModule { }