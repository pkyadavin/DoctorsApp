import { Component, ViewChild, EventEmitter, Output,Input } from '@angular/core';
import { UserService } from './User.Service.js';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { User } from './User.model';
import { Country, State, Language } from '../../shared/common.model';
import { Partners } from '../Partner/partnergrid.component';
import { Property, Util } from '../../app.util'; 
import { BsModalComponent } from 'ng2-bs3-modal'
import { CommonService } from '../../shared/common.service';
import { message } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
var intlTelInput = require('../../../Assets/js/intlTelInput.js');
declare var $: any;

@Component({
    selector: 'PartnerUserEditor',    
    providers: [UserService, CommonService],
    templateUrl: './partnerusereditor.html'    
})

export class PartnerUserEditor extends Property{
    @ViewChild('f') form;
    @ViewChild('childComponent') _partnerpopup;
    @Output() notifyParent = new EventEmitter(); 
    @Input("Scope") Scope: string;
    modal: BsModalComponent;
    modalPartner: BsModalComponent;
    IsChangePwd: boolean = false;            
    users: Observable<User[]>;
    countryList: Country[];
    stateList: State[];
    languageList: Language[];
    singleUser: User = new User();
    localize: any;
    dataSource: any;
    errorMessage: string;
    selectedCountryId: number;
    isCancel = false;
    IsLoaded: boolean;
    isFirstTimeLoad: boolean = true;
    isSaveClick: boolean = false;
    countrycodes: any = [];
    userInitials = [
        { InitialID: 1, InitialIName: 'Mr.' },
        { InitialID: 2, InitialIName: 'Ms.' }
    ];

    constructor( private _util:Util,
        private userService: UserService, private _router: Router, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService, private commonService: CommonService) {
        super()
        this.selectedCountryId = 0;
        this.errorMessage = "";        
    }
        
    ngOnInit() {                     

        this.userService.loadCountries().subscribe(country => {
            this.countryList = country;
        });

        this.userService.loadStates(this.selectedCountryId).subscribe(state => {
            this.stateList = state;
        });

        this.commonService.getAllLanguages().subscribe(result => {
            this.languageList = result;
        }, error => this.errorMessage = <any>error);
        
        this.userService.load(0).subscribe(u => {
                        
            this.singleUser.Scope = this.Scope;
            if (this.Scope == "PTR001") {
                this.singleUser.UserType = "Facility";
            }
            else if (this.Scope == "PTR004") {
                this.singleUser.UserType = "Account";                    
            } 
                
            var localize = JSON.parse(u.recordsets[1][0].ColumnDefinitions);
            var node_editor = localize.map(function (e) {
                return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
            });            
            this.e_localize = JSON.parse("{" + node_editor.join(',') + "}");
            this.IsLoaded = true;
            
            //this.countrycodes = u.recordsets[3];            
            //var me: any = this;
            //setTimeout(() => {
            //    var partnerinfo = this._globalService.getItem('partnerinfo')[0];
            //    var CellNumbers = [{ "mask": "##########" }, { "mask": "##########"}];                    
            //    $('#CellNumber').inputmask({
            //        mask: CellNumbers,
            //        greedy: false,
            //        definitions: { '#': { validator: "[0-9]", cardinality: 1 } }
            //    });
            //    $("#mobile-number").intlTelInput();
                   
            //    if (me.singleUser.TeleCode != null) {

            //        var cName = me.getObjects(intlTelInput.countries, 'calling-code', me.singleUser.TeleCode.trim());
                       
            //        if (cName.length > 0) {
            //            $(".country").each(function () {                                
            //                if (me.singleUser.TeleCode.trim() == $(this).attr("data-dial-code")) {
            //                    $(this).click();
            //                }
            //            });
            //        }
            //    }
            //});
        }, error => this._util.error(error, 'error'));
    }

    FillUser(data) {
        if (data) {
            this.singleUser.Action = "Update";
            this.IsChangePwd = false;
            this.singleUser.UserID = data.UserID;
            this.singleUser.Initials = data.Initials;
            this.singleUser.TenantID = data.TenantID;
            this.singleUser.FirstName = data.FirstName;
            this.singleUser.MiddleName = data.MiddleName;
            this.singleUser.LastName = data.LastName;
            this.singleUser.Email = data.Email;
            this.singleUser.CellNumber = data.CellNumber;
            this.singleUser.UserName = data.UserName;
            this.singleUser.Password = data.Password;
            this.singleUser.PasswordConfirmation = data.Password;            
            this.singleUser.Address1 = data.Address1;
            this.singleUser.Address2 = data.Address2;
            this.singleUser.City = data.City;
            this.singleUser.ZipCode = data.ZipCode;
            this.singleUser.FixedLineNumber = data.FixedLineNumber;
            this.singleUser.UserImage = data.userimage == null || data.userimage == "" ? "assets/img/noimage.png" : data.userimage;
        }
        else {
            this.singleUser.Action = "Add";
            this.IsChangePwd = false;
            this.singleUser.UserID = 0;
            this.singleUser.Initials = "undefined";   
            this.singleUser.TenantID = undefined;
            this.singleUser.FirstName = undefined;
            this.singleUser.MiddleName = undefined;
            this.singleUser.LastName = undefined;
            this.singleUser.Email = undefined;
            this.singleUser.CellNumber = undefined;
            this.singleUser.UserName = undefined;
            //this.singleUser.Password = undefined;
            //this.singleUser.PasswordConfirmation = undefined;
            var UserPassword = Math.random().toString(36).slice(-8);
            this.singleUser.Password = UserPassword;
            this.singleUser.PasswordConfirmation = UserPassword;

            this.singleUser.Address1 = undefined;
            this.singleUser.Address2 = undefined;
            this.singleUser.City = undefined;
            this.singleUser.ZipCode = undefined;
            this.singleUser.FixedLineNumber = undefined;
            this.singleUser.UserImage = "assets/img/noimage.png";

            this.form.reset(); 
                   
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
    @ViewChild('pop') _popup: message;

    CheckPhoneVal() {
        var cellnumber = $('#CellNumber').val();
        this.singleUser.CellNumber = cellnumber;
    }

    xyz() {
    }

    onSubmit() {

        var CurrentTenantInfo = this._globalService.getItem('CurrentTenantInfo');
        
        if (!this.form.valid) {
            for (var i in this.form.controls) {
                this.form.controls[i].markAsTouched();
            }
            this.form.valueChanges.subscribe(data => {
                this.isSaveClick = !this.form.valid;
            })
            this.isSaveClick = true;
            return;
        }

        if (this.singleUser.Initials == undefined)
            this.singleUser.Initials = '';

        this.singleUser.UserImage = this.singleUser.UserImage == "assets/img/noimage.png" ? "" : this.singleUser.UserImage;
        
        //if (this.singleUser.Password != this.singleUser.PasswordConfirmation) {
        //    this._popup.Alert('Alert', "Password and Confirmation Password don't match");
        //    return;
        //} 

        this.notifyParent.emit(this.singleUser);               
    }   

    //ChangePassword(val) {
    //    this.IsChangePwd = val.target.checked;        
    //}   

    onCountryChange(countryValue) {
        this.selectedCountryId = countryValue;
        this.userService.loadStates(this.selectedCountryId).subscribe(state => {
            this.stateList = state;
        });
    }    

    ImageFile: FileList;
    handleInputChange(ctrl, e, controls) {

        var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (file.length > 0) {
            var pattern = /image-*/;
            var reader = new FileReader();
            if (!file[0].type.match(pattern)) {
                this._util.error('Invalid document format',"Alert");
                return;
            }

            this.ImageFile = file;
            let formData: FormData = new FormData();
            
            for (let i = 0; i < this.ImageFile.length; i++) {
                formData.append('userimage', this.ImageFile[0]);
            }

            var ImageDetails = { userimage: formData };
            this.userService.UploadProfileImage(formData).subscribe(data => {
                                

                if (data.result == 'Success') {
                    this.singleUser.UserImage = data.FileUrl;
                }
                else {
                    this.singleUser.UserImage = "";
                }

            });
        }
        else {

        }
    }    

    _handleReaderLoaded(e) {
        var reader = e.target;
        this.singleUser.UserImage = reader.result;
    }
}