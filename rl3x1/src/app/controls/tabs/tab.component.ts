import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'tab',
    styles: [`
    .pane{
      padding: 1em;
    }
  `],
    template: `
    <div [hidden]="!active" class="tab-body">
      <ng-content></ng-content>
<div class="clearfix"></div>
    </div>
  `
})
export class Tab {
    @Input('tabTitle') title: string;
    @Input() active;
    @Input('NullIf') NullIf : any;
    @Output('select') onselect = new EventEmitter();
}

