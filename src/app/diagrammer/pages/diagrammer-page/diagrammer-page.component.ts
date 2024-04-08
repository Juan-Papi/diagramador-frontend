import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Icons } from 'src/app/shared/interfaces/icons.enum';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DiagrammerService } from '../../services/diagrammer.service';
import { Diagram } from 'src/app/shared/interfaces/diagram.interface';
import {
  Actor,
  ClassElement,
  Lifeline,
  Message,
  Loop,
  Alt,
  DiagramElement,
  RightArrow,
  LeftArrow,
} from './classes/diagram-element';
@Component({
  selector: 'app-diagrammer-page',
  templateUrl: './diagrammer-page.component.html',
  styleUrls: ['./diagrammer-page.component.css'],
})
export class DiagrammerPageComponent implements OnInit, AfterViewInit {
  removeGrid: boolean = false;
  iconGrid: string = './assets/images/ic_no_grid.png';

  icon: string = Icons.success;
  title: string = '¡Guardado!';
  description: string = 'Los cambios se han guardado correctamente';
  currentDiagram?: Diagram;

  constructor(
    private modalService: ModalService,
    private diagrammerService: DiagrammerService
  ) {}

  ngOnInit(): void {
    this.currentDiagram = this.diagrammerService.getCurrentDiagram();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    this.render(); // Dibuja inicialmente el canvas vacío o con elementos predefinidos si los hay
  }

  generateLink(): void {
    const id = this.currentDiagram?.id;
    this.diagrammerService.generateTokenShare(id!).subscribe({
      next: (link) => {
        this.diagrammerService.setLink(link);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeGridToggle() {
    this.removeGrid = !this.removeGrid;
    this.iconGrid = this.removeGrid
      ? './assets/images/ic_grid.png'
      : './assets/images/ic_no_grid.png';
  }

  openModal(): void {
    this.modalService.openModal();
  }

  openLink(): void {
    this.generateLink();
    this.modalService.showLinkToggle();
  }

  //---------------------------------------------------------------------------------------------------------------------------

  @ViewChild('canvasRef', { static: false }) canvasRef: any;

  private cx!: CanvasRenderingContext2D;
  public diagramElements: DiagramElement[] = [];
  private selectedElement: DiagramElement | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private isDragging: boolean = false; // Añade esta línea
  // Añade las nuevas propiedades
  private isResizing: boolean = false;
  private resizingEdges: {
    nearLeftEdge: boolean;
    nearRightEdge: boolean;
    nearTopEdge: boolean;
    nearBottomEdge: boolean;
  } | null = null;

  private render(): void {
    this.cx.font = '16px Arial'; // Aumenta el tamaño del texto
    this.cx.textAlign = 'center';
    if (!this.cx) return;
    this.cx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
    this.diagramElements.forEach((element) => element.draw(this.cx));
  }

  addActor(): void {
    const actor = new Actor(100, 100); // Valores ejemplo
    this.diagramElements.push(actor);
    this.render();
  }

  addClassElement(): void {
    const classElement = new ClassElement(200, 100, 150, 80, 'New Class');
    this.diagramElements.push(classElement);
    this.render();
  }

  public addMessage(): void {
    const message = new Message(100, 150, 100, 'text example'); // Coordenadas y texto de ejemplo
    this.diagramElements.push(message);
    this.render();
  }

  public addLoop(): void {
    const loop = new Loop(100, 200, 200, 100); // Valores de ejemplo para posición y tamaño
    this.diagramElements.push(loop);
    this.render(); // Actualiza el canvas
  }

  public addAlt(): void {
    const alt = new Alt(150, 250, 200, 100); // Ejemplo de posición y tamaño
    this.diagramElements.push(alt);
    this.render(); // Actualiza el canvas
  }

  public addRightArrow(): void {
    const arrow = new RightArrow(100, 200, 250); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  public addLeftArrow(): void {
    const arrow = new LeftArrow(250, 200, 100); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.selectedElement = null;
    this.isDragging = false;
    this.isResizing = false;
    this.resizingEdges = null;

    for (let element of this.diagramElements) {
      // Verifica si el clic fue cerca de un borde para redimensionar
      if ((element instanceof Loop || element instanceof Alt) && element.isNearEdge) {
        const edges = element.isNearEdge(mouseX, mouseY);
        if (edges.nearLeftEdge || edges.nearRightEdge || edges.nearTopEdge || edges.nearBottomEdge) {
          this.selectedElement = element;
          this.isResizing = true;
          this.resizingEdges = edges;
          event.preventDefault(); // Evita que el evento se propague más (por ejemplo, evitar el arrastre de la imagen del navegador)
          break; // Sale del bucle una vez que encuentra el elemento a redimensionar
        }
      }

      // Si no es redimensionamiento, verifica el arrastre
      if (!this.isResizing && element.containsPoint(mouseX, mouseY)) {
        this.selectedElement = element;
        this.dragOffsetX = mouseX - element.x;
        this.dragOffsetY = mouseY - element.y;
        this.isDragging = true;
        event.preventDefault(); // Evita acciones predeterminadas y la propagación del evento
        break; // Sale del bucle una vez que encuentra el elemento a arrastrar
      }
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.selectedElement) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isDragging) {
      const dx = mouseX - (this.selectedElement.x + this.dragOffsetX);
      const dy = mouseY - (this.selectedElement.y + this.dragOffsetY);
      this.selectedElement.move(dx, dy);
      // Ajusta dragOffset para el próximo movimiento
      this.dragOffsetX = mouseX - this.selectedElement.x;
      this.dragOffsetY = mouseY - this.selectedElement.y;
      this.render();
    } else if (
      (this.isResizing && this.selectedElement instanceof Loop) ||
      this.selectedElement instanceof Alt
    ) {
      // Aquí asumimos que tienes un método `resize` en tus clases Loop y Alt
      // Este método debería ajustar el tamaño basado en la posición actual del mouse
      const newWidth = Math.max(20, mouseX - this.selectedElement.x); // Evita tamaños negativos o demasiado pequeños
      const newHeight = Math.max(20, mouseY - this.selectedElement.y);
      this.selectedElement.resize(newWidth, newHeight);
      this.render();
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.selectedElement = null;
    }
    if (this.isResizing) {
      this.isResizing = false;
      this.resizingEdges = null; // Reinicia las aristas de redimensionado
      this.selectedElement = null; // Opcional, dependiendo de si deseas mantener seleccionado el elemento
    }
  }
}
