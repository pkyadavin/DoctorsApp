import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConqueueRoutingModule } from './conqueue-routing.module';
import { ConqueueComponent } from './conqueue.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { EditComponent } from 'src/app/shared/edit.component';

@NgModule({
  declarations: [ConqueueComponent],
  imports: [
    CommonModule,
    ConqueueRoutingModule  ,
    SharedModule,
    AgGridModule.withComponents([EditComponent]),
    FormsModule
  ]
})
export class ConqueueModule { }
