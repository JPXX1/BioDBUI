import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakorphytenTabelleComponent } from './makorphyten-tabelle.component';

describe('MakorphytenTabelleComponent', () => {
  let component: MakorphytenTabelleComponent;
  let fixture: ComponentFixture<MakorphytenTabelleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakorphytenTabelleComponent]
    });
    fixture = TestBed.createComponent(MakorphytenTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
