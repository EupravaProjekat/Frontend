import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCargoRequestComponent } from './special-cargo-request.component';

describe('SpecialCargoRequestComponent', () => {
  let component: SpecialCargoRequestComponent;
  let fixture: ComponentFixture<SpecialCargoRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCargoRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialCargoRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
