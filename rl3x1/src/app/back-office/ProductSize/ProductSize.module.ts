
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductSize } from './ProductSize.component';
import { routing } from './ProductSize.routes';
import { ProductSizeService } from './ProductSize.service'
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
    declarations: [ProductSize]
    , providers: [ProductSizeService]
    , exports: [
        RouterModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ProductSizeModule { }
