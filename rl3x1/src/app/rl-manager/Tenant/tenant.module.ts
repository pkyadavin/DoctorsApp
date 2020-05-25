import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantComponent } from './tenant.component'
import { TenantRoutingModule } from './tenant-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { TenantViewComponent } from './detail.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { NgxUiLoaderModule } from  'ngx-ui-loader';

@NgModule({
  declarations: [TenantComponent, TenantViewComponent],
  imports: [
    CommonModule,
    TenantRoutingModule,
    FormsModule,
    SharedModule,
    MessageModule,
    NgxUiLoaderModule,
    AgGridModule.withComponents(
      [

      ]),
  ],
  providers:[],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TenantModule { }
