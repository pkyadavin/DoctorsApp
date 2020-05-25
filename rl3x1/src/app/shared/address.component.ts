import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { Observable } from "rxjs";
import { FormsModule, FormBuilder, Validators } from "@angular/forms";
import { FormControl, FormGroup, NgModel, NgForm } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Address } from "./address.model";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { TypeLookup } from "./TypeLookup.model";
import { StatesService } from "./states.service";
import { CountriesService } from "./countries.service";
import { AddressService } from "./address.service";
import { Util } from "../app.util";
//import { ZipcodeDirective } from "./validation/ZipcodeDirective.directive";
@Component({
  selector: "Address-Template",
  //providers: [AddressService, StatesService, CountriesService],
  templateUrl: "./address.html"
})
export class AddressEditor {
  @Input() address: Address;
  @Input() addressEditor: any;
  @Output() notifyAddress: EventEmitter<Address> = new EventEmitter<Address>();
  @ViewChild("f") _f: NgForm;
  CurrentAddress: Address = new Address();
  parentForm: string;
  selectedCountryID: number;
  @Input() AddressTypeID: number = 0;
  selectedStateID: number;
  setCountryID: number;
  addressForm: FormControl;
  addressTypeName: string;
  IsLoaded: boolean;
  TypeLookupList: TypeLookup[];
  //addressEditor: any;
  isSaveClick: boolean = false;
  setRequiredCountry: boolean = false;
  setRequiredState: boolean = false;
  Countries: any;
  States: any;
  constructor(
    private countriesService: CountriesService,
    private _util: Util,
    private _addressService: AddressService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _stateService: StatesService,
    private _countryService: CountriesService
  ) {
    this.countriesService.loadCountries().subscribe(types => {
      this.Countries = types;
    });
  }
  ngOnInit() {
    // // // // // this.IsLoaded = false;
    // // // // // if(!this.address_localize){
    // // // // //     this._addressService.loadAddressCol('ConsumerAddress').subscribe(
    // // // // //         _result => {
    // // // // //             var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinations);
    // // // // //             var localeditor = localize.map(function (e) {
    // // // // //                 return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
    // // // // //             });
    // // // // //             this.addressEditor = JSON.parse("{" + localeditor.join(',') + "}");
    // // // // //             // this.setRequiredCountry = this.addressEditor.CountryID.isRequired;
    // // // // //             // this.setRequiredState = this.addressEditor.StateID.isRequired;
    this.IsLoaded = true;
    // // // // //         });
    // // // // // }
    this.parentForm = this.address.ParentFormName;

    this.CurrentAddress = this.address;
    if (this.address.PostType == "insert") {
      this.CurrentAddress = new Address();
      this.CurrentAddress.RowNumber = this.address.RowNumber;
      this.CurrentAddress.PostType = this.address.PostType;
      if (this.AddressTypeID != 0) {
        this.CurrentAddress.AddressTypeID = this.AddressTypeID;
      }
      // this.selectedStateID = this.setCountryID = this.selectedCountryID = undefined;
    } else {
      this.CountrySelected();
      // this.setCountryID = this.selectedCountryID = this.address.CountryID;
      // this.selectedStateID = this.address.StateID;
    }

    // this._addressService.loadAddressType("AddressType").
    //     subscribe(
    //     _result => {
    //         this.TypeLookupList = _result;
    //     });

    // console.log('address:',this.CurrentAddress);
  }

  CountrySelected() {
    this._stateService
      .loadStates(this.CurrentAddress.CountryID)
      .subscribe(_result => {
        //console.log('states:',_result);
        this.States = _result;
      });
  }
  StateSelected() {}
  // onAddressTypeChange(lookupId) {
  //     this.getAddressTypeById(lookupId);
  // }
  // getAddressTypeById(lookupId) {
  //     for (var i = 0; i < this.TypeLookupList.length; i++) {
  //         if (this.TypeLookupList[i].TypeLookUpId == lookupId) {
  //             this.CurrentAddress.TypeName = this.addressTypeName = this.TypeLookupList[i].TypeName;
  //             break;
  //         }
  //     }
  // }

  onSave(form) {
    if (!form) {
      form = this._f;
    }

    if (!form.valid) {
      for (var i in form.controls) {
        form.controls[i].markAsTouched();
      }
      form.valueChanges.subscribe(data => {
        this.isSaveClick = !form.valid;
      });

      this.isSaveClick = true;
      this._util.warning(
        "Please fill all the required information with correct format",
        "warning"
      );
      return;
    }
    //console.log('Address to be saved:',this.CurrentAddress);
    this.notifyAddress.emit(this.CurrentAddress);
  }

  onCancel() {
    this.CurrentAddress.PostType = "cancle";
    this.notifyAddress.emit(this.CurrentAddress);
  }

  // countryEvent(event) {
  //     this.CurrentAddress.CountryID = this.selectedCountryID = this.setCountryID = event;
  //     if (event > 0) {
  //         this._countryService.getCountryById(event).subscribe(
  //             _result => {
  //                 this.CurrentAddress.CountryName = _result[0].CountryName;
  //             });
  //     }
  // }

  // stateEvent(event) {
  //     this.CurrentAddress.StateID = this.selectedStateID = this.CurrentAddress.StateID = event;
  //     if (event > 0) {
  //         this._stateService.getStateById(event).subscribe(
  //             _result => {

  //                 this.CurrentAddress.StateName = _result[0].StateName;
  //             });
  //     }
  // }
}
