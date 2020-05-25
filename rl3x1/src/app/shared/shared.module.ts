import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, FormBuilder, Validators, NgForm } from "@angular/forms";
import { SharedRoutingModule } from "./shared-routing.module";
import { Tabs } from "../controls/tabs/tabs.component.js";
import { Tab } from "../controls/tabs/tab.component.js";
import { NgxPaginationModule } from 'ngx-pagination';
import {
  hasPipe,
  indexOfPipe,
  str2objPipe,
  containsPipe,
  actioncodePipe,
  OrderBy,
  startFromPipe,
  hasnotPipe,
  KeysPipe,
  limitToPipe
} from "../pipes";
import { CommonService } from "./common.service";
import { GlobalVariableService } from "./globalvariable.service";
import { EditComponent } from "./edit.component";
import { AddressEditor } from "./address.component";
import { AgGridModule } from "ag-grid-angular";
import { ClickableLinkComponent } from "../controls/clickable/link.component";
import { ToolTipComponent } from "./tooltip.component";
import { BsModalModule } from "ng2-bs3-modal";
import { httpInterceptorProviders } from "../interceptors";
import { AddressService } from "./address.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ddl } from "../controls/ddl/ddl.component";
import { ClickableImageLinkComponent } from "../controls/clickable/ImageIconlink.component";
import { ClickableComponent } from "../controls/clickable/clickable.component";
import { ToolTipLinkComponent } from "../controls/clickable/ToolTiplink.component";
import { AllStates } from "./states.components";
import { AllCountries } from "./countries.component";
import { StatesService } from "./states.service";
import { CountriesService } from "./countries.service";
import { CustomerRegions } from "../back-office/Region/customerregion.component";
import { PartnerUserEditor } from "../back-office/User/partnerusereditor.component";
import { checkBoxMandatoryComponent } from "../back-office/ReturnReason/chkBoxMandatory";
import { ItemSelector } from "../controls/ItemSelector/ItemSelector.Component";
import { NumericEditorComponent } from "../controls/NumericEditor/numericEditor";
import { effecton } from "../back-office/ReturnReason/effecton.controls";
import { effecttype } from "../back-office/ReturnReason/effecttype.controls";
import { valuetype } from "../back-office/ReturnReason/valuetype.controls";
import { checkBoxInputComponent } from "../back-office/ReturnReason/userinput.component";
import { EditArtifactComponent } from "../controls/clickable/editartifact.component";
import { EditIamgeComponent } from "../controls/clickable/imagelink.component";
import { checkBoxComponent } from "../back-office/ReturnReason/chkBox.component";
import { multiplecontrols } from "../back-office/ReturnReason/multiple.controls";
import { TreeView } from "../controls/tree-view/tree-view.component";
import { MetadataConfigComponent } from "../back-office/MetadataConfig/metadata-config.component";
import { QuantityEditorComponent } from "./quantityeditor.component";
import { DynamicTabComponent } from "../controls/OrderTabManager/DynamicTabComponent.Component";

import { OrderLog } from "../controls/OrderTabManager/OrderLog/OrderLog.Component";
import { OrderTabManager } from "../controls/OrderTabManager/OrderTabManager.Component";
import { ContextMenuService } from "../controls/context-menu";
import { PartnerRuleValueComponent } from "./partner-rulevalue.component";
import { ActiveComponent } from "./active.component";
import { ImageColumnComponent } from "./image-column.component";
import { QuantityComponent } from "./quantity.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AlphaNumericValidator } from "./validation/AlphaNumericValidator.directive";
// import { PhoneValidator } from "./validation/PhoneValidator.directive";
import { ZipcodeDirective } from './validation/ZipcodeDirective.directive';
import { AppGridComponent } from './app-grid/app-grid.component';
import { BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { DigitOnlyDirective } from './validation/digit-only.directive';
import { AlphabetOnlyDirective } from './validation/alphabet-only.directive';

@NgModule({
  declarations: [
    QuantityComponent,
    ImageColumnComponent,
    PartnerRuleValueComponent,
    OrderTabManager,
    DynamicTabComponent,
    OrderLog,
    MetadataConfigComponent,
    QuantityEditorComponent,
    effecton,
    effecttype,
    valuetype,
    checkBoxInputComponent,
    EditArtifactComponent,
    EditIamgeComponent,
    checkBoxComponent,
    multiplecontrols,
    TreeView,
    checkBoxMandatoryComponent,
    PartnerUserEditor,
    CustomerRegions,
    AllStates,
    AllCountries,
    ToolTipLinkComponent,
    ClickableImageLinkComponent,
    ClickableComponent,
    ddl,
    actioncodePipe,
    OrderBy,
    startFromPipe,
    hasnotPipe,
    KeysPipe,
    hasPipe,
    indexOfPipe,
    str2objPipe,
    containsPipe,
    ToolTipComponent,
    Tabs,
    Tab,
    EditComponent,
    ActiveComponent,
    AddressEditor,
    ClickableLinkComponent,
    ItemSelector,
    NumericEditorComponent,
    limitToPipe,
    AlphaNumericValidator,
    // PhoneValidator,
    ZipcodeDirective,
    AppGridComponent,
    DigitOnlyDirective,
    AlphabetOnlyDirective
  ],
  imports: [
    BsModalModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule, BsDatepickerModule.forRoot(), ModalModule.forRoot(),
    HttpClientModule,
    SharedRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule.withComponents([
      ImageColumnComponent,
      EditComponent,
      PartnerRuleValueComponent,
      ClickableImageLinkComponent,
      ToolTipLinkComponent,
      ClickableComponent,
      ClickableLinkComponent,
      EditIamgeComponent,
      ActiveComponent,

    ])
  ],
  providers: [
    NgForm,
    FormBuilder,
    httpInterceptorProviders,
    CommonService,
    GlobalVariableService,
    AddressService,
    CountriesService,
    StatesService,
    ContextMenuService
  ],
  exports: [
    QuantityComponent,
    ImageColumnComponent,
    PartnerRuleValueComponent,
    OrderTabManager,
    DynamicTabComponent,
    OrderLog,
    MetadataConfigComponent,
    QuantityEditorComponent,
    effecton,
    effecttype,
    valuetype,
    checkBoxInputComponent,
    EditArtifactComponent,
    EditIamgeComponent,
    checkBoxComponent,
    multiplecontrols,
    TreeView,
    checkBoxMandatoryComponent,
    PartnerUserEditor,
    CustomerRegions,
    AllStates,
    AllCountries,
    ToolTipLinkComponent,
    ClickableImageLinkComponent,
    ClickableComponent,
    ddl,
    actioncodePipe,
    OrderBy,
    startFromPipe,
    hasnotPipe,
    KeysPipe,
    hasPipe,
    indexOfPipe,
    str2objPipe,
    containsPipe,
    BsModalModule,
    Tabs,
    ToolTipComponent,
    Tab,
    EditComponent,
    AddressEditor,
    ClickableLinkComponent,
    ItemSelector,
    NumericEditorComponent,
    ActiveComponent,
    limitToPipe,
    AppGridComponent,
    DigitOnlyDirective
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
