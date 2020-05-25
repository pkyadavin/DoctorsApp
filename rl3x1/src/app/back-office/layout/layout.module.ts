import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { CommandComponent } from '../command/command.component';
import { AdvanceFilterComponent } from '../advance-filter/advance-filter.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { BsModalModule, BsModalService } from 'ng2-bs3-modal';
import { SharedModule } from '../../shared/shared.module';
import { SidebarService } from '../sidebar/sidebar.service';
import { AuthService } from '../../authentication/auth.service';
import { str2objPipe } from '../../pipes';
import { CommonService } from '../../shared/common.service';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { BackOfficeRoutingModule } from '../back-office-routing.module';
import { BackOfficeModule } from '../back-office.module';
import { BackOfficeComponent } from '../back-office.component';

@NgModule({
  declarations: [NavigationComponent, SidebarComponent, AdvanceFilterComponent, CommandComponent, BackOfficeComponent],
  imports: [
    CommonModule,FormsModule, BsModalModule, SharedModule, BackOfficeRoutingModule
  ],
  providers:[ SidebarService, str2objPipe, CommonService, GlobalVariableService,BsModalService
    ,AuthService],
  exports:[NavigationComponent, SidebarComponent, AdvanceFilterComponent, CommandComponent, BackOfficeComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class LayoutModule { }
