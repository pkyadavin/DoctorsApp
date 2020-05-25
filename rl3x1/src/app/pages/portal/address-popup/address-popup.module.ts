import { AddressPopupComponent } from './address-popup.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [AddressPopupComponent],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports:[AddressPopupComponent]
})
export class AddressPopupModule { }