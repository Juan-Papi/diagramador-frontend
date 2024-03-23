import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagrammerRoutingModule } from './diagrammer-routing.module';
import { DiagrammerPageComponent } from './pages/diagrammer-page/diagrammer-page.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DiagrammerPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DiagrammerRoutingModule,
    SharedModule,
  ]
})
export class DiagrammerModule { }
