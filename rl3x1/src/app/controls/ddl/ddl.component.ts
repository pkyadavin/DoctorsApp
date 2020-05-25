import { Component, Input, Output, EventEmitter, AfterContentInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { TypeLookUp } from '../../back-office/Region/typelookup.model';
import { Guid } from "guid-typescript";
@Component({
    selector: 'ddl',
    template: `
     <select #ddlcontrol="ngModel" [ngStyle]="cssStyle" [id]="id" [name]="nameProperty" class="form-control" [(ngModel)]="SelectedItemValue"
            [required]="required"
            [disabled]="disabled">
        <option [value]="nullable" disabled selected>--Select--</option>
        <option [value]="i[ValueProperty]" *ngFor="let i of Source">{{i[DisplayProperty]}}</option>
    </select>
    
  `
})
export class ddl implements AfterContentInit {
    @ViewChild('ddlcontrol') ngModelddl: NgModel;
    @Input('form') setForm: NgForm;
    @Input('controlName') controlName: string;
    @Input('Source') Source: any;
    @Input('cssStyle') cssStyle: any;
    @Input('required') required: boolean;
    @Input('disabled') disabled: boolean;
    @Input('DisplayProperty') DisplayProperty: string;
    @Input('ValueProperty') ValueProperty: string;
    @Output('change') onChange = new EventEmitter(); 

    @Input('nameProperty') nameProperty: string='ddlcontrol1';

    private _SelectedItem: any;
    id:string;
    nullable:any=null;
    @Input('ddlModel') get SelectedItem(): any {
        return this._SelectedItem;
    }
    set SelectedItem(lv: any) {
        this._SelectedItem = lv;
        this._SelectedItemValue = this.SelectedItem && this.SelectedItem[this.ValueProperty] || null
    }
    @Output() ddlModelChange: EventEmitter<any> = new EventEmitter();

    @Input() strVal: any;
    @Output() strValChange: EventEmitter<any> = new EventEmitter();

    private _SelectedItemValue: any;
    get SelectedItemValue(): any {
        return this._SelectedItemValue;
    }
    set SelectedItemValue(lv: any) {
        this._SelectedItemValue = lv;
        this.SelectedItem = this.Source.filter(f => f[this.ValueProperty] == lv)[0];
        this.onChange.emit();
        this.strValChange.emit(this._SelectedItemValue);
        this.ddlModelChange.emit(this.SelectedItem);        
    }

    ngAfterContentInit() {
        this._SelectedItemValue = this.SelectedItem && this.SelectedItem[this.ValueProperty] || null;
        this.id=Guid.create().toString();
    }
    ngAfterViewInit() {
        this.setForm.control.addControl(this.controlName, this.ngModelddl.control);
    }
}

