import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3Step1Component } from './t3-step1.component';

describe('T3Step1Component', () => {
  let component: T3Step1Component;
  let fixture: ComponentFixture<T3Step1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3Step1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3Step1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
