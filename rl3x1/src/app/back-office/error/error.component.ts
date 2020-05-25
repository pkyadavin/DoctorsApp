import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private _location: Location,private _router: Router) { }

  ngOnInit() {
  }

  goBackToHome() {
    //this._location.back();
    this._router.navigate(['back-office/home']);
  }
}
