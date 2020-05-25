import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpClientModule}from '@angular/common/http'
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { PasswordModule } from './password/password.module';
import { AuthService } from './auth.service';
import { WINDOW_PROVIDERS } from '../app.window';
//import { ResetpasswordModule } from './resetpassword/resetpassword.module';
@NgModule({
  declarations: [AuthenticationComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    PasswordModule,
    HttpClientModule
    //ResetpasswordModule
    //AuthService
  ],
  providers:[AuthService, WINDOW_PROVIDERS],
  schemas:[NO_ERRORS_SCHEMA]
})
export class AuthenticationModule { }
