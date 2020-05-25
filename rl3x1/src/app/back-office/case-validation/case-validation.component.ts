import { Component, TemplateRef, OnInit, ContentChild, ElementRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, TabHeadingDirective } from 'ngx-bootstrap';
import { CaseValidationService } from './case-validation.service';
import { LoaderService } from '../../loader/loader.service';

@Component({
  selector: 'app-case-validation',
  templateUrl: './case-validation.component.html',
  providers: [CaseValidationService],
  styleUrls: ['./case-validation.component.css']
})
export class CaseValidationComponent implements OnInit {
  getAllCase: any = [];
  getAddress: any = [];
  getCaseDetails: any = [];
  filterText: string = '';
  parentGridColumn: any = [];
  parentGridData: any = [];
  childGridData: any = [];
  modalRef: BsModalRef;
  childGridColumn: any = [];
  editCaseDetails: any = [];
  p: any;
  isClickedId: string = "";
  isCollapsed: string;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;
  @ViewChild('editChildTemplate') editChildTemplate: TemplateRef<any>;
  constructor(
    private _CaseValidationService: CaseValidationService,
    private loaderService: LoaderService,
    private modalService: BsModalService
  ) {
    this.parentGridColumn = [
      { id: 1, val: 'Case Reference' },
      { id: 2, val: 'Number of Items' },
      { id: 3, val: 'Case Date' },
      { id: 4, val: 'Customer Email Address' },
      { id: 5, val: 'Customer Number' },
      { id: 6, val: 'Customer Name' },
      { id: 7, val: 'PO/WO #' },
      { id: 8, val: 'Edit Address' }
    ];
    this.childGridColumn = [
      { id: 1, val: 'Model #' },
      { id: 2, val: 'SKU' },
      { id: 3, val: 'Colour' },
      { id: 4, val: 'Size' },
      { id: 5, val: 'Issues' },
      { id: 6, val: 'Quantity' },
      { id: 7, val: 'Upload Photos' },
      { id: 8, val: 'Valid SKU' },
      { id: 9, val: 'Edit Value' }
    ];
  }

  ngOnInit() {
    this.getAllCase = [];
    this.loaderService.display(true);
    this.getCaseValue(null);
  }
  getCaseValue(param:any) {
    this._CaseValidationService.getAllCaseValidation(param).subscribe(
      result => {
        this.getAllCase = result;
        
        for (let i = 0; i < this.getAllCase.length; i++) {
         let parentGridData = [
           { id: this.getAllCase[i].caseid, val: 'Case Reference', pdata: this.getAllCase[i].case_number,coltype:'text' },
           { id: this.getAllCase[i].caseid, val: 'Number of Items', pdata: this.getAllCase[i].NumberOfItems, coltype:'text' },
           { id: this.getAllCase[i].caseid, val: 'Case Date', pdata: this.getAllCase[i].CaseDate, coltype:'text' },
           { id: this.getAllCase[i].caseid, val: 'Customer Email Address', pdata: this.getAllCase[i].CustomerEmailAddress, coltype:'text'},
           { id: this.getAllCase[i].caseid, val: 'Customer Number', pdata: this.getAllCase[i].CustomerNumber, coltype:'text' },
           { id: this.getAllCase[i].caseid, val: 'Customer Name', pdata: this.getAllCase[i].CustomerName, coltype:'text'},
           { id: this.getAllCase[i].caseid, val: 'PO/WO #', pdata: this.getAllCase[i].POWO, coltype:'text'},
           { id: this.getAllCase[i].caseid, val: 'Edit Address', pdata: 'Edit', coltype:'button'}
          ];
          this.parentGridData.push(parentGridData);
        }
        debugger;
        //this.parentGridData = result;
        this.loaderService.display(false);
      });
  }
  onFilterChanged() {
    this.loaderService.display(true);
    this.getAllCase = [];
    this.getCaseValue(this.filterText);
  }
  

  getCaseDetailsValueRetuen(param: any) {
    //debugger;
    this.loaderService.display(true);
    this.childGridData = [];
    this._CaseValidationService.getCaseDetailsValidation(param).subscribe(
      result => {
        
        this.getCaseDetails = result;
       // return result;
        for (let i = 0; i < this.getCaseDetails.length; i++) {
          let childGridData = [
            { id: this.getCaseDetails[i].casedetailid, val: 'Model #', cdata: this.getCaseDetails[i].product_number, coltype:'text' },
            { id: this.getCaseDetails[i].casedetailid, val: 'SKU', cdata: this.getCaseDetails[i].product_sku, coltype:'text' },
            { id: this.getCaseDetails[i].casedetailid, val: 'Colour', cdata: this.getCaseDetails[i].base_color, coltype:'text' },
            { id: this.getCaseDetails[i].casedetailid, val: 'Size', cdata: this.getCaseDetails[i].size_code_id, coltype:'text'},
            { id: this.getCaseDetails[i].casedetailid, val: 'Issues', cdata: 'N/A', coltype:'text' },
            { id: this.getCaseDetails[i].casedetailid, val: 'Quantity', cdata: this.getCaseDetails[i].product_qty, coltype:'text' },
            { id: this.getCaseDetails[i].casedetailid, val: 'Upload Photos', cdata: 'N/A', coltype:'text'},
            { id: this.getCaseDetails[i].casedetailid, val: 'Valid SKU', cdata: 'N/A', coltype:'text'},
            { id: this.getCaseDetails[i].casedetailid, val: 'Edit Value', cdata: 'Edit', coltype:'button' }
          ];
          this.childGridData.push(childGridData);
        }
        debugger;
        //this.childGridData = result;
        this.loaderService.display(false);
      });
  }
  editAddress(param:any) {
    //obj,template: TemplateRef<any>
    //debugger;
    this.loaderService.display(true);
    this._CaseValidationService.getAddressVal(param).subscribe(
      result => {
        //debugger;
        this.getAddress = result;
        this.loaderService.display(false);
        this.openEdit(this.editTemplate);
      });
    
  }
  editChildVal(param: any) {
    this._CaseValidationService.editCaseDetails(param).subscribe(
      result => {
        //debugger;
        this.editCaseDetails = result;
        this.loaderService.display(false);
        this.modalRef = this.modalService.show(this.editChildTemplate);
      });
    
  }
  openEdit(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
