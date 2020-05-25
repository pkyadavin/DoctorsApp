import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseValidationComponent } from './case-validation.component';

describe('CaseValidationComponent', () => {
  let component: CaseValidationComponent;
  let fixture: ComponentFixture<CaseValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
