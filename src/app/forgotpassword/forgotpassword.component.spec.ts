import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ForgotPasswordComponent} from './forgotpassword.component';
import {JSONService} from '../services/json.service'
//import {FormValidators} from '../services/formvalidator.service'

describe('ForgotPasswordComponent', () => {
    
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;

    class MockJSONService {
        getJSON(url: string) {
           return Observable.of({ result: 'success' });
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, RouterTestingModule],
            declarations: [ForgotPasswordComponent],
            providers: [
//                            FormValidators,
                            { provide: JSONService, useValue: MockJSONService }
                       ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
