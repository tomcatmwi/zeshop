import { Injectable, Injector, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import 'rxjs/Rx';
import 'rxjs/add/observable/of';

@Injectable()
export class JSONService {

    constructor(
        private _http: Http,
        private _router: Router,
        private _storageService: StorageService
    ) {}

    // tslint:disable-next-line:member-ordering
    private _requestOptions = new RequestOptions({
        withCredentials: true,
        headers: new Headers({
            'Content-Type': 'application/json,charset=utf-8',
            'Accept': 'q=0.8;application/json;q=0.9',
        })
    });

    //  looks at the result, validates it and if contains login == false, redirects to /login
    private checkData(data) {
        try {
            data = data.json();
            if (data && typeof data.login !== 'undefined' && (data.login === false || String(data.login).toLowerCase() === 'false')) {
                localStorage.clear();
                this._router.navigate(['/login']);
                return data;
            }
            return data;
        } catch (err) {
            return null;
        }
    }

    private _fixSubURL(subURL) {
        if (subURL[0] !== '/') { subURL = '/' + subURL; }
        return subURL;
    }

    getJSON(subURL) {
        subURL = this._fixSubURL(subURL);
        return (
            this._http.get(this._storageService.values.APIURL + subURL, this._requestOptions)
                .map(result => this.checkData(result))
        );
    }

    postJSON(subURL, content) {
        subURL = this._fixSubURL(subURL);
        return (
            this._http.post(this._storageService.values.APIURL + subURL, content, this._requestOptions)
                .map(result => this.checkData(result))
        );
    }

    putJSON(subURL, content) {
        subURL = this._fixSubURL(subURL);
        return (
            this._http.put(this._storageService.values.APIURL + subURL, content, this._requestOptions)
                .map(result => this.checkData(result))
        );
    }

    deleteJSON(subURL) {
        subURL = this._fixSubURL(subURL);
        return (
            this._http.delete(this._storageService.values.APIURL + subURL, this._requestOptions)
                .map(result => this.checkData(result))
        );
    }

}