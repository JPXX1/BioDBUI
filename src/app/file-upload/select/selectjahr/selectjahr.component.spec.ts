import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectjahrComponent } from './selectjahr.component';

describe('SelectjahrComponent', () => {
  let component: SelectjahrComponent;
  let fixture: ComponentFixture<SelectjahrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectjahrComponent]
    });
    fixture = TestBed.createComponent(SelectjahrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
