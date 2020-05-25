import { TypedJson } from "src/app/app.util";
declare var $: any;

export class _ga_returnObject {
  request_header_id: string;
  return_ref_number: string;
  rma_number: string;
  internal_ref_number: string;
  created_date: string;
  source: string;
  brand: string;
  isaddresssame: boolean;
  delivery_info: ga_customer;
  billing_info: ga_customer;
  delivery_address: ga_address;
  billing_address: ga_address;
  items: Array<ga_items>;
  labels: file;
  files: file;
  remarks: string;
  status: status;
  constructor();
  constructor(_return: _ga_returnObject);
  constructor(_return?: any) {
    try {
      this.brand = (_return && _return.brand) || "";
      this.request_header_id = (_return && _return.request_header_id) || "";
      this.return_ref_number = (_return && _return.return_ref_number) || "";
      this.rma_number = (_return && _return.rma_number) || "";
      this.internal_ref_number = (_return && _return.internal_ref_number) || "";
      this.remarks = (_return && _return.remarks) || "";
      this.created_date = (_return && _return.created_date) || "";
      this.delivery_info =
        _return == undefined
          ? new ga_customer()
          : new ga_customer(_return.customer_ga);

      this.billing_info =
        _return == undefined
          ? new ga_customer()
          : new ga_customer(_return.customer_ga);

      this.delivery_address =
        _return == undefined
          ? new ga_address()
          : new ga_address(_return.address_ga);

      this.billing_address =
        _return == undefined
          ? new ga_address()
          : new ga_address(_return.address_ga);

      this.items =
        (_return &&
          _return.items_gaia &&
          $.map(TypedJson.parse<ga_items>(_return.items_gaia), function(v, i) {
            return new ga_items(v);
          })) ||
        [];
      this.labels =
        _return == undefined ? new file() : new file(_return.labels);
      this.files = _return == undefined ? new file() : new file(_return.files);
      this.status =
        _return == undefined ? new status() : new status(_return.status);
    } catch (error) {}
  }
}

export class ga_customer {
  company_name: string;
  company_registration: string;
  first_name: string;
  last_name: string;
  direct_phone: string;
  email: string;
  constructor();
  constructor(_customer: ga_customer);
  constructor(_customer?: any) {
    this.company_name = (_customer && _customer.company_name) || "";
    this.company_registration =
      (_customer && _customer.company_registration) || "";
    this.first_name = (_customer && _customer.first_name) || "";
    this.last_name = (_customer && _customer.last_name) || "";
    this.direct_phone = (_customer && _customer.direct_phone) || "";
    this.email = (_customer && _customer.email) || "";
  }
}

export class ga_address {
  address_line1: string;
  address_line2: string;
  postal_code: string;
  state: string;
  city: string;
  state_code: string;
  country: string;
  state_id: number;
  country_id: number;
  country_code: number;
  Company: string;
  complete_address: string;
  constructor();
  constructor(_address: ga_address);
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
    if (_address) {
      this.complete_address +=
        this.Company.length <= 0 ? "" : this.Company + ", ";
      this.complete_address += this.complete_address +=
        this.address_line1.length <= 0 ? "" : this.address_line1 + ", ";
      this.complete_address +=
        this.address_line2.length <= 0 ? "" : this.address_line2 + ", ";
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

export class ga_items {
  request_detail_id: string;
  request_header_id: string;
  internal_ref_number: string;
  serial_number: string;
  sku: string;
  return_reason: ReturnReason;
  date_of_purchase: string;
  files: Array<file>;
  authorize_action: AuthorizeAction;
  remarks: string;
  labels: file;
  status: status;
  isSelected: any;
  warranty_status: string;
  warranty_status_id: number;
  constructor();
  constructor(_items: ga_items);
  constructor(_items?: any) {
    this.request_detail_id = (_items && _items.request_detail_id) || "";
    this.request_header_id = (_items && _items.request_header_id) || "";
    this.internal_ref_number = (_items && _items.internal_ref_number) || "";
    this.remarks = (_items && _items.remarks) || "";
    this.serial_number = (_items && _items.serial_number) || "";
    this.date_of_purchase = (_items && _items.date_of_purchase) || "";
    this.sku = (_items && _items.sku) || "";
    this.warranty_status = (_items && _items.warranty_status) || "";
    this.warranty_status_id = (_items && _items.warranty_status_id) || 0;
    this.return_reason =
      _items == undefined
        ? new ReturnReason()
        : new ReturnReason(_items.return_reason);
    this.files =
      (_items &&
        _items.files &&
        $.map(TypedJson.parse<file>(_items.files), function(v, i) {
          return new file(v);
        })) ||
      [];
    this.authorize_action =
      _items == undefined
        ? new AuthorizeAction()
        : new AuthorizeAction(_items.authorize_action);

    this.labels = _items == undefined ? new file() : new file(_items.labels);
    this.status = _items == undefined ? new status() : new status(_items.files);
    this.isSelected = (_items && _items.isSelected) || false;
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

export class status {
  code: string;
  status: string;
  status_id: number;
  showinCP: string;
  showinBO: string;
  statusClass: string;
  constructor();
  constructor(_status: status);
  constructor(_status?: any) {
    this.code = (_status && _status.code) || "";
    this.status = (_status && _status.status) || "";
    this.statusClass = (_status && _status.statusClass) || "";
    this.status_id = (_status && _status.status_id) || 0;
    this.showinCP = (_status && _status.showinCP) || "";
    this.showinBO = (_status && _status.showinBO) || "";
  }
}

export class bp_authorization {
  request_header_id: number;
  authorized_type: string;
  authorized_reason_id: number;
  authorized_comment: string;
  bp_auth_items: Array<bp_auth_item>;
  constructor();
  constructor(_bp_auth: bp_authorization);
  constructor(_bp_auth?: any) {
    this.request_header_id = (_bp_auth && _bp_auth.request_header_id) || 0;
    this.authorized_type = (_bp_auth && _bp_auth.authorized_type) || "";
    this.authorized_reason_id =
      (_bp_auth && _bp_auth.authorized_reason_id) || 0;
    this.authorized_comment = (_bp_auth && _bp_auth.authorized_comment) || "";
    this.bp_auth_items =
      (_bp_auth &&
        _bp_auth.bp_auth_items &&
        $.map(TypedJson.parse<bp_auth_item>(_bp_auth.bp_auth_items), function(
          v,
          i
        ) {
          return new bp_auth_item(v);
        })) ||
      [];
  }
}

export class bp_auth_item {
  request_detail_id: number;
  request_header_id: string;
  internal_ref_number: string;
  serial_number: string;
  item_number: string;
  purchase_date: string;
  warranty_status: string;
  isSelected: boolean;
  constructor();
  constructor(_bp_authitem: bp_auth_item);
  constructor(_bp_authitem?: any) {
    this.request_header_id =
      (_bp_authitem && _bp_authitem.request_header_id) || 0;
    this.request_detail_id =
      (_bp_authitem && _bp_authitem.request_detail_id) || 0;
    this.internal_ref_number =
      (_bp_authitem && _bp_authitem.internal_ref_number) || "";
    this.serial_number = (_bp_authitem && _bp_authitem.serial_number) || "";
    this.item_number = (_bp_authitem && _bp_authitem.item_number) || "";
    this.purchase_date = (_bp_authitem && _bp_authitem.purchase_date) || "";
    this.warranty_status = (_bp_authitem && _bp_authitem.warranty_status) || "";
    this.isSelected = (_bp_authitem && _bp_authitem.isSelected) || false;
  }
}
