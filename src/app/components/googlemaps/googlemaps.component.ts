import {Component, NgZone, ChangeDetectorRef, forwardRef, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {GoogleMapsService} from './googlemaps.service'

@Component({
    selector: 'googlemaps',
    templateUrl: 'googlemaps.component.html',
    inputs: ['locationTypes'],
    providers: [
        GoogleMapsService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GoogleMapsComponent),
            multi: true
        }
    ],
})

export class GoogleMapsComponent implements ControlValueAccessor, OnInit {

    currentLocation = { name: '', place_id: '' };
    locationList = [];
    locationForm: FormGroup;
    loading = false;
    hasFocus = false;
    googleMapsSubscribe;
    locationTypes = 'geocode';

    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(
        public _fb: FormBuilder,
        public _ref: ChangeDetectorRef,
        public _googleMapsService: GoogleMapsService,
        public ngZone: NgZone

    ) {

        this.locationForm = _fb.group({
            location: []
        });
    }
    
    ngOnDestroy() {
        this.googleMapsSubscribe.unsubscribe();
    }
    
    ngOnInit() {

        this.googleMapsSubscribe = 
            this.locationForm.controls['location']
            .valueChanges
            .filter(data => data && data.length >= 3)
            .distinctUntilChanged()
            .subscribe(input => {
                this.loading = true;
                this._googleMapsService.getAutoComplete({input: input, types: [this.locationTypes]})
                    .timeout(2000)
                    .subscribe(data => {
                        this.locationList = data.predictions;
                        this.loading = false;
                    }, error => {
                        this.locationList = [];
                        this.loading = false;
                    },
                    () => {
                        
                        //  if the current value was not selected from locationList,
                        //  then the place_id value should be an empty string
                        
                        var picked = false;
                        
                        for (var t in this.locationList)
                            if (this.locationList[t].description == this.currentLocation.name) picked = true;
                            
                        if (!picked) {
                            this.currentLocation.place_id = '';
                        } else {
                            this.locationList = [];
                            this.locationList = [];
                        }
                        this.ngZone.run(() => { this._ref.detectChanges(); });
                        
                        
                        this.onChange(this.currentLocation);
                        this.loading = false;
                    })
            });
    }

//  onBlur delays the setting of the onTouched flag with 400 millisecond.
//  Otherwise it would trigger an error message when the user clicks a city.
//  If the form regains focus within 200 milliseconds, touched doesn't trigger.    
        
    onBlur() {
        this.hasFocus = false;
        this.onChange(this.currentLocation);
        setTimeout(() => {
            if (!this.hasFocus) this.onTouched();
        }, 400)
    }

    onFocus() {
        this.hasFocus = true;
    }

    changeLocation(location) {
        this.currentLocation.name = location.description;
        this.currentLocation.place_id = location.place_id;
        this.onChange(this.currentLocation);
        this.onTouched();
        this.loading = false;
        this.ngZone.run(() => { this._ref.detectChanges(); });
}

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(location) {

        if (location && location.name && location.place_id) {
            this.locationForm.controls['location'].setValue(location.name);
            this.currentLocation.name = location.name;
            this.currentLocation.place_id = location.place_id;
        } else {
            this.locationForm.controls['location'].setValue('');
            this.currentLocation.name = '';
            this.currentLocation.place_id = '';
        }
        this.onChange(this.currentLocation);
        this.onTouched();
        this.loading = false;
    };

}