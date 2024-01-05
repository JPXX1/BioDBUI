import { TestBed } from '@angular/core/testing';

import { AnzeigeBewertungService } from './anzeige-bewertung.service';

describe('AnzeigeBewertungService', () => {
  let service: AnzeigeBewertungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnzeigeBewertungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
