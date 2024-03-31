import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../services/validators.service';
import { DiagramsResponse } from 'src/app/home/interfaces/diagrams-response.interface';
import Swal from 'sweetalert2';
import { HomeService } from 'src/app/home/services/home.service';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css'],
})
export class CustomModalComponent implements OnInit {
  diagramForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private homeService: HomeService,
    private router: Router,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
  ) {}

  ngOnInit(): void {
    this.diagramForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.modalService.isEditing$.subscribe((isEditing) => {
      if (isEditing) {
        this.diagramForm.patchValue({
          name: this.diagram?.name,
          description: this.diagram?.description,
        });
      } else {
        this.diagramForm.reset();
      }
    });
  }

  get showModal(): boolean {
    return this.modalService.showModal;
  }

  get diagram(): DiagramsResponse | undefined {
    return this.modalService.diagram;
  }

  get isEditing(): boolean {
    return this.modalService.isEditing;
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.diagramForm.reset();
  }

  onSubmit(): void {
    if (this.diagramForm.invalid) {
      this.diagramForm.markAllAsTouched();
      return;
    }
    if (this.isEditing) {
      this.updateDiagram();
    } else {
      this.saveDiagram();
    }
  }

  saveDiagram(): void {
    const { name, description } = this.diagramForm.value;

    this.modalService.createDiagram(name, description).subscribe({
      next: (res) => {
        if (res) {
          this.modalService.closeModal();
          this.router.navigateByUrl('/diagrammer');
          this.diagramForm.reset();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateDiagram(): void {
    const id = this.diagram!.id;
    const { name, description } = this.diagramForm.value;

    this.homeService.updateDiagram(id, name, description).subscribe({
      next: (resp) => {
        if (resp) {
          this.homeService.getProyects().subscribe({
            next: (diagrams) => {
              this.homeService.setProyects(diagrams);
            },
          });
          this.modalService.closeModal();
          this.router.navigateByUrl('/home/diagrams');
          this.diagramForm.reset();
          Swal.fire({
            title: '¡Actualizado!',
            text: 'Tu proyecto a sido actualizado.',
            icon: 'success',
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo actualizar el proyecto.',
            icon: 'error',
            timer: 1500,
          });
        }
      },
      error: () => {
        Swal.fire({
          title: '¡Error!',
          text: 'No se pudo actualizar el proyecto.',
          icon: 'error',
          timer: 1500,
        });
      },
    });
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.diagramForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.diagramForm, field);
  }
}
