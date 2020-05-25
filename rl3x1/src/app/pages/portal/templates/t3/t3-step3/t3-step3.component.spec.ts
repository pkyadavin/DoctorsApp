import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3Step3Component } from './t3-step3.component';

describe('T3Step3Component', () => {
  let component: T3Step3Component;
  let fixture: ComponentFixture<T3Step3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3Step3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3Step3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
