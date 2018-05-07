/*
  HOW TO INSTALL:
  
1.  npm install tinymce --save
 
2.  add to angular-cli.json:
  
   "scripts": [
        "../node_modules/tinymce/tinymce.js",
        "../node_modules/tinymce/themes/modern/theme.js",
        "../node_modules/tinymce/plugins/link/plugin.js",
        "../node_modules/tinymce/plugins/paste/plugin.js",
        "../node_modules/tinymce/plugins/table/plugin.js"
    ], 
    
3.  copy the /skins directory from node_modules/tinymce/skins to /assets/tinymce_skins
  
 */

import { Component, AfterViewInit, Input, Output, forwardRef, OnDestroy, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

declare var tinymce: any;

@Component({
  selector: 'richtext',
  templateUrl: './richedit.component.html',
  styleUrls: ['./richedit.component.css'],
  inputs: ['elementId'],
  outputs: ['onEditorKeyUp'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RicheditComponent),
          multi: true
      }
  ]
})

export class RicheditComponent implements AfterViewInit, OnDestroy {

    editor;
    content = new Subject();
    elementId;
    
    onEditorKeyUp = new EventEmitter();

    onChange: any = () => { };
    onTouched: any = () => { };
    
    constructor() {}
            
//  register form element events
    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    
    writeValue(value) {
        this.content.next(value);
    }


    ngAfterViewInit() {
        
        tinymce.init({
            selector: '#'+this.elementId,
            plugins: ['link', 'paste', 'table', 'link image', 'code', 'image', 'colorpicker', 'fullpage', 'fullscreen', 'paste'],
            skin_url: '../assets/tinymce_skins/lightgray',
            setup: editor => {
                
                this.content.subscribe(data => {
                    console.log(data);
                    editor.setContent(data);
                });
                
                editor.on('keyup', () => {
                    const content = editor.getBody();
                    this.onEditorKeyUp.emit(content.innerHTML);
                    this.onChange(content.innerHTML);
                });
            },
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }


}
