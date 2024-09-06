import { TestBed } from '@angular/core/testing';

import { ProsecutionServiceService } from './prosecution-service.service';

describe('ProsecutionServiceService', () => {
  let service: ProsecutionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProsecutionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
