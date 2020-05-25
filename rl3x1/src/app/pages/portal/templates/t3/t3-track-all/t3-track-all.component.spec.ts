import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3TrackAllComponent } from './t3-track-all.component';

describe('T3TrackAllComponent', () => {
  let component: T3TrackAllComponent;
  let fixture: ComponentFixture<T3TrackAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3TrackAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3TrackAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
