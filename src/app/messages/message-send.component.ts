import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../services/formvalidator.service';
import { JSONService } from '../services/json.service'
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Component({
  selector: 'message-send',
  templateUrl: './message-send.component.html'
})
export class MessageSendComponent implements OnInit {

  form: FormGroup;
  serverResponse;
  loading = true;
  captcha;
  recaptcha_data;
  phone_countries;

  constructor(
    private _fb: FormBuilder,
    private _jsonService: JSONService,
    private _router: Router,
    private _storageService: StorageService
  ) { }

  ngOnInit() {

    //  get array values

    this.phone_countries = this._storageService.sortArray(this._storageService.values.countries, 'phonecode');

    this.form = this._fb.group({
      name: ['', Validators.compose([FormValidators.required, FormValidators.minLength(5)])],
      email: ['', Validators.compose([FormValidators.required, FormValidators.email])],
      phone_country: [1],
      phone_district: [''],
      phone_number: [''],
      order_id: ['', Validators.compose([FormValidators.orderCode(true)])],
      subject: ['', Validators.compose([FormValidators.required, FormValidators.minLength(3)])],
      body: ['', Validators.compose([FormValidators.required, FormValidators.minLength(15)])]
    },
    {
        validator: Validators.compose([FormValidators.validatePhone('phone_district', 'phone_number')])
    });

  //  get current user and fill the appropriate fields with data

    const temp = this._jsonService.getJSON('/users/current')
      .finally(() => {
        temp.unsubscribe();
      })
      .subscribe(data => {
        if (data.result === 'success') {
          let fields = ['email', 'phone_country', 'phone_district', 'phone_number'];
          fields.forEach(key => {
            this.form.controls[key].setValue(data.data[0][key]);
            this.form.controls[key].markAsDirty();
          });
          this.form.controls['name'].setValue(data.data[0].propername);
          this.form.controls['name'].markAsDirty();
      }
      },
        () => {
          this.serverResponse = { result: 'error', message: 'Unable to connect to server.' };
        });


    //  get recaptcha key from server

    const temp2 = this._jsonService.getJSON('/recaptcha')
      .finally(() => {
        temp2.unsubscribe();
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
    this.serverResponse = null;

    const formData = this.form.value;
    formData.captcha = this.captcha;

    const temp = this._jsonService.postJSON('/message', formData)
        .finally(() => {
            temp.unsubscribe();
            this.loading = false;
        })
        .subscribe(data => {
            this.serverResponse = data;
            if (data.result == 'success') {
                this._router.navigate(['/messages']);
            } else {
                this.serverResponse = data;
            }
        });
}

}
