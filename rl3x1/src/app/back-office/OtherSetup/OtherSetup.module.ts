import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { OtherSetupGrid } from './OtherSetup.component';
import { OtherSetupRoutingModule } from './OtherSetup-routing.module';
import { OtherSetupService } from './OtherSetup.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { EditComponent } from 'src/app/shared/edit.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
 import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
    imports: [OtherSetupRoutingModule,MessageModule, FormsModule, AgGridModule.withComponents([
        EditComponent
    ]), SharedModule, CommonModule,CKEditorModule],
    declarations: [OtherSetupGrid], 
    providers: [OtherSetupService],
    schemas:[NO_ERRORS_SCHEMA]
})
export class OtherSetupModule { }