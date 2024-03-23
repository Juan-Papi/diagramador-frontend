import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-alert-success',
  templateUrl: './alert-success.component.html',
  styleUrls: ['./alert-success.component.css']
})
export class AlertSuccessComponent implements OnInit {
  
  @Input() icon?: string;
  @Input() title?: string;
  @Input() description?: string;
  
  constructor(private modalService: ModalService) {
    // console.log(this.icon, this.title, this.description);
  }
  
  ngOnInit(): void {
    // this.closeAlert();
  }
  
  get showAlert() {
    return this.modalService.showAlert;
  }
  
  // closeAlert(): void {
  //   console.log(this.showAlert);
  //   if (this.showAlert) {
  //     setTimeout(() => {
  //       this.modalService.closeAlert();
  //     }, 3000);
  //   }
  // }
  
}
