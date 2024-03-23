import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import { ModalSaveComponent } from './components/modal-save/modal-save.component';
import { FormsModule } from '@angular/forms';
import { ModalLinkComponent } from './components/modal-link/modal-link.component';
import { AlertSuccessComponent } from './components/alert-success/alert-success.component';



@NgModule({
  declarations: [
    CustomModalComponent,
    ModalSaveComponent,
    ModalLinkComponent,
    AlertSuccessComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    CustomModalComponent,
    ModalSaveComponent,
    ModalLinkComponent,
    AlertSuccessComponent,
  ]
})
export class SharedModule { }
