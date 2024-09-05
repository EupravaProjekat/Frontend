import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialVehicleComponent } from './special-vehicle.component';

describe('SpecialVehicleComponent', () => {
  let component: SpecialVehicleComponent;
  let fixture: ComponentFixture<SpecialVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
