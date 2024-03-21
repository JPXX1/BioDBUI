import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StammdatenComponent } from './stammdaten.component';

describe('StammdatenComponent', () => {
  let component: StammdatenComponent;
  let fixture: ComponentFixture<StammdatenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StammdatenComponent]
    });
    fixture = TestBed.createComponent(StammdatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
