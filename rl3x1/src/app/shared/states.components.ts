import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { StatesService } from './States.Service.js';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators, NgModel } from '@angular/forms';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { State } from './states.model';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'States',
    providers: [StatesService],
    template: '<select #state="ngModel" name="state" [(ngModel)]="stateID" class="form-control" (change)="onStateChange($event.target.value)" [required]="setRequiredState"><option [value]="undefined" disabled="disabled">--Select State--</option><option *ngFor="let s of stateList" [value]="s.StateID">{{s.StateName }}</option></select>'
})

export class AllStates {
    stateList: any;
    selectedStateID = 0;
    @Output() stateIDChange = new EventEmitter();
    @Input('form') setForm: NgForm;
    @Input() setRequiredState: boolean = false;
    @Input() setCountryID: number;

    @Input()
    get stateID() {
        return this.selectedStateID;
    }
    set stateID(val) {
        this.selectedStateID = val;
        this.stateIDChange.emit(this.selectedStateID);
    }
    constructor(
        private _stateService: StatesService, private _router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder) {
    };

    @ViewChild('state') ngModelState: NgModel;
    ngAfterViewInit() {
        this.setForm.control.addControl('StateField', this.ngModelState.control);
    }

    ngOnInit() {
        this.onBindState(0);
    }

    ngOnChanges() {
        this.onBindState(this.setCountryID);
    }

    onBindState(countryId) {
        if (countryId > 0) {
            this._stateService.loadStates(countryId).subscribe(_result => {
                this.stateList = _result;
            });
        }
        else {
            this.stateList = [{}];
        }
    }

    onStateChange(typeValue) {
        this.stateID = typeValue;
    }
}

