import { Component, Inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { WINDOW } from "../../../app.window";
import { ReturnService } from "./return.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-templates",
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.css"]
})
export class TemplatesComponent implements OnInit {
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _returnService: ReturnService,
    private titleService: Title
  ) {}

  ngOnInit() {
    var host = this.window.location.hostname;
    let scope: string = host.split(".")[0];
    this._document
      .getElementById("appFavicon")
      .setAttribute("href", "assets/img/" + scope + "-favicon.png");
  }

  get lblSummaryLabel(): string {
    return this._returnService.lblSummaryLabel;
  }
}
