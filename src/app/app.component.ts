import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
                  <mainmenu *ngIf="getLogin()"></mainmenu>
                  <router-outlet></router-outlet>
                  <footerbar *ngIf="getLogin()"></footerbar>`,
})

export class AppComponent {
    
    constructor( 
        private _router: Router
    ) {}
    
    getLogin() {
    //  this shows or hides the main menu
        return localStorage.getItem('login') == '1';
    }
    
}
