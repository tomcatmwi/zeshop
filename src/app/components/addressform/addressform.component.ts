import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { FormBuilder } from '@angular/forms';
import { StorageService } from '../../services/storage.service'
import { JSONService } from '../../services/json.service'
import { SpinnerComponent } from '../spinner/spinner.component';

import * as _ from "lodash";

@Component({
    selector: 'addressform',
    templateUrl: './addressform.component.html',
    styleUrls: ['./addressform.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressFormComponent),
            multi: true
        }
    ]
})
export class AddressFormComponent implements ControlValueAccessor, OnInit {

    value;
    countries = [];
    currentCountry;
    loading = false;

    //  this object sets which fields should be visible in the form
    //  0 - field not used
    //  1 - field is used, but not mandatory
    //  2 - field is mandatory

    activeFields = {
        locality: 0,
        postalcode: 0,
        address1: 0,
        address2: 0,
        address3: 0
    }
    form = this._fb.group({});

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor(
        public _storageService: StorageService,
        public _jsonService: JSONService,
        public _fb: FormBuilder
    ) { }

    //  register form element events
    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue() {

        //  generate output

        let output = this.form.value;
        _.forEach(this.activeFields, (value, key) => {
            if (value == 0) { delete output[key] }
        });

        //  check for errors, set form value to blank if there is any

        _.forEach(this.form.controls, e => {
            if (e.invalid) output = null;
        });

        this.value = output;
    }

    ngOnInit() {
        this.loading = true;
        this.countries = <any>this._storageService.sortArray(this._storageService.values.countries, 'nameeng');
        for (let t in this.countries) {
            if (!this.countries[t].selectable_address) { this.countries.splice(Number(t), 1); }
        }

        this.form = this._fb.group({
            country: [this._storageService.values.default_country],
            region: [''],
            locality: [''],
            postalcode: [''],
            address1: [''],
            address2: [''],
            address3: [''],
            apartment: ['']
        });

        this.changeCountry(true);
    }

    changeCountry(init = false) {

        this.loading = true;

        //  find current country (or default country)
        this.currentCountry = this.form.value.country ? _.filter(this._storageService.values.countries, { id: this.form.value.country })[0] : _.filter(this._storageService.values.countries, { id: this._storageService.values.default_country })[0];

        //  if the current country has regions, fill up the array controlling the dropdown and display it
        //  if not, hide the dropdown
        if (this.currentCountry.regions) {
            this.form.patchValue({
                country: this.currentCountry.id,
                region: this.currentCountry.regions[0].id
            });
        }

        //  get address format for the current country from the backend
        const temp = this._jsonService.getJSON('/getaddressformat/' + this.currentCountry['id'])
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                if (data.result === 'success') {

                    //  set each address field depending whether needed or not
                    _.forEach(this.activeFields, (value, key) => {
                        this.activeFields[key] = 0;
                    });

                    data.data.fields.forEach(e => {
                        if (typeof this.activeFields[e.fieldname] != 'undefined') {
                            this.activeFields[e.fieldname] = e.mandatory ? 2 : 1;
                        }
                    });

                    //  set form validators

                    _.forEach(this.activeFields, (value, key) => {
                        this.form.controls[key].setValidators([AddressValidator.checkAddressField(value)]);
                    });

                    if (!init)
                        this.addressChange();
                    this.loading = false;

                } else {
                    console.log('Ez szar.');
                    this.loading = false;
                }
            },
                () => {
                    console.log('Qvára nincs szerver.');
                    this.loading = false;
                });
    }

    addressChange() {

        this.writeValue();

        //  emit value

        this.onChange(this.value);
        this.onTouched();
    }

}

//  form validator

export class AddressValidator {
    static checkAddressField(method: Number) {
        return (control: FormControl) => {
            if (method == 2 && (!control.value || control.value.length < 1))
                return { 'checkField': false, 'errorMsg': 'This field is mandatory.' }
            else
                return null
        }
    }
}
