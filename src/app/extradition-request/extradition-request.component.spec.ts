import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraditionRequestComponent } from './extradition-request.component';

describe('ExtraditionRequestComponent', () => {
  let component: ExtraditionRequestComponent;
  let fixture: ComponentFixture<ExtraditionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraditionRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtraditionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
