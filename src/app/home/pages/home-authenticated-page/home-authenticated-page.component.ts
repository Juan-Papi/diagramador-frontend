import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';
import { HomeService } from '../../services/home.service';
import { DiagramsResponse } from '../../interfaces/diagrams-response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-authenticated-page',
  templateUrl: './home-authenticated-page.component.html',
  styleUrls: ['./home-authenticated-page.component.css']
})
export class HomeAuthenticatedPageComponent implements OnInit {
  
  public tokenForm!: FormGroup;
  public hideToken: boolean = true;

  constructor(
    private modalService: ModalService,
    private homeService: HomeService, 
    private fb: FormBuilder, 
    private validatorsService: ValidatorsService,
  ) {}
  
  ngOnInit(): void {
    this.tokenForm = this.fb.group({
      token: ['', Validators.required]
    });
  }
  
  get proyects(): DiagramsResponse[] {
    return this.homeService.proyectsList;
  }
  
  get collaborations(): DiagramsResponse[] {
    return this.homeService.collaborationsList;
  }
  
  onSubmit() {
    if (this.tokenForm.invalid) {
      this.tokenForm.markAllAsTouched();
      return;
    }
    
    const token = this.tokenForm.get('token')?.value;
    if (!token) return;
    
    this.homeService.validateToken(token).subscribe({
      next: (resp) => {
        this.hideToken = true;
        this.tokenForm.reset();
        
        Swal.fire({
          title: '¡Agregado exitosamente!',
          text: 'Se ha validado el token con exito, ahora puedes colaborar en el proyecto.',
          icon: 'success',
          timer: 1500,
        });
        
        this.homeService.getCollaborations().subscribe();
      },
      error: (errorMessage) => {
        if (errorMessage.includes('User is already a collaborator on this diagram')) {
          Swal.fire({
            title: '¡Ya eres colaborador!',
            text: 'Ya eres colaborador en este proyecto, no puedes ser colaborador dos veces.',
            icon: 'info',
            timer: 1500,
          });
          
        } else {
          Swal.fire({
            title: '¡Ooops...!',
            text: 'El token ingresado no es válido, por favor verifique el token.',
            icon: 'error',
            timer: 1500,
          });
        }
      }
    });
  }
  
  showInputToken() {
    this.hideToken = !this.hideToken;
    this.tokenForm.reset();
  }
  
  openModal() {
    this.modalService.openModalCreate();
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.tokenForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.tokenForm, field);
  }
  
}
