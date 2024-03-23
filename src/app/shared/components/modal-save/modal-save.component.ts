import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-modal-save',
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.css']
})
export class ModalSaveComponent {

  constructor(private modalService: ModalService) { }
  
  get showModal() {
    return this.modalService.showModal;
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
  
  save(): void {
    this.closeModal();
    this.modalService.openAlert();
    // Swal.fire({
    //   // title: 'Success!',
    //   text: 'Los cambios se han guardado correctamente',
    //   icon: 'success',
    //   // showConfirmButton: false,
    //   timer: 1500
    // });
  }
  
}
