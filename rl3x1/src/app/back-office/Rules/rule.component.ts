import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Rule } from './rule.model';
import { RuleService } from './rule.service';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '../../shared/common.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { Property, Util } from '../../app.util';
import { message, modal } from '../../controls/pop';
import { EditComponent } from '../../shared/edit.component'
import { SidebarService } from '../sidebar/sidebar.service';
declare var $: any;

@Component({
    selector: 'RuleGrid',
    providers: [RuleService],
    templateUrl: './rule-template.html'
})

export class RuleGrid extends Property {
    IsGridLoaded: boolean = false;
    selectedRuleID: number;
    filterText: string;
    loading: boolean;
    Rules: Rule[];
    currentRule: Rule;
    dataSource: any;
    ruleGridOptions: GridOptions;
    errorMessage: string;
    ListView: boolean = true;
    filterValue: string = null;
    LocalAccess: string[];
    addressGridPopup: boolean = false;
    partnerID: any;
    moduleTitle: any;
    isEditVisible: boolean = false;
    selectedId: number;
    columnDefs = [{}];
    UserID:number;
    @ViewChild('pop') _popup: message;


    constructor(private _util:Util,private _ruleService: RuleService,private _menu:SidebarService, public commonService: CommonService, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService, private _router: Router) {
        super();
        this.filterText = null;
        this.loading = true;
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;
        this.loadPermissionByModule(this.moduleTitle);

    }
    ngOnInit() {
        this.ruleGridOptions = {
            rowData: this.Rules,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            rowSelection: 'single',
            rowDeselection: true,
            maxConcurrentDatasourceRequests: 2,
            cacheOverflowSize: 2,
            maxBlocksInCache: 2,
            cacheBlockSize: 20,
            rowHeight: 38,
            context: {
                componentParent: this
            }
        };

        this.dataSource = {
            rowCount: null,
            paginationPageSize: 20,
            paginationOverflowSize: 2,
            maxPagesInPaginationCache: 2,
            maxConcurrentDatasourceRequests: 2,
            getRows: (params: any) => {
                var sortColID = null;
                var sortDirection = null;
                var filterData = null;
                if (typeof params.sortModel[0] != 'undefined') {
                    sortColID = params.sortModel[0].colId;
                    sortDirection = params.sortModel[0].sort;
                }

                this._ruleService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    _result => {
                        var rowsThisPage = _result.recordsets[0];
                        
                        //if (!this.IsGridLoaded){
                        //    this.columnDefs = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);                            
                        //}
                          var localize = JSON.parse(_result.recordsets[1][0].ColumnDefinitions);
                                           
                        //this._globalService.setLinkCellRender(this.columnDefs, 'RuleName', true);
                        //this._globalService.setLinkCellRender(this.columnDefs, 'RuleCode', true);

                        var coldef = localize.find(element => element.field == "RuleName");
                        if (coldef != null && this.hasPermission("View")) {
                            coldef.cellRendererFramework = EditComponent;
                        }

                        var coldef1 = localize.find(element => element.field == "RuleCode");
                        if (coldef1 != null && this.hasPermission("View")) {
                            coldef1.cellRendererFramework = EditComponent;
                        }
                        if(!this.ruleGridOptions.columnApi.getAllColumns())
                        this.ruleGridOptions.api.setColumnDefs(localize);
                        this.Rules = _result;
                        //this.IsGridLoaded = true;
                        var lastRow = _result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);
                        this.isEditVisible = false;
                    });
            }
        }

        this.ruleGridOptions.datasource = this.dataSource;

        this.loading = false;
        this.currentRule = new Rule();
        this.ListView = true;
    }

    MoveUp() {
        this._ruleService.moveup(this.currentRule.RuleID)
            .subscribe(
            _result => {
                this.ruleGridOptions.api.setDatasource(this.dataSource);
            },
            error => this.errorMessage = <any>error);
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.ruleGridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
        this.isEditVisible = false;
    }

    onSelectionChanged() {
        this.currentRule = this.ruleGridOptions.api.getSelectedRows()[0];
        if (!this.currentRule) 
            this.isEditVisible = false;
        else
            this.isEditVisible = true;
    }

    ShowForm(ruleId: number) {
        this.selectedId = ruleId;
        this.ListView = false;
        //this._router.navigate(['getcurrency'], { queryParams: { ID: currencyId } });
    }

    EditClicked(val) {
        this.currentRule = val;
        this.ShowForm(this.currentRule.RuleID);
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, Module).subscribe(
            returnvalue => {
                this.Permissions = returnvalue[0];
                this.LocalAccess = returnvalue[0].map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }

    ShowPerMission(permission: string): boolean {
        if (typeof (this.Permissions) == 'undefined') {
            return false;
        }
        else {
            var index = this.Permissions.findIndex(x => x.FunctionName == permission)
            if (index >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    ChangeEditorVisibility(data) {
        if (data) {
            this.ruleGridOptions.api.setDatasource(this.dataSource);
            this.isEditVisible = false;
        }
        var node = this.ruleGridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
        this.ListView = true;
    }

    DeleteRule(me: any = this) {
        
        this._popup.Confirm('Delete', 'Do you really want to remove this Rule?', function () {
            me._ruleService.deletebyRuleId(me.currentRule.RuleID)
                .subscribe(
                _result => {
                    var outputRecord = _result.totalcount;
                    if (outputRecord == 0) {
                        me._util.success('Rule deleted.',"Success","Success");
                        me.ruleGridOptions.api.setDatasource(me.dataSource);
                    }
                    else
                        me._util.warning('You can not delete this Rule.',"Alert");
                },
                error => me.errorMessage = <any>error);
        });
    }

} 