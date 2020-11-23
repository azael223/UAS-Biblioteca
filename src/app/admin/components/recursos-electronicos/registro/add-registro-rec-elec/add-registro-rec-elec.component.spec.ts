import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistroRecElecComponent } from './add-registro-rec-elec.component';

describe('AddRegistroRecElecComponent', () => {
  let component: AddRegistroRecElecComponent;
  let fixture: ComponentFixture<AddRegistroRecElecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegistroRecElecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegistroRecElecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
