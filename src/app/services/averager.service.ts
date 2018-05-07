import {Injectable} from '@angular/core';

@Injectable()
export class AveragerService {

    constructor() {}

//  converts a given meter distance into kilometers if over 10,000
//  returns imperial if it's specified in the second parameter
    
    convertDistance(input, system) {
        var result = {value: input, unit: 'm'};

        if (input > 4000) {
            if (system != 'metric') {
                result.value = Number(parseFloat(String(input / 1609.34)).toFixed(2));
                result.unit = 'mi'
            } else {
                result.value = Number(parseFloat(String(input / 1000)).toFixed(2));
                result.unit = 'km'
            }
        } else {
            if (system != 'metric') {
                result.value = Number(parseFloat(String(input * 1.09361)).toFixed(2));
                result.unit = 'yd'
            }
        }
        return result;
    }

    getAverages(input, system=null) {

        var result = {
            runs: 0,
            totalDistance: 0,
            totalDistanceMeters: 0,
            totalDistanceUnit: 'm',
            avgDistance: 0,
            avgDistanceMeters: 0,
            avgDistanceUnit: 'm',
            topSpeed: 0,
            topSpeedMps: 0,
            topSpeedUnit: 'm/s',
            avgSpeed: 0,
            avgSpeedMps: 0,
            avgSpeedUnit: 'm/s',
            totalTime: 0,
            avgTime: 0,
            moonPercent: 0,
            system: null
        }

        if (!input.data || input.data.length == 0)
            return result;

//  find which unit system to use to display values

        if (!system || (system != 'metric' && system != 'imperial')) {
            var imperial = 0;
            var metric = 0;
            system = 'metric';

            for (var t in input.data) {
                if (input.data[t].distanceUnit == 1 || input.data[t].distanceUnit == 1000) metric++
                else imperial++
            }
            if (imperial > metric) system = 'imperial';
        }
        
        result.system = system;

//  number of runs

        result.runs = input.data.length;

//  total distance
//  we keep the original meters value for easy comparison

        for (var t in input.data)
            result.totalDistance += Number(input.data[t].distance);
        result.totalDistanceMeters = result.totalDistance;

//  average distance 

        result.avgDistance = Number((result.totalDistance / input.data.length).toFixed(2));
        result.avgDistanceMeters = result.avgDistance;

//  find highest speed
        
        var speeds = 0;
        var speed = 0;
        for (t in input.data) {
            speed = (input.data[t].distance / input.data[t].time);
            speeds += speed;
            if (speed > result.topSpeed) result.topSpeed = speed;
        }
        result.topSpeedMps = result.topSpeed;
        //Number((result.topSpeed).toFixed(2));

//  calculate average speed
        
        result.avgSpeed = Number((speeds / input.data.length).toFixed(2));
        result.avgSpeedMps = result.avgSpeed;
        
//  calculate total time
        
        for (t in input.data)
            result.totalTime += input.data[t].time;

//  calculate average time
        
        result.avgTime = Math.round(result.totalTime / input.data.length);

//  calculate moon distance percent

        result.moonPercent = Number(parseFloat(String(result.totalDistance / 3840000)).toFixed(2));

//  cut down too large numbers
        var temp = this.convertDistance(result.totalDistance, system);
        result.totalDistance = temp.value;
        result.totalDistanceUnit = temp.unit;

        var temp = this.convertDistance(result.avgDistance, system);
        result.avgDistance = temp.value;
        result.avgDistanceUnit = temp.unit;

//  convert speeds to km/h or mph

        if (system != 'metric') {
            result.topSpeed = (result.topSpeed * 1.09361) * 2.04545;
            result.topSpeedUnit = 'mph'
            result.avgSpeed = (result.avgSpeed * 1.09361) * 2.04545;
            result.avgSpeedUnit = 'mph'
        } else {
            result.topSpeed = result.topSpeed * 3.6;
            result.topSpeedUnit = 'km/h'
            result.avgSpeed = result.avgSpeed * 3.6;
            result.avgSpeedUnit = 'km/h'
        }
        
        result.topSpeed = Number((result.topSpeed).toFixed(2));
        result.avgSpeed = Number((result.avgSpeed).toFixed(2));
        
        return result;
    }

//  compares two outputs from getAverages
            
    compareAverages(previous, current) {
        
        var result = {
            runs: 0,
            totalDistanceMeters: 0,
            avgDistanceMeters: 0,
            topSpeedMps: 0,
            avgSpeedMps: 0,
            totalTime: 0,
            avgTime: 0,
        }

        for (var key in result) {
            if (previous[key] && current[key])
                result[key] = Number(Math.round(current[key] / (previous[key] / 100)).toFixed(2))-100;
        }
        return result;
        
    }

//  Generates hours, minutes, seconds and milliseconds from a number of seconds
    calculateTime(seconds) {
        
        if (isNaN(seconds)) return false;

        var d = 0;
        var hr = 0;
        var min = 0;
        var sec = Number(seconds);
        var ms = 0;

        ms = Math.round((sec - Math.floor(sec)) * 1000);

        if (sec >= 60) {
            min = sec / 60;
            sec = sec % 60;
        }

        if (min >= 60) {
            hr = min / 60;
            min = min % 60;
        }
        
        if (hr >= 24) {
            d = Math.floor(hr / 24);
            hr = hr % 24;
        }

        var strHr = String(Math.round(hr));
        var strMin = String(Math.round(min));
        var strSec = String(Math.round(sec));
        var strMs = String(ms);

        if (hr < 10) strHr = '0' + strHr;
        if (min < 10) strMin = '0' + strMin;
        if (sec < 10) strSec = '0' + strSec;
        if (ms < 10) strMs = '0' + strMs;
        if (ms < 100) strMs = '0' + strMs;
        
        var result = { hr: strHr, min: strMin, sec: strSec, ms: strMs };
        result['formatted'] = strHr+':'+strMin+':'+strSec+'.'+strMs;

        if (d > 0) {
            result['d'] = d;
            result['formatted'] = d+'d '+result['formatted'];
        }
        
        return(result);
    }
    
//  Converts an UTC date string into a Date of local timezone
    UTCDatetoDate(date) {
        
        if (!(date instanceof Date))
            date = new Date(date);
        
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;        
    }

    formatNumber(value, thousandSeparator=',', decimalSeparator='.') {
      
      if (isNaN(value)) return false;
      
      var base = value > 0 ? String(Math.floor(Number(value))) : String(Math.ceil(Number(value)));
      
      if (String(value).lastIndexOf('.') != -1)
        var decimals = String(value).substr(String(value).lastIndexOf('.'), String(value).length);
      else
        var decimals = '';
      
      decimals = decimals.replace(/./, decimalSeparator);
      if (decimals.length > 3) decimals = decimals.substr(0, 3);
      
      var output = '';
      var counter = 0;
      
      for (var t=base.length-1; t>=0; t--) {
          counter++;
          output = base[t]+output;
          if (counter % 3 == 0 && (t > 0 && base[t-1] != '-')) output = thousandSeparator+output;
      }
     
      return output+decimals;
        
    }

}
