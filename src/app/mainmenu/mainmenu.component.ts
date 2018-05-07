import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {JSONService} from '../services/json.service';

@Component({
    selector: 'mainmenu',
    templateUrl: './mainmenu.component.html',
    styles: [`
                .dropdownVisible {
                    display: block;
                }
  ` ],
    host: { '(document:click)': 'onClick($event)' }
})

export class MainmenuComponent {

    isCollapsed = true;
    menuOpen = 0;
    leaveOpen = false;
    confirmBoxData = null;
    
    constructor (
                    public _jsonService: JSONService,
                    public _router: Router
                ) {}
    
    onClick(event) {
        if (!this.leaveOpen) {
            this.menuOpen = 0;
        }
        this.leaveOpen = false;
    }

    switchMenu(number) {
        if (number != this.menuOpen) {
            this.menuOpen = number;
            this.leaveOpen = true;
        }
    }

//  confirm box stuff
            
    logoutDialog() {
        this.confirmBoxData = {
            show: true,
            text: 'Are you sure you want to log out?',
            buttons: [
                { label: 'Yes', value: 1, class: 'btn-primary' },
                { label: 'No', value: null, class: 'btn-default' }
            ]
        }
    }
    
    logout(value) {
        if (value == 1) {
            localStorage.removeItem('login');
            var temp = this._jsonService.getJSON('/logout')
                .finally(() => {
                    temp.unsubscribe();
                    localStorage.clear();
                    this._router.navigate(['/login']);
                })
                .subscribe(() => {});
        }
    }

    userLevel() {
        if (localStorage.getItem('user.level'))
            return localStorage.getItem('user.level')
        else
            return 0;
    }

}
