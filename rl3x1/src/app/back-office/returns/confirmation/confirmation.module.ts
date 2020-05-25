import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { ConfirmationComponent } from './confirmation.component';
import { ReturnsService } from '../returns.service';
import { FormsModule } from '@angular/forms';
import { ReturnDataService } from '../returns-data.service';
import { LanguageService } from '../../language/language.service';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    ConfirmationRoutingModule,
    FormsModule,
    NgxPrintModule
  ],
  providers:[ReturnsService, LanguageService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ConfirmModule { }
