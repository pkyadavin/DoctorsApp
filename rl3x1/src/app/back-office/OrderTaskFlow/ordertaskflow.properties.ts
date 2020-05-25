import { Property } from '../../app.util';
import { GridOptions } from 'ag-grid-community'
import { OrderTaskFlowModel } from './ordertaskflow.model.js'
export class OrderTaskFlowProperties extends Property {
    OrderTaskFlow: any;
    
    constructor();
    constructor(prop: OrderTaskFlowProperties)
    constructor(prop?: any) {
        super();
        this.Reset();
    }
    Reset() {
        this.OrderTaskFlow = null;
    }
    
}