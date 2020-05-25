import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { message, modal } from '../../controls/pop/index.js';
import { TenantViewComponent } from './detail.component';
import { Tenant } from './tenant.model';
import { TenantService } from './tenant.service';
import { Tabs } from '../../controls/tabs/tabs.component.js';
import { Tab } from '../../controls/tabs/tab.component.js';
import { FTPDetails } from '../../leads/lead.model';
import { Util } from '../../app.util'
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;

@Component({
    selector: 'tenant',
    providers: [TenantService],
    templateUrl: './tenant.html'
})

export class TenantComponent implements OnInit {
    
    filterText: string;
    Tenantlist: Tenant[];
    CurrentTenant: Tenant;
    IsListView: boolean = true;
    dataSource: any;
    OrderStatus: string = "TS006";    
    tenantFTP: any;
    gridOptions: GridOptions;
    gridOptionsApproved: GridOptions;
    gridOptionsDenied: GridOptions;
    gridOptionsArchived: GridOptions;
    gridOptionsDeleted: GridOptions;
    IsPaymentReceive: boolean = false;
    Tenantrawdata: any;

    columnDefs = [
        { headerName: 'Tenant', field: 'TenantName', width: 250 },       
        { headerName: 'Signup Type', field: "ClaimType", width: 150 },
        { headerName: 'Domain', field: "Domain", width: 150 },
        { headerName: 'CP Domain', field: "CPDomain", width: 150 },
        { headerName: 'Email', field: "EmailId", width: 150 },
        { headerName: 'Mobile', field: "Mobile", width: 150 },
        { headerName: 'Valid From', field: "ValidFrom", width: 150 },
        { headerName: 'Valid UpTo', field: "ValidTo", width: 150 },
        { headerName: 'Allowed User', field: "NoOfUsers", width: 150 }
    ];


    errorMessage: string;

    constructor(
        private $Service: TenantService, private _activatedRoute: ActivatedRoute, private router:Router,private _Util:Util,private ngxService: NgxUiLoaderService) {
        this.CurrentTenant = new Tenant(null);
    }

    @ViewChild('pop') _popup: message;
    @ViewChild('modalReject') _reject: modal;
    gridapi=null;
    onGridReady(gridparam)
    {
        this.gridapi = gridparam.api;
    }
    gridApprovedapi=null;
    onGridApprovedReady(gridparam)
    {
        this.gridApprovedapi = gridparam.api;
    }
    gridRejectedapi=null;
    onGridRejectedReady(gridparam)
    {
        this.gridRejectedapi = gridparam.api;
    }
    gridArchivedapi=null;
    onGridArchivedReady(gridparam)
    {
        this.gridArchivedapi = gridparam.api;
    }
    gridDeletedapi=null;
    onGridDeletedReady(gridparam)
    {
        this.gridDeletedapi = gridparam.api;
    }
    ngOnInit() {              
        this.filterText = null;
        this.gridOptions = {
            rowData: this.Tenantlist,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
            context: {
                componentParent: this
            }
        };
        this.gridOptionsApproved = {
            rowData: this.Tenantlist,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
            context: {
                componentParent: this
            }
        };
        this.gridOptionsDenied = {
            rowData: this.Tenantlist,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
            context: {
                componentParent: this
            }
        };
        this.gridOptionsArchived = {
            rowData: this.Tenantlist,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
            context: {
                componentParent: this
            }
        };
        this.gridOptionsDeleted = {
            rowData: this.Tenantlist,
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination:true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
            context: {
                componentParent: this
            }
        };

        this.dataSource = {
            rowCount: null,
            paginationPageSize: 20,
            paginationOverflowSize: 2,
            maxPagesInPaginationCache: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }
                this.$Service.loadAll(this.OrderStatus, params.startRow, params.endRow, sortColID, sortDirection, this.filterText).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        this.gridapi.setColumnDefs(this.columnDefs);
                        this.gridApprovedapi.setColumnDefs(this.columnDefs);
                        //this.gridDeniedapi.setColumnDefs(this.columnDefs);
                        this.gridArchivedapi.setColumnDefs(this.columnDefs);
                        this.gridDeletedapi.setColumnDefs(this.columnDefs);
                        var lastRow = result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);
                    });
            }
        }
        switch (this.OrderStatus) {
            case "TS006":
                this.gridOptions.datasource = this.dataSource;
                break;
            case "TS002":
                this.gridOptionsApproved.datasource = this.dataSource;
                break;
            case "TS003":
                this.gridOptionsDenied.datasource = this.dataSource;
                break;
            case "TS004":
                this.gridOptionsArchived.datasource = this.dataSource;
                break;
            case "TS005":
                this.gridOptionsDeleted.datasource = this.dataSource;
                break;
        }        

        this.tenantFTP = new FTPDetails();       
        //this.gridOptions.datasource = this.dataSource;
    }
    TenantRenderer(params: any) {
        var data = params.data;
        return '<div style="padding-left:5px;"><img border="0" width="15" src="'+data.ImagePath+'">  <label class="ui-grid-cell-contents"> ' + params.value.toString() + '</label></div>';
    }

    //PaymentReceive(data) {
    //    this.IsPaymentReceive = data;
    //}

    tenantDataChange(data) {
        this.Tenantrawdata = data;        
    }

    ConfigureTenant() {
        var url = "http://" + this.CurrentTenant.Domain + ".reverselogix.co";
        window.open(url, "_blank");
    }

    OnTabChanged(OrderStatus) {        
        this.OrderStatus = OrderStatus;
        this.CurrentTenant = new Tenant(null);
        if (this.gridOptions.api && this.gridOptionsApproved.api && this.gridOptionsArchived.api && this.gridOptionsDeleted.api) {            
            switch (OrderStatus) {
                case "TS006":
                    this.gridOptions.api.setColumnDefs(this.columnDefs);
                    this.gridOptions.api.setDatasource(this.dataSource);
                    break;
                case "TS002":
                    this.gridOptionsApproved.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsApproved.api.setDatasource(this.dataSource);
                    break;
                case "TS003":
                    this.gridOptionsDenied.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsDenied.api.setDatasource(this.dataSource);
                    break;
                case "TS004":
                    this.gridOptionsArchived.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsArchived.api.setDatasource(this.dataSource);
                    break;
                case "TS005":
                    this.gridOptionsDeleted.api.setColumnDefs(this.columnDefs);
                    this.gridOptionsDeleted.api.setDatasource(this.dataSource);
                    break;
            }
        }
    }

    onSelectionChanged() {
        switch (this.OrderStatus) {
            case "TS006":
                this.CurrentTenant = new Tenant(this.gridOptions.api.getSelectedRows()[0]);
                break;
            case "TS002":
                this.CurrentTenant = new Tenant(this.gridOptionsApproved.api.getSelectedRows()[0]);
                break;
            case "TS003":
                this.CurrentTenant = new Tenant(this.gridOptionsDenied.api.getSelectedRows()[0]);
                break;
            case "TS004":
                this.CurrentTenant = new Tenant(this.gridOptionsArchived.api.getSelectedRows()[0]);
                break;
            case "TS005":
                this.CurrentTenant = new Tenant(this.gridOptionsDeleted.api.getSelectedRows()[0]);
                break;            
        }            
    }
    onFilterChanged() {
        
        if (this.filterText === '') {
            this.filterText = null;
        }

        switch (this.OrderStatus) {
            case "TS006":
                this.gridOptions.api.setDatasource(this.dataSource);
                //this.gridOptions.api.setQuickFilter(this.filterText);
                break;
            case "TS002":
                this.gridOptionsApproved.api.setDatasource(this.dataSource);
                //this.gridOptionsApproved.api.setQuickFilter(this.filterText);
                break;
            case "TS003":
                this.gridOptionsDenied.api.setDatasource(this.dataSource);
                //this.gridOptionsDenied.api.setQuickFilter(this.filterText);
                break;
            case "TS004":
                this.gridOptionsArchived.api.setDatasource(this.dataSource);
                //this.gridOptionsArchived.api.setQuickFilter(this.filterText);
                break;
            case "TS005":
                this.gridOptionsDeleted.api.setDatasource(this.dataSource);
                //this.gridOptionsDeleted.api.setQuickFilter(this.filterText);
                break;
        }
    }

    isSaveClick: boolean = false;
    OnSubmit() {

        var IsPaymentType: string;

        if (this.CurrentTenant.ClaimType == "pro") {
            
            //if (!this.IsPaymentReceive) {
            //    this._popup.Alert('alert', 'Plese Select Payment Received');
            //    return;
            //}
            //else {
            //    IsPaymentType = "Paid"
            //}

            IsPaymentType = "Paid"
        }
        else {
            IsPaymentType ="Trial"            
        }        
        
        this.CurrentTenant.IsTenantSignOff = true;
        this.CurrentTenant.IsPaymentReceive = IsPaymentType;

        var reg = [{ 'tenant': this.CurrentTenant }]

        this.$Service.EnvironmentPrepare(this.CurrentTenant.Domain).subscribe(
        result => {            
            this.EnvInit(this.CurrentTenant.Domain, reg);                
        }, error => {
            this._Util.error('An error occurred while processing your request.',"error");
        });        
    }
    
    EnvInit(domain, reg)
    {
        this.$Service.EnvironmentInit(domain).subscribe(
        result => {            
            this.EnvProcess(domain, reg);
        }, error => {
            this._Util.error('An error occurred while processing your request.',"error");
        });
    }
    EnvProcess(domain, reg)
    {
        this.$Service.EnvironmentProcess(domain).subscribe(
        result => {            
            this.EnvConclude(domain, reg);
        }, error => {
            this._Util.error('An error occurred while processing your request.',"error");
        });
    }    
    EnvConclude(domain, reg)
    {
        this.$Service.Environmentconclude(domain).subscribe(
        result => {
            this.$Service.ApproveTenant(reg).subscribe(
            approveresult => {                 
                this.UpdateFTP(true);          
            });
            
        }, error => {
            this._Util.error('An error occurred while processing your request.',"error");
        });
    }

    OnRejectOpen(me: any = this) {        
        var msg = 'Are you sure you want to Reject the request ?';
        this._popup.Confirm('Alert', msg,
            function () {
                me._reject.open();
            });
    }

    OnReject(apprForm) {
        this.CurrentTenant.IsTenantSignOff = false;
        var reg = [{ 'tenant': this.CurrentTenant }]
        this.$Service.ApproveTenant(reg).
            subscribe(
            result => {
                this.IsListView = true;
                this._reject.close();
                this._Util.success('Tenant-' + this.CurrentTenant.TenantName + ' has been rejected.',"success","success");
            });
    }

    OnCancel() {
        this.IsListView = true;
    }

    AddNewTenant() {
        this.IsListView = false;
    }
    EditTenant() {

        //this.ApproveButtonText = "Approve";
        //if (this.CurrentTenant.ClaimType == "pro")
        //    this.ApproveButtonText = "Submit";
        //else
        //    this.ApproveButtonText = "Approve";

        this.IsListView = false;
    }
    DeleteTenant(t:any=this) {
        this._popup.Confirm('Delete', 'Do you really want to delete this Tenant?', t.onConfirmPopup());
    }
    onConfirmPopup() {

    }
    handleSaveRedirect(success) {
        if (success) {
            this.IsListView = true;
        }
    }

    UpdateFTP(isnew: boolean = false) {
        if (this.Tenantrawdata.companyname == "" || this.Tenantrawdata.firstname == "" || this.Tenantrawdata.lastname == "" || this.Tenantrawdata.email == "" || this.Tenantrawdata.address1 == "" || this.Tenantrawdata.city == "" || this.Tenantrawdata.zipcode == "" || this.Tenantrawdata.phone == "") {
            this._Util.error("Please enter all the required fields.","error");
            return;
        }

        var reg = [{ 'tenantFTP': JSON.stringify(this.tenantFTP), 'tenantID': this.CurrentTenant.ID, 'tenant': this.Tenantrawdata }]
        this.$Service.UpdateFTP(reg).
            subscribe(
            result => {
                if (isnew) {
                    this.IsListView = true;
                    this._Util.success('Tenant-' + this.CurrentTenant.TenantName + ' has been approved.',"success","success");
                }
                else {
                    // this.UpdateTenantDatabase();
                    this.IsListView = true;
                    this._Util.success('Record has been updated for Tenant-' + this.CurrentTenant.TenantName + '.',"success","success");
                }
            });
    }

    UpdateTenantDatabase() {

        var reg = [{ 'tenant': this.CurrentTenant, 'Tenantrawdata': this.Tenantrawdata }]
        // this.$Service.UpdateTenantDatabase(reg).
        //     subscribe(
        //     result => {  
        //         this.IsListView = true;              
        //         this._popup.Alert('alert', ' Tenant-' + this.CurrentTenant.TenantName + ' has been approved.');
        //     });
    }
    
}