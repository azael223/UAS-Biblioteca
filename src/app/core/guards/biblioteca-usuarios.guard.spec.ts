import { TestBed } from '@angular/core/testing';

import { BibliotecaUsuariosGuard } from './biblioteca-usuarios.guard';

describe('BibliotecaUsuariosGuard', () => {
  let guard: BibliotecaUsuariosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BibliotecaUsuariosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
