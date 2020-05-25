import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Rule, ddlItem } from './rule.model.js';
import { CommonService } from '../../shared/common.service'
import { RuleService } from './rule.service';
import { AuthService } from '../../authentication/auth.service';
import { message, modal } from '../../controls/pop/index.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { MetadataService } from '../MetadataConfig/metadata-config.Service.js';
import { Util } from 'src/app/app.util.js';
import { SidebarService } from '../sidebar/sidebar.service.js';
declare var $: any;
@Component({
    selector: 'Rule-editor',
    providers: [RuleService, AuthService, MetadataService, Util],
    templateUrl: './ruleseditor.html'
})


export class RuleEditor {
    @Input("selectedId") SelectedID: number;
    @Input("permission") permission: boolean;
    @Output() EditorVisibilityChange = new EventEmitter();
    CurrentRule: Rule = new Rule();
    formField: [{}];
    moduleTitle: string;
    ruleForm: FormControl;
    ruleEditor: any;
    isSaveClick: boolean = false;
    IsLoaded: boolean;
    @ViewChild('pop') _popup: message;
    TypeLookUpList: any;
    RuleGroupList: any;
    errorMessage: string;
    IsInternalGroup: boolean = false;

    constructor(private _util:Util, private _menu:SidebarService, private _ruleService: RuleService, public commonService: CommonService, private _router: Router, private _globalService: GlobalVariableService, private _route: ActivatedRoute, private _formBuilder: FormBuilder, private _LoginService: AuthService, private _config: MetadataService) {
        this.ruleForm = new FormControl({
        });
        this.IsLoaded = false;
        //this._route.queryParams.subscribe(params => {
        //    this.SelectedCurrencyID = +params['ID'];
        
        //this.moduleTitle = _globalService.getModuleTitle(_route.snapshot.parent.url[0].path);
        this.moduleTitle = this._menu.menus.filter(f=>f.routeKey===this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        //this.partnerID = partnerinfo.LogInUserPartnerID;
        //this.loadPermissionByModule(partnerinfo[0].UserID, partnerinfo[0].LogInUserPartnerID, this.moduleTitle);
    }
    ngOnInit() {
        this.bindTypeLookup();
        this.BindRuleGroup();
        this._ruleService.loadRuleById(this.SelectedID).subscribe(result => {
            this.CurrentRule = this.SelectedID == 0 ? new Rule() : new Rule(result[0][0]);
            if (this.CurrentRule.RuleGroupID == 1826) {
                this.IsInternalGroup = true;
            }
            else {
                this.IsInternalGroup = false;
            }

            var localize = JSON.parse(result[1][0].ColumnDefinations);
            var localeditor = localize.map(function (e) {
                return '"' + e.field + '": {"DisplayName": "' + e.DisplayName + '", "isRequired": ' + e.isRequired + ', "isVisible": ' + e.isVisible + ', "isEnabled": ' + e.isEnabled + ', "width": ' + e.width +' }';
            });
            this.ruleEditor = JSON.parse("{" + localeditor.join(',') + "}");
            if (this.CurrentRule.RuleID == 0) {
                this.CurrentRule.ddlItems = new Array<ddlItem>();
                this.CurrentRule.ddlItems.push(new ddlItem());
            }
            this.IsLoaded = true;
        }
        );
    }

    onGroupChange(deviceValue) {
        this.CurrentRule.RuleGroupID = deviceValue;
        if (deviceValue == 1826)
        {
            this.IsInternalGroup = true;
            this.CurrentRule.UserInput = false;
        }
        else
            this.IsInternalGroup = false;
    }
    onAddMore() {
        this.CurrentRule.ddlItems.push(new ddlItem());
    }
    onRemove(item: ddlItem) {
        let ind: number;
        var ids = $.map(this.CurrentRule.ddlItems, function (v, i) { return v.ID });
        ind = $.inArray(item.ID, ids);
        if (ind > -1) {
            this.CurrentRule.ddlItems.splice(ind, 1);
        }
    }

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
        this.saveRule();
    }

    bindTypeLookup() {
        this._config.getTypeLookUpByGroupName("RuleControl").subscribe(_result => {
            this.TypeLookUpList = _result;
        }, error => this.errorMessage = <any>error);
    }

    BindRuleGroup() {
        this._config.getTypeLookUpByGroupName("RuleGroup").subscribe(_result => {
            this.RuleGroupList = _result;
        }, error => this.errorMessage = <any>error);
    }


    onCancel() {
        this.EditorVisibilityChange.emit(false);
    }

    saveRule() {
        var reg = [{ 'rule': JSON.stringify(this.CurrentRule) }];
        this._ruleService.save(reg).subscribe(returnvalue => {
            var me = this
            this._util.success('Saved successfully.', "Success","Success");
            me.EditorVisibilityChange.emit(true);
        }, error => { this._util.error(error,"Alert") });
    }
}