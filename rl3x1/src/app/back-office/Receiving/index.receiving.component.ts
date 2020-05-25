import { Component, ViewChild } from '@angular/core';
import { MRNService } from './receiving.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { MRN, MRNLine, IncomingTask } from './receiving.model'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { EditComponent } from '../../shared/edit.component'
import { MetadataService } from '../MetadataConfig/metadata-config.Service.js';
import { message, modal } from '../../controls/pop/index.js';
import { ReceivingProperties } from '../Receiving/receiving.properties'
import { Util } from 'src/app/app.util';

declare var $: any;

@Component({
    selector: 'MRNIndex',
    providers: [MRNService, MetadataService],
    templateUrl: './index.receiving.html'
})
export class MRNIndex extends ReceivingProperties {
    @ViewChild('pop') _popup: message;
    @ViewChild('modalContainer') _modalContainer: modal;
    CurrentMRN: MRN = new MRN(); 
    CurrentScanMRN: MRN = new MRN();
    ScanLine: MRNLine[] = [];
    arrCurrentMRN: MRN[];
    gridOpenOptions: GridOptions;
    ClosedGridOptions: GridOptions;
    filterValue: string;
    filterValueClosed: string;
    IsListVisible: boolean = false;
    IsEditorVisible: boolean = false;
    IsScanEditorVisible: boolean = false;
    IsPutAwayEditorVisible: boolean = false;
    ShowChart: boolean = false;
    dataSource: any;
    ClosedDataSource: any;
    errorMessage: string;
    isEditVisible: boolean;
    isDeleteVisible: boolean;
    IsGridLoaded: boolean = false;
    moduleTitle: string;
    selectedId: number;
    type: string;
    OrderStatus: string = 'Open';
    parms: any;
    partnerInfo: any;
    accessPermissions: any;
    indexLocalTask: any;
    dynamiChartType1: string = 'bar';
    dynamiChartType2: string = 'pie';
    moduleName: string = 'mrn';    
    ScanValue: string;
    CurrentReceivingAction: any;
    CurrentModuleWorkFlowDetailID: number;
    RefTypeList: any;
    ActionCode: string = "";
    MRNNumber: string = "";
    AllowScan: boolean = true;
    ContainerList: any;
  
    columnDefs = [
        { headerName: 'Serial Number', field: "SerialNumber", width: 150 },
        { headerName: 'IMEI Number', field: "IMEINumber", width: 150 },
        { headerName: 'Model', field: "Model", width: 150 },
        { headerName: 'SKU', field: "SKU", width: 150 },
        { headerName: 'Warranty Status', field: "WarrantyStatus", width: 150 },
        { headerName: 'Customer', field: "Customer", width: 150 },
        { headerName: 'Partner', field: "Partner", width: 150 },
    ];    

    constructor(private _util:Util,
        private mrnService: MRNService, private _router: Router, private route: ActivatedRoute, private _globalService: GlobalVariableService, private _config: MetadataService) {
        super()
        this.moduleTitle = this._globalService.getModuleTitle(this.route.snapshot.parent.url[0].path + '/' + this.route.snapshot.parent.url[1].path);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params["Type"] != undefined) {
                this.IsEditorVisible = true;
                this.IsListVisible = true;
            }           
        });

        this.route.params.subscribe(
            (param: any) => {
                if (param['Code']) {
                    this.ActionCode = param['Code'];
                }
            });

        if (this.ActionCode == "TSK008") {
            this.IsPutAwayEditorVisible = true;
            this.AllowScan = true;
            this.MRNNumber = "m";                        
        }

        this.partnerInfo = this._globalService.getItem('partnerinfo');
        
        this.filterValue = "";
        this.filterValueClosed = "";
        this.isEditVisible = false;
        this.isDeleteVisible = false;
        this.IsGridLoaded = false;

        this.ContainerGridOptions = {
            rowData: this.ContainerList,
            columnDefs: this.ContainercolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'multiple',
            //suppressRowClickSelection: true,
            context: {
                componentParent: this
            }
        };

        this.gridOpenOptions = {
            rowData: this.arrCurrentMRN,
            columnDefs: null,
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
        this.ClosedGridOptions = {
            rowData: this.arrCurrentMRN,
            columnDefs: null,
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

        this.dataSource = {
            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            paginationOverflowSize: 20,
            axConcurrentDatasourceRequests: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.mrnService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.partnerInfo[0].LogInUserPartnerID, this.partnerInfo[0].UserId, "open", this.ActionCode).
                    subscribe(
                    result => {                        

                        //var rowsThisPage = result.recordsets[0];
                        this.accessPermissions = result.recordsets[2];                       
                        //if (!this.IsGridLoaded)

                        //var rowsThisPage = result.recordsets[0];
                        var rowsThisPage;
                        if (this.ActionCode == "TSK008")
                            rowsThisPage = result.recordsets[0].filter(x => x.TotalInspected > 0);
                        else
                            rowsThisPage = result.recordsets[0];                        
                        
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations); 

                        this.IsGridLoaded = true;

                        if (this.ActionCode == "TSK006") {
                            var isPermission = this.HasPermission("Scan");
                            this._globalService.setLinkCellRender(localize, 'MRNNumber', isPermission);
                        }

                        //var coldef = localize.find(element => element.field == "ShippingNumber");
                        //if (coldef != null) {
                        //    coldef.cellRendererFramework = EditComponent;
                        //}                     

                        //localize.splice(localize.length - 2, 2);
                        if(!this.gridOpenOptions.columnApi.getAllColumns())
                        this.gridOpenOptions.api.setColumnDefs(localize);
                        // see if we have come to the last page. if we have, set lastRow to
                        // the very last row of the last page. if you are getting data from
                        // a server, lastRow could be returned separately if the lastRow
                        // is not in the current page.
                        this.IsGridLoaded = true;
                        var lastRow = result.totalcount;

                        params.successCallback(rowsThisPage, rowsThisPage.length);

                        this.isEditVisible = false;
                        this.isDeleteVisible = false;
                    });
            }

        }
        this.gridOpenOptions.datasource = this.dataSource;

        this.ClosedDataSource = {
            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            paginationOverflowSize: 20,
            axConcurrentDatasourceRequests: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.mrnService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValueClosed, this.partnerInfo[0].LogInUserPartnerID, this.partnerInfo[0].UserId, 'Closed', this.ActionCode).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        this.accessPermissions = result.recordsets[2];
                        //if (!this.IsGridLoaded)

                        var rowsThisPage = result.recordsets[0];
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);                        
                        this.IsGridLoaded = true;

                        if (this.ActionCode == "TSK006") {
                            var isPermission = this.HasPermission("Scan");
                            this._globalService.setLinkCellRender(localize, 'MRNNumber', isPermission);
                        }

                        //var coldef = localize.find(element => element.field == "ShippingNumber");
                        //if (coldef != null) {
                        //    coldef.cellRendererFramework = EditComponent;
                        //}                        

                        if(!this.ClosedGridOptions.columnApi.getAllColumns())
                        this.ClosedGridOptions.api.setColumnDefs(localize);
                        // see if we have come to the last page. if we have, set lastRow to
                        // the very last row of the last page. if you are getting data from
                        // a server, lastRow could be returned separately if the lastRow
                        // is not in the current page.
                        this.IsGridLoaded = true;
                        var lastRow = result.totalcount;

                        params.successCallback(rowsThisPage, rowsThisPage.length);

                        this.isEditVisible = false;
                        this.isDeleteVisible = false;
                    });
            }
        }
        this.ClosedGridOptions.datasource = this.ClosedDataSource;

        //Code for scan        
        this.mrnService.GetWorkflowID("SRO", "").subscribe(_value => {
            this.PopulateActions(_value.recordsets[0][0]["WorkFlowID"]);
        });
    }

    PopulateActions(WorkFlowID: number) { 
        this.CurrentScanMRN = new MRN();

        this.mrnService.GetReceivingActions(WorkFlowID).subscribe(_actions => {              
            //var i = 0;
            for (let entry of _actions[0]) {
                if (entry.ActionCode == "TSK062") {
                    this.CurrentScanMRN.ModuleWorkFlowDetailID = entry.ModuleWorkFlowDetailID;
                    this.CurrentReceivingAction = entry;
                }       
            }
            
            this.CurrentScanMRN.CreatedBy = this.partnerInfo[0].UserId;
            this.CurrentScanMRN.Id = 0;
            this.CurrentScanMRN.MRNNumber = "Auto Number";
            this.CurrentScanMRN.PaymentTermID = 0;
            this.CurrentScanMRN.ShipViaID = 0;            
            this.CurrentScanMRN.ActionCode = "TSK005"; 
            this.CurrentScanMRN.CreatedBy = this.partnerInfo[0].UserId;
            

            this.PopulateRefTypes();
            
        }, error => this.errorMessage = <any>error);
    }

    PopulateRefTypes() {
        this._config.getTypeLookUpByGroupName("MRNRefType").subscribe(_ConfigTypes => {
            this.RefTypeList = $.grep(_ConfigTypes, function (x) {
                return true;
            });

            var item = this.RefTypeList.filter(item => item.TypeCode == "MREF004");
            if (item.length > 0) {
                this.CurrentScanMRN.MRNTypeID = item[0].TypeLookUpID;
                this.CurrentScanMRN.MRNTypeName = item[0].TypeName;
            }

        }, error => this.errorMessage = <any>error);
    }

    OnScan() {        
        if (this.ScanValue) {
            this.CurrentScanMRN.MRNLines = [];
            this.mrnService.GetReceivingScanItem(this.partnerInfo[0].LogInUserPartnerID, this.ScanValue).subscribe(_data => {
                
                if (_data.length > 0) { 

                    this.CurrentScanMRN.RefrenceNumber = this.ScanValue;
                    this.ScanLine = _data;
                    for (let i = 0; i < _data.length; i++) {
                        this.ScanLine[i].Id = 0;
                        this.ScanLine[i].ModuleWorkFlowDetailID = this.CurrentMRN.ModuleWorkFlowDetailID;
                        this.ScanLine[i].PreviousModuleWorkFlowDetailID = 0;
                        this.ScanLine[i].Status = this.CurrentReceivingAction.NextStatusName;
                        this.ScanLine[i].StatusCode = this.CurrentReceivingAction.NextStatusCode;
                        this.ScanLine[i].ToPartner = this.partnerInfo[0].LogInUserPartnerName;
                        this.ScanLine[i].ToPartnerId = this.partnerInfo[0].LogInUserPartnerID;
                        this.ScanLine[i].ToPartnerAddressId = this.partnerInfo[0].AddressID;
                        this.ScanLine[i].BOLNumber = null;
                        if (_data[i].PendingQuantity != undefined && _data[i].PendingQuantity > 0)
                            this.ScanLine[i].Quantity = _data[i].PendingQuantity;
                        else
                            this.ScanLine[i].Quantity = _data[i].Quantity;
                        this.ScanLine[i].RefHeaderID = 0;
                    }

                    this.SaveMRN();
                }
                else {
                    this.ScanValue = "";
                    this._util.info("Invalid AWB#.", "info");
                }
                
            }, error => this.errorMessage = <any>error);
        }
        else {
            this.ScanValue = "";
            this._util.info("Invalid AWB#.", "info");
        }
    }

    SaveMRN() {
        var me: any = this;
        $.each(me.ScanLine, function (index, value) {
            for (var i = 1; i < value.Quantity; i++) {
                me.ScanLine.push(value);
            }
        });

        $.each(me.ScanLine, function (index, value) {
            value.Quantity = 1;
        });

        me.CurrentScanMRN.MRNLines = me.ScanLine;
        me.mrnService.SaveScanMRN(me.CurrentScanMRN).subscribe(returnvalue => {   
            this._util.success("Shipment " + me.CurrentScanMRN.RefrenceNumber + ' received successfully.', "success");
            me.ScanValue = "";
            me.RebindOpen();
        });
    }

    onDeleteMRN() {
        //alert(this.CurrentMRN.Id);
        //console.log(this.CurrentMRN);
    }

    //EditClicked(val) {
    //    this.TrackShipment(val);
    //}

    TrackShipment(val) {
        if (val.ShippingNumber) {
            if (val.CarrierName.toUpperCase() == "UPS") {
                var a = $("<a>")
                    .attr("href", "http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber1=" + val.ShippingNumber + "&track.x=0&track.y=0")
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

    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOpenOptions.api.setQuickFilter(this.filterValue);
    }

    onFilterChangedClosed() {
        if (this.filterValueClosed === '') {
            this.filterValueClosed = null;
        }
        this.ClosedGridOptions.api.setQuickFilter(this.filterValueClosed);
    }

    onSelectionChanged() {
        this.isEditVisible = true;
        this.isDeleteVisible = true;
        this.AllowScan = true;

        this.CurrentMRN = this.gridOpenOptions.api.getSelectedRows()[0];
        if (!this.CurrentMRN) {
            this.isEditVisible = false;
            this.isDeleteVisible = false;
        }
        // this._router.navigate(['EditTimeZone'], { queryParams: { ID: this.CurrentTimeZone.TimeZoneId } });
    }

    RebindOpen() {
        this.isEditVisible = false;
        this.isDeleteVisible = false;
                
        if (this.gridOpenOptions.api)
            this.gridOpenOptions.api.setDatasource(this.dataSource);
        
    }
    RebindClose() {
        this.isEditVisible = false;
        this.isDeleteVisible = false;
        this.AllowScan = false;

        if (this.ClosedGridOptions.api)
            this.ClosedGridOptions.api.setDatasource(this.ClosedDataSource);
    }

    onClosedSelectionChanged() {
       
        this.isEditVisible = true;        

        this.CurrentMRN = this.ClosedGridOptions.api.getSelectedRows()[0];
        if (!this.CurrentMRN) {
            this.isEditVisible = false;
        }
        // this._router.navigate(['EditTimeZone'], { queryParams: { ID: this.CurrentTimeZone.TimeZoneId } });
    }    

    OnEditMRNHeader(Id, type) {
        this.selectedId = Id;
        this.type = type;

        if (this.CurrentMRN) {
            this.IsScanEditorVisible = true;
            this.MRNNumber = this.CurrentMRN.MRNNumber;
            //this._router.navigateByUrl('/Receive/' + this.CurrentMRN.MRNNumber, { skipLocationChange: true });
        }         

        //if (this.selectedId > 0) {
        //    this.mrnService.GetRefsFromTaskQueue(0, 100, null, null, this.CurrentMRN.MRNNumber, this.partnerInfo[0].LogInUserPartnerID, this.partnerInfo[0].UserId).subscribe(_data => {
        //        var taskRow = _data.recordsets[0];

        //        this.indexLocalTask = new IncomingTask();                

        //        if (taskRow != undefined && taskRow.length > 0) {
        //            this.indexLocalTask.RefID = taskRow[0].RefID;
        //            this.indexLocalTask.RefNumber = taskRow[0].RefNumber;
        //            this.indexLocalTask.RefType = taskRow[0].RefType;
        //            this.indexLocalTask.Task = taskRow[0].Task;
        //            this.indexLocalTask.IsAccess = true;
        //        }
        //        else {
        //            this.indexLocalTask.RefID = this.CurrentMRN.Id;
        //            this.indexLocalTask.RefNumber = this.CurrentMRN.MRNNumber;
        //            this.indexLocalTask.RefType = "SRO";
        //            this.indexLocalTask.Task = this.CurrentMRN.NextStatus;
        //            this.indexLocalTask.IsAccess = false;
        //        }               

        //        this.IsEditorVisible = true;
        //        this.IsListVisible = true;

        //    }, error => this.errorMessage = <any>error);
        //}
        //else {
        //    this.IsEditorVisible = true;
        //    this.IsListVisible = true;
        //    this.indexLocalTask = null;
        //}

        
        //this._router.navigate(['MRNEditor'], { queryParams: { ID: Id, Type: type } });
    }
    ChangeEditorVisibility(data) {
        if (data) {
            this.gridOpenOptions.api.setDatasource(this.dataSource);
            this.ClosedGridOptions.api.setDatasource(this.ClosedDataSource); 
        }
        var node = this.gridOpenOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }

        this.IsEditorVisible = false;
        this.IsListVisible = false;
    }

    ExportToExcel() {
        let thefile = {};
        var reader = new FileReader();
        this.mrnService.ExportToExcel('Open')
            .subscribe(data => window.open(window.URL.createObjectURL(data)),
            error => console.log("Error downloading the file."),
            () => console.log('Completed file download.'));
    }

    HasPermission(name: string): boolean {
        if (typeof (this.accessPermissions) == 'undefined') {
            return false;
        }
        else {
            var index = this.accessPermissions.findIndex(x => x.FunctionType == name)
            if (index >= 0) {
                return true;
            }
            else {
                return false;
            }
        }

    }

    onRowClicked(e) {
        
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");

            if (actionType != null) {
                if (actionType == "edit") {
                    this.CurrentMRN = data;
                    this.OnEditMRNHeader(data.Id, 'index');
                }
            }
        }
    }

    AddScan(Id, type) {

        this.indexLocalTask = new IncomingTask();
        this.indexLocalTask.RefID = 0;
        this.indexLocalTask.RefNumber = "";
        this.indexLocalTask.RefType = "SRO";
        this.indexLocalTask.Task = "Receive";

        this.IsScanEditorVisible = true;
        this.IsListVisible = true;        
    }

    ChangeScanVisibility(data) {
        if (data) {
            this.gridOpenOptions.api.setDatasource(this.dataSource);
        }
        var node = this.gridOpenOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }

        this.IsScanEditorVisible = false;
        this.IsListVisible = false;
    }

    EditClicked(data, Action) {
        if (Action == 'Reopen') {
            this.UpdateContainer(data, Action);
        }
    }

    OpenContainerPopup() {
        this.mrnService.GetContainer("Release", this.partnerInfo[0].LogInUserPartnerID).
            subscribe(
            result => {
                this.ContainerList = result[0];
                if (this.ContainerList.length > 0) {
                    this.ContainerGridOptions.api.setRowData(this.ContainerList);
                    this._modalContainer.open();
                }
                else
                    this._util.info("Alert", "Any container is not available.", "info");
            });
    }
    ReleaseContainer() {
        var SelectedLines = this.ContainerGridOptions.api.getSelectedRows();
        this.UpdateContainer(SelectedLines, "Release");
    }
    UpdateContainer(data, action) {
        this.mrnService.UpdateContainer(data, action).subscribe(returnvalue => {
            //var response = JSON.parse(returnvalue._body);
            if (returnvalue.result != "Success") {
                this._util.error("System error generated at this moment. Please contact system administrator.", "error");
                console.log(returnvalue.result);
            }
            else {
                if (action == "Release")
                    this._util.success("Container(s) released successfully.", "success");
                else
                    this._util.success("Container(s) reopened successfully.", "success");

                this.mrnService.GetContainer("Release", this.partnerInfo[0].LogInUserPartnerID).
                    subscribe(
                    result => {
                        this.ContainerList = result[0];
                        if (this.ContainerList.length > 0)
                            this.ContainerGridOptions.api.setRowData(this.ContainerList);
                    });                     

                this.RebindOpen();           
            }
        });
    }
}


