import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {RouterTestingModule} from '@angular/router/testing';
import {Routes} from '@angular/router';

import { MainmenuComponent } from './mainmenu.component';
import { JSONService } from '../services/json.service';

describe('MainmenuComponent', () => {
    
  let component: MainmenuComponent;
  let fixture: ComponentFixture<MainmenuComponent>;
  
  class MockJSONService {
        getJSON(url: string) {
           return Observable.of({ result: 'success' });
        }
  }

    // fake routes, we won't go anywhere anyway
    const routes: Routes = [
        {path: 'whatever', redirectTo: '/whatever', pathMatch: 'full'}
    ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(routes)],
        declarations: [ MainmenuComponent ],
        providers: [{ provider: JSONService, setValue: MockJSONService }],
        schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
