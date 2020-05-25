import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Util } from "src/app/app.util";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, NgForm } from "@angular/forms";
import { containsElement } from "@angular/animations/browser/src/render/shared";

@Component({
  selector: "app-download",
  templateUrl: "./download.component.html",
  styleUrls: ["./download.component.css"]
})
export class DownloadComponent implements OnInit {
  @Input() moduleName: any;
  @Output() emitFunctionOfParent: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _util: Util,
    private _router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  downlaodExcel()
  {
    debugger
    console.log("module", this.moduleName);
  }
}
