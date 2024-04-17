import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeAuthenticatedPageComponent } from './pages/home-authenticated-page/home-authenticated-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarAuthenticatedComponent } from './components/navbar-authenticated/navbar-authenticated.component';
import { SliderProjectsComponent } from './components/slider-projects/slider-projects.component';
import { SliderComponent } from './components/slider/slider.component';
import { DiagramsPageComponent } from './pages/diagrams-page/diagrams-page.component';
import { SharedModule } from '../shared/shared.module';
import { ConfigPageComponent } from './pages/config-page/config-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    HomeLayoutComponent,
    HomePageComponent,
    HomeAuthenticatedPageComponent,
    NavbarComponent,
    FooterComponent,
    NavbarAuthenticatedComponent,
    SliderProjectsComponent,
    SliderComponent,
    DiagramsPageComponent,
    ConfigPageComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CarouselModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
