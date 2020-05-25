import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookupRoutingModule } from './lookup-routing.module';
import { LookupComponent } from './lookup.component';
import { ReturnsService } from '../returns.service';
import { FormsModule } from '@angular/forms';
import { ReturnDataService } from '../returns-data.service';
import { LanguageService } from '../../language/language.service';

@NgModule({
  declarations: [LookupComponent],
  imports: [
    CommonModule,
    LookupRoutingModule,
    FormsModule
  ],
  providers:[ReturnsService, LanguageService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class LookupModule { }
