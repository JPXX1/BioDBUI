import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStammdatenMstComponent } from './edit-stammdaten-mst.component';

describe('EditStammdatenMstComponent', () => {
  let component: EditStammdatenMstComponent;
  let fixture: ComponentFixture<EditStammdatenMstComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditStammdatenMstComponent]
    });
    fixture = TestBed.createComponent(EditStammdatenMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
