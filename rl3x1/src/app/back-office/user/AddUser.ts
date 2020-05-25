import { Component, ViewChild, EventEmitter, Output,Input } from '@angular/core';
import { UserService } from './User.Service.js';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { User } from './User.model';
import { Country, State, Language } from '../../shared/common.model';
//import { DataService } from '../../scripts/sharedservice';
import { Tabs } from '../../controls/tabs/tabs.component';
import { Tab } from '../../controls/tabs/tab.component';
//import { Partners } from '../Partner/partnergrid.component';
import { Property, Util } from '../../app.util'; 
import { BsModalComponent } from 'ng2-bs3-modal'
import { CommonService } from '../../shared/common.service';
import { message } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
var intlTelInput = require('../../../Assets/js/intlTelInput.js');

import { DefaultPartnerComponent } from './defaultpartner.component';
import { SidebarService } from '../sidebar/sidebar.service.js';

declare var $: any;
@Component({
    selector: 'UserAdd',
    //styles: ['>>> .modal-xl { width: 400px; }'],
    //styles: ['>>> .modal-xl { width: 60%; }'],
    providers: [UserService, CommonService],
    templateUrl: './AddUser.html'    
})

export class AddUser extends Property{
    //@ViewChild('childComponent') _partnerpopup: Partners;
    @ViewChild('childComponent') _partnerpopup;
    @Output() EditorVisibilityChange = new EventEmitter();    
    @Input("selectedId") userId: number;
    @Input("permission") permission: boolean;
    @Input() GridType: string;
    @Input("Scope") Scope: string;
    @ViewChild('changePassword')
    modal: BsModalComponent;
    @ViewChild('userGridPopUp')
    modalPartner: BsModalComponent;

    users: Observable<User[]>;
    userlist: User[];
    countryList: Country[];
    stateList: State[];
    languageList: Language[];
    AllPartnerCollection: any;
    AllRoleCollection: any;
    UserRoleCollection: any;
    AvailableUsers: any;
    singleUser: User = new User();
    localize: any;
    //userId: number;
    dataSource: any;
    //userTypeList: any;
    gridOptions: GridOptions;
    errorMessage: string;
    currentTab: string;
    selectedCountryId: number;
    selectedRoles: any;
    isCancel = false;
    IsLoaded: boolean;
    UserGridPopup: boolean = false;
    setUserGridType: string = "userpopup";
    partnerType: string = "PTR001";
    isFirstTimeLoad: boolean = true;
    isSaveClick: boolean = false;
    countrycodes: any = [];
    userInitials = [
        { InitialID: 1, InitialIName: 'Mr.' },
        { InitialID: 2, InitialIName: 'Ms.' }
    ];
    UserType: any;
    //UserType = [
    //    { Scope: "PTR001", UserType: 'Internal' },
    //    { Scope: "PTR004", UserType: 'External' }
    //];
    SelectedUserType: string = "";
    IsShowAssignButton: boolean = false;

    pwdchangeData = {
        modalShown: false,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        userId: 0
    };

    usergridOptions: GridOptions;
    usercolumnDefs = [
        { headerName: 'Code', field: "PartnerCode", width: 150, },
        { headerName: 'Name', field: "PartnerName", width: 250 },
        { headerName: 'Type', field: "PartnerType", width: 100 },
        { headerName: 'Default', field: "isDefault", width: 100, cellRendererFramework: DefaultPartnerComponent },
        {
            headerName: 'Action', field: "Action", width: 70,
            cellRenderer: function (params: any) {
                return '<div class="ngCellText ng-scope col2 colt2" class="col.colIndex()" ><button Id="delete_item" class="btn btn-danger btn-sm"><i Id="deleteitem" class="fa fa-trash"></i></button></div>'
            }
        },
        { headerName: 'PID', field: "PartnerID", width: 0, hide: true}
    ];

    rolegridOptions: GridOptions;
    rolecolumnDefs = [
        {
            headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
            suppressMenu: true, pinned: true
        },

        //{ headerName: 'Role ID', field: "RoleID", width: 100 },
        { headerName: 'Role Name', field: "RoleName", width: 250 }
    ];

    constructor(private _util:Util, private _menu:SidebarService,
        private userService: UserService, private _router: Router, private activateRoute: ActivatedRoute, private _globalService: GlobalVariableService, private commonService: CommonService) {
        super()
        //this.moduleTitle = _globalService.getModuleTitle(activateRoute.snapshot.parent.url[0].path); 
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        this.currentTab = "role.html";
        this.selectedCountryId = 0;
        this.errorMessage = "";
        this.AllPartnerCollection = [];
        this.AllRoleCollection = [];
        this.UserRoleCollection = [];
        this.AvailableUsers = [];

        this.usergridOptions = {
            rowData: this.AllPartnerCollection,
            columnDefs: this.usercolumnDefs,
            enableColResize: true,
            enableServerSideSorting: false,
            //enableServerSideFilter: false,
            rowSelection: 'single'
        };

        this.rolegridOptions = {
            rowData: this.AllRoleCollection,
            columnDefs: this.rolecolumnDefs,
            enableColResize: true,
            rowSelection: 'multiple'
        };      
        
    }

    //ngAfterViewInit() {
    //    this._partnerpopup = Partners;
    //}
    //ngOnInit() {
    //    this.userInit();
    //}
    ngOnInit() {  

        //this.userService.GetUserType().subscribe(result => {            
        //    this.UserType = result.recordsets[0];
        //});             

        //this.userService.loadCountries().subscribe(country => {
        //    this.countryList = country;
        //});

        //this.userService.loadStates(this.selectedCountryId).subscribe(state => {
        //    this.stateList = state;
        //});

        this.commonService.getAllLanguages().subscribe(result => {
            this.languageList = result;
        }, error => this.errorMessage = <any>error);
       
        
        var me = this;
        this.commonService.loadRoles()
            .subscribe(_roles => {
                me.AllRoleCollection = _roles;
                //this.rolegridOptions.api.setRowData(this.AllRoleCollection);
            },
            error => this.errorMessage = <any>error);

        //this.commonService.loadPartners()
        //    .subscribe(_partners => {
        //        me.AllPartnerCollection = _partners;
        //        me.InitPartnerUserRole();
        //    },
        //    error => this.errorMessage = <any>error);      

            this.userService.load(this.userId).subscribe(u => {
                
                if (this.userId != 0) {
                    this.singleUser.UserID = u.recordsets[0][0].UserID;
                    this.singleUser.TenantID = u.recordsets[0][0].TenantID;
                    this.singleUser.Initials = u.recordsets[0][0].Initials;
                    this.singleUser.FirstName = u.recordsets[0][0].FirstName;
                    this.singleUser.MiddleName = u.recordsets[0][0].MiddleName;
                    this.singleUser.LastName = u.recordsets[0][0].LastName;
                    this.singleUser.Email = u.recordsets[0][0].Email;
                    this.singleUser.CellNumber = u.recordsets[0][0].CellNumber;
                    this.singleUser.UserName = u.recordsets[0][0].UserName;
                    this.singleUser.Password = u.recordsets[0][0].Password;
                    this.singleUser.Address1 = u.recordsets[0][0].Address1;
                    this.singleUser.Address2 = u.recordsets[0][0].Address2;
                    this.singleUser.City = u.recordsets[0][0].City;
                    this.singleUser.StateID = u.recordsets[0][0].StateID;
                    //this.singleUser.CountryID = u.recordsets[0][0].CountryID;
                    this.singleUser.ZipCode = u.recordsets[0][0].ZipCode;
                    this.singleUser.FixedLineNumber = u.recordsets[0][0].FixedLineNumber;
                    this.singleUser.UserImage = u.recordsets[0][0].UserImage == null || u.recordsets[0][0].UserImage == "" ? "assets/img/noimage.png" : u.recordsets[0][0].UserImage;
                    this.singleUser.UserType = u.recordsets[0][0].UserType;
                    this.singleUser.LanguageID = u.recordsets[0][0].LanguageID;
                    this.singleUser.TeleCode = u.recordsets[0][0].TeleCode;
                    this.singleUser.CountryID = u.recordsets[1][0].CountryID;
                    this.onCountryChange(this.singleUser.CountryID);
                    this.singleUser.Scope = u.recordsets[0][0].Scope;

                    this.ChangeUserType();
                }
                else {
                    //this.singleUser = new User();
                    this.singleUser.UserID = 0;
                    this.singleUser.TenantID = 0;
                    //this.singleUser.Initials = "";
                    this.singleUser.FirstName = "";
                    this.singleUser.MiddleName = "";
                    this.singleUser.LastName = "";
                    this.singleUser.Email = "";
                    this.singleUser.CellNumber = "";
                    this.singleUser.UserName = "";
                    this.singleUser.Password = "";
                    this.singleUser.Address1 = "";
                    this.singleUser.Address2 = "";
                    this.singleUser.City = "";
                    //this.singleUser.StateID = "0";
                    //this.singleUser.CountryID = "0";
                    this.singleUser.ZipCode = "";
                    this.singleUser.FixedLineNumber = "";
                    this.singleUser.UserImage = "assets/img/noimage.png";
                    this.singleUser.UserType = this.Scope;
                    this.singleUser.Scope = this.Scope;                    
                }
                //this.singleUser.Scope = this.Scope;
                var localize = JSON.parse(u.recordsets[1][0].ColumnDefinitions);
                var node_editor = localize.map(function (e) {
                    return '"' + e.field + '": {"headerName": "' + e.headerName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ' }';
                });
                this.e_localize = JSON.parse("{" + node_editor.join(',') + "}");
                this.countrycodes = u.recordsets[3];
                this.IsLoaded = true;
                var me: any = this;
                setTimeout(() => {
                    var partnerinfo = this._globalService.getItem('partnerinfo')[0];
                    var CellNumbers = [{ "mask": "##########" }, { "mask": "##########"}];
                    $("#mobile-number").intlTelInput();

                    if (me.singleUser.TeleCode != null) {

                        var cName = me.getObjects(intlTelInput.countries, 'calling-code', me.singleUser.TeleCode.trim());
                       
                        if (cName.length > 0) {
                            $(".country").each(function () {
                                //alert($(this).attr("data-dial-code"));
                                if (me.singleUser.TeleCode.trim() == $(this).attr("data-dial-code")) {
                                    $(this).click();
                                }
                            });
                        }
                    }

                });
            }, error=> this._util.error(error, 'error'));

          
    }
    ChangeUserType() {
        if (this.singleUser.Scope == "PTR001") {
            this.SelectedUserType = "Facility";
            this.IsShowAssignButton = true;
        }
        else if (this.singleUser.Scope == "PTR004") {
            this.SelectedUserType = "Account";
            this.IsShowAssignButton = true;
        }
        else {
            this.SelectedUserType = "";
            this.IsShowAssignButton = false;
        }

    }
    getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }

        return objects;
    }
    @ViewChild('pop') _popup: message;

    CheckPhoneVal() {
        var cellnumber = $('#CellNumber').val();
        this.singleUser.CellNumber = cellnumber;
    }

    onSubmit(form: any) {

        var CurrentTenantInfo = this._globalService.getItem('CurrentTenantInfo');
        
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

        if (this.singleUser.Scope == "undefined") {
            this._popup.Alert('Alert', 'Please select a user type.');
            return;
        }

        if (this.singleUser.Initials == undefined)
            this.singleUser.Initials = '';
        if (this.singleUser.CountryID == undefined)
            this.singleUser.CountryID = '';
        if (this.singleUser.StateID == undefined)
            this.singleUser.StateID = '';
        if (this.singleUser.LanguageID == undefined)
            this.singleUser.LanguageID = 0;

        this.singleUser.CellNumber = this.singleUser.CellNumber.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

        var telecode = $("#mobile-number").val();
        telecode = telecode.replace('+', '');
        this.singleUser.TeleCode = telecode.trim();

        var me = this;
        this.usergridOptions.api.forEachNode(function (node) {
            var itemtoMove = me.UserRoleCollection.filter(d => d.PartnerID == node.data.PartnerID)[0];

            if (itemtoMove != undefined) {
                itemtoMove.isDefault = node.data.isDefault;
            }
        })

        var userPartners = this.UserRoleCollection.filter(p => p.isDefault == true);
        if (userPartners.length == 0) {
            this._popup.Alert('Alert', 'Please select atleast one default Role.');
            return;
        }

        this.singleUser.UserRoles = JSON.stringify(this.UserRoleCollection);

        let formData: FormData = new FormData();
        if (this.UserImage != undefined) {
            for (let i = 0; i < this.UserImage.length; i++) {
                formData.append('UserImage', this.UserImage[0]);
            }
        }

        this.singleUser.UserImage = 'assets/img/noimage.png';

        for (var key in this.singleUser) {
            if (this.singleUser.hasOwnProperty(key)) {
                formData.append(key, this.singleUser[key]);
                //console.log(key + " -> " + this.singleUser[key]);
            }
        }
        this._globalService.loader(true);
        this.userService.save(formData).subscribe(retvalue => {

            console.log('retValue:',retvalue);

            this._globalService.loader(false);
            this.errorMessage = "";
            var errMsg = "";
            
            if (retvalue.result == "Updated") {
                errMsg = "User saved successfully."
                //this.EditorVisibilityChange.emit(true);
                //alert(this.errorMessage);
                //this._router.navigate(['usergrid']);
            }
            else if (retvalue.result == "Added") {
                errMsg = "User added successfully."
                //this.EditorVisibilityChange.emit(true);
                //alert(this.errorMessage);
                //this._router.navigate(['usergrid']);

            }
            else if (retvalue.result == "Duplicated") {
                errMsg = "User Name/Email/Mobile mached with existing user. Please enter unique information."
                this._popup.Alert('Alert', errMsg);
                return;
            }
            else if (retvalue.result == "UserExceed") {
                errMsg = "Your user limit is " + CurrentTenantInfo.NoOfUser + " user. Please contact <a href='mailto: rl3demo@reverselogix.com'>rl3demo@reverselogix.com </a> to upgrade user license.";
                //this._popup.Alert('Alert', errMsg);
                this._util.info(errMsg, "Alert", null);
                return;
            }
            else {
                errMsg = "System error generated at this moment. Please contact system administrator."
                this._popup.Alert('Alert', errMsg);
                return;
            }
            var me = this;
            this._popup.Alert('Alert', errMsg, function () { me.EditorVisibilityChange.emit(true);});
            return;

        }, error => this._util.error(error, 'error'));

        
        //if (this.userId == 0)
        //{
        //    this.userService.create(this.singleUser).subscribe(retvalue => {
        //        this.errorMessage = retvalue[0];
        //    }, error => console.log('Some error occured while adding new user.'));
        //    alert(this.errorMessage);
        //}
        //else
        //{
        //    this.userService.update(this.singleUser).subscribe(retvalue => {
        //        this.errorMessage = retvalue[0];
        //    }, error => console.log('Some error occured while updating user.'));
        //    alert(this.errorMessage);
        //}
        
    }

    CancelUser() {
        this.EditorVisibilityChange.emit(false);
    }

    OpenChangePassword() {
        this.pwdchangeData.newPassword = "";
        this.pwdchangeData.oldPassword = "";
        this.pwdchangeData.confirmPassword = "";
        this.modal.open();
    }

    close() {
        this.modal.close();
    }

    ChangePassword() {
        
        this.pwdchangeData.userId = this.userId;
        this.userService.ChangePassword(this.pwdchangeData).subscribe(returnvalue => {
            //this.CancelNodeMaster();
            if (returnvalue.result == "Success") {
                //alert("Password changed successfully.");
                this._popup.Alert('Alert', 'Password changed successfully.');
                this.modal.close();
            }
            else {
                //alert("System error generated.");
                this._popup.Alert('Alert', 'System error generated.');
            }
        }, error => this._util.error(error, 'error'));
    }

    onCountryChange(countryValue) {
        this.selectedCountryId = countryValue;
        this.userService.loadStates(this.selectedCountryId).subscribe(state => {
            this.stateList = state;
        });
    }

    InitPartnerUserRole() {

        this.userService.loadUserRoleMapping(this.userId)
            .subscribe(_userrole => {

                this.UserRoleCollection = _userrole.recordsets;

                var userscoll = $.map(this.UserRoleCollection, function (n, i) {
                    return { PartnerID: n.PartnerID, isDefault: n.isDefault };
                });
                var users = $.map(userscoll, function (n, i) {
                    return n.PartnerID;
                });

                this.AvailableUsers = JSON.parse(JSON.stringify($.grep(this.AllPartnerCollection, function (n, i) {
                      //return ($.inArray(n.PartnerID, users) != -1);
                    if ($.inArray(n.PartnerID, users) != -1) {
                        var item = userscoll.filter(u => u.PartnerID == n.PartnerID)[0];
                        if (item != undefined) {
                            n.isDefault = item.isDefault;
                        }
                        return n;
                    }
                })));

                this.usergridOptions.api.setRowData(this.AvailableUsers);

                if (this.AvailableUsers.length != 0) {

                    this.rolegridOptions.api.setRowData(this.AllRoleCollection);

                    this.usergridOptions.api.forEachNode(function (node) {
                        if (node.childIndex === 0) {
                            node.setSelected(true);
                        }
                    });
                }
                else {
                    this.rolegridOptions.api.setRowData([]);
                }

            },
            error => this.errorMessage = <any>error);
    }

    onSelectedUserChanged() {
       
         //this.params.column.gridOptionsWrapper.gridOptions.api.forEachNode(function (node) {
        //    if (me.params.node.rowIndex != node.rowIndex) { //node.data.isDefault
        //        node.data.isDefault = false;
        //    }
        //});
        //if (this.isFirstTimeLoad) {
        //    this.usergridOptions.api.selectIndex(0, true, false);
        //}
        //else {
            this.rolegridOptions.api.deselectAll();
        //}

        let data = this.usergridOptions.api.getSelectedRows()[0];

        //this.usergridOptions.api.forEachNode(function (node) {
        //    if (data.PartnerID != node.data.PartnerID) {
        //        node.data.isDefault = false;
        //    }
        //})

        if (data.PartnerType == "Facility") {
            var UserRole = this.AllRoleCollection.filter(r => r.UserType == "PTR001");
            this.rolegridOptions.api.setRowData(UserRole);
        }
        else if (data.PartnerType == "Account") {
            var UserRole = this.AllRoleCollection.filter(r => r.UserType == "PTR004");
            this.rolegridOptions.api.setRowData(UserRole);
        }     

        var roles = this.UserRoleCollection.filter(ur => ur.PartnerID == data.PartnerID).map(function (e) {
            return e.RoleID;
        })

        this.rolegridOptions.api.forEachNode(function (node) {
            if ($.inArray(node.data.RoleID, roles) > -1) {
                node.setSelected(true);
            }
            else {
                node.setSelected(false);
            }
        })
    }

    onRoleSelectionChanged(e) {

        var selectedRoles = this.rolegridOptions.api.getSelectedRows();
        var selectedUser = this.usergridOptions.api.getSelectedRows()[0];

        var selectedRoleIds = [];
        var dselectedNodes = [];

        if (selectedUser != undefined && selectedRoles.length != 0) {

            for (let row of selectedRoles) {
                if (row != undefined) {
                    var itemtoMove = this.UserRoleCollection.filter(d => d.RoleID == row.RoleID && d.PartnerID == selectedUser.PartnerID)[0];
                    var ind = this.UserRoleCollection.map(function (e) { return e; }).indexOf(itemtoMove);

                    if (itemtoMove == undefined) {
                        let newItem = { PartnerID: selectedUser.PartnerID, RoleID: row.RoleID, isDefault: selectedUser.isDefault };
                        this.UserRoleCollection.push(newItem);
                        //this.UserRoleCollection.splice(ind, 1);
                    }
                    else {
                        itemtoMove.isDefault = selectedUser.isDefault;
                    }
                    selectedRoleIds.push(row.RoleID);
                }
            }

            this.rolegridOptions.api.forEachNode(function (node) {
                if ($.inArray(node.data.RoleID, selectedRoleIds) == -1) {
                    let newItem = { PartnerID: selectedUser.PartnerID, RoleID: node.data.RoleID, isDefault: selectedUser.isDefault };
                    dselectedNodes.push(newItem);
                }

            })

            for (let n of dselectedNodes) {
                var itemtoMove = this.UserRoleCollection.filter(d => d.RoleID == n.RoleID && d.PartnerID == selectedUser.PartnerID)[0];
                var ind = this.UserRoleCollection.map(function (e) { return e; }).indexOf(itemtoMove);
                if (itemtoMove != undefined) {
                    this.UserRoleCollection.splice(ind, 1);
                }
            }
        }
    }
      
    openGridPopup() {
        var me: any = this;

        me.UserGridPopup = true;
        me.partnerType = this.singleUser.Scope;
        if (me._partnerpopup != undefined) {
            me._partnerpopup.onPartnerTypeChanged(me.partnerType);
            me.modalPartner.open();
        }
    }    

    UserGridEvent(event) {
        var me = this;
        this.modalPartner.close();
        this.UserGridPopup = false;
        var msg: string = "";

        $.each(event, function (i, v) {

            var users = [];
            if (me.AvailableUsers.length != 0) {
                users = me.AvailableUsers.filter(u => u.PartnerID == v.PartnerID);
            }
                      
            if (users.length > 0) {
                msg = msg + v.PartnerName + ", ";
                //me._popup.Alert('Alert', 'Same Reason already exists.');
            }
            else {
                me.AvailableUsers.push({
                    PartnerID: v.PartnerID,
                    PartnerCode: v.PartnerCode,
                    PartnerName: v.PartnerName,
                    PartnerType: v.Type,
                    isDefault: 0
                });
            }
        });

        if (msg.length > 0) {
            me._popup.Alert('Alert', msg + " already exists.");
        }

        if (me.usergridOptions.api)
            me.usergridOptions.api.setRowData(me.AvailableUsers);

        if (this.AvailableUsers.length != 0) {

            var UserRole = this.AllRoleCollection.filter(r => r.UserType == this.singleUser.Scope);

            //this.rolegridOptions.api.setRowData(this.AllRoleCollection);
            this.rolegridOptions.api.setRowData(UserRole);

            this.usergridOptions.api.forEachNode(function (node) {
                if (node.childIndex === 0) {
                    node.setSelected(true);
                }
            });
        }
        else {
            this.rolegridOptions.api.setRowData([]);
        }
       

        //var users = this.AvailableUsers.filter(u => u.PartnerID == event.PartnerID);
        //if (users.length > 0) {
        //    this._popup.Alert('Alert', 'Same Facility/Account already exists.');            
        //}
        //else {
        //    this.AvailableUsers.push({
        //        PartnerID: event.PartnerID,
        //        PartnerCode: event.PartnerCode,
        //        PartnerName: event.PartnerName,
        //        PartnerType: event.Type,
        //        isDefault: 0
        //    });

        //    this.usergridOptions.api.setRowData(this.AvailableUsers);

        //    if (this.AvailableUsers.length != 0) {
                                
        //        var UserRole = this.AllRoleCollection.filter(r => r.UserType == this.singleUser.Scope);

        //        //this.rolegridOptions.api.setRowData(this.AllRoleCollection);
        //        this.rolegridOptions.api.setRowData(UserRole);

        //        this.usergridOptions.api.forEachNode(function (node) {
        //            if (node.childIndex === 0) {
        //                node.setSelected(true);
        //            }
        //        });
        //    }
        //    else {
        //        this.rolegridOptions.api.setRowData([]);
        //    }
        //}
    }

    DeleteItem(e) {
        if (e.event.target != undefined) {
            
            let actionType = e.event.target.getAttribute("Id");

            if (actionType == "deleteitem") {
                let itemToDelete = e.data;
                if (itemToDelete.isDefault == true) {
                    this._popup.Alert('Alert', 'Default Facility/Account cannot be deleted.');
                }
                else {
                    var idx = this.AvailableUsers.indexOf(itemToDelete);
                    this.AvailableUsers.splice(idx, 1);
                    this.usergridOptions.api.setRowData(this.AvailableUsers);

                    var itemstoMove = this.UserRoleCollection.filter(d => d.PartnerID == itemToDelete.PartnerID);
                    for (let item of itemstoMove) {
                        var ind = this.UserRoleCollection.indexOf(item);
                        if (ind > -1) {
                            this.UserRoleCollection.splice(ind, 1);
                        }
                    }

                    if (this.AvailableUsers.length != 0) {

                        this.usergridOptions.api.forEachNode(function (node) {
                            if (node.childIndex === 0) {
                                node.setSelected(true);
                            }
                        });
                    }
                    else {
                        this.rolegridOptions.api.setRowData([]);
                    }
                }
            }
        }
    }

    UserImage: FileList;
    handleInputChange(ctrl, e) {
        var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (file.length > 0) {
            var pattern = /image-*/;
            var reader = new FileReader();
            if (!file[0].type.match(pattern)) {
                alert('invalid format');
                return;
            }

            this.UserImage = file;

            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsDataURL(file[0]);
        }
        else if (file.length == 0) {
            this.singleUser.UserImage = 'assets/img/addimage.png';
        }
    }

    _handleReaderLoaded(e) {
        var reader = e.target;
        this.singleUser.UserImage = reader.result;
    }
}