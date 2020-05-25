import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageTemplate } from './MessageTemplate.model.js';
import { MessagingKeyValue } from './MessagingKeyValue.model.js';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { Property, Util } from '../../app.util';
import { MessageTemplateService } from './messageTemplate.Service.js'
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { CommonService } from '../../shared/common.service'
import { SidebarService } from '../sidebar/sidebar.service.js';
declare var $: any;
@Component({
    selector: 'MessageTemplateGrid',
    providers: [MessageTemplateService],
    templateUrl: './messagingTemplate.html'
})

export class MessageTemplateGrid extends Property {
    IsGridLoaded: boolean = false;
    messagetemplates: MessageTemplate[];
    IsLoaded: boolean;
    ntID: number;
    formField: [{}];
    MessageSetUpKeyValueData: Observable<any>;
   // MessageSetUpKeyValueData: MessagingKeyValue[];
    gridOptions: GridOptions;
    errorMessage: string;
    ListView: boolean = true;
    filterValue: string = null;
    dataSource: any;
    IsEmailNotification: boolean;
    IsTextNotification: boolean;
    SelectedTDName: any;
    CurrentCursorPosition: any;
    MessageSetupBody: any;
    btnAdd: boolean;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    UserID: number;
    LocalAccess = [];
    isSaveClick: any;
    columnDefs = [{ headerName: "Template Code", field: "TemplateCode", width: 180,suppressFilter: true  },
        { headerName: 'Template Name', field: "TemplateName", width: 180, suppressFilter: true  },
        { headerName: 'Created By', field: "CreatedBy", width: 180, suppressFilter: true  },
        { headerName: 'Created Date', field: "CreatedDate", width: 180, suppressFilter: true  },
    
        { headerName: "Modified By", field: "ModifyBy", width: 140, suppressFilter: true },
        { headerName: "Modified Date", field: "ModifyDate", width: 140, suppressFilter: true }
        , {
        headerName: 'Active',
        field: 'IsActive',
        width: 80,
        suppressFilter: true,
        cellRenderer: function (params: any) {
            return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" style="padding-left:15px;"><span ng-cell-text class="ng-binding"><i class="' + params.value.toString() + '"></i></span> </div>';
        }
    },]

   
    CurrentMessageTemplate: MessageTemplate = new MessageTemplate();

    constructor(private _util:Util,
        private messageTemplateService: MessageTemplateService,private _menu: SidebarService,private _router:Router, private _globalService: GlobalVariableService, private _activateRoute: ActivatedRoute, private commonService: CommonService
    ) {
        super();
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID = partnerinfo[0].UserId;
        this.loadPermissionByModule(this.moduleTitle);
    }

    onSelectionChanged() {   
        this.isEditConfigSetup$ = true;
        this.isDeleteConfigSetup$ = true;
        this.CurrentMessageTemplate = this.gridOptions.api.getSelectedRows()[0];
      

        if (!this.CurrentMessageTemplate) {
            this.isEditConfigSetup$ = false;
            this.isDeleteConfigSetup$ = false;
        } else {

            if (String(this.CurrentMessageTemplate.IsActive) == 'No')
            {
                this.CurrentMessageTemplate.IsActive = false;
            }
            else
                this.CurrentMessageTemplate.IsActive = true;
        }
        
    }
   @ViewChild('pop') _popup: message;
   @ViewChild('pop1') _popup1: modal;
   ngOnInit() {
       this.gridOptions = {
           rowData: this.messagetemplates,
           columnDefs: null,
           enableColResize: true,
           enableServerSideSorting: true,
           pagination:true,
          // pagination:true,
           rowModelType: 'infinite',
           paginationPageSize: 20,
           rowSelection: 'single',
           maxConcurrentDatasourceRequests: 2,
           rowHeight: 38,
       };
       this.dataSource = {
           rowCount: null, // behave as infinite scroll
           paginationPageSize: 20,
           paginationOverflowSize: 20,
           maxConcurrentDatasourceRequests: 2,
           maxPagesInPaginationCache: 2,
           getRows: (params: any) => {
               var sortColID = null;
               var sortDirection = null;
               if (typeof params.sortModel[0] != 'undefined') {
                   sortColID = params.sortModel[0].colId;
                   sortDirection = params.sortModel[0].sort;
               }
               this.messageTemplateService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterValue, this.partnerID).
                   subscribe(         
                                     
                   result => {
                       var rowsThisPage = result.recordsets[0];
                       var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
                       
                       this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });

                       var localeditor = localize.map(function (e) {
                           return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                       });
                       this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");


                       var rowsThisPage = result.recordsets[0];

                       this._globalService.setLinkCellRender(localize, 'TemplateCode', true);
                       this._globalService.setLinkCellRender(localize, 'TemplateName', true);

                       if(!this.gridOptions.columnApi.getAllColumns())
                       this.gridOptions.api.setColumnDefs(this.h_localize);                       
                       var lastRow = result.totalcount;
                       params.successCallback(rowsThisPage, lastRow);
                       this.isEditConfigSetup$ = false;
                       this.isDeleteConfigSetup$ = false;
                   });
               this.messageTemplateService.loadkey().
                   subscribe(
                   result => {
                       this.MessageSetUpKeyValueData = result;
            
                       this.ListView = true;
                       this.IsLoaded = false;
                   },
                   Error => this.errorMessage = <any>Error
                   );

           }
       }
       this.gridOptions.datasource = this.dataSource;
    }



   DownloadMsg() {
       var params = {
           skipHeader: false,
           skipFooters: true,
           skipGroups: true,
           fileName: "MessageTemplate.xls"
       };
     }


    onFilterChanged() {
        
        if (this.filterValue === '') {
            this.filterValue = null;
        }
        this.gridOptions.api.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterValue);
    }

    Save(form) {
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            form.valueChanges.subscribe(data => {
                this.isSaveClick = !form.valid;
            })
            this.isSaveClick = true;
            return;
        }
        this.CurrentMessageTemplate.UserID = this.UserID;
        if (this.CurrentMessageTemplate.IsActive == undefined || this.CurrentMessageTemplate.IsActive == false) {
            this.CurrentMessageTemplate.IsActive = false;
        }
        else {
            this.CurrentMessageTemplate.IsActive = true;
        }

       // alert(JSON.stringify(this.CurrentMessageTemplate));
        if (this.CurrentMessageTemplate.ID == undefined) {
            this.CurrentMessageTemplate.ID = 0;
        }
     
        //this.reg = [{ 'Data': JSON.stringify(this.CurrentMessageTemplate) }];
        this.messageTemplateService.Save(this.CurrentMessageTemplate)
            .subscribe(returnvalue => {
              
                var result = returnvalue.data;
                if (result == "Added") {
                    this._util.success('Record saved successfully.',"Success","Success");
                    this.gridOptions.api.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.Cancel();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.',"Success","Success");
                    this.Cancel();
                    this.gridOptions.api.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    return;
                }
                else if (result == "Code Exists") {
                    this._util.error('Template Code already exists.',"Error");
                    return;
                }
                else {
                    this._util.error('Something went wrong.',"Error");
                    return;
                }
            },
            error => this.errorMessage = <any>error);
    }
    

    Delete(rowTodelete) {
        var me = this;
        this._popup.Confirm('Delete', 'Do you really want to remove this Record?', function () {
            
            me.messageTemplateService.remove(rowTodelete)
                .subscribe(
                Result => {
                    var result = Result.data;
                    if (result == "Deleted") {
                        //this._popup.Alert('Alert', 'Record Deleted Successfully');
                        me.gridOptions.api.setDatasource(me.dataSource);
                        me.Cancel();
                        return;
                    }

                    // this.Cancel();

                },
                error => this.errorMessage = <any>error);

        });
    }


    Show(mode: string) {
        if (mode == 'Edit') {

            this.IsLoaded = false;
            this.messageTemplateService.loadkey().
                subscribe(
                result => {

                    this.MessageSetUpKeyValueData = result;
                  
                    this.ListView = false;
                    this.IsLoaded = true;
                },
                Error => this.errorMessage = <any>Error
                );
          
        }
        else
        {
            this.ListView = false;
            this.IsLoaded = true;
            this.isEditConfigSetup$ = true;
            this.isCancel$ = true;
           
            this.CurrentMessageTemplate = new MessageTemplate();
            this.CurrentMessageTemplate.IsActive = true;
            }
       
    }

    highlightBG(tblTd, color) {
   
        $('.tblTDClass').css('background-color', '');
        $('#KV' + tblTd).css('background-color', color);
        this.SelectedTDName = $.trim($('#KV' + tblTd).text());
       
       // alert(this.SelectedTDName);
    }

    MovetoTemplateBody() {
        if (this.CurrentCursorPosition == 0 || typeof this.CurrentCursorPosition == "undefined")
            this.CurrentCursorPosition = 0;
        if (typeof this.SelectedTDName == "undefined" || this.SelectedTDName == '') {
            this.SelectedTDName = '';
           
            return false;
        }
        var txtBody = $("#dropdiv").val();
        var bodyTemplate = txtBody.substr(0, this.CurrentCursorPosition) + " " + this.SelectedTDName + " " + txtBody.substr(this.CurrentCursorPosition);

        $("#dropdiv").val(bodyTemplate);
        this.MessageSetupBody = bodyTemplate;
        $("#dropdiv").focus();
        $("#dropdiv").append(" ");
        this.SelectedTDName = '';
        $('.tblTDClass').css('background-color', ''); this.CurrentCursorPosition = 0;
    };

    templateBodyCursor() {
       
        var el = $("#dropdiv").get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
        }
        //alert(pos);
        this.CurrentCursorPosition = pos;
        //return pos;
    };
    onSubmit() {
       // This function not in use
        this.messageTemplateService.Save(this.CurrentMessageTemplate).subscribe(returnvalue => {
            this.ListView = true;
           
            this._util.error('region updated successfully.','Alert');
            this.CurrentMessageTemplate = new MessageTemplate();
         
        }, error => this._util.error(error, 'error'));
    }

    Cancel() {
        this.isAddConfigSetup$ = true;
        this.isDeleteConfigSetup$ = false;
        this.isEditConfigSetup$ = false;
        this.isCancel$ = false;
        this.ListView = true;
        this.CurrentMessageTemplate = new MessageTemplate();   

        var node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            node.setSelected(false);
        }
    }
    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }
    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "edit") {

                this.Show('Edit');

            }
        }
    }

}