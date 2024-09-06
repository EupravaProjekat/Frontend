import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleWarrantComponent } from './vehicle-warrant.component';

describe('VehicleWarrantComponent', () => {
  let component: VehicleWarrantComponent;
  let fixture: ComponentFixture<VehicleWarrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleWarrantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleWarrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
