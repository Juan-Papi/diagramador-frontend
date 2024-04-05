export class DiagramElement {
  constructor(
    public x: number,
    public y: number,
    public imgSrc: string,
    public width: number,
    public height: number
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    let img = new Image();
    img.onload = () => {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    };
    img.src = this.imgSrc;
  }
}

export class Actor extends DiagramElement {
  // Puedes añadir métodos específicos para Actor aquí
}

export class UI extends DiagramElement {
  // Puedes añadir métodos específicos para Actor aquí
}

export class CC extends DiagramElement {
  // Puedes añadir métodos específicos para Actor aquí
}

export class CE extends DiagramElement {
  // Puedes añadir métodos específicos para Actor aquí
}

export class MsjSend extends DiagramElement {
  // Puedes añadir métodos específicos para Actor aquí
}

export class MsjResp extends DiagramElement {
  // Puedes añadir métodos específicos para Actor aquí
}

export class ControlFlowElement extends DiagramElement {
  children: DiagramElement[] = []; // Elementos dentro del loop o alt

  constructor(
    public override x: number,
    public override y: number,
    public override width: number,
    public override height: number,
    public type: 'loop' | 'alt',
    public condition: string = '' // Condición para 'alt'
  ) {
    super(x, y, '', width, height); // Llamada al constructor de DiagramElement
  }

  override draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx); // Si tienes implementada la lógica base de dibujo en DiagramElement

    // Dibujo del elemento
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    // Etiqueta para 'loop' o condición para 'alt'
    let label = this.type === 'loop' ? 'Loop' : `[ ${this.condition} ]`;
    ctx.font = '16px Arial';
    ctx.fillText(label, this.x + 5, this.y + 20);

    // Dibujo del manejador de redimensionamiento en la esquina inferior derecha
    ctx.fillStyle = 'blue'; // Color para identificar el manejador
    ctx.fillRect(this.x + this.width - 10, this.y + this.height - 10, 10, 10);
  }

  // Método para añadir elementos al bloque de control
  addElement(element: DiagramElement) {
    this.children.push(element);
    // Aquí podrías ajustar el tamaño de ControlFlowElement basado en los elementos que contiene
  }
}

export class TextBox extends DiagramElement {
  constructor(
    public override x: number,
    public override y: number,
    public override width: number,
    public override height: number,
    public text: string = 'Texto por defecto'
  ) {
    super(x, y, '', width, height); // Asume que DiagramElement toma estos parámetros
  }

  override draw(ctx: CanvasRenderingContext2D) {
    // Dibuja el cuadro de texto
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    // Dibuja el texto dentro del cuadro
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width
    );
  }
}
