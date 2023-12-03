import { TestBed } from '@angular/core/testing';

import { FetchservicePhylibService } from './fetchservice-phylib.service';

describe('FetchservicePhylibService', () => {
  let service: FetchservicePhylibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchservicePhylibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
