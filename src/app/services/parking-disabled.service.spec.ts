import { TestBed } from '@angular/core/testing';

import { ParkingDisabledService } from './parking-disabled.service';

describe('ParkingDisabledService', () => {
  let service: ParkingDisabledService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingDisabledService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
