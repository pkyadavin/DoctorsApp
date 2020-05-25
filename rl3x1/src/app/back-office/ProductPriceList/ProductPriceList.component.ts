import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProductPriceListService } from './ProductPriceList.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service';
import { Property, Util } from '../../app.util';
import {  ProductPriceListModel } from './ProductPriceList.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import * as XLSX from 'xlsx';
import { ExcelService } from './excel.service';
import { LoaderService } from '../../loader/loader.service';
import { CategoryModel } from './Models/Category.model';
import { GradeModel } from './Models/Grade.model';
import { RegionModel } from './Models/Region.model';
import { SeasonModel } from './Models/Season.model';


declare var $: any;
@Component({
  selector: 'ProductSizeGrid',
  providers: [ProductPriceListService],
  templateUrl: './ProductPriceList.html'
})

export class ProductPriceList extends Property {
  jsonlist: any;
  regXMLData: any;
  regXMLInValidData: any;
  IsGridLoaded = false;
  uploadLoader = false;
  @ViewChild('closebutton') closebutton;
  @Input() GridType: string;
  @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
  ProductSizelist: any;
  filterText: string;
  loading: boolean;
  dataSource: any;
  gridOptions: GridOptions;
  errorMessage: string;
  IsLoaded = false;
  ListView = true;
  partnerID: number;
  isEditConfigSetup$ = false;
  isAddConfigSetup$ = true;
  isDeleteConfigSetup$ = false;
  isCancel$ = false;
  // RegionList: any;
  UserID: number;
  isSaveClick: any;
  _ProductPriceListModel: ProductPriceListModel;
  _ProductPriceListModelArray: any = [];
  gridapi = null;
  gridcolumnapi = null;
  CategoryList: CategoryModel[];
  GradeList: GradeModel[];
  RegionList: RegionModel[];
  SeasonList: SeasonModel[];
  CurrentProductSizeObj: ProductPriceListModel = new ProductPriceListModel();
  constructor(
    private loaderService: LoaderService,
    private _util: Util,
    private _menu: SidebarService,
    private _router: Router,
    private excelService: ExcelService,
    private PriceListService: ProductPriceListService,
    public commonService: CommonService,
    private _globalService: GlobalVariableService,
    private activateRoute: ActivatedRoute, ) {
    super();
    this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
    const partnerinfo = _globalService.getItem('partnerinfo');
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    this.UserID = partnerinfo[0].UserId;
    this._ProductPriceListModel = new ProductPriceListModel();

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
        if (typeof params.sortModel[0] !== 'undefined') {
          sortColID = params.sortModel[0].colId;
          sortDirection = params.sortModel[0].sort;
        }

        this.loaderService.display(true);
        this.PriceListService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
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
                  headerName: 'MapId',
                  width: 200,
                  field: 'MapId',
                  hide: true,
                });
              }
              let coldef = this.h_localize.find(element => element.field === 'ProductNo');
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
    };

    this.gridOptions.datasource = this.dataSource;
    this.loadDDL();
    this.loading = false;
  }

  loadDDL() {

      this.PriceListService.loadCategory().subscribe(
        Category => {
          this.CategoryList = Category;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });

        this.PriceListService.loadGrade().subscribe(
          Grade => {
            this.GradeList = Grade;
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });

          this.PriceListService.loadRegion().subscribe(
            Region => {
              this.RegionList = Region;
            },
            error => {
              this.loaderService.display(false);
              this.errorMessage = <any>error;
            });

            this.PriceListService.loadSeason().subscribe(
              Season => {
                this.SeasonList = Season;
              },
              error => {
                this.loaderService.display(false);
                this.errorMessage = <any>error;
              });
  }

  onSelectionChanged() {  //3

    this.isEditConfigSetup$ = true;
    this.isDeleteConfigSetup$ = true;
    this.CurrentProductSizeObj = this.gridapi.getSelectedRows()[0];
    this._ProductPriceListModel = this.CurrentProductSizeObj;
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
  onRowClicked(e) {  // 2
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
    this.editRecord(val, 'update');
    this.onEditCategory();
  }
  GetRegions() {
    this.PriceListService.getRegions().
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
    this.CurrentProductSizeObj = new ProductPriceListModel();
    if (this.CurrentProductSizeObj.IsActive === undefined) {
      this.CurrentProductSizeObj.IsActive = true;
    }
  }

  onEditCategory() {
    this.ListView = false;
    if (this.CurrentProductSizeObj.IsActive !== undefined) {
      if (this.CurrentProductSizeObj.IsActive.toString() === 'Yes') {
        this.CurrentProductSizeObj.IsActive = true;
      } else {
        this.CurrentProductSizeObj.IsActive = false;
      }
    }
  }
  Save(eventtype) {
    this._ProductPriceListModelArray.length = 0;
    if (eventtype === 'save') {
      for (let i = 2; i < this.regXMLData.length; i++) {
        this.editRecord(this.regXMLData[i], eventtype === 'save' ? 'save' : 'update');
        this._ProductPriceListModelArray.push(this._ProductPriceListModel);
      }
    } else {
      this._ProductPriceListModelArray.push(this._ProductPriceListModel);
    }
    this.loaderService.display(true);
    this.PriceListService.Save(this.regXMLData)
      .subscribe(returnvalue => {
        this.loaderService.display(false);
        const result = returnvalue.data;
        if (result === 'Added') {
          this._util.success('PriceList has been saved successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this._ProductPriceListModelArray.length = 0
          this.jsonlist = null;
          this.regXMLData = null;
          this.Cancel();
          this.closebutton.nativeElement.click();
          return;
        } else if (result === 'Updated') {
          this._util.success('PriceList has been updated successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this._ProductPriceListModelArray.length = 0;
          this.jsonlist = null;
          this.regXMLData = null;
          this.Cancel();
          this.closebutton.nativeElement.click();
          return;
        } else {
          this._util.error(result, 'Alert');
          return;
        }
      },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
  }
  Update(form) {
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
    this._ProductPriceListModelArray.length = 0;

    this._ProductPriceListModel.CatID = this.CategoryList.filter(cat => cat.CatCd.toString() === this._ProductPriceListModel.CatCd.toString())[0]
    && this.CategoryList.filter(cat => cat.CatCd.toString() === this._ProductPriceListModel.CatCd.toString())[0].CatID ;


    this._ProductPriceListModel.GradeId = this.GradeList.filter(cat => cat.GradeCd.toString() === this._ProductPriceListModel.GradeCd.toString())[0]
    && this.GradeList.filter(cat => cat.GradeCd.toString() === this._ProductPriceListModel.GradeCd.toString())[0].GradeId ;


    this._ProductPriceListModel.RegionID = this.RegionList.filter(cat => cat.RegionCode.toString() === this._ProductPriceListModel.MacroRegionCd.toString())[0]
    && this.RegionList.filter(cat => cat.RegionCode.toString() === this._ProductPriceListModel.MacroRegionCd.toString())[0].RegionID ;

    this._ProductPriceListModel.SeasonID = this.SeasonList.filter(cat => cat.SeasonCode.toString() === this._ProductPriceListModel.PrimSeasonCd.toString())[0]
    && this.SeasonList.filter(cat => cat.SeasonCode.toString() === this._ProductPriceListModel.PrimSeasonCd.toString())[0].SeasonID ;


    this._ProductPriceListModelArray.push(this._ProductPriceListModel)
    this.loaderService.display(true);
    this.PriceListService.Update(this._ProductPriceListModelArray)
      .subscribe(returnvalue => {
        this.loaderService.display(false);
        const result = returnvalue.data;
        if (result === 'Added') {
          this._util.success('PriceList has been saved successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this._ProductPriceListModelArray.length = 0;
          this.jsonlist = null;
          this.Cancel();
          this.closebutton.nativeElement.click();
          return;
        } else if (result === 'Updated') {
          this._util.success('PriceList has been updated successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this._ProductPriceListModelArray.length = 0
          this.jsonlist = null;
          this.Cancel();
          this.closebutton.nativeElement.click();
          return;
        } else {
          this._util.error(result, 'Alert');
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
    )
  }
  fileChange(e: any) {
    let files = e.target.files, file;
    this.uploadLoader = true;
    //=========read excel sheet==================
    if (!files || files.length === 0) { return; }
    file = files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    const me = this;
    fileReader.onload = function (e) {
      let binary = '';
      const result = event.target['result'];
      const bytes = new Uint8Array(result);
      const length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const workbook = XLSX.read(binary, { type: 'binary', cellText: true, cellStyles: false, cellDates: true, });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      me.ReadExcel(worksheet, 'A2:M8');
      console.log(JSON.stringify(me.regXMLData));

    };
    this.uploadLoader = false;
    e.currentTarget['value'] = null;
  }

  ReadExcel(worksheet, Range) {
    let jsonstring = '';
    if (Range === '') {
      this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      jsonstring = JSON.stringify({ 'root': this.jsonlist });
    } else {
      this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: 0 });
      jsonstring = this.jsonlist;
    }
    this.regXMLData = this.validateCodes();
  }

  validateCodes() {
    const productCatalogModel = new Array<ProductPriceListModel>();
    const InValidproductCatalogModel = new Array<ProductPriceListModel>();
    this.jsonlist.forEach(element => {
      const p: ProductPriceListModel = new ProductPriceListModel(element);
      p.CatID = this.CategoryList.filter(cat => cat.CatCd.toString() === element.CatCd.toString())[0]
      && this.CategoryList.filter(cat => cat.CatCd.toString() === element.CatCd.toString())[0].CatID ;

      p.GradeId = this.GradeList.filter(cat => cat.GradeCd.toString() === element.GradeCd.toString())[0]
      && this.GradeList.filter(cat => cat.GradeCd.toString() === element.GradeCd.toString())[0].GradeId ;

      p.RegionID = this.RegionList.filter(cat => cat.RegionCode.toString() === element.MacroRegionCd.toString())[0]
      && this.RegionList.filter(cat => cat.RegionCode.toString() === element.MacroRegionCd.toString())[0].RegionID ;

      p.SeasonID = this.SeasonList.filter(cat => cat.SeasonCode.toString() === element.PrimSeasonCd.toString())[0]
      && this.SeasonList.filter(cat => cat.SeasonCode.toString() === element.PrimSeasonCd.toString())[0].SeasonID ;


     if (!p.CatID ) {
      p.InValidReason = 'Invalid Category code ' + element.CatCd;
      InValidproductCatalogModel.push(p);
     } else if (!p.RegionID ) {
      p.InValidReason = 'Invalid Region code ' + element.MacroRegionCd;
      InValidproductCatalogModel.push(p);
     } else if (!p.SeasonID ) {
      p.InValidReason = 'Invalid Season code ' + element.PrimSeasonCd;
      InValidproductCatalogModel.push(p);
     } else if (!p.GradeId ) {
      p.InValidReason = 'Invalid Grade code ' + element.GradeCd;
      InValidproductCatalogModel.push(p);
     } else {
      productCatalogModel.push(p);
     }

    });
    this.regXMLInValidData = InValidproductCatalogModel;
    return  productCatalogModel;
  }

  editRecord(record, eventtype) {
    this._ProductPriceListModel.MapId = eventtype === 'save' ? 0 : record.MapId[0];
  }

  clearData() {
    this._ProductPriceListModelArray.length = 0;
    this.jsonlist = null;
    this.regXMLData = null;
  }
}
