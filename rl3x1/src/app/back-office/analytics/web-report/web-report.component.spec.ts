import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebReportComponent } from './web-report.component';

describe('WebReportComponent', () => {
  let component: WebReportComponent;
  let fixture: ComponentFixture<WebReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
