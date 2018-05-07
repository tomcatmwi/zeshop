import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { JSONService } from '../services/json.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'confirmregister',
  templateUrl: './confirmregister.component.html',
  styleUrls: ['./confirmregister.component.css']
})
export class ConfirmRegisterComponent implements OnInit {

  outcome = 'pending';
  
  constructor(
                private _jsonService: JSONService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute
              ) { }

  ngOnInit() {

        var temp = this._activatedRoute.params
            .subscribe(data => {
                if (!data['confirmCode'])
                    this.outcome == 'error'
                else {
                    var temp = this._jsonService.getJSON('/confirmuser/'+data['confirmCode'])
                        .finally(() => {temp.unsubscribe()})
                        .subscribe(data => { this.outcome = data.result; },
                                   () => { this.outcome = 'error'; });
                }
                                
            },
            () => this.outcome = 'error');
  }

}
