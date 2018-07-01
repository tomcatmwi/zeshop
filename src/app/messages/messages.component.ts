import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JSONService} from '../services/json.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {DateTimePickerComponent} from '../components/datetimepicker/datetimepicker.component';
import {CheckboxComponent} from '../components/checkbox/checkbox.component';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

    data;
    folders;
    autoreplies;
    confirmBoxData;
    infoBoxData;
    loading = false;
    menutab = 1;

    viewSettings;

    constructor(
        private _jsonService: JSONService,
        private _storageService: StorageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
        if (typeof this._storageService.storedViews['usersComponent'] != 'undefined') {
            this.viewSettings = this._storageService.storedViews['usersComponent'].viewSettings;
        }

        if (!this.viewSettings) {
            this.viewSettings = {
                searchField: 1,
                searchMode: 1,
                searchText: '',
                folder: 0,
                currentDate: new Date()
            }
        }

        this.loadData();
  }

//  called when datetimeselector is changed
  setDate(e) {
      if (typeof e.date === 'undefined') { return false; }
      this.viewSettings.currentDate = e.date;
      this.loadData();
  }

  loadData() {

    this.loading = true;

//  load folder names if not yet loaded

    if (!this.folders) {
      const temp_folders = this._jsonService.getJSON('/messagefolders')
        .finally(() => { 
                         temp_folders.unsubscribe();
                         this.loading = false; 
                       })
        .subscribe(
            data => { this.folders = data.data; },
            error => { this.folders = { result: 'error', message: 'Can\'t load folder list!' }; }
        );
    }

//  load autoreplies

    if (!this.autoreplies) {
      const temp_autoreplies = this._jsonService.getJSON('/autoreplies?a=1')
        .finally(() => { 
                         temp_autoreplies.unsubscribe();
                         this.loading = false; 
                       })
        .subscribe(
            data => { this.autoreplies = data.data; },
            error => { this.autoreplies = null; }
        );
    }

//  assemble filters

    let filter = '?';

    //  search filter and mode
    if (this.viewSettings.searchText.length > 3) {
        filter += 's=' + encodeURIComponent(this.viewSettings.searchText);
        filter += '&sf=' + encodeURIComponent(this.viewSettings.searchField);
        filter += '&sm=' + encodeURIComponent(this.viewSettings.searchMode);
    } else {

    //  date filter
        // filter += 'd=' + this.viewSettings.currentDate.getUTCFullYear() + 
        //                 _.padStart(String(this.viewSettings.currentDate.getUTCMonth()+1), 2, '0') + 
        //                 _.padStart(String(this.viewSettings.currentDate.getUTCDate()), 2, '0');

        filter += 'd=20180601';
    }

    //  folder filter
    if (this.viewSettings.folder) {
        filter += '&f=' + this.viewSettings.folder;
    }

//  load data
      const temp = this._jsonService.getJSON('/message' + filter)
        .finally(() => { 
                         temp.unsubscribe();
                         this.loading = false; 
                       })
        .subscribe(
            data => { console.log(data); this.data = data; },
            error => { this.data = { result: 'error', message: 'Unable to connect to server.' }; }
        );
  }

  deleteMessage(id) {
    this.confirmBoxData = {
        show: true,
        text: 'Do you really want to delete this message?',
        buttons: [
                    {label: 'Yes', value: { id: id }, class: 'btn-primary'},
                    {label: 'No', value: null, class: 'btn-default'}
                 ]
    }
  }

  ipInfo(ip) {
    this.infoBoxData = {
        show: true,
        title: 'Client information',
        data: [
            {
                label: 'IP address:',
                value: ip.ip,
                error: 'Unknown'
            },
            {
                label: 'User agent:',
                value: ip.useragent,
                error: 'Unknown'
            },
            {
                label: 'Location:',
                value: [ip.country, ip.regionName, ip.city],
                error: 'Unknown'
            },
            {
                label: 'Coordinates:',
                value: [ip.lat, ip.lon],
                error: 'Unknown',
                link: 'https://www.google.com/maps?q='+ip.lat+','+ip.lon
            },
            {
                label: 'ISP:',
                value: ip.isp,
                error: 'Unknown'
            },
            {
                label: 'Organization:',
                value: ip.org,
                error: 'Unknown'
            }
        ]
    }
  }

  userInfo(user) {
      this.infoBoxData = {
          show: true,
          title: user.fullname,
          data: [
            {
                label: 'Address:',
                value: user.address
            },
            {
                label: 'E-mail:',
                value: user.email,
                link: 'mailto:'+user.email
            },
            {
                label: 'Phone:',
                value: user.phone,
                link: 'tel:'+user.phone
            },
            {
                label: 'Registered:',
                value: user.registered
            }
        ]
      }
  }

  confirmBoxHandler(stuff) {
      if (!stuff) { return false; }
      const temp = this._jsonService.deleteJSON('/messages/' + stuff.id)
        .finally(() => {
                         temp.unsubscribe();
                         this.loading = false;
                       })
        .subscribe(
            () => {
                for (var t in this.data.data) {
                    if (this.data.data[t]._id == stuff.id) {
                        this.data.data.splice(t, 1);
                    }
                }
            },
            error => { this.data = { result: 'error', message: 'Unable to connect to server.' }; }
        );
  }

  replied(value) {
      console.log('replied! ', value);
  }

}
