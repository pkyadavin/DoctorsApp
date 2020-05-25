import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaReturnsComponent } from './ga-returns.component';

describe('GaReturnsComponent', () => {
  let component: GaReturnsComponent;
  let fixture: ComponentFixture<GaReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
