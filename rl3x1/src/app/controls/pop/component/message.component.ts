import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { modal } from './modal.component.js';
declare var $: any;

@Component({
    selector: 'message',
    template: `<bs-modal #message cssClass="modal-xl">
    <bs-modal-header>
        <h4 class="modal-title">{{title}}</h4>
    </bs-modal-header>
    <bs-modal-body>
        {{messageBody}}
    </bs-modal-body>
    <bs-modal-footer>
        <button type="button" class="btn btn-primary" (click)="onConfirmCallback()">Ok</button>
        <button *ngIf="isConfirm" type="button" class="btn btn-default" data-dismiss="modal" (click)="onCancelCallback()">Cancel</button>        
    </bs-modal-footer>
</bs-modal>
`
})

export class message {
    onConfirm?: Function;
    onCancel?: Function;
    @ViewChild('message') popup: modal;

    isConfirm: boolean;
    title: string = "Message";
    messageBody: string = "";

    Alert(_title, _message, onConfirm?: any) {
        this.isConfirm = false;
        this.title = _title;
        this.messageBody = _message;
        this.onConfirm = onConfirm;
        this.popup.open();
    }
    Confirm(_title, _message, onConfirm?: any, onCancel?: any) {
        this.isConfirm = true;
        this.title = _title;
        this.messageBody = _message;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
        this.popup.open();
    }      
    //onConfirmCallback(model: this) {
    onConfirmCallback() {
        this.popup.dismiss().then(() => {
            if (this.onConfirm)
                this.onConfirm();
        });;
    }

    //onCancelCallback(model: this) {
    onCancelCallback() {
        this.popup.dismiss().then(() => {
            if (this.onCancel)
                this.onCancel();
        });;
    }
}