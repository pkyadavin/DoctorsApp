import { Component, EventEmitter, ViewChild } from '@angular/core';
import { SOService } from './soOrder.service';
import { SOOrder } from './soOrder.model';
import { Observable } from 'rxjs/Observable';
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Tabs } from '../../controls/tabs/tabs.component.js';
import { Tab } from '../../controls/tabs/tab.component.js';
import { SOProperties } from './soOrder.properties.js';
import { message, modal } from '../../controls/pop/index.js'
import { CommonService } from '../../shared/common.service'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { SidebarService } from '../sidebar/sidebar.service';
import { Property, Util } from '../../app.util';

declare var XLSX: any;
@Component({
    selector: 'SOOrdersGrid',
    providers: [SOService],
    templateUrl: 'soOrder.html'
})
export class SOOrdersGrid extends SOProperties {
    stockTransfer: Observable<SOOrder[]>;
    partnerID: number;
    selectedId: number;
    UserID: number;
    IsGridLoaded: boolean = false;
    IsEditorVisible: boolean = false;
    ShowChart: boolean = false;
    OnLoadPartnerID: number;
    OrderType: any;
    IsUplaodAllow: boolean = false;

    ShowUploadbutton: boolean = true;
    errorMessage: string;
    regXMLData: any;
    Result: string = '';
    selectedValue: string;
    jsonlist: any;
    jsonArray: any = [];
    ImportResults: any;
    ImportStatus: string = "";
    ImportInProcess: boolean = false;
    @ViewChild("fileInput") fileInput;
    @ViewChild('importPopup') _importPopup: BsModalComponent;
    Scope: string;

    constructor(private _util:Util,
        private stoService: SOService, private _menu: SidebarService,private _router: Router, public commonService: CommonService, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;
        this.loadPermissionByModule(this.moduleTitle);

        var partnerinfo = _globalService.getItem('partnerinfo');
        this.OnLoadPartnerID = partnerinfo[0].LogInUserPartnerID;       
             
        this.activateRoute.params.subscribe(
            (param: any) => {
                //Need to check impect
                // this.partnerType = (this.partnerType && !param['ID']) ? this.partnerType : param['ID'];
                this.Scope = param['Scope'];
            });
        this.isEditVisible = false;
        this.dataSource = {
            rowCount: null,
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
                //Load STOs with Open Status
                this.stoService.loadOpenSTO(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, 'Close', this.OnLoadPartnerID, this.Scope).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        this.columnDefs = JSON.parse(result.recordsets[1][0].ColumnDefinitions);

                        //var isPermission = this.LocalAccess.indexOf("View") == -1 ? false : true;
                        this._globalService.setLinkCellRender(this.columnDefs, 'SONumber', true);

                        if(!this.openSTOGridOptions.columnApi.getAllColumns())
                            this.openSTOGridOptions.api.setColumnDefs(this.columnDefs);
                            
                        var lastRow = result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);

                        this.isEditVisible = false;
                    },
                    error => this.errorMessage = <any>error);
            }
        }
        this.openSTOGridOptions.datasource = this.dataSource;

        this.dataSourceClose = {
            rowCount: null,
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
                //Load STOs with Open Status
                this.stoService.loadOpenSTO(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, 'Close', this.OnLoadPartnerID, this.Scope).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        this.CloseSTOGridOptions.api.setColumnDefs(JSON.parse(result.recordsets[1][0].ColumnDefinitions));
                        var lastRow = result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);


                    },
                    error => this.errorMessage = <any>error);
            }
        }
    }
    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });                
            }
        )
    }
    CheckExcelUploadPermisssion() {
        this.stoService.CheckAllowExcel().subscribe(
            result => {
                if (result[0][0].UploadSetting == "Excel")
                    this.IsUplaodAllow = true;
                else
                    this.IsUplaodAllow = false;
            },
            error => this.errorMessage = <any>error);
    }

    onSelectedOpenSTOChanged() {
        this.isEditVisible = true;
        this.CurrentSO = this.openSTOGridOptions.api.getSelectedRows()[0];
        if (!this.CurrentSO) {
            this.isEditVisible = false;
        }
    }
    onSelectedCloseSTOChanged() {
        this.CurrentSO = this.CloseSTOGridOptions.api.getSelectedRows()[0];
        this.isEditVisible = true;
        if (!this.CurrentSO) {
            this.isEditVisible = false;
        }
    }

    onOpenFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.CloseSTOGridOptions.api.setDatasource(this.dataSource);
        //this.openSTOGridOptions.api.setQuickFilter(this.filterValue);
    }

    ExportToExcel() {
        let thefile = {};
        var reader = new FileReader();
        this.stoService.ExportToExcel(this.OrderType, this.OnLoadPartnerID)
            .subscribe(data => window.open(window.URL.createObjectURL(data)),
            error => this._util.error(error, 'error'),
            () => this._util.success('Completed file download.', 'Alert'));
    }

    onCloseFilterChanged() {
        if (this.filterCloseVal === '') {
            this.filterCloseVal = null;
        }
        this.CloseSTOGridOptions.api.setDatasource(this.dataSourceClose);
        //this.CloseSTOGridOptions.api.setQuickFilter(this.filterCloseVal);
    }
    EditSTO(SOHeaderID) {
        this.selectedId = SOHeaderID;
        this.IsEditorVisible = true;
        // this._router.navigate(['EditSO'], { queryParams: { ID: SOHeaderID } });
    }

    onloadClosedOrder() {
        this.OrderType = 'Closed';
        this.CloseSTOGridOptions.api.setDatasource(this.dataSourceClose);
    }
    onloadOpenOrder() {
        this.OrderType = 'Open';
        // this.CloseSTOGridOptions.api.setDatasource(this.dataSourceClose);
    }
    ChangeEditorVisibility(data) {
        if (data) {
            this.openSTOGridOptions.api.setDatasource(this.dataSource);
            this.isEditVisible = false;
            this.ShowChart = false;
            setTimeout(() => {
                this.ShowChart = false;
            }, 1);
        }
        var node = this.openSTOGridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }

        this.IsEditorVisible = false;
    }


    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {
                this.EditSTO(data.SOHeaderID);
            }
        }
    }

    selectFile(): void {
        this._importPopup.open();
        this.ShowUploadbutton = true;
        this.jsonArray = [];
        this.ImportStatus = "";
        //var thisElement = <HTMLInputElement>document.getElementById("ExcelFileControl");
        //thisElement.click();

    }

    close() {
        this._importPopup.close();
        this.ShowUploadbutton = true;

        var me = this;
        me.fileInput.nativeElement.value = "";
        me.jsonArray = [];
    }

    onChangeFileInput(event): void {
        if (event.currentTarget.files.length == 1) {
            this.ShowUploadbutton = false;
            this.ImportStatus = "";
        }
    }


    addFile(): void {

        try {
            this.Result = '';



            let fi = this.fileInput.nativeElement;
            var file: File = fi.files[0];

            if (file == undefined) {
                this.Result = 'Excel File Required!';
                return;
            }
            var fileName = file.name;
            var fileExt = fileName.substring(fileName.lastIndexOf('.'));

            if (['.xls', '.xlsx'].indexOf(fileExt) < 0) {
                this.Result = "Invalid File Extension!";
                return;
            }
            var partnerinfo = this._globalService.getItem('partnerinfo')[0];
            var me = this;
            var myReader: FileReader = new FileReader();
            myReader.onload = function (event) {
                var result = event.target["result"];
                var workbook = XLSX.read(result, { type: 'binary' });
                //var first_sheet_name = workbook.SheetNames[0];
                me.jsonArray = [];

                var sheetsArray = Object.keys(workbook.Sheets).map(function (sheetName) {
                    var worksheet = workbook.Sheets[sheetName];
                    //me.ReadExcel(worksheet, "A1:I2", sheetName);
                    me.ReadExcel(worksheet, "A1:O2", sheetName);
                });
                me.regXMLData = me.jsonArray;


                me.ImportInProcess = true;

                var ordersArray = Object.keys(me.jsonArray).map(function (index) {
                    me.stoService.importSO(me.jsonArray[index][0], me.OnLoadPartnerID)
                        .subscribe(returnvalue => {
                            me.Result = returnvalue.result;
                            me.ImportResults = returnvalue.result.split('#');

                            if (me.ImportResults.length > 1) {
                                me.ImportResults.splice(me.ImportResults.length - 1, 1);
                                me.ImportStatus = "Failed";
                                me.jsonArray[index][0].ImportStatus = "Failed";
                            }
                            else {
                                me.ImportStatus = "Success";
                                me.openSTOGridOptions.api.setDatasource(me.dataSource);
                                me.jsonArray[index][0].ImportStatus = "Success";
                            }
                            me.fileInput.nativeElement.value = "";
                            me.ImportInProcess = false;
                            me.jsonArray[index][0].Errors = me.ImportResults;
                        }, error => {
                            me.errorMessage = <any>error;
                            me.ImportInProcess = false;
                        });
                });


            }
            myReader.readAsArrayBuffer(file);

        }
        catch (e) {
            this.Result = e;
        }
    }


    ReadExcel(worksheet, Range, sheetName) {
        //["ItemNumber", "ArticleNumber", "ItemName", "ItemDescription", "Manufacturer", "ItemModel", "ItemPrice"]
        var jsonstring = '';
        if (Range == "") {
            this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            //for (let d of this.jsonlist) {
            //    if (this.jsonlist.hasOwnProperty[d]) {
            //        this.jsonlistFinal.push(d);
            //    }
            //}

            jsonstring = JSON.stringify({ 'root': this.jsonlist });
        }
        else {

            //this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: Range });
            //this.jsonlist[0].ItemMasterList = XLSX.utils.sheet_to_json(worksheet, { range: 2 });
            //jsonstring = this.jsonlist[0];

            var obj = XLSX.utils.sheet_to_json(worksheet, { range: Range });
            obj[0].ItemMasterList = XLSX.utils.sheet_to_json(worksheet, { range: 2 });
            obj[0].SheetName = sheetName;
            this.jsonArray.push(obj);




        }


    }
}   
