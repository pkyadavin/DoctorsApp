import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConqueueComponent } from './conqueue.component';

describe('ConqueueComponent', () => {
  let component: ConqueueComponent;
  let fixture: ComponentFixture<ConqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
