import { Component } from '@angular/core';

@Component({
  selector: 'footerbar',
  templateUrl: './footerbar.component.html',
  styleUrls: ['./footerbar.component.css']
})
export class FooterbarComponent {

  currentUser;
  
  getCurrentUser() {
      return localStorage.getItem('user.name');
  }

}
