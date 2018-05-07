import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserSelectComponent } from './userselect.component';
import { JSONService } from '../../services/json.service';
import { SpinnerComponent } from '../spinner/spinner.component';

describe('UserSelectComponent', () => {
  let component: UserSelectComponent;
  let fixture: ComponentFixture<UserSelectComponent>;
  
  let select: HTMLElement;
  let JSONServiceStub = [
        {
            _id: 'abc123',
            name: 'Vladimir Trump',
            registered: new Date().toISOString(),
            level: 1,
            email: 'vladtrump@whitehouse.ru'
        },
        {
            _id: 'cde456',
            name: 'Donald Putin',
            registered: new Date().toISOString(),
            level: 2,
            email: 'donaldputin@kremlin.gov'
        }
    ]

  beforeEach(async(() => {
      
    TestBed.configureTestingModule({
      declarations: [ 
                      UserSelectComponent
                    ],
      providers: [
                    { provide: JSONService, useValue: JSONServiceStub }
                ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
