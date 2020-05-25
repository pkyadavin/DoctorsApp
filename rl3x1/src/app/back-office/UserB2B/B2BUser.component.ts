import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { B2BUserService } from './B2BUser.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community'
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { ProductGradeModel,AccountBillto,StoreShipTo,B2BUserModel ,CountryStateCity} from './B2BUser.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { EditComponent } from 'src/app/shared/edit.component';
import * as XLSX from 'xlsx';
import {ExcelService} from './excel.service';
import { LoaderService } from '../../loader/loader.service';
declare var $: any;
@Component({
    selector: 'B2BUserGrid',
    providers: [B2BUserService],
    templateUrl: './B2BUser.html'
})

export class B2BUser extends Property {
    jsonlist: any;
    regXMLData: any;
    IsGridLoaded: boolean = false;
    uploadLoader: boolean = false;
    @ViewChild('closebutton') closebutton;
    @Input() GridType: string;
  //  @Input('PartnerId') PartnerId: number;
    @Output() notifyB2BUserCode: EventEmitter<any> = new EventEmitter<any>();
    B2BUserlist: any
    filterText: string;
    loading: boolean;
    dataSource: any;
    gridOptions: GridOptions;
    errorMessage: string;
    //countries: ProductGradeModel[];
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
    _AccountBillto:AccountBillto;
    _StoreShipTo:StoreShipTo;
    _B2BUserModel:B2BUserModel;
    _B2BUserModelArray:any=[];
    _BillToCountry:CountryStateCity[];
    _SelectedBillToCountry:CountryStateCity[];
    _BillToState:CountryStateCity[];
    _SelectedBillToState:CountryStateCity[];
    _BilltoCity:CountryStateCity[];
    _SelectedBilltoCity:CountryStateCity[];
    _ShipToCountry:CountryStateCity[];
    _SelectedShipToCountry:CountryStateCity[];
    _ShipToState:CountryStateCity[];
    _SelectedShipToState:CountryStateCity[];
    _ShiptoCity:CountryStateCity[];
    _SelectedShiptoCity:CountryStateCity[];
    _ServiceType:CountryStateCity[];
    _SelectedServiceType:CountryStateCity[];
    DdlSettings = {};
    columnDefs = [
        { headerName: 'Region', width: 120 },
        { headerName: 'Category Code', field: "BillingCode", width: 200 },
        { headerName: 'Description', field: "BillingCodeName", width: 200 },
        { headerName: 'ISActive', field: "Description", width: 200 }

    ];
    CurrentB2BUserObj: B2BUserModel = new B2BUserModel();
    constructor(
        private _util: Util,private _menu: SidebarService, private _router: Router,private excelService:ExcelService,
        private B2BUserService: B2BUserService, public commonService: CommonService, private _globalService: GlobalVariableService, 
        private activateRoute: ActivatedRoute, private loaderService: LoaderService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID=partnerinfo[0].UserId;
       
        
        this._B2BUserModel=new B2BUserModel();
        this._B2BUserModel._AccountBillto._StoreShipTo=new StoreShipTo();
        this._AccountBillto= new AccountBillto();
        this._StoreShipTo=new StoreShipTo();
        this._BillToCountry=[];
        this._SelectedBillToCountry=[];
        this._BillToState=[];
        this._SelectedBillToState=[];
        this._BilltoCity=[];
        this._SelectedBilltoCity=[];
        this._ShipToCountry=[];
        this._SelectedShipToCountry=[];
        this._ShipToState=[];
        this._SelectedShipToState=[];
        this._ShiptoCity=[];
        this._SelectedShiptoCity=[];
        this._ServiceType=[];
        this._SelectedServiceType=[];
    }
    ngOnInit() {
        this.getCountryServiceType();
       // this.loadPermissionByModule(this.moduleTitle);
         this.GetRegions();
        this.filterText = null;
        this.B2BUserlist = [];
        this.gridOptions = {
            rowData: this.B2BUserlist,
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
                this.B2BUserService.loadAll(params.startRow, params.endRow, sortColID, sortDirection, this.filterText, this.partnerID).
                    subscribe(
                    result => {
                        this.loaderService.display(false);
                        var rowsThisPage = result.recordsets[0];
                        this.LocalAccess = JSON.parse(result.access_rights).map(function (e) { return e.FunctionType });
                        var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);
                        
                        this.h_localize = $.grep(localize, function (n, i) { return n.ShowinGrid === true; });
                        var localeditor = localize.map(function (e) {
                            return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                        });
                        this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");
                        var rowsThisPage = result.recordsets[0];
                        this.IsLoaded = true;
                        if (this.GridType == "popup") {
                            localize.unshift({
                                headerName: "Select",
                                width: 200,
                                template: '<a style="cursor:pointer;" data-action-type="select">Select</a>'
                            });
                            localize.unshift({
                                headerName: "MapId",
                                width: 200,
                                field: "MapId",
                                hide: true,
                            });
                        }
                        var coldef = this.h_localize.find(element => element.field == "AccountNo");
                        if (coldef != null && this.hasPermission("View")) {
                            coldef.cellRendererFramework = EditComponent;
                        }
                        var coldef = this.h_localize.find(element => element.field == "IsActive");
                        if (coldef != null) {
                            coldef.cellRendererFramework = ImageColumnComponent;
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
        this.DdlSettings = {
            "singleSelection": true,
            "idField": 'id',
            "textField": 'name',
            //selectAllText: 'Select All',
            //unSelectAllText: 'UnSelect All',
            "itemsShowLimit": 2,
            "allowSearchFilter": true,
            "closeDropDownOnSelection":true,
            "enableCheckAll":false
          };
    }
    
    
    EditClicked(val) { //1
        this.CurrentB2BUserObj = val;
        this.editRecord(val,'update')
        this.onEditCategory();
    }
    onRowClicked(e) {  // 2
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "select") {
                this.notifyB2BUserCode.emit(data);
                console.log(data);
            }
            else if (actionType == "edit") {
                this.CurrentB2BUserObj = data;
                this.onEditCategory();

            }
        }
    }
    onEditCategory() {  //1st
        this.ListView = false;
        if(this.CurrentB2BUserObj.IsActive!=undefined){
            if (this.CurrentB2BUserObj.IsActive.toString() == 'Yes') {
                this.CurrentB2BUserObj.IsActive = true;
            }
            else {
                this.CurrentB2BUserObj.IsActive = false;
            }
        }
    }
    onSelectionChanged() {  //3
        this.isEditConfigSetup$ = true;
        this.isDeleteConfigSetup$ = true;
        this.CurrentB2BUserObj = this.gridapi.getSelectedRows()[0];
        if (!this.CurrentB2BUserObj) {
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

    GetRegions() {
        this.B2BUserService.getRegions().
            subscribe(
           region => {

                this.RegionList =region;
               // alert(JSON.stringify(this.RegionList));
            },
            Error => this.errorMessage = <any>Error
            );
    }
    onAddCategory() {
        this.ListView = false;
        this.IsLoaded = true;
        this.CurrentB2BUserObj = new B2BUserModel();
        if (this.CurrentB2BUserObj.IsActive == undefined) {
        
            this.CurrentB2BUserObj.IsActive = true;
          
        }
    }


    Save(eventtype) {
        
        this._B2BUserModelArray.length=0; 
        if(eventtype=='save'){
            for(var i=2;i<this.regXMLData.length;i++){
                this.editRecord(this.regXMLData[i],eventtype=='save'?'save':'update')
                this._B2BUserModelArray.push(this._B2BUserModel)
            }
        }
        else{
            this._B2BUserModelArray.push(this._B2BUserModel)
        }
        this.loaderService.display(true);
        this.B2BUserService.Save(this._B2BUserModelArray)
            .subscribe(returnvalue => {
                this.loaderService.display(false);
                var result = returnvalue.data;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this._B2BUserModelArray.length=0
                    this.jsonlist=null;
                    this.regXMLData=null;
                    this.Cancel();
                    this.closebutton.nativeElement.click();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this._B2BUserModelArray.length=0
                    this.jsonlist=null;
                    this.regXMLData=null;
                    this.Cancel();
                    this.closebutton.nativeElement.click();
                    return;
                }
                else {
                    this._util.error(result,'Alert');
                    return;
                }
            },
            error => {
                this.loaderService.display(false);
                this.errorMessage = <any>error;
            });
            //error => this.errorMessage = <any>error);
    }
    Update() {
        this._B2BUserModelArray.length=0; 
        if(this._B2BUserModel._AccountBillto.Email!=''){
            if(!this.validateEmail(this._B2BUserModel._AccountBillto.Email)){
                this._util.error("Please enter valid email.","Warning");
                return;
            }
        }
        this._B2BUserModelArray.push(this._B2BUserModel)
        
        this.loaderService.display(true);
        this.B2BUserService.Update(this._B2BUserModelArray)
            .subscribe(returnvalue => {
                this.loaderService.display(false);
                var result = returnvalue.data;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this._B2BUserModelArray.length=0
                    this.jsonlist=null;
                    this.Cancel();
                    this.closebutton.nativeElement.click();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.gridapi.setDatasource(this.dataSource);
                    this.isEditConfigSetup$ = false;
                    this._B2BUserModelArray.length=0
                    this.jsonlist=null;
                    this.Cancel();
                    this.closebutton.nativeElement.click();
                    return;
                }
                else {
                    this._util.error(result,'Alert');
                    return;
                }
            },
            error => {
                this.loaderService.display(false);
                this.errorMessage = <any>error;
            });
            //error => this.errorMessage = <any>error);
    }

    Cancel() {
        this.ListView = true;
        this.isAddConfigSetup$ = true;
        this.isDeleteConfigSetup$ = false;
        this.isCancel$ = false;
        var node = this.gridapi.getSelectedNodes()[0];
        //node['data'].IsActive=node['data'].IsActive==true?"Yes":"No";
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
    fileChange(e: any) {
        let files = e.target.files,file;
        this.uploadLoader=true;
        //=========read excel sheet==================
        if (!files || files.length == 0) return;
        file = files[0];
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);  
        var me = this;
        fileReader.onload = function (e) {
             var binary = "";
            var result = event.target["result"];
            var bytes = new Uint8Array(result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            var workbook = XLSX.read(binary, { type: 'binary',cellText:true,cellStyles:false,cellDates:true, });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            me.ReadExcel(worksheet, "A4:S8");
            console.log(JSON.stringify(me.regXMLData)); 
            
        };
        this.uploadLoader=false;
        e.currentTarget["value"]=null
      }

      ReadExcel(worksheet, Range) {
        var jsonstring = '';
        if (Range == "") {
          this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          jsonstring = JSON.stringify({ 'root': this.jsonlist });
        }
        else {
          this.jsonlist = XLSX.utils.sheet_to_json(worksheet, { range: 0 });
          jsonstring = this.jsonlist;
        }
    
        this.regXMLData = jsonstring;
      }

      editRecord(record,eventtype){
        var Billto= new AccountBillto();
        var ShipTo=new StoreShipTo();
        // this._B2BUserModel=new B2BUserModel();
        Billto.AccountNo=record.AccountNo;
        Billto.AccountName=record.AccountName;
        Billto.ServiceType=record.BillToServiceTypeId;//BillToServiceType;
        Billto.Address1=record.AccountAddress1;
        Billto.Address2=record.AccountAddress2;
        Billto.City=record.AccountCity;
        Billto.State=record.AccountStateId;//AccountState;
        Billto.Country=record.AccountCountryId;//AccountCountry;
        Billto.PostalCode=record.AccountPostalCode;
        Billto.RegionalOffice=record.AccountRegionalOffice;
        Billto.FirstName=record.FirstName;
        Billto.LastName=record.LastName;
        Billto.Phone=record.Phone;
        Billto.Email=record.Email;

        ShipTo.ShipToNo=record.ShipTo;
        ShipTo.ShipToName=record.ShipToName;
        ShipTo.RegionalOffice=record.ShipToRegionalSalesOffice;
        ShipTo.Address1=record.ShipToAddress1;
        ShipTo.Address2=record.ShipToAddress2;
        ShipTo.City=record.ShipToCity;
        ShipTo.State=record.ShipToStateId;//ShipToState
        ShipTo.Country=record.ShipCountryId;//ShipToCountry;
        ShipTo.PostalCode=record.ShipToPostalCode;

        Billto._StoreShipTo=ShipTo

        this._B2BUserModel=new B2BUserModel(Billto)
        this._B2BUserModel.MapId=eventtype=='save'?0:record.MapId[0];
        //--------set state,city,country and servicetype-------------
        this._SelectedBillToCountry=this._BillToCountry.filter(x=>x.id==Billto.Country);
        this._SelectedShipToCountry=this._ShipToCountry.filter(x=>x.id==ShipTo.Country);
        this._SelectedServiceType=this._ServiceType.filter(x=>x.id==Billto.ServiceType);

        this.getSelectedRegionData(Billto.Country,ShipTo.Country,Billto.State,ShipTo.State,Billto.City,ShipTo.City);
      }
      async getSelectedRegionData(billcountry,shipcountry,billstate,shipstate,billCity,shipCity) {
        this._BillToState.length=0;
        this._ShipToState.length=0;
        this._BilltoCity.length=0;
        this._ShiptoCity.length=0;
        this.loaderService.display(true);
        this.B2BUserService.getSelectedCountryStateCity(billcountry,shipcountry,billstate,shipstate)
            .subscribe(result=>{
                this.loaderService.display(false);
                this._BillToState=result.data[0];
                this._SelectedBillToState=this._BillToState.filter(x=>x.id==billstate);
                this._ShipToState=result.data[1];
                this._SelectedShipToState=this._ShipToState.filter(x=>x.id==shipstate);
                this._BilltoCity=result.data[2];
                this._SelectedBilltoCity=this._BilltoCity.filter(x=>x.id==billCity);
                this._ShiptoCity=result.data[3];
                this._SelectedShiptoCity=this._ShiptoCity.filter(x=>x.id==shipCity);
            },
            error=>{
                this.loaderService.display(false);
            });
      }
      clearData(){
        this._B2BUserModelArray.length=0
        this.jsonlist=null;
        this.regXMLData=null;
      }
      getCountryServiceType(){
        this.loaderService.display(true);
        this.B2BUserService.getCountryServiceType().
        subscribe(
        result => {
            this.loaderService.display(false);
            this._BillToCountry=result.data[0];
            this._ShipToCountry=result.data[0];
            this._ServiceType=result.data[1];
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
    }
    getState(countryid:number,type){
        this.loaderService.display(true);
        this.B2BUserService.getStateByID(countryid).
        subscribe(
        result => {
            this.loaderService.display(false);
            if(type=='BillToState')
                this._BillToState=result;
            else
                this._ShipToState=result;
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
    }
    getCity(countryid:number,stateid:number,type){
        this.loaderService.display(true);
        this.B2BUserService.getCityByID(countryid,stateid).
        subscribe(
        result => {
            this.loaderService.display(false);
            if(type=='BillToCity')
                this._BilltoCity=result;
            else
                this._ShiptoCity=result;
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
    }
    onItemSelectCountry(e,type){
        if(type=='BillToState')
            this._B2BUserModel._AccountBillto.Country=e.id;
        else
            this._B2BUserModel._AccountBillto._StoreShipTo.Country=e.id;
        this.getState(e.id,type);
    }
    onItemSelectState(e,type){
        if(type=='BillToCity')
            this._B2BUserModel._AccountBillto.State=e.id;
        else
            this._B2BUserModel._AccountBillto._StoreShipTo.State=e.id;

        var countryid=type=='BillToCity'?this._SelectedBillToCountry[0].id:this._SelectedShipToCountry[0].id;
        this.getCity(countryid,e.id,type);
    }
    onItemSelectCity(e,type){
        if(type=='BillTo')
            this._B2BUserModel._AccountBillto.City=e.id;
        else
            this._B2BUserModel._AccountBillto._StoreShipTo.City=e.id;
    }
    onItemSelectServicetype(e){
        this._B2BUserModel._AccountBillto.ServiceType=e.id;
    }
    getServiceType(){
        this.loaderService.display(true);
        this.B2BUserService.getServiceType().
        subscribe(result => {
            this.loaderService.display(false);
            for(let i=0;i<result.length;i++){
                this._ServiceType.push(new CountryStateCity(result[i]));//=result;
            }
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    onSelectAll(e){
        console.log(e);
    }
}