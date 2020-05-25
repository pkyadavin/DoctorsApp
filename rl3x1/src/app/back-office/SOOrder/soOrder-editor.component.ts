import { Component, EventEmitter, ViewChild, Input,Output } from '@angular/core';
import { SOService } from './soOrder.service';
import { SOOrder } from './soOrder.model';
import { Observable } from 'rxjs/Observable';
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Tabs } from '../../controls/tabs/tabs.component.js';
import { AddressService } from '../../shared/address.service';
import { Tab } from '../../controls/tabs/tab.component.js';
import { SOProperties } from './soOrder.properties.js';
import { message, modal } from '../../controls/pop/index.js';
import { BsModalComponent } from 'ng2-bs3-modal';
import { AddressInput } from '../../shared/address.model';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { CommonService } from '../../shared/common.service'
import { Util } from 'src/app/app.util';
import { SidebarService } from '../sidebar/sidebar.service';
declare var $: any;

@Component({
    selector: 'SOOrder-editor',
    //styles: ['>>> .modal-xxl { width: 1100px; }'],
    providers: [SOService],
    templateUrl: 'soOrderEditor.html'
})

export class SOOrderEditor {
    @ViewChild("itemSelector")
    itemSelectorModel: BsModalComponent;
    @ViewChild('modalPartner') _partner: modal;
    @ViewChild('modalCustomer') _Customer: modal;
    @ViewChild('addressPopUp') _address: BsModalComponent;
    @Input() selectedId: number;
    @Input() permission: boolean;
    @Output() EditorVisibilityChange = new EventEmitter();
    popuptype = "popup";
    partnerType = "PTR004";
    partnerInfo: any;
    CurrentSOeditor: SOOrder = new SOOrder();
    soEditor: any
    toPartnersList: any;
    Result: string = '';
    ItemsGridOptions: GridOptions;
    addressGridPopup: boolean = false;
    dataSource: any;
    errorMessage: string;
    IsLoaded: boolean;
    isEditVisible: boolean;
    ItemOrderLineList: any;
    orderlineList: any
    Paramdata: string;
    orderlineGridList: any=[];
    toPartnerId: number;
    PartnerId: number;
    LocalAccess:any= [];
    SOOrderHeaderName: string;
    moduleTitle: string;
    isSaveClick: boolean = false;
    RefTypeLIst: any;
    addressInput: AddressInput;
    OrderLogs: any = [];
    skugridcolumnDefs =
    [
        { headerName: 'Item Name', field: "ItemName", width: 150 },        
        { headerName: 'Description', field: "ItemDescription", width: 150 },
        { headerName: 'Item Price', field: "ItemPrice", width: 150 },
        { headerName: 'Quantity', field: "Quantity", width: 150 },
        { headerName: 'Price', field: "ItemPrice", width: 150},

    ];
    columnDefs = [
        { headerName: 'Item #', field: "ItemNumber", cellRenderer: 'group' },       
        { headerName: 'DispatchHeaderID', field: "DispatchHeaderID", width: 150, hide: true },
        { headerName: 'Dispatch Number', field: "DispatchNumber", width: 200 },
        { headerName: 'Start Date', field: "StartDate", width: 150 },
        { headerName: 'Task', field: "Task", width: 100 },
        { headerName: 'Item Name', field: "ItemName" },  
        { headerName: 'Serial #/Quantity', field: "SerialNumberQuantity" },     
        //{ headerName: 'Serial #', field: "SerialNumber" },
        //{ headerName: 'Quantity', field: "Quantity", width: 80 },
        { headerName: 'Created By', field: "CreatedBy", width: 100 },
        { headerName: 'Aging Days', field: "AgingDays", width: 100 }
    ]
    //gridOptionsOrderLog: GridOptions;

    cellEditRender(val) {
        //if (val != null) {
        //    return '<a style="cursor:pointer;" data-action-type="View">' + val.value + '</a>';
        //}
        return val.value;
    }

    constructor(private _util:Util,
        private stoService: SOService, private _menu:SidebarService,  private commonService: CommonService, private _router: Router, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService)
        //private addressService: AddressService)
    {

    }
    @ViewChild('pop') _popup: message;
    @ViewChild('pop2') _popup2: modal;

    getNodeChildDetails(rowItem) {
        if (rowItem.group) {
            return {
                group: true,
                // open C be default
                expanded: rowItem.group === 'Group C',
                // provide ag-Grid with the children of this group
                children: rowItem.participants,
                // this is not used, however it is available to the cellRenderers,
                // if you provide a custom cellRenderer, you might use it. it's more
                // relavent if you are doing multi levels of groupings, not just one
                // as in this example.
                field: 'group',
                // the key is used by the default group cellRenderer
                key: rowItem.group,
            };
        } else {
            return null;
        }
    }

    ngOnInit() {       
        this.partnerInfo = this._globalService.getItem('partnerinfo');
        this.skugridcolumnDefs =
            [
                { headerName: 'Item Name', field: "ItemName", width: 200 },
                { headerName: 'Item Number', field: "ItemNumber", width: 200 },
                //{ headerName: 'Serial #', field: "SerialNumber", width: 150 }, 
                { headerName: 'Serial #/Quantity', field: "SerialNumberQuantity", width: 200 },               
                { headerName: 'Unit Price (' + this.partnerInfo[0].CurrencySymbol+')', field: "ItemPrice", width: 150 },
                //{ headerName: 'Quantity', field: "Quantity", width: 150 },
                { headerName: 'Total Amount(' + this.partnerInfo[0].CurrencySymbol + ')', field: "Price", width: 150 },

            ]
        this.PartnerId = this.partnerInfo[0].LogInUserPartnerID;
        //this.moduleTitle = this._globalService.getModuleTitle(this.activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        this.Paramdata = 'SOOrder';
        this.IsLoaded = false;
        //this.activateRoute.queryParams.subscribe(params => {
        //    this.selectedId = +params['ID'];

            this.stoService.loadSTOByID(this.selectedId).subscribe(sto => {
                if (this.selectedId != 0) {
                    this.CurrentSOeditor = sto[0][0];
                    this.OrderLogs = sto[2];
                    if (this.OrderLogs.length > 0) {
                        if (this.OrderLogs[0].recordset) {
                            this.OrderLogs = JSON.parse(this.OrderLogs[0].recordset);
                        } else {
                            this.OrderLogs = [];
                        }
                    }
                    //this.gridOptionsOrderLog.api.setRowData(this.OrderLogs);
                    this.SOOrderHeaderName = (this.permission) ? this.moduleTitle : this.moduleTitle;
                    if (this.CurrentSOeditor.SOPartners == null)
                        this.CurrentSOeditor.SOPartners = this.CurrentSOeditor.SOCustomers;

                    this.stoService.loadAddressById(this.CurrentSOeditor.SOTypeAddressID).subscribe(partners => {
                        //this.CurrentSOeditor.SOTypeAddress = partners[0].Address;
                    });
                }
                else {
                    this.CurrentSOeditor = new SOOrder();
                    this.CurrentSOeditor.SOHeaderID = 0;
                    //this.CurrentSOeditor.SONumber = 'Auto Generated Number';

                    this.SOOrderHeaderName = this.moduleTitle;
                }
                this.CurrentSOeditor.PartnerID = this.PartnerId;
                this.CurrentSOeditor.PartnerName = this.partnerInfo[0].LogInUserPartnerName;
                //added for dynamic Field--------
                var localize = JSON.parse(sto[1][0].ColumnDefinitions);
                if (this.selectedId != 0) {
                    var localeditor = localize.map(function (e) {
                        return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                    });
                }
                else {

                    var localeditor = localize.map(function (e) {
                        e.isEnabled = 1;
                        return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
                    });


                }
                this.soEditor = JSON.parse("{" + localeditor.join(',') + "}");
                this.IsLoaded = true;
                //-----------------------------------------------------------

            });  

            //Load Partners
            this.stoService.loadPartners().subscribe(partners => {
                this.toPartnersList = partners;

            });
            this.stoService.loadAllRefType().subscribe(partners => {
                this.RefTypeLIst = partners;

            });
        //}
        //);
        this.ItemsGridOptions = {
            rowData: this.orderlineList,
            columnDefs: this.skugridcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
            };


        this.stoService.loadOrderLinesByID(this.selectedId).subscribe(modelmaster => {
            this.ItemOrderLineList = modelmaster;
            this.ItemsGridOptions.api.setRowData(this.ItemOrderLineList);
            this.orderlineGridList = modelmaster;

        }); 
    }
    SelectItem() {
        this.itemSelectorModel.open();

    }
    onGridSelectionChanged() {
        this.isEditVisible = true;
       // this.CurrentSKU = this.SKUgridOptions.api.getSelectedRows()[0];

    }
    itemListChange($event) {
        this.orderlineGridList = $event;
        this.ItemsGridOptions.api.setRowData($event);
    }
    onRefChange(typeValue) {
        this.CurrentSOeditor.SOTypeID = typeValue;
        this.CurrentSOeditor.SOPartners = "";
        this.CurrentSOeditor.SOTypeAddress = "";
    }
    Cancel() {
        this.EditorVisibilityChange.emit(false);
        //this._router.navigate(['/app.SOHeader']);
    }

    //onToPartnerChange(typeValue) {
    //    this.CurrentSOeditor.VendorPartnerID = typeValue;
    //}
    //onFromPartnerChange(typeValue) {
    //    this.CurrentSOeditor.FromPartnerID = typeValue;
    //}
    selectPartner() {
        if (this.CurrentSOeditor.SOTypeID === undefined) {
            this._util.error('Please select any So Type first!',"Alert");
            return;
        }
        {
            if (this.CurrentSOeditor.SOTypeID == 554)
                this._partner.open();
            else
                this._Customer.open();

        }
    }
    PartnerEvent(e) {
       this.CurrentSOeditor.SOToID = e.PartnerID;
       this.CurrentSOeditor.SOPartners = e.PartnerName;

       //this.addressService.loadAll(0, 10, null, null, null, "PartnerAddressMap", "PartnerID", e.PartnerID).subscribe(
       //    result => {
       //        var rows = result.recordsets[0];

       //        if (rows.length == 1) {
       //            var add = result.recordsets[0][0];
       //            this.CurrentSOeditor.SOTypeAddress = add.Address1 + " " + add.Address2 + ", " + add.City + ", " + add.StateName + ", " + add.CountryName + ", " + add.ZipCode;
       //            this.CurrentSOeditor.SOTypeAddressID = add.AddressID;
       //        }
              
       //    },
       //    error => this.errorMessage = <any>error);

       this._partner.close();
    }
    CustomerEvent(e) {
        this.CurrentSOeditor.SOToID = e.CustomerID;
        if (e.MiddleName == null)
            e.MiddleName = "";
        if (e.FirstName == null)
            e.FirstName = "";
        if (e.LastName == null)
            e.LastName = "";
       this.CurrentSOeditor.SOPartners = e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName;

        this._Customer.close();
    }

    close() {
        this._address.close();
    }

    selectAddress() {
        if (this.CurrentSOeditor.SOTypeID == 554) {
            this.addressInput = {
                MaptableName: "PartnerAddressMap",
                MapTableColumn: "PartnerID",
                MapColumnValue: "0",
            }
        }
        else {
            this.addressInput = {
                MaptableName: "CustomerAddressMap",
                MapTableColumn: "CustomerID",
                MapColumnValue: "0",
            }

        }
        if (this.CurrentSOeditor.SOToID == undefined) {
            this._util.error('Please select any SOPartner first!',"Alert");
            return;
        }
        this.addressInput.MapColumnValue = this.CurrentSOeditor.SOToID.toString();
        if (this.addressInput.MapColumnValue == "0") {
            this._util.error('Please select any SOPartner first!',"Alert");
            return;
        }

        this.addressGridPopup = true;
        this._address.open();
    }

    onAddressSelect(event) {
        this._address.close();
        this.addressGridPopup = false;
        this.CurrentSOeditor.SOTypeAddress = event.Address1 + " " + event.Address2 + ", " + event.City + ", " + event.StateName + ", " + event.CountryName + ", " + event.ZipCode;
        this.CurrentSOeditor.SOTypeAddressID = event.AddressID;
    }

    onSubmit(form: any) {
        var me = this;
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
        if (this.orderlineGridList.length == 0) {
            this.isSaveClick = true;
            return;
        }
        this.CurrentSOeditor.orderlineGridList = this.orderlineGridList;
       // this.CurrentSOeditor.SOTypeAddress = "";
        if (this.CurrentSOeditor.SOHeaderID == 0) {
            // this.CurrentModel.AllItemMasterList = this.itemSKUList;
            
            this.stoService.create(this.CurrentSOeditor).subscribe(returnvalue => {
                if (JSON.parse(returnvalue._body).result == 'Success') {
                    this._popup.Alert('Alert', JSON.parse(returnvalue._body).SoNumber + ' SO Order Created successfully.', function () {
                        me.EditorVisibilityChange.emit(true);
                    });
                } else {
                    this._util.error('Some Error occured.Please Try again',"Alert");
                }
            }, error => this._util.error(error, 'error'));
        }
        else {
            //this.CurrentModel.AllItemMasterList = this.itemSKUList;
            this.stoService.update(this.CurrentSOeditor).subscribe(returnvalue => {
                //this._popup.Alert('Alert', ' SO Order updated successfully.', function () {
                //    me.EditorVisibilityChange.emit(true);
                //});
                if (JSON.parse(returnvalue._body).result == 'Success') {
                    me.EditorVisibilityChange.emit(true);
                    this._util.error(JSON.parse(returnvalue._body).SoNumber + ' SO Order updated successfully.', "Alert");
                } else {
                    this._util.error('Some error occured. Please Try again', "Alert");
                }
            }, error => this._util.error(error, 'error'));
        }

    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            if (actionType == "View") {
                // if (data == "Receiving") {
                this._globalService.TaskQue = e.data;

                this._router.navigateByUrl('/dummy', { skipLocationChange: true })
                setTimeout(() => this._router.navigate(['/dispatchorder'], { queryParams: { ID: 0, RefID: e.data.DispatchHeaderID, Type: "view" } }));
            }
        }
    }

    CheckAvailability(type) {
        this.stoService.CheckSOAvailability(this.CurrentSOeditor.SONumber, type).subscribe(records => {
            if (records != undefined && records.length >1) {
                this._util.error('This SO Number already exists',"Alert");
            }
        });
    }   

}