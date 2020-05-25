import { Component, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'

import { DatePipe } from '@angular/common';  

import { InventoryReconcileHdr } from './inventory.model';
 
//for popup
import { message, modal } from '../../../controls/pop/index.js';
import { TypeLookup } from 'src/app/shared/common.model';
import { GlobalVariableService } from 'src/app/shared/globalvariable.service';
import { CommonService } from 'src/app/shared/common.service';
import { AuthService } from 'src/app/authentication/auth.service';
declare var $: any;

@Component({
    selector: 'Inventory',
    providers: [ReportService, AuthService], 
    templateUrl: './inventory.html'
})
export class InvenoryReportComponent {
    isSerializedGridVisibility = false;
    NodesData: any;
    SerialNumber = "";
    Quantity = "";
    CheckAllNodes = false;
    FillRequired: any = 0;
    AlertRequired: any = 0;
    SerialNumberRequired :any=0;
    ActualQuantityRequired :any=0;
    typelookupList: TypeLookup[]; 
    PopAddButton: any;
    gridOptions: GridOptions;
    selectgridOptions: GridOptions;
    selectPopUpgridOptions: GridOptions;
    selectPopUpgridOptions1: GridOptions;
    gridInventoryOptions: GridOptions;
    filterValue: string;
    fromDate: string;
    toDate: string;
    selectedfilterValue: string = null;
    Value: string = null;
    selectedPartner: any = { PartnerName: '', PartnerID: 0 };
    selectedItem: any = { ItemNumber: '', ItemMasterID: 0 };
    selectedModel: any = { ModelName: '', ModelID: 0 };
    selectedNode: any = { Node: '', NodeID: '0' };
    selectedLocation: any = { LocationCode: '', LocationID: '0' };
    partnerID: any;
    AllLocations: any = [];
    Locations: any;
    Nodes: any;
    dataSource: any;
    selecteddataSource: any;
    selecteddataSource1: any;//
    inventorydataSource: any;
    moduleReportTitle: any;
    errorMessage: string;
    isEditVisible: boolean;
    IsGridLoaded: boolean;
    reportParam: any;
    inventories: any;
    balance: any = {};
    ItemInventories: any
    selectModelItems: any = [];
    selectModelItems1: any = [];
    test: any; 
    isSaveClick: boolean = false;
    CurrentInventoryReconcileHdr: InventoryReconcileHdr = new InventoryReconcileHdr();
    columnDefs = [
        { headerName: 'Model', field: "Model", width: 100 },
        {
            headerName: 'Item Number', field: "ItemNumber", width: 100,
            cellRenderer: function (val)
            {
               // alert(val.toString());
                if (val != null) {
                    return '<a style="cursor:pointer;" data-action-type="selectItem">' + val.value + '</a>';
                }
                return val;
            }
        },
        { headerName: 'Partner', field: "Partner", width: 100 },
        { headerName: 'Node', field: "Node", width: 100, hide: true },
        { headerName: 'Location', field: "Location", width: 100, hide: true },
        { headerName: 'Description', field: "Description", width: 150 },
        { headerName: 'Quantity', field: "Quantity", width: 80 }
    ];

    selectedcolDefs = [
        { headerName: 'Serial Number', field: "SerialNumber", width: 200 },
        { headerName: 'Quantity', field: "Quantity", width: 100 }
    ];

    historyColDefs = [
        { headerName: 'Ref Number', field: "RefNumber", width: 200 },
        { headerName: 'Inventory Effect', field: "InventoryEffect", width: 200 },
        { headerName: 'Quantity', field: "Quantity", width: 100 },
        { headerName: 'Created Date', field: "CreatedDate", width: 100 }
    ];

    currentDate: Date;
    constructor(private _globalService: GlobalVariableService
        , private _reportService: ReportService, private _datePipe: DatePipe
        , private _LoginService: AuthService, private _commonService: CommonService, private activateRoute: ActivatedRoute) {
        this.moduleReportTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.selectedPartner.PartnerID = this.partnerID;
        this.currentDate = new Date();
        this.fromDate = _datePipe.transform(new Date().setMonth(this.currentDate.getMonth() - 1), 'yyyy-MM-dd');
        this.toDate = _datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    }
    @ViewChild('modalPartner') _Partner: modal;
    @ViewChild('modalItem') _Item: modal;
    @ViewChild('modalItemModel') _model: modal;
    @ViewChild('modalShowInventory') _showInv: modal;
    //added 
    @ViewChild('modalShowInventoryDetail') _showInvDetail: modal;
    //
    popuptype: string = "popup";

    //for pop up
    @ViewChild('pop') _popup: message;
    @ViewChild('pop1') _popup1: modal;
    //till here
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "selectItem") {
                this.selectHistory();
            }
        }
    }

    ngOnInit() {
        this.filterValue = null;
        this.isEditVisible = false;
        this.selectgridOptions = {
            rowData: this.selectModelItems,
            columnDefs: this.selectedcolDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };
        this.selectPopUpgridOptions = {
            rowData: this.selectModelItems,
            columnDefs: this.selectedcolDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'pagination',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };

        this.gridOptions = {
            rowData: this.inventories,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'pagination',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };

        this.dataSource = {
            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            paginationOverflowSize: 20,
            maxConcurrentDatasourceRequests: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this._reportService.GetInventories(this.selectedPartner.PartnerID, this.selectedModel.ModelID, this.selectedItem.ItemMasterID, this.selectedNode.NodeID, this.selectedLocation.LocationID
                    , params.startRow, params.endRow, sortColID, sortDirection, this.filterValue).
                    subscribe(
                    result => {
                        debugger;
                        this.inventories = result;
                       
                        //if (this.selectPopUpgridOptions != null) {
                        //    debugger;
                        //    this.CurrentInventoryReconcileHdr.SerializeData = 'Serialize';

                        //}
                        //else {
                        //    debugger;
                        //    this.CurrentInventoryReconcileHdr.SerializeData = 'Non Serialize';
                        //}                      
                            
                        var rowsThisPage = result.recordsets[0];
                        params.successCallback(rowsThisPage, result.totalcount);
                        if (rowsThisPage.length > 0) {
                            this.gridOptions.api.forEachNode(function (node) {
                                if (node.childIndex === 0) {
                                    node.setSelected(true);
                                }
                            });
                        }
                        
                    });
            }
        }
        //added
        this.selecteddataSource = {

            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            paginationOverflowSize: 20,
            maxConcurrentDatasourceRequests: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                var item = this.gridOptions.api.getSelectedRows()[0];

                if (item) {
                    debugger;
                    this.CurrentInventoryReconcileHdr.ItemMasterID = item.ItemMasterID;
                    this._reportService.GetItemSerials(item.PartnerID, item.ModelID, item.ItemMasterID, item.NodeID, item.LocationID
                        , params.startRow, params.endRow, sortColID, sortDirection, this.selectedfilterValue).
                        subscribe(
                        result => {

                            this.selectModelItems = result;
                            var rowsThisPage = result.recordsets[0];
                            params.successCallback(rowsThisPage, result.totalcount)
                        });
                }
            }
        }          
        

        this.gridInventoryOptions = {
            rowData: this.ItemInventories,
            columnDefs: this.historyColDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'pagination',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };

        this.inventorydataSource = {
            rowCount: null, // behave as infinite scroll
            paginationPageSize: 20,
            paginationOverflowSize: 20,
            maxConcurrentDatasourceRequests: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                var item = this.gridOptions.api.getSelectedRows()[0];
                if (item) {
                    debugger;
                   
                    this._reportService.GetInventoryHistory(item.PartnerID, item.ItemMasterID, this.fromDate, this.toDate
                        , params.startRow, params.endRow, sortColID, sortDirection, this.filterValue).
                        subscribe(
                        result => {
                            debugger;                            
                            this.ItemInventories = result;                            
                            var rowsThisPage = result.recordsets[0];
                            this.balance = result.recordsets[1][0];
                            params.successCallback(rowsThisPage, result.totalcount);
                        });
                }
            }
        }
        
        this.gridInventoryOptions.datasource = this.inventorydataSource;      

        this.selectgridOptions.datasource = this.selecteddataSource;
 
        this.gridOptions.datasource = this.dataSource;

        this._commonService.getAllNodes().subscribe(
            result => {
                this.Nodes = result;
            });

        this._commonService.getAllLocations().subscribe(
            result => {
                this.AllLocations = result;
                this.Locations = result;
            });      

        this._commonService.getTypeLookUpByName('Inv Reconcile').subscribe(result => {
            this.typelookupList = result;
           
        }, error => this.errorMessage = <any>error); 
    }
    DownloadInventoryExelFormat(){}
    onClearFilter() {
        this.selectedPartner = { PartnerName: '', PartnerID: '0' };
        this.selectedItem = { ItemNumber: '', ItemMasterID: 0 };
        this.selectedModel = { ModelName: '', ModelID: 0 };
        this.selectedNode = { Node: '', NodeID: '0' };
        this.Locations = this.AllLocations.filter(function (item) { return item.PartnerID == item.PartnerID });
        this.selectedLocation = { LocationCode: '', LocationID: '0' };
        this.filterValue = null;
        this.gridOptions.api.setQuickFilter(this.filterValue);

    }
   

    onSelectionChanged() {  
        debugger;
        this.FillRequired = 0;  
        this.ActualQuantityRequired == 0; 
        this.SerialNumberRequired == 0;//jyoti  
        this.CurrentInventoryReconcileHdr.ReconcileTypeID = 0;
        this.CurrentInventoryReconcileHdr.ActualQuantity = "";
        this.CurrentInventoryReconcileHdr.SerialNumber = "";
        var item = this.gridOptions.api.getSelectedRows()[0];      
        this._reportService.GetItemSerials1(item.PartnerID, item.ModelID, item.ItemMasterID, item.NodeID, item.LocationID).subscribe(
            result => {
                debugger;               
                this.NodesData = result.recordsets[0];
              
                var itemtoMove = this.NodesData[0].ItemReceiveTypeID;
                if (itemtoMove === 75) {
                    this.CurrentInventoryReconcileHdr.SerializeData = 'Item Wise';
                    this.isSerializedGridVisibility = false;
                }
                else if (itemtoMove === 76) {
                    this.CurrentInventoryReconcileHdr.SerializeData = 'SerialNumber Wise';
                    this.isSerializedGridVisibility = true;
                
                }
                else {
                    alert('Please serialized or itemwise serialized data');
                }
                this.selectgridOptions.api.setDatasource(this.selecteddataSource);              
                console.log(JSON.stringify(this.NodesData));
            });     

        if (item) {
            this.CurrentInventoryReconcileHdr.Partner = item.Partner;
            this.CurrentInventoryReconcileHdr.ItemNumber = item.ItemNumber;
            this.CurrentInventoryReconcileHdr.Description = item.Description;
            this.CurrentInventoryReconcileHdr.Quantity = item.Quantity;
            this.CurrentInventoryReconcileHdr.Model = item.Model;           
            this.CurrentInventoryReconcileHdr.ReconcileDate = new Date().toISOString();
        }
      
    }

    selectHistory() {
        this._showInv.open(); 
        this.showInventoryDate();
    }
  
    ShowDetails() {
        this._showInvDetail.open();
        this.showInventoryDetail();
    }

    showInventoryDate()
    {
        this.gridInventoryOptions.api.setDatasource(this.inventorydataSource);
    }
    
    showInventoryDetail() {
        debugger;
        this.CurrentInventoryReconcileHdr.ReconcileTypeID = 0;
        this.PopAddButton = 0;      
        this.ActualQuantityRequired = 0;   
        this.SerialNumberRequired = 0;
          
        this.selectgridOptions.api.setDatasource(this.selecteddataSource);
      
    }    

    onFilterChanged(event) {
        if (event.keyCode == 13) {
            if (this.filterValue === '') {
                this.filterValue = null;
            }
            this.gridOptions.api.setQuickFilter(this.filterValue);
        }
    }


    onSerialFilterChanged(event) {
        if (event.keyCode == 13) {
            if (this.selectedfilterValue === '') {
                this.selectedfilterValue = null;
            }
            this.selectgridOptions.api.setQuickFilter(this.selectedfilterValue);
        }
    }

    onSearchClick() {
        this.gridOptions.api.setDatasource(this.dataSource);
        if (this.selectedLocation.LocationID != '0') {
            this.gridOptions.columnApi.setColumnVisible('Node', true);
            this.gridOptions.columnApi.setColumnVisible('Location', false);
        }
        if (this.selectedNode.NodeID != '0') {
            this.gridOptions.columnApi.setColumnVisible('Location', true);
            this.gridOptions.columnApi.setColumnVisible('Node', false);
        }
        if (this.selectedNode.NodeID == '0' && this.selectedLocation.LocationID == '0') {
            this.gridOptions.columnApi.setColumnVisible('Node', false);
            this.gridOptions.columnApi.setColumnVisible('Location', false);
        }
    }

    selectPartner() { this._Partner.open(); }
    PartnerEvent(e) {
        this.selectedPartner.PartnerID = e.PartnerID;
        this.selectedPartner.PartnerName = e.PartnerName;
        this.Locations = this.AllLocations.filter(function (item) { return item.PartnerID == e.PartnerID });
        this.selectedLocation = { LocationCode: '', LocationID: '0', PartnerID: e.PartnerID };
        this._Partner.close();
    }

    selectItem() { this._Item.open(); }
    ItemEvent(e) {
        this.selectedItem.ItemMasterID = e.ItemMasterID;
        this.selectedItem.ItemNumber = e.ItemNumber;
        this._Item.close();
    }

    selectModel() { this._model.open(); }

    ItemModelEvent(e) {
        debugger;
        this.selectedModel.ModelID = e.ModelID;
        this.selectedModel.ModelName = e.ModelName;
        this._model.close();
    }

    SelectedReconcileType(Data) {
        debugger;       
        if (Data === "319") {
            if (this.CurrentInventoryReconcileHdr.SerializeData === 'SerialNumber Wise') {
                this.PopAddButton = 1;
                this.ActualQuantityRequired = 1;
                this.SerialNumberRequired = 1;
            }
            else {
                this.PopAddButton = 0;
                this.ActualQuantityRequired = 1;
            }            
           
        }
        else {
            this.FillRequired = 0;
            if (this.CurrentInventoryReconcileHdr.SerializeData === 'SerialNumber Wise') {
                this.ActualQuantityRequired = 0;
            }
            else {
                this.ActualQuantityRequired = 1;
            }
            this.PopAddButton = 0;
            this.SerialNumberRequired = 0;
           
        }
       
    }  

    onAddInventory() {
        debugger;
        if (this.CurrentInventoryReconcileHdr.SerialNumber === "undefined") {
            this.CurrentInventoryReconcileHdr.SerialNumber = "";
        }
        if (this.CurrentInventoryReconcileHdr.ActualQuantity === undefined) {
            this.CurrentInventoryReconcileHdr.ActualQuantity = "";
        }         

        if ((this.CurrentInventoryReconcileHdr.SerialNumber != "") && (this.CurrentInventoryReconcileHdr.ActualQuantity !="")) {
            var data = { SerialNumber: this.CurrentInventoryReconcileHdr.SerialNumber, Quantity: this.CurrentInventoryReconcileHdr.ActualQuantity, IsChecked: true };
            var dis = this;
            var repeatdata;
            $.each(this.NodesData, function (i, v) {
                debugger;
               
                if (data.SerialNumber===v.SerialNumber) {                                  
                    dis._popup.Alert('Alert', 'Duplicate Serial Number.');
                    repeatdata = "true";             
                }
               

            });   
            if (repeatdata != "true") {
                dis.NodesData.push(data);
                dis.SerialNumber = "";
                dis.Quantity = "";
            }   
        }
        this.CurrentInventoryReconcileHdr.nodes = data;      
    }

    onSubmit() {
        debugger      
        var me = this;
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.CurrentInventoryReconcileHdr.UserId = partnerinfo.UserId;
        this.CurrentInventoryReconcileHdr.PartnerID = partnerinfo.LogInUserPartnerID;
        this.CurrentInventoryReconcileHdr.CreatedBy = "44";
        this.CurrentInventoryReconcileHdr.InventoryReconcileHdrID = 0;
       
        var IsNodeSelected = false;
        
        if (this.CurrentInventoryReconcileHdr.ReconcileTypeID != 0) {
            IsNodeSelected = true;
        }
        
        var data = [];
        $.each(this.NodesData, function (i, v) {
            if (v.IsChecked === true) {
                debugger;
               
                var items = { SerialNumber: v.SerialNumber, ActualQuantity: v.Quantity };
                data.push(items);
            }
            else {
            }
        });

        if (IsNodeSelected === true) {
            this.CurrentInventoryReconcileHdr.nodes = data;
        }

        console.log(JSON.stringify(this.CurrentInventoryReconcileHdr));
        if (this.CurrentInventoryReconcileHdr.ReconcileTypeID != 0) {
            debugger;
            if (this.ActualQuantityRequired === 1) {
                if (this.CurrentInventoryReconcileHdr.SerialNumber === "") {
                    if (this.CurrentInventoryReconcileHdr.SerializeData === 'SerialNumber Wise')
                    {
                        this.FillRequired = 1;
                    }
                    else {
                        this.FillRequired = 0;
                    }
                   
                }

                else if (this.CurrentInventoryReconcileHdr.SerialNumber === undefined) {
                    this.FillRequired = 1;
                    return;
                }
                else if (this.CurrentInventoryReconcileHdr.ActualQuantity === "") {
                    this.FillRequired = 1;
                    return;
                }

                else if (this.CurrentInventoryReconcileHdr.ActualQuantity === undefined) {
                    this.FillRequired = 1;
                    return;
                }

            }
           
                
                this._reportService.Save(this.CurrentInventoryReconcileHdr, this.CurrentInventoryReconcileHdr.InventoryReconcileHdrID, this._LoginService.loginUserID, this.CurrentInventoryReconcileHdr.PartnerID).subscribe(returnvalue => {
                    debugger;
                    var res = returnvalue.data;
                    if (res == "Duplicate string") {

                        this._popup.Alert('Alert', 'Record already exist.');
                        return;
                    }
                    else {

                        var me = this;
                        this._popup.Alert('Alert', 'Sucessfully Saved');

                        this._showInvDetail.close();


                   }
                }, error => console.log('Could not create todo.'));
         
        }
       

    } 
   

    //For tab 
    CheckUnCheckNodes() {
        debugger;
        $.each(this.NodesData, function (i, v) {
            if (!this.CheckAllNodes)
                v.IsChecked = true;
            else
                v.IsChecked = false;
        });
        if (!this.CheckAllNodes)
            this.CheckAllNodes = true;
        else
            this.CheckAllNodes = false;
    }

    EditNodes(id) {
        debugger;
        $.each(this.NodesData, function (i, v) {
            if (id == v.id) {
                this.SelectedNodeID = id;
                this.NodeName = v.name;
                this.NodeDescription = v.description;
            }
        });
    }
    AddRemoveNodes(index) {
        debugger;
        $.each(this.NodesData, function (i, v) {
            if (i == index) {
                if (v.IsChecked)
                    v.IsChecked = false;
                else
                    v.IsChecked = true;
            }
        });
    }
}