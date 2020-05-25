import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ModelEditor } from './category-editor.component';
import { ModelGrid } from './category.component';
import { routing } from './category.routes';
import { ModelService } from './category.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { Router, RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { BsModalModule } from 'ng2-bs3-modal';
import { SharedModule } from '../../shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { ItemCategoryModule } from '../ItemCategory/itemcategory.module'; 
import { ReturnReasonModule } from '../ReturnReason/returnreason.module';
import { CategoryRuleValueComponent } from './rulevalue.component';
import { PartnerModule } from '../Partner/partner.module';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
@NgModule({
    imports: [
        routing, 
        BsModalModule, FormsModule,    
        PartnerModule    
        , AgGridModule.withComponents([CategoryRuleValueComponent, ImageColumnComponent])
        , SharedModule, CommonModule
        , MessageModule
        ,ItemCategoryModule
        ,ReturnReasonModule
    ]
    , declarations: [
        ModelGrid, CategoryRuleValueComponent
        , ModelEditor
    ]
    , providers: [
        ModelService
    ]
    , exports: [
        RouterModule
        , ModelGrid
        , ModelEditor
        , CategoryRuleValueComponent
    ]
    ,schemas:[NO_ERRORS_SCHEMA]
})
export class ModelModule { }