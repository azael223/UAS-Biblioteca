import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegistroViewComponent } from './usuarios-registro-view.component';

describe('UsuariosRegistroViewComponent', () => {
  let component: UsuariosRegistroViewComponent;
  let fixture: ComponentFixture<UsuariosRegistroViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosRegistroViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosRegistroViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
