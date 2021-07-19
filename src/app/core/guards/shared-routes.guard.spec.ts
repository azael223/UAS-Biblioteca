import { TestBed } from '@angular/core/testing';

import { SharedRoutesGuard } from './shared-routes.guard';

describe('SharedRoutesGuard', () => {
  let guard: SharedRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SharedRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
