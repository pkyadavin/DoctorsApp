import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  HostListener
} from "@angular/core";
import {
  _OrderObject,
  address,
  _returnsObject,
  items,
  customer,
  return_DC,
  customer_display,
  ReturnReason,
  returnfreight
} from "../returns.model";
import { Router, ActivatedRoute } from "@angular/router";
import { ReturnsService } from "../returns.service";
import { NgForm } from "@angular/forms";
import { Property, Util } from "src/app/app.util";
import { BsModalComponent } from "ng2-bs3-modal";
import { Location, DatePipe } from "@angular/common";
import { message, modal } from "../../../controls/pop/index";
import * as moment from "moment-timezone";
import { DOCUMENT } from "@angular/common";
import { WINDOW } from "../../../app.window";
import { Guid } from "guid-typescript";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { MetadataService } from "../../MetadataConfig/metadata-config.service.js";
declare var $: any;
@Component({
  selector: "app-order",
  providers: [MetadataService, DatePipe],
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"]
})
export class OrderComponent extends Property implements OnInit {
  @ViewChild("pop") _popup: message;
  @ViewChild("ItemPopup") _itemPopup: modal;
  @ViewChild("AdvanceSearch") _AdvanceSearch: BsModalComponent;
  returnOrder: _returnsObject;
  authorized_approve_date_code: Date = new Date();
  showModel: string = "Reject";
  items: items[] = [];
  isItemSelected: boolean = false;
  status: string;
  fromDate: Date;
  RejectApproveList: any;
  comment: string;
  rejectcode: string;
  return_header_id: BigInteger;
  RejectApproveReason: any = [];
  EANValue: any = [];
  RMANumber: any;
  queueStatus: string;
  orderNumber: string;
  returnReasons: any[] = [];
  returnNotes: any = [];
  returnRMALog: any = [];
  RMAFiles = [];
  brandconfig: any;
  default_return_reason = new ReturnReason();
  is_warranty_approved: any;
  is_item_warranty: boolean = false;
  _address: address = new address();
  _states: any = [];
  return_header_status: boolean = false;
  selectedItemIds: any = [];
  constructor(
    private _util: Util,
    private _router: Router,
    private _location: Location,
    @Inject(WINDOW) private window: Window,
    private _route: ActivatedRoute,
    private _returnService: ReturnsService,
    private _config: MetadataService,
    private _datePipe: DatePipe,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) {
    super();
  }
  changedate(e) {
    console.log(e);
    this.authorized_approve_date_code = e;
    console.log(this.authorized_approve_date_code);
  }
  maxParcels: Number;
  langKeyVal: any;
  isAnyItemScanned: boolean = false;
  return_payload: any = [];
  brandCode: string;
  found: boolean;

  ngOnInit() {
    this.returnOrder = new _returnsObject();
    this.langKeyVal = JSON.parse(
      '[{"LanugaugeKey": "lbl_hover_edit_address",      "EngLangValue": "change",      "ID": 70,      "ChangedLangValue": "change",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_edit_address",      "EngLangValue": "change",      "ID": 70,      "ChangedLangValue": "change",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_customer_changeaddress",      "EngLangValue": "Change Address",      "ID": 70,      "ChangedLangValue": "Change Address",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_address_update_note",      "EngLangValue": "Please indicate/modify the address if you intend to ship it from a different location",      "ID": 70,      "ChangedLangValue": "Please indicate/modify the address if you intend to ship it from a different location",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_street",      "EngLangValue": "Street",      "ID": 70,      "ChangedLangValue": "Street",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_city",      "EngLangValue": "City",      "ID": 70,      "ChangedLangValue": "City",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_postalcode",      "EngLangValue": "Postal Code",      "ID": 70,      "ChangedLangValue": "Postal Code",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_btn_update",      "EngLangValue": "Update",      "ID": 70,      "ChangedLangValue": "Update",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_btn_close",      "EngLangValue": "Close",      "ID": 70,      "ChangedLangValue": "Close",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    }  ]'
    );
    let resultObject: any;

    this.queueStatus = this._route.snapshot.paramMap.get("queue");
    this.orderNumber = this._route.snapshot.paramMap.get("order");
    this.brandCode = this._route.snapshot.paramMap.get("brandCode");
    if (
      (this.queueStatus != undefined || this.queueStatus != null) &&
      (this.orderNumber != undefined || this.orderNumber != null)
    ) {
      this._returnService
        .returnOrder(
          this.orderNumber + "|en-us|" + this.brandCode,
          this.queueStatus.toLowerCase()
        )
        .subscribe(result => {
          if (result) {
            resultObject = result; //JSON.parse(result);
            this.Permissions = resultObject.AccessCodes;
            if (resultObject.AccessCodes) {
              this.LocalAccess = resultObject.AccessCodes.map(function(e) {
                return e.FunctionType;
              });
            } else {
              this._util.error(
                "Sorry, you do not have permissions to create RMA for this brand.",
                "Error"
              );
              this.goBackToQueue();
              return;
            }

            if (!this.hasPermission("View")) {
              this._util.error(
                "Sorry, you do not have permissions, please contact Administrator.",
                "Error"
              );
              this.goBackToQueue();
              return;
            }

            this.returnOrder = resultObject.payload;

            this.return_header_id = resultObject.payload.return_header_id;

            console.log(this.returnOrder);
            if (this.returnOrder.status.code == "PendingApproval") {
              this.return_header_status = true;
            }

            if (this.returnOrder.items.length != 0) {
              this.returnOrder.items.forEach(element => {
                let files_update: any;
                files_update = element.files;
                element.files = JSON.parse(files_update);
              });

              this.is_warranty_approved = this.returnOrder.items.filter(
                e => e.warranty_status_id === 84
              );
              if (this.is_warranty_approved.length != 0) {
                this.is_item_warranty = true;
              }
            }
            this._returnService
              .getReturnNotes(this.orderNumber)
              .subscribe(returnValue => {
                if (returnValue) {
                  this.returnNotes = JSON.parse(returnValue.data[0][0].notes);
                  this.returnRMALog = JSON.parse(returnValue.data[1][0].rmalog);
                }
              });
          }
        });
    }
  }

  chechkALL(event) {
    const checked = event.target.checked;

    this.returnOrder.items.forEach(item => (item.isSelected = checked));
    this.returnOrder.items.forEach(element => {
      this.selectedItemIds.push(element.itemId);
      console.log("this.found", this.found);
    });
    this.found = this.returnOrder.items.some(el => el.isSelected !== checked);
    console.log("value", this.selectedItemIds);
  }

  checkSelectedItems(event, srno: string) {
    const checked = event.target.checked;

    this.returnOrder.items.forEach(element => {
      if (element.serial_number == srno) {
        element.isSelected = checked;
        this.selectedItemIds.push(element.itemId);
        this.found = this.returnOrder.items.some(
          el => el.isSelected !== checked
        );
        console.log("this.found", this.found);
      }
    });

    if (!this.found) {
      $("#selectall").prop("checked", true);
    } else {
      $("#selectall").prop("checked", false);
    }
  }

  saveRejectreason() {
    debugger;
    var dateString = this._datePipe.transform(
      this.authorized_approve_date_code,
      "yyyy-MM-dd"
    );

    let data = {
      authorized_reason_id: this.rejectcode,
      authorized_comment: this.comment,
      itemIDS: this.selectedItemIds,
      return_header_id: this.return_header_id,
      authorizetion_type: this.showModel,
      authorized_approve_date_code: dateString
    };

    this._returnService.postAuthorizedRequest(data).subscribe(retvalue => {
      if (
        retvalue != null &&
        retvalue != undefined &&
        retvalue.recordsets[0][0].status == "Success"
      ) {
        this._util.success(
          "Return Request successfully updated.",
          "Success",
          "Success"
        );
        this._router.navigate([
          "back-office/returns/queue/" + this.queueStatus + "/" + this.brandCode
        ]);
      } else {
        // this._util.error(this.getlangval("lbl_banner_search"), "Alert");
      }
    });

    $("#divItemPopup").modal("hide");
  }

  onReasonChange(RMAAcode: string) {
    this.rejectcode = RMAAcode;
    console.log("RMAAcode", RMAAcode);
  }

  showRejectApproveReason(showARModel: string) {
    if (showARModel == "Reject") this.getRejectApproveReason();

    console.log("this.found", this.found);

    if (this.found === undefined) {
      this._util.error("No Serial# selected.", "Info");
      return;
    }
    this.showModel = showARModel;
    setTimeout(() => {
      $("#divItemPopup").modal("show");
    }, 1);
  }

  disableItems(
    _return_days,
    _order_date,
    is_special_case_return_window: boolean
  ) {
    if (
      is_special_case_return_window == true ||
      this.hasPermission("Override Restricted Item")
    ) {
      return true;
    } else {
      let ReturnDays = this._util.toDecimal(_return_days, 0);
      let orderDate = moment().utc(_order_date);
      orderDate = moment(_order_date);
      let returnDate = moment.utc(orderDate).add(ReturnDays, "days");
      let TodayDate = moment.utc(Date());
      if (returnDate <= TodayDate) {
        this._util.error(
          "We are sorry, the return cannot be initiated as the duration to return the item(s) has been lapsed.",
          "Alert"
        );
        return false;
      }
      return true;
    }
  }

  toDecimal(number, point) {
    return parseFloat(parseFloat(number).toFixed(point));
  }

  validateImages(files, isItemSelected): boolean {
    let _totalSize = 0;
    if (isItemSelected) {
      if (files.length <= 5) {
        if (files.length > 0) {
          var pattern = /image-*/;
          for (let index = 0; index < files.length; index++) {
            if (!files[index].type.match(pattern)) {
              this._util.error("Please upload images only.", "Alert");
              return false;
            }
            _totalSize = files[index].size;
          }
          if (_totalSize > 5000000) {
            this._util.error("File size should be less than 5MB.", "Error");
            return false;
          }
        } else {
          this._util.error("Please upload atleast one file.", "Error");
          return false;
        }
      } else {
        this._util.error("You cannot upload more than 5 files.", "Error");
        return false;
      }
    } else {
      this._util.error("Please select this item first.", "Error");
      return false;
    }
    return true;
  }

  removeUploadedImage(image, item) {
    this.items.forEach(element => {
      if (element.serial_number == item.serial_number) {
        const index = element.files.indexOf(image, 0);
        if (index > -1) {
          element.files.splice(index, 1);
        }
      }
    });
  }

  SaveRMA(orderForm: NgForm) {
    if (orderForm.valid) {
      //this.postRMAWithData(true);
    } else {
      this._util.error("Please validate all fields.", "Alert");
    }
  }

  showAdvanceSearch() {
    this._AdvanceSearch.open();
  }

  closeAdvanceSearch() {
    this._AdvanceSearch.close();
  }

  postUserNote(userNote) {
    let data = {
      note: userNote.value,
      return_number: this.orderNumber,
      createdDate: "Today",
      isActive: true
    };

    this._returnService.postReturnNotes(data).subscribe(returnData => {
      if (returnData) {
        if (returnData.data[0][0].Status == 1) {
          this._returnService
            .getReturnNotes(this.orderNumber)
            .subscribe(returnValue => {
              if (returnValue) {
                this.returnNotes = JSON.parse(returnValue.data[0][0].notes);
              }
            });
          userNote.value = "";
        }
      }
    });
  }

  goBackToQueue() {
    this._location.back();
  }

  approveInWarrantyRMA() {
    if (this.returnOrder.extra.warranty_approval_status == "pending") {
    }
    this.returnOrder.extra.warranty_approval_status = "approved";

  }

  rejectInWarrantyRMA() {
    this.returnOrder.extra.warranty_approval_status = "rejected";
  }

  removeUploadedFiles(i) {
    this.RMAFiles.splice(i, 1);
    this._returnService
      .UpdateRMAFile(this.RMAFiles, this.RMANumber)
      .subscribe(_result => {
        this._util.success(
          "File has been removed successfully.",
          "Success",
          "Success"
        );
      });
  }

  updateAddress(_object: any) {
    if (_object) {
      if (!_object.form.valid) {
        return;
      }
      if (_object.address.state == "") {
        return;
      } else {
        this._address = new address(_object.address);
        this.returnOrder.customer.address = new address(_object.address);
      }
    }
  }

  closePopup(e) {
    this._address = new address(
      this.returnOrder.customer_order.customer.address
    );
  }

  multiplyShippingCost(_averageCost, _noOfParcels) {
    return _averageCost * _noOfParcels;
  }

  showDefaultImage(img, item) {
    img.src = item.default_image;
  }
  multiReturnReasonChange(_rma_action_code: string, _item: items) {
    var _reason = this.returnReasons.filter(
      item => item.rma_action_code == _rma_action_code
    );
    if (_reason.length > 0) {
      _item.return_reason = new ReturnReason(_reason[0]);
    }
  }

  getRejectApproveReason() {
    this.EANValue = [];
    this._config.getTypeLookUpByGroupName("Reject Reason").subscribe(
      _ConfigTypes => {
        debugger;
        this.RejectApproveReason = _ConfigTypes;
        this.RejectApproveList = $.grep(_ConfigTypes, function(x) {
          return true;
        });
      },
      error => (this.errorMessage = <any>error)
    );
  }
}
