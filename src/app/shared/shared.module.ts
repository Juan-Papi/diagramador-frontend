import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import { ModalSaveComponent } from './components/modal-save/modal-save.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalLinkComponent } from './components/modal-link/modal-link.component';
import { AlertSuccessComponent } from './components/alert-success/alert-success.component';
import { AlertComponent } from './components/alert/alert.component';



@NgModule({
  declarations: [
    CustomModalComponent,
    ModalSaveComponent,
    ModalLinkComponent,
    AlertSuccessComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CustomModalComponent,
    ModalSaveComponent,
    ModalLinkComponent,
    AlertSuccessComponent,
    AlertComponent,
  ]
})
export class SharedModule { }
