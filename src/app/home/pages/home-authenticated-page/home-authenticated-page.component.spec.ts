import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAuthenticatedPageComponent } from './home-authenticated-page.component';

describe('HomeAuthenticatedPageComponent', () => {
  let component: HomeAuthenticatedPageComponent;
  let fixture: ComponentFixture<HomeAuthenticatedPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeAuthenticatedPageComponent]
    });
    fixture = TestBed.createComponent(HomeAuthenticatedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
