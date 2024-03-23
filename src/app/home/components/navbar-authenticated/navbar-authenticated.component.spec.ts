import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAuthenticatedComponent } from './navbar-authenticated.component';

describe('NavbarAuthenticatedComponent', () => {
  let component: NavbarAuthenticatedComponent;
  let fixture: ComponentFixture<NavbarAuthenticatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarAuthenticatedComponent]
    });
    fixture = TestBed.createComponent(NavbarAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
