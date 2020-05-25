import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Regions } from './region.component';
import { routing } from './region.routes';
import { RegionService } from './region.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { SelectComponent } from './select.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [MessageModule, routing, FormsModule, BsModalModule, AgGridModule.withComponents(
        [
            
        ]), SharedModule,NgMultiSelectDropDownModule.forRoot(), CommonModule],
    declarations: [SelectComponent, Regions]
    , providers: [RegionService]
    , exports: [
        RouterModule, 
        SelectComponent
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class RegionModule { }