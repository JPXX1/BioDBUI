import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTableMptypComponent } from './editable-table-mptyp.component';

describe('EditableTableMptypComponent', () => {
  let component: EditableTableMptypComponent;
  let fixture: ComponentFixture<EditableTableMptypComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditableTableMptypComponent]
    });
    fixture = TestBed.createComponent(EditableTableMptypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
