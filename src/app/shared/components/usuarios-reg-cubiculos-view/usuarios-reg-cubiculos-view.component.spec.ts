import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegCubiculosViewComponent } from './usuarios-reg-cubiculos-view.component';

describe('UsuariosRegCubiculosViewComponent', () => {
  let component: UsuariosRegCubiculosViewComponent;
  let fixture: ComponentFixture<UsuariosRegCubiculosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosRegCubiculosViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosRegCubiculosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
