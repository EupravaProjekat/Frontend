import { TestBed } from '@angular/core/testing';

import { VoluntaryMilitaryService } from './voluntary-military.service';

describe('VoluntaryMilitaryService', () => {
  let service: VoluntaryMilitaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoluntaryMilitaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
