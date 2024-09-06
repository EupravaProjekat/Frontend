import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoButtonsDialogComponent } from './two-buttons-dialog.component';

describe('TwoButtonsDialogComponent', () => {
  let component: TwoButtonsDialogComponent;
  let fixture: ComponentFixture<TwoButtonsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoButtonsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TwoButtonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
