import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Roles } from "./role.component";
import { routing } from "./role.routes";
import { RoleService } from "./role.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AgGridModule } from "ag-grid-angular";
import { SharedModule } from "../../shared/shared.module";
import { Router, RouterModule } from "@angular/router";
import { MessageModule } from "src/app/controls/pop/component/message.module";
//import { DownloadComponent } from '../download/download.component';

@NgModule({
  imports: [
    routing,
    FormsModule,
    AgGridModule.withComponents([]),
    SharedModule,
    CommonModule,
    MessageModule
  ],
  declarations: [
    Roles//,DownloadComponent
  ],
  providers: [RoleService],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RoleModule {}
