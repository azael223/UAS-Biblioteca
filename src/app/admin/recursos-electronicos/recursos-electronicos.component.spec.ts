import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosElectronicosComponent } from './recursos-electronicos.component';

describe('RecursosElectronicosComponent', () => {
  let component: RecursosElectronicosComponent;
  let fixture: ComponentFixture<RecursosElectronicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosElectronicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosElectronicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
