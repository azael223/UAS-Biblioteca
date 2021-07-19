import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarsComponent } from './snack-bars.component';

describe('SnackBarsComponent', () => {
  let component: SnackBarsComponent;
  let fixture: ComponentFixture<SnackBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
