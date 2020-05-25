import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { Util } from '../app.util';
import { TenantVerificationComponent } from './tenantverification.component';
import { LeadVerificationRoutingModule } from './leadVerification-routing.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { NgxUiLoaderModule } from  'ngx-ui-loader';

@NgModule({
  declarations: [ TenantVerificationComponent ],
  imports: [
    CommonModule,MessageModule,
    SharedModule,
    LeadVerificationRoutingModule,
    FormsModule,
    NgxUiLoaderModule
  ],
  providers:[Util],
  schemas:[NO_ERRORS_SCHEMA]
})
export class LeadVerificationModule { }
