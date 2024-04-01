import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { DiagrammerService } from 'src/app/diagrammer/services/diagrammer.service';
import { Link } from 'src/app/diagrammer/interfaces/link.interface';
import { ClipboardService } from 'ngx-clipboard';

const ICON_CLIPBOARD = './assets/images/ic_clipboard.png';
const ICON_CHECK = './assets/images/ic_check.png';

@Component({
  selector: 'app-modal-link',
  templateUrl: './modal-link.component.html',
  styleUrls: ['./modal-link.component.css']
})
export class ModalLinkComponent implements OnInit {
  
  link?: Link;
  iconLink: string = ICON_CLIPBOARD;

  constructor(
    private modalService: ModalService,
    private diagrammerService: DiagrammerService,
    private _clipboardService: ClipboardService,
  ) { }
  
  ngOnInit(): void {
    this.diagrammerService.getLink().subscribe((link) => {
      this.link = link;
    })
  }
  
  get showModal() {
    return this.modalService.showLink;
  }

  closeModal(): void {
    this.modalService.showLinkToggle();
    this.iconLink = ICON_CLIPBOARD;
  }
  
  copyLink(): void {
    if (!this.link) return;
    this.iconLink = ICON_CHECK;
    this._clipboardService.copy(this.link.shareUrl);
  }
  
}
