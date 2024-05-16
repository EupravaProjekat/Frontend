import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponDocumentComponent } from './weapon-document.component';

describe('WeaponDocumentComponent', () => {
  let component: WeaponDocumentComponent;
  let fixture: ComponentFixture<WeaponDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaponDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
