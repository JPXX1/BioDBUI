import { TestBed } from '@angular/core/testing';

import { ImpFormsPhylibServ } from './impformenphylib.service';

describe('ImpEinheitPhylibService', () => {
  let service: ImpFormsPhylibServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpFormsPhylibServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
