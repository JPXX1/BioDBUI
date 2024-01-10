import { TestBed } from '@angular/core/testing';

import { FarbeBewertungService } from './farbe-bewertung.service';

describe('FarbeBewertungService', () => {
  let service: FarbeBewertungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarbeBewertungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
