export class DiagramElement {
  x: number;
  y: number;
  isSelected: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isSelected = false; // Indica si el elemento está seleccionado
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Implementación específica en subclases
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  resize(newWidth: number, newHeight: number): void {
    // Implementado en subclases si es necesario
  }

  containsPoint(x: number, y: number): boolean {
    return false; // La implementación base no puede determinar esto
  }
}

export class Actor extends DiagramElement {
  width: number;
  height: number;
  lifeline: Lifeline;

  constructor(x: number, y: number) {
    super(x, y);
    this.width = 40; // Ancho estándar para el actor
    this.height = 60; // Altura estándar para el actor, sin contar la línea de vida
    this.lifeline = new Lifeline(x + this.width / 2, y + this.height, 200); // Línea de vida inicial
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    // Cabeza
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + 10, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Cuerpo
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 20);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height);
    ctx.stroke();

    // Línea de vida
    this.lifeline.draw(ctx);
  }

  override containsPoint(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  override move(dx: number, dy: number): void {
    super.move(dx, dy);
    // Asegura que la lifeline se mueva junto con el actor
    this.lifeline.move(dx, dy);
  }
}

export class ClassElement extends DiagramElement {
  width: number;
  height: number;
  text: string;
  lifeline: Lifeline;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.text = text;
    this.lifeline = new Lifeline(x + width / 2, y + height, 200); // Línea de vida inicial
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    // Cuadro
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    // Texto
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

    // Línea de vida
    this.lifeline.draw(ctx);
  }

  override containsPoint(x: number, y: number): boolean {
    // Verifica si el punto está dentro de los límites del rectángulo de la clase
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  override move(dx: number, dy: number): void {
    super.move(dx, dy);
    // Asegura que la lifeline se mueva junto con la clase
    this.lifeline.move(dx, dy);
  }
}

export class Lifeline extends DiagramElement {
  length: number;

  constructor(x: number, y: number, length: number) {
    super(x, y);
    this.length = length;
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.setLineDash([5, 5]); // Línea punteada
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  override resize(newLength: number): void {
    this.length = newLength;
  }

  override containsPoint(x: number, y: number): boolean {
    // Considera un pequeño margen alrededor de la línea para facilitar la selección
    const margin = 5;
    return (
      x >= this.x - margin &&
      x <= this.x + margin &&
      y >= this.y &&
      y <= this.y + this.length
    );
  }

  // Ya implementado en DiagramElement, pero aquí para referencia
  override move(dx: number, dy: number): void {
    this.x += dx;
    // Para Lifeline, probablemente solo necesites mover en el eje Y
    this.y += dy;
  }
}

export class Message extends DiagramElement {
  width: number;
  text: string;

  constructor(x: number, y: number, width: number, text: string) {
    super(x, y);
    this.width = width;
    this.text = text;
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    // Línea
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.stroke();

    // Texto
    ctx.fillText(this.text, this.x, this.y - 5);
  }
}

export class Loop extends DiagramElement {
  width: number;
  height: number;
  elements: DiagramElement[];

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.elements = []; // Elementos contenidos dentro del Loop
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    ctx.fillText('Loop', this.x + 5, this.y + 15); // Etiqueta para el loop

    this.elements.forEach((element) => element.draw(ctx)); // Dibuja cada elemento contenido
  }

  addElement(element: DiagramElement): void {
    this.elements.push(element);
    // Aquí podrías incluir lógica para ajustar el tamaño del loop basado en los elementos contenidos
  }

  override resize(newWidth: number, newHeight: number): void {
    this.width = newWidth;
    this.height = newHeight;
    // Opcional: Ajustar la posición y tamaño de los elementos contenidos
  }
}

export class Alt extends DiagramElement {
  width: number;
  height: number;
  elements: DiagramElement[];

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.elements = []; // Elementos contenidos dentro del Alt
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    ctx.fillText('Alt', this.x + 5, this.y + 15); // Etiqueta para el Alt

    this.elements.forEach((element) => element.draw(ctx)); // Dibuja cada elemento contenido
  }

  addElement(element: DiagramElement): void {
    this.elements.push(element);
    // Lógica para ajustar el tamaño del Alt si es necesario
  }

  override resize(newWidth: number, newHeight: number): void {
    this.width = newWidth;
    this.height = newHeight;
    // Opcional: Ajustar la posición y tamaño de los elementos contenidos
  }
}
