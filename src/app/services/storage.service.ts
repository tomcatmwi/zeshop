import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';

import 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class StorageService {

    //  predefined values, contents are loaded from assets/json/values.json

    storedViews = {};
    settings;      // settings loaded from backend
    values;        // settings from values.json
    storage;       // temporary value storage

    // tslint:disable-next-line:member-ordering
    baseURL = 'http://' + this._location['_platformStrategy']['_platformLocation']['location']['hostname'] + ':3001';

    // tslint:disable-next-line:member-ordering
    _requestOptions = new RequestOptions({
        withCredentials: true,
        headers: new Headers({
            'Content-Type': 'application/json,charset=utf-8',
            'Accept': 'q=0.8;application/json;q=0.9',
        })
    });

    constructor(
        private _http: Http,
        private _location: Location
    ) { }

    //  ------- load personal settings from server -------
    //  called ONCE after login

    loadSettings() {
        const temp = this._http.get(this.baseURL + '/settings', this._requestOptions)
            .finally(() => {
                temp.unsubscribe();
            })
            .subscribe(
                data => {
                    let result = JSON.parse((<any>data)._body);
                    if (result.result === 'success' && result.data.length > 0) {
                        this.settings = result.data;
                        console.log('Settings loaded!');
                    } else {
                        console.log('ERROR: Unable to load settings from server!');
                    }
                },
                error => {
                    console.log('ERROR: No connection with server - settings can\'t be loaded!');
                }
            );
    }

    //  ------- load values from assets/values.json -------
    //  called from the AppModule with APP_INITIALIZER!

    loadValues(): Promise<any> {

        return new Promise((resolve, reject) => {
            const temp = this._http.get('assets/json/values.json', this._requestOptions)
                .finally(() => {
                    temp.unsubscribe();
                })
                .subscribe(
                    data => {
                        this.values = JSON.parse(data['_body']);

                        //  Load remote data

                        const temp2 = this._http.get(this.baseURL + '/getvalues', this._requestOptions)
                            .finally(() => {
                                temp.unsubscribe();
                                temp2.unsubscribe();
                                resolve();
                            })
                            .subscribe(
                                result => {
                                    let data = JSON.parse((<any>result)._body);
                                    if (data.result === 'success') {
                                        _.extend(this.values, data.data);
                                    } else {
                                        reject('ERROR: Unable to load values from server!');
                                    }
                                },
                                error => {
                                    reject('ERROR: No connection with server - values can\'t be loaded!');
                                }
                            );
                    },
                    error => {
                        reject('ERROR: Can\'t load assets/values.json!');
                    });

        }).then(result => {
            console.log('Values successfully loaded.');
        }).catch(e => {
            console.log(e);
        });

    }

    //  ------- storage routines -------

    storeValue(name, value) {
        if (!this.storage) { this.storage = {}; }
        this.storage[name] = value;
    }

    getValue(name) {
        try {
            this.storage[name];
        } catch (e) {
            return null;
        }
    }

    //  gets a temporary stored value from settings

    getSetting(token) {
        try {
            let found = (<any>_.find(this.settings[0].settings, { 'token': token })).value || null;
            if (found != null && !isNaN(found)) { found = Number(found); }
            return found;
        } catch (e) {
            return null;
        }
    }

    //  ------- array sorter -------

    sortArray(source: any[],
        key,
        sortOrder = 1,
        makeUnique = false,
        locale = 'en',
        options = { numeric: true, caseFirst: 'upper', ignorePunctuation: true }
    ) {
        if (!Array.isArray(source) || source.length === 0 || typeof source[0][key] === 'undefined') { return false; }

        //  slice() is needed because mysteriously it doesn't work any other way!
        let result = source.slice().sort((a, b) => {
            return a[String(key)].localeCompare(b[String(key)], locale, options);
        });

        if (sortOrder !== 1) { result = _.reverse(result); }
        if (makeUnique) { result = _.uniqWith(result, _.isEqual); }
        return result;
    }

    sortObject(source: any[],
        key,
        sortOrder = 1,
        makeUnique = false,
        locale = 'en',
        options = { numeric: true, caseFirst: 'upper', ignorePunctuation: true }
    ) {
        if (!Array.isArray(source) || source.length === 0 || typeof source[0][key] === 'undefined') { return false; }

        //  slice() is needed because mysteriously it doesn't work any other way!
        let result = source.slice().sort((a, b) => {
            return a[String(key)].localeCompare(b[String(key)], locale, options);
        });

        if (sortOrder !== 1) { result = _.reverse(result); }
        if (makeUnique) { result = _.uniqWith(result, _.isEqual); }
        return result;
    }


    getCountry(id) {
        if (typeof this.values['countries'] === 'undefined') { return false; }
        for (const t in this.values.countries) {
            if (this.values.countries[t].id === id) { return this.values.countries[t]; }
        }
        return false;
    }

    //  Finds and returns the current locale from values.json
    //  The current value is returned from settings. If it doesn't exist, the default one will be assumed.
    getLocale() {

        try {
            var localeName = this.getSetting('locale');
        } catch (e) {
            var localeName = this.values.locales.default_locale;
        }

        return _.find(this.values.locales, { 'id': localeName.toLowerCase() });
    }

}
