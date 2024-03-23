import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

const ICON_CLIPBOARD = './assets/images/ic_clipboard.png';
const ICON_CHECK = './assets/images/ic_check.png';

@Component({
  selector: 'app-modal-link',
  templateUrl: './modal-link.component.html',
  styleUrls: ['./modal-link.component.css']
})
export class ModalLinkComponent {
  
  link: string = 'https://dgdsgfsdhfhadadfh=token';
  iconLink: string = ICON_CLIPBOARD;

  constructor(private modalService: ModalService) { }
  
  get showModal() {
    return this.modalService.showLink;
  }

  closeModal(): void {
    this.modalService.showLinkToggle();
    this.iconLink = ICON_CLIPBOARD;
  }
  
  copyLink(): void {
    this.iconLink = ICON_CHECK;
  }
  
}
