import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegCubiculosComponent } from './usuarios-reg-cubiculos.component';

describe('UsuariosRegCubiculosComponent', () => {
  let component: UsuariosRegCubiculosComponent;
  let fixture: ComponentFixture<UsuariosRegCubiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosRegCubiculosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosRegCubiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
