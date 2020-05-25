import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlHomeComponent } from './rl-home.component';

describe('RlHomeComponent', () => {
  let component: RlHomeComponent;
  let fixture: ComponentFixture<RlHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RlHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
