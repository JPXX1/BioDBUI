import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProbenehmerComponent } from './select-probenehmer.component';

describe('SelectProbenehmerComponent', () => {
  let component: SelectProbenehmerComponent;
  let fixture: ComponentFixture<SelectProbenehmerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProbenehmerComponent]
    });
    fixture = TestBed.createComponent(SelectProbenehmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
