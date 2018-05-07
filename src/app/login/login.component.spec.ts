import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule],
        declarations: [ LoginComponent ],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
