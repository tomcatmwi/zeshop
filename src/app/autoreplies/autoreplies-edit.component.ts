import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {FormValidators} from '../services/formvalidator.service';
import {JSONService} from '../services/json.service'
import {Router, ActivatedRoute} from '@angular/router';
import {SpinnerComponent} from '../components/spinner/spinner.component';
import {CheckboxComponent} from '../components/checkbox/checkbox.component';
import {RicheditComponent} from '../components/richedit/richedit.component';

@Component({
    selector: 'autoreplies-edit',
    templateUrl: './autoreplies-edit.component.html',
    providers: [JSONService]
})
export class AutoRepliesEditComponent implements OnInit {

    formTitle = '';
    form: FormGroup;
    serverResponse = { message: '' };
    loading = false;
    tinymce;

    constructor(
        private _fb: FormBuilder,
        private _jsonService: JSONService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {

        var temp = this._activatedRoute.params
            .subscribe(data => {
                this.form = this._fb.group({
                    _id: [data['id'], FormValidators.required],
                    content: ['', Validators.compose([
                        FormValidators.required,
                        FormValidators.minLength(5)
                    ])],
                    token: ['', Validators.compose([
                        FormValidators.required,
                        FormValidators.token,
                        FormValidators.minLength(5)
                    ])],
                    subject: ['', Validators.compose([
                        FormValidators.required,
                        FormValidators.minLength(5)
                    ])],

                    available: [true],

                    body: ['', Validators.compose([
                        FormValidators.required,
                        FormValidators.minLength(10)
                    ])],

                });

                if (data['id'] == 0)
                    this.formTitle = 'New autoreply template'
                else {
                    this.loading = true;
                    this.formTitle = 'Edit autoreply template'

                    var temp2 = this._jsonService.getJSON('/autoreplies/' + data['id'])
                        .finally(() => {
                            temp2.unsubscribe();
                            this.loading = false;
                        })
                        .subscribe(data => {
                            if (data.result == 'success') {
                                this.form.controls['_id'].setValue(data.data[0]._id);
                                this.form.controls['content'].setValue(data.data[0].content);
                                this.form.controls['token'].setValue(data.data[0].token);
                                this.form.controls['subject'].setValue(data.data[0].subject);
                                this.form.controls['available'].setValue(data.data[0].available);
                                this.form.controls['body'].setValue(data.data[0].body);
                                this.form.markAsDirty();
                            } else {
                                this.serverResponse = data;

                            }
                        });
                }

            },
            () => {this.loading = false;}
            )
    }

    submitForm() {

        this.loading = true;
        var formData = this.form.value;
        console.log(formData);
//        if (1 == 1) return false;
        this.serverResponse = null;

        var temp = this._jsonService.postJSON('/autoreplies', formData)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                console.log(data);
                this.serverResponse = data;
                if (data.result == 'success') {
                    this._router.navigate(['autoreplies']);
                }
            });
    }


}
