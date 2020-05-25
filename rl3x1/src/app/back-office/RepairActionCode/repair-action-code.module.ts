import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairActionCodeComponent } from './repairactioncode.component';
import { NgForm, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RepairActionCodeComponent],
  imports: [
    FormsModule,
    CommonModule
  ],
  providers:[NgForm],
  schemas:[NO_ERRORS_SCHEMA]
})
export class RepairActionCodeModule { }
