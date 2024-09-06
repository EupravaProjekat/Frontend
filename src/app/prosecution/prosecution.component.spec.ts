import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsecutionComponent } from './prosecution.component';

describe('ProsecutionComponent', () => {
  let component: ProsecutionComponent;
  let fixture: ComponentFixture<ProsecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProsecutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProsecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
