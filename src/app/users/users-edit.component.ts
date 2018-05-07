import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../services/formvalidator.service';
import { JSONService } from '../services/json.service'
import { MD5Service } from '../services/md5.service'
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { StorageService } from '../services/storage.service'

@Component({
    selector: 'users-edit',
    templateUrl: './users-edit.component.html',
    providers: [JSONService, MD5Service]
})

export class UsersEditComponent implements OnInit {

    form: FormGroup;
    serverResponse = { result: '', message: '' };
    loading = false;
    passwordChanged = false;
    confirmBoxData;
    admin = false;

    countries;
    phone_countries;
    states = [];

    pagetitle = 'Add new user';
    buttontext = 'Add user';

    constructor(
        public _fb: FormBuilder,
        public _jsonService: JSONService,
        public _md5Service: MD5Service,
        public _storageService: StorageService,
        public _router: Router,
        public _activatedRoute: ActivatedRoute,
        public _location: Location
    ) { }

    ngOnInit() {

        //  get array values

        this.countries = this._storageService.sortArray(this._storageService.values.countries, 'nameeng');
        this.phone_countries = this._storageService.sortArray(this._storageService.values.countries, 'phonecode');

        //  create form

        this.form = this._fb.group({
            _id: [0, FormValidators.required],
            title: [this._storageService.values.titles[0]],
            firstname: [''],
            middlename: [''],
            lastname: [''],
            email: ['', Validators.compose([FormValidators.required, FormValidators.email])],
            phone_country: ['CA'],
            phone_district: [''],
            phone_number: [''],
            address_country: ['CA'],
            address_state: [this.states[0]],
            address_city: [''],
            address_zip: [''],
            address_1: ['', Validators.compose([FormValidators.required, FormValidators.minLength(5)])],
            address_2: [''],
            address_apt: [''],
            address_instructions: [''],
            username: ['', Validators.compose([FormValidators.required, FormValidators.minLength(5), FormValidators.username])],
            password_1: [''],
            password_2: [''],
            promotions: [true],
            level: [0]
        },
            {
                validator: Validators.compose([
                    FormValidators.validatePhone('phone_district', 'phone_number'),
                    FormValidators.validateName('firstname', 'lastname'),
                    FormValidators.validatePassword('password_1', 'password_2'),
                    FormValidators.validateAddress('address_city', 'address_zip'),
                ])
            });

        this.hasStates();

        //  Show the 'level' field if user level > 1        
        if (Number(localStorage.getItem('user.level')) > 1)
            this.admin = true;

        //  get http parameter
        //  if it's empty, we register a new user
        //  if == "current", then we modify the current user
        //  if it's anything else, we check whether that _id exists

        var temp = this._activatedRoute.params
            .finally(() => { temp.unsubscribe(); })
            .subscribe((data) => {
                this.loading = true;
                var id = '0';
                if (data['id'] == 'current')
                    id = localStorage.getItem('user._id')
                else
                    id = data['id']
                if (!id)
                    id = '0';

                if (id == '0') {
                    this.pagetitle = 'Add new user'
                    this.buttontext = 'Add user';
                    this.loading = false;
                } else {
                    this.pagetitle = 'Modify registration';
                    this.buttontext = 'Modify user';
                }
                //  attempt to load user data id
                //  and if the current user modifies himself or has level > 1

                if (id != '0') {

                    var temp2 = this._jsonService.getJSON('users/' + id)
                        .finally(() => {
                            this.loading = false;
                            temp2.unsubscribe();
                        })
                        .subscribe((data) => {
                            if (data.result == 'error') {
                                this.serverResponse = data;
                                this.loading = false;
                                return false;
                            }

                            for (var key in data.data[0]) {
                                if (this.form.controls[key]) {
                                    this.form.controls[key].setValue(data.data[0][key]);
                                    this.form.controls[key].markAsDirty();
                                }
                            }

                            this.form.controls['password_1'].setValue(data.data[0].password);
                            this.form.controls['password_2'].setValue(data.data[0].password);

                            if (this.hasStates()) {
                                this.form.controls['address_state'].setValue(data.data[0].address_state);
                                this.form.value.address_state = data.data[0].address_state;
                            }
                        },
                        () => {
                            this.serverResponse = {
                                result: 'error',
                                message: 'Unable to load data from the server.'
                            }
                        })
                }
            });

    }

    submitForm() {
        this.loading = true;
        this.serverResponse = null;

        var formData = this.form.value;
        formData.password_1 = this._md5Service.md5(formData.password_1);
        formData.password_2 = this._md5Service.md5(formData.password_2);
        formData.passwordChanged = this.passwordChanged;

        var temp = this._jsonService.postJSON('/users', formData)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.serverResponse = data;
                if (data.result == 'success') {

                    //  if the user just modified himself...
                    if (formData['_id'] != '0' && formData['_id'] == localStorage.getItem('user._id')) {
                        var name = this.form.controls['title'].value + ' ' + this.form.controls['firstname'].value + ' ';
                        if (this.form.controls['middlename'].value != '') name += this.form.controls['middlename'].value + ' ';
                        name += this.form.controls['lastname'].value;
                        localStorage.setItem('user.name', name);
                        localStorage.setItem('user.email', this.form.controls['email'].value);
                        localStorage.setItem('user.level', this.form.controls['level'].value);
                        if (this.form.controls['level'].value == 0) {
                            localStorage.clear();
                            this._router.navigate(['/login']);
                        }
                    }

                    //  otherwise go back to the previous page
                    this._location.back();
                } else {
                    this.serverResponse = data;
                }
            });
    }

    hasStates() {
        this.states = _.filter(this._storageService.values.states, { country: this.form.value.address_country });
        if (this.states.length > 0) {
            this.form.controls['address_state'].setValue(this.states[0].id);
            this.form.value.address_state = this.states[0].id;
        }
        return this.states.length > 0;
    }
}