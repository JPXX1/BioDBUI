import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UebersichtTabelleComponent } from './uebersicht-tabelle.component';

describe('UebersichtTabelleComponent', () => {
  let component: UebersichtTabelleComponent;
  let fixture: ComponentFixture<UebersichtTabelleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UebersichtTabelleComponent]
    });
    fixture = TestBed.createComponent(UebersichtTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
