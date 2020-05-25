
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { repair_resolution } from './repair-resolution.component';
import { routing } from './repair-resolution.routes';
import { Repair_ResolutionService } from './repair-resolution.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';


@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule],
    declarations: [repair_resolution]
    , providers: [Repair_ResolutionService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class Repair_ResolutionModule { }