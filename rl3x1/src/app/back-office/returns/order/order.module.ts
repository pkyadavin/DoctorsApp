import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReturnsService } from '../returns.service';
import { BsModalModule } from 'ng2-bs3-modal';
import { AddressPopupModule } from 'src/app/pages/portal/address-popup/address-popup.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [OrderComponent],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    BsModalModule,
    OrderRoutingModule,
    FormsModule,
    SharedModule,
    AddressPopupModule
  ],
  providers:[ReturnsService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class OrderModule { }
