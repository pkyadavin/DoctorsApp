//import { Component } from '@angular/core';
import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModelMasterService } from './modelmaster.service';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ModelMaster } from './modelmaster.model';
import { Manufacturer } from './manufacturer.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { message, modal } from '../../controls/pop';
import { GridOptions } from 'ag-grid-community'
//import { ItemMaster } from '../../controls/ItemSelector/ItemSelector.Model';
import { BsModalComponent } from 'ng2-bs3-modal';
//import { GlobalVariableService } from '../../Shared/globalvariable.service';
import { ModelMasterImage } from './modelmaster.model'; 
 

//import { ModelProperties } from './model.properties';
//Open Mode popup
import { ModelGrid } from '../Category/category.component';
//-----------import { ModelEditor } from '../Category/category-editor.component';
import { SidebarService } from '../sidebar/sidebar.service';
import { Util } from 'src/app/app.util';

// //Open Manufacturere popup
//import { ManufacturerComponent } from '../Manufacturer/Manufacturer.component';

// //Open Color popup
//-- import { ColorGrid } from '../Color/color.component';
//-- import { ColorEditor } from '../Color/color-editor.component';

// //Open Unit popup
//-- import { UOMMasterGrid } from '../UOMMaster/uomMaster.component';
//-- import { UOMMasterEditor } from '../UOMMaster/uomMaster-editor.component';

declare var $: any;
@Component({
    selector: 'ModelMaster-editor',
    providers: [ModelMasterService],
    //styles: ['>>> .modal-xxl { width: 1100px; }'],
    templateUrl: './modelmastereditor.html'

})

export class ModelMasterEditor {

    setUserGridType: string = "popuprefress";
    ImaheEditButtonText: string = "Make Default";
    ShowImageDelete: boolean = false;
    ShowImageEdit: boolean = false;
    AllowImageAdd: boolean = true;
    isImageUploded: boolean = false;
    isIamgeNotSelected: boolean = false;

    //setColorGridType: string = "popup";  

    //Open Mode popup
    @ViewChild('modalAddmodule') modalAddmodule: BsModalComponent;
    @ViewChild('ModelGrid') _ModelGrid: ModelGrid;
    //-----------@ViewChild('ModelEditor') _ModelEditor: ModelEditor;
    //IsEditorVisible: boolean = false;
    //SelectedId: number;
    //isModelOpened: boolean = false;
    //selectedId: any;

    //Open Manufacturere popup
    @ViewChild('modalManufacturere') modalManufacturere: BsModalComponent;
    //-- @ViewChild('ManufacturerComponent') _ManufacturerComponent: ManufacturerComponent;    

    //Open Color popup
    //-------------@ViewChild('modalColor') modalColor: BsModalComponent;
    //-- @ViewChild('ColorGrid') _ColorGrid: ColorGrid;
    //--  @ViewChild('ColorEditor') _ColorEditor: ColorEditor;

    //Open Unit popup
     @ViewChild('modalUnit') modalUnit: BsModalComponent;
         //-- @ViewChild('UOMMasterGrid') _UOMMasterGrid: UOMMasterGrid;
    //-- @ViewChild('UOMMasterEditor') _UOMMasterEditor: UOMMasterEditor;

    //@Input("selectedId") selectedId: number;
    //@Input("permission") permission: boolean;        

    @ViewChild("itemSelector")
    itemSelectorModel: BsModalComponent;
    CurrentModelMaster: ModelMaster = new ModelMaster();

    ModelImage: ModelMasterImage = new ModelMasterImage();

    @Output() EditorVisibilityChange = new EventEmitter();
    ItemSKUId: number;
    errorMessage: string;
    manufacturerlist: Manufacturer[];
    modelmastereditor: any
    colorlist: any;
    grouplist: any;
    unitlist: any;
    IsLoaded: boolean;
    ReceiveTypelist: any;
    ReturnTypelist: any;
    Modellist: any;
    MODHeaderName: string;
    moduleTitle: string;
    partnerID: any;
    LocalAccess: any = [];
    @Input() selectedId: number;
    @Input() permission: boolean;
    isSaveClick: boolean = true;
    //---item master type

    AllCostBreakDownCollection: any;
    AllCostBreakDowns: any;
    CostBreakDowns: any;
    availableCostBreakDown: any;
    selectedCostBreakDown: any;
    dataSource: any;
    cbgridOptions: GridOptions;
    columnDefs = [{}];
    cbcolumnDefs =
        [
            { headerName: 'Type Code', field: "TypeCode", width: 150 },
            { headerName: 'Type Name', field: "TypeName", width: 150 },
            { headerName: 'Safety Stock Qty', field: "SafetyStockQty", editable: true, width: 150 },

        ];
    //----ItemMasterSKU
    AllSKUList: any = [];
    SKUList: any = [];
    itemSKUList: any = [];
    itemImageList: any = [];
    selectitemSKUList: any = [];
    selectedSKU: any = [];
    selectedImage: any = [];
    availableSKU: any = [];

    imagegridOptions: GridOptions;
    imagegridcolumnDefs =
        [
            { headerName: "Item Image", field: "FileUrl",  cellRenderer: this.ImageElement },
            { headerName: "Image Name", field: "FileName",  cellRenderer: this.TextElement },
            { headerName: "Image Type", field: "FileType",  cellRenderer: this.TextElement },
            { headerName: "Default", field: "isDefault",  cellRenderer: this.IconElement },
        ];

    skugridOptions: GridOptions;
    skugridcolumnDefs =
        [
            { headerName: 'Item Name', field: "ItemName", width: 150 },
            { headerName: 'Description', field: "ItemDescription", width: 150 },
            { headerName: 'SKU Code', field: "SKUCode", width: 150 },
            { headerName: 'EAN Code', field: "EANCode", width: 150 },
            //{ headerName: 'Item Cost', field: "ItemCost", width: 150 },
            //{ headerName: 'Warranty Days', field: "ExtWarrantyDays", width: 150 },
            //{ headerName: 'Discount%', field: "ItemDiscountPC", width: 150 },
            { headerName: 'Item Price', field: "ItemPrice", width: 150 },
            { headerName: 'Quantity', field: "Quantity", width: 150 },
            //{ headerName: 'Is Active', field: "IsActive", width: 150 },

        ];

    allskugridOptions: GridOptions;
    allskugridcolumnDefs =
        [
            { headerName: 'SKU Name', field: "SKUName", width: 150 },
            { headerName: 'Description', field: "SKUDescription", width: 150 },
            { headerName: 'Price', field: "Price", width: 150 },

        ];


    constructor(
        private modelmasterService: ModelMasterService
        , private _menu: SidebarService
        , private _router: Router
        , private route: ActivatedRoute
        , private util: Util,
        private formBuilder: FormBuilder
        //, private _globalService: GlobalVariableService
        , private activateRoute: ActivatedRoute) {
        //super()
        // this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path); 
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;

        this.cbgridOptions = {
            rowData: this.CostBreakDowns,
            columnDefs: this.cbcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'

        };
        this.skugridOptions = {
            rowData: this.itemSKUList,
            columnDefs: this.skugridcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };
        this.imagegridOptions = {
            rowData: this.itemImageList,
            columnDefs: this.imagegridcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single',
            rowHeight: 120
        };
        this.allskugridOptions = {
            rowData: this.SKUList,
            columnDefs: this.allskugridcolumnDefs,
            enableColResize: true,
            enableServerSideSorting: true,
            //enableServerSideFilter: true,
            rowSelection: 'single'
        };
        //this.Reset();        
    };
    @ViewChild('pop') _popup: message;
    @ViewChild('pop1') _popup1: modal;

    ngOnInit() {
        this.IsLoaded = false;

        this.modelmasterService.load(this.selectedId).subscribe(modelmaster => {
            if (this.selectedId != 0) {
                this.AllowImageAdd = true;
                this.CurrentModelMaster = modelmaster[0][0];
                this.MODHeaderName = (this.permission) ? 'Edit ' + this.moduleTitle : this.moduleTitle;
            }
            else {
                this.AllowImageAdd = false;
                this.CurrentModelMaster = new ModelMaster();
                this.CurrentModelMaster.CurrencyCode = modelmaster[2][0].CurrencyCode;
                this.CurrentModelMaster.ItemMasterID = 0;
                this.CurrentModelMaster.IsActive = true;
                this.MODHeaderName = 'Add ' + this.moduleTitle
            }
            //added for dynamic Field--------
            var localize = JSON.parse(modelmaster[1][0].ColumnDefinitions);
            if (this.selectedId != 0) {
                var localeditor = localize.map(function (e) {
                    return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                });
            }
            else {
                var localeditor = localize.map(function (e) {
                    e.isEnabled = 1;
                    return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                });
            }
            this.modelmastereditor = JSON.parse("{" + localeditor.join(',') + "}");
            this.IsLoaded = true;
            //-----------------------------------------------------------

        });



        this.modelmasterService.loadManufacturer().subscribe(modelmaster => {
     
            this.manufacturerlist = modelmaster;

            });

        this.modelmasterService.loadColors().subscribe(modelmaster => {
            this.colorlist = modelmaster;

        });
        //this.modelmasterService.loadGroups().subscribe(modelmaster => {
        //    this.grouplist = modelmaster;

        //});
        this.modelmasterService.loadUnits().subscribe(modelmaster => {
            this.unitlist = modelmaster;

        });
        this.modelmasterService.loadReceiveType().subscribe(modelmaster => {
            this.ReceiveTypelist = modelmaster;

        });
        this.modelmasterService.loadReturnType().subscribe(modelmaster => {
            this.ReturnTypelist = modelmaster;

        });
        this.modelmasterService.loadModel().subscribe(modelmaster => {
            this.Modellist = modelmaster;

        });

        this.modelmasterService.loadAllSKUs().subscribe(modelmaster => {
            this.AllSKUList = modelmaster;
        });
        //this.modelmasterService.loadSKUs(this.selectedId).subscribe(modelmaster => {
        //    this.SKUList = modelmaster;
        //    this.allskugridOptions.api.setRowData(this.SKUList);

        //});

        // ---this.modelmasterService.loadItemSKU(this.selectedId).subscribe(modelmaster => {
        //     this.itemSKUList = modelmaster;
        //     //this.skugridOptions.api.setRowData(this.itemSKUList);
        //     if (this.skugridOptions.api)
        //         this.skugridOptions.api.setRowData(this.itemSKUList);
        //     else
        //         this.skugridOptions.rowData = this.itemSKUList;
        // }); 

        this.modelmasterService.loadItemImage(this.selectedId).subscribe(modelmaster => {
            this.itemImageList = modelmaster;
            if (this.imagegridOptions.api)
                this.imagegridOptions.api.setRowData(this.itemImageList);
            else
                this.imagegridOptions.rowData = this.itemImageList;
        });

        this.modelmasterService.loadItemMastertype(this.selectedId).subscribe(modelmaster => {
            this.CostBreakDowns = modelmaster;
            //this.cbgridOptions.api.setRowData(this.CostBreakDowns);
            if (this.cbgridOptions.api)
                this.cbgridOptions.api.setRowData(this.CostBreakDowns);
            else
                this.cbgridOptions.rowData = this.CostBreakDowns;

        });

        this.modelmasterService.loadTypeLookUps(this.selectedId).subscribe(modelmaster => {
            this.AllCostBreakDowns = modelmaster;

        });
        this.modelmasterService.loadAllTypeLookUps().subscribe(modelmaster => {
            this.AllCostBreakDownCollection = modelmaster;

        });

    }

    //CheckArticleNumber() {
    //    var me = this;
    //    var articlenumber = $("#txtArticleNumber").val();

    //    Toast.inputError('article_number_error', 'Article Number already in use.');

    //    this.modelmasterService.ValidateArticleNumber(this.CurrentModelMaster.ItemMasterID, articlenumber).subscribe(returnvalue => {
    //        if (returnvalue[0].emailid.toString().toLowerCase().trim() == articlenumber.toString().toLowerCase().trim()) {
    //            this.CurrentModelMaster.ArticleNumber = null;
    //            Toast.errorToast("Article Number already in use.");
    //        }
    //    }, error => console.log('Could not validate article number.'));
    //}

    selectParent(me: any = this) {
        me.modalAddmodule.open();
    }
    ModelGridEvent(event, me: any = this) {
        alert('ModelGridEvent');
        $('#divModulepop').modal('hide');
        // me.modalAddmodule.close();                
        this.modelmasterService.loadModel().subscribe(modelmaster => {
            this.Modellist = modelmaster;
        });
    }

    //deltaIndicator(params) {

    //    var element = document.createElement("span");        
    //    if (params.value.indexOf("core.windows.net") > -1) {

    //        var imageElement = document.createElement("img");
    //        imageElement.src = params.value;
    //        imageElement.width = 100;
    //        imageElement.height = 100;

    //        element.appendChild(imageElement);
    //    }
    //    else {

    //        var button = document.createElement("span");
    //        if (params.value == 'True') {
    //            button.innerHTML = "<i class='fa fa-check' aria-hidden='true' style='font-size:23px;color:green'></i>";               
    //        }
    //        else {                
    //            button.innerHTML = "<i class='fa fa-times' aria-hidden='true' style='font-size:23px;color:red'></i>";
    //        }
    //        element.appendChild(button); 
    //    }

    //    return element;
    //}

    TextElement(params) {
        var element = document.createElement("span");

        var button = document.createElement("span");
        button.innerHTML = params.value;

        element.appendChild(button);

        return element;
    }

    IconElement(params) {
        var element = document.createElement("span");

        var button = document.createElement("span");
        if (params.value == 'True') {
            button.innerHTML = "<i class='fa fa-check' aria-hidden='true' style='font-size:23px;color:green'></i>";
        }
        else {
            button.innerHTML = "<i class='fa fa-times' aria-hidden='true' style='font-size:23px;color:red'></i>";
        }
        element.appendChild(button);

        return element;
    }

    ImageElement(params) {

        var element = document.createElement("span");

        var imageElement = document.createElement("img");
        imageElement.src = params.value;
        imageElement.width = 100;
        imageElement.height = 100;
        element.appendChild(imageElement);

        return element;
    }

    SelectImageFile(): void {
        this.isImageUploded = false;
        this.ModelImage.IsDefault = false;

        $('#btnUploadImage').click(function () { $('#returnArtifact').trigger('click'); });
    }
    EditImageFile(): void {

        if (this.selectedImage[0].isDefault == 'True')
            this.ModelImage.IsDefault = false;
        else
            this.ModelImage.IsDefault = true;
        this.ModelImage.ItemMasterID = this.CurrentModelMaster.ItemMasterID;
        this.ModelImage.ItemArtifactID = this.selectedImage[0].ItemArtifactID;

        this.modelmasterService.UpdateItemImage(this.ModelImage).subscribe(returnvalue => {
            //this._popup.Alert('Alert', 'Item Master updated successfully.', function () {
            //    me.EditorVisibilityChange.emit(true);
            //});

            this.ShowImageEdit = false;
            this.ShowImageDelete = false;
            this.LoadImageDate();

        }, error => this.util.error(error, 'error'));

    }

    onSelectedImageChanged() {
        this.selectedImage = this.imagegridOptions.api.getSelectedRows();
        this.ShowImageDelete = true;
        this.ShowImageEdit = true;

        if (this.selectedImage[0].isDefault == 'True')
            this.ImaheEditButtonText = "Remove Default";
        else
            this.ImaheEditButtonText = "Make Default";
    }

    DeleteItemImage() {
        var me: any = this;
        this._popup.Confirm('Delete', 'Do you want to delete this image?', function () {

            if (me.selectedImage != null && me.selectedImage != undefined) {

                me.ModelImage.ItemMasterID = me.CurrentModelMaster.ItemMasterID;
                me.ModelImage.ItemArtifactID = me.selectedImage[0].ItemArtifactID;
                me.modelmasterService.DeleteItemImage(me.ModelImage).subscribe(returnvalue => {

                    me.ShowImageDelete = false;
                    me.ShowImageEdit = false;
                    me.LoadImageDate();

                    // me._popup.Alert('Alert', 'Image Deleted successfully.', function () {
                    // })
                    this.util.Success('Image Deleted successfully.','');

                }, error => this.util.error(error, 'error'));
            }
            else {

            }
        });

    }

    LoadImageDate() {
        this.modelmasterService.loadItemImage(this.selectedId).subscribe(modelmaster => {
            this.itemImageList = modelmaster;           
            if (this.imagegridOptions.api)
                this.imagegridOptions.api.setRowData(this.itemImageList);
            else
                this.imagegridOptions.rowData = this.itemImageList;
        });
    }

    ImageFile: FileList;
    handleReturnDocs(e, me1: any=this) {

        var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (file.length > 0) {
            var pattern = /image-*/;
            var reader = new FileReader();
            if (!file[0].type.match(pattern)) {
                //this._popup.Alert('Alert', 'Invalid document format');
                this.util.error('Invalid document format','');
                return;
            }

            //Wheel.loadingwheel(true);
            this.ImageFile = file;
            let formData: FormData = new FormData();
            for (let i = 0; i < this.ImageFile.length; i++) {
                formData.append('SRODocs', this.ImageFile[0]);
            }

            this.modelmasterService.UploadItemImage(formData).subscribe(data => {
                if (data.result == 'Success') {
                    this.isImageUploded = true;

                    this.ModelImage.FileName = data.FileName;
                    this.ModelImage.ArtifactURL = data.FileUrl;
                    this.ModelImage.Description = "";
                    this.ModelImage.IsDefault = false;
                    this.ModelImage.ItemMasterID = this.CurrentModelMaster.ItemMasterID;

                    this.modelmasterService.SaveItemImage(this.ModelImage).subscribe(returnvalue => {
                        if (returnvalue.result==="Success")
                        {
                            this.ShowImageDelete = false;
                            this.ShowImageEdit = false;
                            this.LoadImageDate();
                        }
                        else {
                            this.util.error('Error','') 
                        }
                    }, error => this.util.error(error, 'error'));
                }
                else {
                    this.isImageUploded = false;
                }

                //Wheel.loadingwheel(false);
            });
        }
        else {

        }
    }

    selectManufacturer(me: any = this) {
        //me.isModelOpened = true;
        me.modalManufacturere.open();
        //me._ManufacturerComponent.ngOnInit();
    }
    ManufacturereModelEvent(event, me: any = this) { 
        me.modalManufacturere.close();
        this.modelmasterService.loadManufacturer().subscribe(modelmaster => {
            this.manufacturerlist = modelmaster;
        });
    }

    selectColor(me: any = this) {
        //me.isModelOpened = true;
        me.modalColor.open();
        //me._ColorGrid.ngOnInit();
    }
    ColorModelEvent(event, me: any = this) {
        me.modalColor.close();
        this.modelmasterService.loadColors().subscribe(modelmaster => {
            this.colorlist = modelmaster;

        });
    }

    selectUnit(me: any = this) {
        //me.isModelOpened = true;
        me.modalUnit.open();
        //me._UOMMasterGrid.ngOnInit();
    }
    UnitModelEvent(event, me: any = this) {
        me.modalUnit.close();
        this.modelmasterService.loadUnits().subscribe(modelmaster => {
            this.unitlist = modelmaster;

        });
    }

    Reset() {

        this.AllCostBreakDownCollection = [];
        this.AllCostBreakDowns = [];
        this.CostBreakDowns = [];

        this.availableCostBreakDown = null;
        this.selectedCostBreakDown = null;

        this.AllSKUList = [];
        this.SKUList = [];
        this.itemSKUList = [];
        this.itemImageList = [];
        this.selectedSKU = null;
        this.selectedImage = null;
        this.availableSKU = null;
    }
    moveCostBreakDown() {
        var item = this.availableCostBreakDown[0]
        var ind = this.AllCostBreakDowns.map(function (e) { return e.TypeName; }).indexOf(item.TypeName);
        if (ind != -1) {
            this.AllCostBreakDowns.splice(ind, 1);
            this.CostBreakDowns.push(JSON.parse(JSON.stringify(item)));
        }
        this.cbgridOptions.api.setRowData(this.CostBreakDowns);
    }

    moveCostBreakDownBack() {
        var item = this.AllCostBreakDownCollection.filter(d => d.TypeName === this.selectedCostBreakDown[0].TypeName)[0];
        var ind = this.CostBreakDowns.map(function (e) { return e.TypeName; }).indexOf(item.TypeName);
        if (ind != -1) {
            this.CostBreakDowns.splice(ind, 1);
            this.AllCostBreakDowns.push(item);
        }
        this.cbgridOptions.api.setRowData(this.CostBreakDowns);
    }

    moveAllCostBreakDown() {
        var fromCollection = $.grep(this.AllCostBreakDowns, function (value) {
            return value;
        });
        for (let item of fromCollection) {
            var ind = this.AllCostBreakDowns.map(function (e) { return e.TypeName; }).indexOf(item.TypeName);
            if (ind != -1) {
                this.AllCostBreakDowns.splice(ind, 1);
                this.CostBreakDowns.push(JSON.parse(JSON.stringify(item)));
            }
        }
        this.cbgridOptions.api.setRowData(this.CostBreakDowns);
    }

    moveAllCostBreakDownBack() {
        var fromCollection = $.grep(this.CostBreakDowns, function (value) {
            return value;
        });
        for (let item of fromCollection) {
            var itemtoMove = this.AllCostBreakDownCollection.filter(d => d.TypeName === item.TypeName)[0];
            var ind = this.CostBreakDowns.map(function (e) { return e.TypeName; }).indexOf(item.TypeName);
            if (ind != -1) {
                this.CostBreakDowns.splice(ind, 1);
                this.AllCostBreakDowns.push(itemtoMove);
            }
        }
        this.cbgridOptions.api.setRowData(this.CostBreakDowns);
    }

    //---ItemmasterSKU

    //moveSKU() {
    //    var item = this.availableSKU[0]
    //    var ind = this.SKUList.map(function (e) { return e.SKUName; }).indexOf(item.SKUName);
    //    if (ind != -1) {
    //        this.SKUList.splice(ind, 1);
    //        this.itemSKUList.push(JSON.parse(JSON.stringify(item)));
    //    }
    //    this.skugridOptions.api.setRowData(this.itemSKUList);
    //    this.allskugridOptions.api.setRowData(this.SKUList);
    //}

    //moveSKUBack() {
    //    var item = this.AllSKUList.filter(d => d.SKUName === this.selectedSKU[0].SKUName)[0];
    //    var ind = this.itemSKUList.map(function (e) { return e.SKUName; }).indexOf(item.SKUName);
    //    if (ind != -1) {
    //        this.itemSKUList.splice(ind, 1);
    //        this.SKUList.push(item);
    //    }
    //    this.skugridOptions.api.setRowData(this.itemSKUList);
    //    this.allskugridOptions.api.setRowData(this.SKUList);
    //}

    //moveAllSKU() {
    //    var fromCollection = $.grep(this.SKUList, function (value) {
    //        return value;
    //    });
    //    for (let item of fromCollection) {
    //        var ind = this.SKUList.map(function (e) { return e.SKUName; }).indexOf(item.SKUName);
    //        if (ind != -1) {
    //            this.SKUList.splice(ind, 1);
    //            this.itemSKUList.push(JSON.parse(JSON.stringify(item)));
    //        }
    //    }
    //    this.skugridOptions.api.setRowData(this.itemSKUList);
    //    this.allskugridOptions.api.setRowData(this.SKUList);
    //}

    //moveAllSKUBack() {
    //    var fromCollection = $.grep(this.itemSKUList, function (value) {
    //        return value;
    //    });
    //    for (let item of fromCollection) {
    //        var itemtoMove = this.AllSKUList.filter(d => d.SKUName === item.SKUName)[0];
    //        var ind = this.itemSKUList.map(function (e) { return e.SKUName; }).indexOf(item.SKUName);
    //        if (ind != -1) {
    //            this.itemSKUList.splice(ind, 1);
    //            this.SKUList.push(itemtoMove);
    //        }
    //    }
    //    this.skugridOptions.api.setRowData(this.itemSKUList);
    //    this.allskugridOptions.api.setRowData(this.SKUList);
    //}

    onSelectedCostBreakdownChanged() {
        this.selectedCostBreakDown = this.cbgridOptions.api.getSelectedRows();
    }
    onSelectedSKUChanged() {
        this.selectedSKU = this.skugridOptions.api.getSelectedRows();
    }

    onSelectedallSKUChanged() {

        this.availableSKU = this.allskugridOptions.api.getSelectedRows();
    }

    onChange(deviceValue) {
        this.CurrentModelMaster.ManufacturerID = deviceValue;
    }
    ongroupChange(deviceValue) {
        this.CurrentModelMaster.SubGroupID = deviceValue;
    }
    onunitChange(deviceValue) {
        this.CurrentModelMaster.UOMID = deviceValue;
    }
    onColorChange(deviceValue) {
        this.CurrentModelMaster.ColorID = deviceValue;
    }
    onReceiveChange(deviceValue) {
        this.CurrentModelMaster.ItemReceiveTypeID = deviceValue;
    }
    onReturnChange(deviceValue) {
        this.CurrentModelMaster.ItemReturnTypeID = deviceValue;
    }
    onModelChange(deviceValue) {
        this.CurrentModelMaster.ItemModelID = deviceValue;
    }

    isNumber(evt) {
        evt = (evt) ? evt : window.event;
        if (evt > 31 && (evt < 48 || evt > 57)) {
            return false;
        }
        return true;
    }

    isFloat(evt) {
        evt = (evt) ? evt : window.event;
        if (evt == 46 || evt == 8 || evt == 190) {
            return true;
        }
        else if (evt < 48 || evt > 57) {
            return false;
        }
    }

    itemListChange($event) {
        this.itemSKUList = $event;
        this.skugridOptions.api.setRowData($event);
    }
    onSubmit(form) {
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
        var me = this;
        var cb = $.grep(this.CostBreakDowns, function (n, i) { return $.isNumeric(n.SafetyStockQty) == false });
        if (cb.length > 0) {
            //this._popup.Alert('Alert', 'Please add valid amount in all SafetyStockQty fields.');
            this.util.error('Please add valid amount in all SafetyStockQty fields.','');
            
            return;
        }
        if (this.CostBreakDowns.length > 0)
            this.CurrentModelMaster.AllItemMasterTypeList = this.CostBreakDowns;

        if (this.itemSKUList.length > 0)
            this.CurrentModelMaster.AllItemMasterList = this.itemSKUList;

        if (this.CurrentModelMaster.ItemMasterID == 0) {
            this.modelmasterService.create(this.CurrentModelMaster).subscribe(returnvalue => {
                // this._router.navigate(['app.ModelMaster']);
                if (returnvalue._body.indexOf("Success") >= 0) {
                   this.util.success('Item Master Created successfully.','');
                    // this._popup.Alert('Alert', 'Item Master Created successfully.', function () {
                    //     me.EditorVisibilityChange.emit(true);
                    // });
                    me.EditorVisibilityChange.emit(true);

                }
                else {
                    //this._popup.Alert('Alert', returnvalue._body);
                    this.util.error(returnvalue._body,'');
                     //Toast.errorToast("Article Number already in use.");
                }
            }, error => this.util.error(error, 'error'));
        }
        else {
            //this.CurrentModelMaster.AllItemMasterList = this.itemSKUList;
            this.modelmasterService.update(this.CurrentModelMaster).subscribe(returnvalue => {
                this.util.success('Item Master updated successfully.','');
                // this._popup.Alert('Alert', 'Item Master updated successfully.', function () {
                //     me.EditorVisibilityChange.emit(true);
                // });
                me.EditorVisibilityChange.emit(true);

            }, error => this.util.error(error, 'error'));
        }
    }

    onCancel() {
        this.EditorVisibilityChange.emit(false);
        // this._router.navigate(['/app.ModelMaster']);
    }
    SelectItem() {

        this.itemSelectorModel.open();
    }
}


