import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStammdatenWkComponent } from './edit-stammdaten-wk.component';

describe('EditStammdatenWkComponent', () => {
  let component: EditStammdatenWkComponent;
  let fixture: ComponentFixture<EditStammdatenWkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditStammdatenWkComponent]
    });
    fixture = TestBed.createComponent(EditStammdatenWkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
