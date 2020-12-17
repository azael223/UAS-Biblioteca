import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecElecRegistroModalComponent } from './rec-elec-registro-modal.component';

describe('RecElecRegistroModalComponent', () => {
  let component: RecElecRegistroModalComponent;
  let fixture: ComponentFixture<RecElecRegistroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecElecRegistroModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecElecRegistroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
