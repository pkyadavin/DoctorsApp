import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerReturnsComponent } from './consumer-returns.component';

describe('ConsumerReturnsComponent', () => {
  let component: ConsumerReturnsComponent;
  let fixture: ComponentFixture<ConsumerReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
