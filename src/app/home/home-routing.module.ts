import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { HomeAuthenticatedPageComponent } from './pages/home-authenticated-page/home-authenticated-page.component';
import { DiagramsPageComponent } from './pages/diagrams-page/diagrams-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { 
        path: '', 
        component: HomeAuthenticatedPageComponent,
      },
      {
        path: 'diagrams',
        component: DiagramsPageComponent,
      },
      { 
        path: '**', 
        redirectTo: '/' 
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
