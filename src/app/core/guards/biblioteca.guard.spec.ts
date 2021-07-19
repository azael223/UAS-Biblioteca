import { TestBed } from '@angular/core/testing';

import { BibliotecaGuard } from './biblioteca.guard';

describe('BibliotecaGuard', () => {
  let guard: BibliotecaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BibliotecaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
