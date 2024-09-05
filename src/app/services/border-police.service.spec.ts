import { TestBed } from '@angular/core/testing';

import { BorderPoliceService } from './border-police.service';

describe('BorderPoliceService', () => {
  let service: BorderPoliceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorderPoliceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
