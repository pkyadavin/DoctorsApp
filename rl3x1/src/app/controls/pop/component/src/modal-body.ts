import { Component, Input, Output, EventEmitter, Type } from '@angular/core';
import { modal } from '../modal.component.js';

@Component({
    selector: 'modal-body',
    template: `
        <div class="modal-body">
            <ng-content></ng-content>
        </div>
    `
})
export class ModalBodyComponent {
}