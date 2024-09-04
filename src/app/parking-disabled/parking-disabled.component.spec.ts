import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingDisabledComponent } from './parking-disabled.component';

describe('ParkingDisabledComponent', () => {
  let component: ParkingDisabledComponent;
  let fixture: ComponentFixture<ParkingDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingDisabledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
