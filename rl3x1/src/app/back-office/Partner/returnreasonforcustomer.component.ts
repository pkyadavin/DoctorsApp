import { Component, ContentChildren, QueryList, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { PartnerService } from './partner.service';
import { MetadataService } from '../MetadataConfig/metadata-config.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service';
import { Tabs } from '../../controls/tabs/tabs.component';
import { Tab } from '../../controls/tabs/tab.component';
import { PartnerProperties } from './partner.properties';
import { BsModalComponent } from 'ng2-bs3-modal'
import { eTypeLookup } from '../../shared/constants';
import { Address } from '../../shared/address.model';
import { message } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { AuthService } from '../../authentication/auth.service';
import { NodeMasterService } from '../NodeMaster/nodemaster.service';
import { ContractTerms } from './contractterms.model';
import { AddressService } from '../../shared/address.service';
import { Partners } from '../Partner/partnergrid.component';
var intlTelInput = require('../../../Assets/js/intlTelInput.js');
import { Partner } from '../Partner/partner.model';
import { Util } from 'src/app/app.util';
import { SidebarService } from '../sidebar/sidebar.service';

declare var $: any;
@Component({
    selector: 'ReturnReason-Customer',
    //styles: ['>>> .modal-xl { width: 60%; }'],
    providers: [PartnerService, AddressService, CommonService, AuthService, NodeMasterService],
    templateUrl: './returnreasonforcustomer.html'

})

export class ReturnReasonCustomer extends PartnerProperties {
    @ViewChild('userGridPopUp') modal: BsModalComponent;
    @ViewChild('retReasonGridPopUp') modalReturnReason: BsModalComponent;
    @ViewChild('modalPartner') modalPartner: BsModalComponent;
    @ViewChild('Partners') _PartnerGrid: Partners;
    @Input() notifySave: EventEmitter<any> = new EventEmitter<any>();
    CurrentAddress: Address = new Address();
    partner: Address = new Address();
    gridAddressHeader: any;
    ReturnReasonTypeList: any;
    deletedAddressID: number[] = [0];
    @Input("selectedId") partnerId: number;
    @Input() typeId: string = null;
    @Input() permission: boolean = false;
    LocalAddressAccess: string[] = ["Add"];
    LocalDestAddressAccess: string[] = ["Add"];
    LocalODPairAddressAccess: string[] = ["Add"];
    LocalLaneAddressAccess: string[] = ["Add"];
    isFirstTimeLoad: boolean = true;
    AddorgGridView: boolean = true;
    AddDesGridView: boolean = true;
    AddpartnerlaneView: boolean = true;
    IsReturnReasonShow: boolean = false;
    AddpartnerODView: boolean = true;
    UserGridPopup: boolean = false;
    ReturnReasonGridPopup: boolean = false;
    setUserGridType: string = "popup";
    isSaveClick: boolean = false;
    returnUrl: any;
    PartnerLane: any;
    ODPair: any;
    AllAddressData: any;
    ContractTermData: ContractTerms = new ContractTerms(null);
    IsContractLoaded: boolean = false;
    AddressTypeID: number = 0;
    RepairNodeList: any;
    RepairLocationList: any;
    FacilityMapLoaded: boolean = false;
    HubMapLoaded: boolean = false;
    loginPartnerID: number;
    IsConsumerType: boolean = false;
    IsAccountTypeDisabled: boolean = false;
    filterchAccountVal: string = null;
    private _addrGridView: Boolean = true;
    get AddrGridView(): Boolean {
        return this._addrGridView;
    }
    set AddrGridView(gv: Boolean) {
        this._addrGridView = gv;
        if (gv == false) {
            //this.Reset();
        }
    }
    isaccount: boolean = false;
    countrycodes: any = [];
    CurrentReturnReason: any = null;
    CurrentChAccount: Partner;
    @ViewChild(Tabs) tab: Tabs;
    NULL:number=null;
    constructor(private _util:Util, private _menu:SidebarService,
        private partnerService: PartnerService, private _router: Router, private _addressService: AddressService, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService, private commonService$: CommonService, private metadataService$: MetadataService, private _LoginService: AuthService, private nodeMasterService: NodeMasterService) {
        super()
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.loginPartnerID = partnerinfo[0].LogInUserPartnerID;

        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        //this.LocalAccess = ["Add"];

        this.commonService$.getAirportLookup().subscribe(airports => {
            this.airportList = airports;
        });

        this.commonService$.getRegionLookup().subscribe(regions => {
            this.regionList = regions;
        });
        this.commonService$.getTypeLookUpByName(eTypeLookup.CityCategory.toString()).subscribe(c => {
            this.cityCategoryList = c;
        });
        this.commonService$.getTypeLookUpByName(eTypeLookup.AddressType.toString()).subscribe(c => {
            this.addressTypeList = c;
        });

        this.commonService$.getTypeLookUpByName(eTypeLookup.OrganizationType.toString()).subscribe(org => {
            this.organisationTypeList = org;
        });



    }
    ngOnInit() {

        this.nodeMasterService.loadAllActiveNode().subscribe(returnvalue => {
            this.RepairNodeList = returnvalue;
        });
        this.commonService$.getAllLocations().subscribe(returnvalue => {
            this.RepairLocationList = returnvalue;
        });
        this.FillReturnReasonType();
        this.partnerInit();

        //this.partnerService.GetModuleControlValue().subscribe(returnreason => {
        //    var ReturnReason = returnreason[0][0].ReturnReasonValue;
        //    if (ReturnReason.toLowerCase() == "all" || ReturnReason.toLowerCase() == "account")
        //        this.IsReturnReasonShow = true;
        //    else
        //        this.IsReturnReasonShow = false;

        //}, error => this.errorMessage = <any>error);
    }
    ChangeAccountType(selected) {
        if (selected) {
            if (this.CurrentPartner.OrgSubType.TypeCode == "PTR004-04") {
                this.IsConsumerType = true;
            }
            else {

                this.IsConsumerType = false;

                this.partnerService.getPartnerAddress(this.partnerId, 0, this.loginPartnerID)
                    .subscribe(
                    _AllPertnerAddress => {
                        this.PartnerAddressList = _AllPertnerAddress.recordsets[0];
                        var localize = JSON.parse(_AllPertnerAddress.recordsets[1][0].ColumnDefinitions);
                        this.gridAddressHeader = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

                        this.gridOptionsAddress.api.setColumnDefs(this.gridAddressHeader);
                        this.gridOptionsAddress.api.setRowData(this.PartnerAddressList);
                    },
                    error => this.errorMessage = <any>error);
            }
        }
    }
    onReturnReasonChange(selected) {

        if (this.typeId == 'PTR004') {
            this.commonService$.loadReasonRules()
                .subscribe(_rules => {
                    this.AllRuleCollection = _rules;
                    this.InitPartnerReturnReason(this.partnerId);

                    if (selected == 1824) {
                        this.IsReturnReasonShow = true;
                    }
                    else {
                        this.IsReturnReasonShow = false;
                    }
                },
                error => this.errorMessage = <any>error);
        }


    }
    FillReturnReasonType() {
        this.commonService$.getTypeLookUpByName("ReturnReasonType").subscribe(data => {
            this.ReturnReasonTypeList = data;
        });
    }
    partnerInit() {
        this.IsLoaded = false;
        this.isaccount = false;
        //this.activateRoute.queryParams.subscribe(params => {
        //    this.partnerId = params['ID'];
        //    this.typeId = params['TypeID'];
        if (this.typeId == 'PTR002') {
            this.returnUrl = ['vendors/' + this.typeId];
        }
        else if (this.typeId == 'PTR001') {
            this.returnUrl = ['partners/' + this.typeId];
            this.InitConfigMaps(this.partnerId);
            this.isaccount = true;
        }
        else if (this.typeId == 'PTR004') {
            this.returnUrl = ['accounts/' + this.typeId];
            this.isaccount = true;
            //this.InitPartnerReturnReason(this.partnerId);
        }
        else if (this.typeId == 'PTR005') {
            this.returnUrl = ['depots/' + this.typeId];
        }
        else if (this.typeId == 'PTR006') {
            this.returnUrl = ['tmsaccounts/' + this.typeId];
        }
        else if (this.typeId == 'PTR003') {
            this.returnUrl = ['repairhub/' + this.typeId];
        }
        else if (this.typeId == 'PTR007') {
            this.returnUrl = ['CallCenter/' + this.typeId];
        }

        this.metadataService$.getTypeLookUpByGroupName(this.typeId)
            .subscribe(
            _ConfigTypes => {
                this.AllOrgSubTypes = _ConfigTypes;

                this.AllOrgSubTypes.unshift({
                    TypeLookUpID: "0",
                    TypeName: "Select Account Type",
                    TypeCode: this.typeId
                });
            },
            error => this.errorMessage = <any>error);

        this.partnerService.load(this.partnerId, this.typeId).subscribe(u => {
            if (this.partnerId != 0) {
                this.CurrentPartner.PartnerID = u.recordsets[0][0].PartnerID;
                this.CurrentPartner.AirportID = u.recordsets[0][0].AirportID;
                this.CurrentPartner.PartnerName = u.recordsets[0][0].PartnerName;
                this.CurrentPartner.PartnerCode = u.recordsets[0][0].PartnerCode;
                this.CurrentPartner.ContactName = u.recordsets[0][0].ContactName;
                this.CurrentPartner.TeleCode = u.recordsets[0][0].TeleCode;

                this.CurrentPartner.ContactNumber = u.recordsets[0][0].ContactNumber;
                this.CurrentPartner.Email = u.recordsets[0][0].Email;

                this.CurrentPartner.PartnerParentID = u.recordsets[0][0].PartnerParentID;
                this.CurrentPartner.ParentPartnerName = u.recordsets[0][0].ParentPartnerName;
                this.CurrentPartner.ParentFacilityID = u.recordsets[0][0].ParentFacilityID;
                this.CurrentPartner.ParentFacilityName = u.recordsets[0][0].ParentFacilityName;

                this.CurrentPartner.OrganisationTypeID = u.recordsets[0][0].OrganisationTypeID;
                this.CurrentPartner.IsActive = u.recordsets[0][0].IsActive;
                this.CurrentPartner.OrgSubType = u.recordsets[0][0].OrgSubType && JSON.parse(u.recordsets[0][0].OrgSubType)[0];

                this.IsAccountTypeDisabled = true;
                if (this.CurrentPartner.OrgSubType.TypeCode == "PTR004-04") {
                    this.IsConsumerType = true;
                }
                else {
                    this.IsConsumerType = false;
                }

            }
            else {
                this.CurrentPartner.PartnerID = 0;
                this.CurrentPartner.PartnerName = "";
                this.CurrentPartner.PartnerCode = "Auto";
                this.CurrentPartner.IsActive = true;
                this.IsAccountTypeDisabled = false;
                this.CurrentPartner.OrganisationTypeID = null;
                this.CurrentPartner.OrgSubType = this.AllOrgSubTypes[0];
            }

            this.countrycodes = u.recordsets[2];
            if (this.typeId == 'PTR006') {
                this.ContractTermData = u.recordsets[2][0];
                if (!this.ContractTermData) {
                    this.ContractTermData = new ContractTerms(null);
                }
                this.loadcontractTerms();

            }
            //----------------------------------------------------------------------------------------
            // Partner's Report Custom Fields
            //----------------------------------------------------------------------------------------
            //var count = 0;
            //var configFieldsMap = this.CurrentPartner.ConfigMaps.map(function (e) {
            //    count = count + 1;
            //    return '"Field' + count + '": {"Text": "' + e.ConfigType + '", "Value": "' + e.ConfigValue + '" }';
            //});

            //this.e_configField = JSON.parse("{" + configFieldsMap.join(',') + "}");
            //----------------------------------------------------------------------------------------

            //----------------------------------------------------------------------------------------
            // Partner's Localized language Fields
            //----------------------------------------------------------------------------------------
            var localize = JSON.parse(u.recordsets[1][0].ColumnDefinitions);
            var node_editor = localize.map(function (e) {
                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
            });
            this.e_localize = JSON.parse("{" + node_editor.join(',') + "}");
            //----------------------------------------------------------------------------------------
            this.IsLoaded = true;

            var me: any = this;
            setTimeout(() => {
                var partnerinfo = this._globalService.getItem('partnerinfo')[0];
                var ContactNumbers = [{ "mask": "##########" }, { "mask": "##########" }];
                // $('#ContactNumber').inputmask({
                //     mask: ContactNumbers,
                //     greedy: false,
                //     definitions: { '#': { validator: "[0-9]", cardinality: 1 } }
                // });
                $("#mobile-number").intlTelInput();

                if (me.CurrentPartner.TeleCode != null) {

                    var cName = me.getObjects(intlTelInput.countries, 'calling-code', me.CurrentPartner.TeleCode.trim());
                        if (cName.length > 0) {
                            $(".country").each(function () {
                                //alert($(this).attr("data-dial-code"));
                                if (me.CurrentPartner.TeleCode.trim() == $(this).attr("data-dial-code")) {
                                    $(this).click();
                                }
                            });
                        }


                }

            });
            if (this.typeId != 'PTR006') {
                if (this.CurrentPartner.OrgSubType.TypeCode != "PTR004-04") {
                    this.InitAddress();
                }

                //this.InitAddress();
            }

        }, error => this._util.error(error, 'error'));

        if (this.typeId == 'PTR001' || this.typeId == 'PTR004') {
            this.commonService$.loadUsers()
                .subscribe(_users => {
                    this.AllUserCollection = _users;
                },
                error => this.errorMessage = <any>error);

            this.commonService$.loadRoles(this.typeId)
                .subscribe(_roles => {
                    this.AllRoleCollection = _roles;
                    //this.rolegridOptions.api.setRowData(this.AllRoleCollection);
                },
                error => this.errorMessage = <any>error);
        }

        //if (this.typeId == 'PTR006') {
        //    this.IsContractLoaded = false;
        //    this.partnerService.loadOrigionDestAddress(this.partnerId, this.typeId, this.AddressTypeID, this.)
        //        .subscribe(_result => {
        //            debugger;
        //            //let a = _result.recordsets[0][0];
        //           // let b = _result.recordsets[1];
        //           // let c = _result.recordsets[2];


        //            if (!this.contractTerms) {
        //                this.contractTerms = new ContractTerms(null);
        //            }
        //            this.IsContractLoaded = true;
        //            //this.OrgionAddressList = _result.recordsets[1];
        //            //this.ContractTerms = _result.recordsets[2];

        //            this.AllAddressData = _result.recordsets[3];


        //           //     this.de = this.AllAddressData.
        //            //this.AllUserCollection = _result;
        //        },
        //        error => this.errorMessage = <any>error);
        //}

        //this.commonService$.loadReturnReasons()
        //    .subscribe(_reasons => {
        //        this.AllReasonCollection = _reasons;
        //    },
        //    error => this.errorMessage = <any>error);
        if (this.typeId == 'PTR004') {
            this.commonService$.loadReasonRules()
                .subscribe(_rules => {
                    this.AllRuleCollection = _rules;
                    this.InitPartnerReturnReason(this.partnerId);
                },
                error => this.errorMessage = <any>error);
        }
    }
    getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }

        return objects;
    }
    selectParent() {
        this.modalPartner.open();
        this._PartnerGrid.ngOnInit();
    }
    PartnerEvent(e) {
        if (this.CurrentPartner.PartnerID != e.PartnerID) {
            this.CurrentPartner.PartnerParentID = e.PartnerID;
            this.CurrentPartner.ParentPartnerName = e.PartnerName;
            this.getParentReturnTypes()
            this.modalPartner.close();
        }
        else {
            this._util.error('You cannot assign parent to itself. Please select other ' + (this.typeId == 'PTR001' ? 'Facility' : 'Account'),"Alert");
        }
    }

    FacilityEvent(e) {
        this.CurrentPartner.ParentFacilityID = e.PartnerID;
        this.CurrentPartner.ParentFacilityName = e.PartnerName;
        this.modalPartner.close();
    }

    notifyParent() {
        this.ruleGridOptions.api.refreshView();
    }
    notifyChange(e, me: any = this) {
        var item = me.ReasonRuleCollection.filter(d => d.RuleID == e.RuleID && d.ReasonID == e.ReasonID)[0];
        if (item != undefined) {
            item.RuleValue = e.RuleValue
            item.isOverRidable = e.isOverRidable;
            item.isMandatory = e.isMandatory;
            item.IsFixedRuleValue = e.IsFixedRuleValue;
            item.RuleValueEffect = e.RuleValueEffect;
            item.RuleValueEffectTO = e.RuleValueEffectTO;
            item.UserInput = e.UserInput;
            item.isActive = e.isActive;
        }
    }
    origionLoaded: boolean = false;
    destinationLoaded: boolean = false;
    LaneLoaded: boolean = false;
    ODPairLoaded: boolean = false;
    gridOrigionHeader: any;
    gridDestinationHeader: any;
    gridPartnerLaneHeader: any;
    gridPartnerODPairHeader: any;

    addressEditor: any
    TypeLookUpList: any;
    UOMList: any;
    loadcontractTerms() {
        if (!this.IsContractLoaded) {
            this._addressService.loadAddressCol('PartnerAccountDetail').subscribe(
                _result => {
                    var localize = _result;
                    var localeditor = localize.map(function (e) {
                        return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                    });
                    this.addressEditor = JSON.parse("{" + localeditor.join(',') + "}");
                    // console.log(this.addressEditor);
                    this.IsContractLoaded = true;
                });
            this.commonService$.getTypeLookUpByName("PaymentTerms").subscribe(_result => {
                this.TypeLookUpList = _result;
            }, error => this.errorMessage = <any>error);

            this.commonService$.loadUOM().subscribe(_result => {
                this.UOMList = _result;
            }, error => this.errorMessage = <any>error);
        }
    }

    loadorigion() {
        if (!this.origionLoaded) {
            this.partnerService.loadOrigionDestAddress(this.partnerId, 617, 0, 'PartnerOrigionAddress')
                .subscribe(_result => {
                    this.OrgionAddressList = _result.recordsets[0];
                    var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
                    this.gridOrigionHeader = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

                    this.gridOptionsOrgionList.api.setColumnDefs(this.gridOrigionHeader);
                    this.gridOptionsOrgionList.api.setRowData(this.OrgionAddressList);
                    this.origionLoaded = true;
                    //this.OrgionAddressList = _result;
                    //this.gridOptionsOrgionList.api.setRowData(this.OrgionAddressList);
                },
                error => this.errorMessage = <any>error);

            this.AddressTypeID = 617;

        }
    }

    getParentReturnTypes() {
        this.commonService$.loadReasonRules()
            .subscribe(_rules => {
                this.AllRuleCollection = _rules;
                this.InitPartnerReturnReason(this.CurrentPartner.PartnerParentID);
            },
            error => this.errorMessage = <any>error);
    }

    loaddestination() {
        if (!this.destinationLoaded) {
            this.partnerService.loadOrigionDestAddress(this.partnerId, 618, 0, 'PartnerDestinationAddress')
                .subscribe(_result => {
                    this.DestinationAddressList = _result.recordsets[0];
                    var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
                    this.gridDestinationHeader = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

                    this.gridOptionsDestinationList.api.setColumnDefs(this.gridDestinationHeader);
                    this.gridOptionsDestinationList.api.setRowData(this.DestinationAddressList);

                    this.destinationLoaded = true;
                    //this.OrgionAddressList = _result;
                    //this.gridOptionsOrgionList.api.setRowData(this.OrgionAddressList);
                },
                error => this.errorMessage = <any>error);

            this.AddressTypeID = 618;
        }
    }

    loadPartnerODPair() {
        // if (!this.ODPairLoaded) {
        //     this.partnerService.loadPartnerODPair(this.partnerId)
        //         .subscribe(_result => {
        //             this.PartnerODList = _result.recordsets[0];
        //             var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
        //             this.gridPartnerODPairHeader = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

        //             this.gridOptionsPartnerODPairList.api.setColumnDefs(this.gridPartnerODPairHeader);
        //             this.gridOptionsPartnerODPairList.api.setRowData(this.DestinationAddressList);
        //             this.CurrentPartnerODPair.PartnerID = this.partnerId;
        //             this.ODPairLoaded = true;
        //             //this.OrgionAddressList = _result;
        //             //this.gridOptionsOrgionList.api.setRowData(this.OrgionAddressList);
        //         },
        //         error => this.errorMessage = <any>error);
        //}
    }


    loadPartnerLane() {
        // if (!this.LaneLoaded) {
        //     this.partnerService.loadPartnerLane(this.partnerId)
        //         .subscribe(_result => {
        //             this.PartnerLaneList = _result.recordsets[0];
        //             var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
        //             this.gridPartnerLaneHeader = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

        //             this.gridOptionsPartnerLaneList.api.setColumnDefs(this.gridPartnerLaneHeader);
        //             this.gridOptionsPartnerLaneList.api.setRowData(this.DestinationAddressList);

        //             this.LaneLoaded = true;
        //             //this.OrgionAddressList = _result;
        //             //this.gridOptionsOrgionList.api.setRowData(this.OrgionAddressList);
        //         },
        //         error => this.errorMessage = <any>error);
        // }
    }

    @ViewChild('pop') _popup: message;
    CheckPhoneVal() {
        var contactnumber = $('#ContactNumber').val();
        this.CurrentPartner.ContactNumber = contactnumber;
    }
    onSubmit(form: any) {

        var IsValidRuleConfigration: boolean = true;

        if (this.CurrentPartner.OrgSubType.TypeLookUpID == 0) {
            if (this.IsLoaded && this.e_localize.TypeName.isVisible) {
                this._popup.Alert('Alert', 'Account type is required.');
                return;
            }
        }

        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            })
            this.isSaveClick = true;
            return;
        }

        if (this.CurrentPartner.OrgSubType.TypeCode != "PTR004-04") {
            if (!this.PartnerAddressList || this.PartnerAddressList.length == 0) {
                this._util.error('Atleast one address is required.',"Alert");
                return;
            }
        }

        if (this.CurrentPartner.AirportID == undefined)
            this.CurrentPartner.AirportID = 0;
        if (this.CurrentPartner.OrganisationTypeID == undefined)
            this.CurrentPartner.OrganisationTypeID = 0;


        if (this.CurrentPartner.OrgSubType.TypeCode != "PTR004-04") {
            var telecode = $("#mobile-number").val();
            telecode = telecode.replace('+', '');
            this.CurrentPartner.TeleCode = telecode.trim();
        }
        else {
            this.CurrentPartner.TeleCode = "";
            this.CurrentPartner.PartnerParentID = null;
        }

        if (this.typeId == 'PTR001') {
            var me = this;
            this.CurrentPartner.UserRoles = this.UserRoleCollection;

        }
        if (!IsValidRuleConfigration) {
            this._util.error("Please fill all active rule configuration.","Alert");
            return;
        }

        //this.CurrentPartner.PartnerTypeID = this.typeId;
        this.reg = [{ 'Partner': JSON.stringify(this.CurrentPartner) }];
        this.partnerService.save(this.reg, this.typeId).subscribe(retvalue => {
            var me = this;
            var outputId = retvalue.PartnerID;
            this.errorMessage = "";
            var errMsg = "";
            var flag = 0;
            var caption = "";
            if (this.typeId == 'PTR002')
                caption = "Vendor";
            else if (this.typeId == 'PTR001')
                caption = "Facility";
            else if (this.typeId == 'PTR003')
                caption = "Repair Hub";
            else if (this.typeId == 'PTR004')
                caption = "Accounts";
            else if (this.typeId == 'PTR005')
                caption = "Depot";
            else if (this.typeId == 'PTR006')
                caption = "TMSAccount";
            else if (this.typeId == 'PTR007')
                caption = "Call Center";
            //var caption = this.typeId == 'PTR002' ? "Vendor" : "Partner";


            if (retvalue.result == "Updated") {
                this.updatePartnerAddress(outputId);
                errMsg = caption + " saved successfully."
                flag++;
                //this._router.navigate(['partners']);
            }
            else if (retvalue.result == "Added") {
                this.updatePartnerAddress(outputId);
                errMsg = caption + " added successfully."
                flag++;
                //this._router.navigate(['partners']);
            }
            else if (retvalue.result == "Duplicated") {
                errMsg = "Same " + caption + " Name exists. Please enter another " + caption + " Name."
                flag = 0;
            }
            else if (retvalue.result == "Mapped") {
                errMsg = "Same " + caption + " already mapped in other module. Cannot be deactivated."
                flag = 0;
            }
            else {
                errMsg = "System error generated at this moment. Please contact system administrator."
                flag = 0;
            }

            //this._popup.Alert('Alert', errMsg, function () {
            //    if (flag > 0) {
            //        if (!me.CurrentPartner.PartnerParentID || me.CurrentPartner.PartnerParentID == 0)
            //            me.EditorVisibilityChange.emit(true);
            //        else {
            //            me.partnerId = me.CurrentPartner.PartnerParentID;
            //            me.partnerInit();
            //        }
            //        //me.EditorVisibilityChange.emit(true);
            //    }
            //});
            return;

        }, error => this._util.error(error, 'error'));

    }

    onSaveEvent() {
        var me = this;
        var IsValidRuleConfigration: boolean = true;
        if (this.ruleGridOptions.api && this.ruleGridOptions.api != null) {
            this.ruleGridOptions.api.forEachNode(function (node) {
                var item = me.ReasonRuleCollection.filter(d => d.RuleID == node.data.RuleID && d.ReasonID == node.data.ReasonID)[0];
                if (item != undefined) {

                    if (node.data.isActive) {
                        switch (node.data.ControlTypeName) {
                            case "Number":
                                if ((!node.data.RuleValue || !node.data.RuleValueEffect || !node.data.RuleValueEffectTO || node.data.IsFixedRuleValue == undefined) && !node.data.UserInput) {
                                    IsValidRuleConfigration = false;
                                    return false;
                                }
                                break;
                            case "Text":
                                if (!node.data.RuleValue && !node.data.UserInput) {
                                    IsValidRuleConfigration = false;
                                    return false;
                                }
                                break;
                            case "Roles List":
                                if (!node.data.RuleValue || !node.data.RuleValueEffect || !node.data.RuleValueEffectTO || node.data.IsFixedRuleValue == undefined || node.data.IsFixedRuleValue == "") {
                                    IsValidRuleConfigration = false;
                                    return false;
                                }
                                break;
                        }
                    }

                    item.RuleValue = node.data.RuleValue;
                    item.isActive = node.data.isActive;
                    item.isOverRidable = node.data.isOverRidable;
                    item.isMandatory = node.data.isMandatory;
                    item.IsFixedRuleValue = node.data.IsFixedRuleValue;
                    item.RuleValueEffect = node.data.RuleValueEffect;
                    item.RuleValueEffectTO = node.data.RuleValueEffectTO;
                    item.UserInput = node.data.UserInput;
                }

            })
        }


        this.CurrentPartner.UserRoles = this.UserRoleCollection;



        if (!IsValidRuleConfigration) {
            //this._popup.Alert('Alert', "Please fill all active rule configuration.");
            return { status: false, msg:"Please fill all active rule configuration."};
        }

        this.reg = [{ 'Partner': JSON.stringify(this.CurrentPartner) }];
        this.partnerService.save(this.reg, this.typeId).subscribe(retvalue => {
            return { status: true, msg: "updated" };
        });
    }

    CancelPartner() {
        //if (!this.CurrentPartner.PartnerParentID || this.CurrentPartner.PartnerParentID == 0)
        //    this.EditorVisibilityChange.emit(false);
        //else {
        //    this.partnerId = this.CurrentPartner.PartnerParentID;
        //    this.partnerInit();
        //}
        // this._router.navigate(this.returnUrl);
    }
    onDeletePartner() {
        this._popup.Confirm('Delete', 'Do you really want to delete it?', this.onConfirmPopup());
    }

    onConfirmPopup() {
        this.partnerService.remove(this.CurrentPartner.PartnerID)
            .subscribe(
            _partner => {
                //this.gridOptions.api.setDatasource(this.dataSource);
                this._router.navigate(['partners']);
            },
            error => this.errorMessage = <any>error);
    }

    onAddressSave(form: any) {

    }

    onAddressCancel() {

    }

    InitAddress() {

        this.LocalAddressAccess = ["Add"];
        this.CurrentAddress.ParentFormName = "partner";

        this.partnerService.getPartnerAddress(this.partnerId, 0, this.loginPartnerID)
            .subscribe(
            _AllPertnerAddress => {
                this.PartnerAddressList = _AllPertnerAddress.recordsets[0];
                var localize = JSON.parse(_AllPertnerAddress.recordsets[1][0].ColumnDefinitions);
                this.gridAddressHeader = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

                this.gridOptionsAddress.api.setColumnDefs(this.gridAddressHeader);
                this.gridOptionsAddress.api.setRowData(this.PartnerAddressList);
            },
            error => this.errorMessage = <any>error);
    }

    InitPartnerUserRole() {

        this.partnerService.loadUserRoleMapping(this.partnerId)
            .subscribe(_userrole => {

                this.UserRoleCollection = _userrole.recordsets;

                var users = $.map(this.UserRoleCollection, function (n, i) {
                    return n.UserID;
                });

                this.AvailableUsers = JSON.parse(JSON.stringify($.grep(this.AllUserCollection, function (n, i) {
                    return ($.inArray(n.UserID, users) != -1);
                })));

                this.usergridOptions.api.setRowData(this.AvailableUsers);

                //if (this.AvailableUsers.length != 0) {
                //    this.usergridOptions.api.forEachNode(function (node) {
                //        if (node.childIndex === 0) {
                //            node.setSelected(true);
                //        }
                //    });
                //}

                if (this.AvailableUsers.length != 0) {

                    this.rolegridOptions.api.setRowData(this.AllRoleCollection);

                    this.usergridOptions.api.forEachNode(function (node) {
                        if (node.childIndex === 0) {
                            node.setSelected(true);
                        }
                    });
                }
                else {
                    this.rolegridOptions.api.setRowData([]);
                }

            },
            error => this.errorMessage = <any>error);
    }

    DeleteItem(e) {
        if (e.event.target != undefined) {

            let actionType = e.event.target.getAttribute("Id");

            if (actionType == "deleteitem") {
                let itemToDelete = e.data;
                if (itemToDelete.isDefault == true) {
                    this._util.error('Default Partner cannot be deleted.',"Alert");
                }
                else {
                    var idx = this.AvailableUsers.indexOf(itemToDelete);
                    this.AvailableUsers.splice(idx, 1);
                    this.usergridOptions.api.setRowData(this.AvailableUsers);

                    var itemstoMove = this.UserRoleCollection.filter(d => d.PartnerID == itemToDelete.PartnerID);
                    for (let item of itemstoMove) {
                        var ind = this.UserRoleCollection.indexOf(item);
                        if (ind > -1) {
                            this.UserRoleCollection.splice(ind, 1);
                        }
                    }

                    if (this.AvailableUsers.length != 0) {

                        this.usergridOptions.api.forEachNode(function (node) {
                            if (node.childIndex === 0) {
                                node.setSelected(true);
                            }
                        });
                    }
                    else {
                        this.rolegridOptions.api.setRowData([]);
                    }
                }
            }
        }
    }

    onSelectedAddrChanged() {
        this.LocalAddressAccess = ["Add", "Edit", "Delete"];
        this.AddrGridView = true;
        this.CurrentAddress = this.gridOptionsAddress.api.getSelectedRows()[0];
        this.CurrentPartnerAddress = this.gridOptionsAddress.api.getSelectedRows()[0];
    }

    onSelectedOriginAddrChanged() {
        this.LocalAddressAccess = ["Add", "Edit", "Delete"];
        this.AddorgGridView = true;
        this.CurrentAddress = this.gridOptionsOrgionList.api.getSelectedRows()[0];
        this.CurrentPartnerAddress = this.gridOptionsOrgionList.api.getSelectedRows()[0];
    }


    onSelectedDestinationAddrChanged() {
        this.LocalDestAddressAccess = ["Add", "Edit", "Delete"];
        this.AddDesGridView = true;
        this.CurrentAddress = this.gridOptionsDestinationList.api.getSelectedRows()[0];
        this.CurrentPartnerAddress = this.gridOptionsDestinationList.api.getSelectedRows()[0];
    }


    onSelectedPartnerLaneChanged() {
        // this.LocalLaneAddressAccess = ["Add", "Edit", "Delete"];
        // this.AddpartnerlaneView = true;
        // this.CurrentPartnerLane = this.gridOptionsPartnerLaneList.api.getSelectedRows()[0];
        //this.CurrentPartnerAddress = this.gridOptionsPartnerLaneList.api.getSelectedRows()[0];
    }


    onSelectedPartnerODPairChanged() {
        // this.LocalODPairAddressAccess = ["Add", "Edit", "Delete"];
        // this.AddpartnerODView = true;
        // this.CurrentPartnerODPair = this.gridOptionsPartnerODPairList.api.getSelectedRows()[0];
        // //this.CurrentPartnerAddress = this.gridOptionsPartnerODPairList.api.getSelectedRows()[0];
    }

    onSelectedUserChanged() {

        this.rolegridOptions.api.deselectAll();

        //if (this.isFirstTimeLoad) {
        //    this.usergridOptions.api.selectIndex(0, true, false);
        //}
        //else {
        //    this.rolegridOptions.api.deselectAll();
        //}

        let data = this.usergridOptions.api.getSelectedRows()[0];

        var roles = this.UserRoleCollection.filter(ur => ur.UserID == data.UserID).map(function (e) {
            return e.RoleID;
        })

        this.rolegridOptions.api.forEachNode(function (node) {
            if ($.inArray(node.data.RoleID, roles) > -1) {
                node.setSelected(true);
            }
            else {
                node.setSelected(false);
            }
        })
    }

    onRoleSelectionChanged(e) {

        var selectedRoles = this.rolegridOptions.api.getSelectedRows();
        var selectedUser = this.usergridOptions.api.getSelectedRows()[0];

        var selectedRoleIds = [];
        var dselectedNodes = [];

        if (selectedUser != undefined && selectedRoles.length != 0) {

            for (let row of selectedRoles) {
                if (row != undefined) {
                    var itemtoMove = this.UserRoleCollection.filter(d => d.RoleID == row.RoleID && d.UserID == selectedUser.UserID)[0];
                    var ind = this.UserRoleCollection.map(function (e) { return e; }).indexOf(itemtoMove);

                    if (itemtoMove == undefined) {
                        let newItem = { UserID: selectedUser.UserID, RoleID: row.RoleID };
                        this.UserRoleCollection.push(newItem);
                        //this.UserRoleCollection.splice(ind, 1);
                    }
                    selectedRoleIds.push(row.RoleID);
                }
            }

            this.rolegridOptions.api.forEachNode(function (node) {
                if ($.inArray(node.data.RoleID, selectedRoleIds) == -1) {
                    let newItem = { UserID: selectedUser.UserID, RoleID: node.data.RoleID };
                    dselectedNodes.push(newItem);
                }

            })

            for (let n of dselectedNodes) {
                var itemtoMove = this.UserRoleCollection.filter(d => d.RoleID == n.RoleID && d.UserID == selectedUser.UserID)[0];
                var ind = this.UserRoleCollection.map(function (e) { return e; }).indexOf(itemtoMove);
                if (itemtoMove != undefined) {
                    this.UserRoleCollection.splice(ind, 1);
                }
            }
        }
    }

    onAddrFilterChanged() {
        if (this.filterAddrVal === '') {
            this.filterAddrVal = null;
        }
        this.gridOptionsAddress.api.setQuickFilter(this.filterAddrVal);
    }


    onOriginAddrFilterChanged() {
        if (this.filterAddrVal === '') {
            this.filterAddrVal = null;
        }
        this.gridOptionsOrgionList.api.setQuickFilter(this.filterAddrVal);
    }

    filterOrgAddrVal: string;

    onDestinationFilterChanged() {
        if (this.filterOrgAddrVal === '') {
            this.filterOrgAddrVal = null;
        }
        this.gridOptionsDestinationList.api.setQuickFilter(this.filterOrgAddrVal);
    }

    filterPartnerODVal: string;

    onPartnerODFilterChanged() {
        if (this.filterPartnerODVal === '') {
            this.filterPartnerODVal = null;
        }
        this.gridOptionsPartnerODPairList.api.setQuickFilter(this.filterPartnerODVal);
    }


    filterPartnerLaneAddrVal: string;

    onPartnerLaneFilterChanged() {
        if (this.filterPartnerLaneAddrVal === '') {
            this.filterPartnerLaneAddrVal = null;
        }
        this.gridOptionsPartnerLaneList.api.setQuickFilter(this.filterPartnerLaneAddrVal);
    }

    AddressEvent(event) {
        this.AddrGridView = true;
        this.addressccolumnDefs = this.gridAddressHeader;

        if (event.PostType == "insert") {
            this.PartnerAddressList.push(
                {
                    RowNumber: event.RowNumber,
                    PartnerAddressMapID: 0,
                    PartnerID: this.CurrentPartner.PartnerID,
                    AddressTypeID: event.AddressTypeID,
                    Description: event.Description,
                    TypeName: event.TypeName,
                    AddressID: 0,
                    Address1: event.Address1,
                    Address2: event.Address2,
                    City: event.City,
                    CountryID: event.CountryID,
                    StateID: event.StateID,
                    ZipCode: event.ZipCode,
                    FixedLineNumber: event.FixedLineNumber,
                    CellNumber: event.CellNumber,
                    CreatedBy: this._LoginService.loginUserName,
                    CreatedDate: new Date(),
                    ModifyBy: this._LoginService.loginUserName,
                    ModifyDate: new Date(),
                    IsActive: event.IsActive,
                    CreatedByName: this._LoginService.loginUserName,
                    ModifyByName: this._LoginService.loginUserName,
                    CreatedByID: this._LoginService.loginUserID,
                    ModifyByID: this._LoginService.loginUserID
                });
        }
        if (event.PostType == "update") {
            var _tempAddress = this.PartnerAddressList.find(x => x.RowNumber == event.RowNumber);
            _tempAddress.Address1 = event.Address1;
            _tempAddress.Address2 = event.Address2;
            _tempAddress.AddressID = event.AddressID;
            _tempAddress.AddressTypeID = event.AddressTypeID;
            _tempAddress.City = event.City;
            _tempAddress.Description = event.Description;
            _tempAddress.PartnerAddressMapID = event.PartnerAddressMapID;
            _tempAddress.PartnerID = this.CurrentPartner.PartnerID,
                _tempAddress.RowNumber = event.RowNumber;
            _tempAddress.TypeName = event.TypeName;
            _tempAddress.CreatedBy = this._LoginService.loginUserName;
            _tempAddress.CreatedByName = this._LoginService.loginUserName;
            _tempAddress.CreatedDate = event.CreatedDate;
            _tempAddress.ModifyBy = this._LoginService.loginUserName;
            _tempAddress.ModifyByName = this._LoginService.loginUserName;
            _tempAddress.ModifyByID = this._LoginService.loginUserID;
            _tempAddress.CreatedByID = this._LoginService.loginUserID;
            _tempAddress.ModifyDate = new Date();
            _tempAddress.CountryID = event.CountryID;
            _tempAddress.StateID = event.StateID;
            _tempAddress.ZipCode = event.ZipCode;
            _tempAddress.IsActive = event.IsActive;
        }
        this.LocalAddressAccess = ["Add"];
    }

    AddAddress() {
        this.CurrentAddress = new Address();
        this.AddrGridView = false;
        this.CurrentAddress.AddressID = 0;
        this.CurrentAddress.ParentFormName = "partner";
        this.CurrentAddress.PostType = "insert";
        this.CurrentAddress.RowNumber = this.getNextRowNumber();
    }

    EditAddress() {
        this.AddrGridView = false;
        this.CurrentAddress.ParentFormName = "partner";
        this.CurrentAddress.PostType = "update";
    }

    DeleteAddress() {
        var i = this.PartnerAddressList.indexOf(this.CurrentPartnerAddress);
        if (i > -1) this.deletedAddressID.push(this.CurrentPartnerAddress.AddressID);
        this.PartnerAddressList.splice(i, 1);
        this.gridOptionsAddress.api.setRowData(this.PartnerAddressList);

    }

    getNextRowNumber() {
        let listLength: number = this.PartnerAddressList.length;
        if (listLength > 0) {
            let LastNumber: number = this.PartnerAddressList[listLength - 1].RowNumber;
            LastNumber++;
            return LastNumber;
        }
        else return 1;
    }

    AddressOrigionEvent(event, IsOrigion) {
        if (IsOrigion) {
            this.AddorgGridView = true;
            this.cmOrgioncolumnDefs = this.gridOrigionHeader;
            if (event.PostType == "insert") {
                this.OrgionAddressList.push(
                    {
                        RowNumber: event.RowNumber,
                        PartnerAddressMapID: 0,
                        PartnerID: this.CurrentPartner.PartnerID,
                        AddressTypeID: event.AddressTypeID,
                        Description: event.Description,
                        AddressID: 0,
                        OrigionAddress: event.Address1 + ' ' + event.Address2 + ' ' + event.City + ' ,' + event.StateName + ' , ' + event.CountryName + ' ' + event.ZipCode,
                        Address1: event.Address1,
                        Address2: event.Address2,
                        City: event.City,
                        CountryID: event.CountryID,
                        StateID: event.StateID,
                        ZipCode: event.ZipCode,
                        FixedLineNumber: event.FixedLineNumber,
                        CellNumber: event.CellNumber,
                        CreatedBy: this._LoginService.loginUserName,
                        CreatedDate: new Date(),
                        ModifyBy: this._LoginService.loginUserName,
                        ModifyDate: new Date(),
                        IsActive: event.IsActive,
                        CreatedByName: this._LoginService.loginUserName,
                        ModifyByName: this._LoginService.loginUserName,
                        CreatedByID: this._LoginService.loginUserID,
                        ModifyByID: this._LoginService.loginUserID
                    });
            }
            if (event.PostType == "update") {
                var _tempAddress = this.OrgionAddressList.find(x => x.RowNumber == event.RowNumber);
                _tempAddress.Address1 = event.Address1;
                _tempAddress.Address2 = event.Address2;
                _tempAddress.OrigionAddress = event.OrigionAddress;
                _tempAddress.AddressID = event.AddressID;
                _tempAddress.AddressTypeID = event.AddressTypeID;
                _tempAddress.City = event.City;
                _tempAddress.Description = event.Description;
                _tempAddress.PartnerAddressMapID = event.PartnerAddressMapID;
                _tempAddress.PartnerID = this.CurrentPartner.PartnerID,
                _tempAddress.RowNumber = event.RowNumber;
                _tempAddress.CreatedBy = this._LoginService.loginUserName;
                _tempAddress.CreatedByName = this._LoginService.loginUserName;
                _tempAddress.CreatedDate = event.CreatedDate;
                _tempAddress.ModifyBy = this._LoginService.loginUserName;
                _tempAddress.ModifyByName = this._LoginService.loginUserName;
                _tempAddress.ModifyByID = this._LoginService.loginUserID;
                _tempAddress.CreatedByID = this._LoginService.loginUserID;
                _tempAddress.ModifyDate = new Date();
                _tempAddress.CountryID = event.CountryID;
                _tempAddress.StateID = event.StateID;
                _tempAddress.ZipCode = event.ZipCode;
                _tempAddress.IsActive = event.IsActive;
            }
            this.LocalAddressAccess = ["Add"];
        } else {

            this.AddDesGridView = true;
            this.cmDestinationolumnDefs = this.gridDestinationHeader;

            if (event.PostType == "insert") {
                this.DestinationAddressList.push(
                    {
                        RowNumber: event.RowNumber,
                        PartnerAddressMapID: 0,
                        PartnerID: this.CurrentPartner.PartnerID,
                        AddressTypeID: event.AddressTypeID,
                        Description: event.Description,
                        DestinationAddress: event.Address1 + ' ' + event.Address2 + ' ' + event.City + ' ,' + event.StateName + ', ' + event.CountryName + ' ' + event.ZipCode,
                        AddressID: 0,
                        Address1: event.Address1,
                        Address2: event.Address2,
                        City: event.City,
                        CountryID: event.CountryID,
                        StateID: event.StateID,
                        ZipCode: event.ZipCode,
                        FixedLineNumber: event.FixedLineNumber,
                        CellNumber: event.CellNumber,
                        CreatedBy: this._LoginService.loginUserName,
                        CreatedDate: new Date(),
                        ModifyBy: this._LoginService.loginUserName,
                        ModifyDate: new Date(),
                        IsActive: event.IsActive,
                        CreatedByName: this._LoginService.loginUserName,
                        ModifyByName: this._LoginService.loginUserName,
                        CreatedByID: this._LoginService.loginUserID,
                        ModifyByID: this._LoginService.loginUserID
                    });
            }
            if (event.PostType == "update") {
                var _tempAddress = this.DestinationAddressList.find(x => x.RowNumber == event.RowNumber);
                _tempAddress.Address1 = event.Address1;
                _tempAddress.Address2 = event.Address2;
                _tempAddress.DestinationAddress = event.DestinationAddress;
                _tempAddress.AddressID = event.AddressID;
                _tempAddress.AddressTypeID = event.AddressTypeID;
                _tempAddress.City = event.City;
                _tempAddress.Description = event.Description;
                _tempAddress.PartnerAddressMapID = event.PartnerAddressMapID;
                _tempAddress.PartnerID = this.CurrentPartner.PartnerID,
                    _tempAddress.RowNumber = event.RowNumber;

                _tempAddress.CreatedBy = this._LoginService.loginUserName;
                _tempAddress.CreatedByName = this._LoginService.loginUserName;
                _tempAddress.CreatedDate = event.CreatedDate;
                _tempAddress.ModifyBy = this._LoginService.loginUserName;
                _tempAddress.ModifyByName = this._LoginService.loginUserName;
                _tempAddress.ModifyByID = this._LoginService.loginUserID;
                _tempAddress.CreatedByID = this._LoginService.loginUserID;
                _tempAddress.ModifyDate = new Date();
                _tempAddress.CountryID = event.CountryID;
                _tempAddress.StateID = event.StateID;
                _tempAddress.ZipCode = event.ZipCode;
                _tempAddress.IsActive = event.IsActive;
            }
            this.LocalDestAddressAccess = ["Add"];
        }
    }


    AddOrigionAddress(IsOrigion) {
        if (IsOrigion) {
            this.AddorgGridView = false;
            this.AddressTypeID = 617;
        } else {
            this.AddDesGridView = false;
            this.AddressTypeID = 618;
        }
        this.CurrentAddress = new Address();
        this.CurrentAddress.AddressID = 0;
        this.CurrentAddress.ParentFormName = "partner";
        this.CurrentAddress.PostType = "insert";
        this.CurrentAddress.RowNumber = this.getNextOAddressRowNumber(IsOrigion);
    }

    EditOrigionAddress(IsOrigion) {
        if (IsOrigion) {
            this.AddorgGridView = false;

        } else {
            this.AddDesGridView = false;

        }
        this.CurrentAddress.ParentFormName = "partner";
        this.CurrentAddress.PostType = "update";
    }

    DeleteOrigionAddress(IsOrigion) {
        if (IsOrigion) {
            var i = this.OrgionAddressList.indexOf(this.CurrentAddress);
            if (i > -1) {
                this.OrgionAddressList.splice(i, 1);
                this.gridOptionsOrgionList.api.setRowData(this.OrgionAddressList);
            }
        } else {
            var i = this.DestinationAddressList.indexOf(this.CurrentAddress);
            if (i > -1) {
                this.DestinationAddressList.splice(i, 1);
                this.gridOptionsDestinationList.api.setRowData(this.DestinationAddressList);
            }
        }
    }

    getNextOAddressRowNumber(IsOrigion) {
        if (IsOrigion) {
            let listLength: number = this.OrgionAddressList.length;
            if (listLength > 0) {
                let LastNumber: number = this.OrgionAddressList[listLength - 1].RowNumber;
                LastNumber++;
                return LastNumber;
            }
            else return 1;
        } else {
            let listLength: number = this.DestinationAddressList.length;
            if (listLength > 0) {
                let LastNumber: number = this.DestinationAddressList[listLength - 1].RowNumber;
                LastNumber++;
                return LastNumber;
            }
            else return 1;
        }
    }


    AddPartnerODPair() {

        // this.AddpartnerODView = false;

        // this.CurrentPartnerODPair = new ODPair();
        // this.CurrentPartnerODPair.PartnerODPairID = 0;
        // this.CurrentPartnerODPair.PartnerID = this.partnerId;
        // //this.CurrentPartnerODPair.ParentFormName = "partner";
        // this.CurrentPartnerODPair.PostType = "insert";
        // this.CurrentPartnerODPair.RowNumber = this.getNextPartnerODPairRowNumber();
    }

    EditPartnerODPair() {
        // this.AddpartnerODView = false;
        // //this.CurrentPartnerODPair.ParentFormName = "partner";
        // this.CurrentPartnerODPair.PostType = "update";
    }

    DeletePartnerODPair() {
        // var i = this.PartnerODList.indexOf(this.CurrentPartnerODPair);
        // if (i > -1) {
        //     this.PartnerODList.splice(i, 1);
        //     this.gridOptionsDestinationList.api.setRowData(this.PartnerODList);
        // }
    }

    getNextPartnerODPairRowNumber() {

        let listLength: number = this.PartnerODList.length;
        if (listLength > 0) {
            let LastNumber: number = this.PartnerODList[listLength - 1].RowNumber;
            LastNumber++;
            return LastNumber;
        }
        else return 1;

    }


    AddPartnerLaneAddress() {

        // this.AddpartnerlaneView = false;

        // this.CurrentPartnerLane = new Lane();
        // this.CurrentPartnerLane.PartnerLaneID = 0;
        // this.CurrentPartnerLane.PartnerID = this.partnerId;
        // //this.CurrentPartnerODPair.ParentFormName = "partner";
        // this.CurrentPartnerLane.PostType = "insert";
        // this.CurrentPartnerLane.RowNumber = this.getNextPartnerLeneRowNumber();
    }

    EditPartnerLaneAddress() {
        // this.AddpartnerlaneView = false;
        // //this.CurrentPartnerODPair.ParentFormName = "partner";
        // this.CurrentPartnerLane.PostType = "update";
    }

    DeletePartnerLaneAddress() {
        // var i = this.PartnerLaneList.indexOf(this.CurrentPartnerLane);
        // if (i > -1) {
        //     this.PartnerLaneList.splice(i, 1);
        //     this.gridOptionsPartnerLaneList.api.setRowData(this.PartnerLaneList);
        // }
    }

    getNextPartnerLeneRowNumber() {

        let listLength: number = this.PartnerLaneList.length;
        if (listLength > 0) {
            let LastNumber: number = this.PartnerLaneList[listLength - 1].RowNumber;
            LastNumber++;
            return LastNumber;
        }
        else return 1;

    }

    PartnerODPairEvent(event) {
        this.AddpartnerODView = true;
        this.cmPartnerODPaircolumnDefs = this.gridPartnerODPairHeader;

        if (event.PostType == "insert") {
            this.PartnerODList.push(
                {
                    RowNumber: event.RowNumber,
                    PartnerAddressMapID: 0,
                    PartnerID: this.CurrentPartner.PartnerID,
                    OriginPartnerAddressMapID: event.OriginPartnerAddressMapID,
                    DestinationPartnerAddressMapID: event.DestinationPartnerAddressMapID,
                    ODPairCode: event.ODPairCode,
                    ODPairName: event.ODPairName,
                    PartnerODPairID: 0,
                    MileageUOM: event.Mileage + ' / ' + event.UOMName,
                    Mileage: event.Mileage,
                    MileageUOMID: event.MileageUOMID,
                    OrigionAddress: event.OrigionAddress,
                    DestinationAddress: event.DestinationAddress,
                    CreatedBy: this._LoginService.loginUserName,
                    CreatedDate: new Date(),
                    ModifyBy: this._LoginService.loginUserName,
                    ModifyDate: new Date(),
                    IsActive: event.IsActive,
                    CreatedByName: this._LoginService.loginUserName,
                    ModifyByName: this._LoginService.loginUserName,
                    CreatedByID: this._LoginService.loginUserID,
                    ModifyByID: this._LoginService.loginUserID
                });
        }
        if (event.PostType == "update") {
            var _tempAddress = this.PartnerODList.find(x => x.RowNumber == event.RowNumber);
            _tempAddress.RowNumber = event.RowNumber;
            _tempAddress.PartnerID = event.PartnerID;
            _tempAddress.OriginPartnerAddressMapID = event.OriginPartnerAddressMapID;
            _tempAddress.DestinationPartnerAddressMapID = event.DestinationPartnerAddressMapID;
            _tempAddress.ODPairCode = event.ODPairCode;
            _tempAddress.ODPairName = event.ODPairName;
            _tempAddress.MileageUOM = event.Mileage + ' / ' + event.UOMName,
            _tempAddress.PartnerODPairID = event.PartnerODPairID,
            _tempAddress.CreatedBy = this._LoginService.loginUserName;
            _tempAddress.CreatedByName = this._LoginService.loginUserName;
            _tempAddress.CreatedDate = event.CreatedDate;
            _tempAddress.ModifyBy = this._LoginService.loginUserName;
            _tempAddress.ModifyByName = this._LoginService.loginUserName;
            _tempAddress.ModifyByID = this._LoginService.loginUserID;
            _tempAddress.CreatedByID = this._LoginService.loginUserID;
            _tempAddress.ModifyDate = new Date();
        }
        this.LocalODPairAddressAccess = ["Add"];
    }


    PartnerLaneEvent(event) {
        this.AddpartnerlaneView = true;
        this.cmPartnerLanecolumnDefs = this.gridPartnerLaneHeader;
        if (event.PostType == "insert") {
            this.PartnerLaneList.push(
                {
                    RowNumber: event.RowNumber,
                    PartnerLaneID: 0,
                    PartnerID: this.CurrentPartner.PartnerID,
                    LaneCode: event.LaneCode,
                    LaneName: event.LaneName,
                    Mileage: event.Mileage,
                    LaneRate: event.LaneRate,
                    LaneRateUOM: event.LaneRate + ' / ' + event.RateUnit,
                    MileageUOM: event.Mileage + ' / ' + event.MileageUnit,
                    ODPairs: event.ODPairs,
                    TypeName : event.TypeName,
                    CarrierName : event.CarrierName,
                    LaneRateUOMID: event.LaneRateUOMID,
                    FrequencyID: event.FrequencyID,
                    CarrierID: event.CarrierID,
                    CreatedBy: this._LoginService.loginUserName,
                    CreatedDate: new Date(),
                    ModifyBy: this._LoginService.loginUserName,
                    ModifyDate: new Date(),
                    IsActive: event.IsActive,
                    CreatedByName: this._LoginService.loginUserName,
                    ModifyByName: this._LoginService.loginUserName,
                    CreatedByID: this._LoginService.loginUserID,
                    ModifyByID: this._LoginService.loginUserID
                });
        }
        if (event.PostType == "update") {
            var _tempAddress = this.PartnerLaneList.find(x => x.RowNumber == event.RowNumber);
            _tempAddress.RowNumber = event.RowNumber;
            _tempAddress.PartnerID = event.PartnerID;
            _tempAddress.LaneRateUOMID = event.LaneRateUOMID;
            _tempAddress.FrequencyID = event.FrequencyID;
            _tempAddress.LaneCode = event.LaneCode;
            _tempAddress.ODPairs = event.ODPairs;
            _tempAddress.LaneName = event.LaneName;
            _tempAddress.TypeName = event.TypeName;
            _tempAddress.CarrierName = event.CarrierName;
            _tempAddress.LaneRate = event.LaneRate;
            _tempAddress.LaneRateUOM = event.LaneRate + ' / ' + event.RateUnit,
            _tempAddress.MileageUOM = event.Mileage + ' / ' + event.MileageUnit,
            _tempAddress.PartnerLaneID = event.PartnerLaneID,
            _tempAddress.CarrierID = event.CarrierID,
            _tempAddress.Mileage = event.Mileage,
            _tempAddress.CreatedBy = this._LoginService.loginUserName;
            _tempAddress.CreatedByName = this._LoginService.loginUserName;
            _tempAddress.CreatedDate = event.CreatedDate;
            _tempAddress.ModifyBy = this._LoginService.loginUserName;
            _tempAddress.ModifyByName = this._LoginService.loginUserName;
            _tempAddress.ModifyByID = this._LoginService.loginUserID;
            _tempAddress.CreatedByID = this._LoginService.loginUserID;
            _tempAddress.ModifyDate = new Date();
        }
        this.LocalLaneAddressAccess = ["Add"];
    }


    updatePartnerAddress(outputId) {
        this.partnerService.updatePartnerAddress(this.PartnerAddressList, this.deletedAddressID, outputId).subscribe(
            _result => {
                //this.GridView = true;
                //this.LocalAccess = ["Add"];
            }, error => this._util.error(error, 'error'));
    }

    openGridPopup() {
        this.UserGridPopup = true;
        this.modal.open();
    }


    close() {
        this.modal.close();
    }

    UserGridEvent(event) {
        var me = this;
        me.modal.close();
        me.UserGridPopup = false;
        var msg: string = "";

        $.each(event, function (i, v) {
            var reasons = me.AvailableUsers.filter(u => u.UserID == v.UserID);
            if (reasons.length > 0) {
                msg = msg + v.FullName + ", ";
            }
            else {
                me.AvailableUsers.push({
                    UserID: v.UserID,
                    FirstName: v.FirstName,
                    UserName: v.UserName,
                });

            }
        });

        if (msg.length > 0) {
            this._util.error( msg + " already exists.","Alert");
        }

        if (me.usergridOptions.api)
            me.usergridOptions.api.setRowData(me.AvailableUsers);

        if (me.AvailableUsers.length != 0) {

            me.rolegridOptions.api.setRowData(me.AllRoleCollection);

            me.usergridOptions.api.forEachNode(function (node) {
                if (node.childIndex === 0) {
                    node.setSelected(true);
                }
            });
        }
        else {
            this.rolegridOptions.api.setRowData([]);
        }


        //var users = this.AvailableUsers.filter(u => u.UserID == event.UserID);
        //if (users.length > 0) {
        //    this._popup.Alert('Alert', 'Same User already exists.');
        //}
        //else {
        //    this.AvailableUsers.push({
        //        UserID: event.UserID,
        //        FirstName: event.FirstName,
        //        UserName: event.UserName,
        //    });

        //    this.usergridOptions.api.setRowData(this.AvailableUsers);

        //    if (this.AvailableUsers.length != 0) {

        //        this.rolegridOptions.api.setRowData(this.AllRoleCollection);

        //        this.usergridOptions.api.forEachNode(function (node) {
        //            if (node.childIndex === 0) {
        //                node.setSelected(true);
        //            }
        //        });
        //    }
        //    else {
        //        this.rolegridOptions.api.setRowData([]);
        //    }
        //}
    }

    InitConfigMaps(partnerId: number) {

        this.partnerService.loadConfigMaps(partnerId)
            .subscribe(
            _ConfigMapCollection => {
                this.ConfigMapCollection = _ConfigMapCollection.recordsets;
                if (this.cmgridOptions.api)
                    this.cmgridOptions.api.setRowData(this.ConfigMapCollection);
                else
                    this.cmgridOptions.rowData = this.ConfigMapCollection;
                //if (this.ConfigMapCollection.length > 0) {

                //    var TypeCodes = $.map(this.ConfigMapCollection, function (n, i) {
                //        return n.TypeCode;
                //    });

                //    var _CurrentConfigType = this.ConfigMapCollection[0].ConfigGroup;

                //    this.AllConfigMaps = JSON.parse(JSON.stringify($.grep(this.AllConfigMapCollection, function (n, i) {
                //        return (($.inArray(n.TypeCode, TypeCodes) == -1) && n.TypeGroup == _CurrentConfigType);
                //    })));
                //}
            },
            error => this.errorMessage = <any>error);

        this.metadataService$.getTypeLookUpByGroupName('PartnerConfig')
            .subscribe(
            _ConfigTypes => {
                this.ConfigTypes = _ConfigTypes;
                var TypeCodes = $.map(this.ConfigTypes, function (n, i) {
                    return n.TypeCode;
                });
                //this.metadataService$.getTypeLookUpsByGroupName(TypeCodes)
                //    .subscribe(
                //    _AllConfigMapCollection => {
                //        this.AllConfigMapCollection = _AllConfigMapCollection
                //    },
                //    error => this.errorMessage = <any>error);

                this.commonService$.getTypeLookUpsByName(TypeCodes)
                    .subscribe(
                    _AllConfigMapCollection => {
                        this.AllConfigMapCollection = _AllConfigMapCollection
                    },
                    error => this.errorMessage = <any>error);
            },
            error => this.errorMessage = <any>error);

    }

    getConfigMaps() {

        var _CurrentConfigType = this.CurrentConfigType;
        this.ConfigMaps = this.ConfigMapCollection.filter(d => d.TypeGroup === _CurrentConfigType);
        var typecodes = $.map(this.ConfigMapCollection, function (n, i) {
            return n.TypeCode;
        });
        this.AllConfigMaps = JSON.parse(JSON.stringify($.grep(this.AllConfigMapCollection, function (n, i) {
            return (($.inArray(n.TypeCode, typecodes) == -1) && n.TypeGroup === _CurrentConfigType);
        })));
    }

    onSelectedConfigMapChanged() {
        this.selectedConfigMap = this.cmgridOptions.api.getSelectedRows();
    }

    moveConfigMap() {
        var item = this.availableConfigMap[0]
        var ind = this.AllConfigMaps.map(function (e) { return e.TypeCode; }).indexOf(item.TypeCode);
        if (ind != -1) {
            this.AllConfigMaps.splice(ind, 1);
            this.ConfigMapCollection.push(JSON.parse(JSON.stringify(item)));
        }
        this.cmgridOptions.api.setRowData(this.ConfigMapCollection);
    }

    moveConfigMapBack() {
        var item = this.AllConfigMapCollection.filter(d => d.TypeCode === this.selectedConfigMap[0].TypeCode)[0];
        var ind = this.ConfigMapCollection.map(function (e) { return e.TypeCode; }).indexOf(item.TypeCode);
        if (ind != -1) {
            this.ConfigMapCollection.splice(ind, 1);
            this.AllConfigMaps.push(item);
        }
        this.cmgridOptions.api.setRowData(this.ConfigMapCollection);
    }

    moveAllConfigMap() {
        var fromCollection = $.grep(this.AllConfigMaps, function (value) {
            return value;
        });
        for (let item of fromCollection) {
            var ind = this.AllConfigMaps.map(function (e) { return e.TypeCode; }).indexOf(item.TypeCode);
            if (ind != -1) {
                this.AllConfigMaps.splice(ind, 1);
                this.ConfigMapCollection.push(JSON.parse(JSON.stringify(item)));
            }
        }
        this.cmgridOptions.api.setRowData(this.ConfigMapCollection);
    }

    moveAllConfigMapBack() {
        var fromCollection = $.grep(this.ConfigMapCollection, function (value) {
            return value;
        });
        for (let item of fromCollection) {
            var itemtoMove = this.AllConfigMapCollection.filter(d => d.TypeCode === item.TypeCode)[0];
            var ind = this.ConfigMapCollection.map(function (e) { return e.TypeCode; }).indexOf(item.TypeCode);
            if (ind != -1) {
                this.ConfigMapCollection.splice(ind, 1);
                this.AllConfigMaps.push(itemtoMove);
            }
        }
        this.cmgridOptions.api.setRowData(this.ConfigMapCollection);
    }

    InitPartnerReturnReason(partnerId: number) {
        this.partnerService.loadRetReasonRuleMapping(partnerId)
            .subscribe(_reasonrule => {

                this.AllReasonCollection = _reasonrule.recordsets[0];
                this.ReasonRuleCollection = _reasonrule.recordsets[1];

                //var reasons = $.map(partnerReasons, function (n, i) {
                //    return n.ReasonID;
                //});
                this.AvailableReasons = this.AllReasonCollection;
                //this.AvailableReasons = JSON.parse(JSON.stringify($.grep(this.AllReasonCollection, function (n, i) {
                //    return ($.inArray(n.ReasonID, reasons) != -1);
                //})));
                if (this.reasonGridOptions.api)
                    this.reasonGridOptions.api.setRowData(this.AvailableReasons);

                if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
                    this.reasonGridOptions.api.forEachNode(function (node) {
                        if (node.childIndex === 0) {
                            node.setSelected(true);
                        }
                    });
                }

            },
            error => this.errorMessage = <any>error);
    }

    ReturnReasonGridEvent(event) {
        //this.modalReturnReason.close();
        //this.ReturnReasonGridPopup = false;
        //var reasons = this.AvailableReasons.filter(u => u.ReasonID == event.RMAActionCodeID);
        //if (reasons.length > 0) {
        //    //alert("Same User already exists.");
        //    this._popup.Alert('Alert', 'Same Reason already exists.');
        //}
        //else {
        //    this.AvailableReasons.push({
        //        PartnerReturnReasonMapID: 0,
        //        ReasonID: event.RMAActionCodeID,
        //        ReasonCode: event.RMAActionCode,
        //        ReasonName: event.RMAActionName,
        //        ReturnType: event.ReturnType
        //    });
        //    if (this.reasonGridOptions.api)
        //    this.reasonGridOptions.api.setRowData(this.AvailableReasons);

        //    if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
        //        this.reasonGridOptions.api.forEachNode(function (node) {
        //            node.setSelected(true);
        //        });
        //    }
        //}

        var me = this;
        this.modalReturnReason.close();
        this.ReturnReasonGridPopup = false;
        var msg: string = "";

        $.each(event, function (i, v) {
            var reasons = me.AvailableReasons.filter(u => u.ReasonID == event.RMAActionCodeID);
            if (reasons.length > 0) {
                msg = msg + v.RMAActionName + ", ";
                //me._popup.Alert('Alert', 'Same Reason already exists.');
            }
            else {
                me.AvailableReasons.push({
                    PartnerReturnReasonMapID: 0,
                    ReasonID: v.RMAActionCodeID,
                    ReasonCode: v.RMAActionCode,
                    ReasonName: v.RMAActionName,
                    ReturnType: v.ReturnType,
                    TypeName: v.TypeName
                });
            }
        });

        if (msg.length > 0) {
            this._util.error(msg + " already exists.","Alert");
        }

        if (this.reasonGridOptions.api)
            this.reasonGridOptions.api.setRowData(this.AvailableReasons);

        if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
            this.reasonGridOptions.api.forEachNode(function (node) {
                node.setSelected(true);
            });
        }
    }

    RemoveReturnReason() {
        var ind = this.AvailableReasons.map(function (e) { return e.ReasonID; }).indexOf(this.CurrentReturnReason.ReasonID);
        if (ind > -1) {
            this.ReasonRuleCollection = this.ReasonRuleCollection.filter(f => f.ReasonID != this.CurrentReturnReason.ReasonID)
            this.AvailableReasons.splice(ind, 1);
            this.reasonGridOptions.api.setRowData(this.AvailableReasons);
            this.CurrentReturnReason = null;
            if (this.AvailableReasons.length != 0 && this.reasonGridOptions.api) {
                this.reasonGridOptions.api.forEachNode(function (node) {
                    if (node.childIndex === 0) {
                        node.setSelected(true);
                    }
                });
            }
            else {
                this.ruleGridOptions.api.setRowData([])
            }
        }
    }

    onSelectedReasonChanged(me: any = this) {


        //if (this.isFirstTimeLoad) {
        //    this.usergridOptions.api.selectIndex(0, true, false);
        //}
        //else {
        //    this.rolegridOptions.api.deselectAll();
        //}

        let data = this.reasonGridOptions.api.getSelectedRows()[0];
        this.CurrentReturnReason = this.reasonGridOptions.api.getSelectedRows()[0];
        this.AvailableRules = this.AllRuleCollection.filter(ur => ur.ReasonID == data.ReasonID).map(function (e) {
            e.isaccount = (me.typeId == "PTR004" || me.typeId == "PTR001");
            return e;
        })

        if (this.AvailableRules.length > 0) {
            this.ruleGridOptions.api.setRowData(this.AvailableRules);
            this.ruleGridOptions.api.forEachNode(function (node) {
                var item = me.ReasonRuleCollection.filter(d => d.RuleID == node.data.RuleID && d.ReasonID == node.data.ReasonID)[0];
                if (item != undefined) {
                    node.data.RuleValue = item.RuleValue;
                    node.data.isOverRidable = item.isOverRidable;
                    node.data.isMandatory = item.isMandatory;
                    node.data.IsFixedRuleValue = item.IsFixedRuleValue;
                    node.data.RuleValueEffect = item.RuleValueEffect;
                    node.data.RuleValueEffectTO = item.RuleValueEffectTO;
                    node.data.UserInput = item.UserInput;
                    node.data.isActive = item.isActive;
                }
                else {
                    let newItem = {
                        ReasonID: node.data.ReasonID,
                        RuleID: node.data.RuleID,
                        RuleControlTypeID: node.data.RuleControlTypeID,
                        RuleValue: node.data.RuleValue,
                        isOverRidable: node.data.isOverRidable,
                        isMandatory: node.data.isMandatory,
                        IsFixedRuleValue: node.data.IsFixedRuleValue,
                        RuleValueEffect: node.data.RuleValueEffect,
                        RuleValueEffectTO: node.data.RuleValueEffectTO,
                        UserInput: node.data.UserInput,
                        isActive: node.data.isActive
                    };
                    me.ReasonRuleCollection.push(newItem);
                }

            })
            //this.ruleGridOptions.api.deselectAll();


            //this.selectedRules = this.ReasonRuleCollection;
            //var me = this;

            //this.ruleGridOptions.api.forEachNode(function (node) {
            //    var item = me.selectedRules.filter(d => d.RuleID == node.data.RuleID)[0];
            //    //if ($.inArray(node.data.RuleID, rules) > -1) {
            //    if (item != undefined) {
            //        node.data.RuleValue = item.RuleValue;
            //        node.setSelected(true);
            //    }
            //    else {
            //        node.setSelected(false);
            //    }
            //})
        }
        //var rules = this.ReasonRuleCollection.filter(ur => ur.ReasonID == data.ReasonID).map(function (e) {
        //    return e.RuleID;
        //})

    }

    openReturnReasonGridPopup() {
        this.ReturnReasonGridPopup = true;
        this.modalReturnReason.open();
    }

    //onRuleSelectionChanged(e) {

    //    var selectedRules = this.ruleGridOptions.api.getSelectedRows();
    //    var selectedReason = this.reasonGridOptions.api.getSelectedRows()[0];

    //    var selectedRuleIds = [];
    //    var dselectedNodes = [];

    //    if (selectedReason != undefined && selectedRules.length != 0) {

    //        for (let row of selectedRules) {
    //            if (row != undefined) {
    //                //var currRule = this.AvailableRules.filter(r => r.RuleID == row.RuleID)[0];
    //                var itemtoMove = this.ReasonRuleCollection.filter(d => d.RuleID == row.RuleID && d.ReasonID == selectedReason.ReasonID)[0];
    //                var ind = this.ReasonRuleCollection.map(function (e) { return e; }).indexOf(itemtoMove);

    //                if (itemtoMove == undefined) {
    //                    //PRRR.PartnerReturnReasonRuleMapID, PRRR.PartnerReturnReasonMapID, currRule.ReturnReasonRuleMapID, RRR.RMAActionCodeID as ReasonID, RRR.RuleID, PRRR.RuleValue
    //                    let newItem = { ReasonID: selectedReason.ReasonID, RuleID: row.RuleID, RuleValue: row.RuleValue };
    //                    //let newItem = { PartnerReturnReasonMapID: selectedReason.ReasonID, RuleID: row.RuleID };
    //                    this.ReasonRuleCollection.push(newItem);
    //                    //this.UserRoleCollection.splice(ind, 1);
    //                }
    //                else {
    //                    itemtoMove.RuleValue = row.RuleValue;
    //                }
    //                selectedRuleIds.push(row.RuleID);
    //            }
    //        }

    //        this.ruleGridOptions.api.forEachNode(function (node) {
    //            if ($.inArray(node.data.RuleID, selectedRuleIds) == -1) {
    //                let newItem = { ReasonID: selectedReason.ReasonID, RuleID: node.data.RuleID, RuleValue: node.data.RuleValue };
    //                dselectedNodes.push(newItem);
    //            }

    //        })

    //        for (let n of dselectedNodes) {
    //            var itemtoMove = this.ReasonRuleCollection.filter(d => d.RuleID == n.RuleID && d.ReasonID == selectedReason.ReasonID)[0];
    //            var ind = this.ReasonRuleCollection.map(function (e) { return e; }).indexOf(itemtoMove);
    //            if (itemtoMove != undefined) {
    //                this.ReasonRuleCollection.splice(ind, 1);
    //            }
    //        }
    //    }
    //}

    initFacilities() {
        if (!this.FacilityMapLoaded) {
            this.partnerService.getPartnerFacilityMap(this.CurrentPartner.PartnerID).subscribe(
                _result => {
                    this.facilityMap = _result.recordsets[0];
                    this.availableFacilityList = _result.recordsets[1];
                    this.facilitygridOptions.api.setRowData(this.facilityMap);
                    this.FacilityMapLoaded = true;
                },
                error => this.errorMessage = <any>error);
        }
    }

    initHubPartners() {
        if (!this.HubMapLoaded) {
            this.partnerService.getHubsPartnersMap(this.CurrentPartner.PartnerID).subscribe(
                _result => {
                    this.HubPartnerMap = _result.recordsets[0];
                    this.availablePartnerForHubList = _result.recordsets[1];
                    this.hubPartnersgridOptions.api.setRowData(this.HubPartnerMap);
                    this.HubMapLoaded = true;
                },
                error => this.errorMessage = <any>error);
        }
    }

    onSelectedFacilityChanged() {
        this.selectedFacilityMap = this.facilitygridOptions.api.getSelectedRows();
    }


    onSelectedHubPartnerChanged() {
        this.selectedHubPartnerMap = this.hubPartnersgridOptions.api.getSelectedRows();
    }

    moveToMap() {
        this.moveList(this.FacilityModel, this.availableFacilityList, this.facilityMap);
        this.facilitygridOptions.api.setRowData(this.facilityMap);
        this.FacilityModel = [];
    }

    moveAllMap() {
        var fromCollection = $.grep(this.availableFacilityList, function (value) {
            return value;
        });
        this.moveList(fromCollection, this.availableFacilityList, this.facilityMap);
        this.facilitygridOptions.api.setRowData(this.facilityMap);
    }

    moveBack() {
        this.moveList(this.selectedFacilityMap, this.facilityMap, this.availableFacilityList);
        this.facilitygridOptions.api.setRowData(this.facilityMap);
        this.selectedFacilityMap = [];
    }

    moveAllBack() {
        var fromCollection = $.grep(this.facilityMap, function (value) {
            return value;
        });
        this.moveList(fromCollection, this.facilityMap, this.availableFacilityList);
        this.facilitygridOptions.api.setRowData(this.facilityMap);
    }

    moveList(ItemList, Source, Target) {
        for (let item of ItemList) {
            var ind = Source.map(function (e) { return e.FacilityCode; }).indexOf(item.FacilityCode);
            if (ind > -1) {
                Source.splice(ind, 1);
                Target.push(item);
            }
        }
    }

    moveToMapHubPartner() {
        this.moveList(this.HubPartnerModel, this.availablePartnerForHubList, this.HubPartnerMap);
        this.hubPartnersgridOptions.api.setRowData(this.HubPartnerMap);
        this.HubPartnerModel = [];
    }

    moveAllMapHubPartner() {
        var fromCollection = $.grep(this.availablePartnerForHubList, function (value) {
            return value;
        });
        this.moveList(fromCollection, this.availablePartnerForHubList, this.HubPartnerMap);
        this.hubPartnersgridOptions.api.setRowData(this.HubPartnerMap);
    }

    moveBackHubPartner() {
        this.moveList(this.selectedHubPartnerMap, this.HubPartnerMap, this.availablePartnerForHubList);
        this.hubPartnersgridOptions.api.setRowData(this.HubPartnerMap);
        this.selectedFacilityMap = [];
    }

    moveAllBackHubPartner() {
        var fromCollection = $.grep(this.HubPartnerMap, function (value) {
            return value;
        });
        this.moveList(fromCollection, this.HubPartnerMap, this.availablePartnerForHubList);
        this.hubPartnersgridOptions.api.setRowData(this.HubPartnerMap);
    }

    onchAccountFilterChanged() {
        if (this.filterchAccountVal === '') {
            this.filterchAccountVal = null;
        }
        this.gridChildAccountOptions.api.deselectAll();
        //this.CurrentChAccount = null;
        this.gridChildAccountOptions.api.setQuickFilter(this.filterchAccountVal);
    }
    AddChild() {
        var pid = this.CurrentPartner.PartnerID;
        var pname = this.CurrentPartner.ParentPartnerName;
        this.CurrentPartner = new Partner();
        this.CurrentPartner.PartnerParentID = pid;
        this.CurrentPartner.ParentPartnerName = pname;
        this.CurrentPartner.OrganisationTypeID = null;
        this.partnerId = 0;
        this.partnerInit();
    }
    EditChild() {
        this.partnerId = this.CurrentChAccount.PartnerID;
        this.partnerInit();
    }
    DeleteChild(me: any = this) {
        var partnerId = this.CurrentChAccount.PartnerID;

        if (partnerId != 0) {
            this._popup.Confirm('Delete', 'Are you sure you want to delete it? ', function () {
                me.partnerService.remove(partnerId)
                    .subscribe(
                    _partner => {
                        var result = JSON.parse(_partner._body);
                        if (result.data == "deleted") {
                            me._popup.Alert('Alert', 'Deleted successfully.');
                            me.partnerService.loadChilds('PTR004', me.loginPartnerID, me.partnerId).subscribe(result => {
                                var localize = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                                me.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                                var node_editor = localize.map(function (e) {
                                    return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                                });
                                me.e_localize = JSON.parse("{" + node_editor.join(',') + "}");

                                me.gridChildAccountOptions.api.setColumnDefs(me.h_localize);
                                me.gridChildAccountOptions.api.setRowData(result.recordsets[0]);
                            });
                        }
                        else {

                            me._popup.Alert('Alert', 'Cannot be deleted.It is being used in other modules.');
                        }

                    },
                    error => {
                        me.errorMessage = <any>error;
                        if (me.errorMessage.indexOf('The DELETE statement conflicted with the REFERENCE constraint') > -1) {
                            me.errorMessage = 'Could not remove ' + (this.partnerType == 'PTR001' ? 'Facility' : 'Account') + ', It has refrenced from other information.'
                        }
                        me._popup.Alert('Alert', 'Cannot be deleted.It is being used in other modules.');
                    });
            })
        }
    }
    onSelectedchAccountChanged() {
        this.CurrentChAccount = this.gridChildAccountOptions.api.getSelectedRows()[0];
    }
}
