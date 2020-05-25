import { Injectable, Inject } from "@angular/core"
import { BehaviorSubject } from 'rxjs';
import { _returnsObject, _OrderObject } from 'src/app/back-office/returns/returns.model';

@Injectable()
export class TemplateServices {
  private bsObsSingle = new BehaviorSubject('default message');
  bsObsSingleValue = this.bsObsSingle.asObservable();
  private order: {
    _order: null, returnfreight: null, shippingAddressList: null, shippingAddress: null
    , _address: null, _states:null ,reasons: null, brandconfig: null, langconfig: null
    , customer_display: null, serialNumber: 0, maxParcels: 0
    current_selected_item: null, _country:null
  };

  constructor() {

  }

  changeValueObjectData(_data: any) {
    this.bsObsSingle.next(_data);
  }

  SetDataToOrderService(_orderObj: any) {
    this.order = _orderObj;
  }

  getOrderObject() {
    return this.order;
  }
 
  setLanguageData(data) {
    sessionStorage.setItem('_lang', data);
  }
  getLanguageData() {
    return JSON.parse(sessionStorage.getItem('_lang'));
  }
}