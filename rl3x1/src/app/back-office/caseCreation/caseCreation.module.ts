
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { caseCreation } from './caseCreation.component';
import { routing } from './caseCreation.routes';
import { caseCreationService } from './caseCreation.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule,
        NgMultiSelectDropDownModule.forRoot()],
    declarations: [caseCreation]
    , providers: [caseCreationService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class caseCreationModule { }