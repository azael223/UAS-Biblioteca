import { TestBed } from '@angular/core/testing';

import { CubiculosGuard } from './cubiculos.guard';

describe('CubiculosGuard', () => {
  let guard: CubiculosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CubiculosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
