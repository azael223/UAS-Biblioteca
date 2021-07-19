import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubiculosComponent } from './cubiculos.component';

describe('CubiculosComponent', () => {
  let component: CubiculosComponent;
  let fixture: ComponentFixture<CubiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CubiculosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CubiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
