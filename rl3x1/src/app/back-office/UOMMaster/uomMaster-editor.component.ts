import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UOMMasterService } from './uomMaster.service';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UOMMaster } from './uomMaster.model';
import { GridOptions } from 'ag-grid-community'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { Util } from 'src/app/app.util';


@Component({
    selector: 'uommaster-editor',
    providers: [UOMMasterService
        //, LoginService
        , CommonService],
    templateUrl: './uomMastereditor.html'

})

export class UOMMasterEditor {
    @Input() selectedId: number;

    @Input("GridType") GridType: string;
    @Output('close') closeEvent = new EventEmitter();

    @Input() permission: boolean;
    CurrentUOM: UOMMaster = new UOMMaster();
    UOMTypeList: UOMMaster[];

    errorMessage: string;
    uomeditor: any
    grouplist: any;
    IsLoaded: boolean;
    SKUgridOptions: GridOptions;
    SKUlist: any;
    filterValue: string
    dataSource: any;
    isEditVisible: boolean;
    IsGridLoaded: boolean;
    UOMHeaderName: string;
    moduleTitle: string;
    @Output() EditorVisibilityChange = new EventEmitter();
    isSaveClick: boolean = false;

    GridcolumnDefs =
        [
            { headerName: 'SKU Name', field: "SKUName", width: 200 },
            { headerName: 'SKU Description', field: "SKUDescription", width: 200 },
            { headerName: 'Price', field: "Price", width: 200 },

        ];
    constructor(        
        private uomService: UOMMasterService
        , private _router: Router
        , private commonService: CommonService
        , private route: ActivatedRoute
        , private formBuilder: FormBuilder
        , private _menu: SidebarService
        , private _LoginService: AuthService
        , private _util: Util
    ) {

        // this.moduleTitle = _globalService.getModuleTitle(route.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;

    };

    //@ViewChild('pop') _popup: message;
    ngOnInit() {

        if (this.GridType == "popuprefress")
            this.moduleTitle = "Product UOM";

        this.IsLoaded = false;

        this.commonService.getTypeLookUpByName('UOMType')
            .subscribe(result => {
                this.UOMTypeList = result;
            }, error => this.errorMessage = <any>error);

        this.uomService.loadUOM(this.selectedId).subscribe(modelmaster => {
            if (this.selectedId != 0) {
                this.CurrentUOM = modelmaster[0][0];
                this.UOMHeaderName = (this.permission) ? 'Edit ' + this.moduleTitle : this.moduleTitle;
            }
            else {
                this.CurrentUOM = new UOMMaster();
                this.CurrentUOM.IsActive = true;
                this.CurrentUOM.UOMID = 0;
                this.UOMHeaderName = 'Add ' + this.moduleTitle;
            }
            //added for dynamic Field--------
            //var localize = modelmaster[1];
            var localize = JSON.parse(modelmaster[1][0].ColumnDefinations);
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
            this.uomeditor = JSON.parse("{" + localeditor.join(',') + "}");
            this.IsLoaded = true;
            //-----------------------------------------------------------
        });

    }

    //getUOMData(selectedUOMID) {

    //    if (selectedUOMID === null || selectedUOMID === 'undefined' || selectedUOMID === 0) {
    //        alert('error occured while selection');
    //    }
    //    else {        

    //        this.uomService.getUOMTypeData(selectedUOMID).subscribe(result => {

    //            this.UOMTypeList = result;
    //            this.CurrentUOM.UOMType = this.UOMTypeList[1].UOMType;        

    //        }, error => this.errorMessage = <any>error);          
    //    }
    //}
    onSubmit(form: any) {
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
        this.CurrentUOM.CreatedById = this.CurrentUOM.ModifyById = this._LoginService.loginUserID;
        if (this.CurrentUOM.UOMID == 0) {
            this.uomService.create(this.CurrentUOM).subscribe(returnvalue => {
                if (returnvalue.result != "Success") {
                    this._util.error(returnvalue.result, '');
                }
                else {
                    var me = this;
                    // this._popup.Alert('Alert', 'Saved successfully.', function () {
                    // });
                    this._util.success('Saved successfully', '');
                    me.EditorVisibilityChange.emit(true);
                    if (this.GridType == "popuprefress") {
                        me.closeEvent.emit();
                    }
            }

                //if (this.GridType == "popuprefress") {
                //    me.closeEvent.emit();
                //}
                //else {
                //    this._popup.Alert('Alert', 'Saved successfully.', function () {
                //        me.EditorVisibilityChange.emit(true);
                //    });
                //}
            }, error => this._util.error(error, 'error'));
        }
        else {
            //this.CurrentModel.AllItemMasterList = this.itemSKUList;
            this.uomService.update(this.CurrentUOM).subscribe(returnvalue => {
                this._util.success('UOM updated successfully.', '');
                //   this._popup.Alert('Alert', 'UOM updated successfully.', function () {
                // });
                me.EditorVisibilityChange.emit(true);

                if (this.GridType = "popuprefress") {
                    me.closeEvent.emit();
                }

                //if (this.GridType = "popuprefress") {
                //    me.closeEvent.emit();
                //}
                //else {
                //    this._popup.Alert('Alert', 'UOM updated successfully.', function () {
                //        me.EditorVisibilityChange.emit(true);
                //    });
                //}
            }, error => this._util.error(error, 'error'));
        }

    }

    onCancel() {
        this.EditorVisibilityChange.emit(false);
        // this._router.navigate(['/app.UOMMaster']);
    }


}


