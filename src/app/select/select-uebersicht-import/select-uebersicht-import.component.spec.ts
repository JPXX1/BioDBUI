import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUebersichtImportComponent } from './select-uebersicht-import.component';

describe('SelectUebersichtImportComponent', () => {
  let component: SelectUebersichtImportComponent;
  let fixture: ComponentFixture<SelectUebersichtImportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectUebersichtImportComponent]
    });
    fixture = TestBed.createComponent(SelectUebersichtImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
