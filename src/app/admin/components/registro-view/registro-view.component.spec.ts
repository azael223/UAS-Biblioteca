import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroViewComponent } from './registro-view.component';

describe('RegistroViewComponent', () => {
  let component: RegistroViewComponent;
  let fixture: ComponentFixture<RegistroViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
