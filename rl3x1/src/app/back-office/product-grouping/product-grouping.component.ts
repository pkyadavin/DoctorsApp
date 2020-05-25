import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProductGroupingService } from './product-grouping.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/RX';
 import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { ProductGroupingModel } from './product-grouping.model.js';
// import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import { ActiveComponent } from "../../shared/active.component";
import { LoaderService } from '../../loader/loader.service';
declare var $: any;
@Component({
    selector: 'GroupingGrid',
    providers: [ProductGroupingService],
    templateUrl: './product-grouping.html'
})

export class ProductGrouping extends Property {
    public searchText : string;
    IsGridLoaded: boolean = false;
    @Input() GridType: string;
  //  @Input('PartnerId') PartnerId: number;
    @Output() notifyGroupingCode: EventEmitter<any> = new EventEmitter<any>();
    CategoryArray:any=[];
    SubCategoryArray:any=[];
    GradeArray:any=[]
    GroupArray:any=[];
    searchCat:number;
    Groupinglist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    //countries: ProductGroupingModel[];
    deleteTracker:ProductGroupingModel;
    display='none';
    AllSavedGrouping : any;
    IsLoaded: boolean = false;
    ListView: boolean = true;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    RegionList: any;
    UserID: number;
   isSaveClick: any;

    columnDefs = [
        { headerName: 'Region', width: 120 },
        { headerName: 'Category Code', field: "BillingCode", width: 200 },
        { headerName: 'Description', field: "BillingCodeName", width: 200 },
        { headerName: 'ISActive', field: "Description", width: 200 }

    ];
    CurrentGroupingObj: ProductGroupingModel = new ProductGroupingModel();
    SelectedObj:any[];
    constructor(
        private _util: Util,private _menu: SidebarService, private _router: Router,
        private groupingService: ProductGroupingService, public commonService: CommonService, private _globalService: GlobalVariableService, 
        private activateRoute: ActivatedRoute, private loaderService: LoaderService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID=partnerinfo[0].UserId;
       this.SelectedObj=[];
       this.deleteTracker=new ProductGroupingModel();
    }
    ngOnInit() {
       // this.loadPermissionByModule(this.moduleTitle);
         this.GetRegions();
         this.getCatSubCatGroup();
        this.filterText = null;
        this.Groupinglist = [];
        this.gridOptions = {
            rowData: this.Groupinglist,
            columnDefs: null,
            enableColResize: true,
            enableServerSideSorting: true,
            pagination: true,
            //enableServerSideFilter: true,
            rowModelType: "infinite",
            paginationPageSize: 20,
            //paginationpaginationOverflowSize: 2,
            rowSelection: 'single',
            rowDeselection: true,
            maxConcurrentDatasourceRequests: 2,
            //paginationInitialRowCount: 1,
            //maxPagesInPaginationCache: 2,
            cacheOverflowSize: 2,
            //infiniteInitialRowCount: 1,
            maxBlocksInCache: 2,
            cacheBlockSize: 20,
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
               // if (typeof (this.PartnerId) == 'undefined') {
                //    this.PartnerId = 0;
              //  }
              this.loaderService.display(true);
                this.groupingService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {
                        this.loaderService.display(false);
                        var rowsThisPage = result.recordsets[0];
                        this.AllSavedGrouping = result.recordsets[0];
                        this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType });
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var localeditor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                        });
                        this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                        var rowsThisPage = result.recordsets[0];
                        this.IsLoaded = true;
                        // if (this.GridType == "popup") {
                        //     localize.unshift({
                        //         headerName: "Select",
                        //         width: 200,
                        //         template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                        //     });
                        //     localize.unshift({
                        //         headerName: "GradeId",
                        //         width: 200,
                        //         field: "GradeId",
                        //         hide: true,
                        //     });
                        // }

                        var coldef = this.h_localize.find(element => element.field == "CatCd");
                        if (coldef != null && this.hasPermission("View")) {
                            coldef.cellRendererFramework = EditComponent;
                        }

                        var coldef = this.h_localize.find(element => element.field == "IsActive");
                        if (coldef != null) {
                            coldef.cellRendererFramework = ImageColumnComponent;
                            coldef.cellRendererFramework = ActiveComponent;
                        }
                        if (!this.gridOptions.columnApi.getAllColumns())
                            this.gridOptions.api.setColumnDefs(this.h_localize);

                        var lastRow = result.totalcount;
                        params.successCallback(rowsThisPage, lastRow);
                        this.isEditConfigSetup$ = false;
                        this.isDeleteConfigSetup$ = false;
                    },
                    error => {
                        this.loaderService.display(false);
                        this.errorMessage = <any>error;
                    });
            }
        }

        this.gridOptions.datasource = this.dataSource;
        this.loading = false;
    }
    onSelectionChanged() { // 4
        this.isEditConfigSetup$ = true;
        this.isDeleteConfigSetup$ = true;
        this.CurrentGroupingObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentGroupingObj) {
            this.isEditConfigSetup$ = false;
            this.isDeleteConfigSetup$ = false;
        }
    }
    gridapi = null;
    gridcolumnapi = null;
    onGridReady(gridParams) {
        this.gridapi = gridParams.api;
        this.gridcolumnapi = gridParams.columnApi;
        this.gridapi.setDatasource(this.dataSource)
    }

    onFilterChanged() {
        if (this.filterText === '') {
            this.filterText = null;
        }
        this.gridapi.setDatasource(this.dataSource);
        //this.gridOptions.api.setQuickFilter(this.filterText);
    }
    onRowClicked(e) {  // 3
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "select") {
                this.notifyGroupingCode.emit(data);
                console.log(data);
            }
            else if (actionType == "edit") {
                this.CurrentGroupingObj = data;
                this.onEditCategory();

            }
        }
    }
    EditClicked(val) {// 1
        this.CurrentGroupingObj = val;
        //------fill same category data---
        this.SelectedObj.length=0;
        var tempgroup:ProductGroupingModel;
        for(var i=0;i<this.AllSavedGrouping.length;i++){
            if(this.AllSavedGrouping[i]['CatId']==this.CurrentGroupingObj.CatId){
                var tcat=this.CategoryArray.find(x=>x.CatId==this.AllSavedGrouping[i].CatId);
                var tscat=this.SubCategoryArray.find(x=>x.SubCatId==this.AllSavedGrouping[i].SubCatId);
                var tgrd=this.GradeArray.find(x=>x.GradeId==this.AllSavedGrouping[i].GradeId);
                tempgroup=new ProductGroupingModel();
                tempgroup.GroupId=this.AllSavedGrouping[i].GroupId;
                tempgroup.CatId=this.AllSavedGrouping[i].CatId;
                tempgroup.CatCd=tcat["CatCd"];
                tempgroup.CatDesc=tcat["CatDesc"];
                tempgroup.SubCatId=this.AllSavedGrouping[i].SubCatId;
                tempgroup.SubCatCd=tscat['SubCatCd'];
                tempgroup.SubCatDesc=tscat['SubCatDesc'];
                tempgroup.GradeId=this.AllSavedGrouping[i].GradeId;
                tempgroup.GradeCd=tgrd['GradeCd'];
                tempgroup.GradeDesc=tgrd['GradeDesc'];
                tempgroup.IsActive=this.AllSavedGrouping[i].IsActive=='Yes'?true:false;
                tempgroup.tempid=this.AllSavedGrouping[i].tempid;
                // this.AllSavedGrouping[i].CatCd=tcat["CatCd"];
                // this.AllSavedGrouping[i].CatDesc=tcat["CatDesc"];
                // this.AllSavedGrouping[i].SubCatCd=tscat['SubCatCd'];
                // this.AllSavedGrouping[i].SubCatDesc=tscat['SubCatDesc'];
                // this.AllSavedGrouping[i].GradeCd=tgrd['GradeCd'];
                // this.AllSavedGrouping[i].GradeDesc=tgrd['GradeDesc'];
                // this.AllSavedGrouping[i].IsActive=val['IsActive']=='Yes'?true:false;
                //this.SelectedObj.push(new ProductGroupingModel(this.AllSavedGrouping[i]));
                this.SelectedObj.push(tempgroup);
            }
        }
        this.SelectedObj.sort(function(obj1, obj2) {
            return obj1.tempid - obj2.tempid;
        });
        //================================
        this.onEditCategory();
    }
    addUpdatedData(){
        if(this.CurrentGroupingObj.CatId==0){
            this._util.error('Select category.','Alert');
            return;
        }
        if(this.CurrentGroupingObj.GradeId==0){
            this._util.error('Select Grade.','Alert');
            return;
        }
        if(this.CurrentGroupingObj.SubCatId==0){
            this._util.error('Select Subcategory.','Alert');
            return;
        }

        if(this.checkDuplicate()){
            this._util.error('Select record already exist.','Alert');
        }else{
            this.pushSelectedObj();
            this.resetControl();
        }
      }
    GetRegions() {
        this.groupingService.getRegions().
            subscribe(
           region => {

                this.RegionList =region;
               // alert(JSON.stringify(this.RegionList));
            },
            Error => this.errorMessage = <any>Error
            );
    }
    getCatSubCatGroup(){
        this.groupingService.getCatSubCatGroup().
            subscribe(
           region => {
                this.CategoryArray=region.recordsets[0];
                this.SubCategoryArray=region.recordsets[1];
                this.GradeArray=region.recordsets[2];
            },
            Error => this.errorMessage = <any>Error
            );
    }
    onAddCategory() {
        this.ListView = false;
        this.IsLoaded = true;
        this.CurrentGroupingObj = new ProductGroupingModel();
        this.SelectedObj.length=0;
        if (this.CurrentGroupingObj.IsActive == undefined) {

            this.CurrentGroupingObj.IsActive = true;

        }
    }

    onEditCategory() {// 2
        this.ListView = false;
        if(this.CurrentGroupingObj.IsActive==null)
            this.CurrentGroupingObj.IsActive = false;
        else{
            if (this.CurrentGroupingObj.IsActive == true) {
                this.CurrentGroupingObj.IsActive = true;
            }
            else {
                this.CurrentGroupingObj.IsActive = false;
            }
        }
        this.resetControl();
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

         this.CurrentGroupingObj.UserID = this.UserID
        if (this.CurrentGroupingObj.CatId >0 || this.CurrentGroupingObj.GradeId>0 || this.CurrentGroupingObj.SubCatId>0) {
            this._util.info('Please add data to grid before saving.','Info');
            return;
        }
        this.loaderService.display(true);
        this.groupingService.Save(this.SelectedObj)
            .subscribe(returnvalue => {
                this.loaderService.display(false);
                var result = returnvalue.data;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.SelectedObj.length=0;
                    this.Cancel('save');
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this.SelectedObj.length=0;
                    this.Cancel('save');
                    return;
                }
                else {
                    this._util.error('Could not be saved. Something went wrong.','Alert');
                    return;
                }
            },
            error => {
                this.loaderService.display(false);
                this.errorMessage = <any>error;
            });
            //error => this.errorMessage = <any>error);
    }

    Cancel(action) {
        if(action==''){
            this.gridapi.setDatasource(this.dataSource);
            this.isEditConfigSetup$ = false;
        }

        this.ListView = true;
        this.isAddConfigSetup$ = true;
        this.isDeleteConfigSetup$ = false;
        this.isCancel$ = false;
        var node = this.gridapi.getSelectedNodes()[0];
        if(action=='back')
            node['data'].IsActive=node['data'].IsActive==true?"Yes":"No";
        if (node) {
            node.setSelected(false);
        }
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];

        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }
    resetControl() {
        this.CurrentGroupingObj.CatId=0;
        this.CurrentGroupingObj.SubCatId=0;
        this.CurrentGroupingObj.GradeId=0;
        this.CurrentGroupingObj.tempid=0;
        this.CurrentGroupingObj.GroupId=0;
    }
    
      checkDuplicate(){
        var returnmsg:Boolean=false;
        if(this.CurrentGroupingObj.GroupId==0){
            for(var i=0;i<this.SelectedObj.length;i++){
                if(this.SelectedObj[i].CatId==this.CurrentGroupingObj.CatId && this.SelectedObj[i].SubCatId==this.CurrentGroupingObj.SubCatId && this.SelectedObj[i].GradeId==this.CurrentGroupingObj.GradeId){
                    returnmsg=true;
                    break;
                }
            }
        }
        return returnmsg;
      }
      pushSelectedObj(){
        if(this.CurrentGroupingObj.tempid>0){
            for(var i=0;i<this.SelectedObj.length;i++){
                if(this.SelectedObj[i].tempid==this.CurrentGroupingObj.tempid && this.SelectedObj[i].GroupId==this.CurrentGroupingObj.GroupId)
                    this.SelectedObj.splice(i,1);
            }
        }
        else{
            this.CurrentGroupingObj.tempid = this.SelectedObj.length+1;
        }
        var tempgroup:ProductGroupingModel=new ProductGroupingModel();;
        var tcat=this.CategoryArray.find(x=>x.CatId==this.CurrentGroupingObj.CatId);
        var tscat=this.SubCategoryArray.find(x=>x.SubCatId==this.CurrentGroupingObj.SubCatId);
        var tgrd=this.GradeArray.find(x=>x.GradeId==this.CurrentGroupingObj.GradeId);
        tempgroup.GroupId=this.CurrentGroupingObj.GroupId;
        tempgroup.CatId=this.CurrentGroupingObj.CatId;
        tempgroup.CatCd=tcat["CatCd"];
        tempgroup.CatDesc=tcat["CatDesc"];
        tempgroup.SubCatId=this.CurrentGroupingObj.SubCatId;
        tempgroup.SubCatCd=tscat['SubCatCd'];
        tempgroup.SubCatDesc=tscat['SubCatDesc'];
        tempgroup.GradeId=this.CurrentGroupingObj.GradeId;
        tempgroup.GradeCd=tgrd['GradeCd'];
        tempgroup.GradeDesc=tgrd['GradeDesc'];
        tempgroup.IsActive=this.CurrentGroupingObj.IsActive;
        tempgroup.tempid=this.CurrentGroupingObj.tempid;
        this.SelectedObj.push(tempgroup);
        // this.CurrentGroupingObj.CatCd=tcat["CatCd"];
        // this.CurrentGroupingObj.CatDesc=tcat["CatDesc"];
        // this.CurrentGroupingObj.SubCatCd=tscat['SubCatCd'];
        // this.CurrentGroupingObj.SubCatDesc=tscat['SubCatDesc'];
        // this.CurrentGroupingObj.GradeCd=tgrd['GradeCd'];
        // this.CurrentGroupingObj.GradeDesc=tgrd['GradeDesc'];
        //this.SelectedObj.push(new ProductGroupingModel(this.CurrentGroupingObj))
        this.SelectedObj.sort(function(obj1, obj2) {
            return obj1.tempid - obj2.tempid;
        });
      }
      editRecord(source){
        var trec=this.SelectedObj.find(x=>x.tempid==source.tempid && x.GroupId==source.GroupId);
        this.CurrentGroupingObj.CatId=trec.CatId;
        this.CurrentGroupingObj.SubCatId=trec.SubCatId;
        this.CurrentGroupingObj.GradeId=trec.GradeId;
        this.CurrentGroupingObj.tempid=trec.tempid;
        this.CurrentGroupingObj.GroupId=trec.GroupId;
        this.CurrentGroupingObj.IsActive=trec.IsActive;//=='Yes'?true:false;
      }
      openModalDialog(source){
          this.deleteTracker=source;
        // this.RecToDeleteId=checklistid;
        // this.RecToDeleteTempId=tempid;
        this.display='block'; //Set block css
     }
     closeModalDialog(){
         this.deleteTracker=new ProductGroupingModel();
        // this.RecToDeleteId=0;
        // this.RecToDeleteTempId=0;
        this.display='none'; //set none css after close dialog
       }

    deleteRecord(){
        for (var i in this.SelectedObj) {
            if(this.SelectedObj[i].GroupId==this.deleteTracker.GroupId && this.SelectedObj[i].tempid==this.deleteTracker.tempid)
            this.SelectedObj.splice(parseInt(i), 1);
        }
        if(this.deleteTracker.GroupId>0)
            this.deleteChecklist();
    }

    deleteChecklist(){
        this.loaderService.display(true);
        this.groupingService.remove(this.deleteTracker.GroupId)
        .subscribe(returnValue=>{
            this.loaderService.display(false);
            var result=returnValue.data;
            if(result=='Deleted'){
                // this.gridapi.setDatasource(this.dataSource);
                // this.isEditConfigSetup$ = false;
                // this.Cancel();
                this._util.success('Data successfully deleted.','Deleted' );
            }
            else{
            this._util.error('Could not be saved. Something went wrong.','Alert' );
            }
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
    }
    funNo(){
        this.closeModalDialog()
        }

    funYes(){
        //this.deleteRecord(this.RecToDeleteId,this.RecToDeleteTempId)
        this.deleteRecord();
        this.closeModalDialog();
    }
}