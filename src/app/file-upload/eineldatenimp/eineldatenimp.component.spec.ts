import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EineldatenimpComponent } from './eineldatenimp.component';

describe('EineldatenimpComponent', () => {
  let component: EineldatenimpComponent;
  let fixture: ComponentFixture<EineldatenimpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EineldatenimpComponent]
    });
    fixture = TestBed.createComponent(EineldatenimpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
