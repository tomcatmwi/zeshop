import { Component, OnInit } from '@angular/core';
import { JSONService } from '../services/json.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  constructor(
                private _jsonService: JSONService,
                private _storageService: StorageService
              ) { }
  data;
  confirmBoxData;
  loading = false;

  ngOnInit() {
      this.loadSettings();
  }
  
  loadSettings() {
      this.loading = true;
      
      var temp2 = this._jsonService.getJSON('/settings/')
          .finally(() => {
              temp2.unsubscribe();
              this.loading = false;
          })
          .subscribe(
                data => { this.data = data; },
                error => { this.data = { result: 'error', message: 'Unable to connect to server.' }; }
          );
  }

  delete(params) {
    
    this.confirmBoxData = {
        show: true,
        text: 'Do you really want to delete this setting?<br />'+this.data.data[params.groupIndex].settings[params.rowIndex].token,
        buttons: [
                    {label: 'Yes', value: params, class: 'btn-primary'},
                    {label: 'No', value: null, class: 'btn-default'}
                 ]
    }
  }
  
  confirmBoxHandler(params) {
      this.data.result = 'pending';
      if (params == null) return false;
      
      this.loading = true;
      var temp = this._jsonService.deleteJSON('/settings/'+params.id)
          .finally(() => {
              temp.unsubscribe;
              this.loading = false;
          })
          .subscribe(data => {
              this.data.result = data.result;
              if (data.result == 'error') {
                  this.data.message = data.message;
              } else {
                  this.data.data[params.groupIndex].settings.splice(params.rowIndex, 1);
                  if (this.data.data[params.groupIndex].settings.length == 0)
                      this.data.data.splice(params.groupIndex, 1);
                  
                  this._storageService.loadSettings();
              }
          },
          () => { 
              this.data.result = 'error';
              this.data.message = 'Unable to connect to server.';
            }
          );
  }

}
