import { Property } from '../../app.util';
import { Partner, PartnerAddress, ConfigMap, UserRole } from './partner.model';
import { OrganisationType, CityCategory, Region, Airport, RepairCommand, TypeLookup, Country } from '../../shared/common.model';
import { GridOptions } from 'ag-grid-community'
import { Address } from '../../shared/address.model';
import { Input } from '@angular/core';

import { effecton } from '../ReturnReason/effecton.controls';
import { effecttype } from '../ReturnReason/effecttype.controls';
import { valuetype } from '../ReturnReason/valuetype.controls';
import { checkBoxInputComponent } from '../ReturnReason/userinput.component';
import { checkBoxMandatoryComponent } from '../ReturnReason/chkBoxMandatory';
import { ActiveComponent } from '../ReturnReason/active.component';
import { EditComponent } from '../../shared/edit.component';
import { PartnerRuleValueComponent } from '../../shared/partner-rulevalue.component';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';

export class PartnerProperties extends Property {
    Partners: Partner[];
    CurrentPartner: Partner;
    CurrentPartnerAddress: PartnerAddress;
    CurrentAddress: any;
    CurrentConfigType: any; SponsorshipTypeList: any; countryList: Country[];
    ConfigTypes: any;
    PartnerAddressList: PartnerAddress[] = new Array<PartnerAddress>();
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
    //usercolumnDefs = [];
    usercolumnDefs = [

        { headerName: 'First Name', field: "FirstName", width: 200 },
        { headerName: 'User Name', field: "UserName", width: 285 },
        { headerName: 'Role', field: "RoleName", width: 285 },
        // {
        //     headerName: 'Action', field: "Action", width: 100,
        //     cellRenderer: function (params: any) {

        //         return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteitem" class="btn btn-danger btn-sm"><i Id="deleteitem" class="fa fa-trash"></i></button></div>'
        //     }
        // },
    ]

    gridOptionsAddress: GridOptions;
    addressccolumnDefs = [{}];

    gridChildAccountOptions: GridOptions;
    ChildAccountcolumnDefs = [{}];

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
    //rolecolumnDefs = [];
    rolecolumnDefs = [
        {
            headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
            suppressMenu: true, pinned: true
        },

        { headerName: 'Role Name', field: "RoleName", width: 280 }
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
        { headerName: 'Return Reason', field: "ReasonName", width: 500 },
        //{ headerName: 'Type', field: "TypeName", width: 100 },
        //{ headerName: 'Fulfilment Type', field: "ReturnType", width: 260 },
        //{ headerName: 'Approver Level 1', field: "ApproverOne", width: 150 },
        // { headerName: 'Approver Level 2', field: "ApproverTwo", width: 150 },        
        //{ headerName: 'Proof Of Purchase', field: "ProofPurchase", width: 150 },
        //{ headerName: 'Damage Evidence', field: "DamageEvidence", width: 150 },        
        { headerName: 'Customer Portal', field: "requiredonCustomerPortal", width: 130, cellRendererFramework: ImageColumnComponent },
        { headerName: 'Back Office', field: "RequiredonBackOffice", width: 130, cellRendererFramework: ImageColumnComponent },
        // { 
        //     headerName: '', field: "Configure", Width: 25, editable: false, hide: false, cellRendererFramework: EditComponent 
        // },
        {
            headerName: 'Action', field: "Action", width: 100,
            cellRenderer: function (params: any) {
                return `<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" >
                <button Id="configureReturnReason" class="btn btn-primary btn-sm">
                <i Id="configureReturnReason" class="fa fa-gear"></i>
                </button>
                
                <button Id="deleteReturnReason" class="btn btn-danger btn-sm">
                <i Id="deleteReturnReason" class="fa fa-trash"></i>
                </button>
                </div>`;
            }
        }
    ]

    SeasonalConfigCollection: any;
    SeasonalConfigGridOptions: GridOptions;
    SeasonalConfigColumnDefs = [
        { headerName: 'From Date', field: "fromDate", width: 150 },
        { headerName: 'To Date', field: "toDate", width: 150 },
        { headerName: "Logo", field: "Logo", cellRenderer: this.ImageElement },
        { headerName: "Banner", field: "Banner", cellRenderer: this.ImageElement },
        { headerName: 'Return Window (days)', field: "ReturnReason", width: 200 },
        {
            headerName: 'Action', field: "Action", width: 100,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="deleteSeasonalConfig" class="btn btn-danger btn-sm"><i Id="deleteSeasonalConfig" class="fa fa-trash"></i></button></div>'
            }
        }
    ]


    SponsorshipCollection: any;
    SponsorshipGridOptions: GridOptions;
    SponsorshipColumnDefs = [
        { headerName: 'Country', field: "Country", width: 150 },
        { headerName: 'GENERAL', field: "GENERAL", width: 120 },
        { headerName: 'EMPLOYEE', field: "EMPLOYEE", width: 120 },
        { headerName: 'KOTF', field: "KOTF", width: 120 },        
        { headerName: 'VIP', field: "VIP", width: 120 },
        { headerName: 'PRO', field: "PRO", width: 120 },
        { headerName: 'CORP', field: "CORP", width: 120 },
        { headerName: 'TEAM', field: "TEAM", width: 120 },

        // { headerName: 'Sponsorship 4', field: "Sponsorship4", width: 120 },
        //{ headerName: 'Sponsorship 5', field: "Sponsorship5", width: 120 },
        {
            headerName: 'Action', field: "Action", width: 100,
            cellRenderer: function (params: any) {
                return `<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" >
                <button Id="configureSponsorship" class="btn btn-primary btn-sm">
                <i Id="configureSponsorship" class="fa fa-gear"></i>
                </button>

                <button Id="deleteSponsorship" class="btn btn-danger btn-sm">
                <i Id="deleteSponsorship" class="fa fa-trash"></i></button>
                </div>`
            }
        }
    ]


    ImageElement(params) {

        var element = document.createElement("span");

        var imageElement = document.createElement("img");
        imageElement.src = params.value;
        imageElement.width = 100;
        imageElement.height = 100;
        element.appendChild(imageElement);

        return element;
    }

    ruleGridOptions: GridOptions;
    rulecolumnDefs = [
        {
            headerName: "Active", field: "isActive", pinned: 'left', width: 70, suppressFilter: true,
            cellRendererFramework: ActiveComponent, editable: false
        },
        //{ headerName: 'Active', field: "isActive", width: 80, cellRendererFramework: ActiveRuleComponent },
        { headerName: 'Rule Name', field: "RuleName", width: 250 },
        { headerName: 'Overridable', field: "isOverRidable", width: 100, hide: true },
        {
            headerName: 'Mandatory', field: "isMandatory", width: 100,
            cellRendererFramework: checkBoxMandatoryComponent, editable: true, suppressFilter: true
        },
        { headerName: 'Rule Value', field: "RuleValue", width: 220, cellRendererFramework: PartnerRuleValueComponent },
        {
            headerName: "User Input?", field: "UserInput", width: 110, hide: true,
            cellRendererFramework: checkBoxInputComponent, editable: true, suppressFilter: true
        },
        {
            headerName: "Based On", field: "RuleValueEffectTO", width: 150,
            cellRendererFramework: effecton, editable: false
        },
        {
            headerName: "Trigger Value", field: "RuleValueEffect", width: 100, suppressFilter: true,
            cellRendererFramework: effecttype, editable: false
        },
        {
            headerName: "Value Type", field: "IsFixedRuleValue", width: 150, suppressFilter: true,
            cellRendererFramework: valuetype, editable: false
        },
        //{
        //    headerName: "Rule Group", field: "RuleGroup", width: 150
        //},
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
    constructor(partner: PartnerProperties)
    constructor(partner?: any) {
        super();

        this.gridOptions = {
            rowData: this.Partners,
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
            //maxPagesInCache: 2,
            context: {
                componentParent: this
            }
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
            //enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };

        this.ruleGridOptions = {
            rowData: this.AvailableRules,
            columnDefs: this.rulecolumnDefs,
            enableColResize: true,
            //enableServerSideSorting: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };

        this.gridOptionsAddress = {
            rowData: [],
            columnDefs: this.addressccolumnDefs,
            rowSelection: 'single'
        };

        this.gridChildAccountOptions = {
            rowData: [],
            columnDefs: this.ChildAccountcolumnDefs,
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


        this.SeasonalConfigGridOptions = {
            rowData: this.SeasonalConfigCollection,
            columnDefs: this.SeasonalConfigColumnDefs,
            enableColResize: true,
            //enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 100,
            context: {
                componentParent: this
            }
        };



        this.SponsorshipGridOptions = {
            rowData: this.SponsorshipCollection,
            columnDefs: this.SponsorshipColumnDefs,
            enableColResize: true,
            //enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };

        this.CurrentPartner = new Partner();

        this.Reset();
    }

    Reset() {

        this.filterValue = null;
        this.AllUserCollection = [];
        this.AllRoleCollection = [];
        this.UserRoleCollection = [];
        this.AvailableUsers = [];

        this.AllReasonCollection = [];
        this.SeasonalConfigCollection = [];
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