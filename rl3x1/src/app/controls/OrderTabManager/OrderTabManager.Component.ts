import { ViewChild, Component, Output, EventEmitter, Input } from '@angular/core';
@Component({
    selector: 'OrderTabManager',
    templateUrl: './OrderTabManager.html'
})
export class OrderTabManager {
    @Input('Source') Tablist;
    @Input('Module') ModuleName;
    @Input('SourceData') orderTabSource;
    @Output('OnTabChanged') OnTabChanged: EventEmitter<any> = new EventEmitter(true);
    tabChanged(tab) {
        
        this.OnTabChanged.emit(tab);
    }
}
