import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { T3RoutingModule } from './t3-routing.module';
import { T3Component } from './t3.component';
import { TemplateServices } from '../template.service';
import { ReturnService } from '../return.service';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  declarations: [T3Component],
  providers: [TemplateServices],
  imports: [
    CommonModule,
    T3RoutingModule,
    FormsModule, NgxUiLoaderModule
  ]
})
export class T3Module { }
