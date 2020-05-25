import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LeadService } from '../../leads/lead.service';
import { Observable } from 'rxjs/RX';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { message, modal } from '../../controls/pop/index.js';
import { FTPDetails, Tenantrawdata, workflow, globalconfigrations, node, partner, facilities, orderselection, itemtype, specialidentifer, tenantdata, registrationsteps, country, state, registrationfulldata, adminconfigsetup, currency, timezone, language } from '../../leads/lead.model';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Property, Util } from '../../app.util';
import { Tenant } from './tenant.model';
import { TenantService } from './tenant.service';

declare var $: any;

@Component({
    selector: 'tenant-view',
    providers: [TenantService, LeadService],
    templateUrl: './detail.template.html'
})

export class TenantViewComponent extends Property {
    IsPaymentSelected: boolean = false; 
    IsOnLine: string = "";   
    features: any;
    selectedFeatures: Array<any> = new Array<any>();
    CurrentTenant: Tenant;
    CurrentTenantdata: Tenantrawdata = new Tenantrawdata();

    @Input() tenantFTP: FTPDetails;    
    @Input('OrderStatus') OrderStatus: string; 
    //@Input('IsActivated') IsActivated: string; 
    @Output() tenantFTPChange: EventEmitter<FTPDetails> = new EventEmitter<FTPDetails>();
    //@Output() PaymentReceive = new EventEmitter();
    @Output() tenantDataChange= new EventEmitter();
        
    regSteps: any;
    countries: any;
    statedata: any = {};
    states: any;
    @Input('tid') tid: number = 0;
    countrydata: any = {};
    validfrom: Date;

    constructor(private util: Util,  private _ActRoute: ActivatedRoute, private tenantAdminService: LeadService, private $AdminService: TenantService, private _router: Router) {
        super();
        
    }
    ngOnInit() {        

        this.tenantAdminService.GetTenantByID(this.tid).subscribe(_data => {
            this.CurrentTenant = new Tenant(_data[0]);
            
            if (_data[0].IsInvoiceGeneration)
                this.IsPaymentSelected = true;
            else
                this.IsPaymentSelected = false;   

            if (this.CurrentTenant.Status)
                this.IsOnLine = this.CurrentTenant.Status;                     

            var me: any = this;
            if (_data[0].FeatureIDs) {
                $.each(_data[0].FeatureIDs.split(","), function (i, v) {
                    me.selectedFeatures.push(v);
                });
            }
 
            var jsondata = _data[0]['jsondata'];
            this.regSteps = JSON.parse(jsondata);
            this.tenantFTP = new FTPDetails(_data[0]['tenantFTP']);

            this.CurrentTenantdata = new Tenantrawdata(this.regSteps.tenantdata);  
            this.CurrentTenantdata.IsUserActivated = _data[0].IsActivated;        
            //this.validfrom = new Date('03/15/2018');

            this.tenantAdminService.GetFeaturesList(this.tid).
                subscribe(
                Controls => {
                    this.features = Controls.recordsets[0];
                    
                    $.each(me.selectedFeatures, function (i, v) {
                        $.each(me.features, function (i, v1) {
                           if( v == v1.ProductFeatureID){
                            me.features[i].IsSelected = 1;
                           }
                        });
                    });
                },
                Error => this.errorMessage = <any>Error
                );
            this.bindCountry();

            // this.SetfoucsOnLoad();
            //$('#chkUpdate').prop('checked', false);
            //this.tenantFTP.UpdateToCustomer = false;            
            this.tenantDataChange.emit(this.CurrentTenantdata);
            this.tenantFTPChange.emit(this.tenantFTP);
            
        })
        var sdfds = this.OrderStatus;
    }

    GetCurrentDate() {
        var date = new Date();

        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();

        return (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + '-' + y;
    }

    SetfoucsOnLoad() {
        $("#companyname").focus();
        $("#firstname").focus();
        $("#lastname").focus();
        $("#email").focus();
        $("#address1").focus();
        $("#city").focus();
        $("#zipcode").focus();
        $("#Phone").focus();
    }

    selectModules(item) {
        // var selected = [];
        var me: any = this;

        $.each(me.features, function (i, v) {
            if (item.ProductFeatureID == v.ProductFeatureID) {
                if (item.IsSelected)
                    v.IsSelected = false;
                else
                    v.IsSelected = true;

                //if (v.IsSelected) {
                //    if (v.FeatureCode == "FC00015")
                //        me.IsConsumerSupportSelected = true;

                //    // me.selectedFeatures.push(v);
                //}
                //else {
                //    if (v.FeatureCode == "FC00015")
                //        me.IsConsumerSupportSelected = false;
                //}
            }
        });

        var productFeatureId = "";
        me.selectedFeatures = [];
        $.each(me.features, function (i, v) {
            if (v.IsSelected) {
                me.selectedFeatures.push(v);
                if (productFeatureId == "")
                    productFeatureId = v.ProductFeatureID;
                else
                    productFeatureId = productFeatureId + "," + v.ProductFeatureID;
            }
        });

        this.CurrentTenantdata.features = productFeatureId;
        this.tenantDataChange.emit(this.CurrentTenantdata);
    }     

    //SelectPaymentReceive() {
    //    //var IsReceive: string;
    //    if (this.IsPaymentSelected == true) {
    //        this.IsPaymentSelected = false;
    //        //IsReceive = "false";
    //    }
    //    else {
    //        this.IsPaymentSelected = true;
    //        //IsReceive = "true";
    //    }

    //    this.PaymentReceive.emit(this.IsPaymentSelected);             
    //} 

    ActivateUser() {        
        this.CurrentTenantdata.IsUserActivated = this.CurrentTenantdata.IsUserActivated ? false : true;           
    }    

    bindCountry() {
        this.tenantAdminService.GetAdminCountryList().
            subscribe(
            Controls => {
                var me: any = this;
                me.countries = Controls;
                //if (this.tid > 0) { this.GetState(this.CurrentTenantdata.country); }
                $.each(me.countries, function (i, v) {
                    if (me.CurrentTenantdata.country == v.CountryName) {
                        me.countrydata = v;
                        //CountryCode
                        //:
                        //"ind001"
                        //CountryID
                        //:
                        //133
                        //CountryName
                        //:
                        //"India"
                        //CurrencyCode
                        //:
                        //"INR"
                        //TeleCode
                        //:
                        //"91"
                        //$("#txtContactCountry").val(v.CountryID);
                        me.GetState(v.CountryName, me.regSteps.tenantdata.state);
                        //$("#ddlstate").text(me.regSteps.state);
                        //alert(me.CurrentTenantdata.country);
                        // alert(JSON.stringify(me.countrydata));
                    }
                });
            },
            Error => this.errorMessage = <any>Error
            );
    }
    GetState(countryName, statename) {
        //alert(countryName);
        var country = $.grep(this.countries, function (n, i) { return n.CountryName == countryName; });//this.countries.filter(function (obj) { return obj.CountryName == countryName; });
        if (country != undefined && country.length > 0) {
            this.tenantAdminService.GetAdminStateListByCountryID(country[0].CountryID).
                subscribe(
                Controls => {
                    var data = Controls;
                    var me: any = this;
                    me.states = data;// me.sortJSON(data, 'StateName', '123');


                    if (statename != null) {
                        $.each(me.states, function (i, v) {
                            if (me.CurrentTenantdata.state == v.StateName) {
                                me.statedata = v;
                                //  $("#ddlstate").val(v.StateID);
                            }
                        });
                    }
                },
                Error => this.errorMessage = <any>Error
                );
        }
        else
            this.states = [];
    }

    onFTPChange() {
        this.tenantFTPChange.emit(this.tenantFTP);
    }

    OnTenantDataChange() {
        this.tenantDataChange.emit(this.CurrentTenantdata);
    }
    checkFirstName() {
        if (this.CurrentTenantdata.firstname === 'undefined' || this.CurrentTenantdata.firstname == "") {
            this.util.error('firstname_error', 'First name is required.');
            //return;
        }
    }
    checkLastName() {
        if (this.CurrentTenantdata.lastname === 'undefined' || this.CurrentTenantdata.lastname == "") {
            this.util.error('lastname_error', 'Last name is required.');
            //return;
        }
    }
    checkemail() {
        if (!this.ValidateEmail(this.CurrentTenantdata.email)) {
            //Toast.errorToast('Invalid email format.');
            this.util.error('email_error', 'Invalid email format.');
            return;
        }
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
    IsEmailExists(emailvalue) {
        this.tenantAdminService.ValidateEmailUpdate(emailvalue, this.tid).subscribe(
            Controls => {
                if (Controls.length > 0) {
                    if (Controls[0].emailid.toString().toLowerCase().trim() == emailvalue.toString().toLowerCase().trim()) {
                        this.CurrentTenantdata.email = null;
                        this.util.error('email_error', 'User ID(Email) is already in use.');
                    }
                }

            },
            Error => { this.errorMessage = <any>Error; return false; }
        );
    }
    selectStateDDL(id) {
        var me: any = this;
        me.statedata = me.states.filter(u => u.StateID == $("#ddlstate").val())[0];
    }
    checkFieldIsRequired(type) {
        if (type == "companyname") {
            if (this.CurrentTenantdata.companyname === 'undefined' || this.CurrentTenantdata.companyname == "") {
                this.util.error('companyname_error', 'Company’s Name is required.');
            }
        }
        if (type == "mobile") {
            if (this.CurrentTenantdata.phone === 'undefined' || this.CurrentTenantdata.phone == "") {
                this.util.error('mobile_error', 'Mobile Number is required.');
            }
        }        
        if (type == "address1") {
            if (this.CurrentTenantdata.address1 === 'undefined' || this.CurrentTenantdata.address1 == "") {
                this.util.error('address1_error', 'Address Line 1 is required.');
            }
        }
        if (type == "city") {
            if (this.CurrentTenantdata.city === 'undefined' || this.CurrentTenantdata.city == "") {
                this.util.error('city_error', 'City is required.');
            }
        }
        if (type == "zipcode") {
            if (this.CurrentTenantdata.zipcode === 'undefined' || this.CurrentTenantdata.zipcode == "") {
                this.util.error('zipcode_error', 'Zip Code is required.');
            }
        }
    }
    PhoneValue() {
        var phonenumber = $('#Phone').val();
        this.CurrentTenantdata.phone = phonenumber;
    }
}