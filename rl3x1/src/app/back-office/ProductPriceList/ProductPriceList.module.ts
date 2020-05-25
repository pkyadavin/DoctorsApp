
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductPriceList } from './ProductPriceList.component';
import { routing } from './ProductPriceList.routes';
import { ProductPriceListService } from './ProductPriceList.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import {ExcelService} from './excel.service';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule],
    declarations: [ProductPriceList]
    , providers: [ProductPriceListService,ExcelService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ProductPriceListModule { }
