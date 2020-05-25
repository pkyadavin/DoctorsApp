import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModelService } from './category.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'

import { Model } from './category.model';
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { CommonService } from '../../shared/common.service'
import { Property, Util } from 'src/app/app.util';
import { SidebarService } from '../sidebar/sidebar.service';

declare var $: any;

@Component({
    selector: 'ModelGrid',
    providers: [ModelService],
    templateUrl: './category.html'
})
export class ModelGrid extends Property {

    @Input() userGridType: string;
    @Input("GridType") GridType: string;

    @Input() itemmodelGridType: string;
    @Output() notifyItemModel: EventEmitter<any> = new EventEmitter<any>();

    IsEditorVisible: boolean = false;
    SelectedId: number;
    models: Observable<Model[]>;
    modellist: Model[];
    gridOptions: GridOptions;
    errorMessage: string;
    filterValue: string
    dataSource: any;
    status: any = 0;
    isEditVisible: boolean = false;
    IsGridLoaded: boolean = false;
    moduleTitle: string;
    partnerID: any;
    LocalAccess: any = [];
    columnDefs =
        [
            { headerName: 'Article Name', field: "ArticleNumber", width: 200 },
            { headerName: 'Item Name', field: "ItemName", width: 200 },
        ];
    CurrentModel: Model = new Model()
    constructor(
        private modelService: ModelService
        , private _router: Router, public commonService: CommonService
        , private activateRoute: ActivatedRoute
        , private _menu: SidebarService
        , private _globalService: GlobalVariableService
        ,private _util:Util) {
        super();
    }
    @ViewChild('pop') _popup: message;

    public onActionChk(data: any) {
        this.notifyItemModel.emit(data);
    }
    ngOnInit() {
        if (this.itemmodelGridType == "popuprefress") {
            $('#divHeader').addClass('widget-header');
        }
        else {
            $('#divHeader').addClass('widget-header widget-header1');
            $('#divForm').addClass('marginTop34');
        }

        var partnerinfo = this._globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        if (this.itemmodelGridType != 'popup') {
            //this.moduleTitle = this._globalService.getModuleTitle(this.activateRoute.snapshot.parent.url[0].path); 
            this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;

            this.loadPermissionByModule(this.moduleTitle);

            if (this.itemmodelGridType == "popuprefress")
                this.moduleTitle = "Product Model";

        } else {
            this.moduleTitle = 'Item Model';
            this.status = 1;
        }

        this.filterValue = null;
        this.gridOptions = {
            rowData: this.modellist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            
            //paginationInitialRowCount: 1,
            //maxPagesInPaginationCache: 2
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
                setTimeout(function() {
                    params.api.sizeColumnsToFit();
                  },2000);
            },
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
                this.modelService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.status, this.partnerID).
                    subscribe(
                        result => {
                            var rowsThisPage = result.recordsets[0];
                            //if (!this.IsGridLoaded)
                            var colDefs = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                            //var isPermission = this.ShowPerMission("View");
                            //this.IsGridLoaded = true;     
                            //this._globalService.setLinkCellRender(colDefs, 'ModelName', isPermission); 

                            //if (this.itemmodelGridType == "popuprefress") {
                            //    colDefs.unshift({
                            //        headerName: "Select",
                            //        width: 200,
                            //        template: '<a style="cursor:pointer;" data-action-type="selectItemModel">Select</a>'
                            //    });
                            //}
                            if(!this.gridOptions.columnApi.getAllColumns())
                            this.gridOptions.api.setColumnDefs(colDefs);
                            var lastRow = result.totalcount;
                            params.successCallback(rowsThisPage, lastRow);
                            this.isEditVisible = false;
                        });
            }
        }
        this.gridOptions.datasource = this.dataSource;
        
    }
    onSelectionChanged() {
        this.isEditVisible = true;
        this.CurrentModel = this.gridOptions.api.getSelectedRows()[0];
        if (!this.CurrentModel) {
            this.isEditVisible = false;
        }
    }
    OnParentWindowReBind() {
        if (this.itemmodelGridType == "popuprefress") {
        }
    }
    OnEditModel(ModelID) {
        this.SelectedId = ModelID;
        this.IsEditorVisible = true;
        // this._router.navigate(['EditModel'], { queryParams: { ID: ModelID } });
    }
    onFilterChanged() {
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterValue);
    }

    closepopup() {
        this.notifyItemModel.emit();
    }

    Delete(rowTodelete) {
        var me = this;
        this._popup.Confirm('Delete', 'Do you want to remove this Record?', function () {

            me.modelService.remove(rowTodelete)
                .subscribe(
                    Result => {
                        var result = Result.data;
                        if (result == "Deleted") {                                                    
                            me._util.success('Record Deleted Successfully','success','success');
                            me.gridOptions.api.setDatasource(me.dataSource);

                            if (me.itemmodelGridType == "popuprefress") {
                                me.notifyItemModel.emit();
                            }
                            else {
                                me.onCancel();
                            }

                            return;
                        }
                        else {                            
                            this._util.error('Record cannot be deleted.','alert','alert');
                            me.onCancel();
                            return;
                        }

                    },
                    error => this.errorMessage = <any>error);

        });
    }
    onCancel() {
        this._router.navigate(['/app.Model']);
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, Module).subscribe(
            returnvalue => {
                this.Permissions = returnvalue[0];
                this.LocalAccess = returnvalue[0].map(function (item) {
                    return item['FunctionName'];
                });
                //added
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
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
            this.isEditVisible = false;
        }
        this.IsEditorVisible = false;
        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "selectItemModel") {
                return this.onActionChk(data);
            }
            else if (actionType == "edit") {

                this.OnEditModel(data.ModelID);

            }
        }
    }
}