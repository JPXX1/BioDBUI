import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWasserkoerperComponent } from './select-wasserkoerper.component';

describe('SelectWasserkoerperComponent', () => {
  let component: SelectWasserkoerperComponent;
  let fixture: ComponentFixture<SelectWasserkoerperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectWasserkoerperComponent]
    });
    fixture = TestBed.createComponent(SelectWasserkoerperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
