import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { routing } from './user.routes';
import { SharedModule } from '../../shared/shared.module';
import { DefaultPartnerComponent } from './defaultpartner.component'
import { UserGrid } from './user-grid.component'
import { AgGridModule } from 'ag-grid-angular';
import { UserService } from './user.service'
import { UserEditor } from './usereditor.component'
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { PartnerUserEditor } from './partnerusereditor.component';
import { AddUser } from './AddUser';
import { PartnerModule } from '../Partner/partner.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EqualValidator } from './password-match.directive';
// import { EmailDirective } from "../../shared/validation/EmailDirective.directive";
//import { ZipcodeDirective } from '../../shared/validation/ZipcodeDirective.directive'
@NgModule({
    declarations: [DefaultPartnerComponent, UserGrid, UserEditor, PartnerUserEditor, AddUser, EqualValidator],
    imports: [routing, SharedModule, MessageModule, FormsModule, CommonModule
        , PartnerModule
        , AgGridModule.withComponents([ImageColumnComponent])
        , NgMultiSelectDropDownModule.forRoot()],
    providers: [UserService],
    exports: [DefaultPartnerComponent, UserGrid, UserEditor, PartnerUserEditor, AddUser],
    schemas: [NO_ERRORS_SCHEMA],
})
export class UserModule { }