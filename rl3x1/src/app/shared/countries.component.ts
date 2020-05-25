import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CountriesService } from './Countries.Service.js';
import { Observable } from 'rxjs/Observable';
import { FormsModule, FormBuilder, Validators, NgForm } from '@angular/forms';
import { FormControl, FormGroup, NgModel } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Countries } from './Countries.model.js';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
    selector: 'Countries',
    providers: [CountriesService],
    template: '<select #country="ngModel" name="country" [(ngModel)]="countryID" class="form-control" (change)="onCountryChange($event.target.value)" [required]="setRequiredCountry"> <option [value]="undefined" disabled="disabled">--Select Country--</option><option *ngFor="let c of countriesList" [value]="c.CountryID">{{c.CountryName }}</option></select>'
})

export class AllCountries {
    countriesList: any;
    selectedCountryID: number;
    @Output() countryIDChange = new EventEmitter();
    @Input('form') setForm: NgForm;
    @Input() setRequiredCountry: boolean = false;
    @Input()
    get countryID() {
        return this.selectedCountryID;
    }

    set countryID(val) {
        this.selectedCountryID = val;
        this.countryIDChange.emit(this.selectedCountryID);
    }
    constructor(
        private countriesService: CountriesService, private _router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder) {
    };

    @ViewChild('country') ngModelCountry: NgModel;

    ngAfterViewInit() {
        this.setForm.control.addControl('CountryField', this.ngModelCountry.control);
    }

    ngOnInit() {
        this.countriesService.loadCountries().subscribe(types => {
            this.countriesList = types;
        });
    }

    onCountryChange(typeValue) {
        this.countryID = typeValue;
    }
}
