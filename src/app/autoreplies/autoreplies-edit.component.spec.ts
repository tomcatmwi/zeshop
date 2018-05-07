import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorepliesEditComponent } from './autoreplies-edit.component';

describe('AutorepliesEditComponent', () => {
  let component: AutorepliesEditComponent;
  let fixture: ComponentFixture<AutorepliesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorepliesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorepliesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
