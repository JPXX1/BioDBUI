import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivStammdatenComponent } from './archiv-stammdaten.component';

describe('ArchivStammdatenComponent', () => {
  let component: ArchivStammdatenComponent;
  let fixture: ComponentFixture<ArchivStammdatenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivStammdatenComponent]
    });
    fixture = TestBed.createComponent(ArchivStammdatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
