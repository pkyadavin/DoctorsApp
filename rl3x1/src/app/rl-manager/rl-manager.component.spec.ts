import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlManagerComponent } from './rl-manager.component';

describe('RlManagerComponent', () => {
  let component: RlManagerComponent;
  let fixture: ComponentFixture<RlManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RlManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
