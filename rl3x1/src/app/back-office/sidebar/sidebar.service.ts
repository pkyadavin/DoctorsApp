import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { tap, delay, catchError, map } from 'rxjs/operators';
import { HttpHeaders,HttpClient, HttpErrorResponse } from '@angular/common/http';
import{ConfigurationConstants} from '../../shared/constants'
import { Menu } from './menu.model';
import { GlobalVariableService } from 'src/app/shared/globalvariable.service';
import { TypedJson } from 'src/app/app.util';
import { promise } from 'protractor';

declare var $:any;

@Injectable({
  providedIn: 'root'
})

export class SidebarService {

  endpoint_url: string = ConfigurationConstants.BASEURL + "menu/listUserMenus";
  private _menus: Array<any> = new Array<any>();
  private _Menus: Array<any> = new Array<any>();
  //Menus: Menu[];

  get Menus(): Array<Menu> {
    return JSON.parse(localStorage.getItem('routes'));
  }
  set Menus(lv: Array<Menu>) {
    this._Menus = lv;
    localStorage.setItem('routes', JSON.stringify(this._Menus));
  }

  get menus(): Array<any> {
    return JSON.parse(localStorage.getItem('resource'));
  }
  set menus(lv: Array<any>) {
    this._menus = lv;
    localStorage.setItem('resource', JSON.stringify(this._menus));
  }

  constructor(private http:HttpClient, private _gv: GlobalVariableService) { }

  getDyMenu(): Observable<any> {
    return this.http.get(`${this.endpoint_url}`).pipe(
      map((res: Response) => this.extractData(res)));
  }  
  
  getDyMenuSync() {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint_url}`)
      .toPromise()
      .then(
        res => {
          resolve((res: Response) => this.extractData(res));
        },
        msg => {
          reject(msg);
        }
      );
  });
  return promise;
  } 
  extractData(_Menus)
  {
    this.Menus = $.map(TypedJson.parse<Array<Menu>>(_Menus), function (v, i) { return new Menu(v); });
    var MenuRoutes = [];
    for (let p of _Menus) {
        if (JSON.parse(p.Childs).length > 0) {
            var childMenus = JSON.parse(p.Childs.toString());
            for (let m of childMenus) {
              //debugger;
                if (m.Childs.length > 0) {
                  //debugger;
                    for (let c of m.Childs) {
                        MenuRoutes.push({ 'routeKey': c.NavigateURL, 'title': c.Title, 'description': c.Description, 'parent': [m.Title,p.Title], 'labelcode': c.LabelCode });
                    }
                }
                else {
                    MenuRoutes.push({ 'routeKey': m.NavigateURL, 'title': m.Title, 'description': m.Description, 'parent': [p.Title], 'labelcode': m.LabelCode});
                }
            }
        }
        else {
          MenuRoutes.push({ 'routeKey': p.NavigateURL, 'title': p.Title, 'description': p.Description, 'parent': '', 'labelcode': p.LabelCode});
        }
    }
    this.menus = MenuRoutes;
  }
  resetLanding(route)
  {
     return this.http.post(`${ConfigurationConstants.BASEURL}common/resetLanding`, {_route:route});
  } 
  resetTimezone(_tz)
  {
     return this.http.post(`${ConfigurationConstants.BASEURL}common/resetTimezone`, {tz:_tz});
  }
  getAllTimeZone(): Observable<any> {
    return this.http.get(`${ConfigurationConstants.BASEURL}TimeZones/`);
  }
}
