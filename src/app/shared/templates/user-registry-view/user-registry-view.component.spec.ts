import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistryViewComponent } from './user-registry-view.component';

describe('UserRegistryViewComponent', () => {
  let component: UserRegistryViewComponent;
  let fixture: ComponentFixture<UserRegistryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRegistryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegistryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
