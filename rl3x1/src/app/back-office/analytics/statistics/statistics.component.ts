import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Util, Property } from 'src/app/app.util';
import { SidebarService } from '../../sidebar/sidebar.service';
import { AnalyticsService } from '../analytics.service';
import { HttpHeaders } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from "moment-timezone";
declare var $: any;
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent extends Property implements OnInit {
  filter_data: filter;
  daywiselist: any = [];
  brandwiselist: any = [];
  monthwiselist: any = [];
  TotalCount: any = [];
  TotalTCCount: any = [];
  TotalmCCount: any = [];
  Consumer: any = [];
  RepairPortal: any = [];
  TotalRMA: any = [];

  public bsConfig: Partial<BsDatepickerConfig>;
  constructor(private _route: ActivatedRoute, private _util: Util,
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

  ngOnInit() {
    this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
    if (this.filter_data == undefined) {
      this.filter_data = new filter();
      console.log('filterdata:',this.filter_data);
    }
    // this.filter_data.fromDate = `${this.filter_data.from_to_date[0].getMonth() + 1}-${this.filter_data.from_to_date[0].getDate()}-${this.filter_data.from_to_date[0].getFullYear()}`;
    // this.filter_data.toDate = `${this.filter_data.from_to_date[1].getMonth() + 1}-${this.filter_data.from_to_date[1].getDate()}-${this.filter_data.from_to_date[1].getFullYear()}`;

    this.filter_data.fromDate = moment(this.filter_data.from_to_date[0]).format('YYYY-MM-DDThh:mm:ss');
    this.filter_data.toDate = moment(this.filter_data.from_to_date[1]).format('YYYY-MM-DDThh:mm:ss');

    this._analytics.getstatisticsdata('statitics', this.filter_data.fromDate, this.filter_data.toDate).subscribe(data => {
      console.log('returned data:', data);
      console.log('data at 0:', data.data[0]);
      this.daywiselist = data.data[0];
      this.brandwiselist = data.data[1];
      this.monthwiselist = data.data[2];
      this.TotalCount = data.data[3];
      this.Consumer = data.data[3][0].Consumer;
      this.RepairPortal = data.data[3][0].RepairPortal;
      this.TotalRMA = data.data[3][0].TotalRMA;
      this.TotalTCCount = data.data[4];
      this.TotalmCCount = data.data[4];
    });

    // this._route.paramMap.subscribe(params => {
    //   this.filter_data = new filter();

    // });

  }
  filter() {

    // this.filter_data.fromDate = `${this.filter_data.from_to_date[0].getMonth() + 1}-${this.filter_data.from_to_date[0].getDate()}-${this.filter_data.from_to_date[0].getFullYear()}`;
    // this.filter_data.toDate = `${this.filter_data.from_to_date[1].getMonth() + 1}-${this.filter_data.from_to_date[1].getDate()}-${this.filter_data.from_to_date[1].getFullYear()}`;
    this.filter_data.fromDate = moment(this.filter_data.from_to_date[0]).format('YYYY-MM-DDThh:mm:ss');
    this.filter_data.toDate = moment(this.filter_data.from_to_date[1]).format('YYYY-MM-DDThh:mm:ss');
    this._analytics.getstatisticsdata('statitics', this.filter_data.fromDate, this.filter_data.toDate).subscribe(data => {

      this.daywiselist = data.data[0];
      this.brandwiselist = data.data[1];
      this.monthwiselist = data.data[2];
      this.TotalCount = data.data[3];
      this.Consumer = data.data[3][0].Consumer;
      this.RepairPortal = data.data[3][0].RepairPortal;
      this.TotalRMA = data.data[3][0].TotalRMA;
      this.TotalTCCount = data.data[4];
      this.TotalmCCount = data.data[4];
    });

  }

}
export class filter {

  from_to_date: any;
  fromDate: any;
  toDate: any;
  constructor()
  constructor(_filter: filter)
  constructor(_filter?: any) {

    this.from_to_date = _filter && _filter.from_to_date || [];
    this.fromDate = _filter && _filter.fromDate || null;
    this.toDate = _filter && _filter.toDate || null;
    var date = new Date();

    if (this.from_to_date.length == 0) {
      this.from_to_date.push(new Date(`${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`));
      this.from_to_date.push(new Date());

    }

  }

}
