import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { JSONService } from '../services/json.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { StorageService } from '../services/storage.service'

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {

    data;

    currentPage;
    confirmBoxData;
    loading = false;
    menutab = 1;

    viewSettings;
    pageData;

    constructor(
        private _jsonService: JSONService,
        private _activatedRoute: ActivatedRoute,
        private _storageService: StorageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ngZone: NgZone
    ) {}

    ngOnInit() {

        this.viewSettings = this._storageService.getValue('usersViewSettings');

        if (!this.viewSettings) {
            this.viewSettings = {
                sortField: 1,
                sortMode: 1,
                searchField: 1,
                searchMode: 1,
                searchText: ''
            }
        }

        this.loadData();
    }

    loadData() {

        this.loading = true;
        if (this.viewSettings.searchText.length < 3) { this.viewSettings.searchText = ''; }
        this._storageService.storeValue('usersViewSettings', this.viewSettings);

        let temp = this._jsonService.getJSON('/users?sortField=' + this.viewSettings.sortField + '&sortMode=' + this.viewSettings.sortMode + '&searchField=' + this.viewSettings.searchField + '&searchMode=' + this.viewSettings.searchMode + '&searchText=' + this.viewSettings.searchText)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.data = data;
            },
            (error) => {this.data = { result: 'error', message: 'Unable to connect to server.'}; }
            );
    }

    delete(data) {
        let index = this.data.data.indexOf(data);
        if (index === -1) { return true; }

        this.confirmBoxData = {
            show: true,
            text: 'Do you really want to delete this user?<br /><br /><b>' + data.name + '</b>',
            buttons: [
                {label: 'Yes', value: { id: data._id, index: index }, class: 'btn-primary'},
                {label: 'No', value: null, class: 'btn-default'}
            ]
        }
    }

    confirmBoxHandler(stuff) {
        this.data.result = 'pending';
        if (stuff == null) { return false; }

        this.loading = true;
        let temp = this._jsonService.deleteJSON('/users/' + stuff.id)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.data.result = data.result;
                if (data.result === 'error') {
                    this.data.message = data.message;
                } else {
                    this.data.data.splice(stuff.index, 1);
                    this._ngZone.run(() => { this._changeDetectorRef.detectChanges(); });
                }

            },
            () => {
                this.data.result = 'error';
                this.data.message = 'Unable to connect to server.';
            }
            );
    }
}

