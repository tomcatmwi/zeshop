import { Component, OnInit } from '@angular/core';
import { JSONService } from '../services/json.service';

@Component({
  selector: 'settinggroups',
  templateUrl: './settinggroups.component.html'
})

export class SettingGroupsComponent implements OnInit {

  constructor(private _jsonService: JSONService) { }
  data;
  confirmBoxData;
  loading = false;

  ngOnInit() {
      this.loadSettingGroups();
  }
  
  loadSettingGroups() {
      this.loading = true;
      var temp = this._jsonService.getJSON('/settinggroups')
        .finally(() => { 
                         temp.unsubscribe;
                         this.loading = false; 
                       })
        .subscribe(
            data => { this.data = data; },
            error => { this.data = { result: 'error', message: 'Unable to connect to server.' }; }
        );
  }

  delete(id, rowIndex) {
    this.confirmBoxData = {
        show: true,
        text: 'Do you really want to delete this group?<br />'+this.data.data[rowIndex].name,
        buttons: [
                    {label: 'Yes', value: { id: id, rowIndex: rowIndex }, class: 'btn-primary'},
                    {label: 'No', value: null, class: 'btn-default'}
                 ]
    }
  }
  
  confirmBoxHandler(stuff) {
      this.data.result = 'pending';
      if (stuff == null) return false;
      
      this.loading = true;
      var temp = this._jsonService.deleteJSON('/settinggroups/'+stuff.id)
          .finally(() => {
              temp.unsubscribe;
              this.loading = false;
          })
          .subscribe(data => {
              this.data.result = data.result;
              if (data.result == 'error') {
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
