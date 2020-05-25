import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangepwdComponent } from './changepwd.component';
import { ChangePwdRoutingModule } from './changepwd-routing.module';
import { FormsModule } from '@angular/forms';
//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/public_api';
import { ChangeDetectorStatus } from '@angular/core/src/change_detection/constants';
import { ChangePwdService } from './changepwd.service';

@NgModule({
  declarations: [ChangepwdComponent],
  imports: [
    CommonModule,
    ChangePwdRoutingModule,
    FormsModule,
    //BsDatepickerModule.forRoot()
  ],
  providers:[ChangePwdService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ChangepwdModule { }
