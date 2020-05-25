import { Property } from '../../app.util';
import { SOOrder } from './soOrder.model';
import { GridOptions } from 'ag-grid-community'
export class SOProperties extends Property {
    StockTransfer: SOOrder[];
    CurrentSO: SOOrder;
    dataSource: any;
    dataSourceClose: any;
    filterOpenVal: string;
    filterCloseVal: string;
    openSTOGridOptions: GridOptions;
    CloseSTOGridOptions: GridOptions;
    columnDefs = null;
    isEditVisible: boolean;

    constructor();
    constructor(prop: SOProperties)
    constructor(prop?: any) {
        super();
        //Open Stock Transfer
        this.openSTOGridOptions = {
            rowData: this.StockTransfer,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            pagination:true,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };

        this.CloseSTOGridOptions = {
            rowData: this.StockTransfer,
            columnDefs: null,
            enableColResize: true,
            pagination:true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'infinite',
            maxConcurrentDatasourceRequests: 2,
           // paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };
    }
}