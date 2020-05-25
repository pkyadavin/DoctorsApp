import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Validators } from '@angular/forms';
import { PartnerService } from './partner.service';
import { MetadataService } from '../MetadataConfig/metadata-config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/common.service';
import { PartnerProperties } from './partner.properties';
import { Address } from '../../shared/address.model';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { AuthService } from '../../authentication/Auth.service.js';
import { ContractTerms } from './contractterms.model';
import { Partner } from './partner.model';
import { AddressEditor } from '../../shared/address.component';
import { Util } from '../../app.util';
import { SidebarService } from '../sidebar/sidebar.service';
import { UserService } from '../user/User.Service';
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
@Component({
  selector: "Partner-Editor",
  templateUrl: './partnereditor.html'
})
export class PartnerEditor extends PartnerProperties {
  @Output() EditorVisibilityChange = new EventEmitter();
  CurrentAddress: Address = new Address();
  partner: Address = new Address();
  gridAddressHeader: any;
  ReturnReasonTypeList: any;
  deletedAddressID: number[] = [0];
  @Input('selectedId') partnerId: number;
  @Input() typeId: string = null;
  @Input() permission = false;
  CarrierListType = 'Account';
  LocalAddressAccess: string[] = ['Add'];
  LocalDestAddressAccess: string[] = ['Add'];
  LocalODPairAddressAccess: string[] = ['Add'];
  LocalLaneAddressAccess: string[] = ['Add'];
  isFirstTimeLoad = true;
  AddorgGridView = true;
  AddDesGridView = true;
  AddpartnerlaneView = true;
  IsReturnReasonShow = false;
  AddpartnerODView = true;
  UserGridPopup = false;
  AddUserPopup = false;
  ReturnReasonGridPopup = false;
  setUserGridType = 'popup';
  isSaveClick = false;
  returnUrl: any;
  PartnerLane: any;
  ODPair: any;
  AllAddressData: any;
  ContractTermData: ContractTerms = new ContractTerms(null);
  IsContractLoaded = false;
  AddressTypeID = 0;
  RepairNodeList: any;
  RepairLocationList: any;
  FacilityMapLoaded = false;
  HubMapLoaded = false;
  loginPartnerID: number;
  IsConsumerType = false;
  IsAccountTypeDisabled = false;
  filterchAccountVal: string = null;
  isEditUser = false;
  NULL: number = null;
  private _addrGridView: Boolean = true;
  get AddrGridView(): Boolean {
    return this._addrGridView;
  }
  set AddrGridView(gv: Boolean) {
    this._addrGridView = gv;
  }
  isaccount = false;
  countrycodes: any = [];
  CurrentReturnReason: any = null;
  CurrentChAccount: Partner;
  @ViewChild('PartnerAddress') _PartnerAddress: AddressEditor;
  SeasonalConfig: any = {
    id: 0,
    ReturnReason: '',
    Banner: '/assets/img/no-image.svg',
    Logo: '/assets/img/no-image.svg',
    toDate: '',
    fromDate: ''
  };
  configSetup: any;
  fromDate: string;
  toDate: string;
  minDate: Date;
  maxDate: Date;
  config: any;
  SponsCountryid = 0;
  currentDate: Date;
  dateFilter: any;
  faq_languageCode: string;
  brand_languages: any = [];
  mobNumberPattern:string;
  constructor(
    private loaderService: LoaderService,
    private _Util: Util,
    private _menu: SidebarService,
    private userService: UserService,
    private partnerService: PartnerService,
    private _router: Router,
    private activateRoute: ActivatedRoute,
    private _globalService: GlobalVariableService,
    private commonService$: CommonService,
    private metadataService$: MetadataService,
    private _LoginService: AuthService
  ) {
    super();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 60);
    this.maxDate.setDate(this.maxDate.getDate() + 60);
    this.SponsorshipCollection = [];
    var partnerinfo = _globalService.getItem('partnerinfo');
    this.loginPartnerID = partnerinfo[0].LogInUserPartnerID;

    this.moduleTitle = this._menu.menus.filter(
      f => f.routeKey === this._router.url
    )[0].title;
    this.moduleDescription = _globalService.getModuleDescription(
      activateRoute.snapshot.parent.url[0].path
    );
    this.userService.loadCountries().subscribe(country => {
      this.countryList = country;
    });
  }

  ngOnInit() {
    this.partnerInit();
  }

  ChangeAccountType(selected) {
    if (selected) {
      if (this.CurrentPartner.OrgSubType.TypeCode == 'PTR004-04') {
        this.IsConsumerType = true;
      } else {
        this.IsConsumerType = false;
      }
    }
  }

  partnerInit() {
    this.IsLoaded = false;
    this.isaccount = false;
    if (this.typeId === 'PTR001') {
      this.returnUrl = ['partners/' + this.typeId];
      this.isaccount = true;
    }

    this.metadataService$.getTypeLookUpByGroupName(this.typeId).subscribe(
      _ConfigTypes => {
        if (_ConfigTypes.length > 0) {
          this.AllOrgSubTypes = _ConfigTypes.filter(m => m.IsActive == '1');
        }
        this.AllOrgSubTypes.unshift({
          TypeLookUpID: '0',
          TypeName: 'Select Type',
          TypeCode: this.typeId
        });
        if (!this.CurrentPartner.OrgSubType) {
          this.CurrentPartner.OrgSubType = this.AllOrgSubTypes[0];
        }
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });
    this.loaderService.display(true);
    this.partnerService.load(this.partnerId, this.typeId).subscribe(
      u => {
        this.loaderService.display(false);
        this.LocalAccess = JSON.parse(u.access_rights).map(function (e) {
          return e.FunctionType;
        });
        if (this.partnerId !== 0) {
          this.CurrentPartner.PartnerID = this.partnerId;
          this.CurrentPartner.PartnerCode = u.recordsets[0][0].PartnerCode;
          this.faq_languageCode = u.recordsets[0][0].FAQ_Language;
          this.SponsorshipCollection = JSON.parse(
            u.recordsets[0][0].sponsorship
          );
          if (this.SponsorshipGridOptions.api) {
            this.SponsorshipGridOptions.api.setRowData(
              this.SponsorshipCollection
            );
          }
          this.CurrentPartner.host = u.recordsets[0][0].host;
          this.CurrentPartner.portnumber = u.recordsets[0][0].portnumber;
          this.CurrentPartner.username = u.recordsets[0][0].username;
          this.CurrentPartner.pass = u.recordsets[0][0].pass;
          this.CurrentPartner.MercahntKey = u.recordsets[0][0].MercahntKey;
          this.CurrentPartner.MercahntPassword = u.recordsets[0][0].MercahntPassword;
          this.CurrentPartner.SSLValue = u.recordsets[0][0].SSLValue;
          this.CurrentPartner.AirportID = u.recordsets[0][0].AirportID;
          this.CurrentPartner.PartnerName = u.recordsets[0][0].PartnerName;
          this.CurrentPartner.PartnerCode = u.recordsets[0][0].PartnerCode;
          this.CurrentPartner.ContactName = u.recordsets[0][0].ContactName;
          this.CurrentPartner.TeleCode = u.recordsets[0][0].TeleCode;
          this.CurrentPartner.ContactNumber = u.recordsets[0][0].ContactNumber;
          this.CurrentPartner.Email = u.recordsets[0][0].Email;
          this.CurrentPartner.PartnerParentID =
            u.recordsets[0][0].PartnerParentID;
          this.CurrentPartner.ParentPartnerName =
            u.recordsets[0][0].ParentPartnerName;
          this.CurrentPartner.ParentFacilityID =
            u.recordsets[0][0].ParentFacilityID;
          this.CurrentPartner.ParentFacilityName =
            u.recordsets[0][0].ParentFacilityName;
          this.CurrentPartner.OrganisationTypeID =
            u.recordsets[0][0].OrganisationTypeID;
          this.CurrentPartner.IsActive = u.recordsets[0][0].IsActive;
          this.CurrentPartner.OrgSubType =
            u.recordsets[0][0].OrgSubType &&
            JSON.parse(u.recordsets[0][0].OrgSubType)[0];
          this.IsAccountTypeDisabled = true;
          if (
            this.CurrentPartner.OrgSubType != null &&
            this.CurrentPartner.OrgSubType.TypeCode === 'PTR004-04'
          ) {
            this.IsConsumerType = true;
          } else {
            this.IsConsumerType = false;
          }

          if (
            this.typeId === 'PTR004' &&
            this.partnerId !== 0 &&
            !this.CurrentPartner.PartnerParentID
          ) {
            var partnerinfo = this._globalService.getItem('partnerinfo');
            this.partnerService
              .loadChilds(
                this.typeId,
                partnerinfo[0].LogInUserPartnerID,
                this.partnerId
              )
              .subscribe(result => {
                var localize = JSON.parse(
                  result.recordsets[1][0].ColumnDefinitions
                );
                this.h_localize = $.grep(localize, function (n, i) {
                  return n.ShowinGrid === true;
                });
                let node_editor = localize.map(function (e) {
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
                this.e_localize = JSON.parse('{' + node_editor.join(',') + '}');
                if (this.CurrentPartner.PartnerParentID) {
                  this.gridChildAccountOptions.api.setColumnDefs(
                    this.h_localize
                  );
                  this.gridChildAccountOptions.api.setRowData(
                    result.recordsets[0]
                  );
                }
              });
          }

        } else {
          this.CurrentPartner.PartnerID = 0;
          this.CurrentPartner.PartnerName = '';
          this.CurrentPartner.PartnerCode = 'Auto';
          this.CurrentPartner.IsActive = true;
          this.IsAccountTypeDisabled = false;
          this.CurrentPartner.OrganisationTypeID = null;
        }
        this.countrycodes = u.recordsets[2];
        var localize = JSON.parse(u.recordsets[1][0].ColumnDefinitions);
        var node_editor = localize.map(function (e) {
          return (
            '"' +
            e.field +
            '": { "headerName": "' +
            e.headerName +
            '","DisplayName": "' +
            e.headerName +
            '","isRequired": ' +
            e.isRequired +
            ', "isVisible": ' +
            e.isVisible +
            ', "isEnabled": ' +
            e.isEnabled +
            ' }'
          );
        });
        this.e_localize = JSON.parse('{' + node_editor.join(',') + '}');
        // ----------------------------------------------------------------------------------------
        this.IsLoaded = true;
        var me: any = this;
        setTimeout(() => {
          $('#mobile-number').intlTelInput();
          if (me.CurrentPartner.TeleCode != null) {
            $('.country').each(function () {
              if (
                me.CurrentPartner.TeleCode.trim() ===
                $(this).attr('data-dial-code')
              ) {
                $(this).click();
              }
            });
          }
        });
        if (this.typeId !== 'PTR005') {
          if (
            this.CurrentPartner.OrgSubType != null &&
            this.CurrentPartner.OrgSubType.TypeCode !== 'PTR004-04'
          ) {
            this.PartnerAddressList = u.recordsets[3];
            if (this.PartnerAddressList.length > 0) {
              this.CurrentAddress = new Address(this.PartnerAddressList[0]);
              this.CurrentAddress.PostType = 'update';
            } else {
              this.CurrentAddress = new Address();
              this.CurrentAddress.PostType = 'insert';
            }
          }
        }
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });

    if (this.typeId === 'PTR001') {
      this.commonService$.loadUsers().subscribe(
        _users => {
          this.AllUserCollection = _users;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });

      this.commonService$.loadRoles(this.typeId).subscribe(
        _roles => {
          this.AllRoleCollection = _roles;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
    }

  }

  notifyParent() {
    this.ruleGridOptions.api.refreshView();
  }

  CheckPhoneVal() {
    var contactnumber = $('#ContactNumber').val();
    this.CurrentPartner = contactnumber({
      phone: ['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
    });
  }

  onSubmit(form: any) {
    this.loaderService.display(true);
    if (
      this.CurrentPartner.OrgSubType !== null &&
      this.CurrentPartner.OrgSubType.TypeLookUpID === 0
    ) {
      if (this.IsLoaded && this.e_localize.TypeName.isVisible) {
          this._Util.error('Facility type is required.', 'Alert');
        return;
      }
    }

    if (!form.valid) {
      for (var i in form.controls) {
        form.controls[i].markAsTouched();
      //  console.log(form.controls[i].error);
      }
      form.valueChanges.subscribe(data => {
        this.isSaveClick = !form.valid;
      });
      this.isSaveClick = true;
      this._Util.warning(
        'Please fill all the required information with correct format .',
        'warning'
      );
      this.loaderService.display(false);
      return;
    }

    if (this.typeId !== 'PTR005') {
      if (
        this.e_localize.Email.isRequired &&
        !this.ValidateEmail(this.CurrentPartner.Email)
      ) {
        this._Util.warning('Please provide a valid email.', 'warning');
        return;
      }
      this._PartnerAddress.onSave(null);
    } else { this.AddressEvent(null); }
    this.loaderService.display(false);
  }

  ValidateEmail(emailvalue) {
    var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(emailvalue)) {
      return false;
    } else {
      return true;
    }
  }

  CancelPartner() {
    if (
      !this.CurrentPartner.PartnerParentID ||
      this.CurrentPartner.PartnerParentID === 0
    ) {
      this.EditorVisibilityChange.emit(false);
    } else {
      this.partnerId = this.CurrentPartner.PartnerParentID;
      this.partnerInit();
    }
  }

  AddressEvent(event) {
    this.addressccolumnDefs = this.gridAddressHeader;
    var IsValidRuleConfigration = true;
    if (this.typeId !== 'PTR005') {
      if (event.PostType === 'insert') {
        this.PartnerAddressList.push({
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
      if (event.PostType === 'update') {
        var _tempAddress = this.PartnerAddressList.find(
          x => x.RowNumber === event.RowNumber
        );
        _tempAddress.Address1 = event.Address1;
        _tempAddress.Address2 = event.Address2;
        _tempAddress.AddressID = event.AddressID;
        _tempAddress.AddressTypeID = event.AddressTypeID;
        _tempAddress.City = event.City;
        _tempAddress.Description = event.Description;
        _tempAddress.PartnerAddressMapID = event.PartnerAddressMapID;
        (_tempAddress.PartnerID = this.CurrentPartner.PartnerID),
          (_tempAddress.RowNumber = event.RowNumber);
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

      this.LocalAddressAccess = ['Add'];
      if (
        this.CurrentPartner.OrgSubType != null &&
        this.CurrentPartner.OrgSubType.TypeCode != 'PTR004-04'
      ) {
        if (!this.PartnerAddressList || this.PartnerAddressList.length == 0) {
          this._Util.error('Atleast one address is required.', 'Alert');
          return;
        }
      }

      if (this.CurrentPartner.AirportID == undefined)
        this.CurrentPartner.AirportID = 0;
      if (this.CurrentPartner.OrganisationTypeID == undefined)
        this.CurrentPartner.OrganisationTypeID = 0;
      if (
        this.CurrentPartner.OrgSubType != null &&
        this.CurrentPartner.OrgSubType.TypeCode != 'PTR004-04'
      ) {
        var telecode = $('#mobile-number').val();
        telecode = telecode.replace('+', '');
        this.CurrentPartner.TeleCode = telecode.trim();
      } else {
        this.CurrentPartner.TeleCode = '';
        this.CurrentPartner.PartnerParentID = null;
      }
    }

    var UserIds = $.map(this.UserRoleCollection, function (n, i) {
      return n.UserID;
    });

    if (UserIds.length <= 0) {
      var flag = false;
      $.each(this.AvailableUsers, function (key, val) {
        if ($.inArray(val.UserID, UserIds) == -1) {
          flag = true;
          return false;
        }
      });
      if (flag) {
        this._Util.error('Atleast one Role is required.', 'Alert');
        return;
      }
    }

    if (this.typeId === 'PTR001') {
      this.CurrentPartner.UserRoles = this.UserRoleCollection;
      this.CurrentPartner.Users = this.AvailableUsers;
    }

    if (!IsValidRuleConfigration) {
      this._Util.error(
        'Alert',
        'Please fill all the active rule configuration.'
      );
      this.loaderService.display(false);
      return;
    }

    this.reg = [{ Partner: JSON.stringify(this.CurrentPartner) }];

    this.partnerService.save(this.reg, this.typeId).subscribe(
      retvalue => {
        var me = this;
        var outputId = retvalue.PartnerID;
        this.errorMessage = '';
        var errMsg = '';
        var flag = 0;
        var caption = '';
        if (this.typeId === 'PTR002') {
          caption = 'Vendor';
        } else if (this.typeId === 'PTR001') {
          caption = 'Configuration'; }

        if (retvalue.result === 'Updated') {
          this.updatePartnerAddress(outputId);
          errMsg = caption + ' saved successfully.';
          flag++;
        } else if (retvalue.result === 'Added') {
          this.updatePartnerAddress(outputId);
          errMsg = caption + ' added successfully.';
          flag++;
        } else if (retvalue.result === 'Duplicated') {
          errMsg =
            'Same ' +
            caption +
            ' Name exists. Please enter another ' +
            caption +
            ' Name.';
          flag = 0;
        } else if (retvalue.result === 'UserExceed') {
          errMsg =
            'Your add user limit is exceed. Please contact rl3demo@reverselogix.com to upgrade user license.';
          flag = 0;
        } else if (retvalue.result === 'DuplicatedUser') {
          errMsg = 'Same user Name or email already exists.';
          flag = 0;
        } else if (retvalue.result === 'UserNotDelete') {
          errMsg = 'User cannot be deleted.It is being used in other modules.';
          flag = 0;
        } else if (retvalue.result === 'Mapped') {
          errMsg =
            'Same ' +
            caption +
            ' already mapped in other module. Cannot be deactivated.';
          flag = 0;
        } else {
          errMsg =
            'System error generated at this moment. Please contact system administrator.';
          flag = 0;
        }
        if (flag > 0) {
          this._Util.success(errMsg, 'success');
          me.EditorVisibilityChange.emit(true);
        } else {
          this._Util.error(errMsg, 'error');
        }
        return;
      },
      error => {
        this.loaderService.display(false);
        this.errorMessage = <any>error;
      });
  }

  updatePartnerAddress(outputId) {
    this.partnerService
      .updatePartnerAddress(
        this.PartnerAddressList,
        this.deletedAddressID,
        outputId
      )
      .subscribe(
        _result => {
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = <any>error;
        });
  }

}
