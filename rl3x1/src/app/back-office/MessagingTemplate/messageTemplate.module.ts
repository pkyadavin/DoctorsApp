import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageTemplateGrid } from './messageTemplate.component';
import { routing } from './messageTemplate.routes';
import { MessageTemplateService } from './messageTemplate.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [

        ]), SharedModule, CommonModule,MessageModule],
    declarations: [MessageTemplateGrid]
    , providers: [MessageTemplateService]
    , exports: [
        RouterModule

    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class MessageTemplateModule { }