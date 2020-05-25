import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RuleGrid } from './rule.component';
import { RuleEditor } from './rule-editor.component';
import { routing } from './rule.routes';
import { RuleService } from './rule.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { MetadataService } from '../MetadataConfig/metadata-config.Service';
import { EditComponent } from 'src/app/shared/edit.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
@NgModule({
    imports: [routing, FormsModule, CommonModule, SharedModule, AgGridModule.withComponents(
        [
            EditComponent
        ]), SharedModule, CommonModule, MessageModule],
    declarations: [RuleGrid, RuleEditor]
    , providers: [RuleService, AuthService, MetadataService]
    , exports: [
        RouterModule, RuleGrid, RuleEditor
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class RuleModule { }