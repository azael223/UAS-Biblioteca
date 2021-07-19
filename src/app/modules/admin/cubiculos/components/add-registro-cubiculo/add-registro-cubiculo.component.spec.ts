import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistroCubiculoComponent } from './add-registro-cubiculo.component';

describe('AddRegistroCubiculoComponent', () => {
  let component: AddRegistroCubiculoComponent;
  let fixture: ComponentFixture<AddRegistroCubiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegistroCubiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegistroCubiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
