
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductCatalog } from './ProductCatalog.component';
import { routing } from './ProductCatalog.routes';
import { ProductCatalogService } from './ProductCatalog.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import {ExcelService} from './excel.service';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule],
    declarations: [ProductCatalog]
    , providers: [ProductCatalogService,ExcelService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ProductCatalogModule { }
