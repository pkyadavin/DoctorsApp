import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../shared/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'google-chart',
    template: `
    <div id="org_chart" *ngIf="isWFLoaded" [chartData]="org_ChartData" [chartOptions] = "org_ChartOptions" chartType="orgchart" GoogleChart></div>
    `
})
export class GCComponent {
    @Input() TaskModuleID: number;
    errorMessage: string;
    isWFLoaded = false;
    public org_ChartData = [['Name', 'Manager', 'ToolTip']];
    //public org_ChartData = [
    //    ['Booked In', '', ''],
    //    ['General Scanning', 'Booked In', ''],
    //    ['Technician Scanning', 'General Scanning', ''],
    //    ['In Diagnostics', 'Technician Scanning', ''],
    //    ['In Repair', 'In Diagnostics', ''],
    //    ['Hold For Parts', 'In Repair', ''],
    //    ['Hold For ADP Approval', 'In Repair', ''],
    //    ['Hold For Quotation', 'In Repair', ''],
    //    ['Quotation Accepted', 'Hold For Quotation', ''],
    //    ['Quotation Rejected', 'Hold For Quotation', ''],
    //    ['Payment Done', 'Quotation Accepted', ''],
    //    ['Repaired', 'In Repair', ''],
    //    ['In Testing', 'Repaired', ''],
    //    ['Testing Pass', 'In Testing', ''],
    //    ['Testing Fail', 'In Testing', ''],
    //    [{ v: 'xyz', f: 'In Repair' }, 'Testing Fail', ''],
    //    ['Ready for Delivery', 'Testing Pass', ''],
    //    ['Awaiting for Customer Pickup', 'Ready for Delivery', ''],
    //    ['Closed', 'Awaiting for Customer Pickup', ''],
    //    ['Awaiting Courier Pickup', 'Ready for Delivery', ''],
    //    ['In Transit To Customer', 'Awaiting Courier Pickup', ''],
    //    ['Closed', 'In Transit To Customer', '']
    //];
    //public org_ChartData: any;
    public org_ChartOptions = {
        title: 'Hierarchy',
        width: 900,
        height: 500
    };

    constructor(private $CommonService: CommonService, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.$CommonService.getWFHierarchy(this.TaskModuleID)
            .subscribe(
            _hr => {
                var chart = _hr.recordsets[0];
                for (let item of chart) {
                    this.org_ChartData.push([
                        JSON.parse(item.Names)[0], item.Manager, item.ToolTip
                    ]
                        )
                }
                if (this.org_ChartData.length > 1)
                    this.org_ChartData.splice(0,1);
                this.isWFLoaded = true;
                //this.org_ChartData = chart.data;                
            },
            error => this.errorMessage = <any>error);        
    }
}
