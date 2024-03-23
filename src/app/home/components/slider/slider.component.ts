import { AfterViewInit, Component } from '@angular/core';

import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
register();

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit {
  swiper?: SwiperContainer | null;

  cards = [
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
    {
      img: './assets/images/bg-01.jpg',
      title: 'Proyecto: Ingeniería N° 1',
      description: 'Colaboradores: Diego Guzman, Laura Gomez, Juan Perez, Maria Lopez',
      fecha: 'Fecha: 23 Marzo 2024',
    },
  ];

  ngAfterViewInit(): void {
    // swiper element
    const swiperEl = document.querySelector('swiper-container');

    // swiper parameters
    const swiperParams: SwiperOptions = {
      slidesPerView: 1,
      // spaceBetween: 10,
      // pagination: true,
      pagination: {
        enabled: true,
        el: '.swiper-pagination',
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
      on: {
        init() {
          // ...
        },
      },
    };

    Object.assign(swiperEl!, swiperParams);
    this.swiper = swiperEl;
    this.swiper?.initialize();
  }
}
