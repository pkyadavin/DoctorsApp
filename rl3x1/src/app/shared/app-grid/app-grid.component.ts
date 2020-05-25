import { Component, OnInit, Output, EventEmitter, Input, TemplateRef } from '@angular/core';
@Component({
  selector: 'app-app-grid',
  templateUrl: './app-grid.component.html',
  styleUrls: ['./app-grid.component.css']
})
export class AppGridComponent implements OnInit {
  @Output() clickEventPlus = new EventEmitter();
  @Output() clickEdit = new EventEmitter();
  @Output() clickEditChild = new EventEmitter();
  @Input() parentGridColumn =[];
  @Input() parentGridData = [];
  @Input() childGridColumn = [];
  @Input() childGridData = [];
  getCaseDetails: any = [];
    isClickedId: string="";
  isCollapsed: string;
  colLength = 8;
  p: any;
  constructor() {
    this.colLength = 8;
  }

  ngOnInit() {
  }
  clickEventPlusP(id: string) {
    this.childGridData = [];
    this.isCollapsed = "show";
    this.isClickedId = id;
    this.clickEventPlus.emit(id);
    console.log(this.childGridData);
  }
  clickEventMinusP() {
    this.isClickedId = '';
    this.isCollapsed = '';
  }
  clickEditVal(obj: string) {
   
    this.clickEdit.emit(obj);
  }
  clickEditValChild(obj: string) {
    this.clickEditChild.emit(obj);
  }
}
