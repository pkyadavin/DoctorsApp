import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaeditorComponent } from './gaeditor.component';

describe('GaeditorComponent', () => {
  let component: GaeditorComponent;
  let fixture: ComponentFixture<GaeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
