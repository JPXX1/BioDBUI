import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringkarteComponent } from './monitoringkarte.component';

describe('MonitoringkarteComponent', () => {
  let component: MonitoringkarteComponent;
  let fixture: ComponentFixture<MonitoringkarteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringkarteComponent]
    });
    fixture = TestBed.createComponent(MonitoringkarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
