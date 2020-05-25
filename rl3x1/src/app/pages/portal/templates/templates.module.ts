import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { TemplateServices } from './template.service';
import { ReturnService } from './return.service';

@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule
  ],
  providers:[TemplateServices, ReturnService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class TemplatesModule { }
