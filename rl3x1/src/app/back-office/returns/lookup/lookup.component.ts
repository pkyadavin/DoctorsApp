import { Component, OnInit } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd
} from "@angular/router";
import { ReturnsService } from "../returns.service";
import { ReturnDataService } from "../returns-data.service";
import { Util, Property, TypedJson } from "src/app/app.util";
import { ErrorConstants } from "src/app/shared/Error";
import {
  _OrderObject,
  _returnsObject,
  _additionalHeaderInfo,
  address,
  items
} from "../returns.model";
import * as moment from "moment-timezone";
import { CommonService } from "src/app/shared/common.service";
import { GlobalVariableService } from "src/app/shared/globalvariable.service";
import { _mainRMAObj } from "src/app/pages/portal/templates/return.model";
import { Address } from "src/app/shared/address.model";
import { from } from "rxjs";
import { filter } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-lookup",
  templateUrl: "./lookup.component.html",
  styleUrls: ["./lookup.component.css"]
})
export class LookupComponent extends Property implements OnInit {
  // _mainRMAObj: _mainRMAObj = new _mainRMAObj();
  // _addHeaderInfo: _additionalHeaderInfo = new _additionalHeaderInfo();
  // _customerNewAddres: address = new address();
  validation: boolean;
  productCount: number = 0;
  today: number = Date.now();
  filterText: string;
  selected_in_freight: any = [];
  selected_out_freight: any = [];

  selected_in_freight_value: any = [];
  selected_out_freight_value: any = [];
  //AdvancefilterValue: Advancefilter;
  //_addHeaderInfo: _additionalHeaderInfo; //= new _returns();
  _addHeaderInfo: _additionalHeaderInfo = new _additionalHeaderInfo();
  customerShippingAddressList: any = new Array<Address>();
  _mainRMAObj: _mainRMAObj;
  returnsObject: _returnsObject;
  orderDetailModel: _OrderObject;
  _item: items;
  new_added_address: address = new address();
  processableBOItems: Array<_OrderObject> = [];
  ReturnDays: Number = 0;
  allOrders: any = [];
  public brands: any = [];
  reasons: Array<any>;
  SelectedBrandID: number;
  brandCode: string;
  constructor(
    private _util: Util,
    private _returnService: ReturnsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: ReturnDataService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.brandCode = this._activatedRoute.snapshot.paramMap.get("brandCode");

    this._router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.location.reload();
        //this.renderRMAqueue(this.status);
      });

    $("#closeCollapse").click(function () {
      $(".collapse").collapse("hide");
    });
  }

  SearchOrder() {
    this.getOrderDetail();
  }

  toggleAdvanceSearch() {
    $(".advance-search").toggleClass("open-search");
  }
  // AdvanceSearch() {

  //   this._returnService.orders(this.AdvancefilterValue).subscribe(data => {
  //     debugger;
  //     this.allOrders = TypedJson.parse(data.data[0][0].Orders);
  //     if (!this.allOrders || this.allOrders.length == 0) {
  //       this._util.warning('No record found.', "warrning");
  //     }
  //     else if (this.allOrders && this.allOrders.length == 1) {
  //       this.filterText = this.allOrders[0].order_number;
  //       this._router.navigate(['back-office/returns/initiate/' + this.allOrders[0].internal_order_number]);
  //     }
  //   });
  // }
  openRMA(order) {
    this.filterText = order.order_number;
    this.SearchOrder();
  }
  getOrderDetail() {
    try {
      if (!this.filterText) {
        this._util.error("Please provide your order number.", "Error");
        return;
      }
      //this.orderDetailModel = null;
      var errorMsg = "";
      this._returnService.order(this.getParamData()).subscribe(
        data => {
          console.log(JSON.stringify(data));
          if (data.payload != null || data.payload != "{}") {
            console.log(data.payload.brand)
            console.log(this.brandCode)
            if (data.payload.brand) {
              if (data.payload.brand.toLowerCase() != this.brandCode.toLowerCase()) {
                this._util.error(
                  "Serial# does not belongs to current Brand.",
                  "Error"
                );
                return;
              }
            } else {
              if (data.payload.brand != this.brandCode) {
                this._util.error(
                  "Serial# does not belongs to current Brand.",
                  "Error"
                );
                return;
              }
            }
            if (!data.payload.items) {
              this._util.error(
                "No record found for this order number.",
                "Error"
              );
              return;
            }
            this.ReturnDays = data.payload.ReturnDays;
            this.reasons = data.reason;
            this.selected_in_freight_value = Object.values(
              data.return_freight["inbound_feight"]
            );
            this.selected_out_freight_value = Object.values(
              data.return_freight["outbound_feight"]
            );
            //debugger;
            // if (!data.AccessCodes) {
            //   this._util.error('Sorry, you do not have permissions to create RMA for this brand.', "Error");
            //   return;
            // }
            // var existItem = data.payload.find(
            //   x => x.serial_number == this.processableBOItems
            // );
            var y = 0;
            if (this.processableBOItems.length > 0) {
              var i = 0;
              while (i < this.processableBOItems.length) {
                if (
                  data.payload.serial_number ===
                  this.processableBOItems[i].order_number
                ) {
                  this._util.warning("Serial# already exists", "");
                  y = 1;
                  break;
                }
                i++;
              }
              if (y === 0 && this.processableBOItems.length > 0) {
                this.processableBOItems.push(data.payload);
              }
            } else {
              this.processableBOItems.push(data.payload);
            }
            this.productCount = this.processableBOItems.length;
            this.orderDetailModel = data.payload;
            this.ReturnDays = data.payload.ReturnDays;

            this.Permissions = data.AccessCodes;
            this.LocalAccess = data.AccessCodes.map(function (e) {
              return e.FunctionType;
            });
            for (var val of this.processableBOItems) {
              val.brand = "DSC2";
              if (val.warranty_status_id === 84) {
                val.items[0].files = [];

              }
            }
            sessionStorage.setItem("_orderData", JSON.stringify(data));

            console.log("_orderData...", this.reasons);

          } else {
            errorMsg = "No record found for this order number.";
            this._util.error(errorMsg, "Error");
          }
        },
        error => {
          errorMsg = "No record found for this order number.";
          this._util.error(errorMsg, "Error");
        }
      );
    } catch (err) {
      this._util.error(err, "Error");
    }
  }

  onReasonChange(RMAAcode: string, _item: items, i: number) {
    if (RMAAcode != "undefined") {
      let element: items = this.processableBOItems[i].items.filter(
        element => element.product_number == _item.product_number
      )[0];
      let reasonValue = this.reasons.filter(p => p.rma_action_code == RMAAcode);
      element.return_reason = reasonValue[0];
    }
  }

  getParamData() {
    let params: string = "";
    params += this.filterText.length > 0 ? this.filterText + "|" : "|";
    params += "none|none|" + this.brandCode;
    return params;
  }

  SaveRMA() {
    this.validation = this.validateRMA();
    let internal_ret_number: string;
    if (this.validation) {
      this.fetchAddHeaderInfoforStep2();
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
      this._mainRMAObj._OrderObject = this.processableBOItems;

      console.log("retValue BO....", JSON.stringify(this._mainRMAObj));

      this._returnService.saveGNRequest(this._mainRMAObj).subscribe(retvalue => {
        if (
          retvalue != null &&
          retvalue != undefined &&
          retvalue.recordsets[0][0].status == "Success"
        ) {
          internal_ret_number = retvalue.recordsets[0][0].line;
          this._util.success(
            "Request successfully submitted - " +
            retvalue.recordsets[0][0].return_order_number,
            "Alert"
          );
          this._router.navigate([
            "back-office/returns/confirmation/" +
            this.brandCode +
            "/" +
            internal_ret_number
          ]);
        } else {
          // this._util.error(this.getlangval("lbl_banner_search"), "Alert");
        }
      });
    } else {
      return;
    }
  }

  validateRMA(): boolean {
    for (var val of this.processableBOItems) {
      if (val.items[0].return_reason === undefined) {
        this._util.error("Return Reason is Mandatory.", "Alert");
        return false;
      }
      return true;
    }
  }

  fetchAddHeaderInfoforStep2() {
    this.new_added_address.country_code = this.processableBOItems[0].customer.address.country;
    this._addHeaderInfo.select_customer = this.processableBOItems[0].customer;
    this._addHeaderInfo.primary_email = this.processableBOItems[0].customer.primary_email;
    this._addHeaderInfo.selected_inbound_freight = this.selected_in_freight;
    this._addHeaderInfo.selected_outbound_freight = this.selected_out_freight;
    var cnt = 0;
    for (var val of this.processableBOItems) {
      if (cnt == 0) val.customer.address.isDefault = true;
      val.items[0].extra.service_type = "Standard";

      cnt++;
      this.customerShippingAddressList.push(val.customer.address);
    }
    console.log(this.customerShippingAddressList);
  }

  ValidateEmail(emailvalue) {
    var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(emailvalue)) {
      return false;
    } else {
      return true;
    }
  }
  triggerFile(index: string) {
    console.log("proffofpurchase");
    $("#file_" + index).trigger("click");
  }
  handleFile(e, item, isItemSelected, fileupload, iPos) {
    var files = e.target.files;
    if (files != null) {
      console.log(files);
      if (files.length > 0) {
        var pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.jpg|.jpeg|.png|.xlsx|.xls|.doc|.docx|.txt|.pptx|.pdf)$/;
        for (let index = 0; index < files.length; index++) {
          if (!files[index].name.match(pattern)) {
            //this._util.error(this.getlangval("lbl_banner_search"), "Alert");
            this._util.error("Invalid file selected, valid files are of .gif, .jpg, .jpeg, .png, .doc, .docx, .xlsx, .xls, .ppt types", "Alert");
            return;
          }
        }
        //==========For Upload Api============//
        if (files.length > 0) {
          if (this.validateImages(files, isItemSelected)) {
            let _formData: FormData = new FormData();
            for (let i = 0; i < files.length; i++) {
              _formData.append("UserImage", files[i]);
              console.log(_formData.getAll("name"));
            }

            this._returnService.uploadImages(_formData).subscribe(
              data => {
                if (data.files != undefined && data.files != null) {
                  debugger;
                  this.processableBOItems.forEach(element => {
                    if (element.serial_number == item.serial_number) {
                      console.log("file Test");
                      for (let index = 0; index < data.files.length; index++) {
                        debugger;
                        if (element.items[0].files.length > 0) {
                          element.items[0].files.splice(0, 1);
                        }
                        element.items[0].files.push({
                          type: data.files[index].split("/").pop(),
                          url: data.files[index],
                          name: data.files[index].split("/").pop()
                        });
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
  selectFreight(Obj) {
    this.selected_in_freight = [];
    this.selected_in_freight.push(Obj);
  }

  selectFreightOut(Obj) {
    this.selected_out_freight = [];
    this.selected_out_freight.push(Obj);
  }
  validateImages(files, isItemSelected): boolean {
    let _totalSize = 0;
    if (!isItemSelected) {
      if (files.length > 0) {
        if (files.length <= 5) {
          var pattern = /image-*/;
          for (let index = 0; index < files.length; index++) {
            _totalSize = files[index].size;
          }
          if (_totalSize > 5000000) {
            return false;
          }
        } else {
          return false;
        }
      } else {
        //this._util.error(this.getlangval("lbl_banner_search"), "Error");
        return false;
      }
    } else {
      //this._util.error(this.getlangval("lbl_banner_search"), "Error");
      return false;
    }
    return true;
  }
}
