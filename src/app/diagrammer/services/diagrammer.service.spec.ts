import { TestBed } from '@angular/core/testing';

import { DiagrammerService } from './diagrammer.service';

describe('DiagrammerService', () => {
  let service: DiagrammerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagrammerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
