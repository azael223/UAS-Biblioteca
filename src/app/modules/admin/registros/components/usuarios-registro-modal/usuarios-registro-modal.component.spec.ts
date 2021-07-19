import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegistroModalComponent } from './usuarios-registro-modal.component';

describe('UsuariosRegistroModalComponent', () => {
  let component: UsuariosRegistroModalComponent;
  let fixture: ComponentFixture<UsuariosRegistroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosRegistroModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosRegistroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
