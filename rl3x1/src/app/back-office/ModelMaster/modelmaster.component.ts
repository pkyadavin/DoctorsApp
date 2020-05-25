import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModelMasterService } from './ModelMaster.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { ModelMaster } from './modelmaster.model'
import { Manufacturer } from './manufacturer.model';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { BsModalComponent } from 'ng2-bs3-modal';
//import { ModelGrid } from '../Category/category.component';
//import { ModelEditor } from '../Category/category-editor.component';
import { EditComponent } from '../../shared/edit.component'
import { message, modal } from '../../controls/pop';
import { SidebarService } from '../sidebar/sidebar.service';
declare var XLSX: any;

@Component({
    selector: 'ModelMasterGrid',
    providers: [ModelMasterService],
    templateUrl: './modelmaster.html'
})
export class ModelMasterGrid extends Property {

    setUserGridType: string = "popup";

    @Output() notifyModelGrid: EventEmitter<ModelMaster> = new EventEmitter<ModelMaster>();
    @ViewChild('pop') _popup: message;
    @Input() itemmasterGridType: string;
    @Output() notifyItem: EventEmitter<any> = new EventEmitter<any>();
    modelmasters: Observable<ModelMaster[]>;
    IsEditorVisible: boolean = false;
    SelectedId: number;

    modelmasterlist: ModelMaster[];
    gridOptions: GridOptions;
    errorMessage: string;
    filterValue: string
    dataSource: any=[];
    status: number = 0;
    isEditVisible: boolean = false;
    IsGridLoaded: boolean;
    moduleTitle: string;
    partnerID: any;

    ShowUploadbutton: boolean = true;
    importErrorMessage: string;
    regXMLData: any;
    Result: string = '';
    selectedValue: string;
    jsonlist: any;
    ImportResults: any;
    ImportStatus: string = "";
    ImportInProcess: boolean = false;
    @ViewChild("fileInput") fileInput;
    @ViewChild('importPopup') _importPopup: BsModalComponent;

    columnDefs =
        [
            { headerName: 'Article Name', field: "ArticleNumber", width: 200 },
            { headerName: 'Item Name', field: "ItemName", width: 200 },
            { headerName: 'Item Number', field: "ItemNumber", width: 200 },
        ];

    CurrentModelMaster: ModelMaster = new ModelMaster()
    constructor(private modelmasterService: ModelMasterService
        , private _menu: SidebarService, private _router: Router
        , public commonService: CommonService
        , private activateRoute: ActivatedRoute
        , private util: Util
        , private _globalService: GlobalVariableService) {
        super();
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.loadPermissionByModule(this.moduleTitle);
    }

    ngOnInit() {
        this.filterValue = null;
        this.gridOptions = {
            rowData: this.modelmasterlist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            rowHeight: 38,
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2,
            context: {
                componentParent: this
            }
        };
        debugger;
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
                this.modelmasterService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.status, this.partnerID).
                    subscribe(
                        result => {
                            debugger;
                            var rowsThisPage = result.recordsets[0];
                            
                            // if(result.totalcount>0)
                            // {
                            var colDefs = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                          
                            this.IsGridLoaded = true;
                            if (this.itemmasterGridType == "popup") {
                                colDefs.unshift({
                                    headerName: "Select",
                                    width: 200,
                                    template: '<a style="cursor:pointer;" data-action-type="selectItem">Select</a>'
                                });
                            }

                            var coldef = colDefs.find(element => element.field == "ItemNumber");
                            if (coldef != null && this.hasPermission("View")) {
                                coldef.cellRendererFramework = EditComponent;
                            }

                            var coldef1 = colDefs.find(element => element.field == "ItemName");
                            if (coldef1 != null && this.hasPermission("View")) {
                                coldef1.cellRendererFramework = EditComponent;
                            }

                            if(!this.gridOptions.columnApi.getAllColumns())
                            this.gridOptions.api.setColumnDefs(colDefs);

                            var lastRow = result.totalcount;
                            
                            params.successCallback(rowsThisPage, lastRow);
                            this.isEditVisible = false;
                        //}
                    });
            }
        }
        this.gridOptions.datasource = this.dataSource;
    }

    onSelectionChanged() {
        this.isEditVisible = true;
        this.CurrentModelMaster = this.gridOptions.api.getSelectedRows()[0];

        if (!this.CurrentModelMaster) {
            this.isEditVisible = false;
        }
    }
    OnEditModelMaster(ItemMasterID) {
        this.SelectedId = ItemMasterID;
        this.IsEditorVisible = true;
    }

    OnDeleteModelMaster(ItemMasterID) {
        var me: any = this;
        this._popup.Confirm('Delete', 'Do you really want to remove this Product?', function () {
            me.modelmasterService.remove(ItemMasterID)
                .subscribe(
                    _Roles => {
                        //me._popup.Alert('Alert', 'Product removed successfully.');
                        this.util.Success('Product removed successfully.', '');
                        me.gridOptions.api.setDatasource(me.dataSource);
                        me.ListView = true;
                    },
                    error => {
                        me.errorMessage = <any>error;
                        if (me.errorMessage.indexOf('The DELETE statement conflicted with the REFERENCE constraint') > -1) {
                            me.errorMessage = 'Could not remove Product, It has refrenced from other information.'
                        }
                        this.util.error(me.errorMessage, 'Error!');
                    });
        });
    }

    EditClicked(val) {
        this.OnEditModelMaster(val.ItemMasterID);
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "selectItem") {
                return this.onActionChk(data);
            }
            else if (actionType == "edit") {
                this.OnEditModelMaster(data.ItemMasterID);
            }
        }
    }

    public onActionChk(data: any) {
        this.notifyItem.emit(data);
    }

    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, Module).subscribe(
            returnvalue => {
                this.Permissions = returnvalue[0];
                this.LocalAccess = returnvalue[0].map(function (item) {
                    return item['FunctionName'];
                });
            }
        )
    }

    ShowPerMission(permission: string): boolean {
        if (typeof (this.Permissions) == 'undefined') {
            return false;
        }
        else {
            var index = this.Permissions.findIndex(x => x.FunctionName == permission)
            if (index >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    ChangeEditorVisibility(data) {
        if (data) {
            this.gridOptions.api.setDatasource(this.dataSource);
        }
        this.IsEditorVisible = false;
        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }

    selectFile(): void {
        this._importPopup.open();
        this.ShowUploadbutton = true;
        this.ImportResults = [];
        this.ImportStatus = "";
    }

    close() {
        this._importPopup.close();
        this.ShowUploadbutton = true;

        var me = this;
        me.fileInput.nativeElement.value = "";
        me.ImportResults = [];

        this.gridOptions.api.setDatasource(this.dataSource);
    }

    onChangeFileInput(event): void {
        if (event.currentTarget.files.length == 1) {
            this.ShowUploadbutton = false;
            this.ImportResults = [];
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
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                me.ReadExcel(worksheet, "A1:I2");
                me.ImportInProcess = true;
                me.modelmasterService.importModelMaster(me.regXMLData, 7)
                    .subscribe(returnvalue => {
                        me.Result = returnvalue.result;
                        me.ImportResults = returnvalue.result.split('#');
                        if (me.ImportResults.length > 1) {
                            me.ImportResults.splice(me.ImportResults.length - 1, 1);
                            me.ImportStatus = "Failed";
                        }
                        else {
                            me.ImportStatus = "Success";
                            me.gridOptions.api.setDatasource(me.dataSource);
                        }
                        me.fileInput.nativeElement.value = "";
                        me.ImportInProcess = false;
                    }, error => {
                        me.errorMessage = <any>error;
                        me.ImportInProcess = false;
                    });
            }
            myReader.readAsArrayBuffer(file);
        }
        catch (e) {
            this.Result = e;
        }
    }

    ReadExcel(worksheet, Range) {
        //["ItemNumber", "ArticleNumber", "ItemName", "ItemDescription", "Manufacturer", "ItemModel", "ItemPrice"]
        var jsonstring = '';
        if (Range == "") {
            this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            jsonstring = JSON.stringify({ 'root': this.jsonlist });
        }
        else {
            this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: 0 });
            jsonstring = this.jsonlist;
        }
        this.regXMLData = jsonstring;
    }
}