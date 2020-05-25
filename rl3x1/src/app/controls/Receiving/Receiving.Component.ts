import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { ActivatedRoute } from '@angular/router'
import { MRNService } from '../../back-office/Receiving/receiving.service'
import { StatusComboComponent } from '../../back-office/Receiving/statuscombo.component'
import { GlobalVariableService } from '../../shared/globalvariable.service'
import { QuantityEditorComponent } from '../../shared/quantityeditor.component';


@Component({
    selector: 'Receiving-Component',
    templateUrl: './Receiving.html'
})
export class ReceivingComponent {

    @Input() Recieving: any;
    @Output() NotifyReceiving = new EventEmitter();
    IsLoadPreviousLines: boolean = false;
    IsSubmitted: boolean = false;
    selecteditem: any;
    selectedcarrier: any;
    itemnumber: string = "";
    itemId: number = 0;
    StatusID: number = 0;
    Status: string = "";
    SerialNumber: string = "";
    Quantity: string = "1";
    ContainerNumber: string = "";
    PackageNumber: string = "";
    NodeID: number = 0;
    Node: string = "";
    LocationID: number = 0;
    Location: string = "";
    Remarks: string = "";
    NodeList: any;
    LocationList: any;
    StatusList: any;
    ReceivingList = [];
    ReceivingGridOptions: GridOptions;
    RecievedcolumnDefs = [
        {
            headerName: 'Action', field: "Action", Width: 25,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteitem" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i> Delete</button></div>';
            }
        },
        { headerName: 'Item Number', field: "ItemNumber", width: 150 },
        { headerName: 'Serial Number', field: "SerialNumber", width: 150 },
        { headerName: 'Quantity', field: "Quantity", width: 100 },
        { headerName: 'Status', field: "Status", width: 100 }
    ]


    PreviousLinesList = [];
    PreviousLinesGridOptions: GridOptions;
    PreviousLinescolumnDefs = [
        {
            headerName: 'Action', field: "Action", Width: 25,editable:false,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="selectitem" class="btn btn-success btn-sm"><i class="fa fa-check"></i> Select</button></div>';
            },
            // cellRendererFramework: function (params: any) {
            // },
            // cellEditorFramework: function (params: any) {
            // }
        },
        { headerName: 'Item Number', field: "ItemNumber", width: 150 },
        { headerName: 'Serial Number', field: "SerialNumber", width: 150 },
        // { headerName: 'Quantity', field: "Quantity", width: 100 },
    ]
    constructor(
        private mrnService: MRNService, private global: GlobalVariableService) {
    }
    ngOnInit() {
        this.global.TypeCode = this.Recieving.RefTypeCode;
        this.global.RefTypeID = this.Recieving.RefTypeId;
        this.CreateDynamicGrid();
        this.LoadData();
        this.ReceivingGridOptions = {
            rowData: [],
            columnDefs: this.RecievedcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single'
        }

        this.PreviousLinesGridOptions = {
            rowData: [],
            columnDefs: this.PreviousLinescolumnDefs,
            enableColResize: true,
            enableSorting: true,
            //enableFilter: true,
            rowSelection: 'single'
        }

        this.PreviousLinesGridOptions.rowData = this.Recieving.PreviousLines;
        if (this.PreviousLinesGridOptions.rowData.length > 0)
            this.IsLoadPreviousLines = true;

    }

    ShowPerMission(RuleCode: string): boolean {
        if (typeof (this.Recieving.Rules) == 'undefined') {
            return false;
        }
        else {
            var index = this.Recieving.Rules.findIndex(x => x.RuleCode == RuleCode)
            if (index >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    LoadData() {
        if (this.ShowPerMission('RC007')) {
            this.mrnService.GetAllStatusByType("ItemStatus").subscribe(returnvalue => {
                this.StatusList = returnvalue;
            }
            )
        }
        if (this.ShowPerMission('RC010')) {
            this.mrnService.GetNodes().subscribe(returnvalue => {
                this.NodeList = returnvalue;
            }
            )
        }
        if (this.ShowPerMission('RC011')) {
            this.mrnService.GetLocationByPartner(this.Recieving.PartnerId).subscribe(returnvalue => {
                this.LocationList = returnvalue;
            }
            )

        }
    }
    CreateDynamicGrid() {
        if (this.ShowPerMission('RC006')) {
            this.RecievedcolumnDefs.push({
                headerName: "Package Number",
                width: 200,
                field: "PackageNumber",

            })

            this.PreviousLinescolumnDefs.push({
                headerName: "Package Number",
                width: 200,
                field: "PackageNumber",

            })

        }
        if (this.ShowPerMission('RC007')) {
            this.RecievedcolumnDefs.push({
                headerName: "Item Status",
                width: 200,
                field: "ItemStatus",

            })
            //need to check
            // this.PreviousLinescolumnDefs.push({
            //     headerName: "Item Status",
            //     width: 200,
            //     editable: true,
            //     field: "ItemStatusID",
            //     cellRendererFramework: StatusComboComponent,
            //     cellEditorFramework: StatusComboComponent
            // })
        }
        if (this.ShowPerMission('RC008')) {
            this.RecievedcolumnDefs.push({
                headerName: "Remarks",
                width: 200,
                field: "Remarks",

            })
            //need to check
            // this.PreviousLinescolumnDefs.push({
            //     headerName: "Remarks",
            //     width: 200,
            //     field: "Remarks",
            //     editable: true

            // })

        }
        if (this.ShowPerMission('RC009')) {
            this.RecievedcolumnDefs.push({
                headerName: "Container Number",
                width: 200,
                field: "ContainerNumber",

            })
            //need to check
            // this.PreviousLinescolumnDefs.push({
            //     headerName: "Container Number",
            //     width: 200,
            //     field: "ContainerNumber",
            //     editable: true

            // })

        }
        if (this.ShowPerMission('RC010')) {
            this.RecievedcolumnDefs.push({
                headerName: "Node",
                width: 200,
                field: "Node",

            })
            //need to check
            // this.PreviousLinescolumnDefs.push({
            //     headerName: "Node",
            //     width: 200,
            //     field: "Node",
            //     editable: true

            // })

        }
        if (this.ShowPerMission('RC011')) {
            this.RecievedcolumnDefs.push({
                headerName: "Location",
                width: 200,
                field: "Location"
               

            })
            //need to check
            // this.PreviousLinescolumnDefs.push({
            //     headerName: "Location",
            //     width: 200,
            //     field: "Location",
            //     editable: true

            // })

        }
    }
    onAddItem(form) {
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            this.IsSubmitted = true;
            return;
        }
        this.ReceivingList.push({
            "ItemMasterID": this.selecteditem.ItemMasterID, "ItemNumber": this.selecteditem.ItemNumber, "SerialNumber": this.SerialNumber, "Quantity": this.Quantity
            , "PackageNumber": this.PackageNumber, "StatusID": this.StatusID, "Status": this.Status, "Remarks": this.Remarks
            , "ContainerNumber": this.ContainerNumber, "NodeID": this.NodeID, "Node": this.Node, "LocationID": this.LocationID, "Location": this.Location
        })
        this.ReceivingGridOptions.api.setRowData(this.ReceivingList);
        this.NotifyReceiving.emit({
            "ItemMasterID": this.selecteditem.ItemMasterID, "ItemNumber": this.selecteditem.ItemNumber, "SerialNumber": this.SerialNumber, "Quantity": this.Quantity
            , "PackageNumber": this.PackageNumber, "StatusID": this.StatusID, "Status": this.Status, "Remarks": this.Remarks
            , "ContainerNumber": this.ContainerNumber, "NodeID": this.NodeID, "Node": this.Node, "LocationID": this.LocationID, "Location": this.Location
        });
        form.reset();
        this.Cleardata();
        this.IsSubmitted = false;
    }
    renderItem = function (data) {
        var html = "<b style='float:left;width:100%'>" + data.ItemNumber + "</b>\n ";
    };

    Cleardata() {
        this.itemnumber = "";
        this.itemId = 0;
        this.StatusID = 0;
        this.Status = "";
        this.SerialNumber = "";
        this.Quantity = "1";
        this.ContainerNumber = "";
        this.PackageNumber = "";
        this.NodeID = 0;
        this.Node = "";
        this.LocationID = 0;
        this.Location = "";
        this.Remarks = "";
        this.selecteditem = "";

    }
    DeleteItem(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");
            if (actionType === "deleteitem") {
                //  this.itemMaster = e.data;
                var index = this.ReceivingList.indexOf(e.data);
                this.ReceivingList.splice(index, 1);
                this.ReceivingGridOptions.api.setRowData(this.ReceivingList);

                if (this.PreviousLinesList != undefined) {
                    this.PreviousLinesList.push(e.data);
                    this.PreviousLinesGridOptions.api.setRowData(this.PreviousLinesList);
                }
            }

        }

    }

    SelectItem(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("Id");
            if (actionType === "selectitem") {
                this.PreviousLinesGridOptions.api.stopEditing();
                //  this.itemMaster = e.data;
                var index = this.PreviousLinesList.indexOf(e.data);
                this.PreviousLinesList.splice(index, 1);
                this.PreviousLinesGridOptions.api.setRowData(this.ReceivingList);

                var addedRow = e.data;
                addedRow.ItemStatus = this.StatusList.filter(m => m.TypeLookUpID == addedRow.ItemStatusID)[0].TypeName;
                this.ReceivingList.push(addedRow);
                this.ReceivingGridOptions.api.setRowData(this.ReceivingList);
            }

        }

    }
}

