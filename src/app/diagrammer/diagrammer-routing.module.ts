import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagrammerPageComponent } from './pages/diagrammer-page/diagrammer-page.component';

const routes: Routes = [
  {
    path: '',
    // component: DiagrammerLayoutComponent,
    children: [
      // { 
      //   path: ':shareToken', 
      //   component: DiagrammerPageComponent,
      // },
      { 
        path: '', 
        component: DiagrammerPageComponent,
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
export class DiagrammerRoutingModule { }


