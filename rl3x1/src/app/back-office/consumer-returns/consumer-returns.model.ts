import { TypedJson, MaskString } from "src/app/app.util";
import { Guid } from "guid-typescript";
import { event } from "src/app/back-office/returns/returns.model";
declare var $: any;

export class customer_con extends MaskString {
  company_name: string;
  company_registration: string;
  first_name: string;
  last_name: string;
  direct_phone: string;
  email: string;
  constructor();
  constructor(_customer: customer_con);
  constructor(_customer?: any) {
    super();
    this.company_name = (_customer && _customer.company_name) || "";
    this.company_registration =
      (_customer && _customer.company_registration) || "";
    this.first_name = (_customer && _customer.first_name) || "";
    this.last_name = (_customer && _customer.last_name) || "";
    this.direct_phone = (_customer && _customer.direct_phone) || "";
    this.email = (_customer && _customer.email) || "";
  }
}

export class _consumer_returnObject {
  request_header_id: number;
  return_ref_number: string;
  rma_number: string;
  internal_ref_number: string;
  created_date: string;
  source: string = "BO";
  brand: string = "dsc2";
  happy_fox_id: string;
  remarks: string;
  is_eol: boolean;
  delivery_info: customer_con;
  delivery_address: address_con;
  items: _items;
  labels: file;
  files: file;
  is_updated_customer: boolean;
  status: status;
  primary_email: string;
  secondary_email: string;
  add_your_own_ref: string;
  constructor();
  constructor(_con_return: _consumer_returnObject);
  constructor(_con_return?: any) {
    try {
      this.request_header_id =
        (_con_return && _con_return.request_header_id) || 0;
      this.request_header_id =
        (_con_return && _con_return.request_header_id) || "";
      this.return_ref_number =
        (_con_return && _con_return.return_ref_number) || "";
      this.rma_number = (_con_return && _con_return.rma_number) || "";
      this.internal_ref_number =
        (_con_return && _con_return.internal_ref_number) || "";
      this.brand = (_con_return && _con_return.brand) || "";
      this.happy_fox_id = (_con_return && _con_return.happy_fox_id) || "";
      this.remarks = (_con_return && _con_return.remarks) || "";
      this.created_date = (_con_return && _con_return.created_date) || "";
      this.delivery_info =
        _con_return == undefined
          ? new customer_con()
          : new customer_con(_con_return.customer_con);
      this.delivery_address =
        _con_return == undefined
          ? new address_con()
          : new address_con(_con_return.address_con);
      this.items =
        _con_return == undefined
          ? new _items()
          : new _items(_con_return._items);
      this.labels =
        _con_return == undefined ? new file() : new file(_con_return.labels);
      this.files =
        _con_return == undefined ? new file() : new file(_con_return.files);
      this.status =
        _con_return == undefined
          ? new status()
          : new status(_con_return.status);
      this.primary_email = (_con_return && _con_return.primary_email) || "";
      this.secondary_email = (_con_return && _con_return.secondary_email) || "";
      this.add_your_own_ref =
        (_con_return && _con_return.add_your_own_ref) || "";
    } catch (error) { }
  }
}

export class address_con {
  address_line1: string;
  address_line2: string;
  postal_code: string;
  state: string;
  city: string;
  state_code: string;
  country: string;
  country_code: string;
  building: string;
  constructor();
  constructor(_address: address_con);
  constructor(_address?: any) {
    this.address_line1 = (_address && _address.address_line1) || "";
    this.address_line2 = (_address && _address.address_line2) || "";
    this.postal_code = (_address && _address.postal_code) || "";
    this.state = (_address && _address.state) || "";
    this.city = (_address && _address.city) || "";
    this.state_code = (_address && _address.state_code) || "";
    this.country = (_address && _address.country) || "";
    this.country_code = (_address && _address.country_code) || "";
    this.building = (_address && _address.building) || "";
  }
}

export class _items {
  request_detail_id: number;
  product_id: number;
  product_detail: keyValue;
  color_id: number;
  color_detail: keyValue;
  rma_request_type_id: number;
  rma_request_type_detail: keyValue;
  product_warranty_id: number;
  product_warranty_detail: keyValue;
  return_reason: ReturnReason;
  date_of_purchase: string;
  files: file;
  authorize_action: AuthorizeAction;
  serial_number: string;
  remarks: string;
  labels: file;
  status: status;
  customer_ref_field: string;
  constructor();
  constructor(_item: _items);
  constructor(_item?: any) {
    this.request_detail_id = (_item && _item.request_detail_id) || 0;
    this.product_id = (_item && _item.product_id) || 0;
    this.color_id = (_item && _item.color_id) || 0;
    this.rma_request_type_id = (_item && _item.rma_request_type_id) || 0;
    this.product_warranty_id = (_item && _item.product_warranty_id) || 0;
    this.date_of_purchase = (_item && _item.date_of_purchase) || "";
    this.serial_number = (_item && _item.serial_number) || "";
    this.remarks = (_item && _item.remarks) || "";
    this.customer_ref_field = (_item && _item.customer_ref_field) || "";
    this.labels = _item == undefined ? new file() : new file(_item.labels);
    this.files = _item == undefined ? new file() : new file(_item.files);
    this.status = _item == undefined ? new status() : new status(_item.status);
    this.return_reason =
      _item == undefined
        ? new ReturnReason()
        : new ReturnReason(_item.return_reason);
    this.authorize_action =
      _item == undefined
        ? new AuthorizeAction()
        : new AuthorizeAction(_item.authorize_action);
    this.product_detail =
      _item == undefined ? new keyValue() : new keyValue(_item.product_detail);
    this.color_detail =
      _item == undefined ? new keyValue() : new keyValue(_item.color_detail);
    this.rma_request_type_detail =
      _item == undefined
        ? new keyValue()
        : new keyValue(_item.rma_request_type_detail);
    this.product_warranty_detail =
      _item == undefined
        ? new keyValue()
        : new keyValue(_item.product_warranty_detail);
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
export class rected_req_cp {
  authorized_reason_id: string;  // done
  authorized_comment: string;  //
  request_detail_id: number; //
  return_header_id: number;  //done
  authorizetion_type: string;  
  is_eol: boolean;
  return_ref_number: string;  //done
  internal_ref_number: string; //done
  constructor();
  constructor(_request_rtr_cp: rected_req_cp);
  constructor(_request_rtr_cp?: any) {
    this.authorized_reason_id = (_request_rtr_cp && _request_rtr_cp.authorized_reason_id) || "";
    this.authorized_comment = (_request_rtr_cp && _request_rtr_cp.authorized_comment) || "";
    this.request_detail_id = (_request_rtr_cp && _request_rtr_cp.request_detail_id) || "";
    this.return_header_id = (_request_rtr_cp && _request_rtr_cp.return_header_id) || 0;
    this.authorizetion_type = (_request_rtr_cp && _request_rtr_cp.authorizetion_type) || "";
    this.is_eol = (_request_rtr_cp && _request_rtr_cp.is_eol) || "";
    this.return_ref_number = (_request_rtr_cp && _request_rtr_cp.return_ref_number) || "";
    this.internal_ref_number = (_request_rtr_cp && _request_rtr_cp.internal_ref_number) || "";
  }
}