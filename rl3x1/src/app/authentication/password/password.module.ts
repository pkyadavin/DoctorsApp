import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { PasswordComponent } from './password.component';
import { FormsModule } from '@angular/forms';
import { message} from 'src/app/controls/pop';


@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    FormsModule
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class PasswordModule { }
