import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../app.window';

declare var $:any;
@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent implements OnInit {

  constructor(@Inject(WINDOW) private window: Window, @Inject(DOCUMENT) private _document: HTMLDocument) { }

  ngOnInit() {    
    $('.loading-container').addClass('loading-inactive');
    var host =  this.window.location.hostname;
    let scope:string = host.split('.')[0];
    this._document.title = "Arcteryx";
    this._document.getElementById('appFavicon').setAttribute('href', 'assets/img/arcteryx-favicon.ico');
  }

}
