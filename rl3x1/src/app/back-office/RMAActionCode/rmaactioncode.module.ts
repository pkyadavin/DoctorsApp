import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RMAActionCodeGrid } from './rmaactioncode-grid.component';
import { RMAActionCodeEditor } from './rmaactioncodeeditor.component';
import { routing } from './rmaactioncode.routes';
import { RMAActionCodeService } from './rmaactioncode.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
@NgModule({
    imports: [BsModalModule,routing, FormsModule,AgGridModule.withComponents(
        [
            ImageColumnComponent
        ]), SharedModule, CommonModule],
    declarations: [RMAActionCodeGrid
        , RMAActionCodeEditor
    ]
    , providers: [RMAActionCodeService]
     ,exports: [
        RouterModule

    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class RMAActionCodeModule { }