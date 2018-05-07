import {async, ComponentFixture, fakeAsync, tick, TestBed} from '@angular/core/testing';
import {MockBackend} from "@angular/http/testing";
import {RouterTestingModule} from '@angular/router/testing';
import {Router, Routes} from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let router: Router;

    let backend: MockBackend;
    let mockData, mockDataError: Object;
    let mockDeleteResponse, mockDeleteError: Object;

    // fake routes, we don't go anywhere anyway
    const routes: Routes = [
        {path: 'todo-edit', redirectTo: '/todo-edit', pathMatch: 'full'}
    ]

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            declarations: [AppComponent],
            providers: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        //  fake services
        router = TestBed.get(RouterTestingModule);

    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

//  not much to test here, huh?
        
});
