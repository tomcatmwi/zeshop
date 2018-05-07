import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorepliesComponent } from './autoreplies.component';

describe('AutorepliesComponent', () => {
  let component: AutorepliesComponent;
  let fixture: ComponentFixture<AutorepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
