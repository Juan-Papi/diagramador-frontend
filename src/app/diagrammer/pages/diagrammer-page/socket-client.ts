import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Manager, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  public onConnectionChange: EventEmitter<string> = new EventEmitter();
  public onClientsUpdated: EventEmitter<string[]> = new EventEmitter();

  constructor() {
    const manager = new Manager('http://localhost:3000', {
      path: '/socket.io/',
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

  public sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  public getMessage(event: string): Observable<any> {
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
}
