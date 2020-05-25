import { Component,  ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NotificationTemplate,
  MessageSetUpKeyValueData
} from './notificationtemplate.model.js';
import { Language } from './language.model.js';
import { Property, Util } from '../../app.util';
import { ScheduleDay } from './ScheduleDay.model.js';
import { CommonService } from '../../shared/common.service';
import { NotificationTemplateService } from './notificationtemplate.Service.js';
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { GridOptions } from 'ag-grid-community';
import { SidebarService } from '../sidebar/sidebar.service.js';
import { ActiveComponent } from 'src/app/shared/active.component';
import { AnalyticsService } from '../analytics/analytics.service';
import { ApplicationInsightsService } from 'src/app/ApplicationInsightsService';
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
@Component({
  selector: "NotificationTemplateGrid",
  providers: [NotificationTemplateService, ApplicationInsightsService],
  templateUrl: './notificationtemplate.html'
})
export class NotificationTemplateGrid extends Property {
  private gridApi;
  private gridColumnApi;
  public brands: any = [];
  notificationtemplates: NotificationTemplate[];
  IsGridLoaded = false;
  gridOptions: GridOptions;
  errorMessage: string;
  ntID: number;
  IsLoaded: boolean;
  ListView = true;
  filterValue: string = null;
  dataSource: any;
  DisabledNameAndCode: boolean;
  IsEmailNotification: boolean;
  IsTextNotification: boolean;
  LanguageList: Language[];
  SelectedBrandID: number;
  SelectedBrandName: string;
  MessageSetUpKeyValueData: Observable<MessageSetUpKeyValueData>;
  Selected1stSchedule: ScheduleDay;
  Selected2ndSchedule: ScheduleDay;
  Selected3rdSchedule: ScheduleDay;
  scheduleDaysList: ScheduleDay[];
  SelectedLanguage: Language;
  config: any;
  @ViewChild('pop') _popup: message;
  @ViewChild('pop1') _popup1: modal;
  columnDefs = [
    { headerName: 'Template Code', field: 'TemplateCode', width: 180 },
    { headerName: 'Template Name', field: 'TemplateName', width: 180 },
    { headerName: 'Created By', field: 'CreatedBy', width: 180 },
    { headerName: 'Created Date', field: 'CreatedDate', width: 120 },
    {
      headerName: 'Active',
      field: 'IsActive',
      width: 80,
      cellRenderer: this.onCheckRenderer
    },
    { headerName: 'Modified By', field: 'ModifiedBy', width: 180 },
    { headerName: 'Modified Date', field: 'ModifyDate', width: 120 }
  ];

  CurrentNotificationTemplate: NotificationTemplate = new NotificationTemplate();

  constructor(
    private loaderService: LoaderService,
    private _util: Util,
    private _menu: SidebarService,
    private _router: Router,
    private notificationTempService: NotificationTemplateService,
    private activateRoute: ActivatedRoute,
    public commonService: CommonService,
    private _globalService: GlobalVariableService,
    private _analytics: AnalyticsService,
    private _appInsightService: ApplicationInsightsService
  ) {
    super();
    this.loaderService.display(true);
    this.config = {
      height: '400px',
      toolbarGroups: [
        { name: 'document', groups: ['mode'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'insert' },
        '/',
        { name: 'styles' },
        { name: 'colors' }
      ],
      allowedContent: true
    };

    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;

    const partnerinfo = _globalService.getItem('partnerinfo');
    this.SelectedBrandID = partnerinfo[0].LogInUserPartnerID;
    this._analytics.getPartners().subscribe(data => {
      this.brands = data.recordsets.filter(f => f.PartnerType === 'Brands');
      this.SelectedBrandID = this.brands[0].PartnerID;
      this.SelectedBrandName = this.brands[0].PartnerName;
      this.onFilterChanged();
    });
  }

  onCheckRenderer(params: any) {
    if (params.value != null) {
      if (params.value.toString() == 'true') {
        return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"> <span ng-cell-text class="ng-binding"><i class="fa fa-check-circle"></i></span> </div>';
      } else {
        return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"> <span ng-cell-text class="ng-binding"><i class="fa fa-times-circle"></i></span> </div>';
      }
    }
  }

  onCellRenderer(params: any) {
    if (params.value != null) { return params.value.toString(); }
  }

  onSelectionChanged() {
    const nt = this.gridOptions.api.getSelectedRows()[0];
    if (nt) {
      this.ntID = nt.ID;
    } else {
      this.ntID = 0;
    }
  }


  ngOnInit() {
    this._appInsightService.logPageView('Email Notification', this._router.url);
    this.gridOptions = {
      rowData: this.notificationtemplates,
      columnDefs: null,
      enableColResize: true,
      enableServerSideSorting: true,
      rowSelection: 'single',
      rowDeselection: true,
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 20,
      cacheOverflowSize: 20,
      maxConcurrentDatasourceRequests: 2,
      infiniteInitialRowCount: 1,
      maxBlocksInCache: 20,
      cacheBlockSize: 20,
      rowHeight: 38
    };
    this.dataSource = {
      rowCount: null, // behave as infinite scroll
      paginationPageSize: 20,
      paginationOverflowSize: 20,
      maxConcurrentDatasourceRequests: 2,
      maxPagesInPaginationCache: 20,
      getRows: (params: any) => {
        let sortColID = null;
        let sortDirection = null;
        if (typeof params.sortModel[0] !== 'undefined') {
          sortColID = params.sortModel[0].colId;
          sortDirection = params.sortModel[0].sort;
        }

        this.loaderService.display(true);
        this.notificationTempService
          .loadAll(
            params.startRow,
            params.endRow,
            sortColID,
            sortDirection,
            this.filterValue,
            this.SelectedBrandID
          )
          .subscribe(result => {
            this.loaderService.display(false);
            this.LocalAccess = JSON.parse(result.access_rights).map(function(
              e
            ) {
              return e.FunctionType;
            });
            let rowsThisPage = result.recordsets[0];
            let localize = JSON.parse(
              result.recordsets[1][0].ColumnDefinations
            );

            this.h_localize = $.grep(localize, function(n, i) {
              return n.ShowinGrid === true;
            });

            let localeditor = localize.map(function(e) {
              return (
                '"' +
                e.field +
                '": {"headerName": "' +
                e.headerName +
                '", "isRequired": ' +
                e.isRequired +
                ', "isVisible": ' +
                e.isVisible +
                ', "isEnabled": ' +
                e.isEnabled +
                ', "width": ' +
                e.width +
                ' }'
              );
            });
            this.e_localize = JSON.parse('{' + localeditor.join(',') + '}');
            const coldef = localize.find(element => element.field == 'IsActive');
            if (coldef != null) {
              coldef.cellRendererFramework = ActiveComponent;
            }

            if (this.hasPermission('View')) {
              this._globalService.setLinkCellRender(
                localize,
                'TemplateCode',
                true
              );
            }

            if (!this.gridOptions.columnApi.getAllColumns()) {
              this.gridOptions.api.setColumnDefs(this.h_localize);
            }
            const lastRow = result.totalcount;
            params.successCallback(rowsThisPage, lastRow);
            this.ntID = 0;
          });
      }
    };

    this.gridOptions.datasource = this.dataSource;

    this.notificationTempService
      .loadLanguagesByBrandID(this.SelectedBrandID)
      .subscribe(
        languages => {
          this.LanguageList = languages;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });

    this.notificationTempService.loadAllScheduledays().subscribe(
      scheduleDays => {
        this.scheduleDaysList = scheduleDays;
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });
  }

  OnSelectBrand(brndID, brndName) {
    this.SelectedBrandID = brndID;
    this.SelectedBrandName = brndName.selectedOptions[0].label;
    if (this.SelectedBrandID == undefined || this.SelectedBrandID <= 0) {
      this._util.error('Please select Brand.', '');
      return;
    }
    this.onFilterChanged();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.api.sizeColumnsToFit();
    setTimeout(function() {
      this.gridApi.api.sizeColumnsToFit();
    }, 2000);
  }

  highlightBG(tblTd, color) {
    $('.tblTDClass').css('background-color', '');
    $('#KV' + tblTd).css('background-color', color);
  }

  onFilterChanged() {
    this.loaderService.display(true);
    if (this.filterValue === '') {
      this.filterValue = null;
    }
    this.ntID = 0;
    this.gridOptions.api.setDatasource(this.dataSource);

  }

  onSubmit(form) {
    let dd = this.CurrentNotificationTemplate.EnableSchedule;

    if (!form.valid) {
      for (let i in form.controls) {
        form.controls[i].markAsTouched();
      }
      return;
    }
    this.loaderService.display(true);
    this.notificationTempService
      .save(this.CurrentNotificationTemplate)
      .subscribe(
        returnvalue => {
          let me = this;
          this.loaderService.display(false);
          if (returnvalue.result == 'Already Exists') {
            this._util.error(
              'Email Template already exists on language.',
              'Error'
            );
            me.ntID = 0;
            me.gridOptions.api.setDatasource(me.dataSource);
          } else {
            this._util.success(
              'Email Template has been updated successfully.',
              'Success',
              'Success'
            );
            me.ntID = 0;
            me.gridOptions.api.setDatasource(me.dataSource);
            this.Cancel();
          }
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
  }

  IsEmpty(val) {
    return val === undefined || val == null || val.length <= 0 ? false : val;
  }

  IsDefaultValue(val) {
    return val === undefined || val == null || val.length <= 0 ? 0 : val;
  }

  Show(mode: string) {
    if (mode === 'Add') {
      this.ntID = 0;
    }
    this.IsLoaded = false;
    this.notificationTempService
      .loadLanguagesByBrandID(this.SelectedBrandID)
      .subscribe(
        languages => {
          this.LanguageList = languages;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
    this.notificationTempService.load(this.ntID).subscribe(
      result => {
        if (mode === 'Add') {
          this.CurrentNotificationTemplate = new NotificationTemplate();
          this.CurrentNotificationTemplate.ID = 0;
          this.CurrentNotificationTemplate.LanguageID = 0;
          this.CurrentNotificationTemplate.NotificationScheduleID = 0;
          this.CurrentNotificationTemplate.IsActive = true;
          this.CurrentNotificationTemplate.BrandID = 0;
        } else {
          this.CurrentNotificationTemplate = result[0][0];
        }

        this.CurrentNotificationTemplate.EnableSchedule = false;
        this.CurrentNotificationTemplate.IsEmailNotification = this.IsEmpty(
          this.CurrentNotificationTemplate.IsEmailNotification
        );
        this.CurrentNotificationTemplate.IsTextNotification = this.IsEmpty(
          this.CurrentNotificationTemplate.IsTextNotification
        );
        this.MessageSetUpKeyValueData = result[1];
        this.ListView = false;
        this.IsLoaded = true;
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });
  }

  Delete(me: any = this) {
    this._popup.Confirm(
      'Delete',
      'Do you really want to remove this Notification Template?',
      function() {
        me.IsLoaded = true;
        me.notificationTempService.remove(me.ntID).subscribe(
          result => {
            me.ListView = true;
            me.ntID = 0;
            me.gridOptions.api.setDatasource(me.dataSource);
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });
      }
    );
  }

  async loadPermissionByModule(Module: string) {
    const partnerinfo = this._globalService.getItem('partnerinfo')[0];
    await this.commonService
      .loadPermissionByModule(
        partnerinfo.UserId,
        partnerinfo.LogInUserPartnerID,
        Module
      )
      .subscribe(returnvalue => {
        this.Permissions = returnvalue[0];
        this.LocalAccess = returnvalue[0].map(function(item) {
          return item['FunctionName'];
        });
      });
  }

  ShowPerMission(permission: string): boolean {
    if (typeof this.Permissions === 'undefined') {
      return false;
    } else {
      const index = this.Permissions.findIndex(x => x.FunctionName == permission);
      if (index >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  getSelectedLanguages(langugeID) {
    if (
      this.CurrentNotificationTemplate.TemplateCode != undefined &&
      this.CurrentNotificationTemplate.TemplateCode != ''
    ) {
      const code = this.CurrentNotificationTemplate.TemplateCode;
      const Name = this.CurrentNotificationTemplate.TemplateName;
      this.IsLoaded = false;
      this.notificationTempService
        .loadOnChangeByBrandID(langugeID, this.SelectedBrandID, code)
        .subscribe(
          result => {
            if (result[0][0]) {
              this.CurrentNotificationTemplate = result[0][0];
              this.MessageSetUpKeyValueData = result[1];
            } else {
              this.CurrentNotificationTemplate = new NotificationTemplate();
              this.CurrentNotificationTemplate.ID = 0;
              this.CurrentNotificationTemplate.LanguageID = langugeID;
              this.CurrentNotificationTemplate.EnableSchedule = true;
              this.CurrentNotificationTemplate.TemplateCode = code;
              this.CurrentNotificationTemplate.TemplateName = Name;
              this.CurrentNotificationTemplate.NotificationScheduleID = 0;
              this.CurrentNotificationTemplate.IsActive = true;
              this.CurrentNotificationTemplate.BrandID = this.SelectedBrandID;
            }
            this.CurrentNotificationTemplate.IsEmailNotification = this.IsEmpty(
              this.CurrentNotificationTemplate.IsEmailNotification
            );
            this.CurrentNotificationTemplate.IsTextNotification = this.IsEmpty(
              this.CurrentNotificationTemplate.IsTextNotification
            );
            this.DisabledNameAndCode = true;
            this.IsLoaded = true;
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });
    }
  }

  Cancel() {
    this.ListView = true;
    this.ntID = 0;
    this.DisabledNameAndCode = false;

    // var node = this.gridOptions.api.getSelectedNodes()[0];
    // node.setSelected(false);
  }

  onRowClicked(e) {
    if (e.event.target !== undefined) {
      const data = e.data;
      const actionType = e.event.target.getAttribute('data-action-type');
      if (actionType == 'edit') {
        this.ntID = data.ID;
        this.Show('Edit');
      }
    }
  }
}
