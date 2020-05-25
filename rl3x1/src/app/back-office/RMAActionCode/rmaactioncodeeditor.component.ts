import { Component, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { RMAActionCodeService } from './RMAActionCode.Service.js';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { RMAActionCode } from './RMAActionCode.model';
import { TypeLookup } from '../../shared/common.model';
import { Tabs } from '../../controls/tabs/tabs.component';
import { Tab } from '../../controls/tabs/tab.component';
import { Property, Util } from '../../app.util'; 
import { BsModalComponent } from 'ng2-bs3-modal'
import { CommonService } from '../../shared/common.service';
import { Observable } from 'rxjs';
//for popup
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { AuthService } from '../../authentication/auth.service'
import { SidebarService } from '../sidebar/sidebar.service.js';

declare var $: any;

@Component({
    selector: 'RMAActionCodeEditor',
    //styles: ['>>> .modal-xl { width: 400px; }'],
    providers: [RMAActionCodeService, CommonService, AuthService],
    templateUrl: './rmaactioncodeeditor.html'
})

export class RMAActionCodeEditor extends Property {
    //for sku
    @ViewChild("skuItemSelector")
    skuItemSelectorModel: BsModalComponent;
    selectedId: number;
    //till here
    modal: BsModalComponent;
    rmaactioncodes: Observable<RMAActionCode[]>;
    @Input("selectedId") rmaactioncodeId: number;

    @Input("permission") permission: boolean;
    rmaactioncodelist: RMAActionCode[];
    typelookupList: TypeLookup[];    
    CurrentRMAActionCode: RMAActionCode = new RMAActionCode();
    @Output() EditorVisibilityChange = new EventEmitter();
    localize: any;
   // rmaactioncodeId: number;
    dataSource: any;   
    gridOptions: GridOptions;
    errorMessage: string;
    currentTab: string;
    selectedTypeLookUpId: number;
    selectedRoles: any;
    isCancel = false;
    IsLoaded: boolean;       
    AllRMAList: any;   
    RMAList: any;    
    itemRMAList: any;
    selectedRMA: any;
    availableRMA: any;
    isSaveClick: boolean = false;
    rmagridOptions: GridOptions;
    rmagridcolumnDefs =
    [
        { headerName: 'RMA Name', field: "RMAActionName", width: 150 },
        { headerName: 'RMA Action Code', field: "RMAActionCode", width: 150 }    

    ];

    allrmagridOptions: GridOptions;
    allrmagridcolumnDefs =
    [
        { headerName: 'RMA Name', field: "RMAActionName", width: 150 },
        { headerName: 'RMA Action Code', field: "RMAActionCode", width: 150 }       

    ];


    //for sku 
    //----ItemMasterSKU
    AllSKUList: any;
    SKUList: any;
    itemSKUList: any;
    selectitemSKUList: any;
    selectedSKU: any;
    availableSKU: any;
    skugridOptions: GridOptions;
    skugridcolumnDefs =
    [
        { headerName: 'Item Name', field: "ItemName", width: 150 },
        { headerName: 'Description', field: "ItemDescription", width: 150 },
        { headerName: 'SKU Code', field: "SKUCode", width: 150 },
        { headerName: 'EAN Code', field: "EANCode", width: 150 },      
        { headerName: 'Item Price', field: "ItemPrice", width: 150 },
        //{ headerName: 'Quantity', field: "Quantity", width: 150 },        
    ];

    allskugridOptions: GridOptions;
    allskugridcolumnDefs =
    [
        { headerName: 'SKU Name', field: "SKUName", width: 150 },
        { headerName: 'Description', field: "SKUDescription", width: 150 },
        { headerName: 'Price', field: "Price", width: 150 },

    ];
    //till here
   
    constructor(private _util:Util, private _menu:SidebarService,
        private rmaactioncodeService: RMAActionCodeService, private _router: Router, private activateRoute: ActivatedRoute, private commonService: CommonService, private _globalService: GlobalVariableService,private _LoginService: AuthService) {
        super()    
        this.selectedTypeLookUpId = 0; 
        this.errorMessage = "";
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        //this.rmaactioncodeInit();        
    }
    //for pop up
    @ViewChild('pop') _popup: message;
    @ViewChild('pop1') _popup1: modal;
    //till here
    ngOnInit() {
        this.rmaactioncodeInit();        
    }
    rmaactioncodeInit() {
        debugger;
        this.itemRMAList = [];
        this.AllRMAList = [];
        this.IsLoaded = false;          
        this.commonService.getTypeLookUpByName('RMAActionCommand').subscribe(result => {
            this.typelookupList = result;
        
        }, error => this.errorMessage = <any>error); 
            this.rmaactioncodeService.load(this.rmaactioncodeId).subscribe(u => {
                debugger;                
                if (this.rmaactioncodeId != 0) { 
                       
                    this.CurrentRMAActionCode.RMAActionCodeID = u.recordsets[0][0].RMAActionCodeID;              
                    this.CurrentRMAActionCode.RMAActionCode = u.recordsets[0][0].RMAActionCode;
                    this.CurrentRMAActionCode.RMAActionName = u.recordsets[0][0].RMAActionName;  
                    this.CurrentRMAActionCode.RMAActionTypeID = u.recordsets[0][0].RMAActionTypeID;            
                    this.CurrentRMAActionCode.isActive = u.recordsets[0][0].isActive;
                    this.getmydd(this.CurrentRMAActionCode.RMAActionCodeID);      
                    this.getmyRMAItemdd(this.CurrentRMAActionCode.RMAActionCodeID);                
                              
                   
                }
                else {      
                    this.CurrentRMAActionCode.RMAActionCodeID = 0;                     
                    this.CurrentRMAActionCode.RMAActionCode = "";
                    this.CurrentRMAActionCode.RMAActionName = "";
                    this.CurrentRMAActionCode.isActive = true;                         
                
                                    
                }
                var localize = JSON.parse(u.recordsets[1][0].ColumnDefinitions);
                var node_editor = localize.map(function (e) {
                    return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
                });
                this.e_localize = JSON.parse("{" + node_editor.join(',') + "}");
                 this.IsLoaded = true;
               
            }, error=> this._util.error(error, 'error'));

        

        this.rmaactioncodeService.loadItemSKU(this.rmaactioncodeId).subscribe(modelmaster => {
            debugger;
            this.itemSKUList = modelmaster;
            this.skugridOptions.api.setRowData(this.itemSKUList);       

        }); 
       
       
        this.allrmagridOptions = {
            rowData: this.RMAList,
            columnDefs: this.allrmagridcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'single'
        };
        this.rmagridOptions = {
            rowData: this.itemRMAList, 
            columnDefs: this.rmagridcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'single'
        };
       

        this.skugridOptions = {
            rowData: this.itemSKUList,           
            columnDefs: this.skugridcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'single'
        };
      
        
    }
    getDataInAllRMA(Data,rid) {    
        debugger;
        if (rid == undefined) {
            rid = 0;
        }
        this.rmaactioncodeService.getavailableTab(Data, rid).subscribe(result => {          
            this.RMAList = result;
          
            this.allrmagridOptions.api.setRowData(this.RMAList);                  
        }, error => this.errorMessage = <any>error);  
    }

    getDataInRMA(Data) {
      
        debugger;
        this.rmaactioncodeService.getRMATab(Data).subscribe(result => {
            this.itemRMAList = result;      
            alert(JSON.stringify(this.itemRMAList));    
            this.rmagridOptions.api.setRowData(this.itemRMAList);       
        }, error => this.errorMessage = <any>error);
    }  

    onSubmit(form: any) {
        debugger      
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
        this.CurrentRMAActionCode.CreatedBy = "44";
        if (this.CurrentRMAActionCode.RMAActionCodeID == undefined) {
            this.CurrentRMAActionCode.RMAActionCodeID = 0;
            return;        
        }  
     
        if (this.itemRMAList.length > 0)
            this.CurrentRMAActionCode.AllItemMasterList = this.itemRMAList;
       
            this.rmaactioncodeService.Save(this.CurrentRMAActionCode, this._LoginService.loginUserID).subscribe(returnvalue => {
                debugger;
                var res= returnvalue.data;
                if (res == "Duplicate string") {
                    this._popup.Alert('Alert', 'Record already exist.');
                    return;
                }
                else {
                    var me = this;
                    this._popup.Alert('Alert', 'Saved successfully.', function () { me.EditorVisibilityChange.emit(true); });                    
                }
            }, error => this._util.error(error, 'error'));
       
    }

    getmydd(id: number){   
        this.rmaactioncodeService.loadByRMATypeID(id).subscribe(result => {
          var res=0;
            res = result[0];
            this.CurrentRMAActionCode.RMAActionMapTypeID = res[Object.keys(res)[0]];           
            this.getDataInAllRMA(this.CurrentRMAActionCode.RMAActionMapTypeID, this.CurrentRMAActionCode.RMAActionCodeID);           
        }, error => this.errorMessage = <any>error);    
    }

    getmyRMAItemdd(id: number) {
        debugger;
        this.rmaactioncodeService.loadByRMAItemRMATypeID(id).subscribe(result => {  
            var item = result
            this.itemRMAList = item;
            this.rmagridOptions.api.setRowData(this.itemRMAList);          
        }, error => this.errorMessage = <any>error);
    }


    CancelRMAActionCode() {    
        this.EditorVisibilityChange.emit(false);  
        //this._router.navigate(['rmaactioncodegrid']);
    }
    close() {
        this.modal.close();
    }
    onClickTab(tab) {
        this.currentTab = tab.url;
    }
    isActiveTab(taburl) {
        return taburl == this.currentTab;
    }  
    onSelectedRMAChanged() {
        debugger;
        this.selectedRMA = this.rmagridOptions.api.getSelectedRows()[0];       
    }
    onSelectedallRMAChanged() {
        debugger;
        this.availableRMA = this.allrmagridOptions.api.getSelectedRows();       
    }
    moveRMA() {  
        debugger; 
        var item = this.availableRMA[0]
        var ind = this.RMAList.map(function (e) { return e.RMAActionName; }).indexOf(item.RMAActionName);
        if (ind != -1) {
            this.RMAList.splice(ind, 1);
            this.itemRMAList.push(JSON.parse(JSON.stringify(item)));
        }
        this.rmagridOptions.api.setRowData(this.itemRMAList);
        this.allrmagridOptions.api.setRowData(this.RMAList);
    }
    moveRMABack() { 
        this.RMAList.push(this.selectedRMA);
        var index = this.itemRMAList.filter(x => x.RMAActionCodeID == this.selectedRMA.RMAActionCodeID);
        this.itemRMAList.splice(index, 1);
        this.rmagridOptions.api.setRowData(this.itemRMAList);       
        this.allrmagridOptions.api.setRowData(this.RMAList);
    }
    moveAllRMA() {             
        var fromCollection = $.grep(this.RMAList, function (value) {
            return value;
        });
        for (let item of fromCollection) {
            var ind = this.RMAList.map(function (e) { return e.RMAActionName; }).indexOf(item.RMAActionName);
            if (ind != -1) {
                this.RMAList.splice(ind, 1);
                this.itemRMAList.push(JSON.parse(JSON.stringify(item)));
            }
        }
        this.rmagridOptions.api.setRowData(this.itemRMAList);
        this.allrmagridOptions.api.setRowData(this.RMAList);
    }
    moveAllRMABack() {
        this.RMAList = [];
        for (let item of this.itemRMAList) {

            this.RMAList.push(item);
        }
        this.itemRMAList = [];
        this.rmagridOptions.api.setRowData(this.itemRMAList);
        this.allrmagridOptions.api.setRowData(this.RMAList);
    }
    Reset() {        
        this.AllRMAList = [];
        this.RMAList = [];
        this.itemRMAList = [];
        this.selectedRMA = null;
        this.availableRMA = null;
    }  

    //for sku
    SelectItem() {
        debugger;
        this.skuItemSelectorModel.open();
    }

    itemListChange($event) {
        debugger;
        this.itemSKUList = $event;
        this.skugridOptions.api.setRowData(this.itemSKUList);
        //send here data for saving 
        this.CurrentRMAActionCode.SelectedItemSKUList = this.itemSKUList;

    }

    //till here

}