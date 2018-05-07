import {Component, OnInit, Output, forwardRef, EventEmitter} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {JSONService} from '../../services/json.service';

@Component({
    selector: 'userselect',
    template: `
             <spinner *ngIf="users.length == 0"></spinner>
             <select [(ngModel)]="value" #user (change)="update(user.value);" class="form-control" *ngIf="users.length > 0">
                <option *ngFor="let user of users" [value]="user?._id">{{ user?.name }}</option>
             </select>`,
    outputs: ['onLoad'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UserSelectComponent),
            multi: true
        }
    ]
})
export class UserSelectComponent implements OnInit {

    users = [{
        _id: localStorage.getItem('user._id'),
        name: localStorage.getItem('user.name')
    }];
    
    value = localStorage.getItem('user._id');
    onLoad = new EventEmitter();

    onChange: any = () => {};
    onTouched: any = () => {};

    //  register form element events
    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(value) {
        this.value = value;
    }

    constructor(
        public _jsonService: JSONService
    ) {}

    ngOnInit() {
        if (Number(localStorage.getItem('user.level')) <= 2) return false;

        var temp = this._jsonService.getJSON('/users')
            .finally(() => {
                temp.unsubscribe;
            })
            .subscribe(data => {
                this.onLoad.emit({ data });
                this.users = data.data;
            },
            (error) => {console.log('Unable to load list of users.');}
            )
    }
    
    update(value) {
        this.onChange(value);
        this.onTouched();        
    }

}
