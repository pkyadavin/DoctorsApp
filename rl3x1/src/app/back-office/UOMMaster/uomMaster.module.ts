import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { UOMMasterGrid } from './uomMaster.component';
import { UOMMasterEditor } from './uomMaster-editor.component';
import { routing } from './uomMaster.routes';
import { UOMMasterService } from './uomMaster.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
//import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';

@NgModule({
    imports: [
        //routing,
        FormsModule, AgGridModule.withComponents([]), SharedModule
        , CommonModule
        , MessageModule
    ]
    , declarations: [UOMMasterGrid, UOMMasterEditor]
    , providers: [UOMMasterService]
    , exports: [
        UOMMasterGrid
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class UOMMasterModule { }