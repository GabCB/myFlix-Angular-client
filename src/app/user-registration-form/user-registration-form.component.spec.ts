import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationFormComponent } from './user-registration-form.component';

describe('UserRegistrationFormComponent', () => {
  let component: UserRegistrationFormComponent;
  let fixture: ComponentFixture<UserRegistrationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRegistrationFormComponent]
    });
    fixture = TestBed.createComponent(UserRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
