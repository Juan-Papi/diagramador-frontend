import { Component } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-home-authenticated-page',
  templateUrl: './home-authenticated-page.component.html',
  styleUrls: ['./home-authenticated-page.component.css']
})
export class HomeAuthenticatedPageComponent {

  constructor(private modalService: ModalService) {}
  
  openModal() {
    this.modalService.openModal();
  }
  
}
