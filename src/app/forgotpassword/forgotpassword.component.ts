import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {FormValidators} from '../services/formvalidator.service';
import {JSONService} from '../services/json.service'
import {SpinnerComponent} from '../components/spinner/spinner.component';

@Component({
  selector: 'forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
  providers: [JSONService]
})
export class ForgotPasswordComponent implements OnInit {

    form: FormGroup;
    serverResponse = { message: '' };
    loading = false;
    confirmBoxData = null;

    constructor(
                    public _fb: FormBuilder, 
                    public _jsonService: JSONService,
                    public _router: Router
                ) {}
    
    ngOnInit() {
        
        this.form = this._fb.group({
            email: ['', Validators.compose([
                            FormValidators.required,
                            FormValidators.email
            ])]

        });
    }

    submitForm() {
        
        this.loading = true;
        var formData = this.form.value;
        this.serverResponse = null;
        
        var temp = this._jsonService.postJSON('/forgotpsw', formData)
            .finally(() => {  temp.unsubscribe();
                              this.loading = false;
                            })
            .subscribe(data => {
                this.serverResponse = data;
                if (data.result == 'success') {
                    
                    this.confirmBoxData = {
                        show: true,
                        text: 'An e-mail had been sent to the address '+formData.email+'.<br />Please follow the instructions in the e-mail to get a new password',
                        buttons: [
                            { label: 'OK', value: null, class: 'btn-primary' }
                        ]
                    }
                    
                }
            });
    }
}