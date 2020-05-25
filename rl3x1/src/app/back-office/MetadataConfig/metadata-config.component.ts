import { Component, ViewChild } from '@angular/core';
import { MetadataService } from './metadata-config.Service.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { Metadata } from './metadata-config.model.js'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { message, modal } from '../../controls/pop/index.js';
import { CommonService } from '../../shared/common.service'
import { Util } from 'src/app/app.util.js';
import { SidebarService } from '../sidebar/sidebar.service.js';
declare var $: any;

@Component({
    selector: 'type-lookup',
    providers: [MetadataService, CommonService],
    //styles: ['>>> .modal-xl{width:350px;}'],
    templateUrl: './metadata-config.html'
})

export class MetadataConfigComponent {
    IsGridLoaded: boolean = false;
    moduleTitle
    activeUrl;
    filterText: string = null;
    MetaDataList: Metadata[];
    CurrentMetaData: Metadata;
    h_localize: any;
    e_localize: any;
    localize: any;
    ListView: Boolean = true;
    IsActive: Boolean = true;
    metaDataGroups: Array<string>;
    SelectedMataDataGroup: string = null;
    loading: boolean;
    errorMessage: any;
    LocalAccess = [];
    partnerID: number;

    @ViewChild('pop') _popup: message;

    dataSource: any;
    gridOptions: GridOptions;
    columnDefs = [
        { headerName: 'ID', field: "TypeLookUpID", width: 120 },
        { headerName: 'Type Code', field: "TypeCode", width: 200 },
        { headerName: 'Type Name', field: "TypeName", width: 200 },
        { headerName: 'Description', field: "Description", width: 200 },
        { headerName: 'Sort Order', field: "SortOrder", width: 200 },
        {
            headerName: 'IsActive', field: 'Active', width: 80,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding"><i class="' + params.value.toString() + '"></i></span> </div>';
            }
        }
    ];

    constructor(private _util:Util, private _menu:SidebarService,
        private metadataService: MetadataService, private _router: Router, private _activatedRoute: ActivatedRoute, private _global: GlobalVariableService, private commonService: CommonService) {
        this.CurrentMetaData = new Metadata();
        this.CurrentMetaData.TypeLookUpID = 0;

        var partnerinfo = _global.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;


        this.gridOptions = {
            rowData: this.MetaDataList,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationpaginationOverflowSize: 2,
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
                this.metadataService.loadAll(this.SelectedMataDataGroup, params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID)
                    .subscribe(
                    _MetaData => {
                        this.MetaDataList = _MetaData.recordsets[0];
                        if (!this.IsGridLoaded) {
                            this.localize = JSON.parse(_MetaData.recordsets[1][0].ColumnDefinations);
                            //var isPermission = this.LocalAccess.indexOf("View") == -1 ? false : true;
                            //this._global.setLinkCellRender(this.localize, 'TypeCode', isPermission);
                            this.IsGridLoaded = true;
                            this.h_localize = $.grep(this.localize, function (n, i) { return n.ShowinGrid === true; });
                            var localeditor = this.localize.map(function (e) {
                                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
                            });
                            this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");

                            if(!this.gridOptions.columnApi.getAllColumns())
                            this.gridOptions.api.setColumnDefs(this.h_localize);

                            this.CurrentMetaData = new Metadata();
                        }
                        var lastRow = _MetaData.totalcount;
                        this.metaDataGroups = _MetaData.recordsets[2];
                        params.successCallback(this.MetaDataList, lastRow);
                        this.CurrentMetaData = new Metadata();
                    },
                    error => this.errorMessage = <any>error);
            }
        }
        this.gridOptions.datasource = this.dataSource;
    }

    ngOnInit() {
        this.activeUrl = this._activatedRoute.snapshot.parent.url[0].path;
        //this.moduleTitle = this._global.getModuleTitle(this._activatedRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = this._global.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }

    refreshGridData() {
        this.gridOptions.api.setDatasource(this.dataSource);
    }

    onSelectionChanged() {
        //this.ListView = true;
        this.CurrentMetaData = this.gridOptions.api.getSelectedRows()[0];

        if (this.CurrentMetaData) {
            this.IsActive = this.CurrentMetaData.IsActive == 'Yes' ? true : false;
        } else {
            this.CurrentMetaData = new Metadata();
        }
    }

    onFilterChanged(filtervalue) {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }

    GetSelectedMataDataGroup(selectedValue) {
        if (this.SelectedMataDataGroup === '' || this.SelectedMataDataGroup === "--Select MetaData Group--") {
            this.SelectedMataDataGroup = null;
        }

        if (this.ListView)
            this.refreshGridData();
    }

    Show() {
        this.CurrentMetaData = new Metadata();
        this.CurrentMetaData.TypeLookUpID = 0;
        this.CurrentMetaData = new Metadata(this.CurrentMetaData);
        this.ListView = false;
    }

    ShowMetaData() {
        this.ListView = false;
    }
    isSaveClick: boolean = false;
    onSubmit(form, me: any = this) {
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            })
            this.isSaveClick = true;
            return;
        }

        if (this.CurrentMetaData.TypeGroup === 'undefined')
            this.CurrentMetaData.TypeGroup = '';
        this.CurrentMetaData.IsActive = this.IsActive.toString();
        if (this.CurrentMetaData.TypeLookUpID == 0) {
            this.metadataService.create(this.activeUrl, this.CurrentMetaData)
                .subscribe(
                _Regions => {
                    this._popup.Alert('Alert', 'Meta Data Successfully Created. ', function () { me.ListView = true; me.refreshGridData(); })
                    this.refreshGridData();
                },
                error => this.errorMessage = <any>error);
        }
        else if (this.CurrentMetaData.TypeLookUpID > 0) {
            this.metadataService.update(this.activeUrl, this.CurrentMetaData)
                .subscribe(
                _Regions => {
                    this._popup.Alert('Alert', 'Meta Data Successfully Updated. ', function () { me.ListView = true; me.refreshGridData(); })

                },
                error => {
                    this.errorMessage = <any>error;
                    this._util.error(me.errorMessage,"Alert");
                });
        }
    }

    Delete(me: any = this) {
        this._popup.Confirm('Delete', 'Are you sure you want to delete this Meta Data? ', function () {
            me.metadataService.remove(me.activeUrl, me.CurrentMetaData.TypeLookUpID)
                .subscribe(
                _Metadata => {
                    me.ListView = true;
                    me.refreshGridData();
                },
                error => {
                    this.errorMessage = <any>error;
                    this._util.error(me.errorMessage,"Alert");
                });
        })


    }

    Cancel() {
        this.ListView = true;
        this.CurrentMetaData = new Metadata();

        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {

                this.ShowMetaData();

            }
        }
    }

}