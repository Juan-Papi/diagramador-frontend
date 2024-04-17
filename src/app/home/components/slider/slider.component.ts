import { AfterViewInit, Component, Input } from '@angular/core';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { DiagramsResponse } from '../../interfaces/diagrams-response.interface';
import { DiagrammerService } from 'src/app/diagrammer/services/diagrammer.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit {
  @Input() cards: DiagramsResponse[] = [];
  
  constructor(
    private diagrammerService: DiagrammerService,
    private router: Router,
  ) {
    
  }

  ngAfterViewInit(): void {
  }
  
  customOptions: OwlOptions = {
    loop: false,
    items: 5,
    margin: 18,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    dotsEach: true,
    autoWidth: true,
    nav: true,
    navSpeed: 500,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      1024: {
        items: 5,
      },
    },
  };
  
  goToDiagram(diagram: DiagramsResponse) {
    this.diagrammerService.setCurrentDiagram(diagram);
    this.router.navigate(['/diagrammer']);
  }
  
}
