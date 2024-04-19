import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DiagramsResponse } from '../interfaces/diagrams-response.interface';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { DiagramUpdateParams } from 'src/app/shared/interfaces/diagram.interface';
import { Profile } from 'src/app/auth/interfaces/register-response.interface';
import { AddCollaboratorResponse } from '../interfaces/add-collaborator.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly baseUrl: string = environment.baseUrl;
  private projects?: DiagramsResponse[];
  private collaborations?: DiagramsResponse[];
  
  private projectsSubject = new Subject<DiagramsResponse[]>();
  projects$ = this.projectsSubject.asObservable();
  
  get proyectsList(): DiagramsResponse[] {
    return this.projects || [];
  }
  
  get collaborationsList(): DiagramsResponse[] {
    return this.collaborations || [];
  }

  setProyects(projects: DiagramsResponse[]) {
    this.projects = projects;
    this.projectsSubject.next(projects);
  }

  constructor(private http: HttpClient) {}

  // Obtener los proyectos del usuario actual
  getProyects(): Observable<DiagramsResponse[]> {
    const url = `${this.baseUrl}/diagram`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<DiagramsResponse[]>(url, { headers }).pipe(
      tap((diagrams) => (this.projects = diagrams)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  // Obtener los proyectos colaborativos
  getCollaborations(): Observable<DiagramsResponse[]> {
    const url = `${this.baseUrl}/diagram/collaborations`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<DiagramsResponse[]>(url, { headers }).pipe(
      tap((diagrams) => (this.collaborations = diagrams)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  // Valida el token para agregarse a un proyecto como colaborador
  validateToken(id: string): Observable<DiagramsResponse> {
    const url = `${this.baseUrl}/diagram/validateToken/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<AddCollaboratorResponse>(url, { headers }).pipe(
      // tap((res) => console.log(res)),
      map((resp) => {
        const diagram = resp.diagram;
        return diagram;
      }),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Actualizar el perfil del usuario
  uploadProfile(id: number, file: File, gender: string): Observable<Profile> {
    const url = `${this.baseUrl}/profile/upload-profile-image/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = new FormData();
    
    body.append('file', file);
    body.append('gender', gender);

    return this.http.patch<Profile>(url, body, { headers })
    .pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Actualizar un proyecto
  updateDiagram(params: DiagramUpdateParams): Observable<boolean> {
    const { id, name, description, data } = params;
    const url = `${this.baseUrl}/diagram/update/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { name, description, data };
    
    return this.http.patch<boolean>(url, body, { headers }).pipe(
      catchError((err) => {
        if (err.status === 200) {
          return of(true);
        }
        return of(false);
      })
    );
  }

  // Eliminar un proyecto
  deleteProyect(id: number): Observable<boolean> {
    const url = `${this.baseUrl}/diagram/delete/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<boolean>(url, { headers }).pipe(
      // tap((res) => console.log(res)),
      catchError((err) => {
        if (err.status === 200) {
          return of(true);
        }
        // return throwError(() => err);
        return of(false);
      })
    );
  }
  
  
  
}
