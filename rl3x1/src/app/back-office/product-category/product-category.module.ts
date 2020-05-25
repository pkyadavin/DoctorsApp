
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductCategory } from './product-category.component';
import { routing } from './product-category.routes';
import { ProductCtegoryService } from './product-category.service'
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
    declarations: [ProductCategory]
    , providers: [ProductCtegoryService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ProductCategoryModule { }