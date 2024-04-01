import { Component, OnInit } from '@angular/core';

import { Icons } from 'src/app/shared/interfaces/icons.enum';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DiagrammerService } from '../../services/diagrammer.service';
import { Diagram } from 'src/app/shared/interfaces/diagram.interface';

@Component({
  selector: 'app-diagrammer-page',
  templateUrl: './diagrammer-page.component.html',
  styleUrls: ['./diagrammer-page.component.css']
})
export class DiagrammerPageComponent implements OnInit {

  removeGrid: boolean = false;
  iconGrid: string = './assets/images/ic_no_grid.png';
  
  icon: string = Icons.success;
  title: string = '¡Guardado!';
  description: string = 'Los cambios se han guardado correctamente';
  currentDiagram?: Diagram;
  
  constructor(
    private modalService: ModalService,
    private diagrammerService: DiagrammerService,
  ) {}
  
  ngOnInit(): void {
    this.currentDiagram = this.diagrammerService.getCurrentDiagram();
  }
  
  generateLink(): void {
    const id = this.currentDiagram?.id;
    this.diagrammerService.generateTokenShare(id!).subscribe({
      next: (link) => {
        this.diagrammerService.setLink(link);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  removeGridToggle() {
    this.removeGrid = !this.removeGrid;
    this.iconGrid = this.removeGrid ? './assets/images/ic_grid.png' : './assets/images/ic_no_grid.png';
  }
  
  openModal(): void {
    this.modalService.openModal();
  }
  
  openLink(): void {
    this.generateLink();
    this.modalService.showLinkToggle();
  }
  
}
