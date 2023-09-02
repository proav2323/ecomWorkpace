import { TestBed } from '@angular/core/testing';

import { EcomLibService } from './ecom-lib.service';

describe('EcomLibService', () => {
  let service: EcomLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcomLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
