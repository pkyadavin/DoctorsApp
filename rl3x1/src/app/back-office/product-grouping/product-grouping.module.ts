
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductGrouping } from './product-grouping.component';
import { routing } from './product-grouping.routes';
import { ProductGroupingService } from './product-grouping.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import { GrdFilterPipe } from './grid-filter.pipe';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule],
    declarations: [ProductGrouping,GrdFilterPipe]
    , providers: [ProductGroupingService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ProductGroupingModule { }