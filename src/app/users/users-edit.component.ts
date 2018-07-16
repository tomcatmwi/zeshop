import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../services/formvalidator.service';
import { JSONService } from '../services/json.service'
import { MD5Service } from '../services/md5.service'
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service'

@Component({
    selector: 'users-edit',
    templateUrl: './users-edit.component.html',
    providers: [JSONService, MD5Service]
})

//  TO BE IMPLEMENTED:
//  Custom form component for the Phone field, just like for Address
//  Settings have been moved to the user record - fix Settings page! Defaults are set in values.json on the backend!
//  Slice up backend routines into separate files in subdirectories!

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

        this.phone_countries = this._storageService.sortArray(this._storageService.values.countries, 'phonecode');

        //  create form

        this.form = this._fb.group({
            _id: [0, FormValidators.required],
            title: [this._storageService.values.titles[0].title],
            firstname: [''],
            middlename: [''],
            lastname: [''],
            email: ['', Validators.compose([FormValidators.required, FormValidators.email])],
            phone_country: ['CA'],
            phone_district: [''],
            phone_number: [''],
            address: [null, FormValidators.required],
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
                    FormValidators.validatePassword('password_1', 'password_2')
                ])
            });

        //  Show the 'level' field if user level > 1        
        if (Number(localStorage.getItem('user.level')) > 1) {
            this.admin = true;
        }

        //  get http parameter
        //  if it's empty, we register a new user
        //  if == "current", then we modify the current user
        //  if it's anything else, we check whether that _id exists

        const temp = this._activatedRoute.params
            .finally(() => { temp.unsubscribe(); })
            .subscribe((data) => {
                this.loading = true;
                let id = '0';
                if (data['id'] == 'current') {
                    id = localStorage.getItem('user._id')
                } else {
                    id = data['id']
                }
                if (!id) {
                    id = '0';
                }

                if (id === '0') {
                    this.pagetitle = 'Add new user'
                    this.buttontext = 'Add user';
                    this.loading = false;
                } else {
                    this.pagetitle = 'Modify registration';
                    this.buttontext = 'Modify user';
                }
                //  attempt to load user data id
                //  and check  whether the current user modifies himself or has level > 1

                if (id !== '0') {

                    const temp2 = this._jsonService.getJSON('users/' + id)
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

                            for (const key in data.data[0]) {
                                if (this.form.controls[key]) {
                                    this.form.controls[key].setValue(data.data[0][key]);
                                    this.form.controls[key].markAsDirty();
                                }
                            }

                            this.form.controls['password_1'].setValue(data.data[0].password);
                            this.form.controls['password_2'].setValue(data.data[0].password);

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

}