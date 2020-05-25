import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Tenantrawdata, workflow, globalconfigrations, node, partner, facilities, orderselection, itemtype, specialidentifer, tenantdata, registrationsteps, country, state, registrationfulldata, adminconfigsetup, currency, timezone, language } from './lead.model';
import { Property } from '../app.util';
import { LeadService } from './lead.service';
import { Util } from '../app.util'
import { message } from '../controls/pop/index.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;

@Component({
  selector: 'app-leads',
  providers: [LeadService],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent extends Property implements OnInit {
  features: any;
  selectedFeatures:any;
  CurrentRegistrationFullData: registrationfulldata = new registrationfulldata();
  CurrentRegistrationSteps: registrationsteps = new registrationsteps();
  CurrentTenantdata: Tenantrawdata = new Tenantrawdata();
  countrydata: any = {};
  IsConsumerSupportSelected: boolean = false;
  IsBusinessSupportSelected: boolean = false;
  IsDomainValid = false;
  IsCDomainValid = false;
  DomainLists1: any = [];
  DomainLists: any = [];
  IsCompanyValid = false;
  CapchaText: string;
  countries: any;
  currencies: any;
  states: any;
  @Input() tid: number = 0;
  txtCapcha = "";
  TermsAndConditions: any;
  NoOfUsers: any;
  NoOfYear: any;

  constructor(private _util: Util, private tenantAdminService: LeadService, private _router: Router, private _Util: Util, private ngxService: NgxUiLoaderService) {
    super();
  }

  @ViewChild('pop') _popup: message;

  ngOnInit() {
    this.GetFeatures();
    this.GetCountry();
    this.generateCapchaText();
    this.FillNoOfUsers();
    this.FillNoOfYear();
    this.TermsAndConditions = []; 
  }
  goToProfile(){}
  FillNoOfUsers() {
    this.ngxService.start();
    this.tenantAdminService.getTypeLookUpByName("TenantUser").subscribe(returnvalue => {
      this.NoOfUsers = returnvalue.recordsets[0];
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();

    });
  }
  FillNoOfYear() {
    this.ngxService.start();
    this.tenantAdminService.getTypeLookUpByName("TenantYear").subscribe(returnvalue => {
      this.NoOfYear = returnvalue.recordsets[0];
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();

    });
  }

  GetCountry() {
    this.ngxService.start();
    this.tenantAdminService.GetAdminCountryList().
      subscribe(
        Controls => {
          this.countries = Controls;
          let data = Controls.slice(0);
          this.FillCurrencies(data);
          this.ngxService.stop();
        },
        Error => this.errorMessage = <any>Error
      );
  }
  FillCurrencies(data) {
    this.currencies = this.sortJSON(data, 'CurrencyCode', '123');
  }
  sortJSON(data, key, way) {
    return data.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      if (way === '123') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
      if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
  }

  GetState(countryName) {

    var country = $.grep(this.countries, function (n, i) { return n.CountryName == countryName; });//this.countries.filter(function (obj) { return obj.CountryName == countryName; });
    if (country != undefined && country.length > 0) {
      this.ngxService.start();
      this.tenantAdminService.GetAdminStateListByCountryID(country[0].CountryID).
        subscribe(
          Controls => {
            var data = Controls;
            this.states = this.sortJSON(data, 'StateName', '123');
            this.ngxService.stop();
          },
          Error => this.errorMessage = <any>Error
        );
    }
    else
      this.states = [];
  }

  generateCapchaText() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    this.CapchaText = text;
  }

  refreshCapcha() {
    this.generateCapchaText();
  }

  GetFeatures(me: any = this) {
    this.ngxService.start();
    this.tenantAdminService.GetFeaturesList().
      subscribe(
        Controls => {
          this.features = Controls.recordsets[0];
          this.ngxService.stop();
        },
        Error => this.errorMessage = <any>Error
      );
  }

  checkemail() {    
    this.IsEmailExists(this.CurrentTenantdata.email);
  }

  ValidateEmail(emailvalue) {
    var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(emailvalue)) {
      return false;
    }
    else {
      return true;
    }
  }

  checkpasswordvalidation(val) {
    var returnval = true;
    var password = val;
    var min6Char = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/);

    if (min6Char == null) {
      returnval = false;
    }

    var hasNumber = password.match(/\d+/);

    if (hasNumber == null) {
      returnval = false;
    }

    var hasUpper = password.match(/[A-Z]+/);

    if (hasUpper == null) {
      returnval = false;
    }

    var hasLower = password.match(/[a-z]+/);

    if (hasLower == null) {
      returnval = false;
    }

    var Special = password.match(/[@!#\$\^%*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\?]+/);

    if (Special == null) {
      returnval = false;
    }

    return returnval;
  }

  IsEmailExists(emailvalue) {
    this.ngxService.start();
    this.tenantAdminService.ValidateEmail(emailvalue).subscribe(
      Controls => {        
        if (Controls.length > 0) {
          if (Controls[0].emailid.toString().toLowerCase().trim() == emailvalue.toString().toLowerCase().trim()) {
            this.CurrentTenantdata.email = null;
            this._Util.warning("User ID(Email) is already in use.", "");
          }
        }
        this.ngxService.stop();
      },
      Error => { this.errorMessage = <any>Error; return false; }
    );
  }  

  CheckDomaIfExists() {
    var domain = this.CurrentTenantdata.domainname.toLowerCase();
    var hasUpper = domain.match(/[ ~_&@!#\$\^%*()+=\-\[\]\\\`';,\.\/\{\}\|\":<>\?]+/);
    if (hasUpper != null) {
      this._Util.error('Your preferred domain is required', '');
      this.IsDomainValid = false;
      this.CurrentTenantdata.domainname = "";
      $("#domain").val('');
      return false;
    }
    if (typeof domain !== 'undefined' && domain != "" && domain.length > 2) {
      this.ngxService.start();
      this.tenantAdminService.GetDomainsList().subscribe(Controls => {
        this.ngxService.stop();
        this.DomainLists = Controls;

        var IsExist = this.DomainLists.filter(m => m.Domain.toLowerCase() == this.CurrentTenantdata.domainname.toLowerCase() || m.CPDomain.toLowerCase() == this.CurrentTenantdata.domainname.toLowerCase());

        if (IsExist.length === 0) {
          if (this.CurrentTenantdata.domainname.toLowerCase() == this.CurrentTenantdata.consumerdomain.toLowerCase()) {
            this._Util.warning('Your preferred domain name is already in use. Please re-enter a new preference.', '');
            this.IsDomainValid = false;
          }
          else {
            this.IsDomainValid = true;
          }
        }
        else {
          this._Util.warning('Your preferred domain name is already in use. Please re-enter a new preference.', '');
          this.IsDomainValid = false;
          $("#domain").val('');
        }
      },
        Error => this.errorMessage = <any>Error
      );
    }
    else {
      this.IsDomainValid = false;
    }
    if (this.CurrentTenantdata.domainname == "") {
      this.IsDomainValid = false;
    }

  };

  CheckCDomaIfExists() {
    var domain = this.CurrentTenantdata.consumerdomain.toLowerCase();//this.Domain;
    var hasUpper = domain.match(/[ ~_&@!#\$\^%*()+=\-\[\]\\\`';,\.\/\{\}\|\":<>\?]+/);
    if (hasUpper != null) {
      this._Util.error('Your preferred domain for Consumer Portal is required.', '');
      this.IsCDomainValid = false;
      this.CurrentTenantdata.consumerdomain = "";
      $("#Cdomain").val('');
      return false;
    }
    if (typeof domain !== 'undefined' && domain != "" && domain.length > 2) {
      $('#CDomaini').removeClass("fa-thumbs-up");
      $('#CDomaini').addClass("fa-spinner fa-pulse");

      this.ngxService.start();
      this.tenantAdminService.GetDomainsList().subscribe(Controls => {
        this.ngxService.stop();
        this.DomainLists1 = Controls;

        var IsExist1 = this.DomainLists1.filter(m => m.Domain.toLowerCase() == this.CurrentTenantdata.consumerdomain.toLowerCase() || m.CPDomain.toLowerCase() == this.CurrentTenantdata.consumerdomain.toLowerCase());

        if (IsExist1.length === 0) {
          if (this.CurrentTenantdata.consumerdomain.toLowerCase() == this.CurrentTenantdata.domainname.toLowerCase()) {
            this._Util.warning('Your preferred Consumer Portal domain name is already in use. Please re-enter a new preference.', '');
            this.IsCDomainValid = false;
          }
          else {
            this.IsCDomainValid = true;
          }
        }
        else {
          this._Util.warning('Your preferred Consumer Portal domain name is already in use. Please re-enter a new preference.', '');
          this.IsCDomainValid = false;
        }
      },
        Error => this.errorMessage = <any>Error
      );
    }
    else {
      this.IsCDomainValid = false;
    }

    if (this.CurrentTenantdata.consumerdomain == "") {
      this.IsCDomainValid = false;
    }
  };
  CheckCompanyIfExists() {

    if (typeof this.CurrentTenantdata.companyname !== 'undefined' && this.CurrentTenantdata.companyname != "") {
      var data = {
        companyname: this.CurrentTenantdata.companyname
      }
      this.ngxService.start();
      this.tenantAdminService.IsCompanyExists(data).subscribe(returnvalue => {
        this.ngxService.stop();
        if (returnvalue.data[0][0].status == "1") {
          this.IsCompanyValid = true;
        }
        else {
          this.IsCompanyValid = false;
          this._Util.warning('Company name is already in use. Companies with multi-Country presence may register multiple domains with Country specific extensions. [e.g. ABC-USA, ABC-France etc.]', '');
          $("#companyname").val('');
          this.CurrentTenantdata.companyname = "";
        }
      }, error => {
      });
    }

  };
  selectCountryDDL(id) {
    var me: any = this;

    if ($("#ddlcontrol").val() != "") {
      me.countrydata = me.countries.filter(u => u.CountryID == $("#ddlcontrol").val())[0];
      me.GetState(me.countrydata.CountryName);
    }
    else {
      me.countrydata = {};
    }
  }
  selectStateDDL(id) {
    var me: any = this;
    me.statedata = me.states.filter(u => u.StateID == $("#ddlstate").val())[0];
  }
  PhoneValue() {
    var phonenumber = $('#Phone').val();
    this.CurrentTenantdata.phone = phonenumber;
  }
  selectedPlan(type) {
    this.CurrentTenantdata.claimtype = type;
  }

  tenantSignup(type, me: any = this) {
    this.CurrentTenantdata.country = this.countrydata.CountryName;
    if (typeof me.statedata !== 'undefined')
      this.CurrentTenantdata.state = me.statedata.StateName;
    else
      this.CurrentTenantdata.state = "";

    this.CurrentTenantdata.username = this.CurrentTenantdata.email;
    var phonenumber = $('#Phone').val();
    this.CurrentTenantdata.phone = phonenumber;

    this.CurrentTenantdata.cardexpiry = $('#cardexpiry').val();
    // var returntype = false;
    // var OrgInfo = "";
    if (this.tid == 0) {

      this.CurrentTenantdata.validfrom = this.getlocalmachindatetimeMMDDYYY();
      this.CurrentTenantdata.validto = this.getlocalmachindatetimeplusoneMonth();
      if (this.CurrentTenantdata.claimtype == 'pro') {
        this.CurrentTenantdata.validto = this.getlocalmachindatetimeplusoneMonthForPaid();
      }
    }

    var featuresList = "";
    var featuresCode = "";
    $.each(this.features, function (i, v) {
      if (v.IsSelected) {
        featuresList += v.ProductFeatureID + ",";
        featuresCode += v.FeatureCode + ",";
      }
    });
    if (featuresList.length > 0)
      featuresList = featuresList.substr(0, featuresList.length - 1);

    var isFormValidated1 = true;
    isFormValidated1 = this.checkTenantValidation(type, featuresList, featuresCode);

    if (!isFormValidated1) {      
      return false;
    }

    this.CurrentTenantdata.features = featuresList;

    if (type == 'PRO' || type == 'Trial' || type == 'GOTOPRO') {
      if (this.txtCapcha === 'undefined' || this.txtCapcha == "") {
        this._Util.error("Captcha is required.", "");
        return;
      }
      if (this.txtCapcha != this.CapchaText) {
        this._Util.error("Captcha text does not match.", "");
        return;
      }



      if(type=='Trial')
      {
        this.ngxService.start();  
        this.tenantAdminService.TermsAndConditions("TC001").subscribe(returnvalue => {
          this.ngxService.stop();  
          this.TermsAndConditions = returnvalue.data[0];
          this.goToReviewProfile();
        }, error => {
    
        });
      }
      else
      {
        this.ngxService.start();  
        this.tenantAdminService.TermsAndConditions("TC002").subscribe(returnvalue => {
          this.ngxService.stop();  
          this.TermsAndConditions = returnvalue.data[0];
          this.goToReviewProfile();
        }, error => {
    
        });
      }     

      return;
    }

    if (type == "1") {

      if (typeof this.CurrentRegistrationFullData.registrationsteps == 'object') {

        let DataToSubmit: FormData = new FormData();

        DataToSubmit.append('registrationsteps', JSON.stringify(this.CurrentRegistrationFullData.registrationsteps));
        DataToSubmit.append('IsApprove', "0");
        DataToSubmit.append('CurrencyID', this.CurrentTenantdata.currencyID.toString());
        DataToSubmit.append('IsHaveCallCenter', this.CurrentTenantdata.IsHaveCallCenter);
        DataToSubmit.append('TenantID', this.tid.toString());

        this.ngxService.start();        
        this.tenantAdminService.Save(DataToSubmit).subscribe(returnvalue => {
          
          this.ngxService.stop();
          if (returnvalue.data == "success") {                       
            //this.EnvPrepare(this.CurrentTenantdata.domainname,this.CurrentTenantdata.email,this.CurrentTenantdata.claimtype);                  
            this._router.navigate(['verifyaccount'], { queryParams: { email: this.CurrentTenantdata.email, type: this.CurrentTenantdata.claimtype } });
          } else {
            this._Util.error("Somthing is wrong on submit your request.", "");
          }

        }, error => {
          this._Util.error("Somthing is wrong on submit your request.", "");
        });
      }
      else {
        this._Util.error("Something is wrong with your provided information. Please contact ReverseLogix.", "");
      }
    }
    else {
      // var msg = 'Are you sure you want to Reject? This will void all info. entered by you.';
      // this._popup.Confirm('Alert', msg,
      //   function () {
      //     location.reload();
      //   });

      $("#reject-popup").modal('show');
    }
  }

  RejectTenantSignup(type)
  {
    $("#reject-popup").modal('hide');
    if(type=='yes')
    {
      location.reload();
    }
  }
  // EnvPrepare(domain, tenantEmail, subscriptiontype)
  // {    
  //   this.ngxService.start();
  //   this.tenantAdminService.EnvironmentPrepare(domain).subscribe(
  //     result => {            
  //         this.EnvInit(domain,tenantEmail,subscriptiontype);                
  //     }, error => {
  //       console.log(error);
  //         this.ngxService.stop();
  //         this._Util.error('An error occurred while processing your request',"error");
  //     });
  // }

  // EnvInit(domain, tenantEmail, subscriptiontype)
  // {
  //     this.tenantAdminService.EnvironmentInit(domain).subscribe(
  //     result => {            
  //       this._router.navigate(['verifyaccount'], { queryParams: { email: tenantEmail, type: subscriptiontype } });
  //     }, error => {
  //         this.ngxService.stop();
  //         console.log(error);
  //         this._Util.error('An error occurred while processing your request',"error");
  //     });
  // }

  getlocalmachindatetimeMMDDYYY() {
    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();

    var output =
      (('' + month).length < 2 ? '0' : '') + month + '/' +
      (('' + day).length < 2 ? '0' : '') + day + " " + (('' + hour).length < 2 ? '0' : '') + hour + ":" + (('' + minute).length < 2 ? '0' : '') + minute;
    output = output.substr(0, 5);
    output += '/' + d.getFullYear();

    return output;
  }
  getlocalmachindatetimeplusoneMonth() {
        
    var d = new Date();

    var month = d.getMonth() + 2;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();

    if(month==2 && day == 29)
    {
      month = 3;
      day = 1
    }
    else if(month==2 && day == 30)
    {
      month = 3;
      day = 2
    }
    else if(month==2 && day == 31)
    {
      month = 3;
      day = 3
    }

    var output =
      (('' + month).length < 2 ? '0' : '') + month + '/' +
      (('' + day).length < 2 ? '0' : '') + day + " " + (('' + hour).length < 2 ? '0' : '') + hour + ":" + (('' + minute).length < 2 ? '0' : '') + minute;
    output = output.substr(0, 5);
    output += '/' + d.getFullYear();

    return output;
  }
  getlocalmachindatetimeplusoneMonthForPaid() {

    var selectedYear = $('#ddlValidYear').val();
    var d = new Date();
    d.setDate(d.getDate() + (365 * selectedYear));

    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();

    var output =
      (('' + month).length < 2 ? '0' : '') + month + '/' +
      (('' + day).length < 2 ? '0' : '') + day + " " + (('' + hour).length < 2 ? '0' : '') + hour + ":" + (('' + minute).length < 2 ? '0' : '') + minute;
    output = output.substr(0, 5);
    output += '/' + d.getFullYear();

    return output;
  }
  checkTenantValidation(type, featuresList, featuresCode) {
    if (this.CurrentTenantdata.email === 'undefined' || this.CurrentTenantdata.email == "") {
      this._Util.error("Email Id is required.", "");
      return false;
    }
    if (!this.ValidateEmail(this.CurrentTenantdata.email)) {
      this._Util.error("Invalid Email Id.", "");
      return false;
    }
    if (this.CurrentTenantdata.password === 'undefined' || this.CurrentTenantdata.password == "") {
      this._Util.error("Password is required.", "");
      return false;
    }

    if (this.CurrentTenantdata.password != "" && !this.checkpasswordvalidation(this.CurrentTenantdata.password)) {
      this._Util.error('Password must be between 8 and 32 characters long and must contain at least 1 upper case letter, 1 lower case letter, 1 number and 1 special character.', '');
      return false;
    }
    
    if (this.CurrentTenantdata.confirmpassword === 'undefined' || this.CurrentTenantdata.confirmpassword == "" || this.CurrentTenantdata.confirmpassword == undefined) {
      this._Util.error("Confirm Password is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.confirmpassword != this.CurrentTenantdata.password) {
      this._Util.error("Confirm Password does not match.", "");
      return false;
    }
    if (this.CurrentTenantdata.companyname === 'undefined' || this.CurrentTenantdata.companyname == "") {
      this._Util.error("Company name is required.", "");
      return false;
    }

    if (this.CurrentTenantdata.domainname === 'undefined' || this.CurrentTenantdata.domainname == "") {
      this._Util.error("Domain is required.", "");
      return false;
    }
    if (this.IsDomainValid == false) {
      this._Util.error("Invalid domain name.", "");
      return false;
    }

    if (this.CurrentTenantdata.prefix === 'undefined' || this.CurrentTenantdata.prefix == "") {
      this._Util.error("Prefix is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.firstname === 'undefined' || this.CurrentTenantdata.firstname == "") {
      this._Util.error("First name is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.lastname === 'undefined' || this.CurrentTenantdata.lastname == "") {
      this._Util.error("Last name is required.", "");
      return false;
    }

    if (this.CurrentTenantdata.address1 === 'undefined' || this.CurrentTenantdata.address1 == "") {
      this._Util.error("Address Line 1 is required.", "");
      return false;
    }
    if (typeof this.CurrentTenantdata.country === 'undefined' || this.CurrentTenantdata.country == "") {
      this._Util.error("Home Country is required.", "");
      return false;
    }
    if (typeof this.CurrentTenantdata.state === 'undefined' || this.CurrentTenantdata.state == "") {
      this._Util.error("State is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.city === 'undefined' || this.CurrentTenantdata.city == "") {
      this._Util.error("City is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.zipcode === 'undefined' || this.CurrentTenantdata.zipcode == "") {
      this._Util.error("Zip Code is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.currency === 'undefined' || this.CurrentTenantdata.currency == "") {
      this._Util.error("Operating Currency is required.", "");
      return false;
    }
    if (this.CurrentTenantdata.phone === 'undefined' || this.CurrentTenantdata.phone == "" || this.CurrentTenantdata.phone.indexOf('_') >= 0) {
      this._Util.error("Mobile Number is required.", "");
      return false;
    }
    if (featuresList == "") {
      this._Util.error("Atleast one subscription type is required.", "");
      return;
    }

    // if (this.IsBusinessSupportSelected && featuresCode.indexOf("B2B") >= 0) {
    //   if (this.CurrentTenantdata.domainname === 'undefined' || this.CurrentTenantdata.domainname == "") {
    //     this._Util.error("Domain is required.", "");
    //     return false;
    //   }
    //   if (this.IsDomainValid == false) {
    //     debugger;
    //     this._Util.error("Invalid domain name.", "");
    //     return false;
    //   }
    // }
    // else
    //   this.CurrentTenantdata.domainname = "";

    // if (this.IsConsumerSupportSelected && featuresCode.indexOf("B2C") >= 0) {
    //   if (this.CurrentTenantdata.consumerdomain === 'undefined' || this.CurrentTenantdata.consumerdomain == "") {
    //     this._Util.error("Consumer Portal domain is required.", "");
    //     return;
    //   }
    //   if (this.CurrentTenantdata.domainname == this.CurrentTenantdata.consumerdomain) {
    //     this._Util.error("Domain and Consumer portal domain should not be same.", "");
    //     return;
    //   }
    // }
    // else
    //   this.CurrentTenantdata.consumerdomain = "";

    if (this.CurrentTenantdata.claimtype == 'pro') {
      this.CurrentTenantdata.noofusers = $('#ddlNumber').val();
    }
    else {
      this.CurrentTenantdata.noofusers = "5";
    }

    this.CurrentRegistrationSteps.tenantdata = new tenantdata(this.CurrentTenantdata);
    this.CurrentRegistrationFullData.registrationsteps = this.CurrentRegistrationSteps;

    return true;
  }

  goToReviewProfile() {    
    $("#divprofileconfirmation").css("display", "block");
    $("#registration-form").css("display", "none");
    $("#headingText").css("display", "none");
    $("#payment-form").css("display", "none");
    $("#divtermsandconditions").css("display", "none");
    if (this.CurrentTenantdata.claimtype == 'Trial') {
      $("#divTrialUser").css("display", "block");
      $("#divPaidUser").css("display", "none");
      $("#divPaidYear").css("display", "none");
    }
    else {
      $("#divTrialUser").css("display", "none");
      $("#divPaidUser").css("display", "block");
      $("#divPaidYear").css("display", "block");
    }    
    // $.mPageScroll2id("scrollTo", "pageContainer");  
  }

  gotoEditProfile() {
    $("#divprofileconfirmation").css("display", "none");
    $("#registration-form").css("display", "block");
    $("#headingText").css("display", "block");
    $("#payment-form").css("display", "none");
    $("#divtermsandconditions").css("display", "none");
    // $.mPageScroll2id("scrollTo", "pageContainer");
  }

  goToTermsView() {
    $("#divprofileconfirmation").css("display", "none");
    $("#registration-form").css("display", "none");
    $("#headingText").css("display", "none");
    $("#payment-form").css("display", "none");
    $("#divtermsandconditions").css("display", "block");
    // $.mPageScroll2id("scrollTo", "pageContainer");

    window.scroll(0,0);
  }

  proceedToTerms() {
    this.goToTermsView();
  }

  removeSelectedModules(id) {
    var me: any = this;
    $.each(me.features, function (i, v) {
      if (v.ProductFeatureID == id) {
        v.IsSelected = false;
      }
    });
    me.selectedFeatures = [];
    $.each(me.features, function (i, v) {
      if (v.ProductFeatureID == id && !v.IsSelected) {
        me.selectedFeatures.push(v);
        this._util.error('At least one order is required.', "Alert", null);
      }
    });
  }
  selectModules(item) {
    var me: any = this;
    $.each(me.features, function (i, v) {
      if (item.ProductFeatureID == v.ProductFeatureID) {

        if(v.FeatureCode != "B2BReturn")
        return;

        if (item.IsSelected)
          v.IsSelected = false;
        else
          v.IsSelected = true;

        if (v.IsSelected) {
          if (v.FeatureCode == "B2CReturn")
            me.IsConsumerSupportSelected = true;
          else if (v.FeatureCode == "B2BReturn")
            me.IsBusinessSupportSelected = true;
          
        }
        else {
          if (v.FeatureCode == "B2CReturn")
            me.IsConsumerSupportSelected = false;
          else if (v.FeatureCode == "B2BReturn")
            me.IsBusinessSupportSelected = false;
        }
      }
    });
    me.selectedFeatures = [];
    $.each(me.features, function (i, v) {
      if (v.IsSelected)
        me.selectedFeatures.push(v);
    });
  }

}
