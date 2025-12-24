import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionRuleEditor } from './condition-rule-editor';

describe('ConditionRuleEditor', () => {
  let component: ConditionRuleEditor;
  let fixture: ComponentFixture<ConditionRuleEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionRuleEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionRuleEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
