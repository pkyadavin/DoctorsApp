import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ManufacturerComponent } from './Manufacturer.component';
import { routing } from './Manufacturer.routes';
import { ManufacturerService } from './Manufacturer.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';


@NgModule({
    imports: [
        //routing,
        FormsModule, AgGridModule.withComponents([])
        , SharedModule, CommonModule
        , MessageModule
    ]
    , declarations: [ManufacturerComponent]
    , providers: [ManufacturerService]
    , exports: [
        RouterModule, ManufacturerComponent
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ManufacturerModule { }