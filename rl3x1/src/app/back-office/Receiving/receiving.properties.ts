import { GridOptions } from 'ag-grid-community'
import { EditComponent } from '../../shared/edit.component'
import { EditIamgeComponent } from '../../controls/clickable/imagelink.component'
import { Property } from '../../app.util';

export class ReceivingProperties extends Property {

    LineGridOptions: GridOptions;
    ReceivingColumnDefs = [
        { headerName: 'Item Name', field: "ItemDescription", width: 200, suppressFilter: true },
        { headerName: 'UPC', field: "ItemNumber", width: 125, suppressFilter: true },
        { headerName: 'Item Serial #', field: "SerialNumber", width: 150, suppressFilter: true },
        { headerName: 'Status', field: "StatusName", width: 150, suppressFilter: true },       
        { headerName: 'RMA Number', field: "SalesReturnOrderNumber", width: 150, suppressFilter: true },
        { headerName: 'Shipment Number', field: "ShippingNumber", width: 170, suppressFilter: true },
        { headerName: 'Return Reason', field: "ReturnReason", width: 200, suppressFilter: true },
        { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent }, 
    ];

    InspectColumnDefs = [
        { headerName: 'Item Name', field: "ItemDescription", width: 200, suppressFilter: true },
        { headerName: 'UPC', field: "ItemNumber", width: 125, suppressFilter: true },
        { headerName: 'Item Serial #', field: "SerialNumber", width: 100, suppressFilter: true },
        { headerName: 'Inspected By', field: "InspectedBy", width: 150, suppressFilter: true },
        { headerName: 'Status', field: "StatusName", width: 140, suppressFilter: true },
        { headerName: 'Grade', field: "PackageNumber", width: 120, suppressFilter: true },
        { headerName: 'Container #', field: "ContainerNumber", width: 150, suppressFilter: true },
        { headerName: 'Container Status', field: "ContainerStatus", width: 130, suppressFilter: true },
        { headerName: 'Remarks', field: "Remarks", width: 200, suppressFilter: true },
        { headerName: 'RMA Number', field: "SalesReturnOrderNumber", width: 130, suppressFilter: true },        
        { headerName: 'Return Reason', field: "ReturnReason", width: 200, suppressFilter: true },
        { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },
        //{ headerName: 'Discrepancy', field: "Discrepancy", width: 200, suppressFilter: true },
        //{ headerName: 'Discrepancy Remark', field: "DiscrepancyRemark", width: 200, suppressFilter: true },
        //{ headerName: 'Accessories', field: "AccessoriesName", width: 200, suppressFilter: true },
    ];

    PutAwayColumnDefs = [
        { headerName: 'Item Name', field: "ItemDescription", width: 200, suppressFilter: true },
        { headerName: 'UPC', field: "ItemNumber", width: 125, suppressFilter: true },
        { headerName: 'Item Serial #', field: "SerialNumber", width: 150, suppressFilter: true },
        { headerName: 'Status', field: "StatusName", width: 140, suppressFilter: true },
        { headerName: 'Grade', field: "PackageNumber", width: 120, suppressFilter: true },
        { headerName: 'Container #', field: "ContainerNumber", width: 150, suppressFilter: true }, 
        { headerName: 'Location', field: "Location", width: 125, suppressFilter: true },   
        { headerName: 'Remarks', field: "Remarks", width: 200, suppressFilter: true },    
        { headerName: 'RMA Number', field: "SalesReturnOrderNumber", width: 130, suppressFilter: true },
        { headerName: 'Tracking Number', field: "ShippingNumber", width: 170, suppressFilter: true },
        { headerName: 'Return Reason', field: "ReturnReason", width: 200, suppressFilter: true },
        { headerName: 'Docs/Comments', field: "ItemDocs", width: 125, cellRendererFramework: EditIamgeComponent },        
        //{ headerName: 'Discrepancy', field: "Discrepancy", width: 200, suppressFilter: true },
        //{ headerName: 'Discrepancy Remark', field: "DiscrepancyRemark", width: 200, suppressFilter: true },
        //{ headerName: 'Accessories', field: "AccessoriesName", width: 200, suppressFilter: true },
    ];

    ContainerGridOptions: GridOptions;
    ContainercolumnDefs = [
        { headerName: 'Select', width: 75, checkboxSelection: this.isRowSelectable },
        { headerName: 'Container#', field: "Container", width: 150, suppressFilter: true },        
        { headerName: 'Total Item', field: "TotalItems", width: 100, suppressFilter: true },        
        { headerName: 'Container Status', field: "ContainerStatus", width: 140, suppressFilter: true },
        //{ headerName: 'Status', field: "StatusName", width: 100, suppressFilter: true },
        {
            headerName: '', field: "Reopen", Width: 25, editable: false, hide: false, cellRendererFramework: EditComponent
        },
    ];

    ContainerPutAwayGridOptions: GridOptions;
    ContainerPutAwaycolumnDefs = [
        { headerName: 'Select', width: 75, checkboxSelection: this.IsPutAwayAllow },
        { headerName: 'Container#', field: "Container", width: 150, cellRendererFramework: EditComponent },
        //{ headerName: 'Receiving Number', field: "MRNNumber", width: 150, suppressFilter: true },
        { headerName: 'Total Item', field: "TotalItems", width: 100, suppressFilter: true },
        { headerName: 'Location Status', field: "Location", width: 130, suppressFilter: true },
    ]

    gridOptionsOrderLog: GridOptions;
    OrderLogColumnDefs = [
        {headerName: "Item", field: 'group', width: 170, cellRenderer:'agGroupCellRenderer'},
        { headerName: 'Item #', field: "ItemNumber", width: 100 },
        //{ headerName: 'Item #', field: "ItemNumber", width: 100, cellRenderer: 'group' },
        { headerName: 'MRNHeaderID', field: "MRNHeaderID", width: 150, hide: true },
        { headerName: 'MRN Number', field: "MRNNumber", width: 100 },
        { headerName: 'Start Date', field: "StartDate", width: 150 },
        { headerName: 'Status', field: "Task", width: 140 },
        { headerName: 'Item Name', field: "ItemName", width: 150 },
        { headerName: 'Serial #', field: "SerialNumber", width: 100 },
        { headerName: 'Quantity', field: "Quantity", width: 80 },
        { headerName: 'Created By', field: "CreatedBy", width: 100 },
        { headerName: 'Aging Days', field: "AgingDays", width: 100 }
    ]

    constructor();
    constructor(receiving: ReceivingProperties)
    constructor(receiving?: any) {
        super();
        
    }

    isRowSelectable(rowNode) {

        var IsShow: boolean = false;
        IsShow = rowNode.data.IsContainerCompleted ? false : true;
        if (IsShow) {
            IsShow = rowNode.data.IsContainerClosed ? false : true;
        }

        return IsShow;
    }    

    IsPutAwayAllow(rowNode) {

        return rowNode.data.IsContainerCompleted ? false : true;
    }
}