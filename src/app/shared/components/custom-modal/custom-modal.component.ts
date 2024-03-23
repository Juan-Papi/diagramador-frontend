import { Component, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent {
  
  constructor(
    private modalService: ModalService,
    private router: Router,
  ) { }
  
  get showModal() {
    return this.modalService.showModal;
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
  
  save(): void {
    this.modalService.closeModal();
    this.router.navigateByUrl('/diagrammer');
  }
  
}
