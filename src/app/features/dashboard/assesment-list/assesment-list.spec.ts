import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentList } from './assesment-list';

describe('AssesmentList', () => {
  let component: AssesmentList;
  let fixture: ComponentFixture<AssesmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
