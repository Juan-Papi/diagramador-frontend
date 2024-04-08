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

  private resizingLifeline: Lifeline | null = null;

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

    // Resetea el estado
    this.resetInteractionState();

    // Primero, verifica si se hizo clic en algún controlador de redimensionamiento de línea de vida
    this.checkForLifelineResizeControl(mouseX, mouseY);

    if (!this.resizingLifeline) {
      // Procede solo si NO se está interactuando con una línea de vida
      // Luego, verifica otros tipos de interacciones como mover o redimensionar
      this.checkForOtherInteractions(mouseX, mouseY, event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isDragging && this.selectedElement) {
      this.performDragging(mouseX, mouseY);
    } else if (this.isResizing && this.selectedElement) {
      this.performResizing(mouseX, mouseY);
    } else if (this.resizingLifeline) {
      this.performLifelineResizing(mouseY);
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.resetInteractionState();
  }

  private resetInteractionState(): void {
    this.isDragging = false;
    this.isResizing = false;
    this.resizingEdges = null;
    this.selectedElement = null;
    this.resizingLifeline = null;
  }

  private checkForLifelineResizeControl(mouseX: number, mouseY: number): void {
    // Busca si el clic fue en el control de redimensionamiento de alguna línea de vida
    this.diagramElements.forEach((element) => {
      if (
        (element instanceof Actor || element instanceof ClassElement) &&
        element.lifeline.isResizeControlClicked(mouseX, mouseY)
      ) {
        this.resizingLifeline = element.lifeline;
      }
    });
  }

  private checkForOtherInteractions(
    mouseX: number,
    mouseY: number,
    event: MouseEvent
  ): void {
    // Itera sobre los elementos para ver si se debe mover o redimensionar alguno
    this.diagramElements.forEach((element) => {
      if (element instanceof Loop || element instanceof Alt) {
        const edges = element.isNearEdge(mouseX, mouseY);
        if (
          edges.nearLeftEdge ||
          edges.nearRightEdge ||
          edges.nearTopEdge ||
          edges.nearBottomEdge
        ) {
          this.selectedElement = element;
          this.isResizing = true;
          this.resizingEdges = edges;
          event.preventDefault();
          return;
        }
      }
      if (!this.isResizing && element.containsPoint(mouseX, mouseY)) {
        this.selectedElement = element;
        this.dragOffsetX = mouseX - element.x;
        this.dragOffsetY = mouseY - element.y;
        this.isDragging = true;
        event.preventDefault();
      }
    });
  }

  private performDragging(mouseX: number, mouseY: number): void {
    if (this.selectedElement) {
      // Asegura que selectedElement no es null
      const dx = mouseX - (this.selectedElement.x + this.dragOffsetX);
      const dy = mouseY - (this.selectedElement.y + this.dragOffsetY);
      this.selectedElement.move(dx, dy);
      // Ajusta dragOffset para el próximo movimiento
      this.dragOffsetX = mouseX - this.selectedElement.x;
      this.dragOffsetY = mouseY - this.selectedElement.y;
      this.render();
    }
  }

  private performResizing(mouseX: number, mouseY: number): void {
    if (this.selectedElement && this.resizingEdges) {
      const newWidth = Math.max(20, mouseX - this.selectedElement.x); // Evita tamaños negativos o demasiado pequeños
      const newHeight = Math.max(20, mouseY - this.selectedElement.y);
      this.selectedElement.resize(newWidth, newHeight);
      this.render();
    }
  }

  private performLifelineResizing(mouseY: number): void {
    // Ajusta la longitud de la línea de vida solo si se está redimensionando específicamente una línea de vida
    if (this.resizingLifeline) {
      const newLength = Math.max(20, mouseY - this.resizingLifeline.y); // La longitud debe ser al menos 20 para evitar ser demasiado pequeña
      this.resizingLifeline.resize(newLength);
      this.render();
    }
  }
}
