import { Component, Input, Output, EventEmitter } from '@angular/core';
var ToolTip = require('../../../assets/js/wz_tooltip.js');

@Component({
    selector: 'ag-tooltiplink',    
    template: `
    <div *ngIf='isShow' (mouseover)="ShowMyTip(ToolTipDisplay)" onmouseout="UnTip()">{{display}}.....<i class="fa fa-plus"></i>   
    </div>

    <div *ngIf='!isShow'>{{display}}   
    </div>
  `
})
export class ToolTipLinkComponent {
    @Input() cell: any;
    @Output() onClicked = new EventEmitter<boolean>();
    @Input() display: string;
    @Input() isShow: boolean;
    @Input() ToolTipDisplay: string; 
    ShowMyTip(msg){
        ToolTip.Tip("" + msg + "");
    }   
}