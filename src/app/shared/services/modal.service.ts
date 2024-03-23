import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  
  public showModal: boolean = false;
  public showLink: boolean = false;
  public showAlert: boolean = false;

  showLinkToggle() {
    this.showLink = !this.showLink;
  }
  
  openAlert() {
    this.showAlert = true;
    this.closeAlert();
  }
  
  closeAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 1300);
  }
  
  openModal() {
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }
  
  
}
