import { Component, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';

//  Turn on enableProdMode() in main.ts to use this component!

@Component({
    selector: 'confirmbox',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css'],
    inputs: ['data'],
    outputs: ['response']
})

export class ConfirmComponent {
    
    @ViewChild('confirmbox') confirmBox;
    
    response = new EventEmitter();
    
    data = { 
            show: false,
            text: 'Default text', 
            buttons: [
                { label: 'Close', value: null, class: 'btn-primary' }
            ] 
           }
    
    constructor(private _confirmBox: ViewContainerRef) {}
    
    ngAfterViewInit() {
        this._confirmBox.createEmbeddedView(this.confirmBox);
    }
    
    setValue(value) {
        this.response.emit(value);
        this.data.show = false;
    }
   
}