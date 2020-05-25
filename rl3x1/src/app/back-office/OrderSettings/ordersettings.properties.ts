import { Property } from '../../app.util';
import { GridOptions } from 'ag-grid-community'
import { orderSettings } from './ordersettings.model'
export class OrderSettingProperties extends Property {
    Settings: any;
    
    constructor();
    constructor(prop: OrderSettingProperties)
    constructor(prop?: any) {
        super();
        this.Reset();
    }
    Reset() {
        this.Settings = null;
    }
    
}