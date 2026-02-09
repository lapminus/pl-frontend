import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsFound } from './no-results-found';

describe('NoResultsFound', () => {
  let component: NoResultsFound;
  let fixture: ComponentFixture<NoResultsFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultsFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResultsFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
