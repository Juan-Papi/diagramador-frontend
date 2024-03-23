import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagrammerPageComponent } from './diagrammer-page.component';

describe('DiagrammerPageComponent', () => {
  let component: DiagrammerPageComponent;
  let fixture: ComponentFixture<DiagrammerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagrammerPageComponent]
    });
    fixture = TestBed.createComponent(DiagrammerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
