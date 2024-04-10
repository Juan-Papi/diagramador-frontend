import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import Swal from 'sweetalert2'
import { HomeService } from 'src/app/home/services/home.service';
import { DiagrammerService } from 'src/app/diagrammer/services/diagrammer.service';
import { DiagramUpdateParams } from '../../interfaces/diagram.interface';
import { DiagramsResponse } from 'src/app/home/interfaces/diagrams-response.interface';

@Component({
  selector: 'app-modal-save',
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.css']
})
export class ModalSaveComponent {

  constructor(
    private modalService: ModalService,
    private homeService: HomeService,
    private diagrammerService: DiagrammerService,
  ) { }
  
  get showModal() {
    return this.modalService.showModal;
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
  
  save(): void {
    this.updateDiagram();
    this.closeModal();
    this.modalService.openAlert();
  }
  
  updateDiagram(): void {
    const diagram: DiagramsResponse = this.diagrammerService.getCurrentDiagram()!;
    
    const params: DiagramUpdateParams = {
      id: diagram.id,
      data: diagram.data!,
    }

    this.homeService.updateDiagram(params).subscribe({
      next: (resp) => {
        if (resp) {
          this.homeService.getProyects().subscribe({
            next: (diagrams) => {
              this.homeService.setProyects(diagrams);
            },
          });
        } 
      }
    });
  }
  
}
