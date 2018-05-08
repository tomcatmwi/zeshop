import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JSONService } from './json.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import 'rxjs/add/observable/of';
import * as _ from "lodash";

@Injectable()
export class StorageService {

    settingsSubject = new Subject();
    storedViews = {};

    //  predefined values, contents are loaded from assets/json/values.json

    settings;      // settings loaded from backend
    values;        // settings from values.json
    storage;       // temporary value storage

    constructor(
        private _jsonService: JSONService,
        private _http: Http
    ) {
        this.loadSettings();
        this.loadValues();
    }

    //  ------- storage routines -------

    storeValue(name, value) {
        if (!this.storage) { this.storage = {}; }
        this.storage[name] = value;
    }

    getValue(name) {
        if (!this.storage || typeof this.storage[name] === 'undefined') {
            return null;
        }
        return this.storage[name];
    }

    //  gets a temporary stored value from settings

    getSetting(token) {
        if (this.settings.length <= 0) { return null; }
        let temp = _.find(this.settings, { token: token });
        if (typeof temp['value'] === 'undefined') { return null; }
        if (!isNaN(temp['value'])) { return Number(temp['value']); }
        else { return temp['value']; }

        // if (this.settings.length <= 0) return null;
        // var found = null;
        // for (let group in this.settings) {
        //     for (let setting in this.settings[group].settings) {
        //         if (this.settings[group].settings[setting].token === token) {
        //             found = this.settings[group].settings[setting].value;
        //         }
        //         if (!isNaN(found)) { found = Number(found); }
        //     }
        // }
        // return found;
    }

    //  ------- load settings from server -------

    loadSettings() {
        let temp = this._jsonService.getJSON('/settings')
            .finally(() => {
                temp.unsubscribe();
            })
            .subscribe(
                data => {
                    if (data.result === 'success' && data.data.length > 0) {
                        this.settings = data.data;
                        this.settingsSubject.next(data.data);
                    } else {
                        console.log('ERROR: Unable to load settings from server!');
                    }
                },
                error => { console.log('ERROR: No connection with server - settings can\'t be loaded!'); }
            );

    }

    //  ------- load countries from assets/countries.json -------

    loadValues() {
        let temp =
            this._http.get('assets/json/values.json')
                .finally(() => {
                    temp.unsubscribe();
                })
                .subscribe(
                    data => {
                        this.values = JSON.parse(data['_body']);
                    },
                    error => {
                        console.log('ERROR: Can\'t load assets/values.json!');
                    }
                );

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

    getCountry(id) {
        if (typeof this.values['countries'] === 'undefined') { return false; }
        for (const t in this.values.countries) {
            if (this.values.countries[t].id === id) { return this.values.countries[t]; }
        }
        return false;
    }

}
