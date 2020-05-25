import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AgingReportGrid } from './agingreport.component';
import { routing } from './agingreport.routes';
import { AgingReportService } from './agingreport.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AgGridModule } from 'ag-grid-angular'; 
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [

        ]), SharedModule, CommonModule],
    declarations: [AgingReportGrid]
    , providers: [AgingReportService]
    , exports: [
        RouterModule

    ],
    schemas:[NO_ERRORS_SCHEMA]
})

export class agingreportModule { }


