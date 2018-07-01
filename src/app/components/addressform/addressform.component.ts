import { Component, Input, forwardRef, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressValidator } from './addressvalidator.service';
import { StorageService } from '../../services/storage.service'
import * as _ from "lodash";

@Component({
    selector: 'addressform',
    templateUrl: './addressform.component.html',
    inputs: ['address'],
    outputs: ['change'],
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

    value: boolean;
    countries = [];
    regions = [];
    change = new EventEmitter();
    form = this._fb.group({});

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor(
                    public _storageService: StorageService,
                    public _fb: FormBuilder
                ) { }

    //  register form element events
    registerOnChange(fn) {
        console.log('registerOnChange happened');
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        console.log('registerOnTouched happened');
        this.onTouched = fn;
    }

    writeValue(value) {
        console.log('writeValue happened');
        //        this.value = value
    }

    ngOnInit() {
        this.countries = <any>this._storageService.sortArray(this._storageService.values.countries, 'nameeng');
        for(let t in this.countries) {
            if (!this.countries[t].selectable_address) { this.countries.splice(Number(t), 1); } 
        }

        this.updateCountry();
    }

    updateCountry() {
        let currentCountry = _.filter(this._storageService.values.countries, { id: this.form.value.country });
        this.regions = currentCountry['regions'] ? currentCountry['regions'] : null;

        // country: [0],
        // region: [0],
        // locality: [''],
        // postalcode: [''],
        // address_1: [''],
        // address_2: [''],
        // address_3: [''],
        // apartment: ['']
    
    }

    click() {
        this.value = !this.value;
        this.change.emit({ changed: true, checked: this.value });
        this.onChange(this.value);
        this.onTouched();
    }
}
