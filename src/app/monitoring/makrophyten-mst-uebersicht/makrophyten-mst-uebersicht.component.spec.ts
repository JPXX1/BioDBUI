import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakrophytenMstUebersichtComponent } from './makrophyten-mst-uebersicht.component';

describe('MakrophytenMstUebersichtComponent', () => {
  let component: MakrophytenMstUebersichtComponent;
  let fixture: ComponentFixture<MakrophytenMstUebersichtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakrophytenMstUebersichtComponent]
    });
    fixture = TestBed.createComponent(MakrophytenMstUebersichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
