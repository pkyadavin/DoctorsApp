import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/app.util';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { ConsumerReturnsService } from "../consumer-returns.service";
import { _consumer_returnObject, rected_req_cp } from "../consumer-returns.model";
import { MetadataService } from "../../MetadataConfig/metadata-config.service.js";
import { DatePipe } from "@angular/common";
import { isTypeProvider } from '@angular/core/src/di/r3_injector';
import { Util } from "src/app/app.util";
import { WINDOW } from 'src/app/app.window';

declare var $: any;
@Component({
  selector: 'app-coneditor',
  providers: [MetadataService, DatePipe],
  templateUrl: './coneditor.component.html',
  styleUrls: ['./coneditor.component.css']
})
export class ConeditorComponent extends Property implements OnInit {

  constructor(private _config: MetadataService, private _util: Util, private _router: Router, private _route: ActivatedRoute, private consumer_rtr_service: ConsumerReturnsService) {
    super();
  }
  queueStatus;
  int_ref_number;
  brandCode;
  RejectApproveReason: any = [];
  RejectApproveList: any;
  EANValue: any = [];
  rejectcode: string;
  reson_state = true;
  authorized_approve_date_code: Date = new Date();

  customer_return_details = new _consumer_returnObject;
  rejected_request_dt = new rected_req_cp;
  filesreturnshow: any = []
  returnshow: any = []
  ngOnInit() {
    let resultObject: any;
    this.queueStatus = this._route.snapshot.paramMap.get("queue");
    this.int_ref_number = this._route.snapshot.paramMap.get("order");
    this.brandCode = this._route.snapshot.paramMap.get("brandCode");
    this.consumer_rtr_service.returnConsumerRequestDetail(this.int_ref_number + "|en-us|" + this.brandCode,
      this.queueStatus.toLowerCase()).subscribe(result => {
        console.log(result);
        this.customer_return_details = result.payload;
        if (this.customer_return_details.items.files) {
          this.returnshow = this.customer_return_details.items.files;
          this.filesreturnshow = JSON.parse(this.returnshow);
          console.log(this.filesreturnshow);
        }
      });
    this.getRejectApproveReason();
  }
  getRejectApproveReason() {
    this.EANValue = [];
    this._config.getTypeLookUpByGroupName("Reject Reason").subscribe(
      _ConfigTypes => {
        debugger;
        this.RejectApproveReason = _ConfigTypes;
        console.log(this.RejectApproveReason)
        this.RejectApproveList = $.grep(_ConfigTypes, function (x) {
          return true;
        });
      },
    );
  }
  setvalue_eol
  onEolchange(e) {
    this.setvalue_eol = e;
    this.rejected_request_dt.is_eol = this.setvalue_eol
  }
  onReasonChange(RMAAcode: string) {
    this.rejectcode = RMAAcode;
    console.log("RMAAcode", RMAAcode);
  }
  showRejectApproveReason(requesttype: string) {
    if (requesttype == "Reject") {
      if (this.rejectcode == null) {
        this._util.error("Please Select Return reason.", "alert");
        return;
      }
      if (!this.rejected_request_dt.is_eol) {
        this.setvalue_eol = 0;
        this.rejected_request_dt.is_eol = this.setvalue_eol;
      }
    }
    this.rejected_request_dt.authorized_reason_id = this.rejectcode;
    this.rejected_request_dt.internal_ref_number = this.customer_return_details.internal_ref_number;
    this.rejected_request_dt.return_ref_number = this.customer_return_details.return_ref_number;
    this.rejected_request_dt.return_header_id = this.customer_return_details.request_header_id;
    this.rejected_request_dt.request_detail_id = this.customer_return_details.items.request_detail_id;
    this.rejected_request_dt.authorizetion_type = requesttype;
    console.log(this.rejected_request_dt);
    this.consumer_rtr_service.consumer_authorizationRequest(this.rejected_request_dt).subscribe(retvalue => {
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
        if (requesttype == "Reject") {
          this._router.navigate([
            "back-office/con_returns/conqueue/" + "rjct" + "/" + this.brandCode
          ]);
        } else {
          this._router.navigate([
            "back-office/con_returns/conqueue/" + "oow" + "/" + this.brandCode
          ]);
        }

      }
    });
  }
  saveRejectreason() {
    debugger;
    // var dateString = this._datePipe.transform(
    //   this.authorized_approve_date_code,
    //   "yyyy-MM-dd"
    // );
    console.log(this.rejected_request_dt);
    // let data = {
    //   authorized_reason_id: this.rejectcode,
    //   authorized_comment: this.comment,
    //   itemIDS: this.selectedItemIds,
    //   return_header_id: this.return_header_id,
    //   authorizetion_type: this.showModel,
    //   authorized_approve_date_code: dateString
    // };

    // this.consumer_rtr_service.consumer_authorizationRequest(data).subscribe(retvalue => {
    //   if (
    //     retvalue != null &&
    //     retvalue != undefined &&
    //     retvalue.recordsets[0][0].status == "Success"
    //   ) {
    //     this._util.success(
    //       "Return Request successfully updated.",
    //       "Success",
    //       "Success"
    //     );
    //     // this._router.navigate([
    //     //   "back-office/returns/queue/" + this.queueStatus + "/" + this.brandCode
    //     // ]);
    //   } else {
    //     // this._util.error(this.getlangval("lbl_banner_search"), "Alert");
    //   }
    // });

    $("#divItemPopup").modal("hide");
  }
  redirectCP(){
    window.open( "portal/res/return/t5/"+ this.brandCode + "/uat/request/en-us/" + this.int_ref_number)
  }
}
