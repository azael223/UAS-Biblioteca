import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubiculosRegistroModalComponent } from './cubiculos-registro-modal.component';

describe('CubiculosRegistroModalComponent', () => {
  let component: CubiculosRegistroModalComponent;
  let fixture: ComponentFixture<CubiculosRegistroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CubiculosRegistroModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CubiculosRegistroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
