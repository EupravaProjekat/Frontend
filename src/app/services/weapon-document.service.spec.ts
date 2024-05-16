import { TestBed } from '@angular/core/testing';

import { WeaponDocumentService } from './weapon-document.service';

describe('WeaponDocumentService', () => {
  let service: WeaponDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
