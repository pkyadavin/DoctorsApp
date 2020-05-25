import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe} from '@angular/common';
import { AgingReport, PostAgingReport } from './agingreport.model';
import { AgingReportService } from './agingreport.service';


@Component({
    selector: 'AgingReport',
    providers: [AgingReportService, DatePipe],
    templateUrl: './agingreport.html'
})

export class AgingReportGrid {
    agingReports: AgingReport[];
    postAgingReport: PostAgingReport = new PostAgingReport();
    currentDate: Date;
    constructor(private _agingService: AgingReportService, private _datePipe: DatePipe) {
        this.currentDate = new Date();
        this.postAgingReport.fromDate = _datePipe.transform(new Date().setMonth(this.currentDate.getMonth() - 1), 'yyyy-MM-dd');
        this.postAgingReport.toDate = _datePipe.transform(this.currentDate, 'yyyy-MM-dd');
        this.getAgingReport();
    }

    getAgingReport() {
        this._agingService.loadAll(this.postAgingReport).subscribe(
        _result => {
            this.agingReports = _result.recordsets[0];
            console.log(this.agingReports.length);
        });
    }
} 
