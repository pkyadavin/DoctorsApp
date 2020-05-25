import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3Step2Component } from './t3-step2.component';

describe('T3Step2Component', () => {
  let component: T3Step2Component;
  let fixture: ComponentFixture<T3Step2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3Step2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3Step2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
