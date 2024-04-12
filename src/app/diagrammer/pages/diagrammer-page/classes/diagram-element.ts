import { v4 as uuid } from 'uuid';

export class DiagramElement {
  x: number;
  y: number;
  isSelected: boolean;
  text: string = ''; // Añade esta línea

  constructor(x: number, y: number, text: string = '') {
    this.x = x;
    this.y = y;
    this.isSelected = false; // Indica si el elemento está seleccionado
    this.text = text; // Y establece el texto
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
  textYPosition: number; // Posición Y del texto "Actor"

  constructor(x: number, y: number, text: string = 'Actor') {
    super(x, y, text);
    this.width = 40; // Ancho estándar para el actor
    this.height = 60; // Altura estándar para el actor, sin contar la línea de vida
    this.textYPosition = this.y + 100; // Ajusta esto según sea necesario
    // Inicializa la línea de vida para que comience desde la posición Y del texto
    this.lifeline = new Lifeline(
      this.x + this.width / 2,
      this.textYPosition + 15,
      200
    );
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    // Cabeza
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + 10, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Cuerpo
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 20);
    ctx.lineTo(this.x + this.width / 2, this.y + 50); // Altura del cuerpo ajustada
    ctx.stroke();

    // Brazos
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y + 30); // Comienza más a la izquierda para brazo izquierdo
    ctx.lineTo(this.x + this.width - 5, this.y + 30); // Termina más a la derecha para brazo derecho
    ctx.stroke();

    // Piernas - Ajustar para mostrar abiertas
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 50); // Desde la base del cuerpo
    ctx.lineTo(this.x + 5, this.y + 80); // Pierna izquierda más a la izquierda
    ctx.moveTo(this.x + this.width / 2, this.y + 50); // Desde la base del cuerpo
    ctx.lineTo(this.x + this.width - 5, this.y + 80); // Pierna derecha más a la derecha
    ctx.stroke();

    // Texto "Actor" debajo del cuerpo
    // ctx.font = '16px Arial'; // Aumenta el tamaño del texto
    // ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x + this.width / 2, this.textYPosition); // Utiliza textYPosition

    // Línea de vida
    // Asegúrate de que la línea de vida también se mueva con el actor y el texto
    this.lifeline.x = this.x + this.width / 2; // Asegura que la línea de vida se mantenga centrada con el actor
    this.lifeline.y = this.textYPosition + 15; // Asegura que la línea de vida comience justo debajo del texto
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
    // Mueve la línea de vida junto con el actor
    this.lifeline.move(dx, dy);
    this.textYPosition += dy; // Asegúrate de mover también la posición Y del texto
  }
}

export class ClassElement extends DiagramElement {
  width: number;
  height: number;
  override text: string;
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

    // Dibuja el controlador de redimensionamiento en el extremo inferior de la línea de vida
    // Define un círculo en el extremo inferior de la línea de vida
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.length, 5, 0, Math.PI * 2);
    //ctx.fillStyle = 'red'; // Puedes elegir el color que prefieras
    ctx.fill(); // Rellena el círculo con el color seleccionado
  }

  isResizeControlClicked(x: number, y: number): boolean {
    // Comprueba si el punto (x, y) está dentro del círculo del controlador
    const distance = Math.sqrt(
      (x - this.x) ** 2 + (y - (this.y + this.length)) ** 2
    );
    return distance < 5; // Radio del círculo del controlador
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
  override text: string;

  // Estas propiedades almacenan las dimensiones calculadas del rectángulo de texto
  private rectWidth: number = 0;
  private rectHeight: number = 40; // La altura se mantiene constante
  private padding: number = 30;

  constructor(x: number, y: number, width: number, text: string) {
    super(x, y);
    this.width = width;
    this.text = text;
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.save(); // Guarda el estado actual del contexto
    ctx.font = '16px Arial';

    // Calcula el ancho del texto y ajusta las propiedades del rectángulo
    const textWidth = ctx.measureText(this.text).width;
    this.rectWidth = textWidth + this.padding * 2;

    // Ajusta la posición 'x' para centrar el rectángulo alrededor del punto inicial
    const rectX = this.x - this.rectWidth / 2;

    // Configura el color para el rectángulo y el texto
    ctx.fillStyle = '#808080'; // Gris para el texto
    ctx.strokeStyle = '#808080'; // Gris para el rectángulo

    ctx.beginPath();
    ctx.rect(
      rectX,
      this.y - this.rectHeight / 2,
      this.rectWidth,
      this.rectHeight
    );
    ctx.stroke();

    // Dibuja el texto centrado dentro del rectángulo
    ctx.fillText(this.text, this.x, this.y + 6);
    ctx.restore(); // Restablece el estado del contexto al estado guardado
  }

  override containsPoint(x: number, y: number): boolean {
    const rectX = this.x - this.rectWidth / 2;
    return (
      x >= rectX &&
      x <= rectX + this.rectWidth &&
      y >= this.y - this.rectHeight / 2 &&
      y <= this.y + this.rectHeight / 2
    );
  }

  override move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
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

  drawResizeHandle(ctx: CanvasRenderingContext2D): void {
    const size = 10; // Tamaño del cuadrito de redimensionamiento
    const x = this.x + this.width - size;
    const y = this.y + this.height - size;

    ctx.fillStyle = 'black'; // Color del cuadrito
    ctx.fillRect(x, y, size, size);
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    ctx.fillText('[Loop]', this.x + 5, this.y + 15); // Etiqueta para el loop
    this.drawResizeHandle(ctx);
    this.elements.forEach((element) => element.draw(ctx)); // Dibuja cada elemento contenido
  }

  isResizeClick(x: number, y: number): boolean {
    const size = 10;
    const resizeX = this.x + this.width - size;
    const resizeY = this.y + this.height - size;

    return (
      x >= resizeX && x <= resizeX + size && y >= resizeY && y <= resizeY + size
    );
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
    this.x += dx;
    this.y += dy;
    this.elements.forEach((element) => element.move(dx, dy));
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

  // Método nuevo para detectar si el cursor está cerca de un borde
  isNearEdge(x: number, y: number) {
    const edgeThreshold = 10; // La distancia máxima en píxeles del borde para considerarse "cerca"
    const nearLeftEdge = Math.abs(x - this.x) < edgeThreshold;
    const nearRightEdge = Math.abs(x - (this.x + this.width)) < edgeThreshold;
    const nearTopEdge = Math.abs(y - this.y) < edgeThreshold;
    const nearBottomEdge = Math.abs(y - (this.y + this.height)) < edgeThreshold;

    return { nearLeftEdge, nearRightEdge, nearTopEdge, nearBottomEdge };
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

  drawResizeHandle(ctx: CanvasRenderingContext2D): void {
    const size = 10; // Tamaño del cuadrito de redimensionamiento
    const x = this.x + this.width - size;
    const y = this.y + this.height - size;

    ctx.fillStyle = 'black'; // Color del cuadrito
    ctx.fillRect(x, y, size, size);
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    ctx.fillText('[Alt]', this.x + 5, this.y + 15); // Etiqueta para el loop
    this.drawResizeHandle(ctx);
    this.elements.forEach((element) => element.draw(ctx)); // Dibuja cada elemento contenido
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
    this.x += dx;
    this.y += dy;
    this.elements.forEach((element) => element.move(dx, dy));
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

  // Método nuevo para detectar si el cursor está cerca de un borde
  isNearEdge(x: number, y: number) {
    const edgeThreshold = 10; // Define cuán cerca debe estar el cursor al borde para considerarse "cerca"
    const nearLeftEdge = Math.abs(x - this.x) < edgeThreshold;
    const nearRightEdge = Math.abs(x - (this.x + this.width)) < edgeThreshold;
    const nearTopEdge = Math.abs(y - this.y) < edgeThreshold;
    const nearBottomEdge = Math.abs(y - (this.y + this.height)) < edgeThreshold;

    return { nearLeftEdge, nearRightEdge, nearTopEdge, nearBottomEdge };
  }
}

export abstract class Arrow extends DiagramElement {
  endX: number;
  override text: string;
  dashed: boolean;

  constructor(
    x: number,
    y: number,
    endX: number,
    text: string = 'Mensaje',
    dashed: boolean = false
  ) {
    super(x, y);
    this.endX = endX;
    this.text = text;
    this.dashed = dashed;
  }

  isNearEnds(x: number, y: number): 'start' | 'end' | null {
    const threshold = 10; // Sensibilidad para detectar clics cerca de los extremos
    if (Math.abs(x - this.x) < threshold && Math.abs(y - this.y) < threshold) {
      return 'start';
    } else if (
      Math.abs(x - this.endX) < threshold &&
      Math.abs(y - this.y) < threshold
    ) {
      return 'end';
    }
    return null;
  }
  override draw(ctx: CanvasRenderingContext2D): void {
    if (this.dashed) {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.endX, this.y);
    ctx.stroke();

    this.drawArrowHead(ctx); // Ensure this method is called

    ctx.fillText(this.text, (this.x + this.endX) / 2, this.y - 10);
    ctx.setLineDash([]); // Always reset dash to solid after drawing
  }

  // Default implementation: should be overridden in subclasses
  drawArrowHead(ctx: CanvasRenderingContext2D): void {
    throw new Error('DrawArrowHead method not implemented');
  }

  override containsPoint(x: number, y: number): boolean {
    return (
      y >= this.y - 10 &&
      y <= this.y + 10 &&
      x >= Math.min(this.x, this.endX) &&
      x <= Math.max(this.x, this.endX)
    );
  }

  override move(dx: number, dy: number): void {
    this.x += dx;
    this.endX += dx;
    this.y += dy;
  }

  override resize(dx: number): void {
    this.endX += dx;
  }
}

export class RightArrow extends Arrow {
  override drawArrowHead(ctx: CanvasRenderingContext2D): void {
    // Dibuja cabeza de flecha hacia la derecha
    const headLength = 10; // Longitud de la punta de la flecha
    const angle = Math.atan2(0, this.endX - this.x);

    ctx.lineTo(
      this.endX - headLength * Math.cos(angle - Math.PI / 6),
      this.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(this.endX, this.y);
    ctx.lineTo(
      this.endX - headLength * Math.cos(angle + Math.PI / 6),
      this.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }
}

export class LeftArrow extends Arrow {
  constructor(x: number, y: number, endX: number, text: string = 'Respuesta') {
    super(x, y, endX, text, true); // true para hacerla punteada
  }

  override drawArrowHead(ctx: CanvasRenderingContext2D): void {
    const headLength = 25; // Longitud de la punta de la flecha ajustada para mayor visibilidad

    // Calcula la dirección de la línea
    const angle = Math.atan2(this.y - this.y, this.endX - this.x);

    // Ajusta los ángulos para hacer la cabeza de la flecha un poco más cerrada
    const headAngle1 = angle + Math.PI / 8;
    const headAngle2 = angle - Math.PI / 8;
    const headPoint1X = this.endX - headLength * Math.cos(headAngle1);
    const headPoint1Y = this.y - headLength * Math.sin(headAngle1);
    const headPoint2X = this.endX - headLength * Math.cos(headAngle2);
    const headPoint2Y = this.y - headLength * Math.sin(headAngle2);

    // Configura el grosor de la línea para la cabeza de la flecha
    //ctx.lineWidth = 2; // Aumenta el grosor de la línea

    // Dibuja la cabeza de la flecha
    ctx.beginPath();
    ctx.moveTo(this.endX, this.y); // Empieza en la posición final de la línea
    ctx.lineTo(headPoint1X, headPoint1Y); // Dibuja la primera línea de la cabeza
    ctx.moveTo(this.endX, this.y); // Vuelve al punto de inicio para la segunda línea
    ctx.lineTo(headPoint2X, headPoint2Y); // Dibuja la segunda línea de la cabeza
    ctx.stroke(); // Dibuja el contorno de la cabeza de la flecha sin cerrar el triángulo
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    // Configura el estilo para la línea punteada y el grosor
    if (this.dashed) {
      ctx.setLineDash([5, 5]);
    }
    ctx.lineWidth = 1.5; // Configura un grosor ligeramente mayor para la línea principal

    // Dibuja la línea de la flecha
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.endX, this.y);
    ctx.stroke();

    // Restablece el estilo de línea para futuros dibujos
    ctx.setLineDash([]);

    // Dibuja el texto sobre la línea
    ctx.fillText(this.text, (this.x + this.endX) / 2, this.y - 10);

    // Llama a drawArrowHead para dibujar la cabeza de la flecha
    this.drawArrowHead(ctx);
  }
}

export class RightArrowSync extends Arrow {
  override drawArrowHead(ctx: CanvasRenderingContext2D): void {
    // Dibuja la cabeza de la flecha hacia la derecha y llena
    const headLength = 20; // Longitud de la punta de la flecha aumentada para hacerla más grande
    const angle = Math.atan2(0, this.endX - this.x); // Ángulo de la flecha

    // Inicia la cabeza de la flecha
    ctx.beginPath();
    ctx.moveTo(this.endX, this.y); // Mueve el punto de inicio al final de la línea de la flecha

    // Primera línea de la cabeza de la flecha
    ctx.lineTo(
      this.endX - headLength * Math.cos(angle - Math.PI / 6),
      this.y - headLength * Math.sin(angle - Math.PI / 6)
    );

    // Segunda línea de la cabeza de la flecha
    ctx.lineTo(
      this.endX - headLength * Math.cos(angle + Math.PI / 6),
      this.y - headLength * Math.sin(angle + Math.PI / 6)
    );

    // Conecta de nuevo al final de la flecha para cerrar la forma
    ctx.closePath(); // Cierra el camino trazado para formar una forma sólida

    // Rellena la cabeza de la flecha
    ctx.fill(); // Usa fill() para rellenar la forma
  }
}

export class RightArrowRecursive extends Arrow {
  headLength = 15; // Longitud de la punta de la flecha

  override drawArrowHead(ctx: CanvasRenderingContext2D): void {
    // Altura desde el centro de la base hasta la punta del triángulo isósceles
    const triangleHeight = (this.headLength * Math.sqrt(3)) / 2;

    // El centro de la base del triángulo estará al final de la línea vertical
    const baseCenterX = this.x - 9; // Movemos la base del triángulo un poco hacia la izquierda
    const baseCenterY = this.y + triangleHeight + 2;

    // Dibuja la cabeza de la flecha llena como un triángulo isósceles
    ctx.beginPath();

    // Inicia en el vértice superior del triángulo (punta de la flecha)
    ctx.moveTo(baseCenterX, baseCenterY + triangleHeight);
    // Dibuja los vértices inferiores del triángulo (base)
    ctx.lineTo(baseCenterX + this.headLength / 2, baseCenterY);
    ctx.lineTo(baseCenterX + this.headLength / 2, baseCenterY + 25);

    ctx.closePath(); // Cierra el triángulo
    ctx.fill(); // Rellena la cabeza de la flecha
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    const halfLength = (this.endX - this.x) / 2;
    const verticalLength = (this.headLength * Math.sqrt(3)) / 2; // Longitud de la línea vertical ajustada para la cabeza de la flecha

    // Dibuja la línea horizontal desde el inicio hasta el punto medio
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + halfLength, this.y);
    ctx.stroke();

    // Dibuja la línea vertical hacia abajo desde el punto medio, ajustada para la cabeza de la flecha
    ctx.beginPath();
    ctx.moveTo(this.x + halfLength, this.y);
    ctx.lineTo(this.x + halfLength, this.y + verticalLength + this.headLength);
    ctx.stroke();

    // Dibuja la línea horizontal de regreso al inicio
    ctx.beginPath();
    ctx.moveTo(this.x + halfLength, this.y + verticalLength + this.headLength);
    ctx.lineTo(this.x, this.y + verticalLength + this.headLength);
    ctx.stroke();

    // Dibuja la cabeza de la flecha en el extremo inferior de la línea vertical
    this.drawArrowHead(ctx);

    // Dibuja el texto, si es necesario
    if (this.text) {
      ctx.fillText(this.text, this.x + halfLength / 2, this.y - 10); // Centrado sobre la primera mitad de la línea horizontal
    }
  }
}
