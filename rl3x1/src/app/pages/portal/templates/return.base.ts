import { ActivatedRoute, Router } from "@angular/router";
import { ReturnService } from "./return.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  _returnsObject,
  UploadedFiles,
  _OrderObject,
  returnfreight,
  items,
  returnExtra,
  address,
  orderExtra,
  return_DC,
  customer_display,
  address_display,
  ReturnReason,
  _additionalHeaderInfo,
  _mainRMAObj,
  _orderobject_ga_ia,
  items_ga,
  customer_ga,
  address_ga,
  _returnObject_bp,
} from "./return.model";
import { Util, TypedJson } from "src/app/app.util";
import { NgForm } from "@angular/forms";
import { TemplateServices } from "./template.service";
import * as moment from "moment-timezone";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Title } from "@angular/platform-browser";
import { HostListener } from "@angular/core";
import { element } from "@angular/core/src/render3";
import { allocExpando } from "@angular/core/src/render3/instructions";
import { objectEach } from "highcharts";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { debug } from "util";
import { Address } from "src/app/shared/address.model";
import { debugOutputAstAsTypeScript } from "@angular/compiler";
import { Guid } from "guid-typescript";
import { file } from 'src/app/back-office/ga-returns/ga_returns.model';
declare var $;
export class returnBase {
  //searchOrderDisplay: Array<_OrderObject> = [];
  shipmentObj: any;
  _postBP_returnRequest = new _returnObject_bp;
  _bp_files = new file;
  shippingAddress: string;
  hasShippingAddress: boolean = false;
  customer_display: customer_display;
  address_display: address_display;
  isLoaded: boolean = false;
  templateNo: string;
  formname: string;
  brand: string;
  return_Order_Number: string;
  hereby: boolean = false;
  reasons: Array<any>;
  found: boolean = true;
  _mainRMAObj: _mainRMAObj = new _mainRMAObj();
  _addHeaderInfo: _additionalHeaderInfo = new _additionalHeaderInfo();
  _customerNewAddres: address = new address();
  _internal_ref_number: string;
  parentReturnReasons: Array<any> = [];
  multilevelReturnReason: Array<any> = [];
  return_freight: Array<any>;
  order: _returnsObject;
  ordernumber: string = "";
  hash: string;
  language: string;
  numberOfParcels: number = 1;
  imageData: UploadedFiles = new UploadedFiles();
  returnfreight: any = [];
  address_popupdisplay: string = "none";
  selected_in_freight: any = [];
  selected_out_freight: any = [];
  track_status: any;
  parcel_track_status: any;
  email: string = "";
  ReturnDaysValid: boolean = true;
  ReturnDays: number = 0;
  actual_language_code: string;
  processableItems: Array<_OrderObject> = [];
  arr: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _returnService: ReturnService,
    private _util: Util,
    private _router: Router,
    private templateService: TemplateServices,
    private window: Window,
    private titleService: Title,
    private ngxUiLoaderService: NgxUiLoaderService
  ) { }
  freightObj: returnfreight;
  _address: address = new address();
  _states: any = [];
  _country: any = [];
  stateName: string = "";
  showPopup: boolean = false;
  brandconfig: any;
  FAQ: any;
  isInside: boolean = false;
  langKeyVal: any;
  current_customer_data: Array<_OrderObject> = [];
  is_pending_ub_case: boolean = false;

  getlangval(key) {
    if (this.langKeyVal) {
      let langObj = this.langKeyVal.filter(
        f => f.LanugaugeKey == key && f.formname == this.formname
      )[0];
      if (langObj) {
        if (langObj.ChangedLangValue) {
          return langObj.ChangedLangValue;
        } else return langObj.EngLangValue;
      }
    }
  }

  getlangbykey(key) {
    // debugger;
    if (this.langKeyVal) {
      let langObj = this.langKeyVal.filter(
        f =>
          f.EngLangValue.toLowerCase() == key.toLowerCase() &&
          f.formname == this.formname
      )[0];
      //debugger;
      if (langObj) {
        if (langObj.ChangedLangValue) {
          return langObj.ChangedLangValue;
        } else return langObj.EngLangValue;
      }
    }
  }

  maxParcels: Number;
  GetOrderData() {
    //debugger;
    var promise = new Promise((resolve, reject) => {
      this.order = new _returnsObject();
      this._returnService.order(this.getParamData()).subscribe(
        data => {
          debugger;
          if (data.payload != null) {
            resolve(data);
            this.ReturnDays = data.payload.ReturnDays;
          }
        },
        error => {
          console.log(error);
          reject();
        }
      );
    });
    return promise;
  }

  setBrandConfig() {
    //debugger;
    var promise = new Promise((resolve, reject) => {
      this._returnService.brandConfig(this.brand, this.language).subscribe(
        data => {
          //debugger;
          this.langKeyVal = JSON.parse(data.langconfig).languageData;
          this.brandconfig = JSON.parse(data.brandconfig);
          this.FAQ = JSON.parse(data.faqConfig).FAQ;
          //debugger;
          this._returnService.langKeyVal = JSON.parse(
            data.langconfig
          ).languageData;
          this._returnService.brandconfig = JSON.parse(data.brandconfig);
          this._returnService.FAQ = JSON.parse(data.faqConfig).FAQ;

          this.actual_language_code = this.language;

          let lang = JSON.parse(data.LanguageList).languageList.filter(
            x => x.Code.toLowerCase() === this.language.toLowerCase()
          );

          if (lang.length == 0) {
            let defaultLang = JSON.parse(data.LanguageList).languageList.filter(
              x => x.IsDefault === true
            );
            if (defaultLang.length != 0) {
              this.language = defaultLang[0].Code;
            }
          }

          $("#appFavicon").attr(
            "href",
            this.brandconfig != null && this.brandconfig.Logo
              ? "assets/img/" +
              this.brandconfig.PartnerName.toLowerCase() +
              "-favicon.ico"
              : "assets/img/favicon.ico"
          );

          if (this.formname == "Search Page") {
            this._returnService.lblSummaryLabel = this.getlangval(
              "lbl_banner_search"
            );
            this.titleService.setTitle(this._returnService.lblSummaryLabel);
          } else if (this.formname == "Summary") {
            this._returnService.lblSummaryLabel = this.getlangval(
              "lbl_banner_returnconfirm"
            );
            this.titleService.setTitle(this._returnService.lblSummaryLabel);
          } else if (this.formname == "Check Status") {
            this._returnService.lblSummaryLabel = this.getlangval(
              "lbl_banner_returnstatus"
            );
            this.titleService.setTitle(this._returnService.lblSummaryLabel);
          } else if (this.formname == "TrackAll") {
            this._returnService.lblSummaryLabel = this.getlangval(
              "lbl_return_history"
            );
            this.titleService.setTitle(this._returnService.lblSummaryLabel);
          }
          if (this.formname == "Return") {
            this._returnService.lblSummaryLabel = this.getlangval(
              "lbl_banner_search"
            );
            this.titleService.setTitle(this._returnService.lblSummaryLabel);

            this.GetOrderData().then(
              (data: any) => {
                // debugger;
                this.order.customer_order = new _OrderObject(data.payload);
                if (this.order.customer_order.order_number.length <= 0) {
                  return;
                }
                this.populateOrder(data);
                resolve();
              },
              dataError => {
                reject();
              }
            );
          } else if (
            this.formname == "Summary" ||
            this.formname == "Check Status"
          ) {
            this.isLoaded = true;
            this.getReturnOrder().then(
              dataRes => {
                this.isLoaded = false;
                resolve();
              },
              dataError => {
                reject();
              }
            );
          }
        },
        error => {
          //console.log(error);
        }
      );
    });
    return promise;
  }

  getParamData() {
    let params: string = "";
    params += this.ordernumber.length > 0 ? this.ordernumber + "|" : "|";
    params += this.email.length > 0 ? this.email + "|" : "|";
    params += this.language.length > 0 ? this.language + "|" : "|";
    params += this.brand.length > 0 ? this.brand : "";
    return params;
  }

  chechkALL(event) {
    const checked = event.target.checked;
    this.current_customer_data.forEach(item => (item.isSelected = checked));
  }

  chechkSRNO(event, srno: string) {
    const checked = event.target.checked;
    for (var val of this.current_customer_data) {
      if (val.serial_number == srno) {
        val.isSelected = checked;
        sessionStorage.setItem(
          "searchItemChechked",
          JSON.stringify(this.current_customer_data)
        );
      }
    }
    if (!checked) {
      for (var val of this.current_customer_data) {
        if (val.serial_number == srno) {
          val.isSelected = false;
          sessionStorage.setItem(
            "searchItemChechked",
            JSON.stringify(this.current_customer_data)
          );
        }
      }
    }
    this.found = this.current_customer_data.some(el => el.isSelected == false);

    if (!this.found) {
      $("#allcb").prop("checked", true);
    } else {
      $("#allcb").prop("checked", false);
    }
  }

  deleteItem(i: number) {
    this.current_customer_data.splice(i, 1);
    this.processableItems.splice(i, 1);
    sessionStorage.setItem(
      "searchItemChechked",
      JSON.stringify(this.current_customer_data)
    );
  }

  tempVal: Number = 0;
  minVal: Number = 0;
  serviceLevel: string = "";
  returnFreightObj: any = "";
  GetDataFromOrderService() {
    debugger;
    let obj = this.templateService.getOrderObject();
    if (obj) {
      this.reasons = obj.reasons;
      this.order = obj._order;
      let allitems = [];
      allitems = obj.current_selected_item;
      allitems.forEach(element => {
        if (element.isSelected == true) {
          this.processableItems.push(element);
          this.fetchAddHeaderInfo();
        }
      });
      // debugger;
      this.returnfreight = obj.returnfreight;

      this.shippingAddressList = obj.shippingAddressList;
      this.order.return_DC = obj.shippingAddress;
      this._address = obj._address;
      this._states = obj._states;
      this._country = obj._country;
      this.brandconfig = obj.brandconfig;
      this.langKeyVal = obj.langconfig;
      this.customer_display = obj.customer_display;
      this.serialNumber = obj.serialNumber;
      this.maxParcels = obj.maxParcels;
    }
  }

  getReturnOrder() {
    var promise = new Promise((resolve, reject) => {
      this._returnService
        .returnOrder(this.ordernumber + "|" + this.language)
        .subscribe(
          data => {
            if (data.payload != null) {
              this.order = new _returnsObject(data.payload);
              this.order.return_DC = new return_DC(data.return_address);
              this.customer_display = new customer_display(
                JSON.parse(JSON.stringify(this.order.customer))
              );
              this.return_freight = data.return_freight;
              this.track_status = data.track_status;
              this.parcel_track_status = data.parcel_track_status;
              if (this.formname == "Summary")
                $("#lblSummaryLabel").html(
                  this.getlangval("lbl_banner_search")
                );
              else if (this.formname == "Check Status")
                $("#lblSummaryLabel").html(
                  this.getlangval("lbl_banner_search")
                );
              this._returnService.orderFound = true;
            }
          },
          error => {
            reject();
          }
        );
    });
    return promise;
  }

  totalNumberOfParcel: any = [{ val: 1 }];
  shippingAddressList: any = [];
  customerShippingAddressList: any = new Array<Address>();
  packageWeight: number = 0;
  serialNumber: number = 0;
  orderAmount: number = 0;
  SelectedFreight: string = "";

  selectFreight(Obj) {
    this._addHeaderInfo.selected_inbound_freight.push(Obj);
  }

  selectFreightOut(Obj) {
    this._addHeaderInfo.selected_outbound_freight.push(Obj);
  }

  getQtyArray(max: number): any {
    let arr1: Array<Number> = [];
    let num: Number = Number(max);
    for (var i = 1; i <= num; i++) arr1.push(i);
    return arr1;
  }

  triggerFile(index: string) {
    console.log("proffofpurchase");
    $("#file_" + index).trigger("click");
  }
  // triggerFile1(index: string) {
  //   console.log("proffofpurchase");
  //   $("#filebp").trigger("click");
  // }

  removeUploadedImage(image, item) {
    item.items.forEach(element => {
      if (element.product_number == item.product_number) {
        const index = element.files.indexOf(image, 0);
        if (index > -1) {
          element.files.splice(index, 1);
        }
      }
    });
  }

  validateImages(files, isItemSelected): boolean {
    console.log(files)
    console.log(isItemSelected)

    let _totalSize = 0;
    if (isItemSelected) {
      if (files.length > 0) {
        if (files.length <= 5) {
          var pattern = /.gif, .jpg, .jpeg, .png, .doc, .docx, .xlsx, .xls, .ppt/;
          for (let index = 0; index < files.length; index++) {
            // debugger;
            // if (!files[index].type.match(pattern)) {
            //   this._util.error("Invalid file selected, valid files are of .gif, .jpg, .jpeg, .png, .doc, .docx, .xlsx, .xls, .ppt types", "Alert");
            //   return false;
            // }
            _totalSize = files[index].size;
          }
          if (_totalSize > 5000000) {
            this._util.error(this.getlangval("lbl_banner_search"), "Error");
            return false;
          }
        } else {
          this._util.error(this.getlangval("lbl_banner_search"), "Error");
          return false;
        }
      } else {
        this._util.error(this.getlangval("lbl_banner_search"), "Error");
        return false;
      }
    } else {
      this._util.error(this.getlangval("lbl_banner_search"), "Error");
      return false;
    }
    return true;
  }

  isInWarranty: boolean = false;
  onReasonChange(RMAAcode: string, _item: items, i: number) {
    // debugger;
    if (RMAAcode != "undefined") {
      //let element: items = this.order.customer_order.items.filter(
      let element: items = this.processableItems[i].items.filter(
        element => element.product_number == _item[0].product_number
      )[0];
      let reasonValue = this.reasons.filter(p => p.rma_action_code == RMAAcode);
      element.return_reason = reasonValue[0];
    }
  }

  onReasonChangeGAIA(RMAAcode: string, _item: items_ga, i: number) {
    if (RMAAcode != "undefined") {
      //console.log("this.gaiaCustomer", this.gaiaCustomer.items);
      let reasonValue = this.reasons.filter(p => p.rma_action_code == RMAAcode);
      this.gaiaCustomer.items.forEach(element => {
        //debugger;
        if (element.uniques_id == _item.uniques_id) {
          element.return_reason = reasonValue[0];
        }
      });
    }
  }

  handleFile(e, item, isItemSelected, fileupload, iPos) {
    console.log(e);
    // debugger;
    var files = e.target.files;
    if (files != null) {
      console.log(files);
      if (files.length > 0) {
        var pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.jpg|.jpeg|.png|.xlsx|.xls|.doc|.docx|.txt|.pptx|.pdf)$/;
        for (let index = 0; index < files.length; index++) {
          if (!files[index].name.match(pattern)) {
            //this._util.error(this.getlangval("lbl_banner_search"), "Alert");
            this._util.error(
              this.getlangval("lbl_invaild_file_select"), "Alert"
            );
            return;
          }
        }
        //==========For Upload Api============//
        if (files.length > 0) {
          console.log(files)
          if (this.validateImages(files, isItemSelected)) {
            let _formData: FormData = new FormData();
            for (let i = 0; i < files.length; i++) {
              _formData.append("UserImage", files[i]);
              //this.processableItems[iPos].items[0].files.push(files[i]);
              console.log(_formData.getAll("name"));
            }

            this._returnService.uploadImages(_formData).subscribe(
              data => {
                if (data.files != undefined && data.files != null) {
                  // debugger;
                  this.processableItems.forEach(element => {
                    if (element.serial_number == item.serial_number) {
                      for (let index = 0; index < data.files.length; index++) {
                        //debugger;
                        if (element.items[0].files.length > 0) {
                          element.items[0].files.splice(0, 1);
                        }
                        element.items[0].files.push({
                          type: data.files[index].split("/").pop(),
                          url: data.files[index],
                          name: data.files[index].split("/").pop()
                        });
                        //item.files.push(data.files);
                        //debugger;
                        //element.items[0].files.push(data.files);
                        //console.log( " this.processableItems",this.processableItems);
                      }
                    }
                  });
                }
              },
              errors => console.log(errors)
            );
          }
          //==========End For Upload Api============//
        }
      }
    }
    fileupload.value = "";
  }

  gaiaCustomer: _orderobject_ga_ia = new _orderobject_ga_ia();
  gaiaNewItems: items_ga = new items_ga();
  // gaiaItems: any = new Array<Address>();

  new_added_address: address = new address();
  updateAddress() {
    this.ngxUiLoaderService.start();
    this._address = new address();
    if (this.new_added_address) {
      this._address = this.new_added_address;

      let selected_state = this._states.filter(
        p => p.StateName == this.new_added_address.state
      );

      let selected_country = this._country.filter(
        c => c.CountryCode == this.new_added_address.country_code
      );
      this._address.country_id = selected_country[0].CountryID;
      this._address.country = selected_country[0].CountryName;
      this._address.country_code = selected_country[0].CountryCode;

      this._address.state_id = selected_state[0].StateID;
      this._address.complete_address +=
        this.new_added_address.Company.length <= 0
          ? ""
          : this.new_added_address.Company + ", ";
      this._address.complete_address +=
        this.new_added_address.building.length <= 0
          ? ""
          : this.new_added_address.building + ", ";
      this._address.complete_address +=
        this.new_added_address.street1.length <= 0
          ? ""
          : this.new_added_address.street1 + ", ";
      this._address.complete_address +=
        this.new_added_address.street2.length <= 0
          ? ""
          : this.new_added_address.street2 + ", ";
      this._address.complete_address +=
        this.new_added_address.city.length <= 0
          ? ""
          : this.new_added_address.city + ", ";
      this._address.complete_address +=
        this.new_added_address.state.length <= 0
          ? ""
          : this.new_added_address.state + ", ";
      this._address.complete_address +=
        this.new_added_address.country_code.length <= 0
          ? ""
          : this.new_added_address.country_code + ", ";
      this._address.complete_address +=
        this.new_added_address.postal_code.length <= 0
          ? ""
          : this.new_added_address.postal_code;
    }

    this._address.isDefault = true;
    this.customerShippingAddressList.forEach(element => {
      // debugger;
      element.isDefault = false;
    });

    this.customerShippingAddressList.push(this._address);

    this._addHeaderInfo.select_customer.address = this._address;
    this._addHeaderInfo.select_customer.address.complete_address = this._address.complete_address;
    // debugger;
    console.log(this.customerShippingAddressList);
    this.new_added_address = new address();
    // debugger;
    this.new_added_address.country_code = this._addHeaderInfo.select_customer.address.country_code;
    this.ngxUiLoaderService.stop();
  }

  chechkAddress(item, indx) {
    this.customerShippingAddressList.forEach(element => {
      element.isDefault = false;
    });

    this.customerShippingAddressList[indx].isDefault = true;
    console.log(this.customerShippingAddressList[indx]);
    this._addHeaderInfo.select_customer.address = item;
    this._addHeaderInfo.select_customer.address.complete_address =
      item.complete_address;
    $("#addressModal").modal("hide");
  }

  closeModalDialog() {
    $("#addressModal").modal("hide"); //set none css after close dialog
  }

  statusNumber(item): number {
    let obj = this.track_status.filter(
      _status => _status.code == item.status.code
    )[0];
    if (obj) {
      let seq_number = obj.status_sequence;
      return seq_number;
    } else return 1;
  }

  onBack() {
    $("#lblSummaryLabel").html(this.getlangval("lbl_banner_search"));
    this._router.navigate([
      this._returnService.getTemplateSchema([{ key: "step", value: "step1" }])
    ]);
  }

  goBackHome() {
    this._router.navigate([
      this._returnService.getTemplateSchema([{ key: "step", value: "search" }])
    ]);
  }

  goSearchPage() {
    this.window.location.href = this._returnService.getTemplateSchema([
      { key: "step", value: "search" },
      { key: "ordernumber", value: "" }
    ]);
  }

  goTrackStatus() {
    //debugger;
    this.window.location.href = this._returnService.getTemplateSchema([
      { key: "step", value: "track" },
      { key: "ordernumber", value: this._internal_ref_number }
    ]);
  }

  ValidateEmail(emailvalue) {
    var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(emailvalue)) {
      return false;
    } else {
      return true;
    }
  }

  isSubmit: boolean = false;

  saveGAIA(issameaddress: string, dateValue: string) {
    this.arr = [];

    this.gaiaCustomer.items.forEach(element => {
      this.arr.push(element.serial_number);
    });
    let chkDuplicate = this.find_duplicate_in_array(this.arr);
    //debugger;
    if (!chkDuplicate) {
      this._util.error("Serial # already exists.", "warning");
      //this.arr.splice(this.itemCount, 1);
      return;
    }
    this.gaiaCustomer.delivery_info = new customer_ga();
    this.gaiaCustomer.delivery_address = new address_ga();

    if (issameaddress == "yes") {
      this.gaiaCustomer.delivery_info = this.gaiaCustomer.billing_info;
      this.gaiaCustomer.delivery_address = this.gaiaCustomer.billing_address;
    }

    //this.validateGAIA();
    if (this.validateGAIA(dateValue)) {
      console.log("this.gaiaCustomer", JSON.stringify(this.gaiaCustomer));
      // debugger;
      this.ngxUiLoaderService.start();
      this._returnService.saveGAIA(this.gaiaCustomer).subscribe(retvalue => {
        // debugger;
        this.ngxUiLoaderService.stop();
        if (
          retvalue != null &&
          retvalue != undefined &&
          retvalue.recordsets[0][0].status == "Success"
        ) {
          this.isSubmit = false;
          this._util.success(
            "Request successfully submitted - " +
            retvalue.recordsets[0][0].return_order_number,
            "Alert"
          );
          this._internal_ref_number = retvalue.recordsets[0][0].line;
          this.goToConfirmationGAIA(retvalue.recordsets[0][0].line);
        } else {
          this._util.error(this.getlangval("lbl_banner_search"), "Alert");
        }
      });
    }
  }

  validateGAIA(dateValue: string): boolean {
    // debugger;
    // if (this.gaiaCustomer.billing_info.company_name.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_name'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_info.company_name.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_delvery_comp_name'), "Alert");
    //   return;
    // } else if (
    //   this.gaiaCustomer.billing_info.email != "" &&
    //   !this.ValidateEmail(this.gaiaCustomer.billing_info.email)
    // ) {
    //   this._util.error(this.getlangval('lbl_alert_valid_email'), "Alert");
    //   return;
    // } else if (
    //   this.gaiaCustomer.delivery_info.email != "" &&
    //   !this.ValidateEmail(this.gaiaCustomer.delivery_info.email)
    // ) {
    //   this._util.error(this.getlangval('lbl_alert_valid_delivery_email'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.billing_info.first_name.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_com_firstname'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_info.first_name.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_dilvry_firstname'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.billing_info.last_name.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_lastname'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_info.last_name.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_dilvry_lastname'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.billing_address.address_line1.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_address1') , "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_address.address_line1.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_dilvry_address1'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.billing_address.postal_code.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_zip') , "Alert");
    //   return;
    // } else if (this.gaiaCustomer.billing_address.country_code.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_country'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.billing_address.city.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_city'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_address.country_code.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_comp_country') , "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_address.city.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_deliv_city'), "Alert");
    //   return;
    // } else if (this.gaiaCustomer.delivery_address.postal_code.length <= 0) {
    //   this._util.error(this.getlangval('lbl_alert_enter_deliv_zip') , "Alert");
    //   return;
    // }
    // debugger;
    for (var val of this.gaiaCustomer.items) {
      if (val.serial_number.length <= 0) {
        // this._util.error("Please provide a valid Serial Number.", "Alert");
        return;
      }
      if (val.return_reason.rma_action_code.length <= 0) {
        // this._util.error("Please provide a Return reason.", "Alert");
        return;
      }

      if (this.gaiaCustomer.items[0].date_of_purchase.length <= 0) {
        this.gaiaNewItems.date_of_purchase = dateValue;
      }
    }
    return true;
  }

  SaveRMA() {
    this.isSubmit = true;

    if (
      this._addHeaderInfo.primary_email != "" &&
      !this.ValidateEmail(this._addHeaderInfo.primary_email)
    ) {
      this._util.error("Please provide a valid email.", "warning");
      return;
    }
    if (
      this._addHeaderInfo.secondary_email != undefined &&
      this._addHeaderInfo.secondary_email != "" &&
      !this.ValidateEmail(this._addHeaderInfo.secondary_email)
    ) {
      this._util.error("Please provide a valid email.", "warning");
      return;
    }
    this._mainRMAObj = new _mainRMAObj();
    this._mainRMAObj._addHeaderInfo = this._addHeaderInfo;
    this._mainRMAObj._OrderObject = this.processableItems;

    console.log("_mainRMAObj", JSON.stringify(this._mainRMAObj));
    this.ngxUiLoaderService.start();
    this._returnService.saveTempRMA(this._mainRMAObj).subscribe(retvalue => {
      this.ngxUiLoaderService.stop();
      if (
        retvalue != null &&
        retvalue != undefined &&
        retvalue.recordsets[0][0].status == "Success"
      ) {
        this.isSubmit = false;
        this._util.success(
          "Request successfully submitted - " +
          retvalue.recordsets[0][0].return_order_number,
          "Alert"
        );
        this._internal_ref_number = retvalue.recordsets[0][0].line;
        this.goToConfirmation(retvalue.recordsets[0][0].line);
      } else {
        this._util.error(this.getlangval("lbl_banner_search"), "Alert");
      }
    });
  }

  onContinue(orderForm: NgForm) {
    if (orderForm.valid) {
      let returnItems = this.order.customer_order.items;

      if (returnItems.length <= 0) {
        this._util.error(this.getlangval("lbl_banner_search"), "Alert");
        return;
      }
      this.templateService.SetDataToOrderService({
        _order: this.order,
        returnfreight: this.return_freight,
        //freightObj: this.freightObj,
        shippingAddressList: this.shippingAddressList,
        shippingAddress: this.order.return_DC,
        customer: this.order.customer,
        _address: this._address,
        _states: this._states,
        reasons: this.reasons,
        brandconfig: this.brandconfig,
        langconfig: this.langKeyVal,
        customer_display: this.customer_display,
        serialNumber: this.serialNumber,
        maxParcels: this.maxParcels,
        _country: this._country
      });
      //=======New For Calculation========//
      this._router.navigate([
        this._returnService.getTemplateSchema([{ key: "step", value: "step2" }])
      ]);
      $("#lblSummaryLabel").html(this.getlangval("lbl_banner_search"));
    } else {
      this._util.error(this.getlangval("lbl_banner_search"), "Alert");
    }
  }

  goToConfirmationGAIA(refNo: string) {

    this.window.location.href = this._returnService.getTemplateSchema([
      { key: "step", value: "reqconfirm" },
      { key: "ordernumber", value: refNo }
    ]);
  }
  goToConfirmation(refNo: string) {

    this.window.location.href = this._returnService.getTemplateSchema([
      { key: "step", value: "step3" },
      { key: "ordernumber", value: refNo }
    ]);
  }

  goToTrackStatus(refNo: string, urlValue: string) {

    this._router.navigate([
      this._returnService.getTemplateSchema([
        { key: "step", value: "track" },
        { key: "ordernumber", value: refNo }
      ])
    ]);
  }

  onSearch(searchForm: NgForm) {

    if (!this.ordernumber || this.ordernumber.length <= 0) {
      this._util.error(this.getlangval("lbl_alert_validate_serial"), "Alert");
      return;
    }
    //debugger;
    this.ngxUiLoaderService.start();
    this.GetOrderData().then((data: any) => {
      this.ngxUiLoaderService.stop();
      if (data.payload.id) {
        if (data.payload.brand.toLowerCase() === this.brand.toLowerCase()) {
          this.ordernumber = "";
          if (this.current_customer_data.length == 0) {
            this.order.customer_order = new _OrderObject(data.payload);
            this.order.returnfreight = data.return_freight;
            sessionStorage.setItem(
              "frieghtItem",
              JSON.stringify(data.return_freight)
            );
            this.return_freight = data.return_freight;
            this.order.return_DC = data.return_address[0];
            this._states = data.states;
            this._country = data.country;
            this.current_customer_data.push(this.order.customer_order);

            this.populateOrder(data);
          } else {
            var existItem = this.current_customer_data.find(
              x => x.serial_number == this.ordernumber
            );
            if (existItem) {
              this._util.warning("Serial# already exists", "");
            } else {
              this.order.customer_order = new _OrderObject(data.payload);
              this.order.returnfreight = data.return_freight;
              this.order.return_DC = data.return_address[0];
              this.return_freight = data.return_freight;
              this._states = data.states;
              this._country = data._country;
              this.current_customer_data.push(this.order.customer_order);

              sessionStorage.setItem(
                "frieghtItem",
                JSON.stringify(data.return_freight)
              );
              this.populateOrder(data);
            }
          }
        } else {
          this._util.error(
            "Serial# does not belongs to current Brand.",
            "Alert"
          );
          return;
        }
      } else {
        this._util.error(this.getlangval("lbl_unknownserial"), "Alert");
        return;
      }
    });
  }

  populateOrder(data) {
    //debugger;
    this.order.customer_order = new _OrderObject(data.payload);
    this.maxParcels = data.payload.maxParcels;
    this.reasons = data.reason.filter(f => f.on_CP == true);
    this.shippingAddressList = data.return_address;

    this.order.return_DC = new return_DC(
      this.shippingAddressList.filter(address => address.itemlevel == 0)[0]
    );

    this.order.customer = this.order.customer_order.customer;
    this._address = new address(this.order.customer_order.customer.address);

    this.isLoaded = true;

    if (this.getParamData().indexOf("|") > 0) {
      this.customer_display = new customer_display(
        JSON.parse(JSON.stringify(this.order.customer))
      );
      // debugger;
      this.templateService.SetDataToOrderService({
        _order: this.order,
        returnfreight: this.return_freight,
        //freightObj: this.freightObj,
        shippingAddressList: this.shippingAddressList,
        shippingAddress: this.order.return_DC,
        customer: this.order.customer,
        _address: this._address,
        _states: this._states,
        _country: this._country,
        reasons: this.reasons,
        brandconfig: this.brandconfig,
        langconfig: this.langKeyVal,
        customer_display: this.customer_display,
        serialNumber: this.serialNumber,
        maxParcels: this.maxParcels,
        current_selected_item: this.current_customer_data
      });
      //debugger;
      //this._returnService.orderFound = true;
      //this._router.navigate([this._returnService.getTemplateSchema([{ key: 'step', value: 'step1' }, { key: 'ordernumber', value: this.ordernumber }])]);
      //this.formname = 'Return';
    }
    $("#lblSummaryLabel").html(this.getlangval("lbl_banner_search"));
  }

  replaceProduct() {
    var counttrue = 0;
    for (var val of this.current_customer_data) {
      if (val.isSelected) {
        counttrue = counttrue + 1;
      }
    }
    if (counttrue <= 0) {
      this._util.error(
        "Please select at-least one Product process Request Replacement.",
        "Alert"
      );
      return;
    }
    this.ngxUiLoaderService.start();
    let orderItem: any = "";
    this.processableItems = [];
    for (var val of this.current_customer_data) {
      if (val.isSelected) {
        val.customer.address.country_code = val.customer.address.country;
        val.customer.address.state = val.customer.address.state_code;
        val.items[0].extra.return_DC = this.shippingAddressList.code;
        val.items[0].extra.service_type = "Standard";
        this.processableItems.push(val);
        this.fetchAddHeaderInfo();
      }
    }
    sessionStorage.setItem(
      "searchItemChechked",
      JSON.stringify(this.processableItems)
    );

    var frieghtItem = sessionStorage.getItem("frieghtItem");
    if (sessionStorage.getItem("frieghtItem") === null) {
      sessionStorage.setItem(
        "frieghtItem",
        JSON.stringify(this.return_freight)
      );
    }

    this.templateService.SetDataToOrderService({
      _order: this.order,
      returnfreight: this.returnfreight,
      shippingAddressList: this.shippingAddressList,
      shippingAddress: this.order.return_DC,
      customer: this.order.customer,
      _address: this._address,
      _states: this._states,
      _country: this._country,
      reasons: this.reasons,
      brandconfig: this.brandconfig,
      langconfig: this.langKeyVal,
      customer_display: this.customer_display,
      serialNumber: this.serialNumber,
      maxParcels: this.maxParcels,
      current_selected_item: this.processableItems
    });

    this.ngxUiLoaderService.stop();
    this._router.navigate([
      this._returnService.getTemplateSchema([
        { key: "step", value: "step1" },
        { key: "ordernumber", value: Guid.create() }
      ])
    ]);
  }

  goPrevSearch() {
    this.ngxUiLoaderService.start();

    this._router.navigate([
      this._returnService.getTemplateSchema([
        { key: "step", value: "search" },
        { key: "ordernumber", value: "" }
      ])
    ]);
    setTimeout(() => {
      this.onSearch;
    }, 300);

    this.ngxUiLoaderService.stop();
  }

  goPrevStep1() {
    this._router.navigate([
      this._returnService.getTemplateSchema([{ key: "step", value: "step1" }])
    ]);
  }

  fetchAddHeaderInfo() {
    debugger;
    if (this.processableItems.length >= 1) {

      this._addHeaderInfo.select_customer = this.processableItems[0].customer;
      this.customer_display = this._addHeaderInfo.select_customer;
      this._addHeaderInfo.primary_email = this.processableItems[0].customer.primary_email;
      this._addHeaderInfo.secondary_email = this.processableItems[0].customer.secondary_email;
    }
  }

  replaceProductContinue() {
    // debugger;

    this.formname = "Return";
    this.templateService.SetDataToOrderService({
      _order: this.order,
      returnfreight: this.returnfreight,
      shippingAddressList: this.shippingAddressList,
      shippingAddress: this.order.return_DC,
      customer: this.order.customer,
      _address: this._address,
      _states: this._states,
      _country: this._country,
      reasons: this.reasons,
      brandconfig: this.brandconfig,
      langconfig: this.langKeyVal,
      customer_display: this.customer_display,
      serialNumber: this.serialNumber,
      maxParcels: this.maxParcels,
      current_selected_item: this.processableItems
    });

    // //Start Check POP validation for OOW products
    //debugger;
    //this.processableItems.filter(el => el.isSelected == true);
    for (var val of this.processableItems) {
      if (val.isSelected) {
        if (val.items[0].return_reason.rma_action_name.length <= 0) {
          this._util.error(this.getlangval("lbl_return_reason_mandat"), "Alert");
          return;
        }
      }
    }
    var oow_prod = [];
    var filenotfound = true;
    oow_prod = this.processableItems.filter(el => el.warranty_status_id == 84);
    oow_prod.forEach(value => {
      value.items.forEach(element => {
        if (element.files.length == 0) {
          filenotfound = false;
          return;
        }
      });
    });

    if (!filenotfound) {
      this._util.error(this.getlangval("lbl_proof_of_purchase"), "Alert");
      return;
    }
    this.ngxUiLoaderService.start();
    //End Check POP validation for OOW products
    sessionStorage.setItem(
      "searchItemChechked",
      JSON.stringify(this.processableItems)
    );
    var frieghtItem = sessionStorage.getItem("frieghtItem");
    if (sessionStorage.getItem("frieghtItem") === null) {
      sessionStorage.setItem("frieghtItem", JSON.stringify(this.returnfreight));
    }
    // debugger;
    this.ngxUiLoaderService.stop();
    this._router.navigate([
      this._returnService.getTemplateSchema([
        { key: "step", value: "step2" },
        { key: "ordernumber", value: this.ordernumber }
      ])
    ]);
  }

  printLabel() {
    this.order.labels.forEach(x => {
      var url = x.url;
      window.open(url, "_blank");
    });
  }

  multiplyShippingCost(_averageCost, _noOfParcels) {
    return _averageCost * _noOfParcels;
  }

  showDefaultImage(img, item) {
    //alert('test'+item.image_url);
    img.src = item.default_image;
  }

  multiReturnReasonChange(_rma_action_code: string, _item: items) {
    var _reason = this.reasons.filter(
      item => item.rma_action_code == _rma_action_code
    );
    //debugger;
    if (_reason.length > 0) {
      _item.return_reason = new ReturnReason(_reason[0]);
    }
  }

  getReturnReason(RMAAcode: string): string[] {
    //debugger;
    let reason = this.reasons.filter(p => p.rma_action_code == RMAAcode);
    console.log("reason Return", reason[0].rma_action_name);
    return reason[0];
  }

  find_duplicate_in_array(arra1): boolean {
    // debugger;
    const object = {};
    const result = [];

    arra1.forEach(item => {
      if (!object[item]) object[item] = 0;
      object[item] += 1;
    });

    for (const prop in object) {
      if (object[prop] > 1) {
        // this._utilily.error("Serial # already exists.", "warning");
        return false;
        //result.push(prop);
      }
    }
    return true;
  }

  startloader() {
    this.ngxUiLoaderService.start();
  }

  stoploader() {
    this.ngxUiLoaderService.stop();
  }

  onsubmitform() {
    if (this._postBP_returnRequest.delivery_info.company_name.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_comp_name'), "Alert");
      return;
    } else if (this._postBP_returnRequest.delivery_info.first_name.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_cont_name'), "Alert");
      return;
    } else if (this._postBP_returnRequest.delivery_info.direct_phone.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_ph_number'), "Alert");
      return;
    } else if (
      this._postBP_returnRequest.delivery_info.email != "" &&
      !this.ValidateEmail(this._postBP_returnRequest.delivery_info.email)
    ) {
      this._util.error(this.getlangval('lbl_alert_enter_valid_email'), "Alert");
      return;
    } else if (this._postBP_returnRequest.delivery_address.address_line1.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_Address'), "Alert");
      return;
    } else if (this._postBP_returnRequest.delivery_address.postal_code.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_zip'), "Alert");
      return;
    } else if (this._postBP_returnRequest.delivery_address.city.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_city'), "Alert");
      return;
    }
    else if (this._postBP_returnRequest.delivery_address.state.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_state'), "Alert");
      return;
    } else if (this._postBP_returnRequest.item_detail.length <= 0) {
      this._util.error(this.getlangval('lbl_alert_enter_model'), "Alert");
      return;
    } else if (this._postBP_returnRequest.delivery_address.country.length <= 0) {
      this._postBP_returnRequest.delivery_address.country = "USA";
    }
    this._postBP_returnRequest.brand = this.brand;
    console.log(JSON.stringify(this._postBP_returnRequest));
    debugger;
    this._returnService.saveBlueParrottReturn(this._postBP_returnRequest).subscribe(
      result => {
        this._internal_ref_number = result.recordsets[0][0].line;
        debugger;
        this._router.navigate([
          this._returnService.getTemplateSchema([
            { key: "step", value: "reqconfirm" },
            { key: "ordernumber", value: this._internal_ref_number }
          ])
        ]);

        setTimeout(() => {
          this._util.success("Request successfully submitted ", "Alert");
        }, 100);
      },
      error => {
        this._util.error(error, "Error");
      }
    );
  }

  handleFileInput(e, fileupload) {
    debugger;

    this._bp_files = new file;
    var files = e.target.files;
    if (files != null) {
      if (files.length > 0) {
        var pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.jpg|.jpeg|.png|.xlsx|.xls|.doc|.docx|.txt|.pptx|.pdf)$/;
        for (let index = 0; index < files.length; index++) {
          if (!files[index].name.match(pattern)) {
            this._util.error(
              this.getlangval("lbl_invaild_file_select"), "Alert"
            );
            return;
          }
        }
        console.log(e.target.files[0].size);
        if (e.target.files[0].size / 1024 / 1024 > 10) {
          this._util.error("please select size less than 10mb", "Alert");
          return;
        }
        //==========For Upload Api============//
        let isItemSelected: boolean = true;
        if (files.length > 0) {
          if (this.validateImages(files, isItemSelected)) {
            let _formData: FormData = new FormData();
            for (let i = 0; i < files.length; i++) {
              _formData.append("UserImage", files[i]);
              //this.processableItems[iPos].items[0].files.push(files[i]);
              console.log(_formData.getAll("name"));
            }
            debugger;
            this._returnService.uploadImages(_formData).subscribe(
              data => {
                console.log(data);
                if (data.files != undefined && data.files != null) {
                  debugger;
                  for (let index = 0; index < data.files.length; index++) {
                    this._postBP_returnRequest.file.name = data.files[index].split("/").pop();
                    this._postBP_returnRequest.file.type = data.files[index].split("/").pop();
                    this._postBP_returnRequest.file.url = data.files[index];
                    console.log(this._postBP_returnRequest.file);
                  }
                  // this.processableItems.forEach(element => {
                  //   if (element.serial_number == item.serial_number) {
                  //     for (let index = 0; index < data.files.length; index++) {
                  //       //debugger;
                  //       if (element.items[0].files.length > 0) {
                  //         element.items[0].files.splice(0, 1);
                  //       }
                  //       element.items[0].files.push({
                  //         type: data.files[index].split("/").pop(),
                  //         url: data.files[index],
                  //         name: data.files[index].split("/").pop()
                  //       });
                  //     }
                  //   }
                  // });
                }
              },
              errors => console.log(errors)
            );
          }
          //==========End For Upload Api============//
        }
      }
    }
    fileupload.value = "";
  }



  bptrackstatus(e) {
    this._internal_ref_number;
    console.log(this._internal_ref_number);
    this._router.navigate([
      this._returnService.getTemplateSchema([
        { key: "step", value: "reqtrack" },
        { key: "ordernumber", value: '' }
      ])
    ]);
  }
}
