import { Component, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['paginator.component.css'],
    inputs: ['totalRecords', 'startRecord'],
    outputs: ['changePage'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PaginatorComponent),
            multi: true
        }
    ]
})

export class PaginatorComponent {
    
    totalRecordsNumbers = [1];                          // temporary array for ngFor loop to generate button labels
    
    pageData = {
        totalRecords: 0,                                // total number of records - received from outside
        recordPerPage: 20,                              // number of records per page
        startRecord: 0,                                 // index of starting record on current page
        currentPage: 1,                                 // the currently active page's index number
        startPage: 1,                                   // the first page displayed on the paginator
        maxPages: (window.innerWidth < 600) ? 5 : 10    // maximum number of page buttons shown on the paginator
    }

    onChange: any = () => { };
    onTouched: any = () => { };
    
//  register form element events for two way binding
    
    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
      
    writeValue(value) {
        if (value)
            this.pageData = value
        else
            this.onChange(this.pageData);
    }

//  start watching changes in input properties
    
    set startRecord(startRecord) {
        this.turnPage(startRecord);
    }

    set totalRecords(totalRecords) {
      this.pageData.totalRecords = totalRecords;
      this.totalRecordsNumbers = Array(totalRecords).fill(null);
      
      var totalPages = Math.ceil(totalRecords / this.pageData.recordPerPage);
      if (this.pageData.currentPage > totalPages) {
         this.turnPage(-1);
      }
    }

//  start stuff
    
    turnPage(direction) {
          
        var current = this.pageData.startRecord;
        
        if (Math.abs(direction) == 1)
            this.pageData.startRecord += (this.pageData.recordPerPage * direction)
        else
            this.pageData.startRecord = direction;
            
        if (this.pageData.startRecord < 0 || this.pageData.startRecord > this.pageData.totalRecords - 1)
            this.pageData.startRecord = current;
        else {
        
            this.pageData.currentPage = Math.floor(this.pageData.startRecord / this.pageData.recordPerPage)+1;
        
            if (this.pageData.currentPage >= this.pageData.startPage + this.pageData.maxPages)
                this.pageData.startPage++;

            if (this.pageData.currentPage < this.pageData.startPage)
                this.pageData.startPage--;
        }
                
        this.onChange(this.pageData);
    }
}
