import { ReturnService } from "./return.service";
import { TypedJson, MaskString } from "src/app/app.util";
import { Guid } from "guid-typescript";
import { event } from "src/app/back-office/returns/returns.model";
declare var $: any;
export class _additionalHeaderInfo {
  select_customer: customer;
  primary_email: string;
  secondary_email: string;
  add_own_reference_number: string;
  selected_inbound_freight: any;
  selected_outbound_freight: any;
  constructor();
  constructor(_addInfo: _additionalHeaderInfo);
  constructor(_addInfo?: any) {
    this.select_customer =
      _addInfo == undefined
        ? new customer()
        : new customer(_addInfo.select_customer);
    this.primary_email = (_addInfo && _addInfo.primary_email) || "";
    this.secondary_email = (_addInfo && _addInfo.secondary_email) || "";
    this.add_own_reference_number =
      (_addInfo && _addInfo.add_own_reference_number) || "";
    this.selected_inbound_freight =
      (_addInfo && _addInfo.selected_inbound_freight) || [];
    this.selected_outbound_freight =
      (_addInfo && _addInfo.selected_outbound_freight) || [];
  }
}
export class _returnsObject {
  language: string;
  return_order_number: string;
  order_number_reference: string;
  customer_order: _OrderObject;
  serial_number: string;
  warranty: string;
  warranty_status_id: number;
  warranty_status: string;
  primary_email: string;
  secondary_email: string;
  rma_action_code: string;
  add_own_reference_number: string;
  currency: string;
  brand: string;
  return_DC: return_DC;
  customer: customer;
  items: Array<items>;
  extra: returnExtra;
  source: string;
  status: status;
  returnfreight: returnfreight;
  selected_in_freight: returnfreight;
  selected_out_freight: returnfreight;
  internal_order_number: string;
  labels: Array<file>;
  constructor();
  constructor(_returns: _returnsObject);
  constructor(_returns?: any) {
    this.return_order_number = (_returns && _returns.return_order_number) || "";
    this.order_number_reference =
      (_returns && _returns.order_number_reference) || "";
    this.customer_order =
      _returns == undefined
        ? new _OrderObject()
        : new _OrderObject(_returns.customer_order);
    this.warranty = (_returns && _returns.warranty) || "";
    this.warranty_status_id = (_returns && _returns.warranty_status_id) || "";
    this.warranty_status = (_returns && _returns.warranty_status) || "";
    this.internal_order_number =
      (_returns && _returns.internal_order_number) || "";
    this.currency = (_returns && _returns.currency) || "";
    this.brand = (_returns && _returns.brand) || "";
    this.rma_action_code = (_returns && _returns.rma_action_code) || "";
    this.return_DC =
      _returns == undefined
        ? new return_DC()
        : new return_DC(_returns.return_DC);
    this.customer =
      _returns == undefined ? new customer() : new customer(_returns.customer);
    this.add_own_reference_number =
      (_returns && _returns.add_own_reference_number) || "";
    try {
      this.returnfreight =
        (_returns &&
          $.map(
            TypedJson.parse<returnfreight>(_returns.return_freight),
            function(v, i) {
              return new returnfreight(v);
            }
          )) ||
        [];
      this.selected_in_freight =
        (_returns &&
          $.map(
            TypedJson.parse<returnfreight>(this.selected_in_freight),
            function(v, i) {
              return new returnfreight(v);
            }
          )) ||
        [];
      this.selected_out_freight =
        (_returns &&
          $.map(
            TypedJson.parse<returnfreight>(this.selected_out_freight),
            function(v, i) {
              return new returnfreight(v);
            }
          )) ||
        [];
    } catch (error) {
      //console.log('error in model:', error);
    }
    this.items =
      (_returns &&
        _returns.items &&
        $.map(TypedJson.parse<items>(_returns.items), function(v, i) {
          return new items(v);
        })) ||
      [];
    this.extra =
      _returns == undefined
        ? new returnExtra()
        : new returnExtra(_returns.returnExtra);
    this.source = (_returns && _returns.source) || "";
    this.status =
      _returns == undefined ? new status() : new status(_returns.status);
    this.labels =
      (_returns &&
        _returns.labels &&
        $.map(TypedJson.parse<file>(_returns.labels), function(v, i) {
          return new file(v);
        })) ||
      [];
  }
}
export class returnExtra {
  noOfBox: number;
  return_shipment: string;
  warranty_approval_status: string;
  constructor();
  constructor(_returnExtra: returnExtra);
  constructor(_returnExtra?: any) {
    this.noOfBox = (_returnExtra && _returnExtra.noOfBox) || 0;
    this.return_shipment = (_returnExtra && _returnExtra.return_shipment) || "";
    this.warranty_approval_status =
      (_returnExtra && _returnExtra.warranty_approval_status) || "approved";
  }
}
export class _returns extends _returnsObject {
  constructor(private _m: ReturnService) {
    super();
  }
  getpassport() {}
  getOrder() {}
  submitReturn() {}
}
export class _mainRMAObj {
  _OrderObject: Array<_OrderObject>;
  _addHeaderInfo: _additionalHeaderInfo;
  constructor();
  constructor(_mobj: _mainRMAObj);
  constructor(_mobj?: any) {
    this._addHeaderInfo =
      _mobj == undefined
        ? new _additionalHeaderInfo()
        : new _additionalHeaderInfo(_mobj._addHeaderInfo);
    this._OrderObject =
      _mobj == undefined
        ? null
        : (_mobj._OrderObject &&
            $.map(TypedJson.parse<items>(_mobj._OrderObject), function(v, i) {
              return new items(v);
            })) ||
          [];
  }
}

export class _OrderObject {
  id: number;
  order_number: string;
  warranty: string;
  ReturnDays: number;
  maxParcels: number;
  language: string;
  brand: string;
  customer: customer;
  items: Array<items>;
  serial_number: string;
  warranty_status: string;
  warranty_status_id: number;
  isSelected: boolean;
  rma_action_code: string;
  constructor();
  constructor(_order: _OrderObject);
  constructor(_order?: any) {
    try {
      this.id = (_order && _order.id) || 0;
      this.order_number = (_order && _order.order_number) || "";
      this.warranty = (_order && _order.warranty) || "";
      this.warranty_status = (_order && _order.warranty_status) || "";
      this.warranty_status_id = (_order && _order.warranty_status_id) || 0;
      this.ReturnDays = (_order && _order.ReturnDays) || 0;
      this.maxParcels = (_order && _order.maxParcels) || 0;
      this.language = (_order && _order.language) || "";
      this.isSelected = (_order && _order.isSelected) || "";
      this.brand = (_order && _order.brand) || "";
      this.serial_number = (_order && _order.serial_number) || "";

      this.rma_action_code = (_order && _order.rma_action_code) || "";
      this.customer =
        _order == undefined ? new customer() : new customer(_order.customer);
      this.items =
        _order == undefined
          ? null
          : (_order.items &&
              $.map(TypedJson.parse<items>(_order.items), function(v, i) {
                return new items(v);
              })) ||
            [];
    } catch (error) {
      // console.log('Model error:', error);
    }
  }
}
export class return_DC {
  company: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: address;
  constructor();
  constructor(_return_DC: return_DC);
  constructor(_return_DC?: any) {
    this.company = (_return_DC && _return_DC.company) || "";
    this.code = (_return_DC && _return_DC.code) || "";
    this.name = (_return_DC && _return_DC.name) || "";
    this.email = (_return_DC && _return_DC.email) || "";
    this.phone = (_return_DC && _return_DC.phone) || "";
    this.address =
      _return_DC == undefined ? new address() : new address(_return_DC.address);
  }
}
export class customer extends MaskString {
  customer_type: string;
  account_id: string;
  title: string;
  name1: string;
  name2: string;
  name: string;
  primary_email: string;
  secondary_email: string;
  phone: string;
  address: address;
  constructor();
  constructor(_customer: customer);
  constructor(_customer?: any) {
    super();
    this.customer_type = (_customer && _customer.customer_type) || "";
    this.account_id = (_customer && _customer.account_id) || "";
    this.title = (_customer && _customer.title) || "";
    this.name1 = (_customer && _customer.name1) || "";
    this.name2 = (_customer && _customer.name2) || "";
    this.name = (_customer && _customer.name) || "";
    this.primary_email = (_customer && _customer.primary_email) || "";
    this.phone = (_customer && _customer.phone) || "";
    this.address =
      _customer == undefined ? new address() : new address(_customer.address);
  }
}
export class address {
  street1: string;
  street2: string;
  building: string;
  state: string;
  city: string;
  postal_code: string;
  state_code: string;
  country_code: string;
  country: string;
  state_id: number;
  country_id: number;
  complete_address: string = "";
  isDefault: boolean = false;
  Company: string;
  constructor();
  constructor(_address: address);
  constructor(_address?: any) {
    this.street1 = (_address && _address.street1) || "";
    this.street2 = (_address && _address.street2) || "";
    this.building = (_address && _address.building) || "";
    this.state = (_address && _address.state) || "";
    this.city = (_address && _address.city) || "";
    this.postal_code = (_address && _address.postal_code) || "";
    this.state_code = (_address && _address.state_code) || "";
    this.country = (_address && _address.country) || "";
    this.state_id = (_address && _address.state_id) || 0;
    this.country_id = (_address && _address.country_id) || 0;
    this.country_code = (_address && _address.country_code) || "";
    this.isDefault = (_address && _address.isDefault) || false;
    this.Company = (_address && _address.Company) || "";
    if (_address) {
      this.complete_address +=
        this.Company.length <= 0 ? "" : this.Company + ", ";
      this.complete_address +=
        this.building.length <= 0 ? "" : this.building + ", ";
      this.complete_address +=
        this.street1.length <= 0 ? "" : this.street1 + ", ";
      this.complete_address +=
        this.street2.length <= 0 ? "" : this.street2 + ", ";
      this.complete_address += this.city.length <= 0 ? "" : this.city + ", ";
      this.complete_address +=
        this.state_code.length <= 0 ? "" : this.state_code + ", ";
      this.complete_address +=
        this.country.length <= 0 ? "" : this.country + ", ";
      this.complete_address +=
        this.postal_code.length <= 0 ? "" : this.postal_code;
    }
  }
}
export class items {
  product_number: string; //id
  serial_number: string; //id
  sku: string; //ean
  name: string;
  image_url: string;
  specifics: Array<any>;
  description: string;
  extra: itemExtra;
  warranty_status_id: number;
  return_reason: ReturnReason;
  remark: string;
  files: Array<file>;
  is_eol: boolean;
  // new property added
  warranty: string;
  warrantydate: string;
  status: status;
  event: Array<event>;
  authorize_action: AuthorizeAction;
  cancel_action: CancellationAuthorization;
  constructor();
  constructor(_items: items);
  constructor(_items?: any) {
    this.product_number = (_items && _items.product_number) || 0;
    this.warranty_status_id = (_items && _items.warranty_status_id) || 0;
    this.serial_number = (_items && _items.serial_number) || 0;
    this.sku = (_items && _items.sku) || "";
    this.name = (_items && _items.name) || "";
    this.image_url = (_items && _items.image_url) || "";
    this.return_reason =
      _items == undefined
        ? new ReturnReason()
        : new ReturnReason(_items.return_reason);
    this.remark = (_items && _items.remark) || "";
    this.is_eol = (_items && _items.is_eol) || false;
    this.specifics =
      (_items &&
        _items.specifics &&
        $.map(TypedJson.parse<any>(_items.specifics), function(v, i) {
          return v;
        })) ||
      [];
    this.description = (_items && _items.description) || "";
    this.extra =
      _items == undefined ? new itemExtra() : new itemExtra(_items.extra);
    this.files =
      (_items &&
        _items.files &&
        $.map(TypedJson.parse<file>(_items.files), function(v, i) {
          return new file(v);
        })) ||
      [];
    this.warranty = (_items && _items.warranty) || "";
    this.warrantydate = (_items && _items.warrantydate) || "";
    this.status =
      _items == undefined ? new status() : new status(_items.status);

    this.event =
      (_items &&
        _items.event &&
        $.map(TypedJson.parse<event>(_items.files), function(v, i) {
          return new event(v);
        })) ||
      [];
    this.authorize_action =
      _items == undefined
        ? new AuthorizeAction()
        : new AuthorizeAction(_items.authorize_action);
    this.cancel_action =
      _items == undefined
        ? new CancellationAuthorization()
        : new CancellationAuthorization(_items.cancel_action);
  }
}

export class address_ga {
  address_line1: string;
  address_line2: string;
  postal_code: string;
  state: string;
  city: string;
  state_code: string;
  country: string;
  state_id: number;
  country_id: number;
  country_code: string;
  Company: string;

  constructor();
  constructor(_address: address_ga);
  constructor(_address?: any) {
    this.address_line1 = (_address && _address.address_line1) || "";
    this.address_line2 = (_address && _address.address_line2) || "";
    this.postal_code = (_address && _address.postal_code) || "";
    this.state = (_address && _address.state) || "";
    this.city = (_address && _address.city) || "";
    this.state_code = (_address && _address.state_code) || "";
    this.state_code = (_address && _address.state_code) || "";
    this.country = (_address && _address.country) || "";
    this.state_id = (_address && _address.country_id) || 0;
    this.country_id = (_address && _address.country_id) || 0;
    this.country_code = (_address && _address.country_code) || "";
    this.Company = (_address && _address.Company) || "";
  }
}
export class customer_ga extends MaskString {
  company_name: string;
  company_registration: string;
  first_name: string;
  last_name: string;
  direct_phone: string;
  email: string;
  //info:info_ga;
  //address: address_ga;
  constructor();
  constructor(_customer: customer_ga);
  constructor(_customer?: any) {
    super();
    this.company_name = (_customer && _customer.company_name) || "";
    this.company_registration =
      (_customer && _customer.company_registration) || "";
    this.first_name = (_customer && _customer.first_name) || "";
    this.last_name = (_customer && _customer.last_name) || "";
    this.direct_phone = (_customer && _customer.direct_phone) || "";
    // this.address =
    //   _customer == undefined ? new address_ga() : new address_ga(_customer.address);
  }
}
export class items_ga {
  serial_number: string = "";
  sku: string = "";
  return_reason: ReturnReason;
  date_of_purchase: string;
  uniques_id: string;
  status: status;
  constructor();
  constructor(_items: items_ga);
  constructor(_items?: any) {
    this.serial_number = (_items && _items.serial_number) || "";
    this.date_of_purchase = (_items && _items.date_of_purchase) || "";
    this.sku = (_items && _items.sku) || "";
    this.uniques_id = (_items && _items.uniques_id) || "";
    this.status =
      _items == undefined ? new status() : new status(_items.status);
    this.return_reason =
      _items == undefined
        ? new ReturnReason()
        : new ReturnReason(_items.return_reason);
  }
}
export class _orderobject_ga_ia {
  source: string = "CP";
  brand: string;
  //isaddresssame:boolean;
  return_ref_number: string;
  created_date: string;
  delivery_info: customer_ga;
  billing_info: customer_ga;
  delivery_address: address_ga;
  billing_address: address_ga;
  items: Array<items_ga>;
  constructor();
  constructor(_order: _orderobject_ga_ia);
  constructor(_order?: any) {
    try {
      this.brand = (_order && _order.brand) || "";
      this.return_ref_number = (_order && _order.return_ref_number) || "";

      this.created_date = (_order && _order.created_date) || "";
      this.delivery_info =
        _order == undefined
          ? new customer_ga()
          : new customer_ga(_order.customer_ga);

      this.billing_info =
        _order == undefined
          ? new customer_ga()
          : new customer_ga(_order.customer_ga);

      this.delivery_address =
        _order == undefined
          ? new address_ga()
          : new address_ga(_order.address_ga);

      this.billing_address =
        _order == undefined
          ? new address_ga()
          : new address_ga(_order.address_ga);

      this.items =
        (_order &&
          _order.items_gaia &&
          $.map(TypedJson.parse<items_ga>(_order.items_gaia), function(v, i) {
            return new items_ga(v);
          })) ||
        [];
    } catch (error) {
      // console.log('Model error:', error);
    }
  }
}
export class status {
  code: string;
  status: string;
  status_id: number;
  statusClass: string;
  showinCP: string;
  showinBO: string;
  constructor();
  constructor(_status: status);
  constructor(_status?: any) {
    this.code = (_status && _status.code) || "";
    this.status = (_status && _status.status) || "";
    this.status_id = (_status && _status.status_id) || 0;
    this.statusClass = (_status && _status.statusClass) || "";
    this.showinCP = (_status && _status.showinCP) || "";
    this.showinBO = (_status && _status.showinBO) || "";
  }
}
export class file {
  type: string;
  url: string;
  name: string;
  constructor();
  constructor(_file: file);
  constructor(_file?: any) {
    this.type = (_file && _file.type) || "";
    this.url = (_file && _file.url) || "";
    this.name = (_file && _file.name) || "";
  }
}
export class orderExtra {
  return_DC: string;
  return_shipment: string;
  constructor();
  constructor(_orderExtra: orderExtra);
  constructor(_orderExtra?: any) {
    this.return_DC = (_orderExtra && _orderExtra.return_DC) || "";
    this.return_shipment = (_orderExtra && _orderExtra.return_shipment) || "";
  }
}
export class itemExtra {
  return_DC: string;
  newuid: string;
  default_return_shipment: string;
  service_type: string;
  outbound_freight: string;
  constructor();
  constructor(_itemExtra: itemExtra);
  constructor(_itemExtra?: any) {
    try {
      this.return_DC =
        (_itemExtra && _itemExtra.return_DC) ||
        (_itemExtra && JSON.parse(_itemExtra).return_DC) ||
        "";
    } catch (error) {
      this.return_DC = "";
    }
    this.default_return_shipment =
      (_itemExtra && _itemExtra.default_return_shipment) || "";
    this.service_type = (_itemExtra && _itemExtra.service_type) || "";
    this.outbound_freight = (_itemExtra && _itemExtra.outbound_freight) || "";
    this.newuid = (_itemExtra && _itemExtra.newuid) || Guid.create().toString();
  }
}
export class returnfreight {
  isSelected: boolean;
  currency: string;
  feight_charge: string;
  feight_code: string;
  feight_id: string;
  feight_service: string;
  constructor();
  constructor(_returnfreight: returnfreight);
  constructor(_returnfreight?: any) {
    this.currency = (_returnfreight && _returnfreight.currency) || "";
    this.feight_charge = (_returnfreight && _returnfreight.feight_charge) || "";
    this.feight_code = (_returnfreight && _returnfreight.feight_code) || "";
    this.feight_id = (_returnfreight && _returnfreight.feight_id) || "";
    this.feight_service =
      (_returnfreight && _returnfreight.feight_service) || "";
    this.isSelected = (_returnfreight && _returnfreight.isSelected) || false;
  }
}
export class keyValue {
  key: string;
  value: string;
  constructor();
  constructor(_textValue: keyValue);
  constructor(_textValue?: any) {
    this.key = (_textValue && _textValue.text) || "";
    this.value = (_textValue && _textValue.value) || "";
  }
}
export class ReturnReason {
  approval_required: boolean;
  comment_required: boolean;
  file_required: boolean;
  rma_action_code: string;
  rma_action_name: string;
  on_BO: boolean;
  category_code: string;
  category_name: string;
  constructor();
  constructor(_ReturnReason: ReturnReason);
  constructor(_ReturnReason?: any) {
    this.approval_required =
      (_ReturnReason && _ReturnReason.approval_required) || false;
    this.comment_required =
      (_ReturnReason && _ReturnReason.comment_required) || false;
    this.file_required =
      (_ReturnReason && _ReturnReason.file_required) || false;
    this.rma_action_code =
      (_ReturnReason && _ReturnReason.rma_action_code) || "";
    this.rma_action_name =
      (_ReturnReason && _ReturnReason.rma_action_name) || "";
    this.on_BO = (_ReturnReason && _ReturnReason.on_BO) || false;
    this.category_code = (_ReturnReason && _ReturnReason.category_code) || "";
    this.category_name = (_ReturnReason && _ReturnReason.category_name) || "";
  }
}
export class AuthorizeAction {
  actiontaken: boolean;
  isauthorized: boolean;
  authorized_date: string;
  authorized_by: string;
  authorized_reason_id: string;
  authorized_comment: string;
  authorized_by_name: string;
  authorized_reason_name: string;
  authorized_approve_date_code: string;
  constructor();
  constructor(_authorizeAction: AuthorizeAction);
  constructor(_authorizeAction?: any) {
    this.actiontaken =
      (_authorizeAction && _authorizeAction.actiontaken) || false;
    this.isauthorized =
      (_authorizeAction && _authorizeAction.isauthorized) || false;
    this.authorized_date =
      (_authorizeAction && _authorizeAction.authorized_date) || "";
    this.authorized_by =
      (_authorizeAction && _authorizeAction.authorized_by) || "";
    this.authorized_reason_id =
      (_authorizeAction && _authorizeAction.authorized_reason_id) || "";
    this.authorized_comment =
      (_authorizeAction && _authorizeAction.authorized_comment) || "";
    this.authorized_by_name =
      (_authorizeAction && _authorizeAction.authorized_by_name) || "";
    this.authorized_reason_name =
      (_authorizeAction && _authorizeAction.authorized_reason_name) || "";
    this.authorized_approve_date_code =
      (_authorizeAction && _authorizeAction.authorized_approve_date_code) || "";
  }
}
export class CancellationAuthorization {
  iscancelled: boolean;
  cancelled_date: string;
  cancelled_remarks: string;
  constructor();
  constructor(_cancelAuth: CancellationAuthorization);
  constructor(_cancelAuth?: any) {
    this.iscancelled = (_cancelAuth && _cancelAuth.iscancelled) || false;
    this.cancelled_date = (_cancelAuth && _cancelAuth.cancelled_date) || "";
    this.cancelled_remarks =
      (_cancelAuth && _cancelAuth.cancelled_remarks) || "";
  }
}
export class UploadedFiles {
  formDataArray: FormData[] = [];
}
export class customer_display extends MaskString {
  customer_type: string;
  account_id: string;
  title: string;
  name1: string;
  name2: string;
  name: string;
  primary_email: string;
  secondary_email: string;
  phone: string;
  address: address;
  constructor();
  constructor(_customer: customer);
  constructor(_customer?: any) {
    super();
    this.customer_type = (_customer && _customer.customer_type) || "";
    this.title = (_customer && _customer.title) || "";
    this.account_id = (_customer && _customer.account_id) || "";

    this.name1 = (_customer && _customer.name1) || "";
    this.name2 = (_customer && _customer.name2) || "";
    this.name =
      (_customer &&
        _customer.title + " " + _customer.name1 + " " + _customer.name2) ||
      "";
    this.primary_email =
      (_customer && this.mask(0, 3, 2, "x", _customer.primary_email)) || "";
    this.phone = (_customer && _customer.phone) || ""; //_customer && this.mask(0, 3, 2, "x", _customer.phone) || '';
    this.address =
      _customer == undefined
        ? new address()
        : new address(JSON.parse(JSON.stringify(_customer.address)));
  }
}

export class track_history {
  return_header_id: number;
  return_number: number;
  internal_order_number: string;
  primary_email: string;
  secondary_email: string;
  add_own_reference_number: string;
  created_date: string;
  customer: customer;
  status: status;
  label: file;
  items: items;
  constructor();
  constructor(_track_history?: any) {
    this.return_header_id =
      (_track_history && _track_history.return_header_id) || 0;
    this.return_number = (_track_history && _track_history.return_number) || 0;
    this.internal_order_number =
      (_track_history && _track_history.internal_order_number) || "";
    this.primary_email = (_track_history && _track_history.primary_email) || "";
    this.secondary_email =
      (_track_history && _track_history.secondary_email) || "";
    this.add_own_reference_number =
      (_track_history && _track_history.add_own_reference_number) || "";
    this.created_date = (_track_history && _track_history.created_date) || "";
  }
}

export class address_display extends MaskString {
  street1: string;
  street2: string;
  street3: string;
  state: string;
  city: string;
  postalcode: string;
  state_code: string;
  country_code: string;
  state_id: number;
  country_id: number;
  complete_address: string = "";
  constructor();
  constructor(_address: address);
  constructor(_address?: any) {
    super();
    this.street1 = (_address && _address.street1) || "";
    this.street2 = (_address && _address.street2) || "";
    this.street3 = (_address && _address.street3) || "";
    this.state = (_address && _address.state) || "";
    this.city = (_address && _address.city) || "";
    this.postalcode = (_address && _address.postalcode) || "";
    this.state_code = (_address && _address.state_code) || "";
    this.country_code = (_address && _address.country_code) || "";
    this.state_id = (_address && _address.state_id) || 0;
    this.country_id = (_address && _address.country_id) || 0;
    if (_address) {
      this.complete_address +=
        this.street1.length <= 0 ? "" : this.street1 + ", ";
      this.complete_address +=
        this.street2.length <= 0 ? "" : this.street2 + ", ";
      this.complete_address +=
        this.street3.length <= 0 ? "" : this.street3 + ", ";
      this.complete_address += this.city.length <= 0 ? "" : this.city + ", ";
      this.complete_address += this.state.length <= 0 ? "" : this.state + ", ";
      this.complete_address +=
        this.postalcode.length <= 0 ? "" : this.postalcode;
    }
  }
}

export class cancel_request {
  authorized_comment: string;
  internal_return_number: string;
  authorizetion_type: string;
  constructor();
  constructor(_cancelReq?: any) {
    this.authorized_comment =
      (_cancelReq && _cancelReq.authorized_comment) || "";
    this.internal_return_number =
      (_cancelReq && _cancelReq.internal_return_number) || "";
    this.authorizetion_type =
      (_cancelReq && _cancelReq.authorizetion_type) || "Cancel";
  }
}

export class _returnObject_bp {
  source: string = "CP";
  brand: string;
  delivery_info: customer_ga;
  delivery_address: address_ga;
  file: file;
  item_detail: string;
  constructor();
  constructor(_bp_return: _returnObject_bp);
  constructor(_bp_return?: any) {
    try {
      this.brand = (_bp_return && _bp_return.brand) || "";
      this.delivery_info =
        _bp_return == undefined
          ? new customer_ga()
          : new customer_ga(_bp_return.customer_ga);

      this.delivery_address =
        _bp_return == undefined
          ? new address_ga()
          : new address_ga(_bp_return.address_ga);

      this.file =
        _bp_return == undefined ? new file() : new file(_bp_return.file);

      this.item_detail = (_bp_return && _bp_return.item_detail) || "";
    } catch (error) {}
  }
}

export class _returnGETObject_bp {
  source: string = "CP";
  brand: string;
  return_ref_number: string;
  rma_number: string;
  created_date: string;
  delivery_info: customer_ga;
  delivery_address: address_ga;
  file: file;
  item_detail: string;
  status: status;
  items: Array<items_ga>;
  constructor();
  constructor(_bp_return: _returnGETObject_bp);
  constructor(_bp_return?: any) {
    try {
      this.brand = (_bp_return && _bp_return.brand) || "";
      this.rma_number = (_bp_return && _bp_return.rma_number) || "";
      this.return_ref_number =
        (_bp_return && _bp_return.return_ref_number) || "";
      this.created_date = (_bp_return && _bp_return.created_date) || "";
      this.status =
        _bp_return == undefined ? new status() : new status(_bp_return.status);
      this.delivery_info =
        _bp_return == undefined
          ? new customer_ga()
          : new customer_ga(_bp_return.customer_ga);

      this.delivery_address =
        _bp_return == undefined
          ? new address_ga()
          : new address_ga(_bp_return.address_ga);

      this.file =
        _bp_return == undefined ? new file() : new file(_bp_return.file);

      this.item_detail = (_bp_return && _bp_return.item_detail) || "";
      this.items =
        (_bp_return &&
          _bp_return.items_gaia &&
          $.map(TypedJson.parse<items_ga>(_bp_return.items_gaia), function(
            v,
            i
          ) {
            return new items_ga(v);
          })) ||
        [];
    } catch (error) {}
  }
}