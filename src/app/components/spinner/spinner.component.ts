import {Component, Input} from '@angular/core';

@Component({
    selector: 'spinner',
    template: `<i class="fa fa-refresh fa-spin fa-fw"
                  [class.fa-3x]="spinnerSize==3"
                  [class.fa-2x]="spinnerSize==2"
               ></i>`,
    inputs: ['spinnerSize']
})

export class SpinnerComponent {
    spinnerSize = 1;
}