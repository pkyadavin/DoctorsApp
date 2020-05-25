import { Component, Inject, OnInit } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../app.window';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  constructor(@Inject(WINDOW) private window: Window, @Inject(DOCUMENT) private _document: HTMLDocument, private router: Router) { 
    
  }

  ngOnInit() {
    var host =  this.window.location.hostname;
    let scope:string = host.split('.')[0];
    this._document.title = "Arcteryx";
    this._document.getElementById('appFavicon').setAttribute('href', 'assets/img/arcteryx-favicon.ico');
  }

}
