import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingDisabledRequestComponent } from './parking-disabled-request.component';

describe('ParkingDisabledRequestComponent', () => {
  let component: ParkingDisabledRequestComponent;
  let fixture: ComponentFixture<ParkingDisabledRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingDisabledRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingDisabledRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
