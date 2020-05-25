import { Component } from '@angular/core';
import { ShipmentService } from './shipment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { ShipmentModel } from './Shipment.model'
import { BsModalComponent } from 'ng2-bs3-modal'
import { CommonService } from '../../shared/common.service'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { EditComponent } from '../../shared/edit.component'
import { Property, Util } from '../../app.util';
declare var $: any;

@Component({
    selector: 'ShipmentGrid',
    providers: [ShipmentService],
    templateUrl: './shipment.html',
    //styles: ['>>> .modal-xxl { width: 1100px; }']
})
export class ShipmentOrder {
    private gridApi;
    private gridColumnApi;
    moduleTitle: string;
    LocalAccess: any = [];
    IsGridLoaded: boolean;
    IsCloseGridLoaded: boolean;
    gridOptionsOpenOrders: GridOptions;
    gridOptionsClosedOrders: GridOptions;
    dataSource: any;
    IsEditorVisible: boolean = false;
    ShowChart: boolean = true;
    filterValue: string;
    isEditVisible: boolean;
    Tablist: any;
    selectTab: string;
    paramType: string;
    paramID: string;
    OrderStatus: string = 'Open';
    columnDefs = [];
    ShipmentOrderList: ShipmentModel[];
    partnerID: number;
    selectedId: string;
    sroReq: string;
    CurrentShipmentOrder: ShipmentModel = new ShipmentModel();
    constructor(
        private myservice: ShipmentService, public _util: Util, private _router: Router, public commonService: CommonService, private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute) {
        this.activateRoute.queryParams.subscribe(params => {
            this.paramType = params["Task"];
            this.paramID = params["ID"];
            if (this.paramType != undefined && this.paramType == "Ship") {
                this.selectedId = null;
                this.IsEditorVisible = true;
            }
        });
    }

    loadPermissionByModule(userID, logInUserPartnerID, moduleTitle) {
        this.commonService.loadPermissionByModule(userID, logInUserPartnerID, moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                if (this.IsGridLoaded) {
                    this.gridOptionsOpenOrders.api.setDatasource(this.dataSource);                    
                }

                
            }
        )
    }
    ngOnInit() {
        this.moduleTitle = this._globalService.getModuleTitle(this.activateRoute.snapshot.parent.url[0].path);
        this.filterValue = null;
        this.isEditVisible = false;

        this.gridOptionsOpenOrders = {
            rowData: this.ShipmentOrderList,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            pagination:true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2,
            context: {
                componentParent: this
            }
        };
       
        var partnerinfo = this._globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.loadPermissionByModule(partnerinfo[0].UserId, partnerinfo[0].LogInUserPartnerID, this.moduleTitle);

        this.dataSource = {
            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            overflowSize: 20,
            maxConcurrentRequests: 2,
            maxPagesInCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.myservice.loadAll("Open", params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.partnerID).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        if (!this.IsGridLoaded)
                            this.columnDefs = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                        var isPermission = this.LocalAccess.indexOf("View") == -1 ? false : true;
                        // this._globalService.setLinkCellRender(this.columnDefs, 'ShipmentNumber', isPermission);
                        this._globalService.setLinkCellRender(this.columnDefs, 'ShipmentNumber', true);
                        
                        var coldef = this.columnDefs.find(element => element.field == "AWBNumber");
                        if (coldef != null && isPermission) {                            
                            coldef.cellRendererFramework = EditComponent;
                        }

                        //  this.columnDefs.find(element => element.field == "PONumber").cellRenderer = this.poCellRender;

                        this.IsGridLoaded = true;

                        this.gridOptionsOpenOrders.api.setColumnDefs(this.columnDefs);                     
                        var lastRow = result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);
                    });
            }
        }
        this.gridOptionsOpenOrders.datasource = this.dataSource;      
       
    }
    EditClicked(val) {
        this.TrackShipment(val);
    }

  

    ChangeEditorVisibility(data) {
        
        if (data) {
            this.isEditVisible = false;
            this.ShowChart = true;          
        }
        this.CurrentShipmentOrder = null;
        this.IsEditorVisible = false;
    }
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            this.CurrentShipmentOrder = data;
            //let actionType = "edit";// e.event.target.getAttribute("data-action-type");
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {
                this.OnEditSROrder(data.AWBNumber);
            }
        }
    }   
    OnEditSROrder(ShippingNumber) {
        if (ShippingNumber == '')
            this.sroReq = 'Add';
        else
            this.sroReq = 'Edit';
        this.selectedId = ShippingNumber == "" ? null : ShippingNumber;
        this.IsEditorVisible = true;
    }
    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
    
        this.gridOptionsOpenOrders.api.setDatasource(this.dataSource);
        // this.gridOptionsOpenOrders.api.setQuickFilter(this.filterValue);            
    }
    onSelectionChanged() {
         this.CurrentShipmentOrder = this.gridOptionsOpenOrders.api.getSelectedRows()[0];        
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    
        params.api.sizeColumnsToFit();
    
        setTimeout(function() {
            params.api.sizeColumnsToFit();
          },1800);
    
        // window.addEventListener("resize", function() {
        //   setTimeout(function() {
        //     params.api.sizeColumnsToFit();
        //     debugger;
        //   },5000);
        // });
      }

    TrackShipment(val) {
        if (val.AWBNumber) {
            if (val.CarrierName.toUpperCase() == "UPS") {
                var a = $("<a>")
                    .attr("href", "http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber1=" + val.AWBNumber + "&track.x=0&track.y=0")
                    .attr("target", "_blank")
                    .attr("download", "img.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
            }
            else if (val.CarrierName.toUpperCase() == "FEDEX") {
                var a = $("<a>")
                    .attr("href", "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" + val.AWBNumber)
                    .attr("target", "_blank")
                    .attr("download", "img.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
            }
        }
    }
    DownloadLabel() {
        if (this.CurrentShipmentOrder.ShippingLabelURL) {
            var a = $("<a>")
                .attr("href", this.CurrentShipmentOrder.ShippingLabelURL)
                .attr("target", "_blank")
                .attr("download", "img.png")
                .appendTo("body");

            a[0].click();
            a.remove();
        }
    }
}