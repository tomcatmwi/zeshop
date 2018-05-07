import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {FormValidators} from '../services/formvalidator.service';
import {JSONService} from '../services/json.service'
import {StorageService} from '../services/storage.service'
import {Router, ActivatedRoute} from '@angular/router';
import {SpinnerComponent} from '../components/spinner/spinner.component';

@Component({
    selector: 'settings-edit',
    templateUrl: './settings-edit.component.html',
    providers: [JSONService]
})
export class SettingsEditComponent implements OnInit {

    formTitle = '';
    form: FormGroup;
    serverResponse = {message: ''};
    loading = false;
    settingGroups;

    constructor(
        private _fb: FormBuilder,
        private _jsonService: JSONService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _storageService: StorageService
    ) {}
    
    ngOnInit() {
        
        this.loading = true;
        
        this.form = this._fb.group({
            _id: [0, FormValidators.required],
            token: ['', Validators.compose([FormValidators.required, FormValidators.minLength(5), FormValidators.token])],
            value: ['', FormValidators.required],
            description: ['', Validators.compose([FormValidators.required, FormValidators.minLength(5)])],
            group: [null, FormValidators.required]
        });
        this.form.controls['_id'].markAsDirty();
        
        var temp = this._jsonService.getJSON('/settinggroups')
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.settingGroups = data.data;
                this.form.controls['group'].setValue(this.settingGroups[0]._id);
                this.initForm();
            });
    }
        
    initForm() {
        
        var temp = this._activatedRoute.params
            .subscribe(data => {
                
                if (!data['id'])
                    this.formTitle = 'New setting';
                else {
                    this.loading = true;
                    this.formTitle = 'Edit setting';

                    var temp2 = this._jsonService.getJSON('/settings/'+data['id'])
                        .finally(() => {
                            temp2.unsubscribe();
                            this.loading = false;
                        })
                        .subscribe(data => {
                            if (data.result == 'success') {
                                for (var key in data.data[0])
                                    if (this.form.controls[key])
                                        this.form.controls[key].setValue(data.data[0][key])
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
        
        var temp = this._jsonService.postJSON('/settings', formData)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.serverResponse = data;
                if (data.result == 'success') {
                    this._storageService.loadSettings();
                    var temp = this._storageService.settingsSubject
                                .finally(() => { temp.unsubscribe(); })
                                .subscribe(data => { this._router.navigate(['/settings']); });
                }
            });
    }
}
