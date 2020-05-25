import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CaseAssessmentService } from './CaseAssessment.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service';
import { Property, Util } from '../../app.util';
import { CaseAssessmentModel } from './CaseAssessment.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from '../../shared/active.component';
import { LoaderService } from '../../loader/loader.service';
import { Colors } from './Models/colors.model';
import { ProductSizeModel } from './Models/ProductSize.model';

declare var $: any;
@Component({
    selector: 'CaseAssessmentGrid',
    providers: [CaseAssessmentService],
    templateUrl: './CaseAssessment.html'
})

export class CaseAssessment extends Property {
    IsGridLoaded = false;
    @Input() GridType: string;
    @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
    _CaseAssessmentlist: any;
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    CaseAssessments: CaseAssessmentModel[];
    IsLoaded = false;
    ListView = true;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    _CaseAssessmentList: any;
    UserID: number;
    isSaveClick: any;
    gridapi = null;
    gridcolumnapi = null;
    ColorsList: Colors[];
    ProductSizeList: ProductSizeModel[];
    CurrentCaseAssessmentObj: CaseAssessmentModel = new CaseAssessmentModel();
    constructor(
        private _util: Util,
        private _menu: SidebarService,
        private _router: Router,
        private loaderService: LoaderService,
        private _CaseAssessmentService: CaseAssessmentService,
        public commonService: CommonService,
        private _globalService: GlobalVariableService,
        private activateRoute: ActivatedRoute, ) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        const partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;

    }
    ngOnInit() {
        this.loaderService.display(true);
        this.setDataSource();
        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }

    setDataSource() {
        this.filterText = null;
        this._CaseAssessmentlist = [];
        this.gridOptions = {
            rowData: this._CaseAssessmentlist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            rowSelection: 'single',
            rowDeselection: true,
            maxConcurrentDatasourceRequests: 2,
            cacheOverflowSize: 2,
            maxBlocksInCache: 2,
            cacheBlockSize: 20,
            context: {
                componentParent: this
            }
        };
        this.dataSource = {
            rowCount: null,
            paginationPageSize: 20,
            paginationOverflowSize: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                let sortColID = null;
                let sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.loaderService.display(true);
                this._CaseAssessmentService.loadAll(
                                          params.startRow,
                                          params.endRow,
                                          sortColID,
                                          sortDirection,
                                          this.filterText,
                                          this.partnerID).
                    subscribe(
                        result => {
                            this.loaderService.display(false);
                            const rowsThisPage = result.recordsets[0];
                            this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType; });
                            const localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
                            this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                            const localeditor = localize.map(function (e) {
                                return '"'
                                + e.field
                                + '": {"headerName": "'
                                + e.headerName
                                + '", "isRequired": '
                                + e.isRequired
                                + ', "isVisible": '
                                + e.isVisible
                                + ', "isEnabled": '
                                + e.isEnabled
                                + ', "width": '
                                + e.width + ' }';
                            });
                            this.e_localize = JSON.parse('{' + localeditor.join(',') + '}');
                            this.IsLoaded = true;
                            if (this.GridType === 'popup') {
                                localize.unshift({
                                    headerName: 'Select',
                                    width: 200,
                                    template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                                });
                                localize.unshift({
                                    headerName: '_CaseAssessmentID',
                                    width: 200,
                                    field: '_CaseAssessmentID',
                                    hide: true,
                                });
                            }
                            let coldef = this.h_localize.find(element => element.field == 'CaseID');
                            if (coldef != null && this.hasPermission('View')) {
                                coldef.cellRendererFramework = EditComponent;
                            }
                            coldef = this.h_localize.find(element => element.field == 'IsActive');
                            if (coldef != null) {
                                coldef.cellRendererFramework = ImageColumnComponent;
                                coldef.cellRendererFramework = ActiveComponent;
                            }
                            if (!this.gridOptions.columnApi.getAllColumns()) {
                                this.gridOptions.api.setColumnDefs(this.h_localize);
                            }
                            const lastRow = result.totalcount;
                            params.successCallback(rowsThisPage, lastRow);
                            this.isEditConfigSetup$ = false;
                            this.isDeleteConfigSetup$ = false;
                            this.loaderService.display(false);
                        });
            }
        };

    }

    onSelectionChanged() {
        this.isEditConfigSetup$ = false;
        this.isDeleteConfigSetup$ = false;
        this.CurrentCaseAssessmentObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentCaseAssessmentObj) {
            this.isEditConfigSetup$ = false;
            this.isDeleteConfigSetup$ = false;
        }
    }

    onGridReady(gridParams) {
        this.gridapi = gridParams.api;
        this.gridcolumnapi = gridParams.columnApi;
        this.gridapi.setDatasource(this.dataSource);
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridapi.setDatasource(this.dataSource);
    }
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');
            if (actionType === 'select') {
                this.notifyBillingCode.emit(data);
                console.log(data);
            } else if (actionType === 'edit') {
                this.CurrentCaseAssessmentObj = data;
                this.onEdit_CaseAssessment();
            }
        }
    }
    EditClicked(val) {
        this.CurrentCaseAssessmentObj = val;
        this.onEdit_CaseAssessment();
    }

    onAdd_CaseAssessment() {
        this.ListView = false;
        this.CurrentCaseAssessmentObj = new CaseAssessmentModel();
        if (this.CurrentCaseAssessmentObj.IsActive === undefined) {
            this.CurrentCaseAssessmentObj.IsActive = true;
        }
    }

    onEdit_CaseAssessment() {
      this.loaderService.display(true);
        this.ListView = false;
        this._CaseAssessmentService.loadColors().subscribe(
          Color => {
            this.ColorsList = Color;
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });

        this._CaseAssessmentService.loadProductSize().subscribe(
          ProductSize => {
            this.ProductSizeList = ProductSize;
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });
        // if (this.CurrentCaseAssessmentObj.IsActive.toString() === 'Yes') {
        //     this.CurrentCaseAssessmentObj.IsActive = true;
        // } else {
        //     this.CurrentCaseAssessmentObj.IsActive = false;
        // }
        this.loaderService.display(false);
    }
    Save(form) {
      this.loaderService.display(true);
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            });
            this.isSaveClick = true;
            this.loaderService.display(false);
            return;
        }

        this.CurrentCaseAssessmentObj.UserID = this.UserID;
        if (this.CurrentCaseAssessmentObj.CaseID == undefined) {
            this.CurrentCaseAssessmentObj.CaseID = 0;
        }

        this.loaderService.display(true);
        this._CaseAssessmentService.Save(this.CurrentCaseAssessmentObj)
            .subscribe(returnvalue => {
                const result = returnvalue.data;
                this.loaderService.display(false);
                if (result === 'Added') {
                    this._util.success('Case Assessment has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentCaseAssessmentObj = new CaseAssessmentModel();
                    this.Cancel();
                    this.loaderService.display(false);
                    return;
                } else if (result === 'Updated') {
                    this._util.success('Case Assessment has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.CurrentCaseAssessmentObj = new CaseAssessmentModel();
                    this.Cancel();
                    this.loaderService.display(false);
                    return;
                } else if (result === '_CaseAssessment Exists') {
                    this._util.error('Alert', 'Case Assessment already exists.');
                    this.loaderService.display(false);
                    return;
                } else {
                    this._util.error('Alert', 'Could not be saved. Something went wrong.');
                    this.loaderService.display(false);
                    return;
                }
            },
                error => this.errorMessage = <any>error);
    }

    Cancel() {
        this.ListView = true;
        this.isAddConfigSetup$ = true;
        this.isDeleteConfigSetup$ = false;
        this.isCancel$ = false;
        const node = this.gridapi.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }

    loadPermissionByModule(Module: string) {
        const partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                const localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
            }
        );
    }
}
