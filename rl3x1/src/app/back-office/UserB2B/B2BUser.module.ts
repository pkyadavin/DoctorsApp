
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { B2BUser } from './B2BUser.component';
import { routing } from './B2BUser.routes';
import { B2BUserService } from './B2BUser.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import {ExcelService} from './excel.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule,
        NgMultiSelectDropDownModule.forRoot()],
    declarations: [B2BUser]
    , providers: [B2BUserService,ExcelService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class B2BUserModule { }