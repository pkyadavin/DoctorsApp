
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Orders } from './Orders.component';
import { routing } from './Orders.routes';
import { OrdersService } from './Orders.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
@NgModule({
    imports: [routing, MessageModule,
      BsDatepickerModule.forRoot(),
      FormsModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, FormsModule, CommonModule],
    declarations: [Orders]
    , providers: [OrdersService]
    , exports: [
        RouterModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class OrdersModule { }
