import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { routing } from './returnreason.routes';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { ReturnReasonGrid } from './returnreason.component';
import { ReturnReasonEditor } from './returnreason-editor.component';
import { ReturnReasonService } from './returnreason.service';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { LanguageService } from '../language/language.service';
@NgModule({
    imports: [MessageModule
        , routing
        , FormsModule, CommonModule, AgGridModule.withComponents(
        [
            ImageColumnComponent
        ]), SharedModule, CommonModule],
    declarations: [ReturnReasonGrid, ReturnReasonEditor]
    , providers: [ReturnReasonService, LanguageService]
    , exports: [
        RouterModule,
        ReturnReasonGrid, ReturnReasonEditor
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ReturnReasonModule { }