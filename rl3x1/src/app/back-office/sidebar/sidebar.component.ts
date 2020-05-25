import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Menu, MenuCollection } from './menu.model';
import {TypedJson} from '../../app.util'
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  Menus: Menu[];
  constructor(private _sidebar: SidebarService, private _router:Router, private _menu:SidebarService) { }
  get _route(): string {
    return this._router.url;
  }
  get _proute(): string {
    var _thisRoute = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0];
    return _thisRoute? _thisRoute.parent:[];
  }

  activeChild(Child, index, array)
  {
    return this._route.indexOf(Child) > -1 ? true:false;
  }

  ngOnInit() { 
    if (this._sidebar.Menus) {
      this.Menus = this._sidebar.Menus;
      return;  
    }
    this._sidebar.getDyMenu()
      .subscribe(
      (_Menus:any) => {
         this.Menus = this._sidebar.Menus = _Menus;
         //console.log(this.Menus);
      });
  }
  
  trackByFn(index, item) {
    return item.ID
  }
}
