import { TestBed } from '@angular/core/testing';

import { MainRoutesGuard } from './main-routes.guard';

describe('MainRoutesGuard', () => {
  let guard: MainRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MainRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
