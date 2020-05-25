import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConinitiateRoutingModule } from './coninitiate-routing.module';
import { ConinitiateComponent } from './coninitiate.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {TooltipModule} from "ngx-tooltip";

@NgModule({
  declarations: [ConinitiateComponent],
  imports: [
    CommonModule,
    ConinitiateRoutingModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ConinitiateModule { }
