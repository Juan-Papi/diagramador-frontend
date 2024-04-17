import { Component } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';
import { HomeService } from '../../services/home.service';
import { DiagramsResponse } from '../../interfaces/diagrams-response.interface';

@Component({
  selector: 'app-home-authenticated-page',
  templateUrl: './home-authenticated-page.component.html',
  styleUrls: ['./home-authenticated-page.component.css']
})
export class HomeAuthenticatedPageComponent {

  constructor(
    private modalService: ModalService,
    private homeService: HomeService,  
  ) {}
  
  get proyects(): DiagramsResponse[] {
    return this.homeService.proyectsList;
  }
  
  get collaborations(): DiagramsResponse[] {
    return this.homeService.collaborationsList;
  }
  
  openModal() {
    this.modalService.openModalCreate();
  }
  
}
