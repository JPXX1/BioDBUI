import { TestBed } from '@angular/core/testing';

import { ValExceltabsService } from './val-exceltabs.service';

describe('ValExceltabsService', () => {
  let service: ValExceltabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValExceltabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
