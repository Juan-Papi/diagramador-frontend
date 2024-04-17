import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { HomePageComponent } from './home/pages/home-page/home-page.component';
import { DiagrammerPageComponent } from './diagrammer/pages/diagrammer-page/diagrammer-page.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: HomePageComponent,
    canActivate: [ isNotAuthenticatedGuard ],
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [ isAuthenticatedGuard ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [ isNotAuthenticatedGuard ],
  },
  {
    path: 'diagrammer',
    loadChildren: () => import('./diagrammer/diagrammer.module').then(m => m.DiagrammerModule),
    canActivate: [ isAuthenticatedGuard ],
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
