import { TestBed } from '@angular/core/testing';

import { CubiculosUsuariosGuard } from './cubiculos-usuarios.guard';

describe('CubiculosUsuariosGuard', () => {
  let guard: CubiculosUsuariosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CubiculosUsuariosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
