const canvas = document.getElementById('actorCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

export class LifeLine {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  color: string;
  arrastrando: boolean;
  texto: string;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.ancho = 80;
    this.alto = 0;
    this.color = '#FFDD33';
    this.arrastrando = false;
    this.texto = 'object1';
  }

  drawActor(x: number, y: number) {
    ctx.beginPath();
    ctx.rect(x, y, 150, 70); //el 50 es el ancho y el 60 es el largo
    this.x = x;
    this.y = y;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';

    ctx.fillText(this.texto, x + 50, y + 20);
    ctx.closePath;

    for (let i = 0; i < 24; i++) {
      // Puedes ajustar el número de iteraciones según tus necesidades
      const yCoord = y + 70 + i * 7; //  y=115   Incrementa la coordenada y por 5 en cada iteración
      ctx.moveTo(x + 70, yCoord + 5); // x=100
      ctx.lineTo(x + 70, yCoord + 10);
      //actorCanvas.Aancho=40;
      // console.log('alto',(yCoord+10)-actorCanvas.Ay,'ancho',x);
      //console.log(x)
      this.alto = yCoord + 10 - this.y;
    }
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.closePath();
  }

  clearActor() {
    ctx.clearRect(this.x, this.y, this.ancho, this.ancho);
  }
}
