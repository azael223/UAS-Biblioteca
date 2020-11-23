import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCubiculoComponent } from './add-cubiculo.component';

describe('AddCubiculoComponent', () => {
  let component: AddCubiculoComponent;
  let fixture: ComponentFixture<AddCubiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCubiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCubiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
