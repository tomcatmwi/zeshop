import { Component, Input, Output, EventEmitter } from '@angular/core';
declare var google: any;

//  Turn on enableProdMode() in main.ts to use this component!

@Component({
    selector: 'showmap',
    templateUrl: './showmap.component.html',
    styleUrls: ['../confirm/confirm.component.css', './showmap.component.css'],
    inputs: ['data'],
    outputs: ['close']
})

export class ShowMapComponent {
    
    map;
    marker;
    placeName;
    close = new EventEmitter();
    
    constructor() {}
    
    set data(data) {
        if (!this.map) this.createMap();
        if (data) this.showMap(data);
    }
    
    createMap() {
        
        this.map = new google.maps.Map(
                document.getElementById('map'),
                {
                    center: { lat: 50.1065567, lng: 14.4905926 },
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                
        this.marker = new google.maps.Marker({
              map: this.map,
              position: { lat: 50.1065567, lng: 14.4905926 }
            });
        
    }
    
    private showMap(data) {
        if (!data.lat || !data.lng || isNaN(data.lat) || isNaN(data.lng)) return false;
        this.placeName = data.name;
        this.map.setCenter({ lat: data.lat, lng: data.lng });
        this.map.setZoom(16);
        this.marker.setPosition({ lat: data.lat, lng: data.lng });
        data.show = true;
    }
   
}