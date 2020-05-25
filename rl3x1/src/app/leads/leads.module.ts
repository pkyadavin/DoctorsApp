import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';
import { SharedModule } from '../shared/shared.module';
import { Util } from '../app.util';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { MessageModule } from 'src/app/controls/pop/component/message.module';

@NgModule({
  declarations: [LeadsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MessageModule,
    LeadsRoutingModule,
    FormsModule,
    NgxUiLoaderModule
  ],
  providers:[Util],
  schemas:[NO_ERRORS_SCHEMA]
})
export class LeadsModule { }
