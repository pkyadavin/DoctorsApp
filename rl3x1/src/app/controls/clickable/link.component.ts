import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ag-link',
    template: `
<a href="javascript:void(0);" (click)="click()">{{display}}</a>

  `
})
export class ClickableLinkComponent {
    @Input() cell: any;
    @Output() onClicked = new EventEmitter<boolean>();
    @Input() display: string;
    click(): void {
        this.onClicked.emit(this.cell);
    }
}