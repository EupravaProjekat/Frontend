import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntaryMilitaryRequestComponent } from './voluntary-military-request.component';

describe('VoluntaryMilitaryRequestComponent', () => {
  let component: VoluntaryMilitaryRequestComponent;
  let fixture: ComponentFixture<VoluntaryMilitaryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntaryMilitaryRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoluntaryMilitaryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
