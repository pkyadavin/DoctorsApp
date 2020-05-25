import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { T3Step1RoutingModule } from './t3-step1-routing.module';
import { T3Step1Component } from './t3-step1.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AddressPopupModule } from '../../../address-popup/address-popup.module';

@NgModule({
  declarations: [T3Step1Component],
  imports: [
    CommonModule,
    T3Step1RoutingModule,
    SharedModule, FormsModule,
    AddressPopupModule,
    NgxUiLoaderModule
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class T3Step1Module { }
