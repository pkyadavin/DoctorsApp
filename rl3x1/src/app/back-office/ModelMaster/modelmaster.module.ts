import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ModelMasterGrid } from './modelmaster.component';
import { ModelMasterEditor } from './modelmaster-editor.component';
import { routing } from './modelmaster.routes';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2, AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { MetadataService } from '../MetadataConfig/metadata-config.service';
import { EditComponent } from 'src/app/shared/edit.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { ModelModule } from '../Category/category.module';
import { ManufacturerModule } from '../Manufacturer/Manufacturer.module';
import { UOMMasterModule } from '../UOMMaster/uomMaster.module';
import { ManufacturerService } from '../Manufacturer/Manufacturer.Service';
import { UOMMasterService } from '../UOMMaster/uomMaster.service';
import { ModelMasterService } from './modelmaster.service';
import { ActiveRuleComponent } from './activerule.component';
import { RuleValueComponent } from './rulevalue.component';

@NgModule({
    imports: [routing, FormsModule, MessageModule
        , AgGridModule.withComponents([])
        , SharedModule, CommonModule
        , ModelModule
        , ManufacturerModule
        , UOMMasterModule
    ],
    declarations: [ModelMasterGrid, ModelMasterEditor, ActiveRuleComponent, RuleValueComponent],
    providers: [
        ModelMasterService
    ],
    exports: [ModelMasterGrid],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ModelMasterModule { }