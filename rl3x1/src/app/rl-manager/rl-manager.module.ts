import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RlManagerRoutingModule } from './rl-manager-routing.module';
import { RlManagerComponent } from './rl-manager.component';
import { TenantModule } from './tenant/tenant.module';
import { LeadService } from '../leads/lead.service';
import { TenantService } from '../rl-manager/Tenant/tenant.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { message } from '../controls/pop';
import { MessageModule } from '../controls/pop/component/message.module';
import { LayoutModule } from '../back-office/layout/layout.module';
import { BsModalModule, BsModalService } from 'ng2-bs3-modal';
import { ControlsModule } from '../controls/controls.module';
import { SharedModule } from '../shared/shared.module';
import { RlHomeModule } from './rl-home/rl-home.module';

@NgModule({
  declarations: [RlManagerComponent],
  imports: [
    RlHomeModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    BsModalModule,
    ControlsModule,
    SharedModule,
    MessageModule,
    RlManagerRoutingModule,
    TenantModule
  ],
  providers:[TenantService, LeadService, BsModalService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RlManagerModule { }
