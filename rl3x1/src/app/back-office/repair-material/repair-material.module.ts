
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RepairMaterial } from './repair-material.component';
import { routing } from './repair-material.routes';
import { RepairMaterialService } from './repair-material.service'
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
    declarations: [RepairMaterial]
    , providers: [RepairMaterialService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class RepairMaterialModule { }