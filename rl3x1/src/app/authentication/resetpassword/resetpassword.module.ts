import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetpasswordComponent } from './resetpassword.component';
import { ResetPwdRoutingModule } from './resetpassword-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResetpasswordComponent],
  imports: [
    CommonModule,
    ResetPwdRoutingModule,
    FormsModule
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ResetpasswordModule { }
