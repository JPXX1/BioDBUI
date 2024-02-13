import { TestBed } from '@angular/core/testing';

import { PerlodesimportService } from './perlodesimport.service';

describe('PerlodesimportService', () => {
  let service: PerlodesimportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerlodesimportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
