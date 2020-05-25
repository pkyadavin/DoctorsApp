import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NodeMasterComponent } from './nodemaster.component';
import { routing } from './nodemaster.routes';
import { NodeMasterService } from './nodemaster.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
    imports: [routing, FormsModule, AgGridModule.withComponents(
        [

        ]), SharedModule, CommonModule, HttpClientModule],
    declarations: [NodeMasterComponent]
    , providers: [NodeMasterService]
    , exports: [
        RouterModule

    ],
    schemas:[NO_ERRORS_SCHEMA]
})
export class NodeMasterModule { }