import { Component, OnInit } from "@angular/core";
import { Property, Util } from "src/app/app.util";
import { Router, ActivatedRoute } from "@angular/router";
import { _ga_returnObject, bp_auth_item, ga_items } from "../ga_returns.model";
import { GaReturnsService } from "../ga_returns.service";
import { MetadataService } from "../../MetadataConfig/metadata-config.Service";
import { Location, DatePipe } from "@angular/common";
declare var $: any;
@Component({
  selector: "app-gaeditor",
  providers: [MetadataService, DatePipe],
  templateUrl: "./gaeditor.component.html",
  styleUrls: ["./gaeditor.component.css"]
})
export class GaeditorComponent extends Property implements OnInit {
  private selectedLink: string = "serial";
  isserial = "serial";
  serial_text: string = "";
  item_text: string = "";
  purchasedate_text: string = "";
  list_bp_auth_item: Array<bp_auth_item> = [];
  bp_auth_item_s: bp_auth_item;
  bp_ga_items: ga_items;
  list_bp_ga_items: Array<ga_items> = [];
  brandCode: string;
  returnOrder: _ga_returnObject;
  queueStatus: string;
  int_ref_number: string;
  found: boolean;
  RejectApproveReason: any = [];
  EANValue: any = [];
  authorized_approve_date_code: Date;
  RejectApproveList: any;
  showModel: string = "Reject";
  comment: string;
  rejectcode: string;
  return_header_id: string;
  selectedItemIds: any = [];
  constructor(
    private _util: Util,
    private _router: Router,
    private _route: ActivatedRoute,
    private _gaservice: GaReturnsService,
    private _config: MetadataService,
    private _returnService: GaReturnsService,
    private _datePipe: DatePipe,
    private _location: Location
  ) {
    super();
  }

  isSelected(name: string): boolean {
    if (!this.selectedLink) {
      return false;
    }

    return this.selectedLink === name; // if current radio button is selected, return true, else return false
  }

  ngOnInit() {
    this.returnOrder = new _ga_returnObject();
    let resultObject: any;
    this.queueStatus = this._route.snapshot.paramMap.get("queue");
    this.int_ref_number = this._route.snapshot.paramMap.get("order");
    this.brandCode = this._route.snapshot.paramMap.get("brandCode");

    if (
      (this.queueStatus != undefined || this.queueStatus != null) &&
      (this.int_ref_number != undefined || this.int_ref_number != null)
    ) {
      this._gaservice
        .returnGARequestDetail(
          this.int_ref_number + "|en-us|" + this.brandCode,
          this.queueStatus.toLowerCase()
        )
        .subscribe(result => {
          console.log("GA Return", result);
          resultObject = result;
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
            return;
          }

          if (!this.hasPermission("View")) {
            this._util.error(
              "Sorry, you do not have permissions, please contact Administrator.",
              "Error"
            );
            return;
          }

          this.returnOrder = resultObject.payload;
          if (resultObject.payload.files != "") {
            let files_update: any;
            files_update = resultObject.payload.files;
            this.returnOrder.files = JSON.parse(resultObject.payload.files);
          }

          if (this.brandCode == "dsc3")
            this.returnOrder.remarks = resultObject.payload.item_detail;
          this.return_header_id = this.returnOrder.request_header_id;
          console.log(this.returnOrder);
        });
    }
  }

  saveRejectreason() {
    let data: any;
    if (this.brandCode == "dsc2") {
      var dateString = this._datePipe.transform(
        this.authorized_approve_date_code,
        "yyyy-MM-dd"
      );

      data = {
        authorized_reason_id: this.rejectcode,
        authorized_comment: this.comment,
        itemIDS: this.selectedItemIds,
        return_header_id: this.return_header_id,
        authorizetion_type: this.showModel,
        authorized_approve_date_code: dateString
      };

      console.log(JSON.stringify(data));
      this._returnService.post_GA_AuthorizedRequest(data).subscribe(retvalue => {
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
            "back-office/ga_returns/gaqueue/" +
              this.queueStatus +
              "/" +
              this.brandCode
          ]);
        } else {
          // this._util.error(this.getlangval("lbl_banner_search"), "Alert");
        }
      });
    } else {
      data = {
        authorized_reason_id: this.rejectcode,
        authorized_comment: this.comment,
        itemIDS: this.list_bp_auth_item,
        return_header_id: this.return_header_id,
        authorizetion_type: this.showModel,
        authorized_approve_date_code: ""
      };
      console.log("BP",JSON.stringify(data));
      this._returnService.post_BP_AuthorizedRequest(data).subscribe(retvalue => {
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
            "back-office/ga_returns/gaqueue/" +
              this.queueStatus +
              "/" +
              this.brandCode
          ]);
        } else {
          // this._util.error(this.getlangval("lbl_banner_search"), "Alert");
        }
      });
    }

    $("#divItemPopup").modal("hide");
  }

  onReasonChange(RMAAcode: string) {
    this.rejectcode = RMAAcode;
    console.log("RMAAcode", RMAAcode);
  }

  getRejectApproveReason() {
    this.EANValue = [];

    this._config.getTypeLookUpByGroupName("Reject Reason").subscribe(
      _ConfigTypes => {
        this.RejectApproveReason = _ConfigTypes;
        this.RejectApproveList = $.grep(_ConfigTypes, function(x) {
          return true;
        });
      },
      error => (this.errorMessage = <any>error)
    );
  }

  showRejectApproveReason(showARModel: string) {
    if (showARModel == "Reject") this.getRejectApproveReason();

    if (this.found === undefined && this.brandCode == "dsc2") {
      this._util.error("No Serial# selected.", "Info");
      return;
    }
    this.showModel = showARModel;
    $("#divItemPopup").modal("show");
  }

  goBackToQueue() {
    this._location.back();
  }

  chechkALL(event) {
    const checked = event.target.checked;

    this.returnOrder.items.forEach(item => (item.isSelected = checked));
    this.returnOrder.items.forEach(element => {
      this.selectedItemIds.push(element.request_detail_id);
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
        this.selectedItemIds.push(element.request_detail_id);
        this.return_header_id = element.request_header_id;
        this.found = this.returnOrder.items.some(
          el => el.isSelected !== checked
        );
      }
    });
    if (!this.found) {
      $("#selectall").prop("checked", true);
    } else {
      $("#selectall").prop("checked", false);
    }
  }

  setradio(e: string): void {
    this.selectedLink = e;
    if (e == "serial".toLowerCase()) {
      this.isserial == "serial";
    }
    if (e == "item".toLowerCase()) {
      this.isserial == "item";
    }
    this.serial_text = "";
    this.item_text = "";
    this.purchasedate_text = "";
  }

  onwarrantyCheck() {
    //debugger;
    this.bp_auth_item_s = new bp_auth_item();
    this.bp_ga_items = new ga_items();
    if (this.isserial == "serial") {
      if (this.serial_text == "") {
        this._util.error("Please enter Serial#.", "Alert", "Alert");
        return false;
      }
      this.bp_auth_item_s.request_header_id = this.returnOrder.request_header_id;
      this.bp_auth_item_s.internal_ref_number = this.returnOrder.internal_ref_number;
      this.bp_auth_item_s.request_detail_id = 0;
      this.bp_auth_item_s.serial_number = this.serial_text;
      this.bp_auth_item_s.item_number = "N/A";
      this.bp_auth_item_s.purchase_date = "";
      this.bp_auth_item_s.warranty_status = "IW";
      this.bp_auth_item_s.isSelected = true;

      this.bp_ga_items.serial_number = this.bp_auth_item_s.serial_number;
      this.bp_ga_items.sku = this.bp_auth_item_s.item_number;
      this.bp_ga_items.date_of_purchase = this.bp_auth_item_s.purchase_date;
      this.bp_ga_items.warranty_status = this.bp_auth_item_s.warranty_status;
      this.bp_ga_items.warranty_status_id =
        this.bp_auth_item_s.warranty_status == "IW" ? 83 : 84;
    } else {
      if (this.item_text == "" || this.purchasedate_text == "") {
        this._util.error("Please enter Item# and Purchase date.", "Alert");
        return;
      }
      this.bp_auth_item_s.request_header_id = this.returnOrder.request_header_id;
      this.bp_auth_item_s.internal_ref_number = this.returnOrder.internal_ref_number;
      this.bp_auth_item_s.request_detail_id = 0;
      this.bp_auth_item_s.serial_number = "N/A";
      this.bp_auth_item_s.item_number = this.item_text;
      this.bp_auth_item_s.purchase_date = this.purchasedate_text;
      this.bp_auth_item_s.warranty_status = "OOW";
      this.bp_auth_item_s.isSelected = true;

      this.bp_ga_items.serial_number = this.bp_auth_item_s.serial_number;
      this.bp_ga_items.sku = this.bp_auth_item_s.item_number;
      this.bp_ga_items.date_of_purchase = this.bp_auth_item_s.purchase_date;
      this.bp_ga_items.warranty_status = this.bp_auth_item_s.warranty_status;
      this.bp_ga_items.warranty_status_id =
        this.bp_auth_item_s.warranty_status == "IW" ? 83 : 84;
    }
    debugger;
    this.list_bp_auth_item.push(this.bp_auth_item_s);
    this.list_bp_ga_items.push(this.bp_ga_items);
    this.returnOrder.items = this.list_bp_ga_items;
    console.log("list_bp_auth_item", this.list_bp_auth_item);
    console.log("bp_ga_items", this.bp_ga_items);
    this.serial_text = "";
    this.item_text = "";
    this.purchasedate_text = "";
  }

  deletebpItem(i: number) {
    this.list_bp_auth_item.splice(i, 1);
    this.list_bp_ga_items.splice(i, 1);
    this.returnOrder.items = this.list_bp_ga_items;
  }
}
