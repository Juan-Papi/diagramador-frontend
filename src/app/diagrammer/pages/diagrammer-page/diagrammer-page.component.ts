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
  CC,
  CE,
  ControlFlowElement,
  DiagramElement,
  MsjResp,
  MsjSend,
  TextBox,
  UI,
} from './classes/diagram-element';

@Component({
  selector: 'app-diagrammer-page',
  templateUrl: './diagrammer-page.component.html',
  styleUrls: ['./diagrammer-page.component.css'],
})
export class DiagrammerPageComponent implements OnInit, AfterViewInit {
  public diagramElements: DiagramElement[] = [];
  private selectedElement: DiagramElement | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  private isDragging = false;
  private createElementMode = false;
  private elementToCreateType: string | null = null;

  private resizingElement: ControlFlowElement | null = null;
  private startResizePos: { x: number; y: number } | null = null;

  @ViewChild('canvasRef', { static: false }) canvasRef: any;

  private cx!: CanvasRenderingContext2D;

  private render(): void {
    if (!this.cx) {
      return;
    }
    const canvasEl = this.canvasRef.nativeElement;
    // Limpia el canvas completo
    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // Dibuja cada elemento en diagramElements
    this.diagramElements.forEach((element) => element.draw(this.cx));
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.selectedElement = null; // Restablecer el elemento seleccionado

    // Primero, intenta encontrar un elemento seleccionado
    const foundElement = this.diagramElements.find(
      (element) =>
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
    );

    // Luego, verifica si el clic fue en el manejador de redimensionamiento
    if (
      foundElement &&
      foundElement instanceof ControlFlowElement &&
      x >= foundElement.x + foundElement.width - 10 &&
      x <= foundElement.x + foundElement.width &&
      y >= foundElement.y + foundElement.height - 10 &&
      y <= foundElement.y + foundElement.height
    ) {
      this.resizingElement = foundElement;
      this.startResizePos = { x, y };
      event.preventDefault(); // Evitar el arrastre cuando se inicia el redimensionamiento
    } else if (foundElement) {
      // Si no se intenta redimensionar, prepara el elemento para arrastre
      this.selectedElement = foundElement;
      this.offsetX = x - this.selectedElement.x;
      this.offsetY = y - this.selectedElement.y;
      this.isDragging = true;
    } else if (this.createElementMode) {
      // Si no se encontró un elemento, verifica si estamos en modo creación
      this.createElement(event);
    }
  }

  private createElement(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let newElement: DiagramElement | null = null;

    // Crear elemento basado en elementToCreateType
    if (this.elementToCreateType === 'Actor') {
      newElement = new Actor(x, y, './assets/images/ic_patron.png', 50, 100);
    }

    if (this.elementToCreateType === 'UI') {
      newElement = new UI(x, y, './assets/images/ic_atm.png', 50, 100);
    }

    if (this.elementToCreateType === 'CC') {
      newElement = new CC(x, y, './assets/images/ic_control.png', 50, 100);
    }

    if (this.elementToCreateType === 'CE') {
      newElement = new CE(x, y, './assets/images/ic_database.png', 50, 100);
    }

    if (this.elementToCreateType === 'MsjSend') {
      newElement = new MsjSend(
        x,
        y,
        './assets/images/ic_msj_asincrono.png',
        50,
        100
      );
    }

    if (this.elementToCreateType === 'MsjResp') {
      newElement = new MsjResp(
        x,
        y,
        './assets/images/ic_msj_respuesta_asincrono.png',
        50,
        100
      );
    }

    if (newElement) {
      this.diagramElements.push(newElement);
      this.selectedElement = newElement; // Selecciona el nuevo elemento para arrastre
      this.isDragging = true; // Indica que se está arrastrando un elemento
      this.createElementMode = false; // Sale del modo creación después de crear un elemento
    }
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizingElement && this.startResizePos) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
      const widthChange = currentX - this.startResizePos.x;
      const heightChange = currentY - this.startResizePos.y;

      this.resizingElement.width += widthChange;
      this.resizingElement.height += heightChange;

      this.startResizePos = { x: currentX, y: currentY }; // Actualizar para el próximo movimiento
      this.render();
    } else if (this.isDragging && this.selectedElement) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.selectedElement.x = x - this.offsetX;
      this.selectedElement.y = y - this.offsetY;
      this.render();
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.selectedElement = null;
    if (this.resizingElement) {
      this.resizingElement = null;
      this.startResizePos = null;
    }
  }

  mostrarActor(): void {
    if (!this.isDragging) {
      // Solo activa modo creación si no está arrastrando
      this.createElementMode = true;
      this.elementToCreateType = 'Actor';
    }
  }

  mostrarUI(): void {
    if (!this.isDragging) {
      this.createElementMode = true;
      this.elementToCreateType = 'UI';
    }
  }

  mostrarCC(): void {
    if (!this.isDragging) {
      this.createElementMode = true;
      this.elementToCreateType = 'CC';
    }
  }

  mostrarCE(): void {
    if (!this.isDragging) {
      this.createElementMode = true;
      this.elementToCreateType = 'CE';
    }
  }

  mostrarMsjSend(): void {
    if (!this.isDragging) {
      this.createElementMode = true;
      this.elementToCreateType = 'MsjSend';
    }
  }

  mostrarMsjResp(): void {
    if (!this.isDragging) {
      this.createElementMode = true;
      this.elementToCreateType = 'MsjResp';
    }
  }

  crearLoop(): void {
    const loop = new ControlFlowElement(100, 100, 200, 100, 'loop');
    this.diagramElements.push(loop);
    this.render();
  }

  crearAlt(): void {
    const alt = new ControlFlowElement(100, 200, 200, 150, 'alt', 'alt');
    this.diagramElements.push(alt);
    this.render();
  }

  insertarTexto(): void {
    // Asumiendo que se crea en una posición y tamaño predeterminado
    const textBox = new TextBox(100, 100, 150, 50, 'Edita este texto...');
    this.diagramElements.push(textBox);
    this.render();
  }

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
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    this.render(); // Asegúrate de que render se llama después de la inicialización
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

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Encuentra si un TextBox fue clickeado
    const clickedTextBox = this.diagramElements.find(
      (element) =>
        element instanceof TextBox &&
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
    ) as TextBox;

    if (clickedTextBox) {
      const newText = prompt('Edita el texto:', clickedTextBox.text);
      if (newText !== null && newText.trim() !== '') {
        clickedTextBox.text = newText;
        this.render();
      }
    }
  }
}
