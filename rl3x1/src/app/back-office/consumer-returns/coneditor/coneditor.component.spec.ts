import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConeditorComponent } from './coneditor.component';

describe('ConeditorComponent', () => {
  let component: ConeditorComponent;
  let fixture: ComponentFixture<ConeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
