import { Component, ViewChild } from '@angular/core';
import { RepairActionCodeService } from './repairactioncode.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { RepairActionCode } from './repairactioncode.model';
import { CommonService } from '../../shared/common.service'
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Property, Util } from '../../app.util';
//for popup
import { message, modal } from '../../controls/pop/index.js';
import { SidebarService } from '../sidebar/sidebar.service';
declare var $: any;

@Component({
    selector: 'RepairActionCode',
    providers: [RepairActionCodeService],
    templateUrl: './repairactioncode.html'
})

export class RepairActionCodeComponent extends Property {
    filterText: string;
    loading: boolean;
    repairActionCodelist: RepairActionCode[];
    formField: [{}];
    currentRepairActionCode: RepairActionCode = new RepairActionCode;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    isAddRepairActionCode$ = true;
    isEditRepairActionCode$ = false;
    isDeleteRepairActionCode$ = false;
    isRepairActionCodeList$ = true;
    isCancel$ = false;
    IsLoaded: boolean;
    IsGridLoaded: boolean;
    //CurrentMessageTemplate: MessageTemplate = new MessageTemplate();
    constructor(private _util:Util, private _menu:SidebarService,
        private repairActionCodeService: RepairActionCodeService, private _router: Router, private _globalService: GlobalVariableService, private activateRoute: ActivatedRoute) {
        super()
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.url[0].path); 
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
    }
    //for pop up
    @ViewChild('pop') _popup: message;
    @ViewChild('pop1') _popup1: modal;
    //till here
    gridapi = null;
    onGridReady(gridParams){
        this.gridapi = gridParams.api;
        gridParams.api.setDatasource(this.dataSource)
    }
    ngOnInit() {

        this.filterText = null;
        this.loading = true;
        this.gridOptions = {
            rowData: this.repairActionCodelist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationpaginationOverflowSize: 2,
            rowSelection: 'single',
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInCache: 2
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
                this.repairActionCodeService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText).
                    subscribe(
                    result => {
                        var rowsThisPage = result.recordsets[0];
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinitions);
                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var repairactioncode_editor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
                        });
                        this.e_localize = JSON.parse("{" + repairactioncode_editor.join(',') + "}");

                        if(!this.gridOptions.columnApi.getAllColumns())
                        this.gridOptions.api.setColumnDefs(this.h_localize);
                        var lastRow = result.totalcount;
                        //  alert(JSON.stringify(this.e_localize));
                        params.successCallback(rowsThisPage, lastRow);

                        this.isEditRepairActionCode$ = false;
                    });
            }
        }
    }

    onSelectionChanged() {
        this.isEditRepairActionCode$ = true;
        this.currentRepairActionCode = this.gridOptions.api.getSelectedRows()[0];
    }

    onSubmit(form: any) {
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            return;
        }


        if (this.currentRepairActionCode.RepairActionCodeID == undefined) {
            this.currentRepairActionCode.RepairActionCodeID = 0;
        }

        this.repairActionCodeService.Save(this.currentRepairActionCode).subscribe(returnvalue => {
            var res = returnvalue.data;
            if (res == "Duplicate string") {
                this._util.error('Record already exists.',"Alert");
                return;
            }
            else if (res == "Updated") {
                this._util.success('Updated successfully.',"Success","Success");

            }
            else if (res == "Created") {
                this._util.success('Saved successfully.',"Success","Success");

            }
            else
                this._util.error('Error in fetching record.',"Alert");
        }, error => this._util.error(error, 'error'));

    }

    ShowHideAdd() {
        this.isAddRepairActionCode$ = false;
        this.isEditRepairActionCode$ = false;
        this.isRepairActionCodeList$ = false;
        this.isCancel$ = true;
        this.currentRepairActionCode = new RepairActionCode();
        this.currentRepairActionCode.RepairActionCodeID = 0;
        this.currentRepairActionCode.RepairActionName = "";
        this.currentRepairActionCode.IsActive = false;
        //this.currentRepairActionCode.CreatedBy = "abc";
        //this.currentRepairActionCode.ModifyBy = "abc1";
    }

    ShowHideEdit() {
        this.isAddRepairActionCode$ = true;
        this.isEditRepairActionCode$ = true;

        this.isCancel$ = true;
        this.isRepairActionCodeList$ = false;

    }

    CancelRepairActionCode() {
        this.isAddRepairActionCode$ = true;
        this.isEditRepairActionCode$ = false;
        this.isCancel$ = false;
        this.isRepairActionCodeList$ = true;
        this._router.navigate(['app.RepairActionCode']);
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }

    Delete(rowTodelete) {
        alert("Are you sure want to delete this record?");
        this.repairActionCodeService.remove(rowTodelete)
            .subscribe(
            repair => {
                var result = repair.data;

                this.gridOptions.api.setDatasource(this.dataSource);
                //if (result == "Deleted")  
                //    this._popup.Alert('Alert', 'Record deleted successfully.');
                this.CancelRepairActionCode();

                return;

            },
            error => this.errorMessage = <any>error);


    }

}