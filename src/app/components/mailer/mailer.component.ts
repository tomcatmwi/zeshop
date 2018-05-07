import { Component, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import {RicheditComponent} from '../richedit/richedit.component';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {FormValidators} from '../../services/formvalidator.service';
import {JSONService} from '../../services/json.service'
import {SpinnerComponent} from '../spinner/spinner.component';

//  Turn on enableProdMode() in main.ts to use this component!

@Component({
    selector: 'mailer',
    templateUrl: './mailer.component.html',
    styleUrls: ['./mailer.component.css'],
    inputs: ['data']
})

export class MailerComponent {
    
    @ViewChild('mailer') mailer;
    
    form: FormGroup;
    serverResponse = { message: '' };
    loading = false;

    constructor(
                    private _mailer: ViewContainerRef,
                    private _fb: FormBuilder, 
                    private _jsonService: JSONService
                ) {

        this.form = _fb.group({
            to: ['', Validators.compose([
                            FormValidators.required,
                            FormValidators.email
            ])],
            
            cc: ['', FormValidators.multiple_email],
            bcc: ['', FormValidators.multiple_email],
            subject: ['', Validators.compose([
                            FormValidators.required,
                            FormValidators.minLength(3)
            ])],
            body: ['']

        });
    }


    data = { 
            show: false,
            text: 'Default text', 
            buttons: [
                { label: 'Close', value: null, class: 'btn-primary' }
            ] 
           }
    
    ngAfterViewInit() {
        this._mailer.createEmbeddedView(this.mailer);
    }
    
    setValue(value) {
        this.data.show = false;
    }
   
}