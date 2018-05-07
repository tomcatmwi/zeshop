import {async, ComponentFixture, fakeAsync, tick, TestBed} from '@angular/core/testing';
import {Router, Routes, ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {ConfirmRegisterComponent} from './confirmregister.component';
import {SpinnerComponent} from '../components/spinner/spinner.component';
import {JSONService} from '../services/json.service'

describe('ConfirmRegisterComponent', () => {
    
    let component: ConfirmRegisterComponent;
    let fixture: ComponentFixture<ConfirmRegisterComponent>;
        
    let router: Router;

//  fake service classes
    
    class MockRouter {
        navigateByUrl(url: string) {console.log('url requested: ' + url); return url;}
    }

    let MockActivatedRoute = {
        params: Observable.of({confirmCode: 'abc123'})
    }
    
    class MockJSONService {
        getJSON(url: string) {
           return Observable.of({ result: 'success' });
        }
    }
    let _mockJSONService = new MockJSONService();

    // fake routes, we won't go anywhere anyway
    const routes: Routes = [
        {path: 'todo-edit', redirectTo: '/todo-edit', pathMatch: 'full'}
    ]

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                            ConfirmRegisterComponent
                          ],
            imports: [RouterTestingModule.withRoutes(routes)],
            providers: [
                RouterTestingModule,
                {provide: JSONService, useValue: _mockJSONService},
                {provide: Router, useValue: MockRouter},
                {provide: ActivatedRoute, useValue: MockActivatedRoute},
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmRegisterComponent);
        component = fixture.componentInstance;
        
        //  fake data to simulate JSON responses

        let mockData = { result: 'success',
                     data:  {
                                _id: 'abc123',
                                name: 'Vladimir Trump',
                                registered: new Date().toISOString(),
                                level: 0,
                                email: 'vladtrump@whitehouse.ru',
                            }
                   };

        let mockDataError = {
            status: 'error',
            message: 'Error message'
        };
        
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
