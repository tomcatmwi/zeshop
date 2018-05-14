import { Component, OnInit } from '@angular/core';
import { JSONService } from '../services/json.service';
import { StorageService } from '../services/storage.service';

@Component({
    selector: 'messagefolders',
    templateUrl: './messagefolders.component.html',
    styleUrls: ['./messagefolders.component.css']
})
export class MessageFoldersComponent implements OnInit {

    data;
    confirmBoxData;
    loading = false;
    menutab = 1;
    viewSettings;

    constructor(private _jsonService: JSONService,
                private _storageService: StorageService) { }

    ngOnInit() {

        this.viewSettings = this._storageService.getValue('messageFoldersViewSettings');

        if (!this.viewSettings) {
            this.viewSettings = {
                sortField: 1,
                sortMode: 1,
                searchMode: 1,
                searchText: ''
            }
        }

        this.loadData();
    }

    loadData() {
        this.loading = true;

        if (this.viewSettings.searchText.length < 3) { this.viewSettings.searchText = ''; }
        this._storageService.storeValue('messageFoldersViewSettings', this.viewSettings);

        const temp = this._jsonService.getJSON('/messagefolders?sortField=' + this.viewSettings.sortField + 
                                                '&sortMode=' + this.viewSettings.sortMode + 
                                                '&searchMode=' + this.viewSettings.searchMode +
                                                '&searchText=' + this.viewSettings.searchText)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(
                data => {
                    this.data = data;
                },
                error => { this.data = { result: 'error', message: 'Unable to connect to server.' }; }
            );
    }

    delete(id, rowIndex) {
        this.confirmBoxData = {
            show: true,
            text: `Do you really want to delete this message folder?<br />
            ${this.data.data[rowIndex].name}
            (${this.data.data[rowIndex].messages} messages)`,
            buttons: [
                { label: 'Yes', value: { id: id, rowIndex: rowIndex }, class: 'btn-primary' },
                { label: 'No', value: null, class: 'btn-default' }
            ]
        }
    }

    confirmBoxHandler(stuff) {
        this.data.result = 'pending';
        if (stuff == null) { return false; }

        this.loading = true;
        const temp = this._jsonService.deleteJSON('/messagefolders/' + stuff.id)
            .finally(() => {
                temp.unsubscribe();
                this.loading = false;
            })
            .subscribe(data => {
                this.data.result = data.result;
                if (data.result === 'error') {
                    this.data.message = data.message;
                } else {
                    this.data.data.splice(stuff.rowIndex, 1);
                }
            },
                () => {
                    this.data.result = 'error';
                    this.data.message = 'Unable to connect to server.';
                }
            );
    }

}
