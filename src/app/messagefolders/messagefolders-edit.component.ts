import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {FormValidators} from '../services/formvalidator.service';
import {JSONService} from '../services/json.service'
import {Router, ActivatedRoute} from '@angular/router';
import {SpinnerComponent} from '../components/spinner/spinner.component';

@Component({
    selector: 'messagefolders-edit',
    templateUrl: './messagefolders-edit.component.html',
    providers: [JSONService]
})
export class MessageFoldersEditComponent implements OnInit {

    formTitle = '';
    form: FormGroup;
    serverResponse = {message: ''};
    loading = false;

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
                    name: ['', Validators.compose([
                        FormValidators.required,
                        FormValidators.minLength(5)
                    ])]
                });
                
                if (data['id'] == 0)
                    this.formTitle = 'New message folder'
                else {
                    this.loading = true;
                    this.formTitle = 'Edit message folder'

                    var temp2 = this._jsonService.getJSON('/messagefolders/'+data['id'])
                        .finally(() => {
                            temp2.unsubscribe();
                            this.loading = false;
                        })
                        .subscribe(data => {
                            if (data.result == 'success') {
                                this.form.controls['_id'].setValue(data.data[0]._id);
                                this.form.controls['name'].setValue(data.data[0].name);
                                this.form.markAsDirty();
                            } else {
                                this.serverResponse = data;

                            }
                        });
                }
                
            },
            () => { this.loading = false; }
            )
    }

    submitForm() {

        this.loading = true;
        var formData = this.form.value;
        this.serverResponse = null;
        
        var temp = this._jsonService.postJSON('/messagefolders', formData)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.serverResponse = data;
                if (data.result == 'success') {
                    this._router.navigate(['messagefolders']);
                }
            });
    }


}
