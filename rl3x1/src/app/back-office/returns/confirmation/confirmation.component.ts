import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ReturnsService } from "../returns.service";
import { ReturnDataService } from "../returns-data.service";
import { Util, Property, TypedJson } from "src/app/app.util";
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
declare var $: any;
@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.css"]
})
export class ConfirmationComponent extends Property implements OnInit {
  returnOrder: _returnsObject;
  langKeyVal: any;
  status: string;
  RMANumber: any;
  brandCode: string;
  orderNumber: string;
  returnReasons: any[] = [];
  returnNotes: any = [];
  returnRMALog: any = [];
  return_header_status: boolean = false;
  is_warranty_approved: any;
  is_item_warranty: boolean = false;
  constructor(
    private _util: Util,
    private _returnService: ReturnsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: ReturnDataService,
    private _route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    debugger;
    this.returnOrder = new _returnsObject();
    this.langKeyVal = JSON.parse(
      '[{"LanugaugeKey": "lbl_hover_edit_address",      "EngLangValue": "change",      "ID": 70,      "ChangedLangValue": "change",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_edit_address",      "EngLangValue": "change",      "ID": 70,      "ChangedLangValue": "change",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_customer_changeaddress",      "EngLangValue": "Change Address",      "ID": 70,      "ChangedLangValue": "Change Address",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_address_update_note",      "EngLangValue": "Please indicate/modify the address if you intend to ship it from a different location",      "ID": 70,      "ChangedLangValue": "Please indicate/modify the address if you intend to ship it from a different location",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_street",      "EngLangValue": "Street",      "ID": 70,      "ChangedLangValue": "Street",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_city",      "EngLangValue": "City",      "ID": 70,      "ChangedLangValue": "City",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_postalcode",      "EngLangValue": "Postal Code",      "ID": 70,      "ChangedLangValue": "Postal Code",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_btn_update",      "EngLangValue": "Update",      "ID": 70,      "ChangedLangValue": "Update",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    },    {      "LanugaugeKey": "lbl_btn_close",      "EngLangValue": "Close",      "ID": 70,      "ChangedLangValue": "Close",      "FormID": 1,      "LanguageID": 70,      "formname": "Return",      "languageCode": "en-US"    }  ]'
    );

    let resultObject: any;

    this.brandCode = this._route.snapshot.paramMap.get("brandCode");
    this.orderNumber = this._route.snapshot.paramMap.get("Code");

    if (
      (this.brandCode != undefined || this.brandCode != null) &&
      (this.orderNumber != undefined || this.orderNumber != null)
    ) {
      this._returnService
        .returnOrder(this.orderNumber + "|en-us", this.brandCode.toLowerCase())
        .subscribe(result => {
          if (result) {
            //resultObject = result;

            // this.Permissions = resultObject.AccessCodes;
            // if (resultObject.AccessCodes) {
            //   this.LocalAccess = resultObject.AccessCodes.map(function(e) {
            //     return e.FunctionType;
            //   });
            // } else {
            //   this._util.error(
            //     "Sorry, you do not have permissions to create RMA for this brand.",
            //     "Error"
            //   );

            //   return;
            // }

            // if (!this.hasPermission("View")) {
            //   this._util.error(
            //     "Sorry, you do not have permissions, please contact Administrator.",
            //     "Error"
            //   );
            //   return;
            // }

            this.returnOrder = result.payload;
            debugger;
            if (this.returnOrder.status.code == "PendingApproval") {
              this.return_header_status = true;
            }

            if (this.returnOrder.items.length != 0) {
              this.returnOrder.items.forEach(element => {
                let files_update: any;
                files_update = element.files;
                element.files = JSON.parse(files_update);
              });
            }

            this.is_warranty_approved = this.returnOrder.items.filter(
              e => e.warranty_status_id === 84
            );
            if (this.is_warranty_approved.length != 0) {
              this.is_item_warranty = true;
            }

            console.log(JSON.stringify(this.is_warranty_approved));
            //debugger;
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

  navigatetootherqueues(queueType) {
    if (queueType == "glb") {
      this._router.navigate(["back-office/returns/queue/glb/" + this.brandCode]);
    }
    else
    {
      this._router.navigate(["back-office/returns/initiate/" + this.brandCode]);
    }
  }
}
