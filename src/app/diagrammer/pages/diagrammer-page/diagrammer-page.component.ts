import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Icons } from 'src/app/shared/interfaces/icons.enum';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DiagrammerService } from '../../services/diagrammer.service';
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
  RightArrowSync,
  RightArrowRecursive,
  Arrow,
} from './classes/diagram-element';
import { DiagramsResponse } from 'src/app/home/interfaces/diagrams-response.interface';
import { SocketService } from './socket-client';
import { EMPTY, Subscription } from 'rxjs';
@Component({
  selector: 'app-diagrammer-page',
  templateUrl: './diagrammer-page.component.html',
  styleUrls: ['./diagrammer-page.component.css'],
})
export class DiagrammerPageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  removeGrid: boolean = false;
  iconGrid: string = './assets/images/ic_no_grid.png';

  icon: string = Icons.success;
  title: string = '¡Guardado!';
  description: string = 'Los cambios se han guardado correctamente';
  currentDiagram?: DiagramsResponse;
  private eventsSubscription: Subscription = EMPTY.subscribe();
  private clientsSubscription: Subscription = new Subscription();
  clientList: string[] = []; // Almacenar los clientes
  serverStatus: string = 'disconnected';
  private connectionSub: Subscription = EMPTY.subscribe();

  constructor(
    private modalService: ModalService,
    private diagrammerService: DiagrammerService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.currentDiagram = this.diagrammerService.getCurrentDiagram();
    // Subscribe to 'updateDiagram' events from the server
    this.eventsSubscription = this.socketService
      .getMessage('updateDiagram')
      .subscribe({
        next: (data: any) => {
          this.loadDiagramState(data);
        },
        error: (error) => {
          console.error('Failed to receive updates:', error);
        },
      });

    this.connectionSub = this.socketService.onConnectionChange.subscribe(
      (status) => {
        this.serverStatus = status;
      }
    );

    this.clientsSubscription = this.socketService.onClientsUpdated.subscribe(
      (clients) => {
        this.clientList = clients; // Actualizar la lista de clientes
      }
    );
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
    this.clientsSubscription.unsubscribe();
    this.socketService.closeConnection();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    if (this.currentDiagram?.data) {
      this.loadDiagramState(this.currentDiagram.data);
    }
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
    const data = this.saveDiagramState();
    this.diagrammerService.setDataCurrentDiagram(data);
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

  private resizingEnd: 'start' | 'end' | null = null; // Add this line

  private render(): void {
    this.cx.font = '16px Arial'; // Aumenta el tamaño del texto
    this.cx.textAlign = 'center';
    this.cx.lineWidth = 2; // Aumenta el grosor de la línea
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
    //const arrow = new RightArrowSync(100, 200, 250); // Posición y longitud ejemplo
    // const arrow = new RightArrowRecursive(100, 200, 250); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  public addLeftArrow(): void {
    const arrow = new LeftArrow(250, 200, 100); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  public addRightArrowSync(): void {
    const arrow = new RightArrowSync(100, 200, 250); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  public addRightArrowRecursive(): void {
    const arrow = new RightArrowRecursive(100, 200, 250); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.resetInteractionState();

    // Primero, verifica si se hizo clic en algún controlador de redimensionamiento de línea de vida
    this.checkForLifelineResizeControl(mouseX, mouseY);

    if (!this.resizingLifeline) {
      // Procede solo si NO se está interactuando con una línea de vida
      // Luego, verifica otros tipos de interacciones como mover o redimensionar
      this.checkForOtherInteractions(mouseX, mouseY, event);
    }

    this.diagramElements.forEach((element) => {
      if (element instanceof Arrow) {
        const nearEnd = element.isNearEnds(mouseX, mouseY);
        if (nearEnd) {
          this.selectedElement = element;
          this.isResizing = true;
          this.resizingEnd = nearEnd; // 'start' o 'end'
          event.preventDefault();
          return;
        }
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isResizing && this.selectedElement instanceof Arrow) {
      if (this.resizingEnd === 'end') {
        this.selectedElement.endX = mouseX; // Actualiza directamente el extremo 'endX'
        this.render();
      } else if (this.resizingEnd === 'start') {
        const dx = mouseX - this.selectedElement.x;
        this.selectedElement.move(dx, 0); // Mueve la flecha entera si se arrastra el inicio
        this.render();
      }
    } else {
      if (this.isDragging && this.selectedElement) {
        this.performDragging(mouseX, mouseY);
      } else if (this.isResizing && this.selectedElement) {
        this.performResizing(mouseX, mouseY);
      } else if (this.resizingLifeline) {
        this.performLifelineResizing(mouseY);
      }
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
    this.resizingEnd = null; // Reset resizing end
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
  //Edicion de textos
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    this.selectedElement = this.getElementAtPosition(mouseX, mouseY);

    if (this.selectedElement) {
      this.editElementText(this.selectedElement);
    }
  }

  private editElementText(element: DiagramElement): void {
    const newText = prompt('Ingrese el nuevo texto:', element.text);
    if (newText !== null && newText.trim() !== '') {
      element.text = newText.trim();
      this.render();
    }
  }

  private getElementAtPosition(x: number, y: number): DiagramElement | null {
    // Itera en orden inverso para   seleccionar el elemento más "superior" en caso de superposición
    for (let i = this.diagramElements.length - 1; i >= 0; i--) {
      if (this.diagramElements[i].containsPoint(x, y)) {
        return this.diagramElements[i];
      }
    }
    return null; // Ningún elemento encontrado en esta posición
  }

  saveDiagramState(): string {
    const state = this.diagramElements.map((element) => {
      const baseData = {
        type: element.constructor.name, // Guarda el nombre de la clase para usar en la carga
        x: element.x,
        y: element.y,
        isSelected: element.isSelected,
        text: element.text,
      };

      if (element instanceof Actor || element instanceof ClassElement) {
        Object.assign(baseData, {
          width: element.width,
          height: element.height,
          lifeline: {
            x: element.lifeline.x,
            y: element.lifeline.y,
            length: element.lifeline.length,
          },
        });
      }

      if (element instanceof Arrow) {
        Object.assign(baseData, {
          endX: element.endX,
          dashed: element.dashed,
        });
      }

      if (element instanceof Loop || element instanceof Alt) {
        Object.assign(baseData, {
          width: element.width,
          height: element.height,
          // elements: element.elements.map(el => ({...})) // Aquí debes decidir cómo manejar elementos anidados
        });
      }

      return baseData;
    });

    // Emitir el estado actualizado a otros usuarios
    this.socketService.sendMessage('updateDiagram', state);

    return JSON.stringify(state);
  }

  loadDiagramState(diagramJSON: string): void {
    const elements = JSON.parse(diagramJSON);
    this.diagramElements = elements.map((el: any) => {
      let element: DiagramElement;
      switch (el.type) {
        case 'Actor':
          const actor = new Actor(el.x, el.y, el.text);
          actor.width = el.width;
          actor.height = el.height;
          actor.lifeline = new Lifeline(
            el.lifeline.x,
            el.lifeline.y,
            el.lifeline.length
          );
          element = actor;
          break;
        case 'ClassElement':
          const classElement = new ClassElement(
            el.x,
            el.y,
            el.width,
            el.height,
            el.text
          );
          classElement.lifeline = new Lifeline(
            el.lifeline.x,
            el.lifeline.y,
            el.lifeline.length
          );
          element = classElement;
          break;
        case 'Message':
          element = new Message(el.x, el.y, el.width, el.text);
          break;
        case 'Loop':
          const loop = new Loop(el.x, el.y, el.width, el.height);
          // Supongamos que elementos dentro de Loop se manejan de alguna manera aquí.
          element = loop;
          break;
        case 'Alt':
          const alt = new Alt(el.x, el.y, el.width, el.height);
          // Supongamos que elementos dentro de Alt se manejan de alguna manera aquí.
          element = alt;
          break;
        case 'RightArrow':
          element = new RightArrow(el.x, el.y, el.endX);
          break;
        case 'LeftArrow':
          element = new LeftArrow(el.x, el.y, el.endX);
          break;
        case 'RightArrowSync':
          element = new RightArrowSync(el.x, el.y, el.endX);
          break;
        case 'RightArrowRecursive':
          element = new RightArrowRecursive(el.x, el.y, el.endX);
          break;
        default:
          throw new Error(`Unsupported diagram element type: ${el.type}`);
      }
      element.isSelected = el.isSelected;
      return element;
    });

    this.render();
  }
}
