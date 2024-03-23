import { Component } from '@angular/core';
import { Icons } from 'src/app/shared/interfaces/icons.enum';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-diagrammer-page',
  templateUrl: './diagrammer-page.component.html',
  styleUrls: ['./diagrammer-page.component.css']
})
export class DiagrammerPageComponent {

  removeGrid: boolean = false;
  iconGrid: string = './assets/images/ic_no_grid.png';
  
  icon: string = Icons.success;
  title: string = '¡Guardado!';
  description: string = 'Los cambios se han guardado correctamente';
  
  constructor(private modalService: ModalService) {}
  
  removeGridToggle() {
    this.removeGrid = !this.removeGrid;
    this.iconGrid = this.removeGrid ? './assets/images/ic_grid.png' : './assets/images/ic_no_grid.png';
  }
  
  openModal(): void {
    this.modalService.openModal();
  }
  
  openLink(): void {
    this.modalService.showLinkToggle();
  }
  
}
