import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCourse } from './enrolled-course';

describe('EnrolledCourse', () => {
  let component: EnrolledCourse;
  let fixture: ComponentFixture<EnrolledCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolledCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
