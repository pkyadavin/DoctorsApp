import { ViewChild, Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core'
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { GlobalVariableService } from '../../../shared/globalvariable.service';
import { OrderTabSource } from '../../OrderTabManager/OrderTabSource.Model';
@Component({
    selector: 'OrderLog',
    templateUrl: './OrderLog.html'
})
export class OrderLog {
    //itemSelectorModel: ModalComponent;
    Source: any;
    selectedId: number;
    type: string;
    IsEditorVisible: boolean = false;
    ModuleName: any;
    orderTabSource: OrderTabSource = new OrderTabSource();
    columnDefs = [
        //{ headerName: "View", field: "View",cellRenderer: this.cellEditRender },
        { headerName: 'Item #', field: "ItemNumber", cellRenderer: 'group' },
        { headerName: "MRNHeaderID", field: "MRNHeaderID", hide: true },
        { headerName: "DispatchHeaderID", field: "DispatchHeaderID", hide: true },
        { headerName: 'Action Type', field: "ActionType", width: 150 },
        { headerName: 'ActionTypeID', field: "ActionTypeID", hide: true },
        { headerName: 'Receiving Number', field: "MRNNumber", width: 200},
        { headerName: 'Dispatch Number', field: "DispatchNumber", width: 200 },
        { headerName: 'Action Type Number', field: "ActionTypeNumber", width: 150 },
        { headerName: 'Start Date', field: "StartDate", width: 150 },
        { headerName: 'Task', field: "Task", width: 100 },
        { headerName: 'Item Name', field: "ItemName", },
       
        { headerName: 'Serial #', field: "SerialNumber" },
        { headerName: 'Quantity', field: "Quantity", width: 80 },
        { headerName: 'Created By', field: "CreatedBy", width: 100 },
        { headerName: 'Aging Days', field: "AgingDays", width: 100 }
    ]

    constructor(private _router: Router, private _global: GlobalVariableService) { }

    cellEditRender(val) {
        if (!val) {
            return '<a style="cursor:pointer;" data-action-type="View">View</a>';
        }
        return val.value;
    }

    //columnDefs = [
    //    { headerName: "Group", cellRenderer: 'group' },
    //    { headerName: "Athlete", field: "athlete" },
    //    { headerName: "Year", field: "year" },
    //    { headerName: "Country", field: "country" }
    //  ];

    // rowData = [
    //    {
    //        group: '001',
    //        participants: [
    //            { MRNNumber: 'Michael Phelps', Task: '2008', ItemName: 'United States' },
    //            { MRNNumber: 'Michael Phelps', Task: '2009', ItemName: 'United States1' },
    //            { MRNNumber: 'Michael Phelps', Task: '2010', ItemName: 'United States2' }
    //        ]
    //    },
    //    {
    //        group: '003',
    //        participants: [
    //            { MRNNumber: 'Michael Phelps', Task: '2008', ItemName: 'United States' },
    //            { MRNNumber: 'Michael ', Task: '2009', ItemName: 'United States1' },
    //            { MRNNumber: 'Phelps', Task: '2010', ItemName: 'United States2' },
    //            { MRNNumber: 'Phelps', Task: '2013', ItemName: 'United States3' }
    //        ]
    //    },
    //    {
    //        group: '004',
    //        participants: [
    //            { MRNNumber: 'Michael2 ', Task: '2009', ItemName: 'United States1' },
    //            { MRNNumber: 'Phelps3', Task: '2010', ItemName: 'United States' },
    //            { MRNNumber: 'Phelps4', Task: '2013', ItemName: 'United States3' }
    //        ]
    //    }
    //];


    gridOptionsOrderLog: GridOptions;
    ngOnInit() {
        if (this.Source.length > 0) {
            if (this.Source[0].recordset) {
                this.Source = JSON.parse(this.Source[0].recordset);
            } else {
                this.Source = [];
            }
        }
        this.gridOptionsOrderLog = {
            rowData: this.Source,
            columnDefs: this.colDefs(),
            //  rowData: this.rowData,
            //  columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            getNodeChildDetails: this.getNodeChildDetails,
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },
            rowSelection: 'single'
        }
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "View") {
                // if (data == "Receiving") {
                this._global.TaskQue = e.data;
                if (this.ModuleName == 'sto') {
                    this._router.navigateByUrl('/dummy', { skipLocationChange: true })
                    setTimeout(() => this._router.navigate(['/MRNIndex'], { queryParams: { ID: 0, RefID: e.data.MRNHeaderID, Type: "view" } }));
                } if (this.ModuleName == 'disposal') {
                    this._router.navigateByUrl('/dummy', { skipLocationChange: true })
                    setTimeout(() => this._router.navigate(['/dispatchorder'], { queryParams: { ID: 0, RefID: e.data.DispatchHeaderID, Type: "view" } }));
                }  else {
                    if (data.ActionType == "Dispatch") {
                        this._router.navigateByUrl('/dummy', { skipLocationChange: true })
                        setTimeout(() => this._router.navigate(['/dispatchorder'], { queryParams: { ID: 0, RefID: e.data.ActionTypeID, Type: "view" } }));
                    } else {
                        this._router.navigateByUrl('/dummy', { skipLocationChange: true })
                        setTimeout(() => this._router.navigate(['/MRNIndex'], { queryParams: { ID: 0, RefID: e.data.ActionTypeID, Type: "view" } }));
                    }
                }
            }
        }
    }


    //cellEditRender(val) {
    //    if (val != null) {
    //        return '<a style="cursor:pointer;" data-action-type="edit">' + val.value + '</a>';
    //    }
    //    return val;
    //}

    getNodeChildDetails(rowItem) {
          if (rowItem.group) {
                return {
                    group: true,
                    // open C be default
                    expanded: rowItem.group === 'Group C',
                    // provide ag-Grid with the children of this group
                    children: rowItem.participants,
                    // this is not used, however it is available to the cellRenderers,
                    // if you provide a custom cellRenderer, you might use it. it's more
                    // relavent if you are doing multi levels of groupings, not just one
                    // as in this example.
                    field: 'group',
                    // the key is used by the default group cellRenderer
                    key: rowItem.group,
                };
            } else {
                return null;
            }
        }

    colDefs() {
        var defs;
        if (this.ModuleName == 'sto') {
            defs = this.columnDefs.filter(function (item) { return item.field != 'MRNNumber' && item.field != 'DispatchNumber'});
        } else if (this.ModuleName == 'disposal') {
            defs = this.columnDefs.filter(function (item) { return item.field != 'MRNNumber' && item.field != 'ActionType' && item.field != 'ActionTypeNumber' });
        } else {
            defs = this.columnDefs.filter(function (item) { return item.field != 'DispatchNumber' && item.field != 'ActionType' && item.field != 'ActionTypeNumber'  });
        }
        return defs;
    }
    //item.field != 'ActionType' && item.field != 'ActionTypeNumber'
    //itemListChange($event) {
    //    this.Source.LineItemList = $event;
    //    this.gridOptionsOrderLineItems.api.setRowData(this.Source.LineItemList);
    //}

}