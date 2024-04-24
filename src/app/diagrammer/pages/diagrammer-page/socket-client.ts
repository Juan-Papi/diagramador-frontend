import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manager, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  public onConnectionChange: EventEmitter<string> = new EventEmitter();
  public onClientsUpdated: EventEmitter<string[]> = new EventEmitter();

  constructor() {
    const token = localStorage.getItem('token');
    console.log({ token });
    const manager = new Manager(`https://nest-diagramador-production.up.railway.app`, {
      path: '/socket.io/socket.io.js',
      extraHeaders: {
        token: `${token}`, // Assuming the backend expects a bearer token
      },
    });

    this.socket = manager.socket('/');
    this.listenForEvents();
    this.addListeners();
  }

  private listenForEvents(): void {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket Server!');
    });

    this.socket.on('updateDiagram', (data: any) => {
      console.log('Diagram update received:', data);
      // Aquí puedes agregar código para manejar la actualización del diagrama
    });
  }

  public sendMessage(event: string, data: any, diagramId: number): void {
    console.log({ data });
    this.socket.emit(event, { data, diagramId });
    // this.socket.on(event, )
  }

  public getMessage(event: string, diagramId: number): Observable<any> {
    this.socket.emit(event, diagramId);

    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });
  }

  public closeConnection(): void {
    this.socket.close();
  }

  private addListeners(): void {
    //TODO: #clients-ul
    this.socket.on('connect', () => {
      //console.log('Connected to WebSocket Server!');
      this.onConnectionChange.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket Server!');
      this.onConnectionChange.emit('disconnected');
    });

    this.socket.on('clients-updated', (clients: string[]) => {
      this.onClientsUpdated.emit(clients); // Emitir la lista de clientes directamente
    });
  }

  updateDiagram(data: { diagramId: number; content: any }): void {
    this.socket.emit('updateDiagram', data);
  }

  onDiagramUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('diagramUpdated', (data) => {
        observer.next(data);
      });
      return () => this.socket.off('diagramUpdated');
    });
  }
}
