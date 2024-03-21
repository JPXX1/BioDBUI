import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StammMessstellenComponent } from './stamm-messstellen.component';

describe('StammMessstellenComponent', () => {
  let component: StammMessstellenComponent;
  let fixture: ComponentFixture<StammMessstellenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StammMessstellenComponent]
    });
    fixture = TestBed.createComponent(StammMessstellenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
