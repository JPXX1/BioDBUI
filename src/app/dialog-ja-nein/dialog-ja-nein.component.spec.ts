import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogJaNeinComponent } from './dialog-ja-nein.component';

describe('DialogJaNeinComponent', () => {
  let component: DialogJaNeinComponent;
  let fixture: ComponentFixture<DialogJaNeinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogJaNeinComponent]
    });
    fixture = TestBed.createComponent(DialogJaNeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
