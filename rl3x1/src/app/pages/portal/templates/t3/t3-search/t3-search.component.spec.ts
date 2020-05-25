import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3SearchComponent } from './t3-search.component';

describe('T3SearchComponent', () => {
  let component: T3SearchComponent;
  let fixture: ComponentFixture<T3SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3SearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
