import { TestBed } from '@angular/core/testing';

import { AssessmentDraftService } from './assessment-draft-service';

describe('AssessmentDraftService', () => {
  let service: AssessmentDraftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentDraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
