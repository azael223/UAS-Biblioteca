import { TestBed } from '@angular/core/testing';

import { RecursosElectronicosGuard } from './recursos-electronicos.guard';

describe('RecursosElectronicosGuard', () => {
  let guard: RecursosElectronicosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RecursosElectronicosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
