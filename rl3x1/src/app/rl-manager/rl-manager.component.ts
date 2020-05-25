import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-rl-manager',
  templateUrl: './rl-manager.component.html',
  styleUrls: ['./rl-manager.component.css']
})
export class RlManagerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.loading-container').addClass('loading-inactive');
  }
}
