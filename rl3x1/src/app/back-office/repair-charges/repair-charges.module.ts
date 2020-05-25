
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { repair_charges } from './repair-charges.component';
import { routing } from './repair-charges.routes';
import { Repair_ChargesService } from './repair-charges.service'
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
    declarations: [repair_charges]
    , providers: [Repair_ChargesService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class Repair_ChargesModule { }