import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfigurationService } from './Configuration.service';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { ConfigurationModel } from './Configuration.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
@Component({
  selector: 'ConfigurationGrid',
  providers: [ConfigurationService],
  templateUrl: './Configuration.html'
})

export class Configuration extends Property {
  IsGridLoaded = false;
  @Input() GridType: string;
  @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
  Configurationlist: any;
  filterText: string;
  loading: boolean;
  dataSource: any;
  gridOptions: GridOptions;
  errorMessage: string;
  countries: ConfigurationModel[];
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
  CurrentConfigurationObj: ConfigurationModel = new ConfigurationModel();
  constructor(
    private loaderService: LoaderService,
    private _util: Util,
    private _ConfigurationService: ConfigurationService,
    public commonService: CommonService,
    private _globalService: GlobalVariableService,
    private activateRoute: ActivatedRoute, )
    {
    super();
    this.moduleTitle = 'General Configuration';
    const partnerinfo = _globalService.getItem('partnerinfo');
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    this.UserID = partnerinfo[0].UserId;

  }
  ngOnInit() {
    this.GetRegions();
    this.filterText = null;
    this.Configurationlist = [];
    this.gridOptions = {
      rowData: this.Configurationlist,
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
        this._ConfigurationService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
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
                  headerName: 'ID',
                  width: 200,
                  field: 'ID',
                  hide: true,
                });
              }

              let coldef = this.h_localize.find(element => element.field === 'PartnerCode');
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
    this.CurrentConfigurationObj = this.gridapi.getSelectedRows()[0];
    this.CurrentConfigurationObj.PartnerID = this.CurrentConfigurationObj.PartnerID;
    if (!this.CurrentConfigurationObj) {
      this.isEditConfigSetup$ = false;
      this.isDeleteConfigSetup$ = false;
    }
  }

  onGridReady(gridParams) {
    this.gridapi = gridParams.api;
    this.gridcolumnapi = gridParams.columnApi;
    this.gridapi.setDatasource(this.dataSource)
  }
  CheckPhoneVal() {
    // var contactnumber = $("#ContactNumber").val();
    // this.CurrentPartner = contactnumber({
    //   phone: ['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
    // });
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
        this.CurrentConfigurationObj = data;
        this.onEditCategory();
      }
    }
  }
  EditClicked(val) {
    this.CurrentConfigurationObj = val;
    this.CurrentConfigurationObj.PartnerID = this.CurrentConfigurationObj.PartnerID;
    this.onEditCategory();
  }
  GetRegions() {
    this._ConfigurationService.getRegions().
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
    this.CurrentConfigurationObj = new ConfigurationModel();
    if (this.CurrentConfigurationObj.IsActive == undefined) {
      this.CurrentConfigurationObj.IsActive = true;
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

    if (this.CurrentConfigurationObj.PartnerID == undefined) {
      this.CurrentConfigurationObj.PartnerID = 0;
    }
    this.loaderService.display(true);
    this._ConfigurationService.Save(this.CurrentConfigurationObj)
      .subscribe(returnvalue => {
        this.loaderService.display(false);
        const result = returnvalue.data;
        if (result === 'Added') {
          this._util.success('Record has been saved successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this.CurrentConfigurationObj = new ConfigurationModel();
          this.Cancel();
          this.loaderService.display(false);
          return;
        } else if (result === 'Updated') {
          this._util.success('Record has been updated successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this.CurrentConfigurationObj = new ConfigurationModel();
          this.Cancel();
          this.loaderService.display(false);
          return;
        } else if (result === 'Configuration Exists') {
          this._util.error('Alert', 'Configuration already exists.');
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
