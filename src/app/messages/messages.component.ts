import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JSONService} from '../services/json.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {DateTimePickerComponent} from '../components/datetimepicker/datetimepicker.component';
import {CheckboxComponent} from '../components/checkbox/checkbox.component';
import {MailerComponent} from '../components/mailer/mailer.component';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    data;
    folders;
    autoreplies;
    confirmBoxData;
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
        
        if (!this.viewSettings)
            this.viewSettings = {
                searchField: 1,
                searchMode: 1,
                searchText: '',
                folder: 0,
                currentDate: new Date()
            }
        
        this.loadData();
  }

//  called when datetimeselector is changed  
  setDate(date) {
      this.viewSettings.currentDate = date;
      this.loadData();
  }
  
  loadData() {
    
    this.loading = true;

//  load folder names if not yet loaded
      
    if (!this.folders) {
      var temp_folders = this._jsonService.getJSON('/messagefolders')
        .finally(() => { 
                         temp_folders.unsubscribe;
                         this.loading = false; 
                       })
        .subscribe(
            data => { this.folders = data.data; },
            error => { this.folders = { result: 'error', message: 'Can\'t load folder list!' }; }
        );        
    }

//  load autoreplies
      
    if (!this.autoreplies) {
      var temp_autoreplies = this._jsonService.getJSON('/autoreplies?a=1')
        .finally(() => { 
                         temp_folders.unsubscribe;
                         this.loading = false; 
                       })
        .subscribe(
            data => { this.autoreplies = data.data; },
            error => { this.autoreplies = null; }
        );        
    }
                
//  assemble filters

    var filter = '?';
        
    function addZero(input) { 
        if (input.length < 2) return '0'+input 
        else return input; 
    }
        
    //  search filter and mode
    if (this.viewSettings.searchText.length > 3) {
        filter += 's='+encodeURIComponent(this.viewSettings.searchText);
        filter += '&sf='+encodeURIComponent(this.viewSettings.searchField);
        filter += '&sm='+encodeURIComponent(this.viewSettings.searchMode);
    } else {

        //  date filter
        filter += 'd=' + this.viewSettings.currentDate.getUTCFullYear() + 
                            addZero(String(this.viewSettings.currentDate.getUTCMonth()+1)) + 
                            addZero(String(this.viewSettings.currentDate.getUTCDate()));
    }

    //  folder filter
    if (this.viewSettings.folder)
        filter += '&f='+this.viewSettings.folder;

//  load data
      var temp = this._jsonService.getJSON('/messages'+filter)
        .finally(() => { 
                         temp.unsubscribe;
                         this.loading = false; 
                       })
        .subscribe(
            data => { this.data = data; },
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
  
  confirmBoxHandler(stuff) {
      
      if (!stuff) return false;
      var temp = this._jsonService.deleteJSON('/messages/'+stuff.id)
        .finally(() => { 
                         temp.unsubscribe;
                         this.loading = false; 
                       })
        .subscribe(
            () => {
                for (var t in this.data.data)
                    if (this.data.data[t]._id == stuff.id)
                        this.data.data.splice(t, 1);
            },
            error => { this.data = { result: 'error', message: 'Unable to connect to server.' }; }
        );        
      
  }
  
  replied(value) {
      console.log('replied! ', value);
  }
  

}
