import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramsPageComponent } from './diagrams-page.component';

describe('DiagramsPageComponent', () => {
  let component: DiagramsPageComponent;
  let fixture: ComponentFixture<DiagramsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagramsPageComponent]
    });
    fixture = TestBed.createComponent(DiagramsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
