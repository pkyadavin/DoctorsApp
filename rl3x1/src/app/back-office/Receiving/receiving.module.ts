import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MRNIndex } from './index.receiving.component';
import { MRNEditor } from './receiving-editor.component';
import { MRNScanEditor } from './receivingscan.component';
import { ScanEditor } from './scan.component';
import { PutAwayEditor } from './putaway.component';
import { ReceivingComponent } from '../../controls/Receiving/Receiving.Component';
import { routing } from './receiving.routes';
import { MRNService } from './receiving.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
//import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { StatusComboComponent } from './statuscombo.component';
import { ReceivingQtyEditorComponent } from './receivingqtyeditor.component';
import { DynamicLocation } from './DynamicLocation.component';
//import { DynamicLocation } from '../Receiving/DynamicLocation.component';

@NgModule({
    imports: [routing ,BsModalModule, FormsModule,AgGridModule.withComponents(
        [
            StatusComboComponent,ReceivingQtyEditorComponent
        ]), SharedModule, CommonModule],
    declarations: [MRNIndex
        , MRNEditor
        , MRNScanEditor
        , ScanEditor
        , PutAwayEditor
        , ReceivingComponent
        , StatusComboComponent,
        ReceivingQtyEditorComponent, DynamicLocation
    ]
    , providers: [MRNService]
     ,exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ReceivingModule { }