import { TestBed } from '@angular/core/testing';

import { AnzeigeBewertungMPService } from './anzeige-bewertung-mp.service';

describe('AnzeigeBewertungMPService', () => {
  let service: AnzeigeBewertungMPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnzeigeBewertungMPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
