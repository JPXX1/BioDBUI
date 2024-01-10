import { TestBed } from '@angular/core/testing';

import { AnzeigenMstUebersichtService } from './anzeigen-mst-uebersicht.service';

describe('AnzeigenMstUebersichtService', () => {
  let service: AnzeigenMstUebersichtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnzeigenMstUebersichtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
