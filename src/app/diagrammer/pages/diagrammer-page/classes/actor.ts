const canvas = document.getElementById('actorId') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

export class Aactor {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  color: string;
  arrastrando: boolean;
  conexion: any[];

  constructor() {
    this.x = 0;
    this.y = 0;
    this.ancho = 20;
    this.alto = 0;
    this.color = '#000000';
    this.arrastrando = false;
    this.conexion = [];
  }
  drawActor(x: number, y: number) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI); //100 50
    //probar si se puede obtener la direccion inicial
    this.x = x;
    this.y = y;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
    // Dibujar línea vertical para representar el cuerpo del actor
    //el torso y pierda
    ctx.beginPath();
    ctx.moveTo(x, y + 12); //100 62
    ctx.lineTo(x, y + 35); //100  85
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
    //sus manos
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 20); //90 70
    ctx.lineTo(x + 10, y + 20); //110 70
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
    // Dibujar las piernas
    ctx.beginPath();
    ctx.moveTo(x, y + 35); //100 85
    ctx.lineTo(x - 10, y + 50); //90 100
    ctx.moveTo(x, y + 35); //100 85
    ctx.lineTo(x + 10, y + 50); // 110  100
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();

    ctx.font = '10px Arial';
    ctx.fillText('texto', x - 10, y + 60); /// 90 110

    ctx.beginPath();

    for (let i = 0; i < 24; i++) {
      // Puedes ajustar el número de iteraciones según tus necesidades
      const yCoord = y + 65 + i * 7; //  y=115   Incrementa la coordenada y por 5 en cada iteración
      ctx.moveTo(x, yCoord + 5); // x=100
      ctx.lineTo(x, yCoord + 10);
      //actorCanvas.Aancho=40;
      // console.log('alto',(yCoord+10)-actorCanvas.Ay,'ancho',x);
      //console.log(x)
      this.alto = yCoord + 10 - this.y;
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }

  clearActor() {
    ctx.clearRect(this.x, this.y, this.ancho, this.ancho);
  }
}
