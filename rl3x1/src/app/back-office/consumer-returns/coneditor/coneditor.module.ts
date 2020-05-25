import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConeditorRoutingModule } from './coneditor-routing.module';
import { ConeditorComponent } from './coneditor.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { TooltipModule } from 'ngx-tooltip';
import { ConsumerReturnsService } from '../consumer-returns.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [ConeditorComponent],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    ConeditorRoutingModule,
    FormsModule,
    SharedModule,
    BsModalModule,
    TooltipModule
  ],
  providers: [ConsumerReturnsService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ConeditorModule { }
