import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { routing } from './ItemCategory.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { ItemCategoryComponent } from './itemcategory.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCategoryComponentMain } from './itemcategorymain.component';
@NgModule({
    imports: [
        //routing,
        SharedModule
        , MessageModule
        , CommonModule
        , FormsModule
    ],
    declarations: [ItemCategoryComponent, ItemCategoryComponentMain]
    , exports: [ItemCategoryComponent]
    , schemas: [NO_ERRORS_SCHEMA]
})
export class ItemCategoryModule { }