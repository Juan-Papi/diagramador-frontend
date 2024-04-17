import { Component } from '@angular/core';
import { HomeService } from '../../services/home.service';
import Swal from 'sweetalert2';
import { Collaborator, DiagramsResponse } from '../../interfaces/diagrams-response.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DiagrammerService } from 'src/app/diagrammer/services/diagrammer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diagrams-page',
  templateUrl: './diagrams-page.component.html',
  styleUrls: ['./diagrams-page.component.css']
})
export class DiagramsPageComponent {

  page: number = 1;
  limit: number = 10;
  searchForm!: FormGroup;
  projects: DiagramsResponse[] = [];
  
  constructor(
    private homeService: HomeService,
    private modalService: ModalService,
    private diagrammerService: DiagrammerService,
    private fb: FormBuilder,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: [''],
      date: [''],
    });
    
    this.homeService.projects$.subscribe((diagrams) => {
      this.projects = diagrams;
    })
    
    this.projects = [...this.diagrams];
    
    this.searchForm.valueChanges.subscribe(() => {
      let { search, date } = this.searchForm.value;
      date = this.formatDateInput(date);
      this.filterProjects(search, date);
    });
    
  }
  
  get diagrams(): DiagramsResponse[] {
    return this.homeService.proyectsList;
  }
  
  goToDiagram(diagram: DiagramsResponse) {
    this.diagrammerService.setCurrentDiagram(diagram);
    this.router.navigate(['/diagrammer']);
  }
  
  deleteProyect(id: number): void {
    this.showConfirmationDialog().then((confirmed) => {
      if (confirmed) {
        this.homeService.deleteProyect(id).subscribe({
          next: (resp) => {
            if (resp) {
              // Actualizar la tabla si la eliminación fue exitosa
              const data = this.projects.filter(item => item.id !== id);
              this.projects = data;
              this.homeService.setProyects(data);
              Swal.fire({
                title: '¡Eliminado!',
                text: 'Tu proyecto a sido eliminado.',
                icon: 'success',
                timer: 1500
              });
            } else {
              Swal.fire({
                title: '¡Error!',
                text: 'No se pudo eliminar el proyecto.',
                icon: 'error',
                timer: 1500
              });
            }
          },
          error: () => {
            Swal.fire({
              title: '¡Error!',
              text: 'No se pudo eliminar el proyecto.',
              icon: 'error',
              timer: 1500
            });
          }
        });
      }
    });
  }
  
  showConfirmationDialog(): Promise<boolean> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  
  openModalEdit(diagram: DiagramsResponse): void {
    this.modalService.openModalEdit(diagram);
  }
  
  // Filtra los proyectos por nombre y fecha
  filterProjects(searchTerm: string, searchDate: string) {
    this.projects = [...this.diagrams];
    if (searchTerm !== '' && searchDate !== '') {
      this.projects = this.diagrams.filter(project => {
        const date = this.formatDate(project.createdAt);
        return project.name.toLowerCase().includes(searchTerm.toLowerCase()) && date.includes(searchDate)
      });
    } else if (searchDate !== '') {
      this.projects = this.diagrams.filter(project => {
        const date = this.formatDate(project.createdAt);
        return date.includes(searchDate)
      });
    } else if (searchTerm !== '') {
      this.projects = this.diagrams.filter(project => {
        return project.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    this.page = 1;
  }
  
  // Formatea la fecha en formato 'dd/mm/yyyy'
  formatDate(date: string): string {
    const fechaRecibida = new Date(date);
    const fechaFormateada = fechaRecibida.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      // fractionalSecondDigits: 3, // Para incluir milisegundos
    });
    return fechaFormateada;
  }
  
  formatDateInput(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const partes = dateString.split('-');
    const nuevaFecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
    return nuevaFecha;
  }
  
  getCollaboratorNames(collaborators: Collaborator[] | undefined): string {
    if (collaborators === undefined) return '';
    return collaborators.map(collaborator => `${collaborator.user.name} ${collaborator.user.lastName}`).join(', ');
  }
  
  
}
