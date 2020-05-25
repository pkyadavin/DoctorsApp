import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { routing } from './report.routes';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { InvenoryReportComponent } from './Inventory/inventory.component';
import { ReportService } from './Report.service';
import { ModelService } from '../category/category.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { ModelMasterModule } from '../ModelMaster/modelmaster.module';
import { ModelModule } from '../Category/category.module';
import { ItemCategoryModule } from '../ItemCategory/itemcategory.module';

@NgModule({
    imports: [
        routing, BsModalModule
        , FormsModule, AgGridModule.withComponents([])
        , SharedModule
        , CommonModule
        , MessageModule
         , ModelMasterModule
        , ModelModule
         , ItemCategoryModule
    ],
    declarations: [InvenoryReportComponent]
    , providers: [ReportService, DatePipe, ModelService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ReportModule { }