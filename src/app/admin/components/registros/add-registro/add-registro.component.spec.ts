import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistroComponent } from './add-registro.component';

describe('AddRegistroComponent', () => {
  let component: AddRegistroComponent;
  let fixture: ComponentFixture<AddRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
