import { TestBed } from '@angular/core/testing';

import { VehicleWarrantService } from './vehicle-warrant.service';

describe('VehicleWarrantService', () => {
  let service: VehicleWarrantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleWarrantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
