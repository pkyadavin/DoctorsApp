import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConinitiateComponent } from './coninitiate.component';

describe('ConinitiateComponent', () => {
  let component: ConinitiateComponent;
  let fixture: ComponentFixture<ConinitiateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConinitiateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConinitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
