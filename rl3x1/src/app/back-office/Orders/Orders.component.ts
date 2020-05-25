import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OrdersService } from './Orders.service';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { OrdersModel } from './Models/Orders.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from '../../shared/active.component';
import { Colors } from './Models/colors.model';
import { ProductSizeModel } from './Models/ProductSize.model';
import { SeasonModel } from './Models/season.model';
import { LoaderService } from '../../loader/loader.service';
import { CategoryModel } from './Models/Category.model';
import { GradeModel } from './Models/Grade.model';
import { SubCategoryModel } from './Models/Subcategory.model';
import { CountryModel } from './Models/Country.model';

declare var $: any;
@Component({
  selector: 'OrdersGrid',
  providers: [OrdersService],
  templateUrl: './Orders.html',
  styleUrls: ['./Orders.component.css']
})

export class Orders extends Property {
  IsGridLoaded = false;
  @Input() GridType: string;
  @Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
  Orderslist: any;
  filterText: string;
  loading: boolean;
  dataSource: any;
  gridOptions: GridOptions;
  errorMessage: string;
  CurrentOrderNumber: string;
  Orderss: OrdersModel[];
  IsLoaded = false;
  ListView = true;
  partnerID: number;
  isEditConfigSetup$ = false;
  isAddConfigSetup$ = true;
  isDeleteConfigSetup$ = false;
  isCancel$ = false;
  OrdersList: any;
  UserID: number;
  isSaveClick: any;
  ColorsList: Colors[];
  ProductSizeList: ProductSizeModel[];
  SeasonList: SeasonModel[];
  CategoryList: CategoryModel[];
  GradeList: GradeModel[];
  SubcategoryList: SubCategoryModel[];
  CountryList: CountryModel[];
  CurrentOrdersObj: OrdersModel = new OrdersModel();
  gridapi = null;
  gridcolumnapi = null;
  constructor(
    private _util: Util,
    private ordersService: OrdersService,
    public commonService: CommonService,
    private _globalService: GlobalVariableService,
    private loaderService: LoaderService)
    {
    super();
    this.moduleTitle = 'Orders';
    const partnerinfo = _globalService.getItem('partnerinfo');
    this.partnerID = partnerinfo[0].LogInUserPartnerID;
    this.UserID = partnerinfo[0].UserId;
  }

  ngOnInit() {
    this.loaderService.display(true);
    this.loadPermissionByModule(this.moduleTitle);
    this.setDataSource();
    this.gridOptions.datasource = this.dataSource;
    this.loading = false;
    this.IsLoaded = false;
  }

  setDataSource() {
    this.filterText = null;
    this.Orderslist = [];
    this.gridOptions = {
      rowData: this.Orderslist,
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
        this.ordersService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
          subscribe(
            result => {
              const rowsThisPage = result.recordsets[0];
              this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType; });
              const localize = JSON.parse(result.recordsets[1][0].ColumnDefinations)

              this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
              const localeditor = localize.map(function (e) {
                return '"' + e.field
                + '": {"headerName": "'
                + e.headerName
                + '", "isRequired": '
                + e.isRequired
                + ', "isVisible": ' + e.isVisible
                + ', "isEnabled": '
                + e.isEnabled
                + ', "width": '
                + e.width + ' }';
              });
              this.e_localize = JSON.parse('{' + localeditor.join(',') + '}');
              if (this.GridType === 'popup') {
                localize.unshift({
                  headerName: 'Select',
                  width: 200,
                  template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                });
                localize.unshift({
                  headerName: 'order_Id',
                  width: 200,
                  field: 'order_Id',
                  hide: true,
                });
              }
              let coldef = this.h_localize.find(element => element.field === 'order_Id');
              if (coldef != null && this.hasPermission('View')) {
                coldef.cellRendererFramework = EditComponent;
              }
              coldef = this.h_localize.find(element => element.field === 'isActive');
              if (coldef != null) {
                coldef.cellRendererFramework = ImageColumnComponent;
                coldef.cellRendererFramework = ActiveComponent;
              }
              if (!this.gridOptions.columnApi.getAllColumns()) {
              this.gridOptions.api.setColumnDefs(this.h_localize);
              }
              const lastRow = result.totalcount;
              if (parseInt(lastRow) > 0) {
                this.IsLoaded = true;
              } else if (this.filterText) {
                this.IsLoaded = false;
                this.ListView = true;
                this._util.error(this.filterText + ' not found ', 'Alert');
              }
              params.successCallback(rowsThisPage, lastRow);
              this.isEditConfigSetup$ = false;
              this.isDeleteConfigSetup$ = false;
              this.loaderService.display(false);
            });
      }
    }
  }

  loadDDL() {
    this.ordersService.loadColors().subscribe(
      Color => {
        this.ColorsList = Color;
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });

    this.ordersService.loadProductSize().subscribe(
      ProductSize => {
        this.ProductSizeList = ProductSize;
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });

    this.ordersService.loadSeason().subscribe(
      Season => {
        this.SeasonList = Season;
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });

      this.ordersService.loadCategory().subscribe(
        Category => {
          this.CategoryList = Category;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });

        this.ordersService.loadGrade().subscribe(
          Grade => {
            this.GradeList = Grade;
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });

        this.ordersService.loadSubcategory().subscribe(
          SubCategory => {
            this.SubcategoryList = SubCategory;
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
          });

          this.ordersService.loadCountry().subscribe(
            Country => {
              this.CountryList = Country;
            },
            error => {
              this.loaderService.display(false);
              this.errorMessage = <any>error;
            });
  }

  onSelectionChanged() {
    this.isEditConfigSetup$ = false;
    this.isDeleteConfigSetup$ = false;
    this.CurrentOrdersObj = this.gridapi.getSelectedRows()[0];
    if (!this.CurrentOrdersObj) {
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
    } else {
      this.loaderService.display(true);
    }
    this.loadDDL();
    this.gridapi.setDatasource(this.dataSource);
    this.CurrentOrderNumber = this.filterText;
  }

  onRowClicked(e) {
    if (e.event.target !== undefined) {
      const data = e.data;
      const actionType = e.event.target.getAttribute('data-action-type');
      if (actionType === 'select') {
        this.notifyBillingCode.emit(data);
        console.log(data);
      } else if (actionType === 'edit') {
        this.CurrentOrdersObj = data;
        this.onEditOrders();
      }
    }
  }
  EditClicked(val) {
    this.loaderService.display(true);
    this.CurrentOrdersObj = val;
    this.onEditOrders();
    this.loaderService.display(false);
  }

  getSelectedColors(ColorDescription) {
    if (
      this.CurrentOrdersObj.order_number !== undefined &&
      this.CurrentOrdersObj.order_number !== ''
    ) {
      this.CurrentOrdersObj.base_color = this.ColorsList.filter(a => a.Description === ColorDescription)[0].Name;
      this.CurrentOrdersObj.hex_value = this.ColorsList.filter(a => a.Description === ColorDescription)[0].Code;
    }
  }

  onAddOrders() {
    this.ListView = false;
    this.CurrentOrdersObj = new OrdersModel();
    if (this.CurrentOrdersObj.IsActive === undefined) {
      this.CurrentOrdersObj.IsActive = true;
    }
  }

  onEditOrders() {
    this.ListView = false;
    this.CurrentOrdersObj.IsActive = true;

  }
  Save(form) {
    this.loaderService.display(true);
    if (!form.valid) {
      for (let i in form.controls) {
        form.controls[i].markAsTouched();
      }
      form.valueChanges.subscribe(data => {
        this.isSaveClick = !form.valid;
      });
      this.isSaveClick = true;
      this.loaderService.display(false);
      return;
    }

    this.CurrentOrdersObj.UserID = this.UserID;
    if (this.CurrentOrdersObj.order_Id === undefined) {
      this.CurrentOrdersObj.order_Id = 0;
    }

    this.ordersService.Save(this.CurrentOrdersObj)
      .subscribe(returnvalue => {
        const result = returnvalue.data;
        if (result === 'Added') {
          this._util.success('Purchase Order has been saved successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this.CurrentOrdersObj = new OrdersModel();
          this.Cancel();
          this.loaderService.display(false);
          return;
        } else if (result === 'Updated') {
          this._util.success('Purchase Order has been updated successfully.', 'Alert');
          this.gridapi.setDatasource(this.dataSource);
          this.isEditConfigSetup$ = false;
          this.CurrentOrdersObj = new OrdersModel();
          this.Cancel();
          this.loaderService.display(false);
          return;
        } else if (result === 'Orders Exists') {
          this._util.error('Alert', 'Purchase Order already exists.');
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
