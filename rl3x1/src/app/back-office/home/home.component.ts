import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _auth:AuthService, private _router:Router) { }

  ngOnInit() {
    var home = JSON.parse(this._auth.getAuthorizationUser()).home;
    if(home && home!= this._router.url)
      this._router.navigate([home]);
  }
}
