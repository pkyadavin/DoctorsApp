import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductSizeService } from './ProductSize.service';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { ProductSizeModel } from './ProductSize.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
@Component({
  selector: 'ProductSizeGrid',
  providers: [ProductSizeService],
  templateUrl: './ProductSize.html'
})

export class ProductSize extends Property {
  IsGridLoaded = false;
  @Input() GridType: string;
  @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
  ProductSizelist: any;
  filterText: string;
  loading: boolean;
  dataSource: any;
  gridOptions: GridOptions;
  errorMessage: string;
  countries: ProductSizeModel[];
  IsLoaded = false;
  ListView = true;
  partnerID: number;
  isEditConfigSetup$ = false;
  isAddConfigSetup$ = true;
  isDeleteConfigSetup$ = false;
  isCancel$ = false;
  RegionList: any;
  UserID: number;
  isSaveClick: any;
  gridapi = null;
  gridcolumnapi = null;
  CurrentProductSizeObj: ProductSizeModel = new ProductSizeModel();
  constructor(
    private loaderService: LoaderService,
    private _util: Util,
    private _ProductSizeService: ProductSizeService,
    public commonService: CommonService,
    private _globalService: GlobalVariableService,
    private activateRoute: ActivatedRoute, )
    {
    super();
    this.moduleTitle = 'Product Size';
    const partnerinfo = _globalService.getItem('partnerinfo');
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    this.UserID = partnerinfo[0].UserId;

  }
  ngOnInit() {
    this.GetRegions();
    this.filterText = null;
    this.ProductSizelist = [];
    this.gridOptions = {
      rowData: this.ProductSizelist,
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
        this._ProductSizeService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
          subscribe(
            result => {
              this.loaderService.display(false);
              const rowsThisPage = result.recordsets[0];
              this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType; });
              const localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
              this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
              const localeditor = localize.map(function (e) {
                return '"' +
                 e.field
                 + '": {"headerName": "'
                 + e.headerName + '", "isRequired": '
                 + e.isRequired + ', "isVisible": '
                 + e.isVisible + ', "isEnabled": '
                 + e.isEnabled + ', "width": '
                 + e.width + ', "Remarks": '
                 + e.Remarks +
                 ' }';
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
                  headerName: 'ID',
                  width: 200,
                  field: 'ID',
                  hide: true,
                });
              }

              let coldef = this.h_localize.find(element => element.field === 'SizeCode');
              if (coldef != null && this.hasPermission('View')) {
                coldef.cellRendererFramework = EditComponent;
              }
              coldef = this.h_localize.find(element => element.field === 'IsActive');
              if (coldef != null) {
                coldef.cellRendererFramework = ImageColumnComponent;
              }
              if (!this.gridOptions.columnApi.getAllColumns()) {
                this.gridOptions.api.setColumnDefs(this.h_localize);
              }
              const lastRow = result.totalcount;
              params.successCallback(rowsThisPage, lastRow);
              this.isEditConfigSetup$ = false;
              this.isDeleteConfigSetup$ = false;
            });
      }
    }

    this.gridOptions.datasource = this.dataSource;
    this.loading = false;
  }
  onSelectionChanged() {
    this.isEditConfigSetup$ = true;
    this.isDeleteConfigSetup$ = true;
    this.CurrentProductSizeObj = this.gridapi.getSelectedRows()[0];
    this.CurrentProductSizeObj.ProductSizeID = this.CurrentProductSizeObj.ProductSizeID;
    if (!this.CurrentProductSizeObj) {
      this.isEditConfigSetup$ = false;
      this.isDeleteConfigSetup$ = false;
    }
  }

  onGridReady(gridParams) {
    this.gridapi = gridParams.api;
    this.gridcolumnapi = gridParams.columnApi;
    this.gridapi.setDatasource(this.dataSource)
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
        this.CurrentProductSizeObj = data;
        this.onEditCategory();
      }
    }
  }
  EditClicked(val) {
    this.CurrentProductSizeObj = val;
    this.CurrentProductSizeObj.ProductSizeID = this.CurrentProductSizeObj.ProductSizeID;
    this.onEditCategory();
  }
  GetRegions() {
    this._ProductSizeService.getRegions().
      subscribe(
        region => {
          this.RegionList = region;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
  }
  onAddCategory() {
    this.ListView = false;
    this.IsLoaded = true;
    this.CurrentProductSizeObj = new ProductSizeModel();
    if (this.CurrentProductSizeObj.IsActive == undefined) {
      this.CurrentProductSizeObj.IsActive = true;
    }
  }

  onEditCategory() {
    this.ListView = false;
  }

  Save(form) {
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

    if (this.CurrentProductSizeObj.ProductSizeID == undefined) {
      this.CurrentProductSizeObj.ProductSizeID = 0;
    }
    this.loaderService.display(true);
    this._ProductSizeService.Save(this.CurrentProductSizeObj)
      .subscribe(returnvalue => {
        this.loaderService.display(false);
        const result = returnvalue.data;
        if (result === 'Added') {
          this._util.success('ProductSize has been saved successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this.CurrentProductSizeObj = new ProductSizeModel();
          this.Cancel();
          this.loaderService.display(false);
          return;
        } else if (result === 'Updated') {
          this._util.success('ProductSize has been updated successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this.CurrentProductSizeObj = new ProductSizeModel();
          this.Cancel();
          this.loaderService.display(false);
          return;
        } else if (result === 'ProductSize Exists') {
          this._util.error('Alert', 'ProductSize already exists.');
          this.loaderService.display(false);
          return;
        } else {
          this._util.error('Alert', 'Could not be saved. Something went wrong.');
          this.loaderService.display(false);
          return;
        }
      },

        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
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
