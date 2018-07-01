import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
//import { runInThisContext } from 'vm';

@Component({
  selector: 'datetimepicker',
  templateUrl: './datetimepicker.component.html',
  inputs: ['startYear', 'endYear', 'value', 'buttons', 'showTime', 'showSeconds'],
  outputs: ['change'],
  styleUrls: ['./datepicker.component.css'],  
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => DateTimePickerComponent),
          multi: true
      }
  ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {

    startYear;
    endYear;

    selectYear;
    selectMonth;
    selectDay;
    selectHour = 0;
    selectMinute = 0;
    selectSecond = 0;

    buttons = true;
    showTime = true;
    showSeconds = true;
    UTC = false;

    value: Date;

    months = [];
    years = [];
    days = [];
    hours = [];
    minutes = [];
    seconds = [];

    change = new EventEmitter();

    onChange: any = () => { };
    onTouched: any = () => { };

//  register form element events
    registerOnChange(fn) {
        this.onChange = fn;
        this.onChange(this.calcDate());
        this.onTouched();
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(date) {
//  gets a Date object and sets the controls accordingly
        if (date instanceof Date) {
            this.selectYear = date.getFullYear();
            this.selectMonth = date.getMonth()+1;
            this.selectDay = date.getDate();
            this.selectHour = date.getHours();
            this.selectMinute = date.getMinutes();
            this.selectSecond = date.getSeconds();
            this.updateDays(this.selectYear, this.selectMonth);
        }
    };

//  calculates a Date object from all the values
    calcDate() {
        let temp = new Date();

        temp.setFullYear(this.selectYear);
        temp.setMonth(this.selectMonth - 1);
        temp.setDate(this.selectDay);

        if (this.showTime) {
            temp.setHours(this.selectHour);
            temp.setMinutes(this.selectMinute);
            if (this.showSeconds) {
                temp.setSeconds(this.selectSecond);
            }
            else {
                temp.setSeconds(0);
            }
        } else {
            temp.setHours(12);
            temp.setMinutes(0);
            temp.setSeconds(0);
        }

        if (this.UTC) {
            temp.setTime(temp.getTime() + temp.getTimezoneOffset()*60*1000 );
        }

        return temp;
    }

//  outputs the current event to the 'change' event
    dateChange() {
        this.change.emit({ date: this.calcDate() });
    }

    ngOnInit() {

        let today = new Date();
        if (this.value) {
            today = this.value;
        }

//  set year range
//  if startYear, endYear or currentYear not specified or <1900, set it as current year

        this.years = [];
        if (this.startYear === 'current') { this.startYear = new Date().getFullYear(); }
        if (this.endYear === 'current') { this.endYear = new Date().getFullYear(); }
        if (this.selectYear === 'current') { this.selectYear = new Date().getFullYear(); }

        if (isNaN(this.startYear) || this.startYear < 1900 || this.startYear > 2100) { this.startYear = today.getFullYear(); }
        if (isNaN(this.endYear) || this.endYear < 1900 || this.endYear > 2100) { this.endYear = today.getFullYear(); }
        if (isNaN(this.selectYear) || this.selectYear < 1900 || this.selectYear > 2100) { this.selectYear = today.getFullYear(); }

//  swap startYear and endYear of necessary
//  set distance if they are the same
        if (this.startYear > this.endYear) { [this.startYear, this.endYear] = [this.endYear, this.startYear]; }
        if (this.startYear === this.endYear) { this.startYear -= 10; this.endYear += 10; }
        for (let t=this.startYear; t<=this.endYear; t++) { this.years.push(t); }

//  set selected month to current if invalid month was specified
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (isNaN(this.selectMonth) || this.selectMonth < 1 || this.selectMonth > 12) { this.selectMonth = today.getMonth()+1; }

        if (isNaN(this.selectDay) || this.selectDay < 1 || this.selectDay > 31) { this.selectDay = today.getDate(); }

        for (let t=0; t<=23; t++) {
            this.hours.push(t);
        }

        for (let t=0; t<=59; t++) {
            this.minutes.push(t);
            this.seconds.push(t);
        }

        this.selectHour = today.getHours();
        this.selectMinute = today.getMinutes();
        this.selectSecond = today.getSeconds();

        this.updateDays(this.selectYear, this.selectMonth);

    }

    updateDays(year, month) {

//  calculates proper number of days
        var maxdays = 31;
        if (month == 4 || month == 6 || month == 9 || month == 11) maxdays = 30;
        if (month == 2) {
            if (year % 4 == 0) maxdays = 29 
            else maxdays = 28;
        }
        this.days = [];
        for (var t=1; t<=maxdays; t++) this.days.push(t);
        this.onChange(this.calcDate());
        this.onTouched();
    }

    stepdate(days) {
//  steps the date with a number of days forward or backward
        var currentDate = this.calcDate();
        currentDate.setDate(currentDate.getDate() + days);
        if (currentDate.getFullYear() >= this.startYear && currentDate.getFullYear() <= this.endYear) {
            this.writeValue(currentDate);
        }
        this.dateChange();
    }

    tabZero(value) {
        if (isNaN(value) || value >= 10) return value;
        return '0'+value;
    }

}
