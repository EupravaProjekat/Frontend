import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDocumentRequestComponent } from './personal-document-request.component';

describe('PersonalDocumentRequestComponent', () => {
  let component: PersonalDocumentRequestComponent;
  let fixture: ComponentFixture<PersonalDocumentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDocumentRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalDocumentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
