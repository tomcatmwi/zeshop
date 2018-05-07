import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../services/formvalidator.service';
import { JSONService } from '../services/json.service'
import { MD5Service } from '../services/md5.service'
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [JSONService, MD5Service]
})

export class LoginComponent implements OnInit {

    form: FormGroup;
    serverResponse;
    loading = true;
    captcha;
    recaptcha_data;

    constructor(
        private _fb: FormBuilder,
        private _jsonService: JSONService,
        private _md5Service: MD5Service,
        private _router: Router,
        private _storageService: StorageService
    ) { }

    ngOnInit() {

        this.form = this._fb.group({
            username: ['', Validators.compose([
                FormValidators.required,
                FormValidators.minLength(5)
            ])],
            password: ['', Validators.compose([
                FormValidators.required,
                FormValidators.minLength(5)
            ])]
        });

        //  get recaptcha key from server

        let temp = this._jsonService.getJSON('/recaptcha')
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                if (data.result === 'success') {
                    this.recaptcha_data = data.data;
                } else {
                    this.serverResponse = { result: 'error', message: 'Unable to obtain reCaptcha site key.' };
                }
            },
            () => {
                this.serverResponse = { result: 'error', message: 'Unable to connect to server.' };
            });

    }

    submitForm() {

        this.loading = true;
        let formData = Object.assign({}, this.form.value);
        formData.password = this._md5Service.md5(formData.password);
        formData.captcha = this.captcha;
        this.serverResponse = null;

        let temp = this._jsonService.postJSON('/login', formData)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.serverResponse = data;
                if (data.result == 'success') {
                    for (let t in data.data) {
                        localStorage.setItem('user.' + t, data.data[t]);
                    }

                    localStorage.setItem('login', '1');
                    this._router.navigate(['dashboard']);
                }
            },
            () => {
                this.serverResponse = { result: 'error', message: 'Unable to connect to server.' };
            });
    }
}