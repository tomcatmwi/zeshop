import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {FormValidators} from '../services/formvalidator.service';
import {JSONService} from '../services/json.service'
import {MD5Service} from '../services/md5.service'
import {Router, ActivatedRoute} from '@angular/router';
import {SpinnerComponent} from '../components/spinner/spinner.component';
import {ConfirmComponent} from '../components/confirm/confirm.component';

@Component({
  selector: 'resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements OnInit {

    form: FormGroup;
    serverResponse = { message: '' };
    loading = false;
    confirmBoxData = null;

    constructor(
                    public _fb: FormBuilder, 
                    public _jsonService: JSONService,
                    public _md5Service: MD5Service,
                    public _router: Router,
                    public _activatedRoute: ActivatedRoute
                ) {}

  ngOnInit() {
      
        var temp = this._activatedRoute.params
            .finally(() => { temp.unsubscribe() })
            .subscribe(data => {
                this.form = this._fb.group({
                    resetcode: [data['resetCode'], FormValidators.required],
                    password_1: [''],
                    password_2: ['']
                }, { validator: FormValidators.validatePassword('password_1', 'password_2') });
            });
  }

  //    bnz8VK6z2nnEX
  //    97a86e0892fbda781a278cb27ebba5c8
    
    submitForm() {
        this.loading = true;
        this.serverResponse = null;
        
        var formData = this.form.value;
        formData.password_1 = this._md5Service.md5(formData.password_1);
        formData.password_2 = this._md5Service.md5(formData.password_2);
        
        var temp = this._jsonService.postJSON('/resetpsw', formData)
            .finally(() => {  temp.unsubscribe();
                              this.loading = false;
                            })
            .subscribe(data => {

                this.serverResponse = data;
                
                //  in case of successful registration of a new user...
                if (data.result == 'success') {
                    this.confirmBoxData = {
                        show: true,
                        text: '<strong>Your password has been reset.</strong><br />You can use it to log in.',
                        buttons: [
                            { label: 'OK', value: null, class: 'btn-primary' }
                        ]
                    }
                }
            });
    }


}
