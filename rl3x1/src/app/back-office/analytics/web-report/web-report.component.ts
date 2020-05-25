import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Util, Property } from 'src/app/app.util';
import { SidebarService } from '../../sidebar/sidebar.service';
import { AnalyticsService } from '../analytics.service';
import { GridOptions } from 'ag-grid-community';
import { HttpHeaders } from '@angular/common/http';
import { WINDOW } from '../../../app.window';
import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfigurationConstants } from 'src/app/shared/constants';
import * as moment from "moment-timezone";
declare var $: any;
@Component({
  selector: 'app-web-report',
  templateUrl: './web-report.component.html',
  styleUrls: ['./web-report.component.css']
})
export class WebReportComponent extends Property implements OnInit {
  report: string;
  filter_data: filter;
  report_data: any;

  gridOptions: GridOptions;
  dataSource: any;
  gridapi = null;
  gridcolumnApi = null;

  brands: any = [];
  return_centers: any = [];
  statuses: any = [];

  public bsConfig: Partial<BsDatepickerConfig>;
  constructor(@Inject(WINDOW) private window: Window, private _route: ActivatedRoute, private _util: Util,
    private _menu: SidebarService, private _router: Router,
    private _analytics: AnalyticsService) {
    super();
    this.bsConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        maxDate: new Date(),
      }
    );
  }

  onGridReady(params) {
    this.gridapi = params.api;
    this.gridcolumnApi = params.columnApi;
  }

  ngOnInit() {
    this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
    this._analytics.getPartners().subscribe(data => {
      debugger;
      this.return_centers = data.recordsets.filter(f => f.PartnerType == 'Facility');
      this.brands = data.recordsets.filter(f => f.PartnerType == 'Brands')
    });
    this._analytics.getTypes('SROStatus').subscribe(data => {
      this.statuses = data;
    });
    this._route.paramMap.subscribe(params => {
      this.filter_data = new filter();

      this.report = this._route.snapshot.paramMap.get('Code');
      if (this.gridOptions) {
        this.gridOptions.api.setColumnDefs(null);
        this.gridOptions.api.setDatasource(this.dataSource);
      }
    });
    this.gridOptions = {
      rowData: null,
      columnDefs: null,
      enableColResize: true,
      enableServerSideSorting: true,
      rowSelection: 'single',
      rowDeselection: true,
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 100,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 2,
      infiniteInitialRowCount: 1,
      maxBlocksInCache: 2,
      cacheBlockSize: 100,
    };
    this.dataSource = {
      rowCount: null, // behave as infinite scroll
      paginationPageSize: 100,
      paginationOverflowSize: 100,
      maxConcurrentDatasourceRequests: 1,
      maxPagesInPaginationCache: 1,
      getRows: (params: any) => {
        if (typeof params.sortModel[0] != 'undefined') {
          this.filter_data.sort_column = params.sortModel[0].colId;
          this.filter_data.sort_direction = params.sortModel[0].sort;
        }
        this.filter_data.start_row = params.startRow;
        this.filter_data.end_row = params.endRow;
        //this.filter_data.push({ start_row: params.startRow, end_row: params.endRow, sort_column: sortColumn, sort_direction: sortDirection, filter_value: '' });
        this._analytics.getreportdata(this.report, this.filter_data).subscribe(
          result => {
            var rowsThisPage = result.data;
            var lastRow = result.total_count;
            this.h_localize = $.grep(JSON.parse(result.columns), function (n, i) { return n.ShowinGrid === true; });

            var columns = this.gridcolumnApi.getAllColumns()
            if (!columns || columns.length == 0)
              this.gridapi.setColumnDefs(this.h_localize);

            if (rowsThisPage.length <= 0)
              this.gridOptions.api.showNoRowsOverlay();
            else
              this.gridOptions.api.hideOverlay();

            params.successCallback(rowsThisPage, lastRow);
          },
          error => {
            this._router.navigate(['back-office/error']);
          })
      }
    }
    this.gridOptions.datasource = this.dataSource;
  }

  filter() {
    // this.filter_data.fromDate = this.filter_data.from_to_date[0];
    // this.filter_data.toDate = this.filter_data.from_to_date[1];
    this.filter_data.fromDate = moment(this.filter_data.from_to_date[0]).format('YYYY-MM-DDThh:mm:ss');
    this.filter_data.toDate = moment(this.filter_data.from_to_date[1]).format('YYYY-MM-DDThh:mm:ss');
    this.gridapi.setDatasource(this.dataSource);
  }

  download(type) {
    if (type == "e") {
      this.onExportToExcel()
    }
    else if(type == "c") {
      this.onExportToCSV()
    }
  }
  onExportToExcel(): void {
    var _fromDate=moment(this.filter_data.from_to_date[0]).format('YYYY-MM-DDThh:mm:ss');
    var _toDate=moment(this.filter_data.from_to_date[1]).format('YYYY-MM-DDThh:mm:ss');
    var url = ConfigurationConstants.BASEAPIURLForCarrier + "api/download/"+this.report+"/e/"+_fromDate+"/"+_toDate+"/"+this.filter_data.return_dc+"/"+this.filter_data.brand+"/"+this.filter_data.status;    
    window.open(url, '_blank');
  }
  onExportToCSV(): void {
    var _fromDate=moment(this.filter_data.from_to_date[0]).format('YYYY-MM-DDThh:mm:ss');
    var _toDate=moment(this.filter_data.from_to_date[1]).format('YYYY-MM-DDThh:mm:ss');
    var url = ConfigurationConstants.BASEAPIURLForCarrier + "api/download/"+this.report+"/c/"+_fromDate+"/"+_toDate+"/"+this.filter_data.return_dc+"/"+this.filter_data.brand+"/"+this.filter_data.status;    
    window.open(url, '_blank');
  }
}
export class filter {
  return_dc: number;
  brand: number;
  status: number;
  from_to_date: any;
  fromDate: any;
  toDate: any;
  start_row: number;
  end_row: number;
  sort_column: string;
  sort_direction: string;
  filter_value: string;

  constructor()
  constructor(_filter: filter)
  constructor(_filter?: any) {
    this.return_dc = _filter && _filter.return_dc || 0;
    this.brand = _filter && _filter.brand || 0;
    this.status = _filter && _filter.status || 0;
    this.from_to_date = _filter && _filter.from_to_date || this.newDaterange(new Date());
    this.fromDate = _filter && _filter.fromDate || moment(this.from_to_date[0]).format('YYYY-MM-DDThh:mm:ss');
    this.toDate = _filter && _filter.toDate || moment(this.from_to_date[1]).format('YYYY-MM-DDThh:mm:ss');

    this.start_row = _filter && _filter.start_row || 0;
    this.end_row = _filter && _filter.end_row || 100;
    this.sort_column = _filter && _filter.sort_column || null;
    this.sort_direction = _filter && _filter.sort_direction || 'asc';
    this.filter_value = _filter && _filter.filter_value || null;
  }

  newDaterange(date) {
    let from_to: any = [];
    from_to.push(new Date(`${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`));
    from_to.push(new Date());
    return from_to;
  }
}
