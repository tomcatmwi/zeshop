/*
*   TO USE THIS SERVICE:
*  
*   Add this to the index.html file:
* 
*  <script src="https://maps.googleapis.com/maps/api/js?libraries=places,maps&language=en&key=API_KEY"></script>
*
*/

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

declare var google: any;

@Injectable()
export class GoogleMapsService {

//  Retrieves autocomplete suggestions for a string
    
    getAutoComplete(params) {
        
        var autocomplete = new google.maps.places.AutocompleteService();
        
        return new Observable<any>(observer => {
            autocomplete.getPlacePredictions(params,
                (predictions, status) => {
                    if (status == 'OK') {
                        observer.next({predictions: predictions, status: status});
                        observer.complete();
                    } else {
                        switch (status) {
                            case ('INVALID_REQUEST'): observer.error('Invalid query request.'); break;
                            case ('OVER_QUERY_LIMIT'): observer.error('The request can not be served because the quota has exceeded.'); break;
                            case ('REQUEST_DENIED'): observer.error('Sorry, this application is not allowed to access Google\'s Places Service.'); break;
                            case ('UNKNOWN_ERROR'): observer.error('Connection error. Can\'t look up place name.'); break;
                            case ('ZERO_RESULTS'): observer.error('No place with this name was found.'); break;
                        }
                    }
                });
        })
    }

//  Returns the exact location of an address or a placeID.
    
    getGeocode(data) {

        var geocoder = new google.maps.Geocoder;
        return new Observable<any>(observer => {
            geocoder.geocode(data,
                    (results, status) => {
                    if (status == 'OK') {
                        observer.next({results: results, status: status});
                        observer.complete();
                    } else {
                        switch (status) {
                            case ('INVALID_REQUEST'): observer.error('Invalid query request.'); break;
                            case ('OVER_QUERY_LIMIT'): observer.error('The request can not be served because the quota has exceeded.'); break;
                            case ('REQUEST_DENIED'): observer.error('Sorry, this application is not allowed to access Google\'s Places Service.'); break;
                            case ('UNKNOWN_ERROR'): observer.error('Connection error. Can\'t look up place name.'); break;
                            case ('ZERO_RESULTS'): observer.error('No place with this name was found.'); break;
                        }
                    }
                });
        })
    }

}