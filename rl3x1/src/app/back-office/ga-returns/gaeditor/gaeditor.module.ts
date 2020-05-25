import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GaeditorRoutingModule } from './gaeditor-routing.module';
import { GaeditorComponent } from './gaeditor.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { GaReturnsService } from '../ga_returns.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {TooltipModule} from "ngx-tooltip";
@NgModule({
  declarations: [GaeditorComponent],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    GaeditorRoutingModule,
    FormsModule,
    SharedModule,
    BsModalModule,
    TooltipModule
  ],
  providers: [GaReturnsService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GaeditorModule { }
