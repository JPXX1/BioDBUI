import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StammWkComponent } from './stamm-wk.component';

describe('StammWkComponent', () => {
  let component: StammWkComponent;
  let fixture: ComponentFixture<StammWkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StammWkComponent]
    });
    fixture = TestBed.createComponent(StammWkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
