import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContextMenuComponent } from './component/contextMenu.component.js';
import { ContextMenuItemDirective } from './component/src/contextMenu.item.directive.js';
//import { CONTEXT_MENU_OPTIONS } from './component/src/contextMenu.options.js';
import { ContextMenuService } from './component/src/contextMenu.service.js';
//import { AutofocusDirective } from './directives/autofocus';

export * from './component/contextMenu.component.js';
export * from './component/src/contextMenu.item.directive.js';
export * from './component/src/contextMenu.options.js';
export * from './component/src/contextMenu.service.js';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [ContextMenuService],
    declarations: [
        ContextMenuComponent,
        
        ContextMenuItemDirective
    ],
    exports: [
        ContextMenuComponent,
        
        ContextMenuItemDirective
    ]
})
export class contextMenu {
}
