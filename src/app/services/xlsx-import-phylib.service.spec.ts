import { TestBed } from '@angular/core/testing';

import { XlsxImportPhylibService } from './xlsx-import-phylib.service';

describe('XlsxImportPhylibService', () => {
  let service: XlsxImportPhylibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XlsxImportPhylibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
