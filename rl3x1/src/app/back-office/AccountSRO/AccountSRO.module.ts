import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { routing } from './AccountSRO.routes';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { SROrderList } from './SROList.component';
import { SalesReturnOrderModule } from '../SalesReturnOrder/SalesReturnOrder.module';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';


@NgModule({
    imports: [routing, BsModalModule, FormsModule, CommonModule, SharedModule, MessageModule,
        AgGridModule.withComponents(
        [
            ImageColumnComponent
        ]), SalesReturnOrderModule],
    declarations: [ SROrderList
    ]
    , providers: []
     ,exports: [
        RouterModule, SROrderList

    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class AccountSROModule { }