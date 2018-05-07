import { Pipe, PipeTransform } from '@angular/core';
import { AveragerService } from '../services/averager.service';

//  Displays a long number nicely formatted by decimal groups
@Pipe({ name: 'formatNumber' })
export class FormatNumberPipe implements PipeTransform {
    
  transform(value: any, thousandSeparator = ',', decimalSeparator = '.'): any {
      var _averagerService = new AveragerService();
      return _averagerService.formatNumber(value, thousandSeparator, decimalSeparator);
  }
}

//  Pipe to display seconds formatted as time
@Pipe({ name: 'formatSeconds' })
export class FormatSecondsPipe implements PipeTransform {
    
  transform(value: any): any {
      var _averagerService = new AveragerService();
      var time = _averagerService.calculateTime(value);
      if (!time) return ('NaN');
      if (time['d'])
        return (time['d'] + 'd '+time.hr+':'+time.min+':'+time.sec+'.'+time.ms)
      else 
        return (time.hr+':'+time.min+':'+time.sec+'.'+time.ms);
  }
}

//  Pipe to chop off too long strings
@Pipe({ name: 'chopString' })
export class ChopStringPipe implements PipeTransform {
  transform(value: any, length: Number): any {
      if (value.length <= length) return value;
      return value.substr(0, length)+'&hellip;';
  }
}
