import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReturnTypeComponent } from './returntype.component';
import { routing } from './returntype.routes';
import { ReturnTypeService } from './returntype.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsModalModule } from 'ng2-bs3-modal';
import { PartnerModule } from '../Partner/partner.module';

@NgModule({
    imports: [routing, FormsModule, 
        AgGridModule.withComponents([]), 
        SharedModule, CommonModule,MessageModule,
        NgMultiSelectDropDownModule,
        BsModalModule,
        PartnerModule
    ],
    declarations: [
        ReturnTypeComponent
    ], 
    providers: [ReturnTypeService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class ReturnTypeModule { }