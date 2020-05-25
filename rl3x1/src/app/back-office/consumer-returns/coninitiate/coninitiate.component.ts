import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { _returnObject_bp } from "../../return.model";
import { _consumer_returnObject } from "../consumer-returns.model";
import { ConsumerReturnsService } from "../consumer-returns.service";
import { CommonService } from "../../../shared/common.service";
import { Util } from "src/app/app.util";
import { NULL_EXPR } from "@angular/compiler/src/output/output_ast";
import { concat } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-coninitiate",
  templateUrl: "./coninitiate.component.html",
  styleUrls: ["./coninitiate.component.css"]
})
export class ConinitiateComponent implements OnInit {
  show: boolean = false;
  registerForm_consumer: FormGroup;
  colour: any = [];
  selectedValue;
  productvalue;
  rma: any = [];
  product: any = [];
  rmavalue;
  brand: string = "dsc2";
  queueStatus: string;
  isdisabled: boolean = true;
  country: any = [];

  _postcutomer_returnRequest = new _consumer_returnObject();
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _util: Util,
    private formBuilder: FormBuilder,
    private _ConsumerReturnsService: ConsumerReturnsService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    console.log(document.URL);
    this.brand = this._route.snapshot.paramMap.get("brand");
    console.log(this._postcutomer_returnRequest);

    this._ConsumerReturnsService.consumer_initiation('en-us', this.brand).subscribe(data => {
      console.log(data);
      this.colour.push(data.color_detail);
      this.product.push(data.product_detail);
      this.rma.push(data.rmatype_detail);
      this.country.push(data.country);
    });

    // debugger;
    // this._ConsumerReturnsService.getColorDetail(null).subscribe(data => {
    //   this.colour.push(data.recordsets[0]);
    // });
    // this.selectedValue = "Select colour";
    // this._ConsumerReturnsService.getProductDetail(null).subscribe(data => {
    //   console.log(data.recordsets[0]);
    //   this.product.push(data.recordsets[0]);
    // });
    // console.log(this.product);
    // this.commonService.getTypeLookUpByName("RMA Type").subscribe(rulegroup => {
    //   console.log(rulegroup);
    //   this.rma.push(rulegroup);
    // });
    // debugger;
    console.log(this.rma);
    this.productvalue = undefined;
    this.rmavalue = undefined;
    this.selectedValue = undefined;
  }
  happykeyup(e) {
    if (e.target.value.length >= 5) {
      this.isdisabled = false;
    } else {
      this.isdisabled = true;
    }
  }
  happyclick(e) {
    this.show = true;
  }
  productchange(e) { }

  colourchange(e) {
    console.log(e);
  }

  rmachange(e) { }

  _internal_ref_number;

  onsubmitt() {
    console.log(this.productvalue);
    console.log(this.selectedValue);
    console.log(this.rmavalue);
    if (this._postcutomer_returnRequest.delivery_info.email.length <= 0) {
      this._util.error("Please fill Email.", "alert");
      return;
    } else if (this.selectedValue == undefined) {
      this._util.error("Please Select colour.", "alert");
      return;
    } else if (this.productvalue == undefined) {
      this._util.error("Please Select product.", "alert");
      return;
    } else if (this.rmavalue == undefined) {
      this._util.error("Please Select RMA.", "alert");
      return;
    }
    this._postcutomer_returnRequest.delivery_address.country = "US";
    this._postcutomer_returnRequest.brand = this.brand;
    this._postcutomer_returnRequest.items.color_detail.key = this.selectedValue.key;
    this._postcutomer_returnRequest.items.color_id = this.selectedValue.value;
    this._postcutomer_returnRequest.items.color_detail.value = this.selectedValue.value;
    this._postcutomer_returnRequest.items.product_detail.key = this.productvalue.key;
    this._postcutomer_returnRequest.items.product_detail.value = this.productvalue.value;
    this._postcutomer_returnRequest.items.product_id = this.productvalue.value;
    this._postcutomer_returnRequest.items.rma_request_type_id = this.rmavalue.TypeLookUpID;
    this._postcutomer_returnRequest.items.rma_request_type_id = this.rmavalue.TypeLookUpID;
    this._postcutomer_returnRequest.items.rma_request_type_detail.value = this.rmavalue.TypeLookUpID;
    this._postcutomer_returnRequest.items.rma_request_type_detail.key = this.rmavalue.TypeName;
    console.log(this._postcutomer_returnRequest);
    this._ConsumerReturnsService
      .saveConsumerRequest(this._postcutomer_returnRequest)
      .subscribe(
        result => {
          this._internal_ref_number = result.recordsets[1][0].line;

          this._router.navigate([
            "back-office/con_returns/conqueue/glb/" + this.brand
          ]);
          setTimeout(() => {
            this._util.success(
              "Request number " +
              result.recordsets[1][0].return_order_number +
              " saved sucessfully",
              "Alert"
            );
          }, 100);
          console.log(result);
        },
        error => {
          this._util.error(error, "Error");
        }
      );
  }
}
