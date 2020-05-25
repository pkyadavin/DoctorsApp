import { ViewChild, Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core'
import { BsModalComponent } from 'ng2-bs3-modal'
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { NumericEditorComponent } from "../../../controls/NumericEditor/numericEditor";
import { OrderTabSource } from '../../OrderTabManager/OrderTabSource.Model';
import { GlobalVariableService } from '../../../shared/globalvariable.service';
@Component({
    selector: 'LineItems',
    templateUrl: './LineItem.html'
})
export class LineItems  {
    @ViewChild("itemSelector")
    itemSelectorModel: BsModalComponent;
    Source: any;
    orderTabSource: OrderTabSource = new OrderTabSource();
    columnDefs = [
        { headerName: 'Id', field: "ItemMasterID", width: 200, hide: true },
        { headerName: 'Name', field: "ItemName", width: 200 },
        { headerName: 'Number', field: "ItemNumber", width: 200 },
        { headerName: 'Description', field: "ItemDescription", width: 300 },
        { headerName: 'Price', field: "ItemPrice", width: 100 },
        { headerName: 'Quantity', editable: true, field: "Quantity", width: 100, cellEditorFramework: NumericEditorComponent }
    ]
    gridOptionsOrderLineItems: GridOptions;
    constructor(private _globalService: GlobalVariableService) {

    }
    ngOnInit() {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.columnDefs = [
            { headerName: 'Id', field: "ItemMasterID", width: 200, hide: true },
            { headerName: 'Name', field: "ItemName", width: 200 },
            { headerName: 'Number', field: "ItemNumber", width: 200 },
            { headerName: 'Description', field: "ItemDescription", width: 300 },
            { headerName: 'Price(' + partnerinfo.CurrencySymbol + ')', field: "ItemPrice", width: 100 },
            { headerName: 'Quantity', editable: true, field: "Quantity", width: 100, cellEditorFramework: NumericEditorComponent }
        ]
        this.gridOptionsOrderLineItems = {
            rowData: this.Source.LineItemList,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single'
        }
    }

    SelectItem() {
        this.itemSelectorModel.open();
    }
    itemListChange($event) {
        this.Source.LineItemList = $event;
        this.gridOptionsOrderLineItems.api.setRowData(this.Source.LineItemList);
    }

}