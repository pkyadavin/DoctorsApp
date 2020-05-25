import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { BackOfficeRoutingModule } from "./back-office-routing.module";
import { SidebarService } from "./sidebar/sidebar.service";
import { ControlsModule } from "../controls/controls.module";
import { str2objPipe } from "../pipes";
import { CommonService } from "../shared/common.service";
import { GlobalVariableService } from "src/app/shared/globalvariable.service";
import { AgGridModule } from "ag-grid-angular";
import { FormsModule } from "@angular/forms";
import { BsModalModule, BsModalService } from "ng2-bs3-modal";
import { AuthService } from "../authentication/auth.service";
import { MessageModule } from "../controls/pop/component/message.module";
import { HttpClientModule } from "@angular/common/http";
import { LayoutModule } from "./layout/layout.module";
import { KeysPipe } from "../pipes/jsonKeyValue.pipe";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ImageColumnComponent } from "../shared/image-column.component";
import { LoaderService } from '../loader/loader.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ControlsModule,
    FormsModule,
    BsModalModule,
    HttpClientModule,
    AgGridModule.withComponents([ImageColumnComponent]),
    SharedModule,
    MessageModule,
    BackOfficeRoutingModule,
    LayoutModule,
    NgMultiSelectDropDownModule.forRoot()
  ],

  providers: [
    SidebarService,
    str2objPipe,
    KeysPipe,
    CommonService,
    GlobalVariableService,
    BsModalService,
    AuthService,
    LoaderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BackOfficeModule {}
