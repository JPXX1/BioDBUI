import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivStammdatenWkComponent } from './archiv-stammdaten-wk.component';

describe('ArchivStammdatenWkComponent', () => {
  let component: ArchivStammdatenWkComponent;
  let fixture: ComponentFixture<ArchivStammdatenWkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivStammdatenWkComponent]
    });
    fixture = TestBed.createComponent(ArchivStammdatenWkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
