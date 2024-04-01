import { TestBed } from '@angular/core/testing';

import { StammCrudService } from './stamm-crud.service';

describe('StammCrudService', () => {
  let service: StammCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StammCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
