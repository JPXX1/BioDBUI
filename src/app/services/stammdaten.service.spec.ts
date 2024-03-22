import { TestBed } from '@angular/core/testing';

import { StammdatenService } from './stammdaten.service';

describe('StammdatenService', () => {
  let service: StammdatenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StammdatenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
