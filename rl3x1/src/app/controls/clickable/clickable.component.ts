import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ag-clickable',
    template: `
    <button class="btn btn-primary btn-sm" style="padding: 2px 4px!important;" (click)="click()">{{Display}}</button>
  `
})
export class ClickableComponent {
    @Input() cell:any;
    @Output() onClicked = new EventEmitter<boolean>();
    @Input() Display: string;
    click() : void {
        this.onClicked.emit(this.cell);
    }
}