import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3TrackComponent } from './t3-track.component';

describe('T3TrackComponent', () => {
  let component: T3TrackComponent;
  let fixture: ComponentFixture<T3TrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3TrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3TrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
