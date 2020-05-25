import { Property } from '../../app.util';
//import { Partner, PartnerAddress, ConfigMap, UserRole } from './modelmaster.model';
import { OrganisationType, CityCategory, Region, Airport, RepairCommand, TypeLookup } from '../../shared/common.model';
import { GridOptions } from 'ag-grid-community'
import { Address } from '../../shared/address.model';
import { Input } from '@angular/core';
import { RuleValueComponent } from './rulevalue.component';
import { ActiveRuleComponent } from './activerule.component';
import { effecton } from '../ReturnReason/effecton.controls';
import { effecttype } from '../ReturnReason/effecttype.controls';
import { valuetype } from '../ReturnReason/valuetype.controls';
import { checkBoxInputComponent } from '../ReturnReason/userinput.component';

export class ModelProperties extends Property {
    //Partners: Partner[];
    //CurrentPartner: Partner;
    //CurrentPartnerAddress: PartnerAddress;
    CurrentAddress: any;
    CurrentConfigType: any;
    ConfigTypes: any;
    //PartnerAddressList: PartnerAddress[];
    organisationTypeList: OrganisationType[];
    regionList: Region[];
    cityCategoryList: TypeLookup[];
    airportList: Airport[];
    repairCommandList: RepairCommand[];
    addressTypeList: TypeLookup[];
    localize: any;

    errorMessage: string;
    isCancel = false;
    IsLoaded: boolean;
    filterAddrVal: string;

    AllUserCollection: any;
    AllRoleCollection: any;
    UserRoleCollection: any;
    AvailableUsers: any;

    AllReasonCollection: any;
    AllRuleCollection: any;
    ReasonRuleCollection: any;
    AvailableReasons: any;
    AvailableRules: any;
    selectedRules: any;

    OrgionAddressList: any;
    DestinationAddressList: any;

    PartnerLaneList: any;
    PartnerODList: any;

    AllConfigMapCollection: any;
    AllConfigMaps: any;
    ConfigMapCollection: any;
    ConfigMaps: any;

    AllOrgSubTypes: any;

    availableConfigMap: any;
    selectedConfigMap: any;

    facilityMap: any;
    availableFacilityList: any;
    FacilityModel: any;
    selectedFacilityMap: any;


    HubPartnerMap: any;
    availablePartnerForHubList: any;
    HubPartnerModel: any;
    selectedHubPartnerMap: any;

    e_configField: any;


    dataSource: any;
    gridOptions: GridOptions;
    columnDefs = [{}];

    usergridOptions: GridOptions;
    usercolumnDefs = [

        { headerName: 'First Name', field: "FirstName", width: 200 },
        { headerName: 'User Name', field: "UserName", width: 285 },
        {
            headerName: 'Action', field: "Action", width: 70,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteitem" class="btn btn-danger btn-sm"><i Id="deleteitem" class="fa fa-trash"></i></button></div>'
            }
        },
    ]

    gridOptionsAddress: GridOptions;
    addressccolumnDefs = [{}];

    gridOptionsOrgionList: GridOptions;
    cmOrgioncolumnDefs = [{ headerName: 'Address', field: "AccountAddress", width: 500 },
    { headerName: 'Code', field: "Code", width: 285 }]

    gridOptionsDestinationList: GridOptions;
    cmDestinationolumnDefs = [{ headerName: 'Address', field: "AccountAddress", width: 500 },
    { headerName: 'Code', field: "Code", width: 285 }]

    gridOptionsPartnerLaneList: GridOptions;
    cmPartnerLanecolumnDefs = [{}]

    gridOptionsPartnerODPairList: GridOptions;
    cmPartnerODPaircolumnDefs = [{}]

    rolegridOptions: GridOptions;
    rolecolumnDefs = [
        {
            headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
            suppressMenu: true, pinned: true
        },

        { headerName: 'Role Name', field: "RoleName", width: 430 }
    ];



    cmgridOptions: GridOptions;
    cmcolumnDefs = [
        //{ headerName: 'TypeCode', field: "TypeCode", width: 90 },
        //{ headerName: 'TypeGroup', field: "TypeGroup", width: 90 },        
        { headerName: 'Description', field: "Description", width: 150 },
        { headerName: 'TypeValue', field: "ConfigValue", editable: true, width: 300 }
    ]

    reasonGridOptions: GridOptions;
    reasoncolumnDefs = [

        { headerName: 'Reason Code', field: "ReasonCode", width: 150 },
        { headerName: 'Return Reason', field: "ReasonName", width: 150 },
        { headerName: 'Fulfilment Type', field: "ReturnType", width: 260 }
    ]

    ruleGridOptions: GridOptions;
    rulecolumnDefs = [
        { headerName: 'Active', field: "isActive", width: 80, cellRendererFramework: ActiveRuleComponent },
        { headerName: 'Overridable', field: "isOverRidable", width: 100 },
        {
            headerName: "User Input?", field: "UserInput", width: 110,
            cellRendererFramework: checkBoxInputComponent, editable: true, suppressFilter: true
        },
        { headerName: 'Rule Name', field: "RuleName", width: 250 },
        { headerName: 'Rule Value', field: "RuleValue", width: 220, cellRendererFramework: RuleValueComponent },
        {
            headerName: "Value Type", field: "IsFixedRuleValue", width: 150, suppressFilter: true,
            cellRendererFramework: valuetype, editable: false
        },
        {
            headerName: "Value Effect", field: "RuleValueEffect", width: 100, suppressFilter: true,
            cellRendererFramework: effecttype, editable: false
        },
        {
            headerName: "Effect On", field: "RuleValueEffectTO", width: 150,
            cellRendererFramework: effecton, editable: false
        },
    ];

    facilitygridOptions: GridOptions;
    facilityColDef = [
        { headerName: 'Name', field: 'FacilityName', width: 200 },
        { headerName: 'Code', field: 'FacilityCode', width: 150 },
        { headerName: 'Type', field: 'TypeName', width: 150 },
    ];

    hubPartnersgridOptions: GridOptions;
    hubPartnersColDef = [
        { headerName: 'Name', field: 'PartnerName', width: 200 },
        { headerName: 'Code', field: 'PartnerCode', width: 150 }
    ];

    constructor();
    constructor(partner: ModelProperties)
    constructor(partner?: any) {
        super();

        this.gridOptions = {
            //rowData: this.Partners,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: 'infinite',
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
        };

        this.usergridOptions = {
            rowData: this.AllUserCollection,
            columnDefs: this.usercolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };

        this.rolegridOptions = {
            rowData: this.AllRoleCollection,
            columnDefs: this.rolecolumnDefs,
            enableColResize: true,
            rowSelection: 'multiple'
        };

        this.reasonGridOptions = {
            rowData: this.AllReasonCollection,
            columnDefs: this.reasoncolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };

        this.ruleGridOptions = {
            rowData: this.AvailableRules,
            columnDefs: this.rulecolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            rowSelection: 'single'
        };

        this.gridOptionsAddress = {
            rowData: [],
            columnDefs: this.addressccolumnDefs,
            rowSelection: 'single'
        };

        this.gridOptionsOrgionList = {
            rowData: this.OrgionAddressList,
            columnDefs: this.cmOrgioncolumnDefs,
            rowSelection: 'single'
        };

        this.gridOptionsDestinationList = {
            rowData: this.DestinationAddressList,
            columnDefs: this.cmDestinationolumnDefs,
            rowSelection: 'single'
        };

        this.gridOptionsPartnerLaneList = {
            rowData: this.PartnerLaneList,
            columnDefs: this.cmPartnerLanecolumnDefs,
            rowSelection: 'single'
        };

        this.gridOptionsPartnerODPairList = {
            rowData: this.PartnerODList,
            columnDefs: this.cmPartnerODPaircolumnDefs,
            rowSelection: 'single'
        };


        this.cmgridOptions = {
            rowData: this.AllConfigMaps,
            columnDefs: this.cmcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };

        this.facilitygridOptions = {
            rowData: this.facilityMap,
            columnDefs: this.facilityColDef,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'multiple'
        };

        this.hubPartnersgridOptions = {
            rowData: this.HubPartnerMap,
            columnDefs: this.hubPartnersColDef,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'multiple'
        };

        //this.CurrentPartner = new Partner();

        this.Reset();
    }

    Reset() {

        this.filterValue = null;
        this.AllUserCollection = [];
        this.AllRoleCollection = [];
        this.UserRoleCollection = [];
        this.AvailableUsers = [];

        this.AllReasonCollection = [];
        this.AllRuleCollection = [];
        this.ReasonRuleCollection = [];
        this.AvailableReasons = [];
        this.AvailableRules = [];

        this.ConfigTypes = [];
        this.CurrentConfigType = null;

        this.AllConfigMapCollection = [];
        this.AllConfigMaps = null;
        this.ConfigMapCollection = [];
        this.ConfigMaps = [];

        this.availableConfigMap = null;
        this.selectedConfigMap = null;
        this.selectedRules = null;


        //this.organisationTypeList = [
        //    { OrganisationTypeID: 67, OrganisationTypeCode: 'ManX', OrganisationType: 'Manufacturer' },
        //    { OrganisationTypeID: 74, OrganisationTypeCode: 'DistX', OrganisationType: 'Distributor' },
        //    { OrganisationTypeID: 78, OrganisationTypeCode: 'RetX', OrganisationType: 'Retailer' }
        //]

        //this.airportList = [
        //    { AirportID: 1, AirportCode: 'IGI', AirportName: 'IGI' },
        //    { AirportID: 2, AirportCode: 'PLM', AirportName: 'Palam' }
        //]

        this.repairCommandList = [
            { RepairCommandID: 1, RepairCommandCode: 'CMD001', RepairCommandName: 'Command1' },
            { RepairCommandID: 2, RepairCommandCode: 'CMD002', RepairCommandName: 'Command2' },
            { RepairCommandID: 3, RepairCommandCode: 'CMD003', RepairCommandName: 'Command3' }
        ]
        this.errorMessage = "";
        //this.CurrentPartner.ConfigMaps[0] = new ConfigMap();
        //this.CurrentPartner.ConfigMaps[1] = new ConfigMap();
        //this.CurrentPartner.ConfigMaps[2] = new ConfigMap();
        //this.CurrentPartner.ConfigMaps[3] = new ConfigMap();
        //this.CurrentPartner.ConfigMaps[4] = new ConfigMap();
        //this.CurrentPartner.ConfigMaps[5] = new ConfigMap();
    }
}