import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ShipmentOrder } from './shipment.component';
import { ShipmentOrderEditor } from './shipment-edit.component';
import { routing } from './shipment.routes';
import { ShipmentService } from './shipment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { SalesReturnOrderModule } from '../SalesReturnOrder/SalesReturnOrder.module';
import { EditComponent } from 'src/app/shared/edit.component';

@NgModule({
    imports: [routing, BsModalModule, FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, CommonModule,SalesReturnOrderModule],
    declarations: [ShipmentOrder
        , ShipmentOrderEditor
    ]
    , providers: [ShipmentService]
    , exports: [
        RouterModule

    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ShipmentModule { }