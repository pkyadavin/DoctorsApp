import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'address-popup',
    templateUrl: './address-popup.component.html',
    styleUrls: ['./address-popup.component.css']
})
export class AddressPopupComponent implements OnInit {

    @Input() langKeyVal: any;
    @Input() formname: any;
    @Input() address: any;
    @Input() states: any;
    @Output() CloseAddressPopup = new EventEmitter();
    @Output() UpdateAddressOnView = new EventEmitter();
    isUpdateOrClose: boolean = false;
    stateName: string = "";

    constructor() { }

    ngOnInit() {
        this.stateName = this.address.state;
    }

    getlang_val(key) {
        if (this.langKeyVal) {
          let langObj = this.langKeyVal.filter(f => f.LanugaugeKey == key && f.formname == this.formname)[0];
          if (langObj) {
            //if (langObj.LanugaugeKey == 'lbl_banner_choosereturn') {
            //debugger;
            // }
            if (langObj.ChangedLangValue) {
              return langObj.ChangedLangValue;
            }
            else
              return langObj.EngLangValue;
          }
        }
      }
    
      getlang_bykey(key) {
        if (this.langKeyVal) {
          let langObj = this.langKeyVal.filter(f => f.EngLangValue.toLowerCase() == key.toLowerCase() && f.formname == this.formname)[0];
          if (langObj) {
            //if (langObj.LanugaugeKey == 'lbl_banner_choosereturn') {
            //debugger;
            // }
            if (langObj.ChangedLangValue) {
              return langObj.ChangedLangValue;
            }
            else
              return langObj.EngLangValue;
          }
        }
      }

    stopPropagation(e) {
        if (!this.isUpdateOrClose) {
            e.stopPropagation();
        }
        else {
            this.isUpdateOrClose = false;
        }
    }

    closePopup() {
        this.isUpdateOrClose = true;
        this.CloseAddressPopup.emit();
    }

    updateAddress(addressPopUp) {
        this.isUpdateOrClose = true;
        this.UpdateAddressOnView.emit({ form: addressPopUp, address: this.address });
    }

    changeState(_stateName) {
        this.stateName = _stateName;
        this.address.state = _stateName;
    }
}
