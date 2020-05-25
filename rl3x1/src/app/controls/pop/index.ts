import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { modal } from './component/modal.component.js';
import { ModalHeaderComponent } from './component/src/modal-header.js';
import { ModalBodyComponent } from './component/src/modal-body.js';
import { ModalFooterComponent } from './component/src/modal-footer.js';
//import { AutofocusDirective } from './directives/autofocus';

export * from './component/modal.component.js';
export * from './component/message.component.js';
export * from './component/src/modal-header.js';
export * from './component/src/modal-body.js';
export * from './component/src/modal-footer.js';
export * from './component/src/modal-instance.js';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        modal,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        //AutofocusDirective
    ],
    exports: [
        modal,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        //AutofocusDirective
    ]
})
export class popup {
}
