import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueueRoutingModule } from './queue-routing.module';
import { GaQueueComponent } from './queue.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { EditComponent } from 'src/app/shared/edit.component';
import { FormsModule } from '@angular/forms';
import { GaReturnsService } from '../ga_returns.service';

@NgModule({
  declarations: [GaQueueComponent],
  imports: [
    CommonModule,
    QueueRoutingModule,    
    SharedModule,
    AgGridModule.withComponents([EditComponent]),
    FormsModule
  ],
  providers:[GaReturnsService]
})
export class GaQueueModule { }
