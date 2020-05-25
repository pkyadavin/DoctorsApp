import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { routing } from './partner.routes';
import { SharedModule } from '../../shared/shared.module';
import { MetadataService } from '../MetadataConfig/metadata-config.service';
import { ActiveRuleComponent } from './activerule.component';
import { ContractTermDataComponent } from './contractTerms.component';
import { PartnerService } from './partner.service';
import { PartnerEditor } from './partnereditor.component';
import { Partners } from './partnergrid.component';
import { ReturnReasonCustomer } from './returnreasonforcustomer.component';

import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { BsModalModule } from 'ng2-bs3-modal';
import { CommonService } from 'src/app/shared/common.service';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { EditComponent } from '../../shared/edit.component';
import { ClickableImageLinkComponent } from '../../controls/clickable/ImageIconlink.component';
import { ToolTipLinkComponent } from '../../controls/clickable/ToolTiplink.component';
import { ClickableComponent } from '../../controls/clickable/clickable.component';
import { ClickableLinkComponent } from '../../controls/clickable/link.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AddressService } from '../../shared/address.service';
import { AuthService } from '../../authentication/Auth.service.js';
import { NodeMasterService } from '../NodeMaster/nodemaster.service';
import { RegionService } from '../Region/region.service';
import { ActiveComponent } from '../ReturnReason/active.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { ReturnReasons } from './returnreason.component';
import { ReturnReasonService } from '../ReturnReason/returnreason.service';
import { PartnerRuleValueComponent } from '../../shared/partner-rulevalue.component';
import { checkBoxMandatoryComponent } from '../ReturnReason/chkBoxMandatory';
import { effecton } from '../ReturnReason/effecton.controls';
import { effecttype } from '../ReturnReason/effecttype.controls';
import { valuetype } from '../ReturnReason/valuetype.controls';
import { UserService } from '../user/User.Service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { NotificationTemplateService } from '../notificationtemplate/notificationtemplate.Service';
import { PhoneValidator } from "../../shared/validation/PhoneValidator.directive";
// import { EmailDirective } from "../../shared/validation/EmailDirective.directive";
// import { NameDirective } from "../../shared/validation/NameDirective.directive";

@NgModule({
    declarations: [ReturnReasons, ActiveComponent, PhoneValidator, ActiveRuleComponent, ContractTermDataComponent, PartnerEditor, Partners, ReturnReasonCustomer],
    imports: [BsDatepickerModule.forRoot(), MessageModule, routing, FormsModule, SharedModule, CommonModule, HttpClientModule, AgGridModule.withComponents(
        [
            ImageColumnComponent, ActiveComponent, EditComponent, ClickableImageLinkComponent, ToolTipLinkComponent, ClickableComponent, ClickableLinkComponent, PartnerRuleValueComponent, ActiveRuleComponent, checkBoxMandatoryComponent, effecton, effecttype, valuetype
        ]), BsModalModule, CKEditorModule
        , BsDatepickerModule.forRoot()
    ],
    providers: [ReturnReasonService, PartnerService, AddressService, CommonService, AuthService, NodeMasterService, RegionService
        , MetadataService, GlobalVariableService, CommonService, PartnerService, UserService,NotificationTemplateService],
    exports: [ActiveComponent, ActiveRuleComponent, ContractTermDataComponent, PartnerEditor, Partners, ReturnReasonCustomer,ReturnReasons],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PartnerModule { }