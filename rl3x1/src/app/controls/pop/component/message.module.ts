import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { message } from './message.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BsModalModule } from 'ng2-bs3-modal';
@NgModule({
    imports: [FormsModule, CommonModule, BsModalModule],
    declarations: [message],
    exports: [message],
    schemas:[NO_ERRORS_SCHEMA]
})
export class MessageModule { }