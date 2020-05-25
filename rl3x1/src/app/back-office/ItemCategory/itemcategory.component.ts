
import { Observable } from 'rxjs/Observable';
import { Property, Util } from '../../app.util';
import { Component, Directive, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ItemCategoryService } from './itemcategory.Service.js'
//import { ser } from '';
import { Router, ActivatedRoute } from '@angular/router';
import { Itemcategory } from "./itemcategory.model"

import { TreeView } from '../../controls/tree-view/tree-view.component.js';
import { Directory } from '../../controls/tree-view/tree-view-directory.js';

import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { CommonService } from '../../shared/common.service';
import { SidebarService } from '../sidebar/sidebar.service';

//import { ContextMenuService } from '../../controls/context-menu/component/src/contextMenu.service.js';
//import { ContextMenuComponent } from '../../controls/context-menu/component/contextMenu.component.js';
declare var $: any;

@Component({
    selector: 'ItemCategoryComponent',
    providers: [ItemCategoryService],
    templateUrl: './itemcategory.html'


})
export class ItemCategoryComponent extends Property {
    directories: Array<Directory> = [];
    currentItem: Itemcategory = new Itemcategory();
    selectDirectory: Directory;
    errorMessage: string;
    IsLoaded: boolean;
    ListView: boolean = true;
    ActionList: any;
    @Input() IsPopup: boolean = false;
    @Input() isContextMenu: boolean = true;
    @Output() notifyData: EventEmitter<any> = new EventEmitter<any>();
    CategoryName: string=''; CategoryCode: string='';
    selectedID: number;
    itemlist: any
    constructor(private _itemCategoryService: ItemCategoryService
        , private activateRoute: ActivatedRoute, public commonService: CommonService
        , private _globalService: GlobalVariableService
        , private _menu: SidebarService
        , private _util: Util
        , private _router: Router) {
        super();
        // this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        this.loadPermissionByModule(this.moduleTitle);
    }

    Show(mode) {
        if (this.currentItem.ItemCategoryID == 0) {
            this.currentItem = new Itemcategory();
            this.currentItem.ItemCategoryID = 0;

        } else {
            var ParentCategoryID = this.currentItem.ItemCategoryID;
            this.CategoryName = this.currentItem.CategoryName;
            this.currentItem = new Itemcategory();
            this.currentItem.ItemCategoryID = 0;
            this.currentItem.ParentCategoryID = ParentCategoryID;
        }
        this.mode = mode;
        this.ListView = false;
    }

    ChildDirs(itemcat: any) {
        let childdir = [];
        if (itemcat.HasChildren == true) {
            var childItem = $.grep(this.itemlist, function (n, i) { return n.ParentCategoryID === itemcat.ItemCategoryID; });
            for (let item of childItem) {
                var dir = new Directory(item.ItemCategoryID, item.HasChildren, item.CategoryCode, item.CategoryName, this.ChildDirs(item));
                dir.ParentNode = dir
                dir.expanded = false;
                childdir.push(dir);
            }
        }
        return childdir;
    }

    ParentDirs() {
        let childdir = [];
        var childItem = $.grep(this.itemlist, function (n, i) { return n.ParentCategoryID === null; });
        for (let item of childItem) {
            // var cpdir = new Directory(item.ItemCategoryID, item.HasChildren, item.CategoryCode, item.CategoryName, null, this.ChildDirs(item, dir));
            var dir = new Directory(item.ItemCategoryID, item.HasChildren, item.CategoryCode, item.CategoryName, this.ChildDirs(item));
            dir.ParentNode = dir
            dir.expanded = true;
            childdir.push(dir);
        }
        return childdir;
    }


    ngOnInit() {

        if (this.IsPopup == true)
            this.isContextMenu = false;
        else
            this.isContextMenu = true;

        this.MakeTreeView();
        this.ActionList = [
            {
                html: (item) => `Add`,
                click: (item) => {
                    item.mode = 'Add'; this.GetData(item);
                },
            },
            {
                html: (item) => `Edit`,
                click: (item) => {
                    item.mode = 'Edit'; this.GetData(item);
                }
            },
            {
                html: (item) => `Delete`,
                click: (item) => {
                    item.mode = 'Delete'; this.GetData(item);
                }
            },
        ];
    }


    MakeTreeView() {
        this.directories = [];
        this._itemCategoryService.loadAll().
            subscribe(
                result => {
                    var localize = JSON.parse(result.recordsets[1][0].ColumnDefinations);

                    var localeditor = localize.map(function (e) {
                        return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width + ' }';
                    });
                    this.e_localize = JSON.parse("{" + localeditor.join(',') + "}");

                    this.itemlist = result.recordsets[0];
                    var index = 0;
                    //for (let item of this.itemlist) {
                    let dir = new Directory(0, true, 'Root1', 'Root', this.ParentDirs());
                    dir.ParentNode = dir;
                    dir.expanded = true;
                    if (index == 0)
                        this.directories.push(dir);
                    index++;
                    //}
                });
    }

    @ViewChild('pop') _popup: message;
    onSubmit(form) {

        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            return;
        }
        this._itemCategoryService.save(this.currentItem).subscribe(returnvalue => {
            if (returnvalue.result == "Name Already Exists") {
                //this._popup.Alert('Alert', 'Category Name is already exist .');
                this._util.error("Category Name already exists.", "");
            } else if (returnvalue.result == "Code Already Exists") {
                //this._popup.Alert('Alert', 'Category Code is already exist .');
                this._util.error("Category Code already exists.", "");
            } else {
                //this.currentItem = $.grep(this.itemlist, function (n, i) { return n.ItemCategoryID === returnvalue.data[0][0].ItemCategoryID[0]; })[0];

                this.currentItem.ItemCategoryID = returnvalue.data[0][0].ItemCategoryID[0];
                this.currentItem.CategoryName = returnvalue.data[0][0].CategoryName[0];
                this.currentItem.CategoryCode = returnvalue.data[0][0].CategoryCode[0];
                this.currentItem.ParentCategoryID = returnvalue.data[0][0].ParentCategoryID || [][0];;
                this.currentItem.IsActive = returnvalue.data[0][0].IsActive[0];
                if (returnvalue.data[0][0].$action == 'INSERT') {
                    this.itemlist.splice(1, 0, this.currentItem);
                    //this.selectDirectory.ChildNodes.push(new Directory(this.currentItem.ItemCategoryID, false, this.currentItem.CategoryCode, this.currentItem.CategoryName,[]));
                    //this.selectDirectory.HasChildren = true;
                    //this.selectDirectory.expanded = true;
                    this.CategoryCode = '';
                    this.selectedID = 0;
                    this.ListView = true;
                    this.MakeTreeView();

                } else {
                    // this.currentItem.CategoryName = 
                    //this.refreshTree(this.directories);
                    this.MakeTreeView();
                }
                //this._popup.Alert('Alert', 'Item Category save successfully.');
                this._util.success("Item Category saved successfully.", "");

            }
        }, error => this._util.error(error, 'error'));
    }
    mode: string;
    GetData(item: any) {
        this.mode = item.mode;
        this.selectDirectory = item;
        if (item.mode == 'Add') {
            this.currentItem = new Itemcategory();
            this.currentItem.ItemCategoryID = 0;
            if (item.ID != 0) {
                var ParentCategoryID = item.ID;
                this.CategoryName = item.Name;
                this.currentItem.ParentCategoryID = ParentCategoryID;
            } else { this.CategoryName = ''; }
            item.mode = '';
            this.ListView = false;

        } else if (item.mode == 'Delete') {
            this.currentItem = $.grep(this.itemlist, function (n, i) { return n.ItemCategoryID === item.ID; })[0];
            this.Delete(this);
            item.mode = '';
        } else {
            this.selectData(item);
        }
        this.notifyData.emit(this.currentItem);
    }

    selectData(item) {
        // this.selectDirectory = item;
        this.currentItem = $.grep(this.itemlist, function (n, i) { return n.ItemCategoryID === item.ID; })[0];

        if (!this.currentItem) {
            this.currentItem = new Itemcategory();
            this.currentItem.ItemCategoryID = 0;
            this.CategoryName = '';
            this.CategoryCode = '';
            this.selectedID = 0;
        } else {
            this.CategoryName = this.currentItem.CategoryName;
            this.CategoryCode = this.currentItem.CategoryCode;
            this.selectedID = this.currentItem.ItemCategoryID;
            this.ListView = false;
        }
    }

    Delete(me: any = this) {
        this._popup.Confirm('Delete', 'Do you really want to remove this Item Category?', function () {
            me.IsLoaded = true;
            me._itemCategoryService.remove(me.currentItem.ItemCategoryID)
                .subscribe(
                    result => {
                        if (result.data == "Deleted") {
                            me.mode = 'Delete';
                            me.refreshTree(me.directories);
                            //  me.directories.splice(me.directories.indexOf(me.selectDirectory), 1);
                        } else {
                            //me._popup.Alert('Alert', result.data);
                            this._util.success(result.data, "Success");
                        }
                    },
                    error => me.errorMessage = <any>error);
        }, me.onCancelPopup);
    }

    refreshTree2() {
        if (this.mode == 'Add') {
            this.selectDirectory.ChildNodes.push(new Directory(this.currentItem.ItemCategoryID, false, this.currentItem.CategoryCode, this.currentItem.CategoryName, []));
            this.selectDirectory.HasChildren = true;
            this.selectDirectory.expanded = true;

        } else if (this.mode == 'Delete') {
            ////  this.selectDirectory.ParentNodes
            var index = this.selectDirectory.ParentNode.ChildNodes.indexOf(this.selectDirectory);
            this.selectDirectory.ParentNode.ChildNodes.splice(index, 1);
            // this.selectDirectory.ChildNodes.splice(1);
        }
        else {
            this.selectDirectory.Code = this.currentItem.CategoryCode;
            this.selectDirectory.Name = this.currentItem.CategoryName;
            this.CategoryName = this.selectDirectory.Name;
        }
        this.CategoryCode = '';
        this.selectedID = 0;
        this.ListView = true;
    }

    refreshTree(dirs: any[]) {

        var isMatched = false;
        for (let item of dirs) {
            if (item.ID == this.selectDirectory.ID) {
                if (this.mode == 'Delete') {
                    if (dirs[dirs.indexOf(item)].ChildNodes.length == 1) {
                        dirs[dirs.indexOf(item)].HasChildren = false;
                        dirs[dirs.indexOf(item)].expanded = false;
                    }
                    dirs.splice(dirs.indexOf(item), 1);
                    this.currentItem.ItemCategoryID = 0;

                }
                else {
                    item.Code = this.currentItem.CategoryCode;
                    item.Name = this.currentItem.CategoryName;
                    this.CategoryName = item.Name;
                    this.CategoryCode = '';
                    this.selectedID = 0;
                }
                isMatched = true;
                this.ListView = true;
                break;
            }
            if (!isMatched && item.HasChildren) {
                this.refreshTree(item.ChildNodes);
            }
        }
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, Module).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = returnvalue[0].map(function (item) {
                    return item['FunctionName'];
                });
                var context = localpermission.filter(function (data) { return data.FunctionName != 'Access' });
                if (context.length == 0) {
                    this.isContextMenu = false;
                }
               
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });

                if (this.LocalAccess.indexOf("View") == -1) {
                    this.ActionList = this.ActionList.filter(function (data) { return data.html.toString().trim() != '(item) => `Edit`' });
                }
                if (this.LocalAccess.indexOf("Add") == -1) {
                    this.ActionList = this.ActionList.filter(function (data) { return data.html.toString().trim() != '(item) => `Add`' });
                }
                if (this.LocalAccess.indexOf("Delete") == -1) {
                    this.ActionList = this.ActionList.filter(function (data) { return data.html.toString().trim() != '(item) => `Delete`' });
                }

            }
        )
    }

    Cancel() {
        this.ListView = true;
        //  this.MakeTreeView()
    }
}
//bootstrap(MyDemoApp);