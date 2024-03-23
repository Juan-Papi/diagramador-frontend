import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeAuthenticatedPageComponent } from './pages/home-authenticated-page/home-authenticated-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarAuthenticatedComponent } from './components/navbar-authenticated/navbar-authenticated.component';
import { SliderComponent } from './components/slider/slider.component';
import { DiagramsPageComponent } from './pages/diagrams-page/diagrams-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeLayoutComponent,
    HomePageComponent,
    HomeAuthenticatedPageComponent,
    NavbarComponent,
    FooterComponent,
    NavbarAuthenticatedComponent,
    SliderComponent,
    DiagramsPageComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
