import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntaryMilitaryComponent } from './voluntary-military.component';

describe('VoluntaryMilitaryComponent', () => {
  let component: VoluntaryMilitaryComponent;
  let fixture: ComponentFixture<VoluntaryMilitaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntaryMilitaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoluntaryMilitaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
