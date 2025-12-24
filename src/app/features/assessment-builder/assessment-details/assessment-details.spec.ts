import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDetails } from './assessment-details';

describe('AssessmentDetails', () => {
  let component: AssessmentDetails;
  let fixture: ComponentFixture<AssessmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
