import { Property } from '../../app.util';
import { Region, Area, CountryModel, PopupCountryModel } from './region.model';
import { SelectComponent } from './select.component';
import { GridOptions } from 'ag-grid-community'
import { NumericEditorComponent } from "../../controls/NumericEditor/numericEditor";
import { Country, State, City, Language } from '../../shared/common.model';

export class RegionProperties extends Property {
    Regions: Region[];
    countries: PopupCountryModel[];
    countryListPopup: CountryModel[];
    selectedCountries: CountryModel[];
    popupSelectedCountries: PopupCountryModel[];
    CurrentRegion: Region;
    CurrentConfigType: any;
    ConfigTypes: any;


    customerGridOptions: GridOptions;
    customercolumnDefs = [
        { headerName: 'Code', field: "CountryCode", width: 100 },
        { headerName: 'Name', field: "CountryName", width: 100 },
        { headerName: 'Currency', field: "CurrencyCode", editable: false, width: 100 },
        { headerName: 'Currency Symbol', field: "CurrencySymbol", editable: false, width: 100 },
        {
            headerName: 'Configuration', field: "Config", width: 75,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()"><button Id="getcountry" data-toggle="modal" data-target="#myModal" class="btn btn-primary btn-sm"><i Id="getcountry" class="fa fa-cogs"></i></button></div>'
            }
        },
        {
            headerName: 'Action', field: "Action", width: 75,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteCountry" class="btn btn-danger btn-sm"><i Id="deleteCountry" class="fa fa-trash"></i></button></div>'
            }
        }
    ]

    CountryGridOptions: GridOptions;
    CountryColumnDefs = [
        { headerName: 'Select', width: 200, checkboxSelection: true },
        { headerName: 'Code', field: "CountryCode", width: 150 },
        { headerName: 'Name', field: "CountryName", width: 200 },
        { headerName: 'Currency', field: "CurrencyCode", editable: false, width: 200 },
        { headerName: 'Currency Symbol', field: "CurrencySymbol", editable: false, width: 200 },
        //{ headerName: 'Is Active', field: "IsActive", editable: false, width: 100 }        
    ]

    // Payment Gateway Tab

    AllPaymentGatewayCollection: any;
    AllPaymentGateway: any;
    PaymentGateways: any;
    selectedPaymentGateway: any;
    PaymentGatewayAttribute: any;

    // Carrier Gateway Tab

    AllCarrierGatewayCollection: any;
    AllCarrierGateway: any;
    CarrierGateways: any;
    selectedCarrierGateway: any;
    CarrierGatewayAttribute: any;

    // Config Maps Tab

    AllConfigMapCollection: any;
    AllConfigMaps: any;
    ConfigMapCollection: any;
    ConfigMaps: any;
    availableConfigMap: any;
    selectedConfigMap: any;

    // Billing Codes Tab

    AllBillingCodeCollection: any;
    AllBillingCodes: any;
    BillingCodes: any;
    availableBillingCode: any;
    selectedBillingCode: any;

    // Cost Break Down Tab

    AllCostBreakDownCollection: any;
    AllCostBreakDowns: any;
    CostBreakDowns: any;
    availableCostBreakDown: any;
    selectedCostBreakDown: any;

    AllLanguageCollection: any;
    AllCurrencyCollection: any;
    AllTimeZoneCollection: any;

    //AreaCodes: Array<Area> = new Array<Area>();
    CurrentArea: Area;
    AllCities: Array<City> = new Array<City>();

    dataSource: any;
    CountryDataSource: any;
    CustomerDataSource: any;
    gridOptions: GridOptions;
    columnDefs = [{}];
    exDateTime: string;
    cbgridOptions: GridOptions;
    cbcolumnDefs = [{ headerName: 'Code', field: "CostCode", width: 80 },
    { headerName: 'Description', field: "CostCodeDescription", width: 200 },
    { headerName: 'Cost', field: "CostValue", editable: true, width: 80 },
    { headerName: 'Expression', field: "CostValueExpression", editable: true, width: 200 },
    { headerName: 'Order', field: "Sequence", editable: true, width: 200, cellEditorFramework: NumericEditorComponent }]
    //{
    //    headerName: 'Cost in % ',
    //    field: 'IsCostPercentage',
    //    width: 80,
    //    cellRenderer: function (params: any) {
    //        return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding">' + params.value.toString() == 'false' ? '<i class="fa fa-times-circle"></i>' : '<i class="fa fa-check-circle"></i>' + '</span> </div>';
    //    }
    //},
    //{
    //    headerName: 'Mandatory',
    //    field: 'Mandatory',
    //    width: 150,
    //    cellRenderer: function (params: any) {
    //        return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding">' + params.value.toString() == 'false' ? '<i class="fa fa-times-circle"></i>' : '<i class="fa fa-check-circle"></i>' + '</span> </div>';
    //    }
    //}]

    bcgridOptions: GridOptions;
    abcgridOptions: GridOptions;
    bccolumnDefs = [{ headerName: 'Billing Code', field: "BillCode", width: 200 },
    { headerName: 'Markup', field: "MarkUp", width: 100 },
    { headerName: 'Service Cost', field: "LaborServiceCost", width: 100 },
    {
        headerName: 'Cost in % ',
        field: 'IsMarkUpOnPercentage',
        width: 80,
        cellRenderer: function (params: any) {
            return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding">' + params.value.toString() == 'false' ? '<i class="fa fa-times-circle"></i>' : '<i class="fa fa-check-circle"></i>' + '</span> </div>';
        }
    }]
    abccolumnDefs = [{ headerName: 'Billing Code', field: "BillCode", width: 200 },
    { headerName: 'Markup', field: "MarkUp", width: 100 },
    { headerName: 'Service Cost', field: "LaborServiceCost", width: 100 },
    {
        headerName: 'Cost in % ',
        field: 'IsMarkUpOnPercentage',
        width: 80,
        cellRenderer: function (params: any) {
            return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding">' + params.value.toString() == 'false' ? '<i class="fa fa-times-circle"></i>' : '<i class="fa fa-check-circle"></i>' + '</span> </div>';
        }
    }]
    areagridOptions: GridOptions;
    areacolumnDefs = [{ headerName: 'City', field: "City", width: 400 }]
    citygridOptions: GridOptions;
    citycolumnDefs = [{ headerName: 'City', field: "City", width: 300 },
    {
        headerName: '', field: "", width: 100, cellRendererFramework: SelectComponent
    }
    ]
    constructor();
    constructor(prop: RegionProperties)
    constructor(prop?: any) {
        super();

        // this.gridOptions = {
        //     rowData: this.Regions,
        //     columnDefs: this.columnDefs,
        //     enableColResize: true,
        //     enableServerSideSorting: true,
        //     //enableServerSideFilter: true,
        //     rowModelType: 'infinite',
        //     paginationPageSize: 20,
        //     //paginationOverflowSize: 2,
        //     rowSelection: 'single',
        //     maxConcurrentDatasourceRequests: 2,
        //     //paginationInitialRowCount: 1,
        //     //maxPagesInCache: 2,
        //     context: {
        //         componentParent: this
        //     }
        // };

        this.gridOptions = {
            rowData: this.Regions,
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
            rowHeight: 38,
            context: {
                componentParent: this
            }
        };

        this.cbgridOptions = {
            rowData: this.CostBreakDowns,
            columnDefs: this.cbcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 38
        };

        this.bcgridOptions = {
            rowData: this.BillingCodes,
            columnDefs: this.bccolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 38
        };

        this.abcgridOptions = {
            rowData: this.AllBillingCodes,
            columnDefs: this.abccolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 38
        };
        this.CurrentRegion = new Region();
        this.areagridOptions = {
            rowData: null,
            columnDefs: this.areacolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 38
        };

        this.citygridOptions = {
            rowData: this.AllCities,
            columnDefs: this.citycolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 38,
            context: {
                componentParent: this
            }
        };

        this.Reset();
    }

    Reset() {

        this.filterValue = null;
        this.CurrentConfigType = null;
        this.ConfigTypes = [];

        //this.AllLanguageCollection = [];
        //this.AllCurrencyCollection = [];

        this.AllPaymentGatewayCollection = [];
        this.AllPaymentGateway = null;
        this.selectedPaymentGateway = null;
        this.PaymentGatewayAttribute = null;
        this.PaymentGateways = null;

        this.AllCarrierGatewayCollection = [];
        this.AllCarrierGateway = null;
        this.selectedCarrierGateway = null;
        this.CarrierGatewayAttribute = null;
        this.CarrierGateways = null;

        this.AllConfigMapCollection = [];
        this.AllConfigMaps = null;
        this.ConfigMapCollection = [];
        this.ConfigMaps = [];

        this.availableConfigMap = null;
        this.selectedConfigMap = null;

        this.AllBillingCodeCollection = [];
        this.AllBillingCodes = null;
        this.BillingCodes = [];

        this.availableBillingCode = null;
        this.selectedBillingCode = null;

        this.AllCostBreakDownCollection = [];
        this.AllCostBreakDowns = [];
        this.CostBreakDowns = [];

        this.availableCostBreakDown = null;
        this.selectedCostBreakDown = null;

        this.exDateTime = "";
    }
}