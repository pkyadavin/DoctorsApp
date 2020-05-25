import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderSettings } from './ordersettings.component';
import { routing } from './ordersettings.routes';
import { OrderSettingsService } from './ordersettings.service'
import { OrderTaskFlow } from '../OrderTaskFlow/ordertaskflow.component'
import { AddEditOrderTaskFlow } from '../OrderTaskFlow/addedittaskflow.component'
import { OrderTaskFlowService } from '../OrderTaskFlow/ordertaskflow.service'
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
//import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';
import { BsModalModule } from 'ng2-bs3-modal';
import { DndModule } from 'ng2-dnd';
//import { ReturnReasonCustomer } from './returnreasonforcustomer.component'
//import { CustomerRegions } from '../../component/Region/customerregion.component'
import { RegionService } from '../Region/region.service'
import { GCComponent } from 'src/app/controls/GoogleCharts/GoogleChart.component';
import { GCService } from 'src/app/controls/GoogleCharts/GoogleChart.Service';
import { PartnerModule } from '../Partner/partner.module';

@NgModule({
    imports: [BsModalModule,routing, FormsModule,AgGridModule.withComponents(
        [
           
        ]), SharedModule, CommonModule, DndModule.forRoot(), PartnerModule],
    declarations: [OrderSettings, OrderTaskFlow, AddEditOrderTaskFlow, GCComponent] //CustomerRegions
    , providers: [OrderSettingsService, OrderTaskFlowService, RegionService, GCService, NgForm]
     ,exports: [
        RouterModule,OrderSettings, OrderTaskFlow, AddEditOrderTaskFlow,  GCComponent
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class OrderSettingsModule { }