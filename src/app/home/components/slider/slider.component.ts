import { AfterViewInit, Component, Input } from '@angular/core';

import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { DiagramsResponse } from '../../interfaces/diagrams-response.interface';
import { DiagrammerService } from 'src/app/diagrammer/services/diagrammer.service';
import { Router } from '@angular/router';
register();

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit {
  swiper?: SwiperContainer | null;
  @Input() cards: DiagramsResponse[] = [];
  
  constructor(
    private diagrammerService: DiagrammerService,
    private router: Router,
  ) {
    
  }

  ngAfterViewInit(): void {
    // swiper element
    const swiperEl = document.querySelector('swiper-container');

    // swiper parameters
    const swiperParams: SwiperOptions = {
      slidesPerView: 1,
      // spaceBetween: 10,
      pagination: {
        enabled: true,
        // el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
      },
      navigation: {
        enabled: true,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 5,
        },
      },
    };

    Object.assign(swiperEl!, swiperParams);
    this.swiper = swiperEl;
    this.swiper?.initialize();
  }
  
  goToDiagram(diagram: DiagramsResponse) {
    this.diagrammerService.setCurrentDiagram(diagram);
    this.router.navigate(['/diagrammer']);
  }
}
