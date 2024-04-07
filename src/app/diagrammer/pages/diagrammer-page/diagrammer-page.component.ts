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

  private render(): void {
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

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.selectedElement = null;
    this.diagramElements.forEach((element) => {
      if (element.containsPoint(x, y)) {
        this.selectedElement = element;
        this.dragOffsetX = x - element.x; // Aquí se usa dragOffsetX
        this.dragOffsetY = y - element.y; // Aquí se usa dragOffsetY
        event.preventDefault(); // Evita que el evento se propague más (por ejemplo, evitar el arrastre de la imagen del navegador)
      }
    });

    // Asegúrate de establecer isDragging a true si un elemento fue seleccionado para arrastre
    if (this.selectedElement) {
      this.isDragging = true;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.selectedElement || !this.isDragging) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const newX = event.clientX - rect.left - this.dragOffsetX;
    const newY = event.clientY - rect.top - this.dragOffsetY;

    const dx = newX - this.selectedElement.x;
    const dy = newY - this.selectedElement.y;

    this.selectedElement.move(dx, dy);
    this.render();
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false; // Reinicia isDragging a false
      this.selectedElement = null; // Reinicia el elemento seleccionado
    }
  }
}
