import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegRecElecComponent } from './usuarios-reg-rec-elec.component';

describe('UsuariosRegRecElecComponent', () => {
  let component: UsuariosRegRecElecComponent;
  let fixture: ComponentFixture<UsuariosRegRecElecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosRegRecElecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosRegRecElecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
