import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { Util, Property } from 'src/app/app.util';
import { Chart, MapChart } from 'angular-highcharts';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SidebarService } from '../../sidebar/sidebar.service';
import { AnalyticsService } from '../analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
declare var require: any;
declare var InitiateEasyPieChart: any;
import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';
import ExportingModule from 'highcharts/modules/exporting';
const mapWorld = require('@highcharts/map-collection/custom/world.geo.json');
import * as HC_customEvents from 'highcharts-custom-events';
import { map } from 'rxjs-compat/operator/map';
import { HighchartsChartComponent } from 'src/app/highcharts-angular/src/lib/highcharts-chart.component';

HC_customEvents(Highcharts);

MapModule(Highcharts);
ExportingModule(Highcharts);

export interface Tile {
  color: string;
  percent: number;
  text: string;
  count: number;
  /*image: string;*/
  icon: string;
}

export interface ReturnReasonSeries {
  name: string;
  data: number[];
  type: string;
}

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.css'],
})


export class GraphicalComponent extends Property implements OnInit, AfterContentChecked {
  geodata: any = [['fo', 0],
  ['um', 1],
  ['us', 2],
  ['jp', 3],
  ['sc', 4],
  ['in', 5],
  ['fr', 6],
  ['fm', 7],
  ['cn', 8],
  ['pt', 9],
  ['sw', 10],
  ['sh', 11],
  ['br', 12],
  ['ki', 13],
  ['ph', 14],
  ['mx', 15],
  ['es', 16],
  ['bu', 17],
  ['mv', 18],
  ['sp', 19],
  ['gb', 20],
  ['gr', 21],
  ['as', 22],
  ['dk', 23],
  ['gl', 24],
  ['gu', 25],
  ['mp', 26],
  ['pr', 27],
  ['vi', 28],
  ['ca', 29],
  ['st', 30],
  ['cv', 31],
  ['dm', 32],
  ['nl', 33],
  ['jm', 34],
  ['ws', 35],
  ['om', 36],
  ['vc', 37],
  ['tr', 38],
  ['bd', 39],
  ['lc', 40],
  ['nr', 41],
  ['no', 42],
  ['kn', 43],
  ['bh', 44],
  ['to', 45],
  ['fi', 46],
  ['id', 47],
  ['mu', 48],
  ['se', 49],
  ['tt', 50],
  ['my', 51],
  ['pa', 52],
  ['pw', 53],
  ['tv', 54],
  ['mh', 55],
  ['cl', 56],
  ['th', 57],
  ['gd', 58],
  ['ee', 59],
  ['ag', 60],
  ['tw', 61],
  ['bb', 62],
  ['it', 63],
  ['mt', 64],
  ['vu', 65],
  ['sg', 66],
  ['cy', 67],
  ['lk', 68],
  ['km', 69],
  ['fj', 70],
  ['ru', 71],
  ['va', 72],
  ['sm', 73],
  ['kz', 74],
  ['az', 75],
  ['tj', 76],
  ['ls', 77],
  ['uz', 78],
  ['ma', 79],
  ['co', 80],
  ['tl', 81],
  ['tz', 82],
  ['ar', 83],
  ['sa', 84],
  ['pk', 85],
  ['ye', 86],
  ['ae', 87],
  ['ke', 88],
  ['pe', 89],
  ['do', 90],
  ['ht', 91],
  ['pg', 92],
  ['ao', 93],
  ['kh', 94],
  ['vn', 95],
  ['mz', 96],
  ['cr', 97],
  ['bj', 98],
  ['ng', 99],
  ['ir', 100],
  ['sv', 101],
  ['sl', 102],
  ['gw', 103],
  ['hr', 104],
  ['bz', 105],
  ['za', 106],
  ['cf', 107],
  ['sd', 108],
  ['cd', 109],
  ['kw', 110],
  ['de', 111],
  ['be', 112],
  ['ie', 113],
  ['kp', 114],
  ['kr', 115],
  ['gy', 116],
  ['hn', 117],
  ['mm', 118],
  ['ga', 119],
  ['gq', 120],
  ['ni', 121],
  ['lv', 122],
  ['ug', 123],
  ['mw', 124],
  ['am', 125],
  ['sx', 126],
  ['tm', 127],
  ['zm', 128],
  ['nc', 129],
  ['mr', 130],
  ['dz', 131],
  ['lt', 132],
  ['et', 133],
  ['er', 134],
  ['gh', 135],
  ['si', 136],
  ['gt', 137],
  ['ba', 138],
  ['jo', 139],
  ['sy', 140],
  ['mc', 141],
  ['al', 142],
  ['uy', 143],
  ['cnm', 144],
  ['mn', 145],
  ['rw', 146],
  ['so', 147],
  ['bo', 148],
  ['cm', 149],
  ['cg', 150],
  ['eh', 151],
  ['rs', 152],
  ['me', 153],
  ['tg', 154],
  ['la', 155],
  ['af', 156],
  ['ua', 157],
  ['sk', 158],
  ['jk', 159],
  ['bg', 160],
  ['qa', 161],
  ['li', 162],
  ['at', 163],
  ['sz', 164],
  ['hu', 165],
  ['ro', 166],
  ['ne', 167],
  ['lu', 168],
  ['ad', 169],
  ['ci', 170],
  ['lr', 171],
  ['bn', 172],
  ['iq', 173],
  ['ge', 174],
  ['gm', 175],
  ['ch', 176],
  ['td', 177],
  ['kv', 178],
  ['lb', 179],
  ['dj', 180],
  ['bi', 181],
  ['sr', 182],
  ['il', 183],
  ['ml', 184],
  ['sn', 185],
  ['gn', 186],
  ['zw', 187],
  ['pl', 188],
  ['mk', 189],
  ['py', 190],
  ['by', 191],
  ['cz', 192],
  ['bf', 193],
  ['na', 194],
  ['ly', 195],
  ['tn', 196],
  ['bt', 197],
  ['md', 198],
  ['ss', 199],
  ['bw', 200],
  ['bs', 201],
  ['nz', 202],
  ['cu', 203],
  ['ec', 204],
  ['au', 205],
  ['ve', 206],
  ['sb', 207],
  ['mg', 208],
  ['is', 209],
  ['eg', 210],
  ['kg', 211],
  ['np', 212]
  ];
  report: string;
  filter_data: filter;
  report_data: any;
  dataSource: any;
  statusTiles: Array<Tile> = [];
  brandTiles: Array<Tile> = [];
  brands: any = [];
  return_centers: any = [];
  statuses: any = [];
  returnReasons: any = [];
  statusTotalRMA: any = [];
  brandsTotalRMA: any = [];
  returnedProducts: any = [];
  returnReasonSeriesValues: Array<ReturnReasonSeries> = [];
  categoryNames = [];
  breakpoint: number;
  colrowspan: number;
  dynRowHeight: string;
  color: any = [];
  mapData: any = [];
  public bsConfig: Partial<BsDatepickerConfig>;
  Highcharts: typeof Highcharts = Highcharts;
  @ViewChild('map') _map: HighchartsChartComponent;

  returnReasonsStack: any = [];
  returnedProductsStack: any = [];
  ReturnReasonList: any = [];
  ReturnProductList: any = [];
  CountrywiseRMA: any = [];

  worldMapChart: MapChart;

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
  ngAfterContentChecked() {
    InitiateEasyPieChart.init();
  }
  ngOnInit() {
    this.color = ['#d4bbff', '#ffffad', '#8effff', '#ff679a', '#9eff8c'];

    this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
    this._analytics.getPartners().subscribe(data => {
      this.return_centers = data.recordsets.filter(f => f.PartnerType == 'Facility');
      this.brands = data.recordsets.filter(f => f.PartnerType == 'Brands')
    });
    this._analytics.getTypes('SROStatus').subscribe(data => {
      this.statuses = data;
    });

    this.filter_data = new filter();
    this.filter_data.fromDate = `${this.filter_data.from_to_date[0].getMonth() + 1}-${this.filter_data.from_to_date[0].getDate()}-${this.filter_data.from_to_date[0].getFullYear()}`;
    this.filter_data.toDate = `${this.filter_data.from_to_date[1].getMonth() + 1}-${this.filter_data.from_to_date[1].getDate()}-${this.filter_data.from_to_date[1].getFullYear()}`;
    this.bindGraph(false);

  }

  bindGraph(isFiredByButtonClick: boolean) {
    this.filter_data.fromDate = new Date(this.filter_data.from_to_date[0]);
    this.filter_data.toDate = new Date(this.filter_data.from_to_date[1]);
    this._analytics.getgraphicaldata(this.filter_data).subscribe(data => {
      //TODO, pass actual values of logged in user      
      this.statusTotalRMA = data.data[0] != undefined ? data.data[0] : null;
      this.returnReasons = data.data[1] != undefined ? data.data[1] : null;
      this.brandsTotalRMA = data.data[2] != undefined ? data.data[2] : null;
      this.returnedProducts = data.data[3] != undefined ? data.data[3] : null;
      this.mapData = data.data[5] != undefined ? JSON.parse(data.data[5]["0"].MapData) : null;

      this.returnReasonsStack = data.data[6] && JSON.parse(data.data[6]["0"].TopReturnReasonsBrandwise) || null;
      this.ReturnReasonList = data.data[7] && JSON.parse(data.data[7]["0"].ReturnReasonList) || null;
      this.returnedProductsStack = data.data[8] && JSON.parse(data.data[8]["0"].TopReturnedProductsBrandwise) || null;
      this.ReturnProductList = data.data[9] && JSON.parse(data.data[9]["0"].ReturnProductList) || null;
      this.CountrywiseRMA = data.data[10] && JSON.parse(data.data[10]["0"].CountrywiseRMA) || null;

      this.chartMap = this.chartMap;
      if (this.statusTotalRMA != null) {
        let counter = 0;
        let total = 0;

        this.statusTotalRMA.forEach(s => {
          total = total + Math.round(s.TotalStatusRMA);
        });
        this.statusTiles = [];
        this.statusTiles.push({
          color: this.color[counter],
          percent: 0,
          text: 'TOTAL',
          count: total,
          //image: '',
          icon: 'star'
        });

        this.statusTotalRMA.forEach(s => {
          if (counter == 4)
            counter = 0;

          let percent = ((s.TotalStatusRMA / total) * 100);
          this.statusTiles.push({
            color: this.color[++counter],
            percent: percent,
            text: s.StatusName.toUpperCase(),
            count: s.TotalStatusRMA,
            //image: '',
            icon: 'tasks'
          });
        });
      }

      if (this.returnReasons != null) {
        this.returnReasons.forEach(reason => {
          this.chartTopReturnReasons.addSeries(
            {
              name: reason.ReturnReasons,
              data: [reason.TotalRMA],
              type: 'column'
            }, true, false);
        });
      }

      if (this.returnedProducts != null) {
        this.returnedProducts.forEach(prod => {
          this.chartTopProducts.addSeries(
            {
              name: prod.ProductName,
              data: [prod.TotalRMA],
              type: 'column'
            }, true, false);
        });
      }


      //==========New
      let _geoData = [];
      this.CountrywiseRMA.forEach(element => {
        var tempCountryList = [];
        tempCountryList.push(element.country.toLowerCase().trim());
        tempCountryList.push(element.total_rma);
        _geoData.push(tempCountryList);
      });

      //console.log('Called Map---', _geoData);
      if (isFiredByButtonClick) {
        //this.chartMapWorld.series[0].data = _geoData;
      }
      else {
        this.drawWorldMap(_geoData);
      }
      this.worldMapChart = new MapChart(this.chartMapWorld);


      let _brands: any = [];
      this.returnReasonsStack.forEach(element => {
        if (_brands.indexOf(element.brands) < 0) {
          _brands.push(element.brands);
        }
      });

      let brandwiseReasons = new Array<ReturnReasons>();
      this.ReturnReasonList.forEach(reason => {
        let _reason = new ReturnReasons();
        _reason.ReasonName = reason.ReturnReasons || undefined;
        _brands.forEach(element => {
          _reason.RMACount.push('');
        });

        for (let index = 0; index < this.returnReasonsStack.length; index++) {
          const element = this.returnReasonsStack[index];
          element.reasons.forEach(res => {
            console.log("element.brand_id" + element.brand_id);
            console.log("res.PartnerId" + res.PartnerID)
            if (res.ReturnReasons == reason.ReturnReasons && element.brand_id == reason.PartnerID) {
              _reason.RMACount[index] = res.total_reasons;
              brandwiseReasons.push(_reason);
            }
          });
        }
      });
      this.drawStackedReturnReasonChart(_brands);
      brandwiseReasons.forEach(reason => {
        this.chartStackTopReturnReasons.addSeries(
          {
            name: reason.ReasonName,
            data: reason.RMACount,//[reason.total_reasons],
            type: 'column'
          }, true, true);
      });

      let brandwiseProducts = new Array<ReturnProducts>();
      this.ReturnProductList.forEach(product => {
        let _product = new ReturnProducts();
        _product.ProductName = product.product_name || undefined;
        _brands.forEach(element => {
          _product.RMACount.push('');
        });

        for (let index = 0; index < this.returnedProductsStack.length; index++) {
          const element = this.returnedProductsStack[index];
          element.products.forEach(prod => {
            if ((prod.product_name == product.product_name)) {
              _product.RMACount[index] = prod.total_products;
              
              brandwiseProducts.push(_product);
            }
          });
        }
      });

      this.drawStackedReturnProducts(_brands);
      brandwiseProducts.forEach(prod => {
        this.chartStackTopProducts.addSeries(
          {
            name: prod.ProductName,
            data: prod.RMACount,//[reason.total_reasons],
            type: 'column'
          }, true, true);
      });
      // console.log('tt:',this.returnReasonsStack);
      // console.log('tt:',this.returnedProductsStack);
      // console.log('rr:',_brands);
      // console.log('bb:',brandwiseProducts);

      //==========New

      if (this.brandsTotalRMA != null) {
        let counter = 0;
        let total = 0;

        this.brandsTotalRMA.forEach(s => {
          total = total + Math.round(s.TotalRMA);
        });
        this.brandTiles = [];
        this.brandTiles.push({
          color: this.color[counter],
          percent: 0,
          text: 'TOTAL',
          count: total,
          //image: '',
          icon: 'star'
        });

        this.brandsTotalRMA.forEach(s => {
          if (counter == 4)
            counter = 0;
          let percent = ((s.TotalRMA / total) * 100);

          this.brandTiles.push({
            color: this.color[++counter],
            percent: percent,
            text: s.BrandName.toUpperCase(),
            count: s.TotalRMA,
            //image: s.BrandLogo,
            icon: 'tasks'
          });
        });
      }
    });
  }

  chartTopReturnReasons = new Chart({
    chart: {
      type: 'column'

    },
    title: {
      text: 'Top Return Reasons',
      align: 'left'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'category',
      labels:
      {
        enabled: false
      }

      //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Number of returns'
      }
    },
    legend: {
      reversed: true

    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        }
      }
    }
  });

  chartTopProducts = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Top Returned Products',
      align: 'left'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'category',
      labels:
      {
        enabled: false
      }
      //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Number of returns'
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        }
      }
    }
  });

  chartMap: Highcharts.Options = {
    chart: {
      map: mapWorld
    },
  }
  redrawChartMap() {
    this.chartMap = {
      chart: {
        map: mapWorld
      },
      title: {
        text: 'Global Returns'
      },
      subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox'
        }
      },
      legend: {
        enabled: true
      },
      colorAxis: {
        min: 0
      },
      series: [{
        name: 'Returns',
        states: {
          hover: {
            color: '#BADA55'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        },
        allAreas: false,
        data: this.geodata
      } as Highcharts.SeriesMapOptions]
    }
  }

  chartMapWorld: Highcharts.Options;
  drawWorldMap(_geoData) {
    this.chartMapWorld = {
      chart: {
        map: mapWorld
      },
      title: {
        text: 'Global Returns'
      },
      subtitle: {
        text: ''//'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox'
        }
      },
      legend: {
        enabled: true
      },
      colorAxis: {
        min: 0
      },
      series: [{
        name: 'Returns',
        states: {
          hover: {
            color: '#BADA55'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        },
        allAreas: false,
        data: _geoData
      } as Highcharts.SeriesMapOptions]
    }
  }

  chartStackTopReturnReasons: Chart;
  drawStackedReturnReasonChart(_brands) {
    this.chartStackTopReturnReasons = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Return Reasons'
      },
      xAxis: {
        categories: _brands
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Returns'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold'
          }
        }
      },
      // legend: {
      //   align: 'right',
      //   x: -30,
      //   verticalAlign: 'top',
      //   y: 25,
      //   floating: true,
      //   borderColor: '#CCC',
      //   borderWidth: 1,
      //   shadow: false
      // },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          }
        }
      }
    });
  }

  chartStackTopProducts: Chart;
  drawStackedReturnProducts(_brands) {
    this.chartStackTopProducts = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Returned Products'
      },
      xAxis: {
        type: 'category',
        categories: _brands //['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Returns'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold'
          }
        }
      },
      // legend: {
      //   align: 'right',
      //   x: -30,
      //   verticalAlign: 'top',
      //   y: 25,
      //   floating: true,
      //   borderColor: '#CCC',
      //   borderWidth: 1,
      //   shadow: false
      // },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          }
        }
      },
    });
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
    this.from_to_date = _filter && _filter.from_to_date || [];
    this.fromDate = _filter && _filter.fromDate || null;
    this.toDate = _filter && _filter.toDate || null;

    this.start_row = _filter && _filter.start_row || 0;
    this.end_row = _filter && _filter.end_row || 100;
    this.sort_column = _filter && _filter.sort_column || null;
    this.sort_direction = _filter && _filter.sort_direction || 'asc';
    this.filter_value = _filter && _filter.filter_value || null;

    var date = new Date();
    if (this.from_to_date.length == 0) {
      this.from_to_date.push(new Date(`${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`));
      this.from_to_date.push(new Date());
    }
  }
}

export class ReturnReasons {
  PartnerID: string;
  ReasonName: string;
  RMACount: any = [];
}

export class ReturnProducts {
  ProductName: string;
  RMACount: any = [];
}