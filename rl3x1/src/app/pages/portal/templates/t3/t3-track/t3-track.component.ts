import { Component, OnInit, Inject } from "@angular/core";
import { returnBase } from "../../return.base";
import { ActivatedRoute, Router } from "@angular/router";
import { ReturnService } from "../../return.service";
import { Util } from "src/app/app.util";
import { TemplateServices } from "../../template.service";
import { T3Model } from "../t3.model";
import { WINDOW } from "src/app/app.window";
import { Title } from "@angular/platform-browser";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import {
  _returnsObject,
  status
} from "src/app/back-office/returns/returns.model";
import { cancel_request } from "../../return.model";
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $;

@Component({
  selector: "app-t3-track",
  templateUrl: "./t3-track.component.html",
  styleUrls: ["./t3-track.component.css"],
  providers: [ApplicationInsightsService]
})
export class T3TrackComponent extends T3Model implements OnInit {
  today: number = Date.now();
  return_data: _returnsObject;
  hdr_status: status;
  track_status: any;
  fileshow: any;
  _cancelReq: cancel_request;
  constructor(
    private _activatedRout: ActivatedRoute,
    private _returnServic: ReturnService,
    private _utilily: Util,
    _router: Router,
    private _templateService: TemplateServices,
    private _appInsightService: ApplicationInsightsService,
    private _routr: Router,
    @Inject(WINDOW) private windowObj: Window,
    private titleServiceObj: Title,
    ngxUiLoaderService: NgxUiLoaderService
  ) {
    super(
      _activatedRout,
      _returnServic,
      _utilily,
      _router,
      _templateService,
      windowObj,
      titleServiceObj,
      ngxUiLoaderService
    );
    if (_router.url.indexOf("track") > -1) this.formname = "Check Status";
    this._appInsightService.logPageView(this.formname, _routr.url);
  }

  ngOnInit() {
    $("#div_processbar").attr("style", "display:none");
    //this.return_data.status = new status();
    this.hdr_status = new status();
    this._cancelReq = new cancel_request();
    this.language = this._activatedRout.snapshot.paramMap.get("language");
    this.ordernumber = this._activatedRout.snapshot.paramMap.get("order");
    this.brand = this._returnServic.getValueFromSchemaByKey("brand");
    this.formname = "Check Status";
    this.setConfig();
    this.fetchReturndetail_byref();
  }

  fetchReturndetail_byref() {
    debugger;
    this.startloader();
    var sendparam = this.ordernumber + "|" + this.language + "|" + this.brand;
    this._returnServic.trackstatusByRef(sendparam).subscribe(
      data => {
        debugger;
        this.stoploader();
        if (data.payload != null) {
          this.track_status = data.track_status;
          this.return_data = data.payload;
          this.return_data.items.forEach(element => {
            let files_update: any;
            files_update = element.files;
            element.files = JSON.parse(files_update);
          });
          this.hdr_status = this.return_data.status;
          this._cancelReq.internal_return_number = this.return_data.internal_order_number;
          console.log(" this.return_data", this.return_data);
        }
      },
      error => {}
    );
  }

  extractNameFromJson(obj) {
    obj = JSON.parse(obj);
    return obj.name;
  }

  // ngAfterViewChecked() {
  //   $(".progressbar li.active")
  //     .prevAll()
  //     .addClass("active");
  // }

  ngAfterViewInit() {
    $(".progressbar li.active")
      .prevAll()
      .addClass("active");
  }

  cancelRequest() {
    console.log(this._cancelReq);
    debugger;
    this.startloader();
    this._returnServic.cancelrequest(this._cancelReq).subscribe(retvalue => {
      this.stoploader();
      if (
        retvalue != null &&
        retvalue != undefined &&
        retvalue.recordsets[0][0].status == "Success"
      ) {
        debugger;
        this._utilily.success(
          "Request successfully cancelled - " +
            retvalue.recordsets[0][0].return_order_number,
          "Alert"
        );
        this._internal_ref_number = retvalue.recordsets[0][0].line;
        this.ordernumber = retvalue.recordsets[0][0].line;
        this.fetchReturndetail_byref();
        $("#Cancellation").modal("hide");
      } else {
        this._utilily.error(this.getlangval("lbl_banner_search"), "Alert");
      }
    });
    //this._returnServic.cancelrequest()
  }
}
