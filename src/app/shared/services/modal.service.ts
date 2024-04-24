import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Diagram } from '../interfaces/diagram.interface';
import { DiagramsResponse } from 'src/app/home/interfaces/diagrams-response.interface';

export interface Project {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly baseUrl: string = environment.baseUrl;

  public showModal: boolean = false;
  public showLink: boolean = false;
  public showAlert: boolean = false;
  public isEditing: boolean = false;
  public diagram?: DiagramsResponse;

  private isEditingSubject = new Subject<boolean>();
  isEditing$ = this.isEditingSubject.asObservable();

  constructor(private http: HttpClient) {}

  createDiagram(name: string, description: string): Observable<Diagram> {
    const url = `${this.baseUrl}/diagram/create`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { name, description };

    return this.http.post<Diagram>(url, body, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getDiagram(id: number): Observable<DiagramsResponse> {
    const url = `${this.baseUrl}/diagram/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<DiagramsResponse>(url, { headers }).pipe(
      // tap((resp) => console.log(resp)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  showLinkToggle() {
    this.showLink = !this.showLink;
  }

  openAlert() {
    this.showAlert = true;
    this.closeAlert();
  }

  closeAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 1300);
  }

  openModalCreate() {
    this.showModal = true;
    this.isEditing = false;
    this.isEditingSubject.next(false);
  }

  openModalEdit(diagram: DiagramsResponse) {
    this.diagram = diagram;
    this.isEditingSubject.next(true);
    this.showModal = true;
    this.isEditing = true;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditing = false;
  }
}
