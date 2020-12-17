import { TestBed } from '@angular/core/testing';

import { RecursosElectronicosUsuariosGuard } from './recursos-electronicos-usuarios.guard';

describe('RecursosElectronicosUsuariosGuard', () => {
  let guard: RecursosElectronicosUsuariosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RecursosElectronicosUsuariosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
