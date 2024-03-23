import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLinkComponent } from './modal-link.component';

describe('ModalLinkComponent', () => {
  let component: ModalLinkComponent;
  let fixture: ComponentFixture<ModalLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLinkComponent]
    });
    fixture = TestBed.createComponent(ModalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
