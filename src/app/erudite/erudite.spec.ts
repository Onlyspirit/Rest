import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erudite } from './erudite';

describe('Erudite', () => {
  let component: Erudite;
  let fixture: ComponentFixture<Erudite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erudite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Erudite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
