import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AddressService } from '../../shared/address.service';
import { ContractTerms } from './contractterms.model'
import { CommonService } from '../../shared/common.service'
import { Util } from 'src/app/app.util';

@Component({
    selector: 'cont-term',
    providers: [AddressService, CommonService],
    templateUrl: './contractterms.html'
})

export class ContractTermDataComponent  {
    //ContractTermsCom: boolean;

    contractTermData: ContractTerms = new ContractTerms();
    TypeLookUpList: any;
    UOMList: any;
    addressEditor:any
    IsLoaded: boolean=false;
    errorMessage: any;

    @Output() ContractTermDataChange = new EventEmitter();

    @Input() 
    get ContractTermData() {
        return this.contractTermData;
    }

    set ContractTermData(val) {
        this.contractTermData = val;
        this.ContractTermDataChange.emit(this.contractTermData);
    }

    constructor(public commonService: CommonService, private _addressService: AddressService,private _util:Util) {
        this.IsLoaded = false;
    }


    ngOnInit() {
        this._addressService.loadAddressCol('PartnerAccountDetail').subscribe(
            _result => {
                var localize = _result;
                var localeditor = localize.map(function (e) {
                    return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                });
                this.addressEditor = JSON.parse("{" + localeditor.join(',') + "}");
               // console.log(this.addressEditor);
                this.IsLoaded = true;
            });

        this.commonService.getTypeLookUpByName("PaymentTerms").subscribe(_result => {
            this.TypeLookUpList = _result;
        }, error => this.errorMessage = <any>error);

        this.commonService.loadUOM().subscribe(_result => {
            this.UOMList = _result;
        }, error => this.errorMessage = <any>error);
    }
}