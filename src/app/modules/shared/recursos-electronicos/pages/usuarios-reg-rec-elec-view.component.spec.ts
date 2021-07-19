import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegRecElecViewComponent } from './usuarios-reg-rec-elec-view.component';

describe('UsuariosRegRecElecViewComponent', () => {
  let component: UsuariosRegRecElecViewComponent;
  let fixture: ComponentFixture<UsuariosRegRecElecViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosRegRecElecViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosRegRecElecViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
