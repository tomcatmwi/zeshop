import { Component, Input, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  inputs: ['label', 'value', 'size'],
  outputs: ['change'],
  styleUrls: ['./checkbox.component.css'],  
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => CheckboxComponent),
          multi: true
      }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {

    value;
    label;
    size=1;
    change = new EventEmitter();
    
    onChange: any = () => { };
    onTouched: any = () => { };
    
//  register form element events
    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    
    writeValue(value) {
        if (typeof value == 'boolean')
            this.value = value
        else
            this.value = false;
    }

    click() {
        this.value = !this.value;
        this.change.emit({ changed: true, checked: this.value });
        this.onChange(this.value);
        this.onTouched();
    }
        
}
