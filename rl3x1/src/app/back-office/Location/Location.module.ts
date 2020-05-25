import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocationGrid } from './Location.component';
import { routing } from './Location.routes';
import { LocationService } from './Location.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { LocationPositions } from './LocationPositions.component';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { PartnerModule } from '../Partner/partner.module';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [
            ImageColumnComponent
        ]), SharedModule, CommonModule, MessageModule, BsModalModule, PartnerModule],
    declarations: [LocationGrid, LocationPositions]
    , providers: [LocationService]
    , exports: [
        RouterModule
    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class LocationModule { }