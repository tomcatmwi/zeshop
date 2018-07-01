import { Component, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';

//  Turn on enableProdMode() in main.ts to use this component!

@Component({
    selector: 'infobox',
    templateUrl: './infobox.component.html',
    styleUrls: ['../confirm/confirm.component.scss', './infobox.component.scss'],
    inputs: ['data'],
})

export class InfoBoxComponent {

    @ViewChild('infobox') infoBox;

    response = new EventEmitter();

    data = {
            show: false,
            data: []
           }

    constructor(private _infoBox: ViewContainerRef) {}

    ngAfterViewInit() {
        this._infoBox.createEmbeddedView(this.infoBox);
    }

    renderValue(data) {
        if (!data.value) { return data.error; }
        if (typeof data.value != 'object') { return data.value; }

        let temp = '';
        data.value.forEach(e => {
            if (typeof e !== 'undefined') {
                if (temp !== '') { temp += ', ' }
                temp += e;
            }
        });

        if (data.link && temp != '') {
            temp = '<a href="'+data.link+'" target="_blank">'+temp+'</a>'
        }

        if (temp === '') return data.error;
        return temp;
    }

    close(value) {
        this.data.show = false;
    }

}