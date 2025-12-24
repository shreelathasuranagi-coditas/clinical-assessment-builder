import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionType } from './question-type';

describe('QuestionType', () => {
  let component: QuestionType;
  let fixture: ComponentFixture<QuestionType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
