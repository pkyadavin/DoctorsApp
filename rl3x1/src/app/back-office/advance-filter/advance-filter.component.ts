import { Component, OnInit } from '@angular/core';
import { Util } from 'src/app/app.util';
import { ReturnsService } from '../returns/returns.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  providers:[ReturnsService, Util],
  styleUrls: ['./advance-filter.component.css']
})
export class AdvanceFilterComponent implements OnInit {
  status: string;
  constructor(private _util: Util, private _returnService: ReturnsService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.paramMap.subscribe(param => {
      this.status = param.get('Code');
    })
  }
  scanRMAByRMANumber(RMANumber: string) {
    console.log('hit');
    this._returnService.scanRMA(RMANumber, 'initiated', 'scanned').subscribe(_result => {
      console.log('res:', _result);
      if (_result.recordsets[0][0].Status == 1) {
        this._util.success('Scanned successfully.', "Success");
        
      }
      else if (_result.recordsets[0][0].Status == 0) {
        this._util.error(_result.recordsets[0][0].ErrorMessage, "Error");
      }
    });
  }
}
