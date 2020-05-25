import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueRoutingModule } from './queue-routing.module';
import { QueueComponent } from './queue.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ReturnsService } from '../returns.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from 'src/app/shared/edit.component';

@NgModule({
  declarations: [QueueComponent],
  imports: [
    CommonModule,
    QueueRoutingModule,
    SharedModule,
    AgGridModule.withComponents([EditComponent]),
    FormsModule,
    BsDatepickerModule.forRoot()
  ],
  providers:[ReturnsService]
})
export class GnQueueModule { }
