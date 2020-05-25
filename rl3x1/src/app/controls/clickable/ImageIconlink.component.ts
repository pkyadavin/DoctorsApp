import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ag-Imagelink',
    template: `
<a href='javascript: void (0);' (click)="click()"><i class='fa fa-file-text-o' style='font- size:34px; color: #3366ff' *ngIf="cell.AttachedDocument>0"></i></a>

  `
})
export class ClickableImageLinkComponent {
    @Input() cell: any;
    @Output() onClicked = new EventEmitter<boolean>();
    @Input() display: string;    

    click(): void {
        this.onClicked.emit(this.cell);
    }
}